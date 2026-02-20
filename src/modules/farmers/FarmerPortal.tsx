import React, { useState } from 'react';
import { useCooperativeStore } from '../../store/cooperativeStore';
import { Card, CardContent, Button } from '../../components';
import {
  Package,
  DollarSign,
  TrendingUp,
  Download,
  Eye,

} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const FarmerPortal: React.FC = () => {
  const { currentCooperative, currentUser } = useCooperativeStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'deliveries' | 'payments'>('dashboard');

  // Mock data for demonstration
  const mockStats = {
    totalDeliveries: 12,
    totalEarnings: 45000,
    pendingPayments: 3,
    averageWeight: 420,
  };

  const mockDeliveries = [
    {
      id: 'delivery-1',
      cropType: 'Maize',
      weight: 500,
      grade: 'Grade A',
      harvestDate: '2024-01-15',
      status: 'APPROVED',
      pricePerKg: 50,
      totalValue: 25000,
    },
    {
      id: 'delivery-2',
      cropType: 'Beans',
      weight: 300,
      grade: 'Grade B',
      harvestDate: '2024-01-10',
      status: 'APPROVED',
      pricePerKg: 45,
      totalValue: 13500,
    },
    {
      id: 'delivery-3',
      cropType: 'Coffee',
      weight: 200,
      grade: 'Grade A',
      harvestDate: '2024-01-05',
      status: 'PENDING_VERIFICATION',
      pricePerKg: 60,
      totalValue: 12000,
    },
  ];

  const mockPayments = [
    {
      id: 'payment-1',
      deliveryId: 'delivery-1',
      amount: 25000,
      status: 'PAID',
      paidDate: '2024-01-17',
      transactionReference: 'TXN-001',
    },
    {
      id: 'payment-2',
      deliveryId: 'delivery-2',
      amount: 13500,
      status: 'PENDING',
      paidDate: null,
      transactionReference: null,
    },
    {
      id: 'payment-3',
      deliveryId: 'delivery-3',
      amount: 12000,
      status: 'PENDING',
      paidDate: null,
      transactionReference: null,
    },
  ];

  // Chart data
  const harvestTrendData = [
    { month: 'Jan', weight: 500 },
    { month: 'Feb', weight: 450 },
    { month: 'Mar', weight: 600 },
    { month: 'Apr', weight: 380 },
    { month: 'May', weight: 520 },
    { month: 'Jun', weight: 480 },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING_VERIFICATION: { color: 'yellow', text: 'Pending Verification' },
      APPROVED: { color: 'green', text: 'Approved' },
      REJECTED: { color: 'red', text: 'Rejected' },
    };
    return variants[status as keyof typeof variants] || { color: 'gray', text: 'Unknown' };
  };

  const getPaymentStatusBadge = (status: string) => {
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
        <h1 className="text-3xl font-bold text-slate-900">Farmer Portal</h1>
        <p className="text-slate-600">Welcome, {currentUser?.username}!</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'dashboard'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'deliveries'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
          >
            My Deliveries
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'payments'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
          >
            Payment History
          </button>
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent>
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Deliveries</p>
                    <p className="text-2xl font-bold text-slate-900">{mockStats.totalDeliveries}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-slate-900">${mockStats.totalEarnings.toLocaleString()}</p>
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
                    <p className="text-sm font-medium text-slate-600">Pending Payments</p>
                    <p className="text-2xl font-bold text-slate-900">{mockStats.pendingPayments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600">Average Weight</p>
                    <p className="text-2xl font-bold text-slate-900">{mockStats.averageWeight} kg</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Harvest Trend Chart */}
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Harvest Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={harvestTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={{ fill: '#16a34a' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Deliveries Tab */}
      {activeTab === 'deliveries' && (
        <div className="space-y-4">
          {mockDeliveries.map((delivery) => (
            <Card key={delivery.id}>
              <CardContent>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{delivery.cropType}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(delivery.status).color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          getStatusBadge(delivery.status).color === 'green' ? 'bg-green-100 text-green-800' :
                            getStatusBadge(delivery.status).color === 'red' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                        }`}>
                        {getStatusBadge(delivery.status).text}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Weight:</span> {delivery.weight} kg
                      </div>
                      <div>
                        <span className="font-medium">Grade:</span> {delivery.grade}
                      </div>
                      <div>
                        <span className="font-medium">Price/kg:</span> ${delivery.pricePerKg}
                      </div>
                      <div>
                        <span className="font-medium">Total Value:</span> ${delivery.totalValue.toLocaleString()}
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-slate-600">
                      <span className="font-medium">Harvest Date:</span> {delivery.harvestDate}
                    </div>
                  </div>

                  <div className="flex space-x-2">
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
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          {mockPayments.map((payment) => (
            <Card key={payment.id}>
              <CardContent>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">Payment #{payment.id}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusBadge(payment.status).color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          getPaymentStatusBadge(payment.status).color === 'green' ? 'bg-green-100 text-green-800' :
                            getPaymentStatusBadge(payment.status).color === 'red' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                        }`}>
                        {getPaymentStatusBadge(payment.status).text}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Amount:</span> ${payment.amount.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span> {getPaymentStatusBadge(payment.status).text}
                      </div>
                      <div>
                        <span className="font-medium">Paid Date:</span> {payment.paidDate || 'Pending'}
                      </div>
                    </div>

                    {payment.transactionReference && (
                      <div className="mt-2 text-sm text-slate-600">
                        <span className="font-medium">Transaction Ref:</span> {payment.transactionReference}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {payment.status === 'PAID' && (
                      <Button
                        size="sm"
                        variant="secondary"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Receipt
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
      )}
    </div>
  );
};

export default FarmerPortal;
