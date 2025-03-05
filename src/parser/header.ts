import { VBOHeader, VBOParserError, LapTimingPoint } from '../types';
import { parseCreationDate, extractValue, isEmptyLine, convertCoordinate } from './utils';

export class HeaderParser {
  private lines: string[];
  private currentIndex: number = 0;

  constructor(headerContent: string) {
    this.lines = headerContent.split('\n');
  }

  /**
   * Parses the complete header section of a VBO file
   * @returns Parsed header information
   */
  public parse(): VBOHeader {
    const header: VBOHeader = {
      creationDate: new Date(),
      vboxInfo: {
        version: '',
        gpsType: '',
        serialNumber: '',
        cfVersion: '',
        logRate: 0,
        softwareVersion: undefined,
      },
      columnNames: [],
      channelUnits: [],
      comments: [],
      securityCode: undefined,
      lapTiming: [],
    };

    while (this.currentIndex < this.lines.length) {
      const line = this.lines[this.currentIndex].trim();
      
      if (line.startsWith('File created on')) {
        header.creationDate = parseCreationDate(line);
      } else if (line === '[header]') {
        this.parseHeaderSection(header);
      } else if (line === '[channel units]') {
        header.channelUnits = this.parseChannelUnits();
      } else if (line === '[comments]') {
        this.parseComments(header);
      } else if (line === '[column names]') {
        header.columnNames = this.parseColumnNames();
      } else if (line === '[laptiming]') {
        header.lapTiming = this.parseLapTiming();
      }

      this.currentIndex++;
    }

    this.validateHeader(header);
    return header;
  }

  /**
   * Parses the laptiming section of the VBO file
   * @returns Array of lap timing points
   */
  private parseLapTiming(): LapTimingPoint[] {
    this.currentIndex++; // Skip [laptiming] line
    const lapTimingPoints: LapTimingPoint[] = [];

    while (this.currentIndex < this.lines.length) {
      const line = this.lines[this.currentIndex].trim();
      if (isEmptyLine(line) || line.startsWith('[')) break;

      // Parse the lap timing line
      // Format: Label +LatStart +LngStart +LatEnd +LngEnd ¬ Description
      const parts = line.split(/\s+/);
      
      if (parts.length >= 5) {
        const label = parts[0];
        
        // Extract coordinates
        const latStart = parts[1];
        const lngStart = parts[2];
        const latEnd = parts[3];
        const lngEnd = parts[4];
        
        // Extract description (everything after the coordinates)
        let description = '';
        if (parts.length > 5) {
          // Join all remaining parts, skipping any special characters like ¬
          description = parts.slice(5).join(' ').replace(/[¬]/g, '').trim();
        }

        // Create lap timing point
        const lapTimingPoint: LapTimingPoint = {
          label,
          startCoordinates: {
            latitude: convertCoordinate(latStart.slice(1), latStart.startsWith('+'), true),
            longitude: convertCoordinate(lngStart.slice(1), !lngStart.startsWith('+'), false),
          },
          endCoordinates: {
            latitude: convertCoordinate(latEnd.slice(1), latEnd.startsWith('+'), true),
            longitude: convertCoordinate(lngEnd.slice(1), !lngEnd.startsWith('+'), false),
          },
          description: description || undefined,
        };

        lapTimingPoints.push(lapTimingPoint);
      }

      this.currentIndex++;
    }

    return lapTimingPoints;
  }

  private parseHeaderSection(header: VBOHeader): void {
    this.currentIndex++; // Skip [header] line
    const headerLines: string[] = [];
    
    while (this.currentIndex < this.lines.length) {
      const line = this.lines[this.currentIndex].trim();
      if (isEmptyLine(line) || line.startsWith('[')) break;
      headerLines.push(line);
      this.currentIndex++;
    }

    header.columnNames = headerLines;
  }

  private parseChannelUnits(): string[] {
    this.currentIndex++; // Skip [channel units] line
    const units: string[] = [];

    while (this.currentIndex < this.lines.length) {
      const line = this.lines[this.currentIndex].trim();
      if (isEmptyLine(line) || line.startsWith('[')) break;
      units.push(line);
      this.currentIndex++;
    }

    return units;
  }

  private parseComments(header: VBOHeader): void {
    this.currentIndex++; // Skip [comments] line
    
    while (this.currentIndex < this.lines.length) {
      const line = this.lines[this.currentIndex].trim();
      if (isEmptyLine(line) || line.startsWith('[')) break;

      if (line.startsWith('VBox')) {
        header.vboxInfo.version = extractValue(line, /Version\s+(.+)/) || '';
      } else if (line.startsWith('GPS')) {
        header.vboxInfo.gpsType = extractValue(line, /GPS\s*:\s*(.+)/) || '';
      } else if (line.startsWith('Serial Number')) {
        header.vboxInfo.serialNumber = extractValue(line, /Serial Number\s*:\s*(.+)/) || '';
      } else if (line.startsWith('CF Version')) {
        header.vboxInfo.cfVersion = extractValue(line, /CF Version\s+(.+)/) || '';
      } else if (line.startsWith('Log Rate')) {
        const rate = extractValue(line, /Log Rate \(Hz\)\s*:\s*(.+)/);
        header.vboxInfo.logRate = rate ? parseFloat(rate) : 0;
      } else if (line.startsWith('Software Version')) {
        const softwareVersion = extractValue(line, /Software Version\s*:\s*(.+)/);
        header.vboxInfo.softwareVersion = softwareVersion || undefined;
      } else if (line.startsWith('Security Code')) {
        header.securityCode = line.split(':')[1].trim();
      } else {
        header.comments.push(line);
      }

      this.currentIndex++;
    }
  }

  private parseColumnNames(): string[] {
    this.currentIndex++; // Skip [column names] line
    const line = this.lines[this.currentIndex].trim();
    return line.split(/\s+/);
  }

  private validateHeader(header: VBOHeader): void {
    if (!header.columnNames.length) {
      throw new VBOParserError('Missing column names in header', 'header');
    }
  }
}
