import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { farmersApi, harvestsApi } from '../../services/mockApi';
import { Farmer, Harvest } from '../../types';
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
  Badge
} from '../../components';
import {
  ArrowLeft,
  Edit,
  Wheat,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

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

  if (!farmer) {
    return (
      <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
        Farmer not found.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button onClick={() => navigate('/farmers')} className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Farmers
        </Button>
        <Button variant="secondary" onClick={() => navigate(`/farmers/${farmer.id}/edit`)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Farmer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Farmer Information */}
        <div>
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold mb-4">Farmer Information</h2>
              <div className="mb-3">
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{farmer.name}</p>
              </div>
              <div className="mb-3">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Mail className="w-4 h-4" /> Email
                </p>
                <p>{farmer.email}</p>
              </div>
              <div className="mb-3">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Phone className="w-4 h-4" /> Phone
                </p>
                <p>{farmer.phone}</p>
              </div>
              <div className="mb-3">
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Address
                </p>
                <p>{farmer.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Wheat className="w-4 h-4" /> Farm Size
                </p>
                <Badge>{farmer.farmSize} hectares</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Harvest Statistics */}
        <div>
          <Card>
            <CardContent>
              <h2 className="text-lg font-semibold mb-4">Harvest Statistics</h2>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Total Harvest Weight</p>
                <p className="text-2xl font-bold text-blue-600">{getTotalHarvestWeight().toLocaleString()} kg</p>
              </div>
              <p className="text-sm text-gray-600 mb-2">Harvest by Crop Type</p>
              {getHarvestStats().length > 0 ? (
                getHarvestStats().map((stat) => (
                  <div key={stat.crop} className="mb-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm">{stat.crop}</p>
                      <p className="text-sm font-semibold">
                        {stat.weight.toLocaleString()} kg ({stat.percentage}%)
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No harvests recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Harvests */}
        <div className="md:col-span-2">
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold mb-4">
                Recent Harvests ({harvests.length})
              </h3>
              {harvests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeadCell>Date</TableHeadCell>
                      <TableHeadCell>Crop</TableHeadCell>
                      <TableHeadCell>Weight (kg)</TableHeadCell>
                      <TableHeadCell>Grade</TableHeadCell>
                      <TableHeadCell>Status</TableHeadCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {harvests.slice(0, 5).map((harvest) => (
                      <TableRow key={harvest.id}>
                        <TableCell>
                          {new Date(harvest.harvestDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="gray">{harvest.crop}</Badge>
                        </TableCell>
                        <TableCell>{harvest.weight.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={harvest.grade === 'A' ? 'success' : harvest.grade === 'B' ? 'warning' : 'gray'}
                          >
                            {harvest.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={harvest.status === 'APPROVED' ? 'success' : harvest.status === 'PENDING_VERIFICATION' ? 'warning' : 'gray'}
                          >
                            {harvest.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-gray-500">
                  No harvests recorded for this farmer yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FarmerDetails;
