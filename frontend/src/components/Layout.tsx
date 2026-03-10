import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Calendar,
    FileText,
    Pill,
    CreditCard,
    Settings,
    LogOut,
    Bell,
    Search,
    TestTube
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div style={{ padding: '0 24px', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--accent-primary)' }}>HealthCore HMS</h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supabase Edition</p>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <SidebarLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                <SidebarLink to="/patients" icon={<Users size={20} />} label="Patients" />
                <SidebarLink to="/appointments" icon={<Calendar size={20} />} label="Schedule" />
                <SidebarLink to="/inpatients" icon={<Users size={20} />} label="Admissions" />
                <SidebarLink to="/beds" icon={<FileText size={20} />} label="Wards" />
                <SidebarLink to="/lab" icon={<TestTube size={20} />} label="Laboratory" />
                <SidebarLink to="/pharmacy" icon={<Pill size={20} />} label="Pharmacy" />
                <SidebarLink to="/billing" icon={<CreditCard size={20} />} label="Billing" />

                <div style={{ height: '32px' }} />
                <SidebarLink to="/settings" icon={<Settings size={20} />} label="Settings" />
            </nav>
        </aside>
    );
};

const SidebarLink = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
    <NavLink
        to={to}
        style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 24px',
            color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
            textDecoration: 'none',
            fontWeight: isActive ? '600' : '400',
            background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent'
        })}
    >
        {icon} <span>{label}</span>
    </NavLink>
);

const Header = () => {
    const { profile, signOut } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <header className="top-header">
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '8px 16px', width: '400px' }}>
                <Search size={18} className="text-muted" style={{ marginRight: '8px' }} />
                <input
                    type="text"
                    placeholder="Search patients, records..."
                    style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="btn btn-outline"
                        style={{ padding: '8px', border: 'none', position: 'relative' }}
                    >
                        <Bell size={20} />
                        <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: 'var(--status-danger)', borderRadius: '50%' }}></span>
                    </button>

                    {showNotifications && (
                        <div className="glass-card" style={{ position: 'absolute', top: '50px', right: '0', width: '320px', zIndex: 1000, padding: '16px' }}>
                            <h4 className="mb-4">Notifications</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <NotificationItem title="New Appointment" time="5m ago" desc="Patient John Doe scheduled an appointment." />
                                <NotificationItem title="Low Stock Alert" time="2h ago" desc="Paracetamol 500mg is running low (8 items left)." />
                                <NotificationItem title="Lab Result Ready" time="1d ago" desc="Lab results for Patient Sarah Jenkins are available." />
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{profile?.first_name || 'Admin User'}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{profile?.roles?.name || 'Administrator'}</p>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {profile?.first_name?.[0] || 'A'}
                </div>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 12px' }}>
                    <LogOut size={16} />
                </button>
            </div>
        </header>
    );
};

const NotificationItem = ({ title, time, desc }: { title: string, time: string, desc: string }) => (
    <div style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{title}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{time}</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{desc}</p>
    </div>
);

export const Layout = () => {
    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-wrapper">
                <Header />
                <main className="content-area">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
