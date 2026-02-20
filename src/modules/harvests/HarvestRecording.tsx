import React, { useState } from 'react';
import { useCooperativeStore } from '../../store/cooperativeStore';
import { Card, CardContent, Button } from '../../components';
import { Package, Plus, Upload } from 'lucide-react';

const HarvestRecording: React.FC = () => {
  const { currentCooperative, farmers, harvests, fetchFarmers, fetchHarvests, recordHarvest, isLoading } = useCooperativeStore();
  const [showForm, setShowForm] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    farmerId: '',
    crop: 'MAIZE' as any,
    weight: 0,
    grade: 'A' as any,
    harvestDate: new Date().toISOString().split('T')[0],
    attachmentUrl: '',
  });

  React.useEffect(() => {
    fetchFarmers();
    fetchHarvests();
  }, [fetchFarmers, fetchHarvests]);

  const cropTypes = ['MAIZE', 'WHEAT', 'RICE', 'SOYBEANS', 'COTTON'];
  const grades = ['A', 'B', 'C'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    setError('');

    try {
      await recordHarvest({
        farmerId: formData.farmerId,
        crop: formData.crop,
        weight: formData.weight,
        grade: formData.grade,
        harvestDate: formData.harvestDate,
        status: 'RECORDED',
        submittedBy: 'current-user-id', // In a real app, this would be the actual user ID
        tenantId: currentCooperative?.id || '',
      });

      // Reset form
      setFormData({
        farmerId: '',
        crop: 'MAIZE' as any,
        weight: 0,
        grade: 'A' as any,
        harvestDate: new Date().toISOString().split('T')[0],
        attachmentUrl: '',
      });
      setShowForm(false);
      alert('Harvest recorded successfully!');
    } catch (err) {
      setError('Failed to record harvest. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'weight' ? parseFloat(value) || 0 : value
    }));
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Harvest Recording</h1>
          <p className="text-slate-600">Record harvests for {currentCooperative.name}</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          startIcon={<Plus className="h-4 w-4" />}
        >
          Record Harvest
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Recording Form */}
      {showForm && (
        <Card className="mb-8">
          <CardContent>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Record New Harvest</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Farmer *
                  </label>
                  <select
                    name="farmerId"
                    required
                    value={formData.farmerId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select farmer</option>
                    {farmers.map(farmer => (
                      <option key={farmer.id} value={farmer.id}>
                        {farmer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Crop Type *
                  </label>
                  <select
                    name="crop"
                    required
                    value={formData.crop}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {cropTypes.map(crop => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    required
                    min="0"
                    step="0.1"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter weight in kg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Grade *
                  </label>
                  <select
                    name="grade"
                    required
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {grades.map(grade => (
                      <option key={grade} value={grade}>
                        Grade {grade}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Harvest Date *
                </label>
                <input
                  type="date"
                  name="harvestDate"
                  required
                  value={formData.harvestDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Attachment
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    id="attachment"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => document.getElementById('attachment')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Attachment
                  </Button>
                  {formData.attachmentUrl && (
                    <span className="text-sm text-slate-600">File uploaded</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={localLoading || isLoading}>
                  <Package className="h-4 w-4 mr-2" />
                  {localLoading ? 'Recording...' : 'Record Harvest'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Harvests List */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Recent Harvests</h2>
          {isLoading ? (
            <div className="text-center py-8">Loading harvests...</div>
          ) : harvests.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p>No harvests recorded yet.</p>
              <p className="text-sm">Click "Record Harvest" to add new harvests.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Farmer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Crop</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Weight</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {harvests.map((harvest) => (
                    <tr key={harvest.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {farmers.find(f => f.id === harvest.farmerId)?.name || harvest.farmerId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{harvest.crop}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{harvest.weight} kg</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{harvest.grade}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${harvest.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            harvest.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                          }`}>
                          {harvest.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HarvestRecording;
