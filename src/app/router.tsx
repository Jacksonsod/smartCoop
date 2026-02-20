/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useCooperativeStore } from '../store/cooperativeStore';
import { UserRole } from '../types/cooperative';

// Layout Components
import SuperAdminLayout from '../layouts/SuperAdminLayout';
import CooperativeLayout from '../layouts/CooperativeLayout';
import ClerkLayout from '../layouts/ClerkLayout';
import FarmerLayout from '../layouts/FarmerLayout';
import FinanceLayout from '../layouts/FinanceLayout';

// Auth Components
import Login from '../auth/Login';

// Module Components
import SuperAdminDashboard from '../modules/super-admin/SuperAdminDashboard';
import CooperativeManagement from '../modules/super-admin/CooperativeManagement';
import CooperativeDashboard from '../modules/cooperative/CooperativeDashboard';
import FarmerRegistration from '../modules/farmers/FarmerRegistration';
import HarvestRecording from '../modules/harvests/HarvestRecording';
import QualityVerification from '../modules/harvests/QualityVerification';
import BatchList from '../modules/batches/BatchList';
import PaymentList from '../modules/payments/PaymentList';
import FinanceDashboard from '../modules/finance/FinanceDashboard';
import FarmerDashboard from '../modules/farmers/FarmerDashboard';
import MyHarvests from '../modules/farmers/MyHarvests';
import MyPayments from '../modules/farmers/MyPayments';
import UserManagement from '../modules/users/UserManagement';
import PriceConfig from '../modules/pricing/PriceConfig';
import CooperativeSettings from '../modules/cooperative/CooperativeSettings';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: UserRole[] }> = ({
  children,
  allowedRoles
}) => {
  // We need to use the hook inside the component
  const storeUser = useCooperativeStore((state) => state.currentUser);
  const storeCoop = useCooperativeStore((state) => state.currentCooperative);

  // Check if cooperative is active
  if (storeCoop && storeCoop.status !== 'ACTIVE') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Cooperative Not Active</h2>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                Your cooperative is not yet approved. Please contact system administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has required role
  if (!storeUser) {
    console.log('ProtectedRoute: Access Denied. No User.', { path: window.location.pathname });
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(storeUser.role)) {
    console.log('ProtectedRoute: Access Denied. Role Mismatch.', {
      userRole: storeUser.role,
      allowed: allowedRoles,
      path: window.location.pathname
    });
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/super-admin',
    element: (
      <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
        <SuperAdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/super-admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <SuperAdminDashboard />,
      },
      {
        path: 'cooperatives',
        element: <CooperativeManagement />,
      },
    ],
  },
  {
    path: '/cooperative',
    element: (
      <ProtectedRoute allowedRoles={['COOPERATIVE_ADMIN']}>
        <CooperativeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/cooperative/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <CooperativeDashboard />,
      },
      {
        path: 'farmers/register',
        element: <FarmerRegistration />,
      },
      {
        path: 'users',
        element: <UserManagement />,
      },
      {
        path: 'crops',
        element: <PriceConfig />,
      },
      {
        path: 'settings',
        element: <CooperativeSettings />,
      },
    ],
  },
  {
    path: '/clerk',
    element: (
      <ProtectedRoute allowedRoles={['CLERK']}>
        <ClerkLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/clerk/harvests" replace />,
      },
      {
        path: 'harvests',
        element: <HarvestRecording />,
      },
      {
        path: 'batches',
        element: <BatchList />,
      },
      {
        path: 'farmers',
        element: <FarmerRegistration />,
      },
    ],
  },
  {
    path: '/inspector',
    element: (
      <ProtectedRoute allowedRoles={['QUALITY_INSPECTOR']}>
        <ClerkLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/inspector/verification" replace />,
      },
      {
        path: 'verification',
        element: <QualityVerification />,
      },
    ],
  },
  {
    path: '/finance',
    element: (
      <ProtectedRoute allowedRoles={['FINANCE_OFFICER']}>
        <FinanceLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <FinanceDashboard />,
      },
      {
        path: 'payments',
        element: <PaymentList />,
      },
      {
        path: 'batches',
        element: <BatchList />,
      },
    ],
  },
  {
    path: '/farmer',
    element: (
      <ProtectedRoute allowedRoles={['FARMER']}>
        <FarmerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <FarmerDashboard />,
      },
      {
        path: 'harvests',
        element: <MyHarvests />,
      },
      {
        path: 'payments',
        element: <MyPayments />,
      },
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export default router;
