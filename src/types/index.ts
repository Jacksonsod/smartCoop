// User and Authentication Types
export type UserRole = 'SUPER_ADMIN' | 'COOPERATIVE_ADMIN' | 'CLERK' | 'QUALITY_INSPECTOR' | 'FINANCE_OFFICER' | 'FARMER';

export type CooperativeStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED';

export interface Cooperative {
  id: string;
  name: string;
  description: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  email: string;
  phone: string;
  address: string;
  registrationNumber: string;
  adminUserId: string;
  status: CooperativeStatus;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  activatedAt?: string;
  suspendedAt?: string;
  suspendedBy?: string;
  suspensionReason?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  tenantId: string;
  cooperativeId?: string;
  farmerId?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// Farmer Types
export interface Farmer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  farmSize: number; // in hectares
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// Harvest Types
export type CropType = 'MAIZE' | 'WHEAT' | 'RICE' | 'SOYBEANS' | 'COTTON';
export type Grade = 'A' | 'B' | 'C';

export interface Harvest {
  id: string;
  farmerId: string;
  crop: CropType;
  weight: number; // in kg
  grade: Grade;
  harvestDate: string;
  status: 'RECORDED' | 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED' | 'PROCESSED' | 'BATCHED';
  submittedBy: string; // Clerk who submitted
  verifiedBy?: string; // Inspector who verified
  verifiedAt?: string;
  rejectionReason?: string;
  documentUrl?: string; // Mock document attachment
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// Batch Types
export interface Batch {
  id: string;
  batchNumber: string;
  harvestIds: string[];
  totalWeight: number; // in kg
  grade: Grade;
  status: 'CREATED' | 'PROCESSING' | 'COMPLETED';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// Payment Types
export type PaymentStatus = 'PENDING' | 'PAID' | 'OVERDUE';

export interface Payment {
  id: string;
  farmerId: string;
  batchId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  transactionRef?: string; // Added for finance tracking
  processedBy?: string; // Finance officer who processed
  tenantId: string;
  createdAt: string;
  updatedAt: string;

  // Extended fields for dashboard display (would be joined in real backend)
  farmerName?: string;
  cropType?: string;
  weight?: number;
  grade?: string;
  harvestDate?: string;
}

// Dashboard Statistics
export interface DashboardStats {
  totalFarmers: number;
  todayHarvest: number;
  pendingPayments: number;
  totalBatches: number;
}

export interface CooperativeStats {
  totalCooperatives: number;
  pendingApprovals: number;
  activeCooperatives: number;
  suspendedCooperatives: number;
  growthData: { month: string; count: number }[];
  statusData: { status: CooperativeStatus; count: number }[];
}

export interface CooperativeDashboardStats {
  totalFarmers: number;
  totalHarvests: number;
  totalWeight: number;
  pendingApprovals: number;
  revenueData: { month: string; amount: number }[];
  harvestByCrop: { crop: CropType; weight: number }[];
  qualityGrades: { grade: Grade; count: number }[];
}

export interface FinanceStats {
  pendingPayments: number;
  paidPayments: number;
  monthlyPayouts: { month: string; amount: number }[];
  paymentStatus: { status: PaymentStatus; count: number }[];
}

export interface FarmerStats {
  totalDeliveries: number;
  totalEarnings: number;
  deliveryTrend: { date: string; weight: number }[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Pricing Types
export interface Price {
  id: string;
  cropType: string; // Changed from crop: CropType to match usage
  pricePerKg: {
    A: number;
    B: number;
    C: number;
  };
  currency: string;
  status?: string;
  effectiveDate: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// Navigation Types
export interface NavigationItem {
  text: string;
  path: string;
  icon: string;
  roles?: UserRole[];
}
