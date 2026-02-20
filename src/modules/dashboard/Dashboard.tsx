import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi } from '../../services/mockApi';
import { StorageService } from '../../services/storageService';
import { DashboardStats } from '../../types';
import { StatCard, Card, CardContent } from '../../components';
import {
  Users,
  TrendingUp,
  DollarSign,
  Package,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get real data from local storage for charts
  const getChartData = () => {
    if (!user) return { harvestTrendData: [], farmerActivityData: [] };

    const harvests = StorageService.getHarvests().filter(h => h.tenantId === user.tenantId);
    const farmers = StorageService.getFarmers().filter(f => f.tenantId === user.tenantId);

    // Generate harvest trend data from real data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayHarvests = harvests.filter(h => h.harvestDate?.startsWith(dateStr));
      const totalWeight = dayHarvests.reduce((sum, h) => sum + (h.weight || 0), 0);
      
      return {
        name: dayName,
        harvest: totalWeight,
      };
    });

    // Generate farmer activity data from real data
    const last4Weeks = Array.from({ length: 4 }, (_, i) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekFarmers = farmers.filter(f => {
        const createdDate = new Date(f.createdAt);
        return createdDate >= weekStart && createdDate <= weekEnd;
      });
      
      return {
        name: `Week ${4 - i}`,
        farmers: weekFarmers.length,
      };
    }).reverse();

    return {
      harvestTrendData: last7Days,
      farmerActivityData: last4Weeks,
    };
  };

  const { harvestTrendData, farmerActivityData } = getChartData();

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
              <p className="text-slate-600 text-sm mb-4">
                No recent activities to display. This section would show recent harvests, 
                payments, and other important events in a real implementation.
              </p>
              
              {/* Harvest Trend Chart */}
              <div className="mt-6">
                <h3 className="text-md font-medium text-slate-800 mb-4">Weekly Harvest Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={harvestTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="harvest" 
                      stroke="#16a34a" 
                      strokeWidth={2}
                      dot={{ fill: '#16a34a' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Quick Actions</h2>
              <p className="text-slate-600 text-sm mb-4">
                Quick action buttons would be added here for common tasks like 
                adding new farmers, recording harvests, or processing payments.
              </p>
              
              {/* Farmer Activity Chart */}
              <div className="mt-6">
                <h3 className="text-md font-medium text-slate-800 mb-4">Farmer Registration Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={farmerActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="farmers" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
