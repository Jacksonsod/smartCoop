import React, { useMemo } from 'react';
import { useCooperativeStore } from '../../store/cooperativeStore';
import { Card, CardContent } from '../../components';
import { Package, DollarSign, TrendingUp } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Harvest, Payment } from '../../types';

const FarmerDashboard: React.FC = () => {
    const { currentUser } = useCooperativeStore();

    // In a real app, we would fetch this data from the API
    // utilizing the farmerId linked to the current user
    const stats = useMemo(() => {
        if (!currentUser?.farmerId) return null;

        const harvests = JSON.parse(localStorage.getItem('harvests') || '[]') as Harvest[];
        const payments = JSON.parse(localStorage.getItem('payments') || '[]') as Payment[];

        // Filter for current farmer
        const myHarvests = harvests.filter(h => h.farmerId === currentUser.farmerId);
        const myPayments = payments.filter(p => p.farmerId === currentUser.farmerId);

        const totalWeight = myHarvests.reduce((sum, h) => sum + h.weight, 0);
        const totalEarnings = myPayments
            .filter(p => p.status === 'PAID')
            .reduce((sum, p) => sum + p.amount, 0);

        const pendingPayments = myPayments.filter(p => p.status === 'PENDING').length;
        const pendingAmount = myPayments
            .filter(p => p.status === 'PENDING')
            .reduce((sum, p) => sum + p.amount, 0);

        // Calculate monthly trend
        const monthlyData = myHarvests.reduce((acc, h) => {
            const date = new Date(h.harvestDate);
            const month = date.toLocaleString('default', { month: 'short' });

            const existing = acc.find(d => d.month === month);
            if (existing) {
                existing.weight += h.weight;
            } else {
                acc.push({ month, weight: h.weight });
            }
            return acc;
        }, [] as { month: string; weight: number }[]);

        // Sort by month (simplified)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        monthlyData.sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));

        return {
            totalDeliveries: myHarvests.length,
            totalEarnings,
            totalWeight,
            pendingPayments,
            pendingAmount,
            monthlyData
        };
    }, [currentUser]);

    if (!stats) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-slate-700">No farmer profile linked</h2>
                <p className="text-slate-500">Please contact your cooperative administrator.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-600">Track your farming performance</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent>
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Total Weight</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.totalWeight.toLocaleString()} kg</p>
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
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Total Earnings</p>
                                <p className="text-2xl font-bold text-slate-900">${stats.totalEarnings.toLocaleString()}</p>
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
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Pending Payments</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.pendingPayments}</p>
                                <p className="text-xs text-slate-500">${stats.pendingAmount.toLocaleString()} pending</p>
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
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Deliveries</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.totalDeliveries}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Harvest Trend Chart */}
            <Card>
                <CardContent>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Harvest Trend (Weight in kg)</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#ea580c"
                                    strokeWidth={2}
                                    dot={{ fill: '#ea580c' }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FarmerDashboard;
