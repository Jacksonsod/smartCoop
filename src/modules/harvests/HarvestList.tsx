import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { harvestsApi, farmersApi } from '../../services/mockApi';
import { Harvest, Farmer, CropType } from '../../types';
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
  Select
} from '../../components';
import {
  Search,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Harvests</h1>
        <Button onClick={() => navigate('/harvests/add')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Harvest
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <Input
                placeholder="Search harvests..."
                value={searchTerm}
                onChange={handleSearch}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="min-w-40">
              <Select
                value={filterCrop}
                onChange={(value) => setFilterCrop(value as CropType | '')}
                options={[
                  { value: '', label: 'All Crops' },
                  ...cropTypes.map(crop => ({ value: crop, label: crop }))
                ]}
                placeholder="Crop Type"
              />
            </div>
            <div className="min-w-40">
              <Select
                value={filterStatus}
                onChange={(value) => setFilterStatus(value)}
                options={[
                  { value: '', label: 'All Status' },
                  ...statusOptions.map(status => ({ value: status, label: status }))
                ]}
                placeholder="Status"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card padding="none">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeadCell>Date</TableHeadCell>
                <TableHeadCell>Farmer</TableHeadCell>
                <TableHeadCell>Crop</TableHeadCell>
                <TableHeadCell>Weight (kg)</TableHeadCell>
                <TableHeadCell>Grade</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell className="text-center">Actions</TableHeadCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedHarvests.length > 0 ? (
                paginatedHarvests.map((harvest) => (
                  <TableRow key={harvest.id}>
                    <TableCell>
                      {new Date(harvest.harvestDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{getFarmerName(harvest.farmerId)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="gray">{harvest.crop}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{harvest.weight.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={harvest.grade === 'A' ? 'success' : harvest.grade === 'B' ? 'warning' : 'error'}>
                        {harvest.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={harvest.status === 'PROCESSED' ? 'success' : harvest.status === 'BATCHED' ? 'info' : 'warning'}>
                        {harvest.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/harvests/${harvest.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-3 text-gray-500">
                    {searchTerm || filterCrop || filterStatus
                      ? 'No harvests found matching your filters.'
                      : 'No harvests recorded yet.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {filteredHarvests.length > rowsPerPage && (
            <div className="flex justify-center p-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {page} of {Math.ceil(filteredHarvests.length / rowsPerPage)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === Math.ceil(filteredHarvests.length / rowsPerPage)}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HarvestList;
