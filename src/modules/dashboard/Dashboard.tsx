import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi } from '../../services/mockApi';
import { DashboardStats } from '../../types';
import { StatCard, Card, CardContent } from '../../components';
import {
  Users,
  TrendingUp,
  DollarSign,
  Package,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('=== DASHBOARD COMPONENT ===');
  console.log('User:', user);
  console.log('Loading:', loading);
  console.log('Stats:', stats);
  console.log('Error:', error);

  useEffect(() => {
    const fetchStats = async (): Promise<void> => {
      if (!user) {
        console.log('No user found, skipping stats fetch');
        return;
      }

      console.log('Fetching dashboard stats for tenant:', user.tenantId);
      
      try {
        setLoading(true);
        setError(null);
        const response = await dashboardApi.getStats(user.tenantId);
        console.log('Dashboard API response:', response);
        setStats(response.data);
      } catch (err) {
        console.error('Dashboard API error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard stats';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
      <p className="text-slate-600 mb-6">
        Welcome back, {user?.username}! Here's an overview of your cooperative.
      </p>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Farmers"
            value={stats.totalFarmers}
            icon={<Users className="h-5 w-5" />}
            color="primary"
            subtitle="Registered farmers"
          />
          <StatCard
            title="Today's Harvest"
            value={`${stats.todayHarvest.toLocaleString()} kg`}
            icon={<TrendingUp className="h-5 w-5" />}
            color="success"
            subtitle="Harvested today"
          />
          <StatCard
            title="Pending Payments"
            value={stats.pendingPayments.toLocaleString()}
            icon={<DollarSign className="h-5 w-5" />}
            color="warning"
            subtitle="Awaiting payment"
          />
          <StatCard
            title="Total Batches"
            value={stats.totalBatches}
            icon={<Package className="h-5 w-5" />}
            color="info"
            subtitle="Active batches"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Recent Activity</h2>
              <p className="text-slate-600 text-sm">
                No recent activities to display. This section would show recent harvests, 
                payments, and other important events in a real implementation.
              </p>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Quick Actions</h2>
              <p className="text-slate-600 text-sm">
                Quick action buttons would be added here for common tasks like 
                adding new farmers, recording harvests, or processing payments.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
