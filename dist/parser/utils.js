"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertCoordinate = convertCoordinate;
exports.parseSatelliteInfo = parseSatelliteInfo;
exports.parseTime = parseTime;
exports.parseInputChannel = parseInputChannel;
exports.parseCreationDate = parseCreationDate;
exports.splitLine = splitLine;
exports.isEmptyLine = isEmptyLine;
exports.extractValue = extractValue;
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
/**
 * Parses satellite information from VBOX format
 * @param value Satellite value from VBO file
 * @returns Parsed satellite information
 */
function parseSatelliteInfo(value) {
    return {
        count: value & 63, // Base satellite count (0-63)
        brakeTrigger: (value & 64) === 64, // Bit 7 (64) indicates brake trigger
        hasDGPS: (value & 128) === 128, // Bit 8 (128) indicates DGPS correction
    };
}
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
/**
 * Parses an input channel value in exponential format
 * @param value Input channel value (e.g., "+1.23456E+02")
 * @returns Parsed number
 */
function parseInputChannel(value) {
    return parseFloat(value);
}
/**
 * Extracts the creation date from the VBO file header
 * @param line Header line containing the date
 * @returns Date object
 */
function parseCreationDate(line) {
    const match = line.match(/(\d{2})\/(\d{2})\/(\d{4})\s+at\s+(\d{2}):(\d{2}):(\d{2})/);
    if (!match) {
        throw new Error('Invalid creation date format');
    }
    const [, day, month, year, hours, minutes, seconds] = match;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds));
}
/**
 * Splits a line into columns while handling quoted values
 * @param line Data line from VBO file
 * @returns Array of column values
 */
function splitLine(line) {
    return line.trim().split(/\s+/);
}
/**
 * Checks if a line is empty or contains only whitespace
 * @param line Line to check
 * @returns True if line is empty
 */
function isEmptyLine(line) {
    return line.trim().length === 0;
}
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
