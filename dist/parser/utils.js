"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractValue = exports.isEmptyLine = exports.splitLine = exports.parseCreationDate = exports.parseInputChannel = exports.parseTime = exports.parseSatelliteInfo = exports.convertCoordinate = void 0;
/**
 * Converts VBOX latitude/longitude format (MMMMM.MMMMM) to decimal degrees
 * @param coordinate Coordinate in VBOX format (e.g., "03119.09973")
 * @param isPositive Whether the coordinate is positive (North/West)
 * @returns Coordinate in decimal degrees
 */
function convertCoordinate(coordinate, isPositive) {
    const absValue = Math.abs(parseFloat(coordinate));
    const degrees = Math.floor(absValue / 60);
    const minutes = absValue % 60;
    const decimalDegrees = degrees + (minutes / 60);
    return isPositive ? decimalDegrees : -decimalDegrees;
}
exports.convertCoordinate = convertCoordinate;
/**
 * Parses satellite information from VBOX format
 * @param value Satellite value from VBO file
 * @returns Parsed satellite information
 */
function parseSatelliteInfo(value) {
    return {
        count: value & 63,
        brakeTrigger: (value & 64) === 64,
        hasDGPS: (value & 128) === 128, // Bit 8 (128) indicates DGPS correction
    };
}
exports.parseSatelliteInfo = parseSatelliteInfo;
/**
 * Parses a time string from VBOX format (HHMMSS.SS) to standard format (HH:MM:SS.SS)
 * @param time Time string from VBO file
 * @returns Formatted time string
 */
function parseTime(time) {
    const match = time.match(/(\d{2})(\d{2})(\d{2}\.\d+)/);
    if (!match) {
        throw new Error('Invalid time format');
    }
    return `${match[1]}:${match[2]}:${match[3]}`;
}
exports.parseTime = parseTime;
/**
 * Parses an input channel value in exponential format
 * @param value Input channel value (e.g., "+1.23456E+02")
 * @returns Parsed number
 */
function parseInputChannel(value) {
    return parseFloat(value);
}
exports.parseInputChannel = parseInputChannel;
/**
 * Extracts the creation date from the VBO file header
 * Supports formats:
 * - DD/MM/YYYY at HH:mm:ss
 * - YYYYMMDD-HHMMSS
 * @param line Header line containing the date
 * @returns Date object
 */
function parseCreationDate(line) {
    // Try standard format (DD/MM/YYYY at HH:mm:ss)
    let match = line.match(/(\d{2})\/(\d{2})\/(\d{4})\s+at\s+(\d{2}):(\d{2}):(\d{2})/);
    if (match) {
        const [, day, month, year, hours, minutes, seconds] = match;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds));
    }
    // Try new format (YYYYMMDD-HHMMSS)
    match = line.match(/(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})/);
    if (match) {
        const [, year, month, day, hours, minutes, seconds] = match;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds));
    }
    throw new Error('Invalid creation date format. Expected DD/MM/YYYY at HH:mm:ss or YYYYMMDD-HHMMSS');
}
exports.parseCreationDate = parseCreationDate;
/**
 * Splits a line into columns while handling quoted values
 * @param line Data line from VBO file
 * @returns Array of column values
 */
function splitLine(line) {
    return line.trim().split(/\s+/);
}
exports.splitLine = splitLine;
/**
 * Checks if a line is empty or contains only whitespace
 * @param line Line to check
 * @returns True if line is empty
 */
function isEmptyLine(line) {
    return line.trim().length === 0;
}
exports.isEmptyLine = isEmptyLine;
/**
 * Extracts a value from a line that matches a specific pattern
 * @param line Line to parse
 * @param pattern Pattern to match
 * @returns Extracted value or null if no match
 */
function extractValue(line, pattern) {
    const match = line.match(pattern);
    return match ? match[1] : null;
}
exports.extractValue = extractValue;
