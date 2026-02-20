import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NavigationItem } from '../types';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const navigationItems: NavigationItem[] = [
  {
    text: 'Dashboard',
    path: '/dashboard',
    icon: 'Dashboard',
  },
  {
    text: 'Farmers',
    path: '/farmers',
    icon: 'People',
  },
  {
    text: 'Harvests',
    path: '/harvests',
    icon: 'Agriculture',
  },
  {
    text: 'Batches',
    path: '/batches',
    icon: 'Inventory',
  },
  {
    text: 'Payments',
    path: '/payments',
    icon: 'Payment',
    roles: ['COOPERATIVE_ADMIN', 'FINANCE_OFFICER', 'SUPER_ADMIN'],
  },
  {
    text: 'Daily Prices',
    path: '/prices',
    icon: 'Price',
    roles: ['COOPERATIVE_ADMIN', 'SUPER_ADMIN'],
  },
  {
    text: 'Data Management',
    path: '/data-management',
    icon: 'Database',
    roles: ['COOPERATIVE_ADMIN', 'SUPER_ADMIN'],
  },
];

const iconMap: { [key: string]: React.ReactElement } = {
  Dashboard: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  People: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Agriculture: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Inventory: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  Payment: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Price: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Database: (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7M4 7c0-2.21 1.79-4 4-4h8c2.21 0 4 1.79 4 4M9 17v1a1 1 0 012 0h4a1 1 0 012 0v17M9 7a1 1 0 012 0h4A1 1 0 012 0V7" />
    </svg>
  ),
};

const Sidebar: React.FC<SidebarProps> = ({ open = true, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavigation = (path: string): void => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  const filteredNavigationItems = navigationItems.filter(item => {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    return user ? item.roles.includes(user.role) : false;
  });

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-slate-900">Smart Coop</span>
          </div>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {filteredNavigationItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                  }
                `}
              >
                <div className={`${isActive ? 'text-white' : 'text-slate-400'}`}>
                  {iconMap[item.icon]}
                </div>
                {item.text}
              </button>
            );
          })}
        </nav>

        {/* User info */}
        {user && (
          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
                <span className="text-sm font-medium text-slate-600">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user.username}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user.role.replace('_', ' ').toLowerCase()}
                </p>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
