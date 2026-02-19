import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Agriculture as AgricultureIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { farmersApi, harvestsApi } from '../../services/mockApi';
import { Farmer, Harvest } from '../../types';

const FarmerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!id || !user) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch farmer details
        const farmerResponse = await farmersApi.getFarmerById(id, user.tenantId);
        setFarmer(farmerResponse.data);

        // Fetch farmer's harvests
        const harvestsResponse = await harvestsApi.getHarvests(user.tenantId);
        const farmerHarvests = harvestsResponse.data.filter(h => h.farmerId === id);
        setHarvests(farmerHarvests);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch farmer details';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const getTotalHarvestWeight = (): number => {
    return harvests.reduce((total, harvest) => total + harvest.weight, 0);
  };

  const getHarvestStats = () => {
    const stats = harvests.reduce((acc, harvest) => {
      acc[harvest.crop] = (acc[harvest.crop] || 0) + harvest.weight;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([crop, weight]) => ({
      crop,
      weight,
      percentage: ((weight / getTotalHarvestWeight()) * 100).toFixed(1),
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!farmer) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        Farmer not found.
      </Alert>
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
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/farmers/${farmer.id}/edit`)}
        >
          Edit Farmer
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Farmer Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Farmer Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {farmer.name}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <EmailIcon fontSize="small" /> Email
                </Typography>
                <Typography variant="body1">
                  {farmer.email}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PhoneIcon fontSize="small" /> Phone
                </Typography>
                <Typography variant="body1">
                  {farmer.phone}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnIcon fontSize="small" /> Address
                </Typography>
                <Typography variant="body1">
                  {farmer.address}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AgricultureIcon fontSize="small" /> Farm Size
                </Typography>
                <Chip
                  label={`${farmer.farmSize} hectares`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Harvest Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Harvest Statistics
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Harvest Weight
                </Typography>
                <Typography variant="h4" color="primary" fontWeight={600}>
                  {getTotalHarvestWeight().toLocaleString()} kg
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Harvest by Crop Type
              </Typography>
              {getHarvestStats().length > 0 ? (
                getHarvestStats().map((stat) => (
                  <Box key={stat.crop} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">{stat.crop}</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {stat.weight.toLocaleString()} kg ({stat.percentage}%)
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No harvests recorded yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Harvests */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Recent Harvests ({harvests.length})
              </Typography>
              {harvests.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Crop</TableCell>
                        <TableCell>Weight (kg)</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {harvests.slice(0, 5).map((harvest) => (
                        <TableRow key={harvest.id}>
                          <TableCell>
                            {new Date(harvest.harvestDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Chip label={harvest.crop} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>{harvest.weight.toLocaleString()}</TableCell>
                          <TableCell>
                            <Chip
                              label={harvest.grade}
                              size="small"
                              color={harvest.grade === 'A' ? 'success' : harvest.grade === 'B' ? 'warning' : 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={harvest.status}
                              size="small"
                              color={harvest.status === 'COMPLETED' ? 'success' : harvest.status === 'PROCESSING' ? 'warning' : 'default'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No harvests recorded for this farmer yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FarmerDetails;
