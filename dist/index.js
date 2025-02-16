"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VBOReader = void 0;
const header_1 = require("./parser/header");
const data_1 = require("./parser/data");
const types_1 = require("./types");
__exportStar(require("./types"), exports);
class VBOReader {
    /**
     * Parses a VBO file content and returns structured data
     * @param content Raw content of the VBO file
     * @param options Parser options
     * @returns Parsed VBO file data
     */
    static parse(content, options = {}) {
        // Split content into header and data sections
        const sections = content.split('[data]');
        if (sections.length !== 2) {
            throw new types_1.VBOParserError('Invalid VBO file format: missing [data] section');
        }
        const [headerContent, dataContent] = sections;
        // Parse header
        const headerParser = new header_1.HeaderParser(headerContent);
        const header = headerParser.parse();
        // Parse data using column names from header
        const dataParser = new data_1.DataParser(header.columnNames, options);
        const data = dataParser.parseData(dataContent);
        return { header, data };
    }
    /**
     * Reads and parses a VBO file from a Buffer
     * @param buffer Buffer containing VBO file content
     * @param options Parser options
     * @returns Parsed VBO file data
     */
    static parseBuffer(buffer, options = {}) {
        return this.parse(buffer.toString('utf-8'), options);
    }
}
exports.VBOReader = VBOReader;
