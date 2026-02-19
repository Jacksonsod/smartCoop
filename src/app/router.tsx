import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from '../theme/theme';

// Layout Components
import DashboardLayout from '../layout/DashboardLayout';

// Auth Components
import Login from '../auth/Login';
import RequireAuth from '../auth/RequireAuth';

// Module Components
import Dashboard from '../modules/dashboard/Dashboard';
import FarmerList from '../modules/farmers/FarmerList';
import FarmerDetails from '../modules/farmers/FarmerDetails';
import FarmerForm from '../modules/farmers/FarmerForm';
import HarvestList from '../modules/harvests/HarvestList';
import HarvestForm from '../modules/harvests/HarvestForm';
import BatchList from '../modules/batches/BatchList';
import PaymentList from '../modules/payments/PaymentList';
import PriceConfig from '../modules/pricing/PriceConfig';

// Create the router
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'farmers',
        element: <FarmerList />,
      },
      {
        path: 'farmers/add',
        element: <FarmerForm />,
      },
      {
        path: 'farmers/:id',
        element: <FarmerDetails />,
      },
      {
        path: 'farmers/:id/edit',
        element: <FarmerForm />,
      },
      {
        path: 'harvests',
        element: <HarvestList />,
      },
      {
        path: 'harvests/add',
        element: <HarvestForm />,
      },
      {
        path: 'harvests/:id/edit',
        element: <HarvestForm />,
      },
      {
        path: 'batches',
        element: <BatchList />,
      },
      {
        path: 'payments',
        element: (
          <RequireAuth allowedRoles={['COOP_ADMIN', 'FINANCE', 'SUPER_ADMIN']}>
            <PaymentList />
          </RequireAuth>
        ),
      },
      {
        path: 'prices',
        element: (
          <RequireAuth allowedRoles={['COOP_ADMIN', 'SUPER_ADMIN']}>
            <PriceConfig />
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;
