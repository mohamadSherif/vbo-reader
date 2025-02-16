import { VBOHeader } from '../types';
export declare class HeaderParser {
    private lines;
    private currentIndex;
    constructor(headerContent: string);
    /**
     * Parses the complete header section of a VBO file
     * @returns Parsed header information
     */
    parse(): VBOHeader;
    private parseHeaderSection;
    private parseChannelUnits;
    private parseComments;
    private parseColumnNames;
    private validateHeader;
}
