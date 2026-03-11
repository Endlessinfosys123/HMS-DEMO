import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Save, User, Shield, Bell, Database } from 'lucide-react';

export const Settings = () => {
    const { profile } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState(profile?.first_name || '');
    const [lastName, setLastName] = useState(profile?.last_name || '');
    const [phone, setPhone] = useState(profile?.phone || '');

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase
            .from('profiles')
            .update({
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                updated_at: new Date().toISOString(),
            })
            .eq('id', profile?.id);

        if (error) alert(error.message);
        else alert('Profile updated successfully!');
        setLoading(false);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-3xl">System Settings</h1>
                <p className="text-muted">Manage your profile, hospital configuration, and connectivity.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
                <div className="glass-card" style={{ height: 'fit-content', padding: '12px' }}>
                    <SettingsTab icon={<User size={18} />} label="Personal Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                    <SettingsTab icon={<Shield size={18} />} label="Security & Password" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
                    <SettingsTab icon={<Bell size={18} />} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
                    <SettingsTab icon={<Database size={18} />} label="Supabase Sync" active={activeTab === 'sync'} onClick={() => setActiveTab('sync')} />
                </div>

                <div className="glass-card">
                    {activeTab === 'profile' && (
                        <>
                            <h3 className="mb-6">Profile Information</h3>
                            <form onSubmit={handleUpdateProfile}>
                                <div className="grid-2">
                                    <div className="form-group">
                                        <label className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email (Managed by Supabase Auth)</label>
                                    <input type="email" className="form-input" value={profile?.email} disabled style={{ opacity: 0.6 }} />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-light)', textAlign: 'right' }}>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {activeTab === 'security' && (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            <Shield size={48} className="text-muted mb-4 mx-auto" strokeWidth={1} />
                            <h3>Security Settings</h3>
                            <p className="text-muted mb-6">Password management is handled via Supabase Auth services.</p>
                            <button className="btn btn-primary">Request Password Reset</button>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div>
                            <h3 className="mb-6">Notification Preferences</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <NotifyToggle label="Email Notifications" checked />
                                <NotifyToggle label="In-App Alerts" checked />
                                <NotifyToggle label="Critical Stock Reports" />
                                <NotifyToggle label="Appointment Reminders" checked />
                            </div>
                        </div>
                    )}

                    {activeTab === 'sync' && (
                        <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--status-success)' }}></div>
                                <div>
                                    <p style={{ fontWeight: '600' }}>Supabase Connected</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last synced: Just now</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const SettingsTab = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) => (
    <div 
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            cursor: 'pointer',
            background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: active ? '600' : '400',
            transition: 'all 0.2s ease'
        }}
    >
        {icon} <span>{label}</span>
    </div>
);

const NotifyToggle = ({ label, checked = false }: { label: string, checked?: boolean }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{label}</span>
        <div style={{ width: '40px', height: '20px', borderRadius: '10px', background: checked ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: checked ? '22px' : '2px', transition: 'left 0.2s' }}></div>
        </div>
    </div>
);
