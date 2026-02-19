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
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { batchesApi, harvestsApi, farmersApi } from '../../services/mockApi';
import { Batch, Harvest, Farmer, Grade } from '../../types';

const BatchList: React.FC = () => {
  const { user } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const [batchesResponse, harvestsResponse, farmersResponse] = await Promise.all([
          batchesApi.getBatches(user.tenantId),
          harvestsApi.getHarvests(user.tenantId),
          farmersApi.getFarmers(user.tenantId),
        ]);

        setBatches(batchesResponse.data);
        setHarvests(harvestsResponse.data);
        setFarmers(farmersResponse.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch batches';
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

  const getHarvestsForBatch = (harvestIds: string[]): Harvest[] => {
    return harvests.filter(h => harvestIds.includes(h.id));
  };

  const getFarmerName = (farmerId: string): string => {
    const farmer = farmers.find(f => f.id === farmerId);
    return farmer ? farmer.name : 'Unknown Farmer';
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'info' | 'default' => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PROCESSING': return 'warning';
      case 'CREATED': return 'info';
      default: return 'default';
    }
  };

  const getGradeColor = (grade: Grade): 'success' | 'warning' | 'default' => {
    switch (grade) {
      case 'A': return 'success';
      case 'B': return 'warning';
      case 'C': return 'default';
      default: return 'default';
    }
  };

  const filteredBatches = batches.filter(batch =>
    batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.totalWeight.toString().includes(searchTerm)
  );

  const paginatedBatches = filteredBatches.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number): void => {
    setPage(value);
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
      <Typography variant="h4" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
        Batches
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search batches by batch number or weight..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {paginatedBatches.length > 0 ? (
        paginatedBatches.map((batch) => {
          const batchHarvests = getHarvestsForBatch(batch.harvestIds);
          const uniqueFarmers = [...new Set(batchHarvests.map(h => h.farmerId))];

          return (
            <Card key={batch.id} sx={{ mb: 2 }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                    <InventoryIcon color="primary" />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {batch.batchNumber}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                        <Chip
                          label={`${batch.totalWeight.toLocaleString()} kg`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={`Grade ${batch.grade}`}
                          size="small"
                          color={getGradeColor(batch.grade)}
                        />
                        <Chip
                          label={batch.status}
                          size="small"
                          color={getStatusColor(batch.status)}
                        />
                        <Chip
                          label={`${batchHarvests.length} harvests`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Batch Information
                      </Typography>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Created Date
                        </Typography>
                        <Typography variant="body2">
                          {new Date(batch.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Weight
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {batch.totalWeight.toLocaleString()} kg
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Farmers
                        </Typography>
                        <Typography variant="body2">
                          {uniqueFarmers.length} farmer(s)
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Harvest Details
                      </Typography>
                      {batchHarvests.length > 0 ? (
                        batchHarvests.map((harvest) => (
                          <Box key={harvest.id} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body2" fontWeight={600}>
                                {getFarmerName(harvest.farmerId)}
                              </Typography>
                              <Typography variant="body2">
                                {harvest.weight.toLocaleString()} kg
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                              <Chip label={harvest.crop} size="small" variant="outlined" />
                              <Chip
                                label={`Grade ${harvest.grade}`}
                                size="small"
                                color={getGradeColor(harvest.grade)}
                              />
                            </Box>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No harvests found for this batch.
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Card>
          );
        })
      ) : (
        <Card>
          <CardContent>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <InventoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchTerm ? 'No batches found matching your search.' : 'No batches created yet.'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Batches are created when harvests are grouped together for processing.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {filteredBatches.length > rowsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(filteredBatches.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default BatchList;
