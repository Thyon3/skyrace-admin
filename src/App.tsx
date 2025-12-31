import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Users from './pages/Users';
import Flights from './pages/Flights';
import Airlines from './pages/Airlines';
import Airports from './pages/Airports';
import Notifications from './pages/Notifications';
import Bookings from './pages/Bookings';
import AuditLogs from './pages/AuditLogs';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Support from './pages/Support';


const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) return null;
    if (!user) return <Navigate to="/login" />;

    return <>{children}</>;
};

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />

                        <Route path="/" element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }>
                            <Route index element={<Dashboard />} />
                            <Route path="analytics" element={<Analytics />} />
                            <Route path="users" element={<Users />} />
                            <Route path="flights" element={<Flights />} />
                            <Route path="airlines" element={<Airlines />} />
                            <Route path="airports" element={<Airports />} />
                            <Route path="notifications" element={<Notifications />} />
                            <Route path="bookings" element={<Bookings />} />
                            <Route path="audit" element={<AuditLogs />} />
                            <Route path="payments" element={<Payments />} />
                            <Route path="support" element={<Support />} />
                            <Route path="settings" element={<Settings />} />

                            <Route path="profile" element={<Profile />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
                <Toaster position="top-right" />
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;
