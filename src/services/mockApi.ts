import {
  User,
  Farmer,
  Harvest,
  Batch,
  Payment,
  PaymentStatus,
  DashboardStats,
  LoginCredentials,
  ApiResponse,
  Price,
  Cooperative,
  CooperativeStats,
  CooperativeDashboardStats,
  FinanceStats,
  FarmerStats,
} from '../types';
import {
  mockUsers,
  mockFarmers,
  mockHarvests,
  mockBatches,
  mockPayments,
  mockPrices,
  getTenantData,
  TENANT_ID_1
} from '../data/mockData';
import { StorageService } from './storageService';

// Simulate API delay
const delay = (ms: number = 800): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Simulate network error randomly (disabled for demo)
const simulateNetworkError = (): void => {
  // Disabled for demo purposes
  // if (Math.random() < 0.1) {
  //   throw new Error('Network error: Unable to connect to server');
  // }
};

// Generic response wrapper
const createResponse = <T>(data: T, message: string = 'Success'): ApiResponse<T> => {
  return {
    data,
    message,
    success: true,
  };
};

// Cooperatives API
export const cooperativesApi = {
  getCooperatives: async (): Promise<ApiResponse<Cooperative[]>> => {
    await delay();
    simulateNetworkError();

    const cooperatives = StorageService.getCooperatives();
    return createResponse(cooperatives);
  },

  getCooperativeById: async (id: string): Promise<ApiResponse<Cooperative>> => {
    await delay();
    simulateNetworkError();

    const cooperatives = StorageService.getCooperatives();
    const cooperative = cooperatives.find(c => c.id === id);

    if (!cooperative) {
      throw new Error('Cooperative not found');
    }

    return createResponse(cooperative);
  },

  createCooperative: async (cooperative: Omit<Cooperative, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Cooperative>> => {
    await delay();
    simulateNetworkError();

    // Validate required fields
    if (!cooperative.name?.trim()) {
      throw new Error('Cooperative name is required');
    }
    if (!cooperative.location?.trim()) {
      throw new Error('Location is required');
    }
    if (!cooperative.contactEmail?.trim()) {
      throw new Error('Contact email is required');
    }

    const newCooperative = StorageService.saveCooperative(cooperative);
    return createResponse(newCooperative, 'Cooperative created successfully');
  },

  updateCooperative: async (id: string, updates: Partial<Cooperative>): Promise<ApiResponse<Cooperative>> => {
    await delay();
    simulateNetworkError();

    const updatedCooperative = StorageService.updateCooperative(id, updates);
    if (!updatedCooperative) {
      throw new Error('Cooperative not found');
    }

    return createResponse(updatedCooperative, 'Cooperative updated successfully');
  },

  approveCooperative: async (id: string, approvedBy: string): Promise<ApiResponse<Cooperative>> => {
    await delay();
    simulateNetworkError();

    const updatedCooperative = StorageService.updateCooperative(id, {
      status: 'APPROVED',
      approvedAt: new Date().toISOString(),
      approvedBy,
    });

    if (!updatedCooperative) {
      throw new Error('Cooperative not found');
    }

    return createResponse(updatedCooperative, 'Cooperative approved successfully');
  },

  activateCooperative: async (id: string): Promise<ApiResponse<Cooperative>> => {
    await delay();
    simulateNetworkError();

    const updatedCooperative = StorageService.updateCooperative(id, {
      status: 'ACTIVE',
    });

    if (!updatedCooperative) {
      throw new Error('Cooperative not found');
    }

    return createResponse(updatedCooperative, 'Cooperative activated successfully');
  },

  suspendCooperative: async (id: string, reason: string, suspendedBy: string): Promise<ApiResponse<Cooperative>> => {
    await delay();
    simulateNetworkError();

    const updatedCooperative = StorageService.updateCooperative(id, {
      status: 'SUSPENDED',
      suspendedAt: new Date().toISOString(),
      suspendedBy,
      suspensionReason: reason,
    });

    if (!updatedCooperative) {
      throw new Error('Cooperative not found');
    }

    return createResponse(updatedCooperative, 'Cooperative suspended successfully');
  },
};

// Authentication API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<User>> => {
    await delay();
    simulateNetworkError();

    const user = mockUsers.find(
      u => u.username === credentials.username && credentials.password === 'password'
    );

    if (!user) {
      throw new Error('Invalid username or password');
    }

    return createResponse(user, 'Login successful');
  },

  getCurrentUser: async (userId: string): Promise<ApiResponse<User>> => {
    await delay();
    simulateNetworkError();

    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    return createResponse(user);
  },
};

