import React from 'react';
import { useCooperativeStore } from '../../store/cooperativeStore';
import { Card, CardContent } from '../../components';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#16a34a', '#22c55e', '#f59e0b', '#6b7280'];

const CooperativeDashboard: React.FC = () => {
  const { currentCooperative } = useCooperativeStore();
  const [stats, setStats] = React.useState({
    totalFarmers: 0,
    totalHarvests: 0,
    totalWeight: 0,
    totalRevenue: 0,
  });

  React.useEffect(() => {
    if (currentCooperative) {
      // Fetch stats from localStorage for now
      const farmers = JSON.parse(localStorage.getItem('farmers') || '[]');
      const harvests = JSON.parse(localStorage.getItem('harvests') || '[]');
      const coopFarmers = farmers.filter((f: any) => f.cooperativeId === currentCooperative.id);
      const coopHarvests = harvests.filter((h: any) => h.cooperativeId === currentCooperative.id);

      const weight = coopHarvests.reduce((sum: number, h: any) => sum + h.weightKg, 0);
      const revenue = coopHarvests.reduce((sum: number, h: any) => sum + (h.totalPrice || 0), 0);

      setStats({
        totalFarmers: coopFarmers.length,
        totalHarvests: coopHarvests.length,
        totalWeight: weight,
        totalRevenue: revenue,
      });
    }
  }, [currentCooperative]);

  // Chart data
  const revenueData = [
    { month: 'Jan', revenue: 18000 },
    { month: 'Feb', revenue: 22000 },
    { month: 'Mar', revenue: 19000 },
    { month: 'Apr', revenue: 25000 },
    { month: 'May', revenue: 28000 },
    { month: 'Jun', revenue: 32000 },
  ];

  const cropData = [
    { name: 'Maize', value: 35 },
    { name: 'Beans', value: 25 },
    { name: 'Coffee', value: 20 },
    { name: 'Tea', value: 20 },
  ];

  const qualityData = [
    { grade: 'Grade A', count: 45 },
    { grade: 'Grade B', count: 38 },
    { grade: 'Grade C', count: 25 },
    { grade: 'Grade D', count: 20 },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Cooperative Dashboard</h1>
        <p className="text-slate-600">
          Manage {currentCooperative?.name || 'Your Cooperative'} operations
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Farmers</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalFarmers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Harvests</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalHarvests}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Weight</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalWeight.toLocaleString()} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={{ fill: '#16a34a' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Harvest by Crop */}
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Harvest by Crop Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cropData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quality Distribution */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quality Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={qualityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props) =>
                  `${props.payload.grade} ${(props.percent ? props.percent * 100 : 0).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {qualityData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default CooperativeDashboard;
