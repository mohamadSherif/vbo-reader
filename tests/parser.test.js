"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const sampleVBOContent = `File created on 31/07/2006 at 09:55:20

[header]
satellites
time
latitude
longitude
velocity kmh
heading
height
vertical velocity kmh
trigger event time in clock counts

[channel units]

[comments]
(c) 2001 2003 Racelogic
VBox II Version 4.5a
GPS : SSX2g
Serial Number : 005201
CF Version 2.1d
Log Rate (Hz) : 02.00
Software Version : 1.4.5 (Build 005)
Security Code : %//+$%00"0/0+

[column names]
sats time lat long velocity heading height vertvel event1

[data]
137 162235.40 +03119.09973 +00058.49277 000.140 321.85 +00152.58 +000.000 00000
137 162235.90 +03119.09973 +00058.49277 000.220 065.93 +00152.58 +000.000 00000
137 162236.40 +03119.09973 +00058.49277 000.250 356.43 +00152.59 000.072 00000`;
describe('VBOReader', () => {
    describe('parse', () => {
        it('should parse valid VBO content', () => {
            const result = src_1.VBOReader.parse(sampleVBOContent);
            // Test header parsing
            expect(result.header.creationDate).toBeInstanceOf(Date);
            expect(result.header.vboxInfo).toEqual({
                version: '4.5a',
                gpsType: 'SSX2g',
                serialNumber: '005201',
                cfVersion: '2.1d',
                logRate: 2,
                softwareVersion: '1.4.5 (Build 005)',
            });
            expect(result.header.columnNames).toEqual([
                'sats', 'time', 'lat', 'long', 'velocity', 'heading', 'height', 'vertvel', 'event1'
            ]);
            expect(result.header.securityCode).toBe('%//+$%00"0/0+');
            // Test data parsing
            expect(result.data).toHaveLength(3);
            // Test first data row
            const firstRow = result.data[0];
            expect(firstRow.satellites).toEqual({
                count: 9,
                hasDGPS: true,
                brakeTrigger: false,
            });
            expect(firstRow.time).toBe('16:22:35.40');
            expect(firstRow.velocity).toBe(0.14);
            expect(firstRow.heading).toBe(321.85);
            expect(firstRow.height).toBe(152.58);
            expect(firstRow.verticalVelocity).toBe(0);
            expect(firstRow.triggerEventTime).toBe(0);
        });
        it('should handle rawData option', () => {
            const result = src_1.VBOReader.parse(sampleVBOContent, { rawData: true });
            const firstRow = result.data[0];
            expect(firstRow.velocity).toBe('000.140');
            expect(firstRow.heading).toBe('321.85');
            expect(firstRow.height).toBe('+00152.58');
            expect(firstRow.verticalVelocity).toBe('+000.000');
            expect(firstRow.triggerEventTime).toBe('00000');
        });
        it('should throw error for invalid VBO content', () => {
            const invalidContent = 'Invalid content without [data] section';
            expect(() => src_1.VBOReader.parse(invalidContent)).toThrow(src_1.VBOParserError);
        });
        it('should throw error for missing required header information', () => {
            const invalidContent = `File created on 31/07/2006 at 09:55:20
[data]
137 162235.40 +03119.09973 +00058.49277 000.140 321.85 +00152.58 +000.000 00000`;
            expect(() => src_1.VBOReader.parse(invalidContent)).toThrow(src_1.VBOParserError);
        });
    });
});
