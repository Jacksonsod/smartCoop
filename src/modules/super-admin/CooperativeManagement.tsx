import React, { useState } from 'react';
import { useCooperativeStore } from '../../store/cooperativeStore';
import { Card, CardContent, Button } from '../../components';
import { Cooperative, CooperativeStatus } from '../../types/cooperative';
import {
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  Mail,
  Phone,
  MapPin,
  FileText,
  UserCheck,
  AlertCircle,
} from 'lucide-react';

const CooperativeManagement: React.FC = () => {
  const {
    cooperatives,
    registerCooperative,
    approveCooperative,
    rejectCooperative,
    activateCooperative,
    suspendCooperative,
    isLoading,
    error
  } = useCooperativeStore();

  const [showForm, setShowForm] = useState(false);
  const [editingCooperative, setEditingCooperative] = useState<Cooperative | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    adminUserId: 'admin-001',
  });

  // Filter cooperatives
  const filteredCooperatives = cooperatives.filter(coop => {
    const matchesSearch = coop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coop.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coop.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || coop.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: CooperativeStatus) => {
    const variants = {
      DRAFT: { color: 'gray', text: 'Draft', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
      PENDING_APPROVAL: { color: 'yellow', text: 'Pending Approval', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
      APPROVED: { color: 'blue', text: 'Approved', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
      ACTIVE: { color: 'green', text: 'Active', bgColor: 'bg-green-100', textColor: 'text-green-800' },
      SUSPENDED: { color: 'red', text: 'Suspended', bgColor: 'bg-red-100', textColor: 'text-red-800' },
    };
    return variants[status] || { color: 'gray', text: 'Unknown', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
  };

  const handleApprove = async (id: string) => {
    try {
      await approveCooperative(id);
      alert('Cooperative approved successfully!');
    } catch (err) {
      alert('Failed to approve cooperative');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await rejectCooperative(id, reason);
      alert('Cooperative rejected successfully!');
    } catch (err) {
      alert('Failed to reject cooperative');
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await activateCooperative(id);
      alert('Cooperative activated successfully!');
    } catch (err) {
      alert('Failed to activate cooperative');
    }
  };

  const handleSuspend = async (id: string) => {
    const reason = prompt('Enter suspension reason:');
    if (!reason) return;

    try {
      await suspendCooperative(id, reason);
      alert('Cooperative suspended successfully!');
    } catch (err) {
      alert('Failed to suspend cooperative');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCooperative) {
        // Update existing cooperative - mock implementation
        const cooperatives = JSON.parse(localStorage.getItem('cooperatives') || '[]');
        const updatedCooperatives = cooperatives.map((c: Cooperative) =>
          c.id === editingCooperative.id
            ? { ...c, ...formData }
            : c
        );
        localStorage.setItem('cooperatives', JSON.stringify(updatedCooperatives));

        // Update store - mock implementation
        useCooperativeStore.setState({
          ...useCooperativeStore.getState(),
          cooperatives: updatedCooperatives,
        });

        alert('Cooperative updated successfully!');
      } else {
        // Create new cooperative
        await registerCooperative({
          ...formData,
          location: formData.address,
          contactEmail: formData.email,
          contactPhone: formData.phone,
          status: 'DRAFT',
        });
        alert('Cooperative registered successfully!');
      }

      setShowForm(false);
      setEditingCooperative(null);
      setFormData({
        name: '',
        registrationNumber: '',
        address: '',
        phone: '',
        email: '',
        description: '',
        adminUserId: 'admin-001',
      });
    } catch (err) {
      alert('Failed to save cooperative');
    }
  };

  const handleEdit = (cooperative: Cooperative) => {
    setEditingCooperative(cooperative);
    setFormData({
      name: cooperative.name,
      registrationNumber: cooperative.registrationNumber,
      address: cooperative.address,
      phone: cooperative.phone,
      email: cooperative.email,
      description: cooperative.description || '',
      adminUserId: cooperative.adminUserId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this cooperative? This action cannot be undone.')) {
      try {
        // Mock delete - in real app, this would call an API
        const cooperatives = JSON.parse(localStorage.getItem('cooperatives') || '[]');
        const updatedCooperatives = cooperatives.filter((c: Cooperative) => c.id !== id);
        localStorage.setItem('cooperatives', JSON.stringify(updatedCooperatives));

        // Update store
        useCooperativeStore.setState({
          ...useCooperativeStore.getState(),
          cooperatives: updatedCooperatives,
        });

        alert('Cooperative deleted successfully!');
      } catch (err) {
        alert('Failed to delete cooperative');
      }
    }
  };

  const getStatusIcon = (status: CooperativeStatus) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return <Clock className="h-4 w-4" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />;
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4" />;
      case 'SUSPENDED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cooperative Management</h1>
          <p className="text-slate-600">Register and manage all cooperatives</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          startIcon={<Plus className="h-4 w-4" />}
        >
          Register New Cooperative
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Registration Form */}
      {showForm && (
        <Card className="mb-8">
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                {editingCooperative ? 'Edit Cooperative' : 'Register New Cooperative'}
              </h2>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingCooperative(null);
                  setFormData({
                    name: '',
                    registrationNumber: '',
                    address: '',
                    phone: '',
                    email: '',
                    description: '',
                    adminUserId: 'admin-001',
                  });
                }}
              >
                Cancel
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Cooperative Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter cooperative name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    required
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter registration number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter description (optional)"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading}>
                  {editingCooperative ? 'Update Cooperative' : 'Register Cooperative'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or registration number..."
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
                <option value="DRAFT">Draft</option>
                <option value="PENDING_APPROVAL">Pending Approval</option>
                <option value="APPROVED">Approved</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cooperatives Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCooperatives.map((cooperative) => {
          const statusInfo = getStatusBadge(cooperative.status);

          return (
            <Card key={cooperative.id} className="hover:shadow-xl transition-all duration-200 hover:scale-105">
              <CardContent>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{cooperative.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">Reg: {cooperative.registrationNumber}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                    {getStatusIcon(cooperative.status)}
                    <span className="ml-2">{statusInfo.text}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="truncate">{cooperative.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{cooperative.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="truncate">{cooperative.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Created: {new Date(cooperative.createdAt).toLocaleDateString()}</span>
                  </div>
                  {cooperative.approvedAt && (
                    <div className="flex items-center text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Approved: {new Date(cooperative.approvedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {cooperative.activatedAt && (
                    <div className="flex items-center text-sm text-slate-600">
                      <UserCheck className="h-4 w-4 mr-2" />
                      <span>Activated: {new Date(cooperative.activatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {cooperative.suspendedAt && (
                    <div className="flex items-center text-sm text-red-600">
                      <XCircle className="h-4 w-4 mr-2" />
                      <span>Suspended: {new Date(cooperative.suspendedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {cooperative.description && (
                    <div className="flex items-start text-sm text-slate-600">
                      <FileText className="h-4 w-4 mr-2 mt-0.5" />
                      <span>{cooperative.description}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  {cooperative.status === 'PENDING_APPROVAL' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(cooperative.id)}
                        startIcon={<CheckCircle className="h-4 w-4" />}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleReject(cooperative.id)}
                        startIcon={<XCircle className="h-4 w-4" />}
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  {cooperative.status === 'APPROVED' && (
                    <Button
                      size="sm"
                      onClick={() => handleActivate(cooperative.id)}
                      startIcon={<CheckCircle className="h-4 w-4" />}
                    >
                      Activate
                    </Button>
                  )}

                  {cooperative.status === 'ACTIVE' && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleSuspend(cooperative.id)}
                      startIcon={<XCircle className="h-4 w-4" />}
                    >
                      Suspend
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEdit(cooperative)}
                    startIcon={<Edit className="h-4 w-4" />}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(cooperative.id)}
                    startIcon={<Trash2 className="h-4 w-4" />}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCooperatives.length === 0 && (
        <Card>
          <CardContent>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CooperativeManagement;
