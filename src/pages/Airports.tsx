import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Plus,
    Search,
    MapPin,
    Edit2,
    Trash2,
    Navigation,
    Globe
} from 'lucide-react';
import api from '../api/client';
import toast from 'react-hot-toast';

const Airports: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['admin-airports'],
        queryFn: async () => {
            const res = await api.get('/admin/airports');
            return res.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/admin/airports/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-airports'] });
            toast.success('Airport deleted successfully');
        }
    });

    const airports = data?.airports || [];
    const filteredAirports = airports.filter((a: any) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.iataCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAirport, setSelectedAirport] = useState<any>(null);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Airports & Hubs</h1>
                    <p className="text-gray-500">Manage global airport locations and destination data.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Airport
                </button>
            </div>

            <div className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-soft">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, city or IATA code..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr className="text-left text-gray-400 text-sm">
                                <th className="px-6 py-4 font-medium">Airport Name</th>
                                <th className="px-6 py-4 font-medium">Location</th>
                                <th className="px-6 py-4 font-medium">IATA Code</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center py-10">Loading airports...</td></tr>
                            ) : filteredAirports.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-10">No airports found.</td></tr>
                            ) : filteredAirports.map((airport: any) => (
                                <tr key={airport._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                                <Navigation size={18} />
                                            </div>
                                            <div className="font-bold text-secondary">{airport.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <MapPin size={14} className="text-gray-400" />
                                            {airport.city}, {airport.country}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-bold text-primary bg-primary/5 px-2 py-1 rounded">
                                            {airport.iataCode}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${airport.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                            {airport.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedAirport(airport);
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="p-2 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Delete this airport?')) {
                                                        deleteMutation.mutate(airport._id);
                                                    }
                                                }}
                                                className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateAirportModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {selectedAirport && (
                <EditAirportModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedAirport(null);
                    }}
                    airport={selectedAirport}
                />
            )}
        </div>
    );
};

export default Airports;
