import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Plus,
    Search,
    Globe,
    Edit2,
    Trash2,
    CheckCircle,
    XCircle,
    Image as ImageIcon
} from 'lucide-react';
import api from '../api/client';
import toast from 'react-hot-toast';
import CreateAirlineModal from '../components/CreateAirlineModal';
import EditAirlineModal from '../components/EditAirlineModal';


const Airlines: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['admin-airlines'],
        queryFn: async () => {
            const res = await api.get('/admin/airlines');
            return res.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/admin/airlines/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-airlines'] });
            toast.success('Airline deleted successfully');
        }
    });

    const airlines = data?.airlines || [];
    const filteredAirlines = airlines.filter((a: any) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAirline, setSelectedAirline] = useState<any>(null);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Airlines Management</h1>
                    <p className="text-gray-500">Manage partner airlines and their operational status.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Airline
                </button>
            </div>

            <div className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-soft">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or IATA code..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full text-center py-10">Loading airlines...</div>
                ) : filteredAirlines.length === 0 ? (
                    <div className="col-span-full text-center py-10">No airlines found.</div>
                ) : filteredAirlines.map((airline: any) => (
                    <div key={airline._id} className="card hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border">
                                {airline.logo ? (
                                    <img src={airline.logo} alt={airline.name} className="w-full h-full object-contain p-2" />
                                ) : (
                                    <ImageIcon className="text-gray-300" size={24} />
                                )}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${airline.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                }`}>
                                {airline.status}
                            </span>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-secondary">{airline.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Globe size={14} />
                                {airline.country} • <span className="font-mono font-bold text-primary">{airline.iataCode}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t">
                            <button
                                onClick={() => {
                                    setSelectedAirline(airline);
                                    setIsEditModalOpen(true);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-colors text-sm font-bold"
                            >
                                <Edit2 size={16} />
                                Edit
                            </button>
                            <button
                                onClick={() => {
                                    if (window.confirm('Delete this airline?')) {
                                        deleteMutation.mutate(airline._id);
                                    }
                                }}
                                className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <CreateAirlineModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {selectedAirline && (
                <EditAirlineModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedAirline(null);
                    }}
                    airline={selectedAirline}
                />
            )}
        </div>
    );
};

export default Airlines;
