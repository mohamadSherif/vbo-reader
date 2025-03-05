import { VBOReader } from '../src';
import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from '@jest/globals';

describe('VBO New Date Format', () => {
  it('should correctly parse VBO file with new date format (DD/MM/YYYY @ HH:mm)', () => {
    // Read the sample file with the new date format
    const filePath = join(__dirname, 'sample-new-format.vbo');
    const fileContent = readFileSync(filePath, 'utf-8');
    
    // Parse the file
    const result = VBOReader.parse(fileContent);
    
    // Verify the creation date was parsed correctly
    expect(result.header.creationDate).toBeInstanceOf(Date);
    expect(result.header.creationDate.getFullYear()).toBe(2023);
    expect(result.header.creationDate.getMonth()).toBe(0); // January is 0
    expect(result.header.creationDate.getDate()).toBe(22);
    expect(result.header.creationDate.getHours()).toBe(3);
    expect(result.header.creationDate.getMinutes()).toBe(11);
    expect(result.header.creationDate.getSeconds()).toBe(0); // Seconds should be 0
    
    // Verify other header information was parsed correctly
    expect(result.header.vboxInfo).toEqual({
      version: '5.0',
      gpsType: 'SSX3g',
      serialNumber: '005202',
      cfVersion: '3.0',
      logRate: 10,
      softwareVersion: '2.0.0 (Build 010)',
    });
    
    // Verify data was parsed correctly
    expect(result.data).toHaveLength(3);
  });
});
