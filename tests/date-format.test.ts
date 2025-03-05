import { parseCreationDate } from '../src/parser/utils';

describe('Date Format Parsing', () => {
  test('should parse DD/MM/YYYY at HH:mm:ss format', () => {
    const date = parseCreationDate('File created on 31/07/2006 at 09:55:20');
    expect(date).toBeInstanceOf(Date);
    expect(date.getFullYear()).toBe(2006);
    expect(date.getMonth()).toBe(6); // 0-based, so July is 6
    expect(date.getDate()).toBe(31);
    expect(date.getHours()).toBe(9);
    expect(date.getMinutes()).toBe(55);
    expect(date.getSeconds()).toBe(20);
  });

  test('should parse YYYYMMDD-HHMMSS format', () => {
    const date = parseCreationDate('20060731-095520');
    expect(date).toBeInstanceOf(Date);
    expect(date.getFullYear()).toBe(2006);
    expect(date.getMonth()).toBe(6); // 0-based, so July is 6
    expect(date.getDate()).toBe(31);
    expect(date.getHours()).toBe(9);
    expect(date.getMinutes()).toBe(55);
    expect(date.getSeconds()).toBe(20);
  });

  test('should parse DD/MM/YYYY @ HH:mm format', () => {
    const date = parseCreationDate('File created on 22/01/2023 @ 03:11');
    expect(date).toBeInstanceOf(Date);
    expect(date.getFullYear()).toBe(2023);
    expect(date.getMonth()).toBe(0); // 0-based, so January is 0
    expect(date.getDate()).toBe(22);
    expect(date.getHours()).toBe(3);
    expect(date.getMinutes()).toBe(11);
    expect(date.getSeconds()).toBe(0); // Seconds should default to 0
  });

  test('should throw error for invalid format', () => {
    expect(() => {
      parseCreationDate('Invalid date format');
    }).toThrow('Invalid creation date format');
  });
});
