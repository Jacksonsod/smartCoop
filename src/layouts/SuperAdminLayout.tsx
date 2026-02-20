import React from 'react';
import { Outlet } from 'react-router-dom';
import { useCooperativeStore } from '../store/cooperativeStore';
import { Card, CardContent } from '../components';
import { Building, Users, Settings, LogOut } from 'lucide-react';

const SuperAdminLayout: React.FC = () => {
  const { currentUser, logout } = useCooperativeStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 flex items-center justify-between px-6 bg-slate-900">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-white" />
            <span className="ml-3 text-xl font-bold text-white">Super Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-white hover:bg-slate-700 p-2 rounded"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-6">
          <div className="px-3">
            <a
              href="/super-admin/dashboard"
              className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <Users className="h-5 w-5 mr-3" />
              Dashboard
            </a>
          </div>
          <div className="px-3">
            <a
              href="/super-admin/cooperatives"
              className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <Building className="h-5 w-5 mr-3" />
              Cooperatives
            </a>
          </div>
          <div className="px-3">
            <a
              href="/super-admin/settings"
              className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Super Admin Panel</h1>
            <p className="text-slate-600">Welcome, {currentUser?.username}!</p>
          </div>
          
          <Card>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <Users className="h-4 w-4" />
                <span>Platform-wide administration</span>
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span>System operational</span>
              </div>
            </CardContent>
          </Card>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
