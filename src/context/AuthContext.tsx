import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials } from '../types';
import { authApi } from '../services/mockApi';

// Auth action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Initial auth state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: undefined,
      };
    default:
      return state;
  }
};

// Auth context interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('smartcoop_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('smartcoop_user');
      }
    }
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<void> => {
    console.log('=== AUTH CONTEXT LOGIN ===');
    console.log('Credentials received:', credentials);
    
    try {
      console.log('Dispatching LOGIN_START');
      dispatch({ type: 'LOGIN_START' });
      
      console.log('Calling authApi.login...');
      const response = await authApi.login(credentials);
      console.log('authApi.login response:', response);
      
      // Store user in localStorage
      localStorage.setItem('smartcoop_user', JSON.stringify(response.data));
      console.log('User stored in localStorage');
      
      console.log('Dispatching LOGIN_SUCCESS');
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      console.log('Login process completed');
    } catch (error) {
      console.log('Login error caught:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.log('Dispatching LOGIN_FAILURE with:', errorMessage);
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  // Logout function
  const logout = (): void => {
    localStorage.removeItem('smartcoop_user');
    dispatch({ type: 'LOGOUT' });
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
