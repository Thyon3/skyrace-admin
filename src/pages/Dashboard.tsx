import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Users,
    Ticket,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Plane
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import api from '../api/client';

const data = [
    { name: 'Jan', revenue: 4000, bookings: 240 },
    { name: 'Feb', revenue: 3000, bookings: 139 },
    { name: 'Mar', revenue: 2000, bookings: 980 },
    { name: 'Apr', revenue: 2780, bookings: 390 },
    { name: 'May', revenue: 1890, bookings: 480 },
    { name: 'Jun', revenue: 2390, bookings: 380 },
    { name: 'Jul', revenue: 3490, bookings: 430 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue }: any) => (
    <div className="card">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Icon size={24} />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                <span>{trendValue}%</span>
            </div>
        </div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-secondary mt-1">{value}</p>
    </div>
);

const Dashboard: React.FC = () => {
    const { data: metrics, isLoading } = useQuery({
        queryKey: ['admin-metrics'],
        queryFn: async () => {
            const res = await api.get('/admin/dashboard/metrics');
            return res.data;
        }
    });

    if (isLoading) return <div className="flex items-center justify-center h-96">Loading...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Dashboard Overview</h1>
                    <p className="text-gray-500">Welcome back, here's what's happening today.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <TrendingUp size={18} />
                    <span>Export Report</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={metrics?.metrics?.totalUsers || 0}
                    icon={Users}
                    trend="up"
                    trendValue="12"
                />
                <StatCard
                    title="Total Bookings"
                    value={metrics?.metrics?.totalBookings || 0}
                    icon={Ticket}
                    trend="up"
                    trendValue="8"
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${metrics?.metrics?.totalRevenue?.toLocaleString() || 0}`}
                    icon={DollarSign}
                    trend="up"
                    trendValue="15"
                />
                <StatCard
                    title="Active Flights"
                    value={metrics?.metrics?.totalFlights || 0}
                    icon={Plane}
                    trend="down"
                    trendValue="3"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="card">
                    <h3 className="text-lg font-bold text-secondary mb-6">Revenue Growth</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={metrics?.chartData || []}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00A991" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#00A991" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#00A991" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bookings Chart */}
                <div className="card">
                    <h3 className="text-lg font-bold text-secondary mb-6">Booking Statistics</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics?.chartData || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="bookings" fill="#263238" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-secondary">Recent Bookings</h3>
                    <Link to="/bookings" className="text-primary font-medium hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-400 text-sm border-b">
                                <th className="pb-4 font-medium">User</th>
                                <th className="pb-4 font-medium">Flight</th>
                                <th className="pb-4 font-medium">Date</th>
                                <th className="pb-4 font-medium">Amount</th>
                                <th className="pb-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {metrics?.recentBookings?.map((booking: any) => (
                                <tr key={booking._id} className="text-sm">
                                    <td className="py-4">
                                        <div className="font-medium text-secondary">{booking.user?.name}</div>
                                        <div className="text-xs text-gray-400">{booking.user?.email}</div>
                                    </td>
                                    <td className="py-4">
                                        <div className="font-medium text-secondary">{booking.flight?.airline}</div>
                                        <div className="text-xs text-gray-400">{booking.flight?.flightNumber}</div>
                                    </td>
                                    <td className="py-4 text-gray-500">
                                        {new Date(booking.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 font-bold text-secondary">
                                        ${booking.totalPrice}
                                    </td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${booking.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                                'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            {booking.status}
                                        </span>
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

export default Dashboard;
