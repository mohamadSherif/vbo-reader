import { HeaderParser } from './parser/header';
import { DataParser } from './parser/data';
import { ParsedVBOFile, ParserOptions, VBOParserError } from './types';

export * from './types';

export class VBOReader {
  /**
   * Parses a VBO file content and returns structured data
   * @param content Raw content of the VBO file
   * @param options Parser options
   * @returns Parsed VBO file data
   */
  public static parse(content: string, options: ParserOptions = {}): ParsedVBOFile {
    // Split content into header and data sections
    const sections = content.split('[data]');
    if (sections.length !== 2) {
      throw new VBOParserError('Invalid VBO file format: missing [data] section');
    }

    const [headerContent, dataContent] = sections;

    // Parse header
    const headerParser = new HeaderParser(headerContent);
    const header = headerParser.parse();

    // Parse data using column names from header
    const dataParser = new DataParser(header.columnNames, options);
    const data = dataParser.parseData(dataContent);

    return { header, data };
  }

  /**
   * Reads and parses a VBO file from a Buffer
   * @param buffer Buffer containing VBO file content
   * @param options Parser options
   * @returns Parsed VBO file data
   */
  public static parseBuffer(buffer: Buffer, options: ParserOptions = {}): ParsedVBOFile {
    return this.parse(buffer.toString('utf-8'), options);
  }

  // Node.js-specific methods are removed for browser compatibility
}
