import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useCooperativeStore } from '../store/cooperativeStore';
import { Card, CardContent } from '../components';
import { Building, Settings, LogOut, DollarSign } from 'lucide-react';

const FinanceLayout: React.FC = () => {
    const { currentUser, currentCooperative, logout } = useCooperativeStore();

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
                <div className="flex h-16 flex items-center justify-between px-6 bg-indigo-600">
                    <div className="flex items-center">
                        <DollarSign className="h-8 w-8 text-white" />
                        <span className="ml-3 text-xl font-bold text-white">Finance Portal</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-white hover:bg-indigo-700 p-2 rounded"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>

                {/* Cooperative Info */}
                {currentCooperative && (
                    <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-200">
                        <div className="text-sm font-medium text-indigo-800">{currentCooperative.name}</div>
                        <div className="text-xs text-indigo-600">{currentCooperative.status}</div>
                    </div>
                )}

                <nav className="mt-6">
                    <div className="px-3">
                        <Link
                            to="/finance"
                            className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100"
                        >
                            <Building className="h-5 w-5 mr-3" />
                            Finance Dashboard
                        </Link>
                    </div>
                    <div className="px-3">
                        <Link
                            to="/finance/payments"
                            className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100"
                        >
                            <DollarSign className="h-5 w-5 mr-3" />
                            Manage Payments
                        </Link>
                    </div>
                    <div className="px-3">
                        <Link
                            to="/finance/batches"
                            className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100"
                        >
                            <Building className="h-5 w-5 mr-3" />
                            View Batches
                        </Link>
                    </div>
                    <div className="px-3">
                        <Link
                            to="/finance/settings"
                            className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100"
                        >
                            <Settings className="h-5 w-5 mr-3" />
                            Settings
                        </Link>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="pl-64">
                <main className="p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-900">Finance Operations</h1>
                        <p className="text-slate-600">Welcome, {currentUser?.username}!</p>
                    </div>

                    <Card>
                        <CardContent>
                            <div className="flex items-center space-x-4 text-sm text-slate-600">
                                <Building className="h-4 w-4" />
                                <span>{currentCooperative?.name || 'No cooperative assigned'}</span>
                                <div className={`h-2 w-2 rounded-full ${currentCooperative?.status === 'ACTIVE' ? 'bg-green-500' : 'bg-yellow-500'
                                    }`}></div>
                                <span>{currentCooperative?.status || 'Unknown status'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default FinanceLayout;
