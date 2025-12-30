import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Plane,
    Ticket,
    CreditCard,
    Settings,
    LogOut,
    Bell,
    Search,
    Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, path, active }: any) => (
    <Link
        to={path}
        className={`flex items-center gap-3 px-6 py-4 transition-all duration-200 ${active
                ? 'bg-primary/10 text-primary border-r-4 border-primary font-bold'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
    >
        <Icon size={20} />
        <span>{label}</span>
    </Link>
);

const MainLayout: React.FC = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-soft flex flex-col fixed h-full">
                <div className="p-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Plane className="text-white" size={20} />
                        </div>
                        <span className="text-2xl font-bold text-secondary">SkyRace</span>
                    </div>
                </div>

                <nav className="flex-1 mt-4">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        path="/"
                        active={location.pathname === '/'}
                    />
                    <SidebarItem
                        icon={Users}
                        label="Users"
                        path="/users"
                        active={location.pathname === '/users'}
                    />
                    <SidebarItem
                        icon={Plane}
                        label="Flights"
                        path="/flights"
                        active={location.pathname === '/flights'}
                    />
                    <SidebarItem
                        icon={Ticket}
                        label="Bookings"
                        path="/bookings"
                        active={location.pathname === '/bookings'}
                    />
                    <SidebarItem
                        icon={CreditCard}
                        label="Payments"
                        path="/payments"
                        active={location.pathname === '/payments'}
                    />
                    <SidebarItem
                        icon={Settings}
                        label="Settings"
                        path="/settings"
                        active={location.pathname === '/settings'}
                    />
                </nav>

                <div className="p-6 border-t">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 text-gray-500 hover:text-red-500 transition-colors w-full"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64">
                {/* Header */}
                <header className="bg-white h-20 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-gray-500 hover:text-primary transition-colors">
                            <Bell size={22} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">3</span>
                        </button>

                        <div className="flex items-center gap-3 border-l pl-6">
                            <div className="text-right">
                                <p className="text-sm font-bold text-secondary">{user?.name}</p>
                                <p className="text-xs text-gray-400">Administrator</p>
                            </div>
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <Users size={20} className="text-gray-500" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
