import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Tag,
    Plus,
    Search,
    Calendar,
    Trash2,
    CheckCircle,
    XCircle,
    TrendingDown,
    Percent
} from 'lucide-react';
import api from '../api/client';
import toast from 'react-hot-toast';

const Promos: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();

    const { data: promos, isLoading } = useQuery({
        queryKey: ['admin-promos'],
        queryFn: async () => {
            const res = await api.get('/promos');
            return res.data.data;
        }
    });


    const createMutation = useMutation({
        mutationFn: (payload: any) => api.post('/promos', payload),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-promos'] });
            toast.success('Promo code created successfully');
            setIsModalOpen(false);
        }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Promotions & Discounts</h1>
                    <p className="text-gray-500">Manage promo codes and marketing campaigns.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Promo Code
                </button>
            </div>

            <div className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-soft">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search codes..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div>Loading...</div>
                ) : promos?.map((promo: any) => (
                    <div key={promo._id} className="card relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            {promo.isActive ? (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase">
                                    <CheckCircle size={10} /> Active
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full uppercase">
                                    <XCircle size={10} /> Inactive
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                {promo.discountType === 'PERCENTAGE' ? <Percent size={24} /> : <Tag size={24} />}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-secondary tracking-widest">{promo.code}</h3>
                                <p className="text-xs text-gray-400">
                                    Expires {new Date(promo.expiryDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                <span className="text-sm text-gray-500">Value</span>
                                <span className="font-black text-secondary">
                                    {promo.discountType === 'PERCENTAGE' ? `${promo.value}%` : `$${promo.value}`}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-center">
                                <div className="border border-gray-100 rounded-xl p-2">
                                    <div className="text-xs text-gray-400">Used</div>
                                    <div className="font-bold text-secondary">{promo.usedCount}</div>
                                </div>
                                <div className="border border-gray-100 rounded-xl p-2">
                                    <div className="text-xs text-gray-400">Limit</div>
                                    <div className="font-bold text-secondary">{promo.usageLimit || '∞'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-sm font-bold transition-colors">
                                Edit
                            </button>
                            <button className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simple Create Modal Placeholder */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">Create Promo Code</h2>
                        <form onSubmit={(e: any) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            createMutation.mutate(Object.fromEntries(formData));
                        }} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Code</label>
                                <input name="code" className="w-full mt-1 px-4 py-2 bg-gray-50 rounded-xl border-none" placeholder="SUMMER2025" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Type</label>
                                    <select name="discountType" className="w-full mt-1 px-4 py-2 bg-gray-50 rounded-xl border-none">
                                        <option value="PERCENTAGE">Percentage</option>
                                        <option value="FIXED">Fixed Amount</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Value</label>
                                    <input name="value" type="number" className="w-full mt-1 px-4 py-2 bg-gray-50 rounded-xl border-none" required />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Expiry Date</label>
                                <input name="expiryDate" type="date" className="w-full mt-1 px-4 py-2 bg-gray-50 rounded-xl border-none" required />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-gray-500 font-bold">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary py-3">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Promos;
