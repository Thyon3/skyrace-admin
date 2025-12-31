import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Settings,
    Save,
    ShieldCheck,
    Coins,
    Mail,
    Percent,
    Server
} from 'lucide-react';
import api from '../api/client';
import toast from 'react-hot-toast';

const SystemSettings: React.FC = () => {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['system-settings'],
        queryFn: async () => {
            const res = await api.get('/admin/system-settings');
            return res.data;
        }
    });

    const updateMutation = useMutation({
        mutationFn: (payload: { key: string; value: string }) => api.patch('/admin/system-settings', payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['system-settings'] });
            toast.success('Settings updated successfully');
        },
        onError: () => {
            toast.error('Failed to update setting');
        }
    });

    const handleChange = (key: string, value: string) => {
        updateMutation.mutate({ key, value });
    };

    const getIcon = (key: string) => {
        if (key.includes('REVENUE')) return <Percent className="text-blue-500" />;
        if (key.includes('LOYALTY')) return <Coins className="text-orange-500" />;
        if (key.includes('MAINTENANCE')) return <ShieldCheck className="text-red-500" />;
        if (key.includes('EMAIL')) return <Mail className="text-purple-500" />;
        return <Settings className="text-gray-500" />;
    };

    if (isLoading) return (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-secondary tracking-tight">System Configuration</h1>
                <p className="text-gray-500 mt-2">Global parameters and business logic values for the entire platform.</p>
            </div>

            <div className="grid gap-6">
                {data?.settings?.map((s: any) => (
                    <div key={s._id} className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-shadow border border-gray-100">
                        <div className="flex gap-4 items-start">
                            <div className="p-3 bg-gray-50 rounded-2xl shrink-0">
                                {getIcon(s.key)}
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-secondary uppercase tracking-widest">{s.key.replace(/_/g, ' ')}</h3>
                                <p className="text-sm text-gray-500 mt-1 max-w-md">{s.description}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {s.value === 'true' || s.value === 'false' ? (
                                <button
                                    onClick={() => handleChange(s.key, s.value === 'true' ? 'false' : 'true')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${s.value === 'true' ? 'bg-primary' : 'bg-gray-200'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${s.value === 'true' ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            ) : (
                                <div className="relative group">
                                    <input
                                        type="text"
                                        className="w-full md:w-48 px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm font-bold text-secondary text-right"
                                        defaultValue={s.value}
                                        onBlur={(e) => {
                                            if (e.target.value !== s.value) {
                                                handleChange(s.key, e.target.value);
                                            }
                                        }}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Save size={14} className="text-primary" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="card bg-secondary text-white p-8 overflow-hidden relative">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Platform Health</h3>
                    <p className="text-gray-400 text-sm mb-6">All systems are currently operational and under optimal load.</p>
                    <div className="flex gap-8">
                        <div>
                            <div className="text-2xl font-black text-primary">99.9%</div>
                            <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Uptime</div>
                        </div>
                        <div>
                            <div className="text-2xl font-black text-primary">24ms</div>
                            <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Latency</div>
                        </div>
                    </div>
                </div>
                <Server size={180} className="absolute -right-10 -bottom-10 text-white/5 rotate-12" />
            </div>
        </div>
    );
};

export default SystemSettings;

