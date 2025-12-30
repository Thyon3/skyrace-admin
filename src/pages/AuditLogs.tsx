import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    ClipboardList,
    User,
    Activity,
    Clock,
    ShieldAlert
} from 'lucide-react';
import api from '../api/client';

const AuditLogs: React.FC = () => {
    const [page, setPage] = useState(1);
    const [actionFilter, setActionFilter] = useState('');
    const [resourceFilter, setResourceFilter] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['admin-audit-logs', page, actionFilter, resourceFilter],
        queryFn: async () => {
            const params: any = { page, limit: 20 };
            if (actionFilter) params.action = actionFilter;
            if (resourceFilter) params.resource = resourceFilter;
            const res = await api.get('/admin/audit', { params });
            return res.data;
        }
    });

    const logs = data?.logs || [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-secondary">System Audit Logs</h1>
                <p className="text-gray-500">Track all administrative actions and system changes.</p>
            </div>

            <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr className="text-left text-gray-400 text-sm">
                                <th className="px-6 py-4 font-medium">Admin</th>
                                <th className="px-6 py-4 font-medium">Action</th>
                                <th className="px-6 py-4 font-medium">Resource</th>
                                <th className="px-6 py-4 font-medium">Details</th>
                                <th className="px-6 py-4 font-medium">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center py-10">Loading logs...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-10">No logs found.</td></tr>
                            ) : logs.map((log: any) => (
                                <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                                <User size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-secondary">{log.admin?.name}</div>
                                                <div className="text-[10px] text-gray-400">{log.admin?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${log.action === 'DELETE' ? 'bg-red-100 text-red-600' :
                                            log.action === 'CREATE' ? 'bg-green-100 text-green-600' :
                                                'bg-blue-100 text-blue-600'
                                            }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-secondary">
                                            <ClipboardList size={14} className="text-gray-400" />
                                            {log.resource}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs text-gray-500 max-w-xs truncate">
                                            {JSON.stringify(log.details)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(log.timestamp).toLocaleString()}
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

export default AuditLogs;
