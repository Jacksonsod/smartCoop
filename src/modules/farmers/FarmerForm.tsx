import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { farmersApi } from '../../services/mockApi';
import { Farmer } from '../../types';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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
        await farmersApi.createFarmer(farmer as Omit<Farmer, 'id' | 'createdAt' | 'updatedAt'>);
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
          onClick={() => navigate('/farmers')}
          sx={{ mr: 2 }}
        >
          Back to Farmers
        </Button>
        <Typography variant="h4" fontWeight={600}>
          {isEditing ? 'Edit Farmer' : 'Add New Farmer'}
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Farmer {isEditing ? 'updated' : 'created'} successfully! Redirecting...
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Farmer Name"
                  name="name"
                  value={farmer.name || ''}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={farmer.email || ''}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={farmer.phone || ''}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Farm Size (hectares)"
                  name="farmSize"
                  type="number"
                  inputProps={{ min: 0, step: 0.1 }}
                  value={farmer.farmSize || ''}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  multiline
                  rows={3}
                  value={farmer.address || ''}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Farmer' : 'Create Farmer')}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/farmers')}
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FarmerForm;
