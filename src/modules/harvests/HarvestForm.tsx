import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { harvestsApi, farmersApi } from '../../services/mockApi';
import { Farmer, CropType, Grade } from '../../types';
import {
  Button,
  Card,
  CardContent,
  Input,
  Select,
} from '../../components';
import {
  ArrowLeft,
  Save,
} from 'lucide-react';

const HarvestForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    farmerId: '',
    crop: '' as CropType | '',
    weight: '',
    grade: '' as Grade | '',
    harvestDate: new Date().toISOString().split('T')[0],
  });

  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const cropTypes: CropType[] = ['MAIZE', 'WHEAT', 'RICE', 'SOYBEANS', 'COTTON'];
  const grades: Grade[] = ['A', 'B', 'C'];

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!user) return;

      try {
        setInitialLoading(true);
        setError(null);

        // Fetch farmers
        const farmersResponse = await farmersApi.getFarmers(user.tenantId);
        setFarmers(farmersResponse.data);

        // If editing, fetch harvest data
        if (id) {
          const harvestResponse = await harvestsApi.getHarvestById(id, user.tenantId);
          const harvest = harvestResponse.data;
          setFormData({
            farmerId: harvest.farmerId,
            crop: harvest.crop,
            weight: harvest.weight.toString(),
            grade: harvest.grade,
            harvestDate: harvest.harvestDate.split('T')[0],
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleChange = (field: string, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field-specific error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.farmerId) {
      errors.farmerId = 'Farmer is required';
    }

    if (!formData.crop || !cropTypes.includes(formData.crop as CropType)) {
      errors.crop = 'Crop type is required';
    }

    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      errors.weight = 'Weight must be greater than 0';
    }

    if (!formData.grade || !grades.includes(formData.grade as Grade)) {
      errors.grade = 'Grade is required';
    }

    if (!formData.harvestDate) {
      errors.harvestDate = 'Harvest date is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm() || !user) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const harvestData = {
        ...formData,
        weight: parseFloat(formData.weight),
        status: 'RECORDED' as const,
        submittedBy: user.id,
        tenantId: user.tenantId,
        crop: formData.crop as CropType,
        grade: formData.grade as Grade,
      };

      if (isEditing && id) {
        await harvestsApi.updateHarvest(id, harvestData, user.tenantId);
      } else {
        await harvestsApi.createHarvest(harvestData);
      }

      navigate('/harvests');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save harvest';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button
          onClick={() => navigate('/harvests')}
          className="mr-4"
          variant="secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Harvests
        </Button>
        <h1 className="text-2xl font-semibold">
          {isEditing ? 'Edit Harvest' : 'Add New Harvest'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farmer
                </label>
                <Select
                  value={formData.farmerId}
                  onChange={(value) => handleChange('farmerId', value)}
                  disabled={loading}
                  className={validationErrors.farmerId ? 'border-red-500' : ''}
                  options={[
                    { value: '', label: 'Select a farmer' },
                    ...farmers.map((farmer) => ({
                      value: farmer.id,
                      label: farmer.name
                    }))
                  ]}
                />
                {validationErrors.farmerId && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.farmerId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Crop Type
                </label>
                <Select
                  value={formData.crop}
                  onChange={(value) => handleChange('crop', value)}
                  disabled={loading}
                  className={validationErrors.crop ? 'border-red-500' : ''}
                  options={[
                    { value: '', label: 'Select crop type' },
                    ...cropTypes.map((crop) => ({
                      value: crop,
                      label: crop
                    }))
                  ]}
                />
                {validationErrors.crop && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.crop}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <Input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  disabled={loading}
                  className={validationErrors.weight ? 'border-red-500' : ''}
                  min="0"
                  step="0.01"
                />
                {validationErrors.weight && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.weight}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade
                </label>
                <Select
                  value={formData.grade}
                  onChange={(value) => handleChange('grade', value)}
                  disabled={loading}
                  className={validationErrors.grade ? 'border-red-500' : ''}
                  options={[
                    { value: '', label: 'Select grade' },
                    ...grades.map((grade) => ({
                      value: grade,
                      label: `Grade ${grade}`
                    }))
                  ]}
                />
                {validationErrors.grade && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.grade}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Harvest Date
                </label>
                <Input
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => handleChange('harvestDate', e.target.value)}
                  disabled={loading}
                  className={validationErrors.harvestDate ? 'border-red-500' : ''}
                />
                {validationErrors.harvestDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {validationErrors.harvestDate}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <div className="flex gap-4 justify-end">
                  <Button
                    type="button"
                    onClick={() => navigate('/harvests')}
                    disabled={loading}
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                  >
                    {loading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    )}
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : (isEditing ? 'Update Harvest' : 'Save Harvest')}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HarvestForm;
