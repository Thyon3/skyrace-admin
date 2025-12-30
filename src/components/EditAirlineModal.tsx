import React, { useState, useEffect } from 'react';
import { X, Globe, Image as ImageIcon, Code } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import toast from 'react-hot-toast';

interface EditAirlineModalProps {
    isOpen: boolean;
    onClose: () => void;
    airline: any;
}

const EditAirlineModal: React.FC<EditAirlineModalProps> = ({ isOpen, onClose, airline }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: '',
        iataCode: '',
        icaoCode: '',
        country: '',
        logo: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        if (airline) {
            setFormData({
                name: airline.name,
                iataCode: airline.iataCode,
                icaoCode: airline.icaoCode || '',
                country: airline.country,
                logo: airline.logo || '',
                status: airline.status
            });
        }
    }, [airline]);

    const mutation = useMutation({
        mutationFn: (updatedAirline: any) => api.put(`/admin/airlines/${airline._id}`, updatedAirline),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-airlines'] });
            toast.success('Airline updated successfully!');
            onClose();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to update airline');
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
                    <h2 className="text-xl font-bold text-secondary">Edit Airline</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Airline Name</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">IATA Code</label>
                            <div className="relative">
                                <Code className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    maxLength={2}
                                    className="input-field pl-10 uppercase"
                                    value={formData.iataCode}
                                    onChange={(e) => setFormData({ ...formData, iataCode: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">ICAO Code</label>
                            <input
                                type="text"
                                maxLength={3}
                                className="input-field uppercase"
                                value={formData.icaoCode}
                                onChange={(e) => setFormData({ ...formData, icaoCode: e.target.value })}
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
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Logo URL</label>
                        <div className="relative">
                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="url"
                                className="input-field pl-10"
                                value={formData.logo}
                                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <select
                            className="input-field"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
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
                            {mutation.isPending ? 'Updating...' : 'Update Airline'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAirlineModal;
