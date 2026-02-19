import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TextField,
    InputAdornment,
    CircularProgress,
    Alert,
    MenuItem,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import {
    Add as AddIcon,
    AttachMoney as AttachMoneyIcon,
    History as HistoryIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { pricesApi } from '../../services/mockApi';
import { Price, CropType } from '../../types';

const PriceConfig: React.FC = () => {
    const { user } = useAuth();
    const [prices, setPrices] = useState<Price[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form State
    const [selectedCrop, setSelectedCrop] = useState<CropType | ''>('');
    const [pricePerKg, setPricePerKg] = useState<string>('');
    const [effectiveDate, setEffectiveDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );

    const cropTypes: CropType[] = ['MAIZE', 'WHEAT', 'RICE', 'SOYBEANS', 'COTTON'];

    const fetchPrices = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const response = await pricesApi.getPrices(user.tenantId);
            setPrices(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch prices');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrices();
    }, [user]);

    const handleSavePrice = async () => {
        if (!user || !selectedCrop || !pricePerKg) return;

        try {
            setSaving(true);
            await pricesApi.createPrice({
                crop: selectedCrop,
                pricePerKg: parseFloat(pricePerKg),
                effectiveDate: new Date(effectiveDate).toISOString(),
                tenantId: user.tenantId,
            });

            await fetchPrices();
            setOpenDialog(false);
            resetForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save price');
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setSelectedCrop('');
        setPricePerKg('');
        setEffectiveDate(new Date().toISOString().split('T')[0]);
    };

    const getLatestPrices = () => {
        const latest: Record<string, Price> = {};
        prices.forEach(p => {
            if (!latest[p.crop] || new Date(p.effectiveDate) > new Date(latest[p.crop].effectiveDate)) {
                latest[p.crop] = p;
            }
        });
        return Object.values(latest);
    };

    if (loading && prices.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight={600}>
                    Daily Crop Prices
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                >
                    Set New Price
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {getLatestPrices().map((price) => (
                    <Grid item xs={12} sm={6} md={2.4} key={price.crop}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    {price.crop}
                                </Typography>
                                <Typography variant="h5" fontWeight={600}>
                                    ${price.pricePerKg.toFixed(2)} / kg
                                </Typography>
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                    Effective: {new Date(price.effectiveDate).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <HistoryIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="h6">Price History</Typography>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date Set</TableCell>
                                    <TableCell>Effective Date</TableCell>
                                    <TableCell>Crop</TableCell>
                                    <TableCell>Price / Kg</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {prices.map((price) => (
                                    <TableRow key={price.id}>
                                        <TableCell>{new Date(price.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(price.effectiveDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{price.crop}</TableCell>
                                        <TableCell>
                                            <Typography fontWeight={600}>
                                                ${price.pricePerKg.toFixed(2)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {prices.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            No price history available.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Set Daily Price</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Crop Type</InputLabel>
                            <Select
                                value={selectedCrop}
                                label="Crop Type"
                                onChange={(e) => setSelectedCrop(e.target.value as CropType)}
                            >
                                {cropTypes.map((crop) => (
                                    <MenuItem key={crop} value={crop}>{crop}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Price per Kg"
                            type="number"
                            value={pricePerKg}
                            onChange={(e) => setPricePerKg(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            fullWidth
                        />

                        <TextField
                            label="Effective Date"
                            type="date"
                            value={effectiveDate}
                            onChange={(e) => setEffectiveDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleSavePrice}
                        variant="contained"
                        disabled={!selectedCrop || !pricePerKg || saving}
                    >
                        {saving ? 'Saving...' : 'Save Price'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PriceConfig;
