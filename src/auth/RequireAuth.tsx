import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Debug logging
  console.log('RequireAuth Debug:', {
    isAuthenticated,
    user: user ? JSON.stringify(user) : null,
    loading,
    allowedRoles,
  });

  // Handle navigation when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User authenticated, should render children');
    }
  }, [isAuthenticated]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('Redirecting to login - not authenticated');
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    console.log('Access denied - user role:', user.role, 'allowed roles:', allowedRoles);
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
        }}
      >
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  // Render children if authenticated and authorized
  console.log('Rendering children - authenticated and authorized');
  console.log('Children to render:', children);
  return <>{children}</>;
};

export default RequireAuth;
