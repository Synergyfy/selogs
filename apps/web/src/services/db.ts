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
  status: 'IN' | 'OUT';
  checkOutTimestamp?: number;
  checkOutStaffId?: string;
  checkOutStaffName?: string;
}

export interface AppSettings {
  id: string;
  staffId: string;
  staffName?: string;
  deviceId: string;
  lastSync?: number;
  orgId?: string;
  branchId?: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive';
  staffCount: number;
  deviceCount: number;
  syncStatus: boolean;
  updatedAt: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'admin' | 'supervisor' | 'guard';
  email: string;
  branchId: string;
  status: 'active' | 'inactive';
  lastActive?: number;
  syncStatus: boolean;
  updatedAt: number;
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  industry: string;
  plan: 'starter' | 'business' | 'enterprise';
  logo?: string;
  primaryColor?: string;
  syncStatus: boolean;
  updatedAt: number;
  joinedDate?: number;
}

export interface AppNotification {
  id: string;
  type: 'alert' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  orgId?: string;
}

export class VehicleDB extends Dexie {
  entries!: Table<VehicleEntry>;
  settings!: Table<AppSettings>;
  branches!: Table<Branch>;
  staff!: Table<StaffMember>;
  organizations!: Table<Organization>;
  notifications!: Table<AppNotification>;

  constructor() {
    super('VehicleCaptureDB');
    this.version(4).stores({
      entries: 'id, plateNumber, staffId, synced, timestamp, status',
      settings: 'id',
      branches: 'id, name, status',
      staff: 'id, name, role, branchId, status',
      organizations: 'id, code',
      notifications: 'id, type, read, timestamp, orgId'
    });
  }
}

export const db = new VehicleDB();
