import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { farmersApi } from '../../services/mockApi';
import { Farmer } from '../../types';
import {
  Button,
  Card,
  CardContent,
  Input,
  Textarea
} from '../../components';
import {
  ArrowLeft,
  Save,
} from 'lucide-react';

const FarmerForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();
  const [farmer, setFarmer] = useState<Partial<Farmer>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    farmSize: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isEditing = !!id;

  useEffect(() => {
    const fetchFarmer = async (): Promise<void> => {
      if (!id || !user) return;

      try {
        setLoading(true);
        const response = await farmersApi.getFarmerById(id, user.tenantId);
        setFarmer(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch farmer');
      } finally {
        setLoading(false);
      }
    };

    if (isEditing) {
      fetchFarmer();
    }
  }, [id, isEditing, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFarmer(prev => ({
      ...prev,
      [name]: name === 'farmSize' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!user) return;

    // Basic validation
    if (!farmer.name?.trim() || !farmer.email?.trim() || !farmer.phone?.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEditing && id) {
        await farmersApi.updateFarmer(id, farmer as Partial<Farmer>, user.tenantId);
      } else {
        // Add tenant ID to farmer data
        const farmerWithTenant = {
          ...farmer,
          tenantId: user.tenantId,
        };
        await farmersApi.createFarmer(farmerWithTenant as Omit<Farmer, 'id' | 'createdAt' | 'updatedAt'>);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/farmers');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save farmer');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-50vh">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-gray-600" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardContent>
          <div className="flex items-center mb-6 gap-4">
            <button
              onClick={() => navigate('/farmers')}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">
              {isEditing ? 'Edit Farmer' : 'Add New Farmer'}
            </h1>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
              Farmer {isEditing ? 'updated' : 'created'} successfully! Redirecting...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Farmer Name"
                name="name"
                value={farmer.name || ''}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <Input
                label="Email"
                name="email"
                type="email"
                value={farmer.email || ''}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <Input
                label="Phone Number"
                name="phone"
                value={farmer.phone || ''}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <Input
                label="Farm Size (hectares)"
                name="farmSize"
                type="number"
                min={0}
                step={0.1}
                value={farmer.farmSize || ''}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="mt-6">
              <Textarea
                label="Address"
                name="address"
                rows={3}
                value={farmer.address || ''}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                type="submit"
                loading={loading}
                startIcon={<Save className="h-4 w-4" />}
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Farmer' : 'Create Farmer')}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/farmers')}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerForm;
