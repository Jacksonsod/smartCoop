import React, { useState, useEffect } from 'react';
import { useCooperativeStore } from '../../store/cooperativeStore';
import { Card, CardContent, Button, Input } from '../../components';
import { Plus, DollarSign, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { Price } from '../../types';

const PriceConfig: React.FC = () => {
    const { currentCooperative, prices, fetchPrices, updatePrices, isLoading } = useCooperativeStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        cropType: 'MAIZE',
        gradeA: '',
        gradeB: '',
        gradeC: '',
    });

    useEffect(() => {
        fetchPrices();
    }, [fetchPrices]);

    const cropTypes = ['MAIZE', 'WHEAT', 'RICE', 'SOYBEANS', 'COTTON'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCooperative) return;

        try {
            const newPrice: Price = {
                id: `price-${Date.now()}`,
                tenantId: currentCooperative.id,
                cropType: formData.cropType,
                pricePerKg: {
                    A: Number(formData.gradeA),
                    B: Number(formData.gradeB),
                    C: Number(formData.gradeC),
                },
                currency: 'USD',
                status: 'ACTIVE',
                effectiveDate: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const updatedPrices = [newPrice, ...prices];
            await updatePrices(updatedPrices);

            setIsModalOpen(false);
            setFormData({ cropType: 'MAIZE', gradeA: '', gradeB: '', gradeC: '' });
        } catch (error) {
            console.error('Failed to create price:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Price Configuration</h1>
                    <p className="text-slate-600">Manage daily crop prices for {currentCooperative?.name}</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Set New Price
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prices.map((price) => (
                        <Card key={price.id} className="hover:shadow-lg transition-shadow">
                            <CardContent>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{price.cropType}</h3>
                                        <div className="flex items-center text-sm text-slate-500 mt-1">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {new Date(price.effectiveDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className={`p-2 rounded-full ${price.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                        <TrendingUp className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                                        <span className="text-sm font-medium text-slate-700">Grade A</span>
                                        <span className="text-sm font-bold text-green-700">{price.pricePerKg.A} {price.currency}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                                        <span className="text-sm font-medium text-slate-700">Grade B</span>
                                        <span className="text-sm font-bold text-green-600">{price.pricePerKg.B} {price.currency}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                                        <span className="text-sm font-medium text-slate-700">Grade C</span>
                                        <span className="text-sm font-bold text-green-500">{price.pricePerKg.C} {price.currency}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {prices.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                            <DollarSign className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-slate-900">No Prices Configured</h3>
                            <p className="text-slate-500">Set up your first crop price to get started.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Add Price Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-lg font-bold mb-4">Set New Price</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Crop Type</label>
                                <select
                                    className="w-full rounded-md border border-slate-300 p-2"
                                    value={formData.cropType}
                                    onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                                >
                                    {cropTypes.map(crop => (
                                        <option key={crop} value={crop}>{crop}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Grade A</label>
                                    <Input
                                        type="number"
                                        required
                                        placeholder="0"
                                        value={formData.gradeA}
                                        onChange={(e) => setFormData({ ...formData, gradeA: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Grade B</label>
                                    <Input
                                        type="number"
                                        required
                                        placeholder="0"
                                        value={formData.gradeB}
                                        onChange={(e) => setFormData({ ...formData, gradeB: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Grade C</label>
                                    <Input
                                        type="number"
                                        required
                                        placeholder="0"
                                        value={formData.gradeC}
                                        onChange={(e) => setFormData({ ...formData, gradeC: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Save Price</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PriceConfig;
