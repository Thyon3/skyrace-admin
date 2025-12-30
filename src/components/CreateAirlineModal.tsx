import React, { useState } from 'react';
import { X, Globe, Image as ImageIcon, Code } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import toast from 'react-hot-toast';

interface CreateAirlineModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateAirlineModal: React.FC<CreateAirlineModalProps> = ({ isOpen, onClose }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: '',
        iataCode: '',
        icaoCode: '',
        country: '',
        logo: '',
        status: 'ACTIVE'
    });

    const mutation = useMutation({
        mutationFn: (newAirline: any) => api.post('/admin/airlines', newAirline),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-airlines'] });
            toast.success('Airline created successfully!');
            onClose();
            setFormData({ name: '', iataCode: '', icaoCode: '', country: '', logo: '', status: 'ACTIVE' });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to create airline');
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
                    <h2 className="text-xl font-bold text-secondary">Add New Airline</h2>
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
                            placeholder="e.g. Emirates"
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
                                    placeholder="EK"
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
                                placeholder="UAE"
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
                                placeholder="e.g. United Arab Emirates"
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
                                placeholder="https://..."
                                value={formData.logo}
                                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
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
                            {mutation.isPending ? 'Creating...' : 'Create Airline'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAirlineModal;
