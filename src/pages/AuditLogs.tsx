import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Activity,
    Clock,
    User,
    Database,
    ChevronLeft,
    ChevronRight,
    SearchX
} from 'lucide-react';

import api from '../api/client';

const AuditLogs: React.FC = () => {
    const [page, setPage] = useState(1);
    const [actionFilter, setActionFilter] = useState('');
    const [resourceFilter, setResourceFilter] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['admin-audit-logs', page, actionFilter, resourceFilter],
        queryFn: async () => {
            const res = await api.get('/admin/audit', {
                params: {
                    page,
                    action: actionFilter || undefined,
                    resource: resourceFilter || undefined
                }
            });
            return res.data;
        }
    });

    const logs = data?.data || [];
    const pagination = data?.pagination || { page: 1, pages: 1 };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-secondary text-[24px]">Audit Logs</h1>
                    <p className="text-gray-500">Track all administrative actions and system changes.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-2xl shadow-soft">
                <div className="relative">
                    <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                        value={actionFilter}
                        onChange={(e) => setActionFilter(e.target.value)}
                    >
                        <option value="">All Actions</option>
                        <option value="CREATE">CREATE</option>
                        <option value="UPDATE">UPDATE</option>
                        <option value="DELETE">DELETE</option>
                        <option value="LOGIN">LOGIN</option>
                    </select>
                </div>
                <div className="relative">
                    <Database className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                        value={resourceFilter}
                        onChange={(e) => setResourceFilter(e.target.value)}
                    >
                        <option value="">All Resources</option>
                        <option value="Flight">Flight</option>
                        <option value="User">User</option>
                        <option value="Booking">Booking</option>
                        <option value="Airline">Airline</option>
                        <option value="Airport">Airport</option>
                    </select>
                </div>
                <button
                    onClick={() => { setActionFilter(''); setResourceFilter(''); setPage(1); }}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-gray-500 hover:text-primary transition-colors"
                >
                    <SearchX size={18} />
                    <span className="text-[14px]">Reset Filters</span>
                </button>
            </div>

            {/* Logs Table */}
            <div className="card overflow-hidden p-0 border border-gray-100 shadow-xl rounded-[24px]">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 border-b">
                            <tr className="text-left text-gray-400 text-[12px] uppercase tracking-wider">
                                <th className="px-6 py-4 font-bold">Admin</th>
                                <th className="px-6 py-4 font-bold">Action</th>
                                <th className="px-6 py-4 font-bold">Resource</th>
                                <th className="px-6 py-4 font-bold">Details</th>
                                <th className="px-6 py-4 font-bold">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center py-20 text-gray-400">Loading audit logs...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-20 text-gray-400">No logs found.</td></tr>
                            ) : logs.map((log: any) => (
                                <tr key={log._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-secondary/5 rounded-lg flex items-center justify-center text-secondary">
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-bold text-secondary">{log.admin?.name || 'System'}</div>
                                                <div className="text-[11px] text-gray-400">{log.admin?.email || 'automated@skyrace.com'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${log.action === 'CREATE' ? 'bg-green-100 text-green-600' :
                                            log.action === 'UPDATE' ? 'bg-blue-100 text-blue-600' :
                                                log.action === 'DELETE' ? 'bg-red-100 text-red-600' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-[14px] font-medium text-secondary">{log.resource}</div>
                                        <div className="text-[11px] text-gray-400 uppercase font-bold tracking-tighter">ID: {log.resourceId?.substring(0, 8)}...</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-xs overflow-hidden">
                                            <p className="text-[12px] text-gray-500 truncate" title={JSON.stringify(log.details)}>
                                                {JSON.stringify(log.details)}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Clock size={14} className="text-gray-300" />
                                            <div className="text-[12px]">
                                                <div>{new Date(log.createdAt).toLocaleDateString()}</div>
                                                <div className="text-[10px] opacity-70">{new Date(log.createdAt).toLocaleTimeString()}</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
                    <p className="text-[13px] text-gray-500">
                        Showing page <span className="font-bold">{pagination.page}</span> of <span className="font-bold">{pagination.pages}</span>
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 border rounded-xl hover:bg-white disabled:opacity-50 transition-all shadow-sm"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                            disabled={page === pagination.pages}
                            className="p-2 border rounded-xl hover:bg-white disabled:opacity-50 transition-all shadow-sm"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
