import { ParsedVBOFile, ParserOptions } from './types';
export * from './types';
export declare class VBOReader {
    /**
     * Parses a VBO file content and returns structured data
     * @param content Raw content of the VBO file
     * @param options Parser options
     * @returns Parsed VBO file data
     */
    static parse(content: string, options?: ParserOptions): ParsedVBOFile;
    /**
     * Reads and parses a VBO file from a Buffer
     * @param buffer Buffer containing VBO file content
     * @param options Parser options
     * @returns Parsed VBO file data
     */
    static parseBuffer(buffer: Buffer, options?: ParserOptions): ParsedVBOFile;
}
