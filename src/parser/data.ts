import { VBODataRow, ParserOptions, VBOParserError } from '../types';
import { convertCoordinate, parseSatelliteInfo, parseTime, parseInputChannel, splitLine } from './utils';

export class DataParser {
  private columnNames: string[];
  private options: Required<ParserOptions>;

  constructor(columnNames: string[], options: ParserOptions = {}) {
    this.columnNames = columnNames;
    this.options = {
      convertCoordinates: options.convertCoordinates ?? true,
      rawData: options.rawData ?? false,
    };
  }

  /**
   * Parses a single data row from the VBO file
   * @param line Raw data line from the file
   * @returns Parsed data row
   */
  public parseRow(line: string): VBODataRow {
    const values = splitLine(line);
    
    if (values.length !== this.columnNames.length) {
      throw new VBOParserError(
        `Data row has ${values.length} columns but expected ${this.columnNames.length}`,
        'data'
      );
    }

    const row: VBODataRow = {
      satellites: { count: 0, hasDGPS: false, brakeTrigger: false },
      time: '',
      latitude: 0,
      longitude: 0,
      velocity: 0,
      heading: 0,
      height: 0,
      verticalVelocity: 0,
      triggerEventTime: 0,
    };

    for (let i = 0; i < this.columnNames.length; i++) {
      const columnName = this.columnNames[i].toLowerCase();
      const value = values[i];

      switch (columnName) {
        case 'sats':
          const satInfo = parseSatelliteInfo(parseInt(value));
          row.satellites = satInfo;
          break;

        case 'time':
          row.time = this.options.rawData ? value : parseTime(value);
          break;

        case 'lat':
          if (this.options.convertCoordinates) {
            row.latitude = convertCoordinate(value.slice(1), value.startsWith('+'));
          } else {
            row.latitude = parseFloat(value);
          }
          break;

        case 'long':
          if (this.options.convertCoordinates) {
            row.longitude = convertCoordinate(value.slice(1), value.startsWith('+'));
          } else {
            row.longitude = parseFloat(value);
          }
          break;

        case 'velocity':
          row.velocity = this.options.rawData ? value : parseFloat(value);
          break;

        case 'heading':
          row.heading = this.options.rawData ? value : parseFloat(value);
          break;

        case 'height':
          row.height = this.options.rawData ? value : parseFloat(value);
          break;

        case 'vertvel':
          row.verticalVelocity = this.options.rawData ? value : parseFloat(value);
          break;

        case 'event1':
          row.triggerEventTime = this.options.rawData ? value : parseInt(value);
          break;

        default:
          // Handle additional input channels
          if (value.includes('E')) {
            row[columnName] = this.options.rawData ? value : parseInputChannel(value);
          } else {
            row[columnName] = this.options.rawData ? value : parseFloat(value);
          }
      }
    }

    return row;
  }

  /**
   * Parses multiple data rows from the VBO file
   * @param content Raw data content from the file
   * @returns Array of parsed data rows
   */
  public parseData(content: string): VBODataRow[] {
    const lines = content.split('\n');
    const data: VBODataRow[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('[')) {
        try {
          const row = this.parseRow(trimmedLine);
          data.push(row);
        } catch (error) {
          if (error instanceof VBOParserError) {
            throw error;
          }
          // Skip malformed rows in production, but log them
          console.warn('Skipping malformed data row:', trimmedLine);
        }
      }
    }

    return data;
  }
}
