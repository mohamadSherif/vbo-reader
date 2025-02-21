"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataParser = void 0;
const types_1 = require("../types");
const utils_1 = require("./utils");
class DataParser {
    constructor(columnNames, options = {}) {
        var _a, _b;
        this.columnNames = columnNames;
        this.options = {
            convertCoordinates: (_a = options.convertCoordinates) !== null && _a !== void 0 ? _a : true,
            rawData: (_b = options.rawData) !== null && _b !== void 0 ? _b : false,
        };
    }
    /**
     * Parses a single data row from the VBO file
     * @param line Raw data line from the file
     * @returns Parsed data row
     */
    parseRow(line) {
        const values = (0, utils_1.splitLine)(line);
        if (values.length !== this.columnNames.length) {
            throw new types_1.VBOParserError(`Data row has ${values.length} columns but expected ${this.columnNames.length}`, 'data');
        }
        const row = {
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
                    const satInfo = (0, utils_1.parseSatelliteInfo)(parseInt(value));
                    row.satellites = satInfo;
                    break;
                case 'time':
                    row.time = this.options.rawData ? value : (0, utils_1.parseTime)(value);
                    break;
                case 'lat':
                    if (this.options.convertCoordinates) {
                        row.latitude = (0, utils_1.convertCoordinate)(value.slice(1), value.startsWith('+'), true);
                    }
                    else {
                        row.latitude = parseFloat(value);
                    }
                    break;
                case 'long':
                    if (this.options.convertCoordinates) {
                        row.longitude = (0, utils_1.convertCoordinate)(value.slice(1), value.startsWith('+'), false);
                    }
                    else {
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
                        row[columnName] = this.options.rawData ? value : (0, utils_1.parseInputChannel)(value);
                    }
                    else {
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
    parseData(content) {
        const lines = content.split('\n');
        const data = [];
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('[')) {
                try {
                    const row = this.parseRow(trimmedLine);
                    data.push(row);
                }
                catch (error) {
                    if (error instanceof types_1.VBOParserError) {
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
exports.DataParser = DataParser;
