import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button } from './index';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import {
  Database,
  Trash2,
  Download,
  RefreshCw,
} from 'lucide-react';

const DataManager: React.FC = () => {
  const { user } = useAuth();
  const [storageSize, setStorageSize] = useState<string>('0 KB');
  const [farmerCount, setFarmerCount] = useState<number>(0);

  useEffect(() => {
    const updateStorageInfo = () => {
      setStorageSize(StorageService.getStorageSize());
      setFarmerCount(StorageService.getFarmers().length);
    };

    updateStorageInfo();
    
    // Update storage info every 2 seconds
    const interval = setInterval(updateStorageInfo, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleExportData = () => {
    const data = {
      farmers: StorageService.getFarmers(),
      harvests: StorageService.getHarvests(),
      batches: StorageService.getBatches(),
      payments: StorageService.getPayments(),
      exportDate: new Date().toISOString(),
      tenantId: user?.tenantId,
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `smartcoop-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all local data? This action cannot be undone.')) {
      StorageService.clearAllData();
      setStorageSize('0 KB');
      setFarmerCount(0);
      window.location.reload();
    }
  };

  const handleRefreshData = () => {
    window.location.reload();
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefreshData}
            startIcon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="text-sm text-slate-600 mb-1">Storage Used</div>
            <div className="text-xl font-semibold text-slate-900">{storageSize}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 mb-1">Total Farmers</div>
            <div className="text-xl font-semibold text-green-900">{farmerCount}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 mb-1">Current Tenant</div>
            <div className="text-xl font-semibold text-blue-900 truncate">
              {user?.tenantId || 'Unknown'}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleExportData}
            startIcon={<Download className="h-4 w-4" />}
            variant="secondary"
          >
            Export Data
          </Button>
          <Button
            onClick={handleClearData}
            startIcon={<Trash2 className="h-4 w-4" />}
            variant="danger"
          >
            Clear All Data
          </Button>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Data Persistence Info</h3>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• All data is stored locally in your browser</li>
            <li>• Data persists between browser sessions</li>
            <li>• Export your data regularly for backup</li>
            <li>• Clear data to start fresh or troubleshoot issues</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataManager;
