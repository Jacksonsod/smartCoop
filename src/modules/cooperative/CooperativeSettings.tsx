import React from 'react';
import { useCooperativeStore } from '../../store/cooperativeStore';
import { Card, CardContent, Button, Input } from '../../components';
import { Building, Mail, Phone, MapPin, Save } from 'lucide-react';

const CooperativeSettings: React.FC = () => {
    const { currentCooperative } = useCooperativeStore();

    if (!currentCooperative) return null;

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Cooperative Settings</h1>
                <p className="text-slate-600">Manage your cooperative profile and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardContent>
                            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
                                <Building className="h-5 w-5 mr-2 text-green-600" />
                                Profile Information
                            </h2>

                            <form className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Cooperative Name</label>
                                        <Input defaultValue={currentCooperative.name} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Registration Number</label>
                                        <Input defaultValue={currentCooperative.registrationNumber} disabled className="bg-slate-50" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input defaultValue={currentCooperative.email} type="email" className="pl-10" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input defaultValue={currentCooperative.phone} className="pl-10" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Location / Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input defaultValue={currentCooperative.address} className="pl-10" />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <Button>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Status Card */}
                <div>
                    <Card>
                        <CardContent>
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Account Status</h2>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center">
                                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                    <span className="text-green-700 font-medium">Active</span>
                                </div>
                                <p className="text-xs text-green-600 mt-1">Your cooperative account is fully active.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <span className="text-sm text-slate-500 block">Member Since</span>
                                    <span className="text-sm font-medium text-slate-900">
                                        {new Date(currentCooperative.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm text-slate-500 block">Last Updated</span>
                                    <span className="text-sm font-medium text-slate-900">
                                        {new Date(currentCooperative.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CooperativeSettings;
