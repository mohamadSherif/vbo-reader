export interface VBOHeader {
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
}

export interface VBODataRow {
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
  [key: string]: any; // For additional input channels
}

export interface ParsedVBOFile {
  header: VBOHeader;
  data: VBODataRow[];
}

export interface ParserOptions {
  convertCoordinates?: boolean; // Convert lat/long to decimal degrees
  rawData?: boolean; // Return raw string data instead of parsed numbers
}

export class VBOParserError extends Error {
  constructor(message: string, public section?: string) {
    super(message);
    this.name = 'VBOParserError';
  }
}
