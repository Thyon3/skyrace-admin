import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Mail, Shield, Save, Key } from 'lucide-react';
import api from '../api/client';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: ''
    });

    const { data: user, isLoading } = useQuery({
        queryKey: ['admin-profile'],
        queryFn: async () => {
            const res = await api.get('/admin/profile');
            return res.data;
        }
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email
            }));
        }
    }, [user]);

    const updateMutation = useMutation({
        mutationFn: (data: any) => api.patch('/admin/profile', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
            toast.success('Profile updated successfully');
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload: any = { name: formData.name, email: formData.email };
        if (formData.newPassword) {
            payload.currentPassword = formData.currentPassword;
            payload.newPassword = formData.newPassword;
        }
        updateMutation.mutate(payload);
    };

    if (isLoading) return <div className="text-center py-10">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-secondary">My Profile</h1>
                <p className="text-gray-500">Manage your account settings and security.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <div className="card text-center space-y-4">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                            <User size={48} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-secondary">{user?.name}</h2>
                            <p className="text-gray-500">{user?.email}</p>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold">
                            <Shield size={16} />
                            Administrator
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="md:col-span-2 space-y-6">
                    <div className="card space-y-6">
                        <div className="flex items-center gap-2 mb-4 text-secondary font-bold border-b pb-4">
                            <User size={20} className="text-primary" />
                            Personal Information
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="input-field pl-10"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="input-field pl-10"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card space-y-6">
                        <div className="flex items-center gap-2 mb-4 text-secondary font-bold border-b pb-4">
                            <Key size={20} className="text-primary" />
                            Security
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Current Password</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    placeholder="Required to change password"
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">New Password</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    placeholder="Leave blank to keep current"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="btn-primary flex items-center gap-2 px-8"
                        >
                            <Save size={18} />
                            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Profile;
