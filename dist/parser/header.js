"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderParser = void 0;
const types_1 = require("../types");
const utils_1 = require("./utils");
class HeaderParser {
    constructor(headerContent) {
        this.currentIndex = 0;
        this.lines = headerContent.split('\n');
    }
    /**
     * Parses the complete header section of a VBO file
     * @returns Parsed header information
     */
    parse() {
        const header = {
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
                header.creationDate = (0, utils_1.parseCreationDate)(line);
            }
            else if (line === '[header]') {
                this.parseHeaderSection(header);
            }
            else if (line === '[channel units]') {
                header.channelUnits = this.parseChannelUnits();
            }
            else if (line === '[comments]') {
                this.parseComments(header);
            }
            else if (line === '[column names]') {
                header.columnNames = this.parseColumnNames();
            }
            else if (line === '[laptiming]') {
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
    parseLapTiming() {
        this.currentIndex++; // Skip [laptiming] line
        const lapTimingPoints = [];
        while (this.currentIndex < this.lines.length) {
            const line = this.lines[this.currentIndex].trim();
            if ((0, utils_1.isEmptyLine)(line) || line.startsWith('['))
                break;
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
                const lapTimingPoint = {
                    label,
                    startCoordinates: {
                        latitude: (0, utils_1.convertCoordinate)(latStart.slice(1), latStart.startsWith('+'), true),
                        longitude: (0, utils_1.convertCoordinate)(lngStart.slice(1), !lngStart.startsWith('+'), false),
                    },
                    endCoordinates: {
                        latitude: (0, utils_1.convertCoordinate)(latEnd.slice(1), latEnd.startsWith('+'), true),
                        longitude: (0, utils_1.convertCoordinate)(lngEnd.slice(1), !lngEnd.startsWith('+'), false),
                    },
                    description: description || undefined,
                };
                lapTimingPoints.push(lapTimingPoint);
            }
            this.currentIndex++;
        }
        return lapTimingPoints;
    }
    parseHeaderSection(header) {
        this.currentIndex++; // Skip [header] line
        const headerLines = [];
        while (this.currentIndex < this.lines.length) {
            const line = this.lines[this.currentIndex].trim();
            if ((0, utils_1.isEmptyLine)(line) || line.startsWith('['))
                break;
            headerLines.push(line);
            this.currentIndex++;
        }
        header.columnNames = headerLines;
    }
    parseChannelUnits() {
        this.currentIndex++; // Skip [channel units] line
        const units = [];
        while (this.currentIndex < this.lines.length) {
            const line = this.lines[this.currentIndex].trim();
            if ((0, utils_1.isEmptyLine)(line) || line.startsWith('['))
                break;
            units.push(line);
            this.currentIndex++;
        }
        return units;
    }
    parseComments(header) {
        this.currentIndex++; // Skip [comments] line
        while (this.currentIndex < this.lines.length) {
            const line = this.lines[this.currentIndex].trim();
            if ((0, utils_1.isEmptyLine)(line) || line.startsWith('['))
                break;
            if (line.startsWith('VBox')) {
                header.vboxInfo.version = (0, utils_1.extractValue)(line, /Version\s+(.+)/) || '';
            }
            else if (line.startsWith('GPS')) {
                header.vboxInfo.gpsType = (0, utils_1.extractValue)(line, /GPS\s*:\s*(.+)/) || '';
            }
            else if (line.startsWith('Serial Number')) {
                header.vboxInfo.serialNumber = (0, utils_1.extractValue)(line, /Serial Number\s*:\s*(.+)/) || '';
            }
            else if (line.startsWith('CF Version')) {
                header.vboxInfo.cfVersion = (0, utils_1.extractValue)(line, /CF Version\s+(.+)/) || '';
            }
            else if (line.startsWith('Log Rate')) {
                const rate = (0, utils_1.extractValue)(line, /Log Rate \(Hz\)\s*:\s*(.+)/);
                header.vboxInfo.logRate = rate ? parseFloat(rate) : 0;
            }
            else if (line.startsWith('Software Version')) {
                const softwareVersion = (0, utils_1.extractValue)(line, /Software Version\s*:\s*(.+)/);
                header.vboxInfo.softwareVersion = softwareVersion || undefined;
            }
            else if (line.startsWith('Security Code')) {
                header.securityCode = line.split(':')[1].trim();
            }
            else {
                header.comments.push(line);
            }
            this.currentIndex++;
        }
    }
    parseColumnNames() {
        this.currentIndex++; // Skip [column names] line
        const line = this.lines[this.currentIndex].trim();
        return line.split(/\s+/);
    }
    validateHeader(header) {
        if (!header.columnNames.length) {
            throw new types_1.VBOParserError('Missing column names in header', 'header');
        }
    }
}
exports.HeaderParser = HeaderParser;
