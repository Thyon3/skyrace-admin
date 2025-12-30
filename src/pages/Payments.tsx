import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Search,
    Filter,
    Download,
    CreditCard,
    CheckCircle,
    XCircle,
    RefreshCcw,
    MoreVertical,
    ExternalLink
} from 'lucide-react';
import api from '../api/client';
import toast from 'react-hot-toast';

const Payments: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['admin-payments', statusFilter, searchTerm],
        queryFn: async () => {
            const params: any = {};
            if (statusFilter !== 'ALL') params.status = statusFilter;
            if (searchTerm) params.search = searchTerm;
            const res = await api.get('/admin/payments', { params });
            return res.data;
        }
    });

    const refundMutation = useMutation({
        mutationFn: (id: string) => api.post(`/admin/payments/${id}/refund`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
            toast.success('Refund processed successfully');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Refund failed');
        }
    });

    const payments = data?.payments || [];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-600';
            case 'PENDING': return 'bg-yellow-100 text-yellow-600';
            case 'FAILED': return 'bg-red-100 text-red-600';
            case 'REFUNDED': return 'bg-purple-100 text-purple-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Payments & Transactions</h1>
                    <p className="text-gray-500">Monitor all financial transactions and manage refunds.</p>
                </div>
                <button className="btn-secondary flex items-center gap-2">
                    <Download size={18} />
                    Export CSV
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card bg-primary text-white">
                    <div className="text-sm opacity-80">Total Revenue</div>
                    <div className="text-2xl font-bold">$128,450.00</div>
                </div>
                <div className="card">
                    <div className="text-sm text-gray-500">Successful</div>
                    <div className="text-2xl font-bold text-green-600">1,240</div>
                </div>
                <div className="card">
                    <div className="text-sm text-gray-500">Pending</div>
                    <div className="text-2xl font-bold text-yellow-600">45</div>
                </div>
                <div className="card">
                    <div className="text-sm text-gray-500">Refunded</div>
                    <div className="text-2xl font-bold text-purple-600">$4,200.00</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-soft">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Transaction ID..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="ALL">All Status</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                    <option value="REFUNDED">Refunded</option>
                </select>
            </div>

            {/* Payments Table */}
            <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr className="text-left text-gray-400 text-sm">
                                <th className="px-6 py-4 font-medium">Transaction ID</th>
                                <th className="px-6 py-4 font-medium">User</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Method</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {isLoading ? (
                                <tr><td colSpan={7} className="text-center py-10">Loading transactions...</td></tr>
                            ) : payments.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-10">No transactions found.</td></tr>
                            ) : payments.map((payment: any) => (
                                <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                        {payment.transactionId}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-secondary">{payment.user?.name}</div>
                                        <div className="text-xs text-gray-400">{payment.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-secondary">
                                        ${payment.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <CreditCard size={14} className="text-gray-400" />
                                            {payment.paymentMethod}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(payment.status)}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(payment.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {payment.status === 'COMPLETED' && (
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to refund this payment?')) {
                                                            refundMutation.mutate(payment._id);
                                                        }
                                                    }}
                                                    className="p-2 hover:bg-purple-50 text-purple-500 rounded-lg transition-colors"
                                                    title="Refund"
                                                >
                                                    <RefreshCcw size={18} />
                                                </button>
                                            )}
                                            <button className="p-2 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors">
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

export default Payments;
