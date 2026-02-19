import {
  User,
  Farmer,
  Harvest,
  Batch,
  Payment,
  DashboardStats,
  LoginCredentials,
  ApiResponse,
  PaginatedResponse,
  Price,
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

// Farmers API
export const farmersApi = {
  getFarmers: async (tenantId: string): Promise<ApiResponse<Farmer[]>> => {
    await delay();
    simulateNetworkError();

    const farmers = getTenantData(mockFarmers, tenantId);
    return createResponse(farmers);
  },

  getFarmerById: async (id: string, tenantId: string): Promise<ApiResponse<Farmer>> => {
    await delay();
    simulateNetworkError();

    const farmer = getTenantData(mockFarmers, tenantId).find(f => f.id === id);
    if (!farmer) {
      throw new Error('Farmer not found');
    }

    return createResponse(farmer);
  },

  createFarmer: async (farmer: Omit<Farmer, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Farmer>> => {
    await delay();
    simulateNetworkError();

    const newFarmer: Farmer = {
      ...farmer,
      id: `farmer-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockFarmers.push(newFarmer);
    return createResponse(newFarmer, 'Farmer created successfully');
  },

  updateFarmer: async (id: string, updates: Partial<Farmer>, tenantId: string): Promise<ApiResponse<Farmer>> => {
    await delay();
    simulateNetworkError();

    const farmerIndex = getTenantData(mockFarmers, tenantId).findIndex(f => f.id === id);
    if (farmerIndex === -1) {
      throw new Error('Farmer not found');
    }

    const updatedFarmer = {
      ...mockFarmers[farmerIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    mockFarmers[farmerIndex] = updatedFarmer;
    return createResponse(updatedFarmer, 'Farmer updated successfully');
  },
};

// Harvests API
export const harvestsApi = {
  getHarvests: async (tenantId: string): Promise<ApiResponse<Harvest[]>> => {
    await delay();
    simulateNetworkError();

    const harvests = getTenantData(mockHarvests, tenantId);
    return createResponse(harvests);
  },

  getHarvestById: async (id: string, tenantId: string): Promise<ApiResponse<Harvest>> => {
    await delay();
    simulateNetworkError();

    const harvest = getTenantData(mockHarvests, tenantId).find(h => h.id === id);
    if (!harvest) {
      throw new Error('Harvest not found');
    }

    return createResponse(harvest);
  },

  createHarvest: async (harvest: Omit<Harvest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Harvest>> => {
    await delay();
    simulateNetworkError();

    const newHarvest: Harvest = {
      ...harvest,
      id: `harvest-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockHarvests.push(newHarvest);
    return createResponse(newHarvest, 'Harvest created successfully');
  },

  updateHarvest: async (id: string, updates: Partial<Harvest>, tenantId: string): Promise<ApiResponse<Harvest>> => {
    await delay();
    simulateNetworkError();

    const harvestIndex = getTenantData(mockHarvests, tenantId).findIndex(h => h.id === id);
    if (harvestIndex === -1) {
      throw new Error('Harvest not found');
    }

    const updatedHarvest = {
      ...mockHarvests[harvestIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    mockHarvests[harvestIndex] = updatedHarvest;
    return createResponse(updatedHarvest, 'Harvest updated successfully');
  },
};

// Batches API
export const batchesApi = {
  getBatches: async (tenantId: string): Promise<ApiResponse<Batch[]>> => {
    await delay();
    simulateNetworkError();

    const batches = getTenantData(mockBatches, tenantId);
    return createResponse(batches);
  },

  getBatchById: async (id: string, tenantId: string): Promise<ApiResponse<Batch>> => {
    await delay();
    simulateNetworkError();

    const batch = getTenantData(mockBatches, tenantId).find(b => b.id === id);
    if (!batch) {
      throw new Error('Batch not found');
    }

    return createResponse(batch);
  },

  createBatch: async (batch: Omit<Batch, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Batch>> => {
    await delay();
    simulateNetworkError();

    const newBatch: Batch = {
      ...batch,
      id: `batch-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockBatches.push(newBatch);
    return createResponse(newBatch, 'Batch created successfully');
  },
};

// Payments API
export const paymentsApi = {
  getPayments: async (tenantId: string): Promise<ApiResponse<Payment[]>> => {
    await delay();
    simulateNetworkError();

    const payments = getTenantData(mockPayments, tenantId);
    return createResponse(payments);
  },

  getPaymentById: async (id: string, tenantId: string): Promise<ApiResponse<Payment>> => {
    await delay();
    simulateNetworkError();

    const payment = getTenantData(mockPayments, tenantId).find(p => p.id === id);
    if (!payment) {
      throw new Error('Payment not found');
    }

    return createResponse(payment);
  },

  updatePaymentStatus: async (id: string, status: Payment['status'], tenantId: string): Promise<ApiResponse<Payment>> => {
    await delay();
    simulateNetworkError();

    const paymentIndex = getTenantData(mockPayments, tenantId).findIndex(p => p.id === id);
    if (paymentIndex === -1) {
      throw new Error('Payment not found');
    }

    const updatedPayment = {
      ...mockPayments[paymentIndex],
      status,
      paidDate: status === 'PAID' ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    };

    mockPayments[paymentIndex] = updatedPayment;
    return createResponse(updatedPayment, 'Payment status updated successfully');
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (tenantId: string): Promise<ApiResponse<DashboardStats>> => {
    await delay();
    simulateNetworkError();

    const farmers = getTenantData(mockFarmers, tenantId);
    const harvests = getTenantData(mockHarvests, tenantId);
    const payments = getTenantData(mockPayments, tenantId);
    const batches = getTenantData(mockBatches, tenantId);

    const today = new Date().toISOString().split('T')[0];
    const todayHarvests = harvests.filter(h => h.harvestDate.startsWith(today));
    const totalTodayWeight = todayHarvests.reduce((sum, h) => sum + h.weight, 0);

    const pendingPayments = payments.filter(p => p.status === 'PENDING');

    const stats: DashboardStats = {
      totalFarmers: farmers.length,
      todayHarvest: totalTodayWeight,
      pendingPayments: pendingPayments.length,
      totalBatches: batches.length,
    };

    return createResponse(stats);
  },
};

// Prices API
export const pricesApi = {
  getPrices: async (tenantId: string): Promise<ApiResponse<Price[]>> => {
    await delay();
    simulateNetworkError();

    const prices = getTenantData(mockPrices, tenantId);
    // Sort by effective date descending
    prices.sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());

    return createResponse(prices);
  },

  getLatestPrice: async (crop: string, tenantId: string): Promise<ApiResponse<Price | null>> => {
    await delay();
    simulateNetworkError();

    const prices = getTenantData(mockPrices, tenantId)
      .filter(p => p.crop === crop)
      .sort((a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime());

    return createResponse(prices.length > 0 ? prices[0] : null);
  },

  createPrice: async (price: Omit<Price, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Price>> => {
    await delay();
    simulateNetworkError();

    const newPrice: Price = {
      ...price,
      id: `price-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockPrices.push(newPrice);
    return createResponse(newPrice, 'Price configuration saved successfully');
  },
};
