import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Pagination,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { harvestsApi, farmersApi } from '../../services/mockApi';
import { Harvest, Farmer, CropType, Grade } from '../../types';

const HarvestList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCrop, setFilterCrop] = useState<CropType | ''>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const cropTypes: CropType[] = ['MAIZE', 'WHEAT', 'RICE', 'SOYBEANS', 'COTTON'];
  const statusOptions = ['PENDING', 'PROCESSED', 'BATCHED'];

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const [harvestsResponse, farmersResponse] = await Promise.all([
          harvestsApi.getHarvests(user.tenantId),
          farmersApi.getFarmers(user.tenantId),
        ]);

        setHarvests(harvestsResponse.data);
        setFarmers(farmersResponse.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch harvests';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const getFarmerName = (farmerId: string): string => {
    const farmer = farmers.find(f => f.id === farmerId);
    return farmer ? farmer.name : 'Unknown Farmer';
  };

  const filteredHarvests = harvests.filter(harvest => {
    const farmerName = getFarmerName(harvest.farmerId);
    const matchesSearch = 
      farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      harvest.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      harvest.weight.toString().includes(searchTerm);
    
    const matchesCrop = !filterCrop || harvest.crop === filterCrop;
    const matchesStatus = !filterStatus || harvest.status === filterStatus;

    return matchesSearch && matchesCrop && matchesStatus;
  });

  const paginatedHarvests = filteredHarvests.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number): void => {
    setPage(value);
  };

  const getGradeColor = (grade: Grade): 'success' | 'warning' | 'default' => {
    switch (grade) {
      case 'A': return 'success';
      case 'B': return 'warning';
      case 'C': return 'default';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'info' | 'default' => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PROCESSING': return 'warning';
      case 'PENDING': return 'info';
      default: return 'default';
    }
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Harvests
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/harvests/add')}
        >
          Add Harvest
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search harvests..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250, flexGrow: 1 }}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Crop Type</InputLabel>
              <Select
                value={filterCrop}
                label="Crop Type"
                onChange={(e) => setFilterCrop(e.target.value as CropType | '')}
              >
                <MenuItem value="">All Crops</MenuItem>
                {cropTypes.map((crop) => (
                  <MenuItem key={crop} value={crop}>
                    {crop}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Farmer</TableCell>
                  <TableCell>Crop</TableCell>
                  <TableCell>Weight (kg)</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedHarvests.length > 0 ? (
                  paginatedHarvests.map((harvest) => (
                    <TableRow key={harvest.id} hover>
                      <TableCell>
                        {new Date(harvest.harvestDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {getFarmerName(harvest.farmerId)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={harvest.crop} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {harvest.weight.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={harvest.grade}
                          size="small"
                          color={getGradeColor(harvest.grade)}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={harvest.status}
                          size="small"
                          color={getStatusColor(harvest.status)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => navigate(`/harvests/${harvest.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                        {searchTerm || filterCrop || filterStatus 
                          ? 'No harvests found matching your filters.' 
                          : 'No harvests recorded yet.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredHarvests.length > rowsPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination
                count={Math.ceil(filteredHarvests.length / rowsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default HarvestList;
