import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Save, User, Shield, Bell, Database } from 'lucide-react';

export const Settings = () => {
    const { profile } = useAuth();
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
                    <SettingsTab icon={<User size={18} />} label="Personal Profile" active />
                    <SettingsTab icon={<Shield size={18} />} label="Security & Password" />
                    <SettingsTab icon={<Bell size={18} />} label="Notifications" />
                    <SettingsTab icon={<Database size={18} />} label="Supabase Sync" />
                </div>

                <div className="glass-card">
                    <h3 className="mb-6">Profile Information</h3>
                    <form onSubmit={handleUpdateProfile}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
                </div>
            </div>
        </div>
    );
};

const SettingsTab = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '10px',
        cursor: 'pointer',
        background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
        color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
        fontWeight: active ? '600' : '400'
    }}>
        {icon} <span>{label}</span>
    </div>
);
