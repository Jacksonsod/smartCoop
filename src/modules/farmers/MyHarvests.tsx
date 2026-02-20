import React, { useMemo } from 'react';
import { useCooperativeStore } from '../../store/cooperativeStore';
import { Card, CardContent, Button } from '../../components';
import { Harvest } from '../../types';
import { Sprout, Eye, Calendar, Scale, Tag } from 'lucide-react';

const MyHarvests: React.FC = () => {
    const { currentUser } = useCooperativeStore();

    const harvests = useMemo(() => {
        if (!currentUser?.farmerId) return [];

        const allHarvests = JSON.parse(localStorage.getItem('harvests') || '[]') as Harvest[];
        return allHarvests
            .filter(h => h.farmerId === currentUser.farmerId)
            .sort((a, b) => new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime());
    }, [currentUser]);

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { color: string; text: string; bg: string }> = {
            PENDING_VERIFICATION: { color: 'text-yellow-800', bg: 'bg-yellow-100', text: 'Pending Verification' },
            APPROVED: { color: 'text-green-800', bg: 'bg-green-100', text: 'Approved' },
            REJECTED: { color: 'text-red-800', bg: 'bg-red-100', text: 'Rejected' },
            PROCESSED: { color: 'text-blue-800', bg: 'bg-blue-100', text: 'Processed' },
            BATCHED: { color: 'text-purple-800', bg: 'bg-purple-100', text: 'Batched' },
            RECORDED: { color: 'text-slate-800', bg: 'bg-slate-100', text: 'Recorded' },
        };
        return variants[status] || { color: 'text-gray-800', bg: 'bg-gray-100', text: status };
    };

    if (!currentUser?.farmerId) {
        return <div className="p-6">No farmer profile found.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Deliveries</h1>
                    <p className="text-slate-600">Tracking {harvests.length} total deliveries</p>
                </div>
            </div>

            <div className="grid gap-4">
                {harvests.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Sprout className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">No deliveries yet</h3>
                            <p className="text-slate-500">Your harvest deliveries will appear here once recorded.</p>
                        </CardContent>
                    </Card>
                ) : (
                    harvests.map((harvest) => {
                        const badge = getStatusBadge(harvest.status);

                        return (
                            <Card key={harvest.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-slate-900">{harvest.crop}</h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.color}`}>
                                                    {badge.text}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <Scale className="h-4 w-4 text-slate-400" />
                                                    <span>Weight: <span className="font-medium text-slate-900">{harvest.weight} kg</span></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Tag className="h-4 w-4 text-slate-400" />
                                                    <span>Grade: <span className="font-medium text-slate-900">{harvest.grade}</span></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-slate-400" />
                                                    <span>Date: <span className="font-medium text-slate-900">{new Date(harvest.harvestDate).toLocaleDateString()}</span></span>
                                                </div>
                                                <div>
                                                    <span>ID: <span className="font-mono text-xs">{harvest.id}</span></span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button variant="secondary" size="sm">
                                                <Eye className="h-4 w-4 mr-2" />
                                                Details
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default MyHarvests;
