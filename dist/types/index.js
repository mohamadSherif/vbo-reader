"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VBOParserError = void 0;
class VBOParserError extends Error {
    constructor(message, section) {
        super(message);
        this.section = section;
        this.name = 'VBOParserError';
    }
}
exports.VBOParserError = VBOParserError;
