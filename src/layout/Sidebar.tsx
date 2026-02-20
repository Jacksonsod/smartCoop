import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NavigationItem } from '../types';
import {
  LayoutDashboard,
  Users,
  Wheat,
  Package,
  CreditCard,
  DollarSign,
  Database,
} from 'lucide-react';

const navigationItems: NavigationItem[] = [
  // Super Admin routes
  {
    text: 'System Dashboard',
    path: '/dashboard',
    icon: 'Dashboard',
    roles: ['SUPER_ADMIN'],
  },
  {
    text: 'Cooperative Dashboard',
    path: '/coop-dashboard',
    icon: 'Dashboard',
    roles: ['COOPERATIVE_ADMIN', 'CLERK', 'FINANCE_OFFICER', 'QUALITY_INSPECTOR', 'FARMER'],
  },
  {
    text: 'Farmers',
    path: '/farmers',
    icon: 'Users',
    roles: ['COOPERATIVE_ADMIN', 'CLERK', 'QUALITY_INSPECTOR', 'FARMER'],
  },
  {
    text: 'Harvests',
    path: '/harvests',
    icon: 'Wheat',
    roles: ['COOPERATIVE_ADMIN', 'CLERK', 'QUALITY_INSPECTOR', 'FARMER'],
  },
  {
    text: 'Batches',
    path: '/batches',
    icon: 'Package',
    roles: ['COOPERATIVE_ADMIN', 'CLERK', 'QUALITY_INSPECTOR', 'FARMER'],
  },
  {
    text: 'Payments',
    path: '/payments',
    icon: 'CreditCard',
    roles: ['COOPERATIVE_ADMIN', 'FINANCE_OFFICER'],
  },
  {
    text: 'Daily Prices',
    path: '/prices',
    icon: 'DollarSign',
    roles: ['COOPERATIVE_ADMIN'],
  },
  {
    text: 'Data Management',
    path: '/data-management',
    icon: 'Database',
    roles: ['COOPERATIVE_ADMIN'],
  },
];

const iconMap: { [key: string]: React.ReactElement } = {
  Dashboard: <LayoutDashboard className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Wheat: <Wheat className="w-5 h-5" />,
  Package: <Package className="w-5 h-5" />,
  CreditCard: <CreditCard className="w-5 h-5" />,
  DollarSign: <DollarSign className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
};

interface SidebarProps {
  open?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open = true }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigation = (path: string): void => {
    navigate(path);
  };

  const filteredNavigationItems = navigationItems.filter(item => {
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    return user ? item.roles.includes(user.role) : false;
  });

  if (!open) return null;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Wheat className="w-8 h-8 text-green-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">SmartCoop</h1>
            <p className="text-sm text-gray-600">Agricultural Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredNavigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
                    {iconMap[item.icon]}
                  </span>
                  <span className="font-medium">{item.text}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      {user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-600">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.username}
              </p>
              <p className="text-xs text-gray-600 capitalize">
                {user.role.replace('_', ' ').toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
