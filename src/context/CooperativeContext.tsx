/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { useCooperativeStore } from '../store/cooperativeStore';
import { cooperativesApi } from '../services/mockApi';
import { Cooperative } from '../types';

interface CooperativeContextType {
  cooperative: Cooperative | null;
  isActive: boolean;
  loading: boolean;
  error: string | null;
  refreshCooperative: () => Promise<void>;
}

const CooperativeContext = createContext<CooperativeContextType | undefined>(undefined);

interface CooperativeProviderProps {
  children: ReactNode;
}

export const CooperativeProvider: React.FC<CooperativeProviderProps> = ({ children }) => {
  const { currentUser } = useCooperativeStore();
  const [cooperative, setCooperative] = useState<Cooperative | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCooperative = useCallback(async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // For now, we'll assume the tenantId corresponds to cooperative ID
      // In a real app, you'd have a mapping between users and cooperatives
      const response = await cooperativesApi.getCooperatives();
      const userCooperative = response.data.find(c => c.id === currentUser.tenantId);

      if (!userCooperative) {
        setError('Cooperative not found. Please contact system administrator.');
        return;
      }

      setCooperative(userCooperative);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cooperative';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const refreshCooperative = async () => {
    await fetchCooperative();
  };

  useEffect(() => {
    fetchCooperative();
  }, [currentUser, fetchCooperative]);

  const isActive = cooperative?.status === 'ACTIVE';

  const value: CooperativeContextType = {
    cooperative,
    isActive,
    loading,
    error,
    refreshCooperative,
  };

  return (
    <CooperativeContext.Provider value={value}>
      {children}
    </CooperativeContext.Provider>
  );
};

export const useCooperative = () => {
  const context = useContext(CooperativeContext);
  if (context === undefined) {
    throw new Error('useCooperative must be used within a CooperativeProvider');
  }
  return context;
};