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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { paymentsApi, farmersApi, batchesApi } from '../../services/mockApi';
import { Payment, Farmer, Batch, PaymentStatus } from '../../types';

const PaymentList: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | ''>('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const statusOptions: PaymentStatus[] = ['PENDING', 'PAID', 'OVERDUE'];

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const [paymentsResponse, farmersResponse, batchesResponse] = await Promise.all([
          paymentsApi.getPayments(user.tenantId),
          farmersApi.getFarmers(user.tenantId),
          batchesApi.getBatches(user.tenantId),
        ]);

        setPayments(paymentsResponse.data);
        setFarmers(farmersResponse.data);
        setBatches(batchesResponse.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch payments';
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

  const getBatchNumber = (batchId: string): string => {
    const batch = batches.find(b => b.id === batchId);
    return batch ? batch.batchNumber : 'Unknown Batch';
  };

  const getStatusColor = (status: PaymentStatus): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'PAID': return 'success';
      case 'PENDING': return 'warning';
      case 'OVERDUE': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'PAID': return <CheckCircleIcon />;
      case 'PENDING': return <HourglassEmptyIcon />;
      case 'OVERDUE': return <WarningIcon />;
      default: return <PaymentIcon />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const farmerName = getFarmerName(payment.farmerId);
    const batchNumber = getBatchNumber(payment.batchId);
    const matchesSearch = 
      farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount.toString().includes(searchTerm);
    
    const matchesStatus = !filterStatus || payment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const paginatedPayments = filteredPayments.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number): void => {
    setPage(value);
  };

  const handleUpdateStatus = (payment: Payment): void => {
    setSelectedPayment(payment);
    setUpdateDialogOpen(true);
  };

  const handleStatusUpdate = async (newStatus: PaymentStatus): Promise<void> => {
    if (!selectedPayment || !user) return;

    try {
      setUpdating(true);
      await paymentsApi.updatePaymentStatus(selectedPayment.id, newStatus, user.tenantId);
      
      // Update local state
      setPayments(prev => prev.map(p => 
        p.id === selectedPayment.id 
          ? { ...p, status: newStatus, paidDate: newStatus === 'PAID' ? new Date().toISOString() : undefined }
          : p
      ));
      
      setUpdateDialogOpen(false);
      setSelectedPayment(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment status';
      setError(errorMessage);
    } finally {
      setUpdating(false);
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
      <Typography variant="h4" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
        Payments
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search payments..."
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
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value as PaymentStatus | '')}
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
                  <TableCell>Farmer</TableCell>
                  <TableCell>Batch</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Paid Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPayments.length > 0 ? (
                  paginatedPayments.map((payment) => (
                    <TableRow key={payment.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {getFarmerName(payment.farmerId)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {getBatchNumber(payment.batchId)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          ${payment.amount.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {payment.paidDate 
                          ? new Date(payment.paidDate).toLocaleDateString()
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(payment.status)}
                          label={payment.status}
                          size="small"
                          color={getStatusColor(payment.status)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {payment.status !== 'PAID' && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleUpdateStatus(payment)}
                          >
                            Mark as Paid
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                        {searchTerm || filterStatus 
                          ? 'No payments found matching your filters.' 
                          : 'No payments recorded yet.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredPayments.length > rowsPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Pagination
                count={Math.ceil(filteredPayments.length / rowsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Update Status Dialog */}
      <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Payment Status</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Payment for {getFarmerName(selectedPayment.farmerId)} - {getBatchNumber(selectedPayment.batchId)}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Amount: ${selectedPayment.amount.toFixed(2)}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Current Status: <Chip label={selectedPayment.status} size="small" color={getStatusColor(selectedPayment.status)} />
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)} disabled={updating}>
            Cancel
          </Button>
          {selectedPayment?.status === 'PENDING' && (
            <Button
              onClick={() => handleStatusUpdate('PAID')}
              variant="contained"
              disabled={updating}
              startIcon={updating ? <CircularProgress size={20} /> : <CheckCircleIcon />}
            >
              {updating ? 'Updating...' : 'Mark as Paid'}
            </Button>
          )}
          {selectedPayment?.status === 'OVERDUE' && (
            <Button
              onClick={() => handleStatusUpdate('PAID')}
              variant="contained"
              disabled={updating}
              startIcon={updating ? <CircularProgress size={20} /> : <CheckCircleIcon />}
            >
              {updating ? 'Updating...' : 'Mark as Paid'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentList;
