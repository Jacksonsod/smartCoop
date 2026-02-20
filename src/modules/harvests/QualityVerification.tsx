import React, { useState } from 'react';
import { useCooperativeStore } from '../../store/cooperativeStore';
import { Card, CardContent, Button } from '../../components';
import { CheckCircle, XCircle, Eye, Search } from 'lucide-react';

const QualityVerification: React.FC = () => {
  const { currentCooperative, harvests, farmers, fetchHarvests, fetchFarmers, updateHarvest, isLoading } = useCooperativeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    fetchHarvests();
    fetchFarmers();
  }, [fetchHarvests, fetchFarmers]);

  const filteredHarvests = harvests.filter(harvest => {
    const farmer = farmers.find(f => f.id === harvest.farmerId);
    const farmerName = farmer?.name || '';
    return (
      farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      harvest.crop.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleApprove = async (harvestId: string) => {
    setLocalLoading(true);
    setError('');

    try {
      await updateHarvest(harvestId, {
        status: 'APPROVED',
        verifiedBy: 'current-inspector-id',
        verifiedAt: new Date().toISOString(),
      });
      alert('Harvest approved successfully!');
    } catch (err) {
      setError('Failed to approve harvest. Please try again.');
    } finally {
      setLocalLoading(true);
    }
  };

  const handleReject = async (harvestId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    setLocalLoading(true);
    setError('');

    try {
      await updateHarvest(harvestId, {
        status: 'REJECTED',
        verifiedBy: 'current-inspector-id',
        verifiedAt: new Date().toISOString(),
        rejectionReason: reason,
      });
      alert('Harvest rejected successfully!');
    } catch (err) {
      setError('Failed to reject harvest. Please try again.');
    } finally {
      setLocalLoading(true);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; text: string }> = {
      RECORDED: { color: 'yellow', text: 'Pending Verification' },
      PENDING_VERIFICATION: { color: 'yellow', text: 'Pending Verification' },
      APPROVED: { color: 'green', text: 'Approved' },
      REJECTED: { color: 'red', text: 'Rejected' },
    };
    return variants[status] || { color: 'gray', text: 'Unknown' };
  };

  if (!currentCooperative || currentCooperative.status !== 'ACTIVE') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Cooperative Not Active</h2>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                Your cooperative is not yet approved or activated. Please contact system administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Quality Verification</h1>
        <p className="text-slate-600">Verify harvest quality for {currentCooperative.name}</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by farmer name or crop type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Harvests List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading verification queue...</div>
        ) : filteredHarvests.map((harvest) => {
          const farmer = farmers.find(f => f.id === harvest.farmerId);
          const status = getStatusBadge(harvest.status);
          return (
            <Card key={harvest.id}>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{farmer?.name || 'Unknown Farmer'}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          status.color === 'green' ? 'bg-green-100 text-green-800' :
                            status.color === 'red' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                        }`}>
                        {status.text}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Crop:</span> {harvest.crop}
                      </div>
                      <div>
                        <span className="font-medium">Weight:</span> {harvest.weight} kg
                      </div>
                      <div>
                        <span className="font-medium">Grade:</span> {harvest.grade}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {new Date(harvest.harvestDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-slate-600">
                      <span className="font-medium">Submitted by:</span> {harvest.submittedBy}
                      {harvest.verifiedAt && (
                        <>
                          <span className="ml-4 font-medium">Verified At:</span> {new Date(harvest.verifiedAt).toLocaleString()}
                        </>
                      )}
                      {harvest.rejectionReason && (
                        <div className="mt-1 text-red-600">
                          <span className="font-medium">Reason:</span> {harvest.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4 md:mt-0">
                    {(harvest.status === 'RECORDED' || harvest.status === 'PENDING_VERIFICATION') && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(harvest.id)}
                          disabled={localLoading || isLoading}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleReject(harvest.id)}
                          disabled={localLoading || isLoading}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}

                    {harvest.status !== 'RECORDED' && harvest.status !== 'PENDING_VERIFICATION' && (
                      <Button
                        size="sm"
                        variant="secondary"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredHarvests.length === 0 && (
        <Card>
          <CardContent>
            <div className="text-center py-8 text-slate-500">
              <Eye className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p>No harvests found.</p>
              <p className="text-sm">Try adjusting your search criteria.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QualityVerification;
