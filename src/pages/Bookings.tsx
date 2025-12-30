import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Search,
    Filter,
    Download,
    XCircle,
    CheckCircle,
    RefreshCcw,
    ExternalLink
} from 'lucide-react';
import api from '../api/client';
import toast from 'react-hot-toast';

const BookingManagement: React.FC = () => {
    const [statusFilter, setStatusFilter] = useState('');
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['admin-bookings', statusFilter],
        queryFn: async () => {
            const res = await api.get(`/admin/bookings${statusFilter ? `?status=${statusFilter}` : ''}`);
            return res.data;
        }
    });

    const cancelMutation = useMutation({
        mutationFn: (id: string) => api.patch(`/admin/bookings/${id}/cancel`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
            toast.success('Booking cancelled successfully');
        }
    });

    const bookings = data?.bookings || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Booking Management</h1>
                    <p className="text-gray-500">View and manage all flight bookings across the platform.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Download size={18} />
                    <span>Export CSV</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-soft">
                <div className="flex-1 flex gap-2">
                    {['', 'confirmed', 'pending', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === status
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {status === '' ? 'All Bookings' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search booking ID..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                </div>
            </div>

            {/* Bookings List */}
            <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr className="text-left text-gray-400 text-sm">
                                <th className="px-6 py-4 font-medium">Booking ID</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Flight Details</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {isLoading ? (
                                <tr><td colSpan={6} className="text-center py-10">Loading bookings...</td></tr>
                            ) : bookings.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-10">No bookings found.</td></tr>
                            ) : bookings.map((booking: any) => (
                                <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-mono text-xs font-bold text-primary">#{booking._id.slice(-8).toUpperCase()}</div>
                                        <div className="text-[10px] text-gray-400">{new Date(booking.createdAt).toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-secondary">{booking.user?.name}</div>
                                        <div className="text-xs text-gray-400">{booking.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="font-bold text-secondary">{booking.flight?.airline}</div>
                                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">{booking.flight?.flightNumber}</span>
                                        </div>
                                        <div className="text-xs text-gray-400">{booking.flight?.origin} → {booking.flight?.destination}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-secondary">${booking.totalPrice}</div>
                                        <div className="text-[10px] text-green-600 font-bold uppercase">{booking.paymentStatus}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${booking.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                                    'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            {booking.status === 'confirmed' ? <CheckCircle size={10} /> : <RefreshCcw size={10} />}
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {booking.status !== 'cancelled' && (
                                                <button
                                                    className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                                    title="Cancel Booking"
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to cancel this booking?')) {
                                                            cancelMutation.mutate(booking._id);
                                                        }
                                                    }}
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            )}
                                            <button className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors" title="View Details">
                                                <ExternalLink size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BookingManagement;
