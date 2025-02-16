import { VBODataRow, ParserOptions } from '../types';
export declare class DataParser {
    private columnNames;
    private options;
    constructor(columnNames: string[], options?: ParserOptions);
    /**
     * Parses a single data row from the VBO file
     * @param line Raw data line from the file
     * @returns Parsed data row
     */
    parseRow(line: string): VBODataRow;
    /**
     * Parses multiple data rows from the VBO file
     * @param content Raw data content from the file
     * @returns Array of parsed data rows
     */
    parseData(content: string): VBODataRow[];
}
