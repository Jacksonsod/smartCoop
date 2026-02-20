export type CooperativeStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED';

export type UserRole = 
  | 'SUPER_ADMIN'
  | 'COOPERATIVE_ADMIN'
  | 'CLERK'
  | 'QUALITY_INSPECTOR'
  | 'FINANCE_OFFICER'
  | 'FARMER';

export interface Cooperative {
  id: string;
  name: string;
  registrationNumber: string;
  status: CooperativeStatus;
  adminUserId: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  activatedAt?: string;
  suspendedAt?: string;
  address: string;
  phone: string;
  email: string;
  description?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  cooperativeId?: string;
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Crop {
  id: string;
  name: string;
  variety: string;
  cooperativeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyPrice {
  id: string;
  cropId: string;
  grade: string;
  pricePerKg: number;
  effectiveDate: string;
  cooperativeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Farmer {
  id: string;
  cooperativeId: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  phone: string;
  email?: string;
  address: string;
  farmSize: number;
  registrationDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Harvest {
  id: string;
  farmerId: string;
  cooperativeId: string;
  cropId: string;
  weight: number;
  grade: string;
  harvestDate: string;
  status: 'RECORDED' | 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED';
  recordedBy: string; // Clerk ID
  verifiedBy?: string; // Inspector ID
  verificationDate?: string;
  rejectionReason?: string;
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  harvestId: string;
  farmerId: string;
  cooperativeId: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  paidDate?: string;
  transactionReference?: string;
  processedBy: string; // Finance Officer ID
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalFarmers: number;
  totalHarvests: number;
  totalWeight: number;
  pendingPayments: number;
  totalRevenue: number;
  pendingVerifications: number;
}
