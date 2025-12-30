import React, { useState } from 'react';
import {
    Settings,
    Shield,
    Bell,
    Globe,
    Lock,
    Save,
    Database
} from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [settings, setSettings] = useState({
        siteName: 'SkyRace Admin',
        maintenanceMode: false,
        allowRegistration: true,
        emailNotifications: true,
        backupInterval: 'daily',
        sessionTimeout: '30'
    });

    const { data } = useQuery({
        queryKey: ['system-settings'],
        queryFn: async () => {
            const res = await api.get('/admin/system-settings');
            return res.data.settings;
        }
    });

    React.useEffect(() => {
        if (data) {
            const newSettings: any = { ...settings };
            data.forEach((s: any) => {
                if (s.key === 'maintenanceMode' || s.key === 'allowRegistration' || s.key === 'emailNotifications') {
                    newSettings[s.key] = s.value === 'true';
                } else {
                    newSettings[s.key] = s.value;
                }
            });
            setSettings(newSettings);
        }
    }, [data]);

    const updateMutation = useMutation({
        mutationFn: (payload: { key: string; value: string }) => api.patch('/admin/system-settings', payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['system-settings'] });
        }
    });

    const handleSave = async () => {
        const promises = Object.entries(settings).map(([key, value]) =>
            updateMutation.mutateAsync({ key, value: String(value) })
        );
        await Promise.all(promises);
        toast.success('Settings saved successfully!');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-secondary">System Settings</h1>
                <p className="text-gray-500">Configure global application parameters and security.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* General Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card">
                        <div className="flex items-center gap-2 mb-6 text-secondary font-bold">
                            <Settings size={20} className="text-primary" />
                            General Configuration
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Site Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={settings.siteName}
                                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Session Timeout (min)</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={settings.sessionTimeout}
                                        onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div>
                                    <div className="font-bold text-secondary">Maintenance Mode</div>
                                    <div className="text-xs text-gray-500">Disable frontend access for all users</div>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-primary' : 'bg-gray-300'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div>
                                    <div className="font-bold text-secondary">Allow New Registrations</div>
                                    <div className="text-xs text-gray-500">Enable or disable user signups</div>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, allowRegistration: !settings.allowRegistration })}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.allowRegistration ? 'bg-primary' : 'bg-gray-300'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.allowRegistration ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center gap-2 mb-6 text-secondary font-bold">
                            <Bell size={20} className="text-primary" />
                            Notification Settings
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div>
                                    <div className="font-bold text-secondary">Email Notifications</div>
                                    <div className="text-xs text-gray-500">Send system alerts via email</div>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.emailNotifications ? 'bg-primary' : 'bg-gray-300'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.emailNotifications ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <div className="card">
                        <div className="flex items-center gap-2 mb-6 text-secondary font-bold">
                            <Database size={20} className="text-primary" />
                            Backup & Storage
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Backup Interval</label>
                                <select
                                    className="input-field"
                                    value={settings.backupInterval}
                                    onChange={(e) => setSettings({ ...settings, backupInterval: e.target.value })}
                                >
                                    <option value="hourly">Hourly</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                </select>
                            </div>
                            <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-colors">
                                Run Manual Backup
                            </button>
                        </div>
                    </div>

                    <div className="card bg-secondary text-white">
                        <div className="flex items-center gap-2 mb-4 font-bold">
                            <Shield size={20} className="text-primary" />
                            Security Status
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">SSL Certificate</span>
                                <span className="text-green-400 font-bold">Active</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Firewall</span>
                                <span className="text-green-400 font-bold">Enabled</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Last Audit</span>
                                <span>2h ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button className="px-8 py-3 border rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                    Discard Changes
                </button>
                <button
                    onClick={handleSave}
                    className="btn-primary px-8 flex items-center gap-2"
                >
                    <Save size={18} />
                    Save Settings
                </button>
            </div>
        </div>
    );
};

export default SystemSettings;
