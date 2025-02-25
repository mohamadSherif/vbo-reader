const { VBOReader, VBOParserError } = require('../src');
const { parseCreationDate } = require('../src/parser/utils');
const { describe, expect, it } = require('@jest/globals');

describe('Utils', () => {
  describe('convertCoordinate', () => {
    it('should format coordinates with cardinal directions', () => {
      const { convertCoordinate } = require('../src/parser/utils');
      
      // Test latitude cases
      expect(convertCoordinate('2361.600342', true, true)).toBe('39°21\'36.02"N');
      expect(convertCoordinate('02700.56963', true, true)).toBe('45°0\'34.18"N');
      
      // Test longitude cases
      expect(convertCoordinate('04504.315506', true, false)).toBe('75°4\'18.93"W');
      expect(convertCoordinate('005571.57815', true, false)).toBe('92°51\'34.69"W');
    });
  });

  describe('parseCreationDate', () => {
    it('should parse standard date format', () => {
      const date = parseCreationDate('File created on 31/07/2006 at 09:55:20');
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2006);
      expect(date.getMonth()).toBe(6); // July is 6 (zero-based)
      expect(date.getDate()).toBe(31);
      expect(date.getHours()).toBe(9);
      expect(date.getMinutes()).toBe(55);
      expect(date.getSeconds()).toBe(20);
    });

    it('should parse new date format', () => {
      const date = parseCreationDate('File created on 20250216-163155');
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(1); // February is 1 (zero-based)
      expect(date.getDate()).toBe(16);
      expect(date.getHours()).toBe(16);
      expect(date.getMinutes()).toBe(31);
      expect(date.getSeconds()).toBe(55);
    });

    it('should throw error for invalid date format', () => {
      expect(() => parseCreationDate('File created on invalid date'))
        .toThrow('Invalid creation date format. Expected DD/MM/YYYY at HH:mm:ss or YYYYMMDD-HHMMSS');
    });
  });
});

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
      const result = VBOReader.parse(sampleVBOContent);

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
      expect(firstRow.latitude).toBe('51°59\'5.98"N');
      expect(firstRow.longitude).toBe('0°58\'29.57"W');
      expect(firstRow.velocity).toBe(0.14);
      expect(firstRow.heading).toBe(321.85);
      expect(firstRow.height).toBe(152.58);
      expect(firstRow.verticalVelocity).toBe(0);
      expect(firstRow.triggerEventTime).toBe(0);
    });

    it('should handle rawData option', () => {
      const result = VBOReader.parse(sampleVBOContent, { rawData: true });
      const firstRow = result.data[0];

      expect(firstRow.velocity).toBe('000.140');
      expect(firstRow.heading).toBe('321.85');
      expect(firstRow.height).toBe('+00152.58');
      expect(firstRow.verticalVelocity).toBe('+000.000');
      expect(firstRow.triggerEventTime).toBe('00000');
    });

    it('should throw error for invalid VBO content', () => {
      const invalidContent = 'Invalid content without [data] section';
      expect(() => VBOReader.parse(invalidContent)).toThrow(VBOParserError);
    });

    it('should throw error for missing required header information', () => {
      const invalidContent = `File created on 31/07/2006 at 09:55:20
[data]
137 162235.40 +03119.09973 +00058.49277 000.140 321.85 +00152.58 +000.000 00000`;
      
      expect(() => VBOReader.parse(invalidContent)).toThrow(VBOParserError);
    });
  });
});
