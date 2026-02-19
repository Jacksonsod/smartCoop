import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoginCredentials } from '../types';

const DebugAuth: React.FC = () => {
  const { user, isAuthenticated, login, error } = useAuth();

  useEffect(() => {
    console.log('=== AUTH DEBUG ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user:', user);
    console.log('error:', error);
  }, [user, isAuthenticated, error]);

  const handleTestLogin = async () => {
    try {
      console.log('=== ATTEMPTING LOGIN ===');
      const credentials: LoginCredentials = {
        username: 'admin',
        password: 'password',
      };
      await login(credentials);
      console.log('=== LOGIN COMPLETED ===');
    } catch (err) {
      console.error('=== LOGIN ERROR ===', err);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'monospace' }}>
      <h2>🔍 Authentication Debug</h2>
      
      <div style={{ marginBottom: 20 }}>
        <h3>Current State:</h3>
        <p><strong>Authenticated:</strong> {isAuthenticated.toString()}</p>
        <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'null'}</p>
        <p><strong>Error:</strong> {error || 'none'}</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button 
          onClick={handleTestLogin}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer' 
          }}
        >
          Test Login (admin/password)
        </button>
      </div>

      <div style={{ marginTop: 20, fontSize: '12px', color: '#666' }}>
        <h4>Instructions:</h4>
        <p>1. Click "Test Login" button</p>
        <p>2. Check console for authentication state changes</p>
        <p>3. If successful, try real login page</p>
      </div>
    </div>
  );
};

export default DebugAuth;
