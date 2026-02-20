import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Cooperative, CooperativeStatus, User, Payment, Farmer, Harvest, Price, Batch } from '../types';
import { mockUsers, mockCooperatives } from '../data/mockData';

interface CooperativeState {
  currentCooperative: Cooperative | null;
  currentUser: User | null;
  cooperatives: Cooperative[];
  users: User[];
  farmers: Farmer[];
  harvests: Harvest[];
  prices: Price[];
  batches: Batch[];
  isLoading: boolean;
  error: string | null;
}

interface CooperativeActions {
  // Cooperative management
  registerCooperative: (cooperativeData: Omit<Cooperative, 'id' | 'createdAt' | 'updatedAt' | 'approvedAt' | 'activatedAt' | 'suspendedAt'>) => Promise<void>;
  approveCooperative: (id: string) => Promise<void>;
  rejectCooperative: (id: string, _: string) => Promise<void>;
  activateCooperative: (id: string) => Promise<void>;
  suspendCooperative: (id: string, _: string) => Promise<void>;

  // User management
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;

  // Auth
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  // State
  setCurrentCooperative: (cooperative: Cooperative | null) => void;
  setCurrentUser: (user: User | null) => void;
  clearError: () => void;

  // Payments
  payments: Payment[];
  fetchPayments: () => Promise<void>;
  updatePayment: (id: string, updates: Partial<Payment>) => Promise<void>;
  createPayment: (paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;

  // Farmers
  fetchFarmers: () => Promise<void>;
  createFarmer: (farmerData: Omit<Farmer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateFarmer: (id: string, updates: Partial<Farmer>) => Promise<void>;

  // Harvests
  fetchHarvests: () => Promise<void>;
  recordHarvest: (harvestData: Omit<Harvest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateHarvest: (id: string, updates: Partial<Harvest>) => Promise<void>;

  // Batches
  fetchBatches: () => Promise<void>;
  createBatch: (batchData: Omit<Batch, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBatch: (id: string, updates: Partial<Batch>) => Promise<void>;
  processBatchPayments: (batchId: string) => Promise<void>;

  // Prices
  fetchPrices: () => Promise<void>;
  updatePrices: (prices: Price[]) => Promise<void>;
}

type CooperativeStore = CooperativeState & CooperativeActions;

export const useCooperativeStore = create<CooperativeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentCooperative: null,
      currentUser: null,
      cooperatives: [],
      users: [],
      payments: [],
      farmers: [],
      harvests: [],
      batches: [],
      prices: [],
      isLoading: false,
      error: null,

      // Cooperative actions
      registerCooperative: async (cooperativeData: Omit<Cooperative, 'id' | 'createdAt' | 'updatedAt' | 'approvedAt' | 'activatedAt' | 'suspendedAt'>) => {
        set({ isLoading: true, error: null });
        try {
          const newCooperative: Cooperative = {
            ...cooperativeData,
            id: `coop-${Date.now()}`,
            status: 'PENDING_APPROVAL',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Store in localStorage for persistence
          const cooperatives = JSON.parse(localStorage.getItem('cooperatives') || '[]') as Cooperative[];
          cooperatives.push(newCooperative);
          localStorage.setItem('cooperatives', JSON.stringify(cooperatives));

          set((state) => ({
            ...state,
            cooperatives: [...state.cooperatives, newCooperative],
            isLoading: false,
          }));
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false
          }));
        }
      },

      approveCooperative: async (id: string) => {
        set({ isLoading: true });
        try {
          const cooperatives = JSON.parse(localStorage.getItem('cooperatives') || '[]') as Cooperative[];
          const updatedCooperatives = cooperatives.map((coop: Cooperative) =>
            coop.id === id
              ? { ...coop, status: 'APPROVED' as CooperativeStatus, approvedAt: new Date().toISOString() }
              : coop
          );

          localStorage.setItem('cooperatives', JSON.stringify(updatedCooperatives));
          set((state: CooperativeStore) => ({
            ...state,
            cooperatives: updatedCooperatives,
            isLoading: false,
          }));
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'Approval failed',
            isLoading: false
          }));
        }
      },

      rejectCooperative: async (id: string, _: string) => {
        set({ isLoading: true });
        try {
          const cooperatives = JSON.parse(localStorage.getItem('cooperatives') || '[]') as Cooperative[];
          const updatedCooperatives = cooperatives.map((coop: Cooperative) =>
            coop.id === id
              ? { ...coop, status: 'SUSPENDED' as CooperativeStatus, suspendedAt: new Date().toISOString() }
              : coop
          );

          localStorage.setItem('cooperatives', JSON.stringify(updatedCooperatives));
          set((state) => ({
            ...state,
            cooperatives: updatedCooperatives,
            isLoading: false,
          }));
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'Rejection failed',
            isLoading: false
          }));
        }
      },

      activateCooperative: async (id: string) => {
        set({ isLoading: true });
        try {
          const cooperatives = JSON.parse(localStorage.getItem('cooperatives') || '[]') as Cooperative[];
          const updatedCooperatives = cooperatives.map((coop: Cooperative) =>
            coop.id === id
              ? { ...coop, status: 'ACTIVE' as CooperativeStatus, activatedAt: new Date().toISOString() }
              : coop
          );

          localStorage.setItem('cooperatives', JSON.stringify(updatedCooperatives));
          set((state) => {
            const currentState = get();
            return {
              ...state,
              cooperatives: updatedCooperatives,
              currentCooperative: currentState.currentCooperative?.id === id
                ? { ...currentState.currentCooperative, status: 'ACTIVE' as CooperativeStatus, activatedAt: new Date().toISOString() }
                : currentState.currentCooperative,
              isLoading: false,
            };
          });
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'Activation failed',
            isLoading: false
          }));
        }
      },

      suspendCooperative: async (id: string, _: string) => {
        set({ isLoading: true });
        try {
          const cooperatives = JSON.parse(localStorage.getItem('cooperatives') || '[]') as Cooperative[];
          const updatedCooperatives = cooperatives.map((coop: Cooperative) =>
            coop.id === id
              ? { ...coop, status: 'SUSPENDED' as CooperativeStatus, suspendedAt: new Date().toISOString() }
              : coop
          );

          localStorage.setItem('cooperatives', JSON.stringify(updatedCooperatives));
          set((state) => ({
            ...state,
            cooperatives: updatedCooperatives,
            isLoading: false,
          }));
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'Suspension failed',
            isLoading: false
          }));
        }
      },

      // User actions
      createUser: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) => {
        set({ isLoading: true });
        try {
          const newUser: User = {
            ...userData,
            id: `user-${Date.now()}`,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));

          set((state: CooperativeStore) => ({
            ...state,
            users: [...state.users, newUser],
            isLoading: false,
          }));
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'User creation failed',
            isLoading: false
          }));
        }
      },

      updateUser: async (id: string, updates: Partial<User>) => {
        set({ isLoading: true });
        try {
          const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
          const updatedUsers = users.map((user: User) =>
            user.id === id ? { ...user, ...updates, updatedAt: new Date().toISOString() } : user
          );

          localStorage.setItem('users', JSON.stringify(updatedUsers));
          set((state: CooperativeStore) => ({
            ...state,
            users: updatedUsers,
            isLoading: false,
          }));
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'User update failed',
            isLoading: false
          }));
        }
      },

      // Auth
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const storedUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];
          let user = storedUsers.find((u: User) => u.email === email && u.isActive);

          if (!user) {
            user = mockUsers.find((u: User) => u.email === email || u.username === email || (email === 'superadmin@smartcoop.com' && u.username === 'superadmin'));
          }

          if (user) {
            // Mock password check
            if (password === 'password123') { // Simple mock for demo
              localStorage.setItem('currentUser', JSON.stringify(user));
              set((state: CooperativeStore) => ({
                ...state,
                currentUser: user,
                isLoading: false
              }));

              // Load cooperative if user belongs to one
              const coopId = user.tenantId || (user as any).cooperativeId;
              if (coopId && coopId !== 'system') {
                const cooperatives = JSON.parse(localStorage.getItem('cooperatives') || '[]') as Cooperative[];
                let cooperative = cooperatives.find((c: Cooperative) => c.id === coopId);

                if (!cooperative) {
                  cooperative = mockCooperatives.find(c => c.id === coopId);
                }

                set((state: CooperativeStore) => ({
                  ...state,
                  currentCooperative: cooperative || null,
                }));
              }

              return;
            }
          }

          set(() => ({
            error: 'Invalid credentials',
            isLoading: false
          }));
          return;
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false
          }));
        }
        return;
      },

      logout: async () => {
        localStorage.removeItem('currentUser');
        set((state: CooperativeStore) => ({
          ...state,
          currentUser: null,
          error: null
        }));
      },

      // Payment Actions
      fetchPayments: async () => {
        set({ isLoading: true });
        try {
          // In a real app, this would be an API call
          let payments = JSON.parse(localStorage.getItem('payments') || '[]') as Payment[];

          // Generate mock payments if none exist (for demo purposes)
          if (payments.length === 0) {
            payments = [
              {
                id: 'payment-1',
                farmerId: 'farmer-1',
                batchId: 'batch-1',
                farmerName: 'John Farmer',
                cropType: 'Maize',
                weight: 500,
                grade: 'Grade A',
                amount: 25000,
                status: 'PENDING',
                harvestDate: '2024-01-15',
                dueDate: '2024-02-15',
                tenantId: 'tenant-1',
                createdAt: '2024-01-16',
                updatedAt: '2024-01-16',
              },
              {
                id: 'payment-2',
                farmerId: 'farmer-2',
                batchId: 'batch-2',
                farmerName: 'Mary Farmer',
                cropType: 'Beans',
                weight: 300,
                grade: 'Grade B',
                amount: 13500,
                status: 'PAID',
                paidDate: '2024-01-17',
                transactionRef: 'TXN-001',
                harvestDate: '2024-01-14',
                dueDate: '2024-02-14',
                tenantId: 'tenant-1',
                createdAt: '2024-01-15',
                updatedAt: '2024-01-17',
              },
              {
                id: 'payment-3',
                farmerId: 'farmer-3',
                batchId: 'batch-3',
                farmerName: 'David Farmer',
                cropType: 'Coffee',
                weight: 200,
                grade: 'Grade A',
                amount: 12000,
                status: 'PENDING',
                harvestDate: '2024-01-13',
                dueDate: '2024-02-13',
                tenantId: 'tenant-1',
                createdAt: '2024-01-14',
                updatedAt: '2024-01-14',
              },
            ] as Payment[];
            localStorage.setItem('payments', JSON.stringify(payments));
          }

          set((state) => ({
            ...state,
            payments,
            isLoading: false
          }));
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'Failed to fetch payments',
            isLoading: false
          }));
        }
      },

      updatePayment: async (id: string, updates: Partial<Payment>) => {
        set({ isLoading: true });
        try {
          const payments = JSON.parse(localStorage.getItem('payments') || '[]') as Payment[];
          const updatedPayments = payments.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          );

          localStorage.setItem('payments', JSON.stringify(updatedPayments));
          set((state) => ({
            ...state,
            payments: updatedPayments,
            isLoading: false
          }));
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'Failed to update payment',
            isLoading: false
          }));
        }
      },

      createPayment: async (paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => {
        set({ isLoading: true });
        try {
          const newPayment: Payment = {
            ...paymentData,
            id: `pay-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const payments = JSON.parse(localStorage.getItem('payments') || '[]') as Payment[];
          payments.push(newPayment);
          localStorage.setItem('payments', JSON.stringify(payments));

          set((state) => ({
            ...state,
            payments: [...state.payments, newPayment],
            isLoading: false
          }));
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'Failed to create payment',
            isLoading: false
          }));
        }
      },

      // Farmer Actions
      fetchFarmers: async () => {
        set({ isLoading: true });
        try {
          let farmers = JSON.parse(localStorage.getItem('farmers') || '[]') as Farmer[];
          set((state) => ({
            ...state,
            farmers,
            isLoading: false
          }));
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'Failed to fetch farmers',
            isLoading: false
          }));
        }
      },

      createFarmer: async (farmerData: Omit<Farmer, 'id' | 'createdAt' | 'updatedAt'>) => {
        set({ isLoading: true });
        try {
          const newFarmer: Farmer = {
            ...farmerData,
            id: `farmer-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const farmers = JSON.parse(localStorage.getItem('farmers') || '[]') as Farmer[];
          farmers.push(newFarmer);
          localStorage.setItem('farmers', JSON.stringify(farmers));

          set((state) => ({
            ...state,
            farmers: [...state.farmers, newFarmer],
            isLoading: false
          }));
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'Failed to create farmer',
            isLoading: false
          }));
        }
      },

      updateFarmer: async (id: string, updates: Partial<Farmer>) => {
        set({ isLoading: true });
        try {
          const farmers = JSON.parse(localStorage.getItem('farmers') || '[]') as Farmer[];
          const updatedFarmers = farmers.map((f) =>
            f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f
          );

          localStorage.setItem('farmers', JSON.stringify(updatedFarmers));
          set((state) => ({
            ...state,
            farmers: updatedFarmers,
            isLoading: false
          }));
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'Failed to update farmer',
            isLoading: false
          }));
        }
      },

      // Harvest Actions
      fetchHarvests: async () => {
        set({ isLoading: true });
        try {
          let harvests = JSON.parse(localStorage.getItem('harvests') || '[]') as Harvest[];
          set((state) => ({
            ...state,
            harvests,
            isLoading: false
          }));
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'Failed to fetch harvests',
            isLoading: false
          }));
        }
      },

      recordHarvest: async (harvestData: Omit<Harvest, 'id' | 'createdAt' | 'updatedAt'>) => {
        set({ isLoading: true });
        try {
          const newHarvest: Harvest = {
            ...harvestData,
            id: `harv-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const harvests = JSON.parse(localStorage.getItem('harvests') || '[]') as Harvest[];
          harvests.push(newHarvest);
          localStorage.setItem('harvests', JSON.stringify(harvests));

          set((state) => ({
            ...state,
            harvests: [...state.harvests, newHarvest],
            isLoading: false
          }));
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'Failed to record harvest',
            isLoading: false
          }));
        }
      },

      updateHarvest: async (id: string, updates: Partial<Harvest>) => {
        set({ isLoading: true });
        try {
          const harvests = JSON.parse(localStorage.getItem('harvests') || '[]') as Harvest[];
          const updatedHarvests = harvests.map((h) =>
            h.id === id ? { ...h, ...updates, updatedAt: new Date().toISOString() } : h
          );

          localStorage.setItem('harvests', JSON.stringify(updatedHarvests));
          set((state) => ({
            ...state,
            harvests: updatedHarvests,
            isLoading: false
          }));
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'Failed to update harvest',
            isLoading: false
          }));
        }
      },

      // Price Actions
      fetchPrices: async () => {
        set({ isLoading: true });
        try {
          let prices = JSON.parse(localStorage.getItem('prices') || '[]') as Price[];
          if (prices.length === 0) {
            prices = [
              {
                id: 'price-1',
                cropType: 'MAIZE',
                pricePerKg: { A: 50, B: 40, C: 30 },
                currency: 'USD',
                status: 'ACTIVE',
                effectiveDate: new Date().toISOString(),
                tenantId: 'tenant-001',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                id: 'price-2',
                cropType: 'WHEAT',
                pricePerKg: { A: 60, B: 50, C: 40 },
                currency: 'USD',
                status: 'ACTIVE',
                effectiveDate: new Date().toISOString(),
                tenantId: 'tenant-001',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            ];
            localStorage.setItem('prices', JSON.stringify(prices));
          }
          set((state) => ({
            ...state,
            prices,
            isLoading: false
          }));
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'Failed to fetch prices',
            isLoading: false
          }));
        }
      },

      updatePrices: async (prices: Price[]) => {
        set({ isLoading: true });
        try {
          localStorage.setItem('prices', JSON.stringify(prices));
          set((state) => ({
            ...state,
            prices,
            isLoading: false
          }));
        } catch (error) {
          set(() => ({
            error: error instanceof Error ? error.message : 'Failed to update prices',
            isLoading: false
          }));
        }
      },

      // State setters
      setCurrentCooperative: (cooperative: Cooperative | null) =>
        set({ currentCooperative: cooperative }),

      setCurrentUser: (user: User | null) =>
        set({ currentUser: user }),

      clearError: () => set({ error: null }),

      // Batches implementation
      fetchBatches: async () => {
        set({ isLoading: true });
        try {
          const storedBatches = localStorage.getItem('batches');
          const batches = storedBatches ? JSON.parse(storedBatches) : [];
          set({ batches, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      createBatch: async (batchData) => {
        set({ isLoading: true });
        try {
          const currentBatchesString = localStorage.getItem('batches');
          const currentBatches: Batch[] = currentBatchesString ? JSON.parse(currentBatchesString) : [];

          const newBatch: Batch = {
            ...batchData,
            id: `batch-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const updatedBatches = [newBatch, ...currentBatches];
          localStorage.setItem('batches', JSON.stringify(updatedBatches));

          set((state) => ({
            ...state,
            batches: updatedBatches,
            isLoading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      updateBatch: async (id, updates) => {
        set({ isLoading: true });
        try {
          const currentBatchesString = localStorage.getItem('batches');
          const currentBatches: Batch[] = currentBatchesString ? JSON.parse(currentBatchesString) : [];

          const updatedBatches = currentBatches.map(batch =>
            batch.id === id ? { ...batch, ...updates, updatedAt: new Date().toISOString() } : batch
          );

          localStorage.setItem('batches', JSON.stringify(updatedBatches));
          set((state) => ({
            ...state,
            batches: updatedBatches,
            isLoading: false
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      processBatchPayments: async (batchId: string) => {
        set({ isLoading: true });
        try {
          const { batches, harvests, prices, createPayment, updateBatch } = get();
          const batch = batches.find(b => b.id === batchId);
          if (!batch) throw new Error('Batch not found');

          const batchHarvests = harvests.filter(h => batch.harvestIds.includes(h.id));

          for (const harvest of batchHarvests) {
            // Find price for this crop type
            const priceConfig = prices.find(p => p.cropType === harvest.crop);
            if (!priceConfig) throw new Error(`Price not configured for ${harvest.crop}`);

            const pricePerKg = priceConfig.pricePerKg[harvest.grade];
            const amount = harvest.weight * pricePerKg;

            await createPayment({
              farmerId: harvest.farmerId,
              batchId: batch.id,
              amount,
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
              status: 'PENDING',
              tenantId: batch.tenantId,
              farmerName: undefined, // Will be filled by UI or joining
              cropType: harvest.crop,
              weight: harvest.weight,
              grade: harvest.grade,
              harvestDate: harvest.harvestDate
            });
          }

          await updateBatch(batch.id, { status: 'COMPLETED' });
          set({ isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'smartcoop-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        currentCooperative: state.currentCooperative
      }),
    }
  )
);
