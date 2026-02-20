import React, { useMemo } from 'react';
import { useCooperativeStore } from '../../store/cooperativeStore';
import { Card, CardContent, Button } from '../../components';
import { Payment } from '../../types';
import { Wallet, Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const MyPayments: React.FC = () => {
    const { currentUser } = useCooperativeStore();

    const payments = useMemo(() => {
        if (!currentUser?.farmerId) return [];

        const allPayments = JSON.parse(localStorage.getItem('payments') || '[]') as Payment[];
        return allPayments
            .filter(p => p.farmerId === currentUser.farmerId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [currentUser]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PAID': return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'PENDING': return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'OVERDUE': return <AlertCircle className="h-5 w-5 text-red-500" />;
            default: return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'PAID': return 'bg-green-50 text-green-700 border-green-200';
            case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'OVERDUE': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    if (!currentUser?.farmerId) {
        return <div className="p-6">No farmer profile found.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Payment History</h1>
                    <p className="text-slate-600">View your earnings and transactions</p>
                </div>
            </div>

            <div className="grid gap-4">
                {payments.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Wallet className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">No payments found</h3>
                            <p className="text-slate-500">Payment records will appear here once processed.</p>
                        </CardContent>
                    </Card>
                ) : (
                    payments.map((payment) => (
                        <Card key={payment.id} className={`hover:shadow-md transition-shadow border-l-4 ${payment.status === 'PAID' ? 'border-l-green-500' :
                                payment.status === 'OVERDUE' ? 'border-l-red-500' :
                                    'border-l-yellow-500'
                            }`}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-slate-500">Payment ID:</span>
                                                <span className="font-mono text-sm font-medium">{payment.id}</span>
                                            </div>
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${getStatusClass(payment.status)}`}>
                                                {getStatusIcon(payment.status)}
                                                {payment.status}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wide">Amount</p>
                                                <p className="text-xl font-bold text-slate-900">${payment.amount.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wide">Due Date</p>
                                                <p className="text-sm font-medium text-slate-900">{new Date(payment.dueDate).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wide">Paid Date</p>
                                                <p className="text-sm font-medium text-slate-900">
                                                    {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 uppercase tracking-wide">Reference</p>
                                                <p className="text-sm font-medium text-slate-900 font-mono">
                                                    {payment.transactionRef || '-'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {payment.status === 'PAID' && (
                                            <Button variant="secondary" size="sm" className="text-slate-600">
                                                <Download className="h-4 w-4 mr-2" />
                                                Receipt
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyPayments;
