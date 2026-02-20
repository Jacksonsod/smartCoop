import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { farmersApi } from '../../services/mockApi';
import { Farmer } from '../../types';
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

  Input
} from '../../components';
import {
  Search,
  Eye,
  Edit,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const FarmerList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    const fetchFarmers = async (): Promise<void> => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        const response = await farmersApi.getFarmers(user.tenantId);
        setFarmers(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch farmers');
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, [user]);

  const filteredFarmers = farmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedFarmers = filteredFarmers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredFarmers.length / rowsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-2xl font-bold text-slate-900">Farmers</h1>
            <Button
              onClick={() => navigate('/farmers/add')}
              startIcon={<Plus className="h-4 w-4" />}
            >
              Add Farmer
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <Input
              placeholder="Search farmers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4 text-slate-400" />}
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeadCell>Name</TableHeadCell>
                  <TableHeadCell>Email</TableHeadCell>
                  <TableHeadCell>Phone</TableHeadCell>
                  <TableHeadCell>Farm Size</TableHeadCell>
                  <TableHeadCell>Address</TableHeadCell>
                  <TableHeadCell align="center">Actions</TableHeadCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedFarmers.length > 0 ? (
                  paginatedFarmers.map((farmer) => (
                    <TableRow key={farmer.id}>
                      <TableCell>
                        <div className="font-medium text-slate-900">{farmer.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-slate-600">{farmer.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-slate-600">{farmer.phone}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-slate-600">{farmer.farmSize} ha</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-slate-600 max-w-xs truncate">{farmer.address}</div>
                      </TableCell>
                      <TableCell align="center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/farmers/${farmer.id}`)}
                            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/farmers/${farmer.id}/edit`)}
                            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <div className="py-8 text-slate-500 text-sm">
                        {searchTerm ? 'No farmers found matching your search.' : 'No farmers registered yet.'}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-slate-600">
                Showing {((page - 1) * rowsPerPage) + 1} to {Math.min(page * rowsPerPage, filteredFarmers.length)} of {filteredFarmers.length} farmers
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded ${pageNum === page
                          ? 'bg-primary-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerList;
