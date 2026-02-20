import React from 'react';
import { useCooperative } from '../context/CooperativeContext';
import { AlertTriangle, Loader } from 'lucide-react';

interface CooperativeGuardProps {
  children: React.ReactNode;
  requireActive?: boolean;
}

const CooperativeGuard: React.FC<CooperativeGuardProps> = ({
  children,
  requireActive = true
}) => {
  const { cooperative, isActive, loading, error } = useCooperative();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-gray-600">Loading cooperative information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Cooperative</h3>
          <p className="text-gray-600 max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  if (requireActive && !isActive) {
    const statusMessages: Record<string, string> = {
      DRAFT: 'Your cooperative registration is still in draft. Please contact the system administrator to complete the registration process.',
      PENDING_APPROVAL: 'Your cooperative is pending approval from the system administrator. Please check back later.',
      APPROVED: 'Your cooperative has been approved but not yet activated. Please contact the system administrator for activation.',
      SUSPENDED: `Your cooperative has been suspended. Reason: ${cooperative?.suspensionReason || 'Contact administrator for details.'}`,
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertTriangle className="w-12 h-12 text-yellow-500" />
        <div className="text-center max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cooperative Not Active</h3>
          <p className="text-gray-600">
            {cooperative ? statusMessages[cooperative.status] : 'Unable to determine cooperative status.'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default CooperativeGuard;