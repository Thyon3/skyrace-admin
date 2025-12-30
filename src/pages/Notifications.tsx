import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Send,
    Bell,
    Trash2,
    Users,
    ShieldAlert,
    CheckCircle,
    Info,
    Megaphone
} from 'lucide-react';
import api from '../api/client';
import toast from 'react-hot-toast';

const Notifications: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'INFO',
        target: 'ALL'
    });

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['admin-notifications'],
        queryFn: async () => {
            const res = await api.get('/admin/notifications');
            return res.data;
        }
    });

    const broadcastMutation = useMutation({
        mutationFn: (data: any) => api.post('/admin/notifications/broadcast', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
            toast.success('Broadcast sent successfully');
            setIsModalOpen(false);
            setFormData({ title: '', message: '', type: 'INFO', target: 'ALL' });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/admin/notifications/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
            toast.success('Notification deleted');
        }
    });

    const notifications = data?.notifications || [];

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'INFO': return <Info size={18} className="text-blue-500" />;
            case 'WARNING': return <ShieldAlert size={18} className="text-yellow-500" />;
            case 'SUCCESS': return <CheckCircle size={18} className="text-green-500" />;
            case 'PROMOTION': return <Megaphone size={18} className="text-purple-500" />;
            default: return <Bell size={18} className="text-gray-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">System Notifications</h1>
                    <p className="text-gray-500">Send global broadcasts and manage system alerts.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Send size={18} />
                    New Broadcast
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    <div className="text-center py-10">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-10 card">
                        <Bell size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-500">No notifications sent yet.</p>
                    </div>
                ) : notifications.map((notif: any) => (
                    <div key={notif._id} className="card flex gap-4 items-start hover:shadow-md transition-shadow">
                        <div className={`p-3 rounded-2xl ${notif.type === 'INFO' ? 'bg-blue-50' :
                                notif.type === 'WARNING' ? 'bg-yellow-50' :
                                    notif.type === 'SUCCESS' ? 'bg-green-50' : 'bg-purple-50'
                            }`}>
                            {getTypeIcon(notif.type)}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-secondary">{notif.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                </div>
                                <button
                                    onClick={() => deleteMutation.mutate(notif._id)}
                                    className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="flex items-center gap-4 mt-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                <span className="flex items-center gap-1">
                                    <Users size={12} />
                                    Target: {notif.target}
                                </span>
                                <span>•</span>
                                <span>Sent by: {notif.sentBy?.name}</span>
                                <span>•</span>
                                <span>{new Date(notif.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Broadcast Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b">
                            <h2 className="text-2xl font-bold text-secondary">Send New Broadcast</h2>
                            <p className="text-gray-500">This will be visible to all selected users.</p>
                        </div>

                        <div className="p-8 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="e.g. System Maintenance"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none h-32 resize-none"
                                    placeholder="Enter your message here..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="INFO">Information</option>
                                        <option value="WARNING">Warning</option>
                                        <option value="SUCCESS">Success</option>
                                        <option value="PROMOTION">Promotion</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Target Audience</label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={formData.target}
                                        onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                                    >
                                        <option value="ALL">All Users</option>
                                        <option value="USERS">Regular Users</option>
                                        <option value="ADMINS">Administrators</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50 flex gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => broadcastMutation.mutate(formData)}
                                disabled={broadcastMutation.isPending || !formData.title || !formData.message}
                                className="flex-1 btn-primary disabled:opacity-50"
                            >
                                {broadcastMutation.isPending ? 'Sending...' : 'Send Broadcast'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
