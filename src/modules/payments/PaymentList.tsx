import React, { useState, useEffect } from 'react';
import { useCooperativeStore } from '../../store/cooperativeStore';
import { Payment, PaymentStatus } from '../../types';
import {
  Button,
  Card,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeadCell,
  Badge,
  Input,
  Select,
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter
} from '../../components';
import {
  Search,
  CheckCircle,
} from 'lucide-react';

const PaymentList: React.FC = () => {
  const { payments, farmers, fetchPayments, fetchFarmers, fetchHarvests, updatePayment, isLoading } = useCooperativeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | ''>('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusOptions: PaymentStatus[] = ['PENDING', 'PAID', 'OVERDUE'];

  useEffect(() => {
    fetchPayments();
    fetchFarmers();
    fetchHarvests();
  }, [fetchPayments, fetchFarmers, fetchHarvests]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const getFarmerName = (farmerId: string): string => {
    const farmer = farmers.find((f: any) => f.id === farmerId);
    return farmer ? farmer.name : 'Unknown Farmer';
  };

  const getStatusVariant = (status: PaymentStatus): 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case 'PAID': return 'success';
      case 'PENDING': return 'warning';
      case 'OVERDUE': return 'error';
      default: return 'info';
    }
  };


  const filteredPayments = payments.filter((payment: Payment) => {
    const farmerName = getFarmerName(payment.farmerId);
    const matchesSearch =
      farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount.toString().includes(searchTerm);

    const matchesStatus = !filterStatus || payment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const paginatedPayments = filteredPayments.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleUpdateStatus = (payment: Payment): void => {
    setSelectedPayment(payment);
    setUpdateDialogOpen(true);
  };

  const handleStatusUpdate = async (newStatus: PaymentStatus): Promise<void> => {
    if (!selectedPayment) return;

    try {
      setUpdating(true);
      await updatePayment(selectedPayment.id, {
        status: newStatus,
        paidDate: newStatus === 'PAID' ? new Date().toISOString() : undefined
      });

      setUpdateDialogOpen(false);
      setSelectedPayment(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment status';
      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading && payments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Payments</h1>

      <Card className="mb-6">
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Search payments by farmer..."
                value={searchTerm}
                onChange={handleSearch}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="min-w-40">
              <Select
                value={filterStatus}
                onChange={(value) => setFilterStatus(value as PaymentStatus | '')}
                options={[
                  { value: '', label: 'All Status' },
                  ...statusOptions.map((status) => ({
                    value: status,
                    label: status
                  }))
                ]}
                placeholder="Status"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeadCell>Farmer</TableHeadCell>
                <TableHeadCell>Amount</TableHeadCell>
                <TableHeadCell>Due Date</TableHeadCell>
                <TableHeadCell>Paid Date</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell className="text-center">Actions</TableHeadCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((payment: Payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <span className="font-semibold">{getFarmerName(payment.farmerId)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">${payment.amount.toFixed(2)}</span>
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
                      <Badge variant={getStatusVariant(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {payment.status !== 'PAID' && (
                        <Button
                          size="sm"
                          variant="ghost"
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
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-sm text-gray-500">
                      {searchTerm || filterStatus
                        ? 'No payments found matching your filters.'
                        : 'No payments recorded yet.'}
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {filteredPayments.length > rowsPerPage && (
            <div className="flex justify-center p-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {page} of {Math.ceil(filteredPayments.length / rowsPerPage)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === Math.ceil(filteredPayments.length / rowsPerPage)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Status Dialog */}
      <Modal isOpen={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
        <ModalHeader>Update Payment Status</ModalHeader>
        <ModalContent>
          {selectedPayment && (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Payment for {getFarmerName(selectedPayment.farmerId)}
              </p>
              <p className="text-lg font-semibold mb-2">
                Amount: ${selectedPayment.amount.toFixed(2)}
              </p>
              <p className="text-sm mb-4">
                Current Status: <Badge variant={getStatusVariant(selectedPayment.status)}>{selectedPayment.status}</Badge>
              </p>
            </div>
          )}
        </ModalContent>
        <ModalFooter>
          <Button onClick={() => setUpdateDialogOpen(false)} disabled={updating} variant="ghost">
            Cancel
          </Button>
          {selectedPayment?.status === 'PENDING' && (
            <Button
              onClick={() => handleStatusUpdate('PAID')}
              disabled={updating}
            >
              {updating && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              <CheckCircle className="w-4 h-4 mr-2" />
              {updating ? 'Updating...' : 'Mark as Paid'}
            </Button>
          )}
          {selectedPayment?.status === 'OVERDUE' && (
            <Button
              onClick={() => handleStatusUpdate('PAID')}
              disabled={updating}
            >
              {updating && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              <CheckCircle className="w-4 h-4 mr-2" />
              {updating ? 'Updating...' : 'Mark as Paid'}
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default PaymentList;
