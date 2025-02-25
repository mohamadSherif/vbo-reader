/**
 * Converts VBOX latitude/longitude format (MMMMM.MMMMM) to degrees with cardinal direction
 * @param coordinate Coordinate in VBOX format (e.g., "03119.09973")
 * @param isPositive Whether the coordinate is positive (North/East)
 * @param isLatitude Whether this is a latitude coordinate (true) or longitude (false)
 * @returns Coordinate in degrees with cardinal direction (e.g., "31°19'5.9838\"N")
 */
export declare function convertCoordinate(coordinate: string, isPositive: boolean, isLatitude: boolean): string;
/**
 * Parses satellite information from VBOX format
 * @param value Satellite value from VBO file
 * @returns Parsed satellite information
 */
export declare function parseSatelliteInfo(value: number): {
    count: number;
    hasDGPS: boolean;
    brakeTrigger: boolean;
};
/**
 * Parses a time string from VBOX format (HHMMSS.SS) to standard format (HH:MM:SS.SS)
 * @param time Time string from VBO file
 * @returns Formatted time string
 */
export declare function parseTime(time: string): string;
/**
 * Parses an input channel value in exponential format
 * @param value Input channel value (e.g., "+1.23456E+02")
 * @returns Parsed number
 */
export declare function parseInputChannel(value: string): number;
/**
 * Extracts the creation date from the VBO file header
 * Supports formats:
 * - DD/MM/YYYY at HH:mm:ss
 * - YYYYMMDD-HHMMSS
 * @param line Header line containing the date
 * @returns Date object
 */
export declare function parseCreationDate(line: string): Date;
/**
 * Splits a line into columns while handling quoted values
 * @param line Data line from VBO file
 * @returns Array of column values
 */
export declare function splitLine(line: string): string[];
/**
 * Checks if a line is empty or contains only whitespace
 * @param line Line to check
 * @returns True if line is empty
 */
export declare function isEmptyLine(line: string): boolean;
/**
 * Extracts a value from a line that matches a specific pattern
 * @param line Line to parse
 * @param pattern Pattern to match
 * @returns Extracted value or null if no match
 */
export declare function extractValue(line: string, pattern: RegExp): string | null;
