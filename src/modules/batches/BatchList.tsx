import React, { useState, useEffect } from 'react';
import { useCooperativeStore } from '../../store/cooperativeStore';
import { Batch, Harvest, Farmer, Grade } from '../../types';
import {
  Button,
  Card,
  CardContent,
  Badge,
  Input,
  Select,
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Checkbox,
} from '../../components';
import {
  Search,
  ChevronDown,
  Package,
  Plus,
} from 'lucide-react';

const BatchList: React.FC = () => {
  const { currentCooperative, batches, harvests, farmers, fetchBatches, fetchHarvests, fetchFarmers, createBatch, isLoading } = useCooperativeStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedHarvests, setSelectedHarvests] = useState<string[]>([]);
  const [batchGrade, setBatchGrade] = useState<Grade | ''>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBatches();
    fetchHarvests();
    fetchFarmers();
  }, [fetchBatches, fetchHarvests, fetchFarmers]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const getHarvestsForBatch = (harvestIds: string[]): Harvest[] => {
    return harvests.filter((h: Harvest) => harvestIds.includes(h.id));
  };

  const getFarmerName = (farmerId: string): string => {
    const farmer = farmers.find((f: Farmer) => f.id === farmerId);
    return farmer ? farmer.name : 'Unknown Farmer';
  };

  const handleCreateBatch = async () => {
    if (!currentCooperative || selectedHarvests.length === 0 || !batchGrade) return;

    try {
      setCreating(true);
      const selectedHarvestData = harvests.filter(h => selectedHarvests.includes(h.id));
      const totalWeight = selectedHarvestData.reduce((sum, h) => sum + h.weight, 0);
      const batchNumber = `BATCH-${new Date().getFullYear()}-${String(batches.length + 1).padStart(3, '0')}`;

      await createBatch({
        batchNumber,
        harvestIds: selectedHarvests,
        totalWeight,
        grade: batchGrade,
        status: 'CREATED',
        tenantId: currentCooperative.id,
      });

      setShowCreateModal(false);
      setSelectedHarvests([]);
      setBatchGrade('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create batch';
      setError(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  const availableHarvests = harvests.filter((h: Harvest) => (h.status === 'APPROVED' || h.status === 'PROCESSED') && !batches.some((b: Batch) => b.harvestIds.includes(h.id)));

  const filteredBatches = batches.filter((batch: Batch) =>
    batch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.totalWeight.toString().includes(searchTerm)
  );

  const paginatedBatches = filteredBatches.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  if (isLoading && batches.length === 0) {
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
        <h1 className="text-2xl font-semibold">Batches</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Batch
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent>
          <Input
            placeholder="Search batches by batch number or weight..."
            value={searchTerm}
            onChange={handleSearch}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </CardContent>
      </Card>

      {paginatedBatches.length > 0 ? (
        paginatedBatches.map((batch: Batch) => {
          const batchHarvests = getHarvestsForBatch(batch.harvestIds);
          const uniqueFarmers = [...new Set(batchHarvests.map((h: Harvest) => h.farmerId))];
          const isExpanded = expandedBatch === batch.id;

          return (
            <Card key={batch.id} className="mb-4">
              <CardContent>
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedBatch(isExpanded ? null : batch.id)}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold">{batch.batchNumber}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge>{batch.totalWeight.toLocaleString()} kg</Badge>
                        <Badge variant={batch.grade === 'A' ? 'success' : batch.grade === 'B' ? 'warning' : 'error'}>
                          Grade {batch.grade}
                        </Badge>
                        <Badge variant={batch.status === 'COMPLETED' ? 'success' : batch.status === 'PROCESSING' ? 'warning' : 'info'}>
                          {batch.status}
                        </Badge>
                        <Badge variant="gray">{batchHarvests.length} harvests</Badge>
                      </div>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Batch Information</h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-600">Created Date</p>
                            <p className="text-sm">{new Date(batch.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total Weight</p>
                            <p className="text-sm font-semibold">{batch.totalWeight.toLocaleString()} kg</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Farmers</p>
                            <p className="text-sm">{uniqueFarmers.length} farmer(s)</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Harvest Details</h4>
                        {batchHarvests.length > 0 ? (
                          <div className="space-y-2">
                            {batchHarvests.map((harvest) => (
                              <div key={harvest.id} className="p-3 bg-gray-50 rounded">
                                <div className="flex justify-between items-center mb-2">
                                  <p className="text-sm font-semibold">{getFarmerName(harvest.farmerId)}</p>
                                  <p className="text-sm">{harvest.weight.toLocaleString()} kg</p>
                                </div>
                                <div className="flex gap-2">
                                  <Badge variant="gray">{harvest.crop}</Badge>
                                  <Badge variant={harvest.grade === 'A' ? 'success' : harvest.grade === 'B' ? 'warning' : 'error'}>
                                    Grade {harvest.grade}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No harvests found for this batch.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {searchTerm ? 'No batches found matching your search.' : 'No batches created yet.'}
              </h3>
              <p className="text-sm text-gray-600">
                Batches are created when harvests are grouped together for processing.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredBatches.length > rowsPerPage && (
        <div className="flex justify-center mt-6">
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
              Page {page} of {Math.ceil(filteredBatches.length / rowsPerPage)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === Math.ceil(filteredBatches.length / rowsPerPage)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <ModalHeader>Create New Batch</ModalHeader>
        <ModalContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Harvests ({selectedHarvests.length} selected)
              </label>
              <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
                {availableHarvests.length > 0 ? (
                  availableHarvests.map((harvest) => (
                    <div key={harvest.id} className="flex items-center p-3 border-b border-gray-200 last:border-b-0">
                      <Checkbox
                        checked={selectedHarvests.includes(harvest.id)}
                        onChange={(checked) => {
                          if (checked) {
                            setSelectedHarvests([...selectedHarvests, harvest.id]);
                          } else {
                            setSelectedHarvests(selectedHarvests.filter(id => id !== harvest.id));
                          }
                        }}
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium">{getFarmerName(harvest.farmerId)}</p>
                          <p className="text-sm font-semibold">{harvest.weight} kg</p>
                        </div>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="gray">{harvest.crop}</Badge>
                          <Badge variant={harvest.grade === 'A' ? 'success' : harvest.grade === 'B' ? 'warning' : 'error'}>
                            Grade {harvest.grade}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No available harvests for batching. Harvests must be processed first.
                  </div>
                )}
              </div>
            </div>

            <div>
              <Select
                value={batchGrade}
                onChange={(value) => setBatchGrade(value as Grade)}
                options={[
                  { value: 'A', label: 'Grade A' },
                  { value: 'B', label: 'Grade B' },
                  { value: 'C', label: 'Grade C' },
                ]}
                placeholder="Select Batch Grade"
              />
            </div>

            {selectedHarvests.length > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Total Weight:</strong> {harvests.filter(h => selectedHarvests.includes(h.id)).reduce((sum, h) => sum + h.weight, 0)} kg
                </p>
              </div>
            )}
          </div>
        </ModalContent>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button
            onClick={handleCreateBatch}
            disabled={selectedHarvests.length === 0 || !batchGrade || creating}
          >
            {creating ? 'Creating...' : 'Create Batch'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default BatchList;
