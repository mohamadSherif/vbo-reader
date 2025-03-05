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
    /**
     * Parses the laptiming section of the VBO file
     * @returns Array of lap timing points
     */
    private parseLapTiming;
    private parseHeaderSection;
    private parseChannelUnits;
    private parseComments;
    private parseColumnNames;
    private validateHeader;
}