// Users API
export const usersApi = {
  getUsers: async (tenantId: string): Promise<ApiResponse<User[]>> => {
    await delay();
    simulateNetworkError();

    const users = StorageService.getUsers().filter(u => u.tenantId === tenantId);
    return createResponse(users);
  },

  createUser: async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>> => {
    await delay();
    simulateNetworkError();

    // Validate required fields
    if (!user.username?.trim()) {
      throw new Error('Username is required');
    }
    if (!user.email?.trim()) {
      throw new Error('Email is required');
    }
    if (!user.role) {
      throw new Error('Role is required');
    }
    if (!user.tenantId?.trim()) {
      throw new Error('Tenant ID is required');
    }

    // Check if username already exists
    const existingUsers = StorageService.getUsers();
    if (existingUsers.some(u => u.username === user.username)) {
      throw new Error('Username already exists');
    }

    const newUser = StorageService.saveUser(user);
    return createResponse(newUser, 'User created successfully');
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<ApiResponse<User>> => {
    await delay();
    simulateNetworkError();

    const updatedUser = StorageService.updateUser(id, updates);
    if (!updatedUser) {
      throw new Error('User not found');
    }

    return createResponse(updatedUser, 'User updated successfully');
  },
};

// Farmers API
export const farmersApi = {
  getFarmers: async (tenantId: string): Promise<ApiResponse<Farmer[]>> => {
    await delay();
    simulateNetworkError();

    // Get farmers from local storage first, fallback to mock data
    const storedFarmers = StorageService.getFarmers();
    const farmers = storedFarmers.length > 0 ? storedFarmers : getTenantData(mockFarmers, tenantId);

    // Filter by tenant ID for stored farmers
    const tenantFarmers = farmers.filter(f => f.tenantId === tenantId);
    return createResponse(tenantFarmers);
  },

  getFarmerById: async (id: string, tenantId: string): Promise<ApiResponse<Farmer>> => {
    await delay();
    simulateNetworkError();

    // Try local storage first
    const storedFarmers = StorageService.getFarmers();
    const farmer = storedFarmers.find(f => f.id === id && f.tenantId === tenantId);

    // Fallback to mock data
    if (!farmer) {
      const mockFarmer = getTenantData(mockFarmers, tenantId).find(f => f.id === id);
      if (!mockFarmer) {
        throw new Error('Farmer not found');
      }
      return createResponse(mockFarmer);
    }

    return createResponse(farmer);
  },

  createFarmer: async (farmer: Omit<Farmer, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Farmer>> => {
    await delay();
    simulateNetworkError();

    // Validate required fields
    if (!farmer.name?.trim()) {
      throw new Error('Farmer name is required');
    }
    if (!farmer.email?.trim()) {
      throw new Error('Farmer email is required');
    }
    if (!farmer.phone?.trim()) {
      throw new Error('Farmer phone is required');
    }
    if (!farmer.address?.trim()) {
      throw new Error('Farmer address is required');
    }

    // Add tenant ID if not present
    const farmerWithTenant = {
      ...farmer,
      tenantId: farmer.tenantId || TENANT_ID_1,
    };

    // Save to local storage
    const newFarmer = StorageService.saveFarmer(farmerWithTenant);

    return createResponse(newFarmer, 'Farmer created successfully');
  },

  updateFarmer: async (id: string, updates: Partial<Farmer>, tenantId: string): Promise<ApiResponse<Farmer>> => {
    await delay();
    simulateNetworkError();

    // Try updating in local storage first
    const updatedFarmer = StorageService.updateFarmer(id, updates);

    if (updatedFarmer && updatedFarmer.tenantId === tenantId) {
      return createResponse(updatedFarmer, 'Farmer updated successfully');
    }

    // Fallback to mock data
    const farmerIndex = getTenantData(mockFarmers, tenantId).findIndex(f => f.id === id);
    if (farmerIndex === -1) {
      throw new Error('Farmer not found');
    }

    const mockUpdatedFarmer = {
      ...mockFarmers[farmerIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    mockFarmers[farmerIndex] = mockUpdatedFarmer;
    return createResponse(mockUpdatedFarmer, 'Farmer updated successfully');
  },

  deleteFarmer: async (id: string, tenantId: string): Promise<ApiResponse<void>> => {
    await delay();
    simulateNetworkError();

    // Try deleting from local storage first
    const deleted = StorageService.deleteFarmer(id);

    if (deleted) {
      return createResponse(undefined, 'Farmer deleted successfully');
    }

    // Fallback to mock data
    const farmerIndex = getTenantData(mockFarmers, tenantId).findIndex(f => f.id === id);
    if (farmerIndex === -1) {
      throw new Error('Farmer not found');
    }

    mockFarmers.splice(farmerIndex, 1);
    return createResponse(undefined, 'Farmer deleted successfully');
  },
};

// Harvests API
export const harvestsApi = {
  getHarvests: async (tenantId: string): Promise<ApiResponse<Harvest[]>> => {
    await delay();
    simulateNetworkError();

    // Get harvests from local storage first, fallback to mock data
    const storedHarvests = StorageService.getHarvests();
    const harvests = storedHarvests.length > 0 ? storedHarvests : getTenantData(mockHarvests, tenantId);

    // Filter by tenant ID for stored harvests
    const tenantHarvests = harvests.filter(h => h.tenantId === tenantId);
    return createResponse(tenantHarvests);
  },

  getHarvestById: async (id: string, tenantId: string): Promise<ApiResponse<Harvest>> => {
    await delay();
    simulateNetworkError();

    // Try local storage first
    const storedHarvests = StorageService.getHarvests();
    const harvest = storedHarvests.find(h => h.id === id && h.tenantId === tenantId);

    // Fallback to mock data
    if (!harvest) {
      const mockHarvest = getTenantData(mockHarvests, tenantId).find(h => h.id === id);
      if (!mockHarvest) {
        throw new Error('Harvest not found');
      }
      return createResponse(mockHarvest);
    }

    return createResponse(harvest);
  },

  createHarvest: async (harvest: Omit<Harvest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Harvest>> => {
    await delay();
    simulateNetworkError();

    // Validate required fields
    if (!harvest.farmerId?.trim()) {
      throw new Error('Farmer ID is required');
    }
    if (!harvest.crop?.trim()) {
      throw new Error('Crop type is required');
    }
    if (!harvest.weight || harvest.weight <= 0) {
      throw new Error('Weight must be greater than 0');
    }
    if (!harvest.grade?.trim()) {
      throw new Error('Grade is required');
    }

    // Save to local storage
    const newHarvest = StorageService.saveHarvest(harvest);

    return createResponse(newHarvest, 'Harvest created successfully');
  },

  updateHarvest: async (id: string, updates: Partial<Harvest>, tenantId: string): Promise<ApiResponse<Harvest>> => {
    await delay();
    simulateNetworkError();

    // Try updating in local storage first
    const updatedHarvest = StorageService.updateHarvest(id, updates);

    if (updatedHarvest && updatedHarvest.tenantId === tenantId) {
      return createResponse(updatedHarvest, 'Harvest updated successfully');
    }

    // Fallback to mock data
    const harvestIndex = getTenantData(mockHarvests, tenantId).findIndex(h => h.id === id);
    if (harvestIndex === -1) {
      throw new Error('Harvest not found');
    }

    const mockUpdatedHarvest = {
      ...mockHarvests[harvestIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    mockHarvests[harvestIndex] = mockUpdatedHarvest;
    return createResponse(mockUpdatedHarvest, 'Harvest updated successfully');
  },

  approveHarvest: async (id: string, verifiedBy: string, tenantId: string): Promise<ApiResponse<Harvest>> => {
    await delay();
    simulateNetworkError();

    const updatedHarvest = StorageService.updateHarvest(id, {
      status: 'APPROVED',
      verifiedBy,
      verifiedAt: new Date().toISOString(),
    });

    if (updatedHarvest && updatedHarvest.tenantId === tenantId) {
      return createResponse(updatedHarvest, 'Harvest approved successfully');
    }

    // Fallback to mock data
    const harvestIndex = getTenantData(mockHarvests, tenantId).findIndex(h => h.id === id);
    if (harvestIndex === -1) {
      throw new Error('Harvest not found');
    }

    const mockUpdatedHarvest: Harvest = {
      ...mockHarvests[harvestIndex],
      status: 'APPROVED',
      verifiedBy,
      verifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockHarvests[harvestIndex] = mockUpdatedHarvest;
    return createResponse(mockUpdatedHarvest, 'Harvest approved successfully');
  },

  rejectHarvest: async (id: string, verifiedBy: string, reason: string, tenantId: string): Promise<ApiResponse<Harvest>> => {
    await delay();
    simulateNetworkError();

    const updatedHarvest = StorageService.updateHarvest(id, {
      status: 'REJECTED',
      verifiedBy,
      verifiedAt: new Date().toISOString(),
      rejectionReason: reason,
    });

    if (updatedHarvest && updatedHarvest.tenantId === tenantId) {
      return createResponse(updatedHarvest, 'Harvest rejected successfully');
    }

    // Fallback to mock data
    const harvestIndex = getTenantData(mockHarvests, tenantId).findIndex(h => h.id === id);
    if (harvestIndex === -1) {
      throw new Error('Harvest not found');
    }

    const mockUpdatedHarvest: Harvest = {
      ...mockHarvests[harvestIndex],
      status: 'REJECTED',
      verifiedBy,
      verifiedAt: new Date().toISOString(),
      rejectionReason: reason,
      updatedAt: new Date().toISOString(),
    };

    mockHarvests[harvestIndex] = mockUpdatedHarvest;
    return createResponse(mockUpdatedHarvest, 'Harvest rejected successfully');
  },
};

// Batches API
export const batchesApi = {
  getBatches: async (tenantId: string): Promise<ApiResponse<Batch[]>> => {
    await delay();
    simulateNetworkError();

    // Get batches from local storage first, fallback to mock data
    const storedBatches = StorageService.getBatches();
    const batches = storedBatches.length > 0 ? storedBatches : getTenantData(mockBatches, tenantId);

    // Filter by tenant ID for stored batches
    const tenantBatches = batches.filter(b => b.tenantId === tenantId);
    return createResponse(tenantBatches);
  },

  getBatchById: async (id: string, tenantId: string): Promise<ApiResponse<Batch>> => {
    await delay();
    simulateNetworkError();

    // Try local storage first
    const storedBatches = StorageService.getBatches();
    const batch = storedBatches.find(b => b.id === id && b.tenantId === tenantId);

    // Fallback to mock data
    if (!batch) {
      const mockBatch = getTenantData(mockBatches, tenantId).find(b => b.id === id);
      if (!mockBatch) {
        throw new Error('Batch not found');
      }
      return createResponse(mockBatch);
    }

    return createResponse(batch);
  },

  createBatch: async (batch: Omit<Batch, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Batch>> => {
    await delay();
    simulateNetworkError();

    // Validate required fields
    if (!batch.harvestIds || batch.harvestIds.length === 0) {
      throw new Error('At least one harvest must be selected');
    }
    if (!batch.totalWeight || batch.totalWeight <= 0) {
      throw new Error('Total weight must be greater than 0');
    }
    if (!batch.grade?.trim()) {
      throw new Error('Grade is required');
    }
    if (!batch.batchNumber?.trim()) {
      throw new Error('Batch number is required');
    }

    // Save to local storage
    const newBatch = StorageService.saveBatch(batch);

    return createResponse(newBatch, 'Batch created successfully');
  },
};

// Payments API
export const paymentsApi = {
  getPayments: async (tenantId: string): Promise<ApiResponse<Payment[]>> => {
    await delay();
    simulateNetworkError();

    // Get payments from local storage first, fallback to mock data
    const storedPayments = StorageService.getPayments();
    const payments = storedPayments.length > 0 ? storedPayments : getTenantData(mockPayments, tenantId);

    // Filter by tenant ID for stored payments
    const tenantPayments = payments.filter(p => p.tenantId === tenantId);
    return createResponse(tenantPayments);
  },

  getPaymentById: async (id: string, tenantId: string): Promise<ApiResponse<Payment>> => {
    await delay();
    simulateNetworkError();

    // Try local storage first
    const storedPayments = StorageService.getPayments();
    const payment = storedPayments.find(p => p.id === id && p.tenantId === tenantId);

    // Fallback to mock data
    if (!payment) {
      const mockPayment = getTenantData(mockPayments, tenantId).find(p => p.id === id);
      if (!mockPayment) {
        throw new Error('Payment not found');
      }
      return createResponse(mockPayment);
    }

    return createResponse(payment);
  },

  updatePaymentStatus: async (id: string, status: PaymentStatus, tenantId: string): Promise<ApiResponse<Payment>> => {
    await delay();
    simulateNetworkError();

    const updatedPayment = StorageService.updatePayment(id, {
      status,
      paidDate: status === 'PAID' ? new Date().toISOString() : undefined,
    });

    if (updatedPayment && updatedPayment.tenantId === tenantId) {
      return createResponse(updatedPayment, 'Payment status updated successfully');
    }

    const paymentIndex = getTenantData(mockPayments, tenantId).findIndex(p => p.id === id);
    if (paymentIndex === -1) {
      throw new Error('Payment not found');
    }

    const mockUpdatedPayment: Payment = {
      ...mockPayments[paymentIndex],
      status,
      paidDate: status === 'PAID' ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    };

    mockPayments[paymentIndex] = mockUpdatedPayment;
    return createResponse(mockUpdatedPayment, 'Payment status updated successfully');
  },

  processPayment: async (id: string, transactionRef: string, processedBy: string, tenantId: string): Promise<ApiResponse<Payment>> => {
    await delay();
    simulateNetworkError();

    // Try updating in local storage first
    const updatedPayment = StorageService.updatePayment(id, {
      status: 'PAID',
      paidDate: new Date().toISOString(),
      transactionRef,
      processedBy,
    });

    if (updatedPayment && updatedPayment.tenantId === tenantId) {
      return createResponse(updatedPayment, 'Payment processed successfully');
    }

    // Fallback to mock data
    const paymentIndex = getTenantData(mockPayments, tenantId).findIndex(p => p.id === id);
    if (paymentIndex === -1) {
      throw new Error('Payment not found');
    }

    const mockUpdatedPayment: Payment = {
      ...mockPayments[paymentIndex],
      status: 'PAID',
      paidDate: new Date().toISOString(),
      transactionRef,
      processedBy,
      updatedAt: new Date().toISOString(),
    };

    mockPayments[paymentIndex] = mockUpdatedPayment;
    return createResponse(mockUpdatedPayment, 'Payment processed successfully');
  },

  getPendingPayments: async (tenantId: string): Promise<ApiResponse<Payment[]>> => {
    await delay();
    simulateNetworkError();

    // Get pending payments from local storage
    const pendingPayments = StorageService.getPendingPayments(tenantId);
    return createResponse(pendingPayments);
  },

  getFarmerPayments: async (farmerId: string, tenantId: string): Promise<ApiResponse<Payment[]>> => {
    await delay();
    simulateNetworkError();

    // Get farmer payments from local storage
    const farmerPayments = StorageService.getFarmerPayments(farmerId, tenantId);
    return createResponse(farmerPayments);
  },
};

// Prices API
export const pricesApi = {
  getPrices: async (tenantId: string): Promise<ApiResponse<Price[]>> => {
    await delay();
    simulateNetworkError();

    // Get prices from local storage first, fallback to mock data
    const storedPrices = StorageService.getPrices();
    const prices = storedPrices.length > 0 ? storedPrices : getTenantData(mockPrices, tenantId);

    // Filter by tenant ID for stored prices
    const tenantPrices = prices.filter(p => p.tenantId === tenantId);
    return createResponse(tenantPrices);
  },

  createPrice: async (price: Omit<Price, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Price>> => {
    await delay();
    simulateNetworkError();

    // Validate required fields
    if (!price.cropType?.trim()) {
      throw new Error('Crop type is required');
    }
    if (!price.pricePerKg || !price.pricePerKg.A) {
      throw new Error('Price per kg must be set');
    }
    if (!price.effectiveDate?.trim()) {
      throw new Error('Effective date is required');
    }

    // Save to local storage
    const newPrice = StorageService.savePrice(price);

    return createResponse(newPrice, 'Price created successfully');
  },

  updatePrice: async (id: string, updates: Partial<Price>, tenantId: string): Promise<ApiResponse<Price>> => {
    await delay();
    simulateNetworkError();

    // Get current prices
    const prices = StorageService.getPrices();
    const index = prices.findIndex(p => p.id === id && p.tenantId === tenantId);

    if (index === -1) {
      throw new Error('Price not found');
    }

    const updatedPrice = {
      ...prices[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedPrices = [...prices];
    updatedPrices[index] = updatedPrice;
    StorageService.saveToStorage('smartcoop_prices', updatedPrices);

    return createResponse(updatedPrice, 'Price updated successfully');
  },

  calculatePaymentAmount: async (batchId: string, farmerId: string, tenantId: string): Promise<ApiResponse<number>> => {
    await delay();
    simulateNetworkError();

    const amount = StorageService.calculatePaymentAmount(batchId, farmerId, tenantId);
    return createResponse(amount, 'Payment amount calculated');
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (tenantId: string): Promise<ApiResponse<DashboardStats>> => {
    await delay();
    simulateNetworkError();

    // Get data from local storage first, fallback to mock data
    const storedFarmers = StorageService.getFarmers();
    const storedHarvests = StorageService.getHarvests();
    const storedPayments = StorageService.getPayments();
    const storedBatches = StorageService.getBatches();

    const farmers = storedFarmers.length > 0 ? storedFarmers.filter(f => f.tenantId === tenantId) : getTenantData(mockFarmers, tenantId);
    const harvests = storedHarvests.length > 0 ? storedHarvests.filter(h => h.tenantId === tenantId) : getTenantData(mockHarvests, tenantId);
    const payments = storedPayments.length > 0 ? storedPayments.filter(p => p.tenantId === tenantId) : getTenantData(mockPayments, tenantId);
    const batches = storedBatches.length > 0 ? storedBatches.filter(b => b.tenantId === tenantId) : getTenantData(mockBatches, tenantId);

    const today = new Date().toISOString().split('T')[0];
    const todayHarvests = harvests.filter(h => h.harvestDate?.startsWith(today));
    const totalTodayWeight = todayHarvests.reduce((sum, h) => sum + (h.weight || 0), 0);

    const pendingPayments = payments.filter(p => p.status === 'PENDING');

    const stats: DashboardStats = {
      totalFarmers: farmers.length,
      todayHarvest: totalTodayWeight,
      pendingPayments: pendingPayments.length,
      totalBatches: batches.length,
    };

    return createResponse(stats);
  },

  getCooperativeStats: async (): Promise<ApiResponse<CooperativeStats>> => {
    await delay();
    simulateNetworkError();

    const cooperatives = StorageService.getCooperatives();

    const stats: CooperativeStats = {
      totalCooperatives: cooperatives.length,
      pendingApprovals: cooperatives.filter(c => c.status === 'PENDING_APPROVAL').length,
      activeCooperatives: cooperatives.filter(c => c.status === 'ACTIVE').length,
      suspendedCooperatives: cooperatives.filter(c => c.status === 'SUSPENDED').length,
      growthData: [], // TODO: Implement growth data calculation
      statusData: [
        { status: 'DRAFT', count: cooperatives.filter(c => c.status === 'DRAFT').length },
        { status: 'PENDING_APPROVAL', count: cooperatives.filter(c => c.status === 'PENDING_APPROVAL').length },
        { status: 'APPROVED', count: cooperatives.filter(c => c.status === 'APPROVED').length },
        { status: 'ACTIVE', count: cooperatives.filter(c => c.status === 'ACTIVE').length },
        { status: 'SUSPENDED', count: cooperatives.filter(c => c.status === 'SUSPENDED').length },
      ],
    };

    return createResponse(stats);
  },

  getCooperativeDashboardStats: async (tenantId: string): Promise<ApiResponse<CooperativeDashboardStats>> => {
    await delay();
    simulateNetworkError();

    const farmers = StorageService.getFarmers().filter(f => f.tenantId === tenantId);
    const harvests = StorageService.getHarvests().filter(h => h.tenantId === tenantId);

    const stats: CooperativeDashboardStats = {
      totalFarmers: farmers.length,
      totalHarvests: harvests.length,
      totalWeight: harvests.reduce((sum, h) => sum + h.weight, 0),
      pendingApprovals: harvests.filter(h => h.status === 'PENDING_VERIFICATION').length,
      revenueData: [], // TODO: Implement revenue trend
      harvestByCrop: [], // TODO: Implement crop breakdown
      qualityGrades: [
        { grade: 'A', count: harvests.filter(h => h.grade === 'A').length },
        { grade: 'B', count: harvests.filter(h => h.grade === 'B').length },
        { grade: 'C', count: harvests.filter(h => h.grade === 'C').length },
      ],
    };

    return createResponse(stats);
  },

  getFinanceStats: async (tenantId: string): Promise<ApiResponse<FinanceStats>> => {
    await delay();
    simulateNetworkError();

    const payments = StorageService.getPayments().filter(p => p.tenantId === tenantId);

    const stats: FinanceStats = {
      pendingPayments: payments.filter(p => p.status === 'PENDING').length,
      paidPayments: payments.filter(p => p.status === 'PAID').length,
      monthlyPayouts: [], // TODO: Implement monthly payouts
      paymentStatus: [
        { status: 'PENDING', count: payments.filter(p => p.status === 'PENDING').length },
        { status: 'PAID', count: payments.filter(p => p.status === 'PAID').length },
        { status: 'OVERDUE', count: payments.filter(p => p.status === 'OVERDUE').length },
      ],
    };

    return createResponse(stats);
  },

  getFarmerStats: async (farmerId: string, tenantId: string): Promise<ApiResponse<FarmerStats>> => {
    await delay();
    simulateNetworkError();

    const harvests = StorageService.getHarvests().filter(h => h.tenantId === tenantId && h.farmerId === farmerId);
    const payments = StorageService.getPayments().filter(p => p.tenantId === tenantId && p.farmerId === farmerId);

    const stats: FarmerStats = {
      totalDeliveries: harvests.filter(h => h.status === 'APPROVED').length,
      totalEarnings: payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0),
      deliveryTrend: [], // TODO: Implement delivery trend
    };

    return createResponse(stats);
  },
};
