import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    TrendingUp,
    Users,
    DollarSign,
    MapPin,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import api from '../api/client';

const Analytics: React.FC = () => {
    const { data: revenueData, isLoading: revLoading } = useQuery({
        queryKey: ['admin-revenue-summary'],
        queryFn: async () => {
            const res = await api.get('/admin/revenue/summary');
            return res.data.stats;
        }
    });

    const { data: routeData, isLoading: routeLoading } = useQuery({
        queryKey: ['admin-route-stats'],
        queryFn: async () => {
            const res = await api.get('/admin/revenue/routes');
            return res.data.stats;
        }
    });

    const { data: airlineData, isLoading: airlineLoading } = useQuery({
        queryKey: ['admin-airline-stats'],
        queryFn: async () => {
            const res = await api.get('/admin/revenue/airlines');
            return res.data.stats;
        }
    });


    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-secondary">Advanced Analytics</h1>
                <p className="text-gray-500">Deep dive into revenue trends, user behavior, and route performance.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <DollarSign size={24} />
                        </div>
                        <div className="flex items-center gap-1 text-green-500 text-sm font-bold">
                            <ArrowUpRight size={16} />
                            12.5%
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">Monthly Revenue</div>
                    <div className="text-2xl font-bold text-secondary">$42,850</div>
                </div>

                <div className="card">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                            <Users size={24} />
                        </div>
                        <div className="flex items-center gap-1 text-green-500 text-sm font-bold">
                            <ArrowUpRight size={16} />
                            8.2%
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">New Customers</div>
                    <div className="text-2xl font-bold text-secondary">1,240</div>
                </div>

                <div className="card">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                            <TrendingUp size={24} />
                        </div>
                        <div className="flex items-center gap-1 text-red-500 text-sm font-bold">
                            <ArrowDownRight size={16} />
                            3.1%
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">Avg. Ticket Price</div>
                    <div className="text-2xl font-bold text-secondary">$345.20</div>
                </div>

                <div className="card">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                            <MapPin size={24} />
                        </div>
                        <div className="flex items-center gap-1 text-green-500 text-sm font-bold">
                            <ArrowUpRight size={16} />
                            15.4%
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">Active Routes</div>
                    <div className="text-2xl font-bold text-secondary">84</div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h3 className="text-lg font-bold text-secondary mb-6">Revenue Trend (Last 30 Days)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="totalRevenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-bold text-secondary mb-6">Top Performing Routes</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={routeData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey={(d) => `${d._id.origin} → ${d._id.destination}`}
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    width={150}
                                    tick={{ fontSize: 10, fill: '#4b5563', fontWeight: 'bold' }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="card lg:col-span-2">
                    <h3 className="text-lg font-bold text-secondary mb-6">Booking Volume</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Line type="stepAfter" dataKey="count" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-bold text-secondary mb-6">Revenue by Airline</h3>
                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={airlineData?.map((a: any) => ({ name: a._id, value: a.revenue })) || []}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {airlineData?.map((_: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => `$${value.toLocaleString()}`}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-4 max-h-32 overflow-y-auto pr-2">
                        {airlineData?.map((item: any, index: number) => (
                            <div key={item._id} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-gray-500 truncate max-w-[100px]">{item._id}</span>
                                </div>
                                <span className="font-bold text-secondary">${item.revenue.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Analytics;
