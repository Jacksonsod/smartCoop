import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useCooperativeStore } from '../store/cooperativeStore';
import { Card, CardContent } from '../components';
import { Building, Users, Settings, LogOut } from 'lucide-react';

const ClerkLayout: React.FC = () => {
  const { currentUser, currentCooperative, logout } = useCooperativeStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 flex items-center justify-between px-6 bg-blue-600">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-white" />
            <span className="ml-3 text-xl font-bold text-white">Clerk Portal</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-white hover:bg-blue-700 p-2 rounded"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        {/* Cooperative Info */}
        {currentCooperative && (
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-200">
            <div className="text-sm font-medium text-blue-800">{currentCooperative.name}</div>
            <div className="text-xs text-blue-600">{currentCooperative.status}</div>
          </div>
        )}

        <nav className="mt-6">
          <div className="px-3">
            <Link
              to="/clerk/harvests"
              className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <Users className="h-5 w-5 mr-3" />
              Record Harvests
            </Link>
          </div>
          <div className="px-3">
            <Link
              to="/clerk/batches"
              className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <Building className="h-5 w-5 mr-3" />
              Create Batches
            </Link>
          </div>
          <div className="px-3">
            <Link
              to="/clerk/farmers"
              className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <Users className="h-5 w-5 mr-3" />
              View Farmers
            </Link>
          </div>
          <div className="px-3">
            <Link
              to="/clerk/settings"
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
            <h1 className="text-2xl font-bold text-slate-900">Clerk Operations</h1>
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

export default ClerkLayout;
