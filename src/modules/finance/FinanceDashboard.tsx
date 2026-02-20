import React, { useState } from 'react';
import { useCooperativeStore } from '../../store/cooperativeStore';
import { Card, CardContent, Button } from '../../components';
import {
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  Search,
  Eye,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#16a34a', '#22c55e', '#f59e0b', '#6b7280'];

const FinanceDashboard: React.FC = () => {
  const { currentCooperative, payments, fetchPayments, updatePayment, isLoading } = useCooperativeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filteredPayments = payments.filter(payment =>
    // payment.farmerName is not in the Payment interface, we need to map it or join with users/farmers
    // For now we will search by ID or amount
    payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.amount.toString().includes(searchTerm)
  );

  const stats = {
    pendingPayments: payments.filter(p => p.status === 'PENDING').length,
    paidPayments: payments.filter(p => p.status === 'PAID').length,
    totalPending: payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0),
    totalPaid: payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0),
  };

  // Chart data preparation
  const monthlyData = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();

    return months.map((month, index) => {
      const monthPayments = payments.filter(p => {
        const date = new Date(p.createdAt); // Using createdAt for simplified monthly tracking
        return date.getMonth() === index && date.getFullYear() === currentYear;
      });

      return {
        month,
        pending: monthPayments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0),
        paid: monthPayments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0),
      };
    });
  }, [payments]);

  const statusData = [
    { name: 'Pending', value: stats.pendingPayments, color: COLORS[2] },
    { name: 'Paid', value: stats.paidPayments, color: COLORS[0] },
  ];

  const handleMarkAsPaid = async (paymentId: string) => {
    const reference = prompt('Enter transaction reference:');
    if (!reference) return;

    setLocalLoading(true);
    setError('');

    try {
      await updatePayment(paymentId, {
        status: 'PAID',
        paidDate: new Date().toISOString(),
        transactionRef: reference,
      });
      alert('Payment marked as paid successfully!');
    } catch (err) {
      setError('Failed to update payment. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: { color: 'yellow', text: 'Pending' },
      PAID: { color: 'green', text: 'Paid' },
      CANCELLED: { color: 'red', text: 'Cancelled' },
    };
    return variants[status as keyof typeof variants] || { color: 'gray', text: 'Unknown' };
  };

  if (!currentCooperative || currentCooperative.status !== 'ACTIVE') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Cooperative Not Active</h2>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                Your cooperative is not yet approved or activated. Please contact system administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Finance Dashboard</h1>
        <p className="text-slate-600">Manage payments for {currentCooperative.name}</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent>
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Pending Payments</p>
                <p className="text-2xl font-bold text-slate-900">{stats.pendingPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Paid Payments</p>
                <p className="text-2xl font-bold text-slate-900">{stats.paidPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Pending</p>
                <p className="text-2xl font-bold text-slate-900">${stats.totalPending.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Total Paid</p>
                <p className="text-2xl font-bold text-slate-900">${stats.totalPaid.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Payout Trend */}
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Monthly Payout Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                <Bar dataKey="paid" fill="#16a34a" name="Paid" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Status Distribution */}
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Payment Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by farmer name or crop type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <Card key={payment.id}>
            <CardContent>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{payment.farmerName}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(payment.status).color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      getStatusBadge(payment.status).color === 'green' ? 'bg-green-100 text-green-800' :
                        getStatusBadge(payment.status).color === 'red' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {getStatusBadge(payment.status).text}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                    <div>
                      <span className="font-medium">Crop:</span> {payment.cropType}
                    </div>
                    <div>
                      <span className="font-medium">Weight:</span> {payment.weight} kg
                    </div>
                    <div>
                      <span className="font-medium">Grade:</span> {payment.grade}
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span> ${payment.amount.toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-slate-600">
                    <span className="font-medium">Harvest Date:</span> {payment.harvestDate}
                    {payment.paidDate && (
                      <>
                        <span className="ml-4 font-medium">Paid:</span> {payment.paidDate}
                        {payment.transactionRef && <span className="ml-2">Ref: {payment.transactionRef}</span>}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {payment.status === 'PENDING' && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkAsPaid(payment.id)}
                      disabled={isLoading || localLoading}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Paid
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="secondary"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPayments.length === 0 && (
        <Card>
          <CardContent>
            <div className="text-center py-8 text-slate-500">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p>No payments found.</p>
              <p className="text-sm">Try adjusting your search criteria.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinanceDashboard;
