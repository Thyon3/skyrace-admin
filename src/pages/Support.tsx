import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Search,
    Filter,
    MessageSquare,
    Clock,
    CheckCircle,
    AlertCircle,
    User,
    Send,
    ChevronRight
} from 'lucide-react';
import api from '../api/client';
import toast from 'react-hot-toast';

const Support: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [reply, setReply] = useState('');
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['admin-tickets'],
        queryFn: async () => {
            const res = await api.get('/admin/support');
            return res.data;
        }
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: string }) =>
            api.put(`/admin/support/${id}/status`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
            toast.success('Status updated');
        }
    });

    const replyMutation = useMutation({
        mutationFn: ({ id, message }: { id: string, message: string }) =>
            api.post(`/admin/support/${id}/response`, { message }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
            setReply('');
            toast.success('Reply sent');
        }
    });

    const tickets = data?.data || [];
    const filteredTickets = tickets.filter((t: any) =>
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.userId?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-100 text-blue-600';
            case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-600';
            case 'RESOLVED': return 'bg-green-100 text-green-600';
            case 'CLOSED': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-120px)]">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Customer Support</h1>
                    <p className="text-gray-500">Manage and respond to user support requests.</p>
                </div>
            </div>

            <div className="flex gap-6 flex-1 min-h-0">
                {/* Tickets List */}
                <div className="w-1/3 flex flex-col gap-4 bg-white rounded-2xl shadow-soft p-4 min-h-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {isLoading ? (
                            <div className="text-center py-4">Loading tickets...</div>
                        ) : filteredTickets.length === 0 ? (
                            <div className="text-center py-4 text-gray-400">No tickets found.</div>
                        ) : filteredTickets.map((ticket: any) => (
                            <button
                                key={ticket._id}
                                onClick={() => setSelectedTicket(ticket)}
                                className={`w-full text-left p-4 rounded-xl transition-all border-2 ${selectedTicket?._id === ticket._id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-transparent hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(ticket.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 className="font-bold text-secondary truncate">{ticket.subject}</h4>
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                    <User size={12} />
                                    {ticket.userId?.name || 'Anonymous'}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Ticket Detail */}
                <div className="flex-1 bg-white rounded-2xl shadow-soft flex flex-col min-h-0 overflow-hidden">
                    {selectedTicket ? (
                        <>
                            <div className="p-6 border-b flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-secondary">{selectedTicket.subject}</h2>
                                    <div className="flex items-center gap-4 mt-1">
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <User size={14} />
                                            {selectedTicket.userId?.name} ({selectedTicket.userId?.email})
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedTicket.status)}`}>
                                            {selectedTicket.status}
                                        </div>
                                    </div>
                                </div>
                                <select
                                    className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={selectedTicket.status}
                                    onChange={(e) => statusMutation.mutate({ id: selectedTicket._id, status: e.target.value })}
                                >
                                    <option value="OPEN">Open</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Resolved</option>
                                    <option value="CLOSED">Closed</option>
                                </select>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
                                <div className="bg-white p-4 rounded-2xl shadow-sm border">
                                    <p className="text-secondary whitespace-pre-wrap">{selectedTicket.message}</p>
                                    <div className="text-[10px] text-gray-400 mt-4">
                                        Opened on {new Date(selectedTicket.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                {selectedTicket.responses.map((resp: any, index: number) => (
                                    <div
                                        key={index}
                                        className={`flex ${resp.senderRole === 'ADMIN' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm border ${resp.senderRole === 'ADMIN'
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white text-secondary'
                                            }`}>
                                            <p className="whitespace-pre-wrap">{resp.message}</p>
                                            <div className={`text-[10px] mt-2 ${resp.senderRole === 'ADMIN' ? 'text-white/70' : 'text-gray-400'
                                                }`}>
                                                {new Date(resp.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-white border-t">
                                <div className="flex gap-4">
                                    <textarea
                                        placeholder="Type your response..."
                                        className="flex-1 bg-gray-50 rounded-xl p-4 border-none focus:ring-2 focus:ring-primary/20 outline-none resize-none h-24"
                                        value={reply}
                                        onChange={(e) => setReply(e.target.value)}
                                    />
                                    <button
                                        onClick={() => replyMutation.mutate({ id: selectedTicket._id, message: reply })}
                                        disabled={!reply.trim() || replyMutation.isPending}
                                        className="btn-primary self-end flex items-center gap-2 py-4"
                                    >
                                        <Send size={18} />
                                        Send Reply
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                <MessageSquare size={32} />
                            </div>
                            <p>Select a ticket to view details and respond.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Support;
