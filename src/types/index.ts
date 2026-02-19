// User and Authentication Types
export type UserRole = 'SUPER_ADMIN' | 'COOP_ADMIN' | 'CLERK' | 'FINANCE' | 'INSPECTOR' | 'FARMER';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  tenantId: string;
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
  status: 'PENDING' | 'PROCESSED' | 'BATCHED';
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
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Statistics
export interface DashboardStats {
  totalFarmers: number;
  todayHarvest: number;
  pendingPayments: number;
  totalBatches: number;
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
  crop: CropType;
  pricePerKg: number;
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
