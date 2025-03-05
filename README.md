# vbo-reader

A TypeScript library for parsing VBOX (.vbo) data files. This package provides a simple and type-safe way to read and parse VBOX data files, commonly used in automotive testing and data logging.

## Installation

```bash
npm install vbo-reader
```

## Features

- Full TypeScript support with type definitions
- Parse VBO file headers and data
- Convert coordinates to decimal degrees
- Parse lap timing information with start/finish coordinates
- Handle raw data mode for preserving original string values
- Support for both synchronous and asynchronous file reading
- Comprehensive error handling
- Zero dependencies

## Usage

### Basic Usage

```typescript
import { VBOReader } from 'vbo-reader';

// Parse from file (async)
const data = await VBOReader.parseFile('path/to/file.vbo');

// Parse from file (sync)
const data = VBOReader.parseFileSync('path/to/file.vbo');

// Parse from string
const content = `File created on 31/07/2006 at 09:55:20
[header]
...
[data]
137 162235.40 +03119.09973 +00058.49277 000.140 321.85 +00152.58 +000.000 00000
`;
const data = VBOReader.parse(content);

// Access parsed data
console.log(data.header.creationDate);
console.log(data.header.vboxInfo);
console.log(data.data[0]); // First data row
```

### Parser Options

```typescript
const options = {
  // Convert lat/long to decimal degrees (default: true)
  convertCoordinates: true,
  
  // Return raw string data instead of parsed numbers (default: false)
  rawData: false
};

const data = VBOReader.parse(content, options);
```

### Working with Data

```typescript
// Header information
interface VBOHeader {
  creationDate: Date;
  vboxInfo: {
    version: string;
    gpsType: string;
    serialNumber: string;
    cfVersion: string;
    logRate: number;
    softwareVersion?: string;
  };
  columnNames: string[];
  channelUnits?: string[];
  comments: string[];
  securityCode?: string;
  lapTiming?: LapTimingPoint[]; // Lap timing information
}

// Lap timing point structure
interface LapTimingPoint {
  label: string;
  startCoordinates: {
    latitude: string;
    longitude: string;
  };
  endCoordinates: {
    latitude: string;
    longitude: string;
  };
  description?: string;
}

// Data row structure
interface VBODataRow {
  satellites: {
    count: number;
    hasDGPS: boolean;
    brakeTrigger: boolean;
  };
  time: string;
  latitude: number;
  longitude: number;
  velocity: number | string;
  heading: number | string;
  height: number | string;
  verticalVelocity: number | string;
  triggerEventTime: number | string;
  [key: string]: any; // Additional input channels
}
```

### Error Handling

```typescript
import { VBOReader, VBOParserError } from 'vbo-reader';

try {
  const data = await VBOReader.parseFile('path/to/file.vbo');
} catch (error) {
  if (error instanceof VBOParserError) {
    console.error('VBO parsing error:', error.message);
    console.error('Section:', error.section); // 'header' or 'data'
  } else {
    console.error('Unknown error:', error);
  }
}
```

## File Format

The VBO file format consists of two main sections:

1. Header Section:
   - File creation timestamp
   - VBOX information (version, GPS type, serial number)
   - Column definitions
   - Channel units
   - Comments and metadata

2. Data Section:
   - Space-delimited data rows
   - Each row contains values corresponding to the defined columns
   - Special formatting for coordinates and satellite information

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
