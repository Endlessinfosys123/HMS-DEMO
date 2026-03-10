
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Calendar,
    FileText,
    Pill,
    CreditCard,
    TestTube,
    Settings,
    LogOut,
    Bell
} from 'lucide-react';

const Sidebar = () => {
    // TODO: Get from auth context

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                HealthCore HMS
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard className="nav-icon" /> Dashboard
                </NavLink>
                <NavLink to="/patients" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Users className="nav-icon" /> Patients
                </NavLink>
                <NavLink to="/appointments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Calendar className="nav-icon" /> Appointments
                </NavLink>
                <NavLink to="/consultations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <FileText className="nav-icon" /> Consultations
                </NavLink>
                <NavLink to="/pharmacy" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Pill className="nav-icon" /> Pharmacy
                </NavLink>
                <NavLink to="/lab" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <TestTube className="nav-icon" /> Laboratory
                </NavLink>
                <NavLink to="/billing" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <CreditCard className="nav-icon" /> Billing
                </NavLink>
                <div style={{ flex: 1 }} />
                <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Settings className="nav-icon" /> Settings
                </NavLink>
            </nav>
        </aside>
    );
};

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // TODO: implement logout
        navigate('/login');
    };

    return (
        <header className="top-header">
            <div className="header-search">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Search patients, invoices, etc..." />
            </div>
            <div className="header-profile">
                <button className="btn btn-outline" style={{ padding: '8px', border: 'none' }}>
                    <Bell size={20} />
                </button>
                <div className="profile-avatar" title="Admin User">
                    A
                </div>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </header>
    );
};

export const Layout = () => {
    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-wrapper">
                <Header />
                <main className="content-area animate-fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
