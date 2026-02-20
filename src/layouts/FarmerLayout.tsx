import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useCooperativeStore } from '../store/cooperativeStore';
import { LayoutDashboard, Sprout, Wallet, LogOut } from 'lucide-react';

const FarmerLayout: React.FC = () => {
  const { currentUser, currentCooperative, logout } = useCooperativeStore();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const linkClass = (path: string) => `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(path)
    ? 'bg-orange-100 text-orange-700'
    : 'text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg flex flex-col">
        <div className="flex h-16 items-center justify-between px-6 bg-orange-600 shrink-0">
          <div className="flex items-center">
            <Sprout className="h-8 w-8 text-white" />
            <span className="ml-3 text-xl font-bold text-white">Farmer Portal</span>
          </div>
        </div>

        {/* User Info Card in Sidebar */}
        <div className="p-4 bg-orange-50 border-b border-orange-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{currentUser?.username}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
            </div>
          </div>
          <div className="text-xs font-medium text-orange-800 bg-orange-100 px-2 py-1 rounded inline-block">
            {currentCooperative?.name || 'No Coop'}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <Link to="/farmer/dashboard" className={linkClass('/farmer/dashboard')}>
            <LayoutDashboard className={`h-5 w-5 mr-3 ${isActive('/farmer/dashboard') ? 'text-orange-600' : 'text-slate-400'}`} />
            Dashboard
          </Link>
          <Link to="/farmer/harvests" className={linkClass('/farmer/harvests')}>
            <Sprout className={`h-5 w-5 mr-3 ${isActive('/farmer/harvests') ? 'text-orange-600' : 'text-slate-400'}`} />
            My Deliveries
          </Link>
          <Link to="/farmer/payments" className={linkClass('/farmer/payments')}>
            <Wallet className={`h-5 w-5 mr-3 ${isActive('/farmer/payments') ? 'text-orange-600' : 'text-slate-400'}`} />
            My Payments
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-100 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default FarmerLayout;
