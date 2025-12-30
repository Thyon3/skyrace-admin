import React, { useState } from 'react';
import { X, MapPin, Globe, Navigation, Code } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import toast from 'react-hot-toast';

interface CreateAirportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateAirportModal: React.FC<CreateAirportModalProps> = ({ isOpen, onClose }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        iataCode: '',
        icaoCode: '',
        country: '',
        status: 'ACTIVE'
    });

    const mutation = useMutation({
        mutationFn: (newAirport: any) => api.post('/admin/airports', newAirport),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-airports'] });
            toast.success('Airport created successfully!');
            onClose();
            setFormData({ name: '', city: '', iataCode: '', icaoCode: '', country: '', status: 'ACTIVE' });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to create airport');
        }
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-8 py-6 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-secondary">Add New Airport</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Airport Name</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            placeholder="e.g. Dubai International Airport"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">City</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="input-field pl-10"
                                    placeholder="Dubai"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Country</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="input-field pl-10"
                                    placeholder="UAE"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">IATA Code</label>
                            <div className="relative">
                                <Code className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    maxLength={3}
                                    className="input-field pl-10 uppercase"
                                    placeholder="DXB"
                                    value={formData.iataCode}
                                    onChange={(e) => setFormData({ ...formData, iataCode: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">ICAO Code</label>
                            <input
                                type="text"
                                maxLength={4}
                                className="input-field uppercase"
                                placeholder="OMDB"
                                value={formData.icaoCode}
                                onChange={(e) => setFormData({ ...formData, icaoCode: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="flex-2 btn-primary h-12 flex items-center justify-center gap-2"
                        >
                            {mutation.isPending ? 'Creating...' : 'Create Airport'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAirportModal;
