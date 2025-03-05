"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractValue = exports.isEmptyLine = exports.splitLine = exports.parseCreationDate = exports.parseInputChannel = exports.parseTime = exports.parseSatelliteInfo = exports.convertCoordinate = void 0;
/**
 * Converts VBOX latitude/longitude format (MMMMM.MMMMM) to degrees with cardinal direction
 * @param coordinate Coordinate in VBOX format (e.g., "03119.09973")
 * @param isPositive Whether the coordinate is positive (North/East)
 * @param isLatitude Whether this is a latitude coordinate (true) or longitude (false)
 * @returns Coordinate in degrees with cardinal direction (e.g., "31°19'5.9838\"N")
 */
function convertCoordinate(coordinate, isPositive, isLatitude) {
    // Parse the coordinate value
    const value = parseFloat(coordinate);
    // Convert total minutes to degrees, minutes and seconds
    const degrees = Math.floor(value / 60);
    const remainingMinutes = value % 60;
    const minutesInt = Math.floor(remainingMinutes);
    const seconds = ((remainingMinutes - minutesInt) * 60).toFixed(2);
    // Determine cardinal direction
    const direction = isLatitude ? (isPositive ? 'N' : 'S') : (isPositive ? 'W' : 'E');
    return `${degrees}°${minutesInt}'${seconds}"${direction}`;
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
 * - DD/MM/YYYY @ HH:mm
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
    // Try format (DD/MM/YYYY @ HH:mm)
    match = line.match(/(\d{2})\/(\d{2})\/(\d{4})\s+@\s+(\d{2}):(\d{2})/);
    if (match) {
        const [, day, month, year, hours, minutes] = match;
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), 0 // Seconds are not provided in this format, default to 0
        );
    }
    throw new Error('Invalid creation date format. Expected DD/MM/YYYY at HH:mm:ss, YYYYMMDD-HHMMSS, or DD/MM/YYYY @ HH:mm');
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
