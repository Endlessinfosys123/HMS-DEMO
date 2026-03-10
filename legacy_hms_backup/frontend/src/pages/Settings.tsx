import { Settings as SettingsIcon, Shield, Bell, User, Building } from 'lucide-react';

export const Settings = () => {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">System Settings</h1>
                <p className="text-muted">Configure hospital parameters, users, and integrations.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 3fr)', gap: '24px' }}>

                {/* Settings Nav */}
                <div className="glass-card" style={{ padding: '16px' }}>
                    <div className="flex flex-col gap-2">
                        <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-white/10 text-left font-bold text-accent-primary border-l-4 border-[var(--accent-primary)]">
                            <Building size={18} /> General Setup
                        </button>
                        <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/5 text-left text-muted transition-colors">
                            <User size={18} /> User Management
                        </button>
                        <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/5 text-left text-muted transition-colors">
                            <Shield size={18} /> Roles & Permissions
                        </button>
                        <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/5 text-left text-muted transition-colors">
                            <Bell size={18} /> Notification Config
                        </button>
                        <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/5 text-left text-muted transition-colors">
                            <SettingsIcon size={18} /> Advanced
                        </button>
                    </div>
                </div>

                {/* Settings Content Area */}
                <div className="glass-card">
                    <h3 className="font-bold text-xl mb-6 border-b border-[var(--border-light)] pb-4">General Setup</h3>

                    <div className="form-group" style={{ maxWidth: '500px' }}>
                        <label className="form-label">Hospital Name</label>
                        <input type="text" className="form-input" defaultValue="HealthCore Medical Center" />
                    </div>

                    <div className="form-group" style={{ maxWidth: '500px' }}>
                        <label className="form-label">Contact Email</label>
                        <input type="email" className="form-input" defaultValue="admin@healthcore.local" />
                    </div>

                    <div className="form-group" style={{ maxWidth: '500px' }}>
                        <label className="form-label">Address</label>
                        <textarea className="form-input" rows={3} defaultValue="123 Medical Drive, Health City, HC 90210"></textarea>
                    </div>

                    <div className="form-group" style={{ maxWidth: '500px' }}>
                        <label className="form-label">Currency Settings</label>
                        <select className="form-input bg-[var(--bg-main)]">
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                            <option>GBP (£)</option>
                        </select>
                    </div>

                    <div className="mt-8">
                        <button className="btn btn-primary">Save Changes</button>
                    </div>
                </div>

            </div>
        </div>
    );
};
