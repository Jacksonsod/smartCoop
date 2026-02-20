import React, { useState } from 'react';
import { useCooperativeStore } from '../../store/cooperativeStore';
import { Card, CardContent, Button } from '../../components';
import {
  Users,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Search,
  Filter,
  Edit,
  AlertCircle,
} from 'lucide-react';
import { Cooperative } from '../../types/cooperative';

const SuperAdminDashboard: React.FC = () => {
  const { cooperatives, users, isLoading } = useCooperativeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCooperative, setEditingCooperative] = useState<Cooperative | null>(null);

  // Calculate statistics
  const totalCooperatives = cooperatives.length;
  const pendingApprovals = cooperatives.filter(c => c.status === 'PENDING_APPROVAL').length;
  const activeCooperatives = cooperatives.filter(c => c.status === 'ACTIVE').length;
  const suspendedCooperatives = cooperatives.filter(c => c.status === 'SUSPENDED').length;
  const totalUsers = users.length;

  // Filter cooperatives
  const filteredCooperatives = cooperatives.filter(coop => {
    const matchesSearch = coop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coop.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || coop.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Chart data


  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; text: string; bgColor: string; textColor: string; icon: React.ElementType }> = {
      DRAFT: { color: 'gray', text: 'Draft', bgColor: 'bg-gray-100', textColor: 'text-gray-800', icon: AlertCircle },
      PENDING_APPROVAL: { color: 'yellow', text: 'Pending Approval', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', icon: Clock },
      APPROVED: { color: 'blue', text: 'Approved', bgColor: 'bg-blue-100', textColor: 'text-blue-800', icon: CheckCircle },
      ACTIVE: { color: 'green', text: 'Active', bgColor: 'bg-green-100', textColor: 'text-green-800', icon: CheckCircle },
      SUSPENDED: { color: 'red', text: 'Suspended', bgColor: 'bg-red-100', textColor: 'text-red-800', icon: XCircle },
    };
    return variants[status] || { color: 'gray', text: 'Unknown', bgColor: 'bg-gray-100', textColor: 'text-gray-800', icon: AlertCircle };
  };

  const handleApprove = async (id: string) => {
    try {
      await useCooperativeStore.getState().approveCooperative(id);
      alert('Cooperative approved successfully!');
    } catch (err) {
      alert('Failed to approve cooperative');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await useCooperativeStore.getState().rejectCooperative(id, reason);
      alert('Cooperative rejected successfully!');
    } catch (err) {
      alert('Failed to reject cooperative');
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await useCooperativeStore.getState().activateCooperative(id);
      alert('Cooperative activated successfully!');
    } catch (err) {
      alert('Failed to activate cooperative');
    }
  };

  const handleSuspend = async (id: string) => {
    const reason = prompt('Enter suspension reason:');
    if (!reason) return;

    try {
      await useCooperativeStore.getState().suspendCooperative(id, reason);
      alert('Cooperative suspended successfully!');
    } catch (err) {
      alert('Failed to suspend cooperative');
    }
  };

  const handleEdit = (cooperative: Cooperative) => {
    setEditingCooperative(cooperative);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Super Admin Dashboard</h1>
        <p className="text-slate-600">Manage all cooperatives and system-wide operations</p>
        <Button
          onClick={() => {
            setEditingCooperative(null);
            setShowForm(true);
          }}
          startIcon={<Plus className="h-4 w-4" />}
        >
          Register New Cooperative
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">{editingCooperative ? 'Edit' : 'Register'} Cooperative</h2>
            <p>Form placeholder...</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowForm(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card className="hover:shadow-xl transition-shadow">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Cooperatives</p>
                <p className="text-3xl font-bold text-slate-900">{totalCooperatives}</p>
                <p className="text-xs text-slate-500 mt-1">Registered</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Pending Approvals</p>
                <p className="text-3xl font-bold text-slate-900">{pendingApprovals}</p>
                <p className="text-xs text-slate-500 mt-1">Need review</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Active</p>
                <p className="text-3xl font-bold text-slate-900">{activeCooperatives}</p>
                <p className="text-xs text-slate-500 mt-1">Operating</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Suspended</p>
                <p className="text-3xl font-bold text-slate-900">{suspendedCooperatives}</p>
                <p className="text-xs text-slate-500 mt-1">Inactive</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-slate-900">{totalUsers}</p>
                <p className="text-xs text-slate-500 mt-1">System-wide</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Cooperatives Management Section */}
      <Card>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Cooperatives Management</h2>
            <Button
              onClick={() => window.location.href = '/super-admin/cooperatives'}
              startIcon={<Plus className="h-4 w-4" />}
            >
              Register New Cooperative
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="PENDING_APPROVAL">Pending Approval</option>
                <option value="APPROVED">Approved</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>

          {/* Cooperatives Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Cooperative
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Registration No
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredCooperatives.map((cooperative) => {
                  const statusInfo = getStatusBadge(cooperative.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={cooperative.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{cooperative.name}</div>
                        <div className="text-sm text-slate-500">{cooperative.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                            statusInfo.color === 'green' ? 'bg-green-100 text-green-800' :
                              statusInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                statusInfo.color === 'red' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                          }`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {cooperative.registrationNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {cooperative.approvedAt && (
                          <div title="Approved Date">Apr: {new Date(cooperative.approvedAt).toLocaleDateString()}</div>
                        )}
                        {cooperative.activatedAt && (
                          <div title="Activated Date">Act: {new Date(cooperative.activatedAt).toLocaleDateString()}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          {cooperative.status === 'PENDING_APPROVAL' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(cooperative.id)}
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleReject(cooperative.id)}
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}

                          {cooperative.status === 'APPROVED' && (
                            <Button
                              size="sm"
                              onClick={() => handleActivate(cooperative.id)}
                              title="Activate"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}

                          {cooperative.status === 'ACTIVE' && (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleSuspend(cooperative.id)}
                              title="Suspend"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleEdit(cooperative)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCooperatives.length === 0 && (
            <div className="text-center py-12">
              <Building className="h-16 w-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No cooperatives found</h3>
              <p className="text-slate-600 mb-4">Try adjusting your search or filter criteria</p>
              <Button
                onClick={() => setShowForm(true)}
                startIcon={<Plus className="h-4 w-4" />}
              >
                Register Your First Cooperative
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;
