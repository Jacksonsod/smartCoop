import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { harvestsApi, farmersApi } from '../../services/mockApi';
import { Farmer, Harvest, CropType, Grade } from '../../types';

const HarvestForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    farmerId: '',
    crop: '' as CropType,
    weight: '',
    grade: '' as Grade,
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

    if (!formData.crop) {
      errors.crop = 'Crop type is required';
    }

    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      errors.weight = 'Weight must be greater than 0';
    }

    if (!formData.grade) {
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
        status: 'PENDING' as const,
        tenantId: user.tenantId,
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/harvests')}
          sx={{ mr: 2 }}
        >
          Back to Harvests
        </Button>
        <Typography variant="h4" fontWeight={600}>
          {isEditing ? 'Edit Harvest' : 'Add New Harvest'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!validationErrors.farmerId}>
                  <InputLabel>Farmer</InputLabel>
                  <Select
                    value={formData.farmerId}
                    label="Farmer"
                    onChange={(e) => handleChange('farmerId', e.target.value)}
                    disabled={loading}
                  >
                    {farmers.map((farmer) => (
                      <MenuItem key={farmer.id} value={farmer.id}>
                        {farmer.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {validationErrors.farmerId && (
                    <Typography variant="caption" color="error">
                      {validationErrors.farmerId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!validationErrors.crop}>
                  <InputLabel>Crop Type</InputLabel>
                  <Select
                    value={formData.crop}
                    label="Crop Type"
                    onChange={(e) => handleChange('crop', e.target.value)}
                    disabled={loading}
                  >
                    {cropTypes.map((crop) => (
                      <MenuItem key={crop} value={crop}>
                        {crop}
                      </MenuItem>
                    ))}
                  </Select>
                  {validationErrors.crop && (
                    <Typography variant="caption" color="error">
                      {validationErrors.crop}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  error={!!validationErrors.weight}
                  helperText={validationErrors.weight}
                  disabled={loading}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!validationErrors.grade}>
                  <InputLabel>Grade</InputLabel>
                  <Select
                    value={formData.grade}
                    label="Grade"
                    onChange={(e) => handleChange('grade', e.target.value)}
                    disabled={loading}
                  >
                    {grades.map((grade) => (
                      <MenuItem key={grade} value={grade}>
                        Grade {grade}
                      </MenuItem>
                    ))}
                  </Select>
                  {validationErrors.grade && (
                    <Typography variant="caption" color="error">
                      {validationErrors.grade}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Harvest Date"
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => handleChange('harvestDate', e.target.value)}
                  error={!!validationErrors.harvestDate}
                  helperText={validationErrors.harvestDate}
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/harvests')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (isEditing ? 'Update Harvest' : 'Save Harvest')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HarvestForm;
