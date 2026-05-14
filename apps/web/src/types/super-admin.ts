export interface GlobalStats {
  totalOrganizations: number;
  activeSubscriptions: number;
  totalDevices: number;
  totalEntriesCaptured: number;
  platformRevenue: number;
}

export interface TrendData {
  date: string;
  count: number;
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  industry: string;
  createdAt: string;
  planName?: string;
  branchCount: number;
  staffCount: number;
  deviceCount: number;
}

export interface GlobalInvoice {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  createdAt: string;
  dueDate: string;
  organization: {
    name: string;
  };
}

export interface GlobalSettings {
  id: string;
  maintenanceMode: boolean;
  platformName: string;
  contactEmail: string | null;
  supportPhone: string | null;
  allowNewSignups: boolean;
  updatedAt: string;
}

export interface UpdateGlobalSettingsDto {
  maintenanceMode?: boolean;
  platformName?: string;
  contactEmail?: string;
  supportPhone?: string;
  allowNewSignups?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description?: string;
  monthlyPrice: number;
  quarterlyPrice?: number;
  yearlyPrice?: number;
  quarterlyDiscount?: number;
  yearlyDiscount?: number;
  branchLimit: number;
  staffLimit: number;
  deviceLimit: number;
  hasOcr: boolean;
  hasAnalytics: boolean;
  hasExport: boolean;
  customFeatures: string[];
  isActive: boolean;
  createdAt: string;
}

export interface CreatePlanDto {
  name: string;
  description?: string;
  monthlyPrice: number;
  quarterlyDiscount?: number;
  yearlyDiscount?: number;
  branchLimit?: number;
  staffLimit?: number;
  deviceLimit?: number;
  hasOcr?: boolean;
  hasAnalytics?: boolean;
  hasExport?: boolean;
  customFeatures?: string[];
}

export interface UpdatePlanDto extends Partial<CreatePlanDto> {
  isActive?: boolean;
}
