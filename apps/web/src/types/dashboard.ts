export interface StaffMember {
  id: string;
  email: string;
  fullName?: string;
  staffId?: string;
  role: 'admin' | 'supervisor' | 'guard';
  branchId?: string;
  branchName?: string;
  createdAt: string;
}

export interface CreateStaffDto {
  email: string;
  fullName: string;
  staffId?: string;
  role: 'supervisor' | 'guard';
  branchId?: string;
  password?: string;
}

export interface UpdateStaffDto {
  fullName?: string;
  role?: 'supervisor' | 'guard';
  branchId?: string;
}

export interface VehicleEntry {
  id: string;
  plateNumber: string;
  phoneNumber?: string;
  notes?: string;
  status: 'IN' | 'OUT';
  checkInTime: string;
  checkOutTime?: string;
  branchName: string;
  checkInStaffName: string;
  checkOutStaffName?: string;
  checkInGateName: string;
  checkOutGateName?: string;
  imagePath?: string;
  createdAt: string;
}

export interface DashboardOverview {
  todayEntries: number;
  activeVehicles: number;
  peakHour: number;
  activeStaff: number;
  activeDevices: number;
  activeBranches: number;
  subscriptionStatus: string;
}

export interface DashboardTrend {
  date: string;
  count: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  dueDate: string;
  paidAt?: string;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}
