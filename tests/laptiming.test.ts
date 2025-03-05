import { VBOReader } from '../src';
import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from '@jest/globals';

describe('VBO Laptiming', () => {
  it('should correctly parse VBO file with laptiming section', () => {
    // Read the sample file with laptiming section
    const filePath = join(__dirname, '../..', 'sample-racebox.vbo');
    const fileContent = readFileSync(filePath, 'utf-8');
    
    // Parse the file
    const result = VBOReader.parse(fileContent);
    
    // Verify the laptiming section was parsed correctly
    expect(result.header.lapTiming).toBeDefined();
    expect(result.header.lapTiming).toHaveLength(1);
    
    // Verify the lap timing point was parsed correctly
    const lapTimingPoint = result.header.lapTiming![0];
    expect(lapTimingPoint.label).toBe('Start');
    
    // Verify the start coordinates were parsed correctly
    expect(lapTimingPoint.startCoordinates).toBeDefined();
    expect(lapTimingPoint.startCoordinates.latitude).toBe('45°0\'35.13"N');
    expect(lapTimingPoint.startCoordinates.longitude).toBe('92°51\'33.84"E');
    
    // Verify the end coordinates were parsed correctly
    expect(lapTimingPoint.endCoordinates).toBeDefined();
    expect(lapTimingPoint.endCoordinates.latitude).toBe('45°0\'34.81"N');
    expect(lapTimingPoint.endCoordinates.longitude).toBe('92°51\'33.80"E');
    
    // Verify the description was parsed correctly
    expect(lapTimingPoint.description).toBe('Start / Finish');
  });
});
