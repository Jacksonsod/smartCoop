import React, { useState } from 'react';
import { Card, CardContent, Button } from '../components';
import { Building, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCooperativeStore } from '../store/cooperativeStore';
import { mockCooperatives } from '../data/mockData';

// Mock users for demonstration
const mockUsers = [
  {
    email: 'superadmin@smartcoop.com',
    password: 'password123',
    role: 'SUPER_ADMIN',
    username: 'Super Admin'
  },
  {
    email: 'admin@coop1.com',
    password: 'password123',
    role: 'COOPERATIVE_ADMIN',
    username: 'Coop Admin'
  },
  {
    email: 'clerk@coop1.com',
    password: 'password123',
    role: 'CLERK',
    username: 'Clerk'
  },
  {
    email: 'inspector@coop1.com',
    password: 'password123',
    role: 'QUALITY_INSPECTOR',
    username: 'Inspector'
  },
  {
    email: 'finance@coop1.com',
    password: 'password123',
    role: 'FINANCE_OFFICER',
    username: 'Finance'
  },
  {
    email: 'farmer@coop1.com',
    password: 'password123',
    role: 'FARMER',
    username: 'Farmer'
  }
];

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, currentUser } = useCooperativeStore();
  const navigate = useNavigate();


  React.useEffect(() => {
    // Initialize or validate mock users in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    let shouldReset = false;

    // Check if data is accurate (e.g. superadmin has correct role)
    if (existingUsers.length > 0) {
      const superAdmin = existingUsers.find((u: any) => u.email === 'superadmin@smartcoop.com');
      if (superAdmin && superAdmin.role !== 'SUPER_ADMIN') {
        console.warn('Found corrupt user data: Super Admin has wrong role. Resetting...');
        shouldReset = true;
      }
    }

    if (existingUsers.length === 0 || shouldReset) {
      const users = mockUsers.map((user, index) => ({
        id: `user-${index + 1}`,
        email: user.email,
        role: user.role,
        username: user.username,
        cooperativeId: user.role !== 'SUPER_ADMIN' ? 'tenant-001' : undefined,
        tenantId: user.role !== 'SUPER_ADMIN' ? 'tenant-001' : undefined,
        farmerId: user.role === 'FARMER' ? 'farmer-001' : undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      localStorage.setItem('users', JSON.stringify(users));
      // Force reload if we reset data to ensure store picks it up
      if (shouldReset) {
        window.location.reload();
      }
    }

    // Initialize mock cooperatives if they don't exist
    const existingCooperatives = JSON.parse(localStorage.getItem('cooperatives') || '[]');
    if (existingCooperatives.length === 0) {
      localStorage.setItem('cooperatives', JSON.stringify(mockCooperatives));
    }
  }, []);

  React.useEffect(() => {
    console.log('Login useEffect Check:', { currentUser });
    if (currentUser) {
      console.log('Login: User found, redirecting based on role:', currentUser.role);
      // Redirect based on role
      switch (currentUser.role) {
        case 'SUPER_ADMIN':
          navigate('/super-admin/dashboard');
          break;
        case 'COOPERATIVE_ADMIN':
          navigate('/cooperative/dashboard');
          break;
        case 'CLERK':
          navigate('/clerk/harvests');
          break;
        case 'QUALITY_INSPECTOR':
          navigate('/inspector/verification');
          break;
        case 'FINANCE_OFFICER':
          navigate('/finance');
          break;
        case 'FARMER':
          navigate('/farmer/dashboard');
          break;
        default:
          console.log('Login: Unknown role, no redirect');
          navigate('/login');
      }
    } else {
      console.log('Login: No current user in store');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid credentials. Try superadmin@smartcoop.com / password123');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center">
            <Building className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Smart Coop
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Agricultural Cooperative Management System
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="text-sm text-red-800">{error}</div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-gray-600">
                <div><strong>Super Admin:</strong> superadmin@smartcoop.com / password123</div>
                <div><strong>Coop Admin:</strong> admin@coop1.com / password123</div>
                <div><strong>Clerk:</strong> clerk@coop1.com / password123</div>
                <div><strong>Inspector:</strong> inspector@coop1.com / password123</div>
                <div><strong>Finance:</strong> finance@coop1.com / password123</div>
                <div><strong>Farmer:</strong> farmer@coop1.com / password123</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
