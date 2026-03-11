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
    TestTube,
    Shield,
    BarChart3,
    MessageSquare,
    Sparkles,
    X,
    Stethoscope
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

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
                <SidebarLink to="/doctors" icon={<Stethoscope size={20} />} label="Doctors" />
                <SidebarLink to="/appointments" icon={<Calendar size={20} />} label="Schedule" />
                <SidebarLink to="/inpatients" icon={<Users size={20} />} label="Admissions" />
                <SidebarLink to="/beds" icon={<FileText size={20} />} label="Wards" />
                <SidebarLink to="/lab" icon={<TestTube size={20} />} label="Laboratory" />
                <SidebarLink to="/pharmacy" icon={<Pill size={20} />} label="Pharmacy" />
                <SidebarLink to="/billing" icon={<CreditCard size={20} />} label="Billing" />
                <SidebarLink to="/staff" icon={<Shield size={20} />} label="Staff / HR" />
                <SidebarLink to="/reports" icon={<BarChart3 size={20} />} label="Reports" />

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
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        const { data } = await supabase
            .from('patients')
            .select('id, first_name, last_name')
            .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
            .limit(5);
        
        setSearchResults(data || []);
        setIsSearching(false);
    };

    return (
        <header className="top-header">
            <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '8px 16px', width: '400px' }}>
                    <Search size={18} className="text-muted" style={{ marginRight: '8px' }} />
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
                    />
                </div>

                {searchQuery.length >= 2 && (
                    <div className="glass-card" style={{ position: 'absolute', top: '50px', left: '0', width: '400px', zIndex: 1100, padding: '8px' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '8px' }}>Search Results</p>
                        {isSearching ? (
                            <p style={{ padding: '8px', fontSize: '0.85rem' }}>Searching...</p>
                        ) : searchResults.length > 0 ? searchResults.map(r => (
                            <div 
                                key={r.id} 
                                onClick={() => {
                                    setSearchQuery('');
                                    navigate(`/patients/${r.id}`);
                                }}
                                style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                                className="patient-row"
                            >
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>{r.first_name[0]}</div>
                                <span style={{ fontSize: '0.9rem' }}>{r.first_name} {r.last_name}</span>
                            </div>
                        )) : (
                            <p style={{ padding: '8px', fontSize: '0.85rem' }}>No patients found.</p>
                        )}
                    </div>
                )}
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
                            <h4 className="mb-4">Recent Alerts</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <NotificationItem title="Emergency Admission" time="Just now" desc="Critical patient assigned to Ward-A / Bed 102." />
                                <NotificationItem title="New Appointment" time="5m ago" desc="Patient John Doe scheduled an appointment." />
                                <NotificationItem title="Low Stock Alert" time="2h ago" desc="Paracetamol 500mg is running low (8 items left)." />
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
    const [isBotOpen, setIsBotOpen] = useState(false);

    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-wrapper">
                <Header />
                <main className="content-area">
                    <Outlet />
                </main>
            </div>

            {/* KiviBot Floating AI Assistant */}
            <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 2000 }}>
                {isBotOpen && (
                    <div className="glass-card animate-scale-in" style={{ 
                        width: '350px', 
                        height: '500px', 
                        marginBottom: '20px', 
                        display: 'flex', 
                        flexDirection: 'column',
                        padding: '0',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        border: '1px solid var(--accent-primary)'
                    }}>
                        <div style={{ background: 'var(--accent-primary)', padding: '16px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Sparkles size={18} />
                                <span style={{ fontWeight: 'bold' }}>KiviBot AI</span>
                            </div>
                            <button onClick={() => setIsBotOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                                <LogOut size={16} />
                            </button>
                        </div>
                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="bot-msg" style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px 12px 12px 0', fontSize: '0.85rem' }}>
                                Hello! I'm KiviBot, your HMS assistant. How can I help you navigate the system today?
                            </div>
                            <div className="bot-msg" style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px 12px 12px 0', fontSize: '0.85rem' }}>
                                You can ask me to "Find Dr. Smith" or "Show today's revenue report".
                            </div>
                        </div>
                        <div style={{ padding: '16px', borderTop: '1px solid var(--border-light)' }}>
                            <input 
                                type="text" 
                                placeholder="Type your query..." 
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '10px', color: '#fff' }}
                            />
                        </div>
                    </div>
                )}
                <button 
                    onClick={() => setIsBotOpen(!isBotOpen)}
                    style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '50%', 
                        background: 'var(--accent-primary)', 
                        color: '#fff', 
                        border: 'none', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        boxShadow: '0 10px 20px rgba(59, 130, 246, 0.4)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {isBotOpen ? <X size={24} /> : <MessageSquare size={24} />}
                </button>
            </div>
        </div>
    );
};
