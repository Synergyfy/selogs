import Dexie, { type Table } from 'dexie';

export interface VehicleEntry {
  id: string;
  plateNumber: string;
  phoneNumber?: string;
  timestamp: number;
  deviceId: string;
  staffId: string;
  staffName?: string;
  synced: boolean;
  image?: Blob;
}

export interface AppSettings {
  id: string;
  staffId: string;
  staffName?: string;
  deviceId: string;
  lastSync?: number;
}

export class VehicleDB extends Dexie {
  entries!: Table<VehicleEntry>;
  settings!: Table<AppSettings>;

  constructor() {
    super('VehicleCaptureDB');
    this.version(1).stores({
      entries: 'id, plateNumber, staffId, synced, timestamp',
      settings: 'id'
    });
  }
}

export const db = new VehicleDB();
