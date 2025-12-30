import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Plane,
    Clock,
    MapPin,
    Calendar
} from 'lucide-react';
import api from '../api/client';
import toast from 'react-hot-toast';
import CreateFlightModal from '../components/CreateFlightModal';
import EditFlightModal from '../components/EditFlightModal';

const FlightManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState<any>(null);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['admin-flights', searchTerm],
        queryFn: async () => {
            const res = await api.get('/admin/flights', { params: { search: searchTerm } });
            return res.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/admin/flights/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-flights'] });
            toast.success('Flight deleted successfully');
        }
    });

    const flights = data?.flights || [];

    const handleEdit = (flight: any) => {
        setSelectedFlight(flight);
        setIsEditModalOpen(true);
    };

    const parseLocation = (location: string) => {
        if (!location) return { city: 'Unknown', code: '---' };
        if (location.includes('(') && location.includes(')')) {
            const parts = location.split('(');
            return {
                city: parts[0].trim(),
                code: parts[1].replace(')', '').trim()
            };
        }
        return { city: location, code: '---' };
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Flight Management</h1>
                    <p className="text-gray-500">Create, update, and manage flight schedules and availability.</p>
                </div>
                <button
                    className="btn-primary flex items-center gap-2"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={18} />
                    <span>Add New Flight</span>
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-soft">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by airline, flight number, or city..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Flights Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {isLoading ? (
                    <div className="col-span-full text-center py-20">Loading flights...</div>
                ) : flights.length === 0 ? (
                    <div className="col-span-full text-center py-20">No flights found.</div>
                ) : flights.map((flight: any) => {
                    const origin = parseLocation(flight.origin);
                    const destination = parseLocation(flight.destination);

                    return (
                        <div key={flight._id} className="card hover:shadow-medium transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <Plane size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-secondary text-lg">{flight.airline}</h3>
                                        <p className="text-sm text-primary font-mono">{flight.flightNumber}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"
                                        onClick={() => handleEdit(flight)}
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this flight?')) {
                                                deleteMutation.mutate(flight._id);
                                            }
                                        }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <div className="text-center flex-1">
                                    <div className="text-2xl font-bold text-secondary">{origin.code}</div>
                                    <div className="text-xs text-gray-400">{origin.city}</div>
                                </div>
                                <div className="flex flex-col items-center px-4 flex-1">
                                    <div className="text-[10px] text-gray-400 font-medium uppercase mb-1">{Math.floor(flight.duration / 60)}h {flight.duration % 60}m</div>
                                    <div className="w-full h-px bg-gray-200 relative">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                                            <Plane size={14} className="text-primary rotate-90" />
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-green-600 font-bold mt-1">DIRECT</div>
                                </div>
                                <div className="text-center flex-1">
                                    <div className="text-2xl font-bold text-secondary">{destination.code}</div>
                                    <div className="text-xs text-gray-400">{destination.city}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Calendar size={16} />
                                    <span className="text-xs">{new Date(flight.departureTime).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Clock size={16} />
                                    <span className="text-xs">{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-bold text-primary">${flight.price}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <CreateFlightModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <EditFlightModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedFlight(null);
                }}
                flight={selectedFlight}
            />
        </div>
    );
};

export default FlightManagement;
