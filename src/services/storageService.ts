import { Farmer, Harvest, Batch, Payment, Price, Cooperative, User } from '../types';

const STORAGE_KEYS = {
  COOPERATIVES: 'smartcoop_cooperatives',
  USERS: 'smartcoop_users',
  FARMERS: 'smartcoop_farmers',
  HARVESTS: 'smartcoop_harvests',
  BATCHES: 'smartcoop_batches',
  PAYMENTS: 'smartcoop_payments',
  PRICES: 'smartcoop_prices',
} as const;

export class StorageService {
  // Generic storage methods
  private static getFromStorage<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading from localStorage key ${key}:`, error);
      return [];
    }
  }

  static saveToStorage<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing to localStorage key ${key}:`, error);
    }
  }

  // Cooperative methods
  static getCooperatives(): Cooperative[] {
    return this.getFromStorage<Cooperative>(STORAGE_KEYS.COOPERATIVES);
  }

  static saveCooperative(cooperative: Omit<Cooperative, 'id' | 'createdAt' | 'updatedAt'>): Cooperative {
    const cooperatives = this.getCooperatives();
    const newCooperative: Cooperative = {
      ...cooperative,
      id: `coop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedCooperatives = [...cooperatives, newCooperative];
    this.saveToStorage(STORAGE_KEYS.COOPERATIVES, updatedCooperatives);

    return newCooperative;
  }

  static updateCooperative(id: string, updates: Partial<Cooperative>): Cooperative | null {
    const cooperatives = this.getCooperatives();
    const index = cooperatives.findIndex(c => c.id === id);

    if (index === -1) return null;

    const updatedCooperative: Cooperative = {
      ...cooperatives[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedCooperatives = [...cooperatives];
    updatedCooperatives[index] = updatedCooperative;
    this.saveToStorage(STORAGE_KEYS.COOPERATIVES, updatedCooperatives);

    return updatedCooperative;
  }

  // User methods
  static getUsers(): User[] {
    return this.getFromStorage<User>(STORAGE_KEYS.USERS);
  }

  static saveUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    this.saveToStorage(STORAGE_KEYS.USERS, updatedUsers);

    return newUser;
  }

  static updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) return null;

    const updatedUser: User = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedUsers = [...users];
    updatedUsers[index] = updatedUser;
    this.saveToStorage(STORAGE_KEYS.USERS, updatedUsers);

    return updatedUser;
  }

  // Farmer methods
  static getFarmers(): Farmer[] {
    return this.getFromStorage<Farmer>(STORAGE_KEYS.FARMERS);
  }

  static saveFarmer(farmer: Omit<Farmer, 'id' | 'createdAt' | 'updatedAt'>): Farmer {
    const farmers = this.getFarmers();
    const newFarmer: Farmer = {
      ...farmer,
      id: `farmer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedFarmers = [...farmers, newFarmer];
    this.saveToStorage(STORAGE_KEYS.FARMERS, updatedFarmers);

    return newFarmer;
  }

  static updateFarmer(id: string, updates: Partial<Farmer>): Farmer | null {
    const farmers = this.getFarmers();
    const index = farmers.findIndex(f => f.id === id);

    if (index === -1) return null;

    const updatedFarmer: Farmer = {
      ...farmers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedFarmers = [...farmers];
    updatedFarmers[index] = updatedFarmer;
    this.saveToStorage(STORAGE_KEYS.FARMERS, updatedFarmers);

    return updatedFarmer;
  }

  static deleteFarmer(id: string): boolean {
    const farmers = this.getFarmers();
    const updatedFarmers = farmers.filter(f => f.id !== id);

    if (updatedFarmers.length === farmers.length) return false;

    this.saveToStorage(STORAGE_KEYS.FARMERS, updatedFarmers);
    return true;
  }

  // Harvest methods
  static getHarvests(): Harvest[] {
    return this.getFromStorage<Harvest>(STORAGE_KEYS.HARVESTS);
  }

  static saveHarvest(harvest: Omit<Harvest, 'id' | 'createdAt' | 'updatedAt'>): Harvest {
    const harvests = this.getHarvests();
    const newHarvest: Harvest = {
      ...harvest,
      id: `harvest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedHarvests = [...harvests, newHarvest];
    this.saveToStorage(STORAGE_KEYS.HARVESTS, updatedHarvests);

    return newHarvest;
  }

  static updateHarvest(id: string, updates: Partial<Harvest>): Harvest | null {
    const harvests = this.getHarvests();
    const index = harvests.findIndex(h => h.id === id);

    if (index === -1) return null;

    const updatedHarvest: Harvest = {
      ...harvests[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedHarvests = [...harvests];
    updatedHarvests[index] = updatedHarvest;
    this.saveToStorage(STORAGE_KEYS.HARVESTS, updatedHarvests);

    return updatedHarvest;
  }

  static deleteHarvest(id: string): boolean {
    const harvests = this.getHarvests();
    const updatedHarvests = harvests.filter(h => h.id !== id);

    if (updatedHarvests.length === harvests.length) return false;

    this.saveToStorage(STORAGE_KEYS.HARVESTS, updatedHarvests);
    return true;
  }

  // Batch methods
  static getBatches(): Batch[] {
    return this.getFromStorage<Batch>(STORAGE_KEYS.BATCHES);
  }

  static saveBatch(batch: Omit<Batch, 'id' | 'createdAt' | 'updatedAt'>): Batch {
    const batches = this.getBatches();
    const newBatch: Batch = {
      ...batch,
      id: `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedBatches = [...batches, newBatch];
    this.saveToStorage(STORAGE_KEYS.BATCHES, updatedBatches);

    return newBatch;
  }

  static updateBatch(id: string, updates: Partial<Batch>): Batch | null {
    const batches = this.getBatches();
    const index = batches.findIndex(b => b.id === id);

    if (index === -1) return null;

    const updatedBatch: Batch = {
      ...batches[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedBatches = [...batches];
    updatedBatches[index] = updatedBatch;
    this.saveToStorage(STORAGE_KEYS.BATCHES, updatedBatches);

    return updatedBatch;
  }

  static deleteBatch(id: string): boolean {
    const batches = this.getBatches();
    const updatedBatches = batches.filter(b => b.id !== id);

    if (updatedBatches.length === batches.length) return false;

    this.saveToStorage(STORAGE_KEYS.BATCHES, updatedBatches);
    return true;
  }

  // Payment methods
  static getPayments(): Payment[] {
    return this.getFromStorage<Payment>(STORAGE_KEYS.PAYMENTS);
  }

  static savePayment(payment: Omit<Payment, 'id'>): Payment {
    const payments = this.getPayments();
    const newPayment: Payment = {
      ...payment,
      id: `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedPayments = [...payments, newPayment];
    this.saveToStorage(STORAGE_KEYS.PAYMENTS, updatedPayments);

    return newPayment;
  }

  static updatePayment(id: string, updates: Partial<Payment>): Payment | null {
    const payments = this.getPayments();
    const index = payments.findIndex(p => p.id === id);

    if (index === -1) return null;

    const updatedPayment: Payment = {
      ...payments[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedPayments = [...payments];
    updatedPayments[index] = updatedPayment;
    this.saveToStorage(STORAGE_KEYS.PAYMENTS, updatedPayments);

    return updatedPayment;
  }

  static deletePayment(id: string): boolean {
    const payments = this.getPayments();
    const updatedPayments = payments.filter(p => p.id !== id);

    if (updatedPayments.length === payments.length) return false;

    this.saveToStorage(STORAGE_KEYS.PAYMENTS, updatedPayments);
    return true;
  }

  // Price and calculation methods
  static getPrices(): Price[] {
    return this.getFromStorage<Price>('smartcoop_prices');
  }

  static savePrice(price: Omit<Price, 'id' | 'createdAt' | 'updatedAt'>): Price {
    const prices = this.getPrices();
    const newPrice: Price = {
      ...price,
      id: `price-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedPrices = [...prices, newPrice];
    this.saveToStorage('smartcoop_prices', updatedPrices);

    return newPrice;
  }

  static calculatePaymentAmount(batchId: string, farmerId: string, tenantId: string): number {
    const batches = this.getBatches().filter(b => b.tenantId === tenantId);
    const batch = batches.find(b => b.id === batchId);

    if (!batch) return 0;

    // Get harvests for this farmer in this batch
    const harvests = this.getHarvests().filter(h =>
      h.tenantId === tenantId &&
      h.farmerId === farmerId &&
      batch.harvestIds.includes(h.id)
    );

    if (harvests.length === 0) return 0;

    const prices = this.getPrices().filter(p => p.tenantId === tenantId);

    // Calculate payment based on harvests
    let totalAmount = 0;
    for (const harvest of harvests) {
      const price = prices.find(p => p.cropType === harvest.crop);
      if (price) {
        // Use the price corresponding to the harvest grade, defaulting to C if not found
        const gradePrice = price.pricePerKg[harvest.grade as keyof typeof price.pricePerKg] || price.pricePerKg.C;
        totalAmount += harvest.weight * gradePrice;
      }
    }

    return totalAmount;
  }

  static getPendingPayments(tenantId: string): Payment[] {
    return this.getPayments()
      .filter(p => p.tenantId === tenantId && p.status === 'PENDING')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static getFarmerPayments(farmerId: string, tenantId: string): Payment[] {
    return this.getPayments()
      .filter(p => p.tenantId === tenantId && p.farmerId === farmerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Utility methods
  static clearAllData(): void {
    if (typeof window === 'undefined') return;

    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  static getStorageSize(): string {
    if (typeof window === 'undefined') return '0 KB';

    let totalSize = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        totalSize += new Blob([data]).size;
      }
    });

    return `${(totalSize / 1024).toFixed(2)} KB`;
  }
}
