import React, { useState } from 'react';
import { useCooperativeStore } from '../../store/cooperativeStore';
import { Card, CardContent, Button } from '../../components';
import { UserPlus, Save, X } from 'lucide-react';

const FarmerRegistration: React.FC = () => {
  const { currentCooperative, farmers, fetchFarmers, createFarmer, isLoading } = useCooperativeStore();
  const [showForm, setShowForm] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationalId: '',
    phone: '',
    email: '',
    address: '',
    farmSize: 0,
  });

  React.useEffect(() => {
    fetchFarmers();
  }, [fetchFarmers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    setError('');

    try {
      await createFarmer({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        farmSize: formData.farmSize,
        tenantId: currentCooperative?.id || '',
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        nationalId: '',
        phone: '',
        email: '',
        address: '',
        farmSize: 0,
      });
      setShowForm(false);
      alert('Farmer registered successfully!');
    } catch (err) {
      setError('Failed to register farmer. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'farmSize' ? parseFloat(value) || 0 : value
    }));
  };

  if (!currentCooperative || currentCooperative.status !== 'ACTIVE') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Cooperative Not Active</h2>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                Your cooperative is not yet approved or activated. Please contact system administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Farmer Registration</h1>
          <p className="text-slate-600">Register new farmers for {currentCooperative.name}</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          startIcon={<UserPlus className="h-4 w-4" />}
        >
          Register New Farmer
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Register New Farmer</h2>
              <Button
                variant="secondary"
                onClick={() => setShowForm(false)}
                startIcon={<X className="h-4 w-4" />}
              >
                Cancel
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    National ID *
                  </label>
                  <input
                    type="text"
                    name="nationalId"
                    required
                    value={formData.nationalId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter national ID"
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
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Farm Size (acres) *
                </label>
                <input
                  type="number"
                  name="farmSize"
                  required
                  min="0"
                  step="0.1"
                  value={formData.farmSize}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter farm size in acres"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={localLoading || isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {localLoading ? 'Registering...' : 'Register Farmer'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Farmers List */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Registered Farmers</h2>
          {isLoading ? (
            <div className="text-center py-8">Loading farmers...</div>
          ) : farmers.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <UserPlus className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p>No farmers registered yet.</p>
              <p className="text-sm">Click "Register New Farmer" to add farmers to your cooperative.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Farm Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Registered</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {farmers.map((farmer) => (
                    <tr key={farmer.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{farmer.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{farmer.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{farmer.farmSize} acres</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(farmer.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerRegistration;
