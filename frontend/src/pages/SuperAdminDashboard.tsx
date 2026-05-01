import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { 
    Users, 
    Building2, 
    CreditCard, 
    Activity, 
    Search, 
    Plus, 
    Trash2, 
    Zap, 
    Database, 
    Lock, 
    ArrowUpRight,
    TrendingUp,
    AlertCircle,
    Stethoscope,
    Pill,
    TestTube,
    BarChart3,
    Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Modal } from '../components/Modal';

export const SuperAdminDashboard = () => {
    const { profile } = useAuth();
    const [clinics, setClinics] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedClinicId, setSelectedClinicId] = useState<string | 'all'>('all');
    const [stats, setStats] = useState({
        totalClinics: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
        totalPatients: 0,
        totalDoctors: 0,
        serverLoad: 24,
        dbHealth: 99.8
    });
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newClinic, setNewClinic] = useState({
        name: '',
        contact_email: '',
        subscription_tier: 'FREE',
        subscription_status: 'ACTIVE'
    });

    useEffect(() => {
        fetchGlobalData();
    }, []);

    const fetchGlobalData = async () => {
        const { data: clinicsData } = await supabase
            .from('clinics')
            .select('*')
            .order('created_at', { ascending: false });

        const { count: patientsCount } = await supabase
            .from('patients')
            .select('*', { count: 'exact', head: true });

        const { count: doctorsCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .not('clinic_id', 'is', null);

        if (clinicsData) {
            setClinics(clinicsData);
            setStats(prev => ({
                ...prev,
                totalClinics: clinicsData.length,
                activeSubscriptions: clinicsData.filter(c => c.subscription_status === 'ACTIVE').length,
                totalRevenue: clinicsData.reduce((acc, c) => acc + (c.subscription_tier === 'PRO' ? 99 : c.subscription_tier === 'BASIC' ? 49 : 0), 0),
                totalPatients: patientsCount || 0,
                totalDoctors: doctorsCount || 0
            }));
        }
    };

    const handleCreateClinic = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const { error } = await supabase
            .from('clinics')
            .insert([newClinic]);
        
        if (!error) {
            setIsModalOpen(false);
            setNewClinic({ name: '', contact_email: '', subscription_tier: 'FREE', subscription_status: 'ACTIVE' });
            fetchGlobalData();
        } else {
            alert('Error creating clinic: ' + error.message);
        }
        setSubmitting(false);
    };

    const deleteClinic = async (id: string) => {
        if (!confirm('Are you sure you want to delete this clinic and ALL its data?')) return;
        const { error } = await supabase.from('clinics').delete().eq('id', id);
        if (!error) fetchGlobalData();
        else alert('Error deleting clinic: ' + error.message);
    };

    if (profile?.roles?.name !== 'SUPER_ADMIN') {
        return <div className="p-8 text-center">Unauthorized</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in bg-grid min-h-screen p-2">
            {/* HUD Header */}
            <header className="flex justify-between items-start">
                <div className="animate-slide-up">
                    <div className="flex items-center gap-2 mb-1">
                        <Zap size={18} className="text-blue-400" />
                        <span className="text-xs font-bold text-blue-400/70 tracking-[0.2em] uppercase">The Nexus Command</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Global Infrastructure</h1>
                    <p className="text-white/40 mt-1">SaaS Level-0 Administrative Access Granted.</p>
                </div>

                <div className="flex gap-4">
                    <div className="glass-card flex items-center gap-4 px-4 py-2 border-blue-500/20">
                        <span className="text-[10px] font-bold text-white/40 uppercase">Focus:</span>
                        <select 
                            className="bg-transparent border-none text-xs font-bold text-blue-400 focus:outline-none cursor-pointer"
                            value={selectedClinicId}
                            onChange={(e) => setSelectedClinicId(e.target.value)}
                        >
                            <option value="all">GLOBAL NEXUS</option>
                            {clinics.map(c => (
                                <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] px-6"
                    >
                        <Plus size={20} /> Register New Clinic
                    </button>
                </div>
            </header>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard 
                    label="Active Ecosystems" 
                    value={stats.totalClinics} 
                    subValue={`${stats.activeSubscriptions} Active Subs`} 
                    icon={<Building2 className="text-blue-400" />}
                    trend="+2 new today"
                />
                <MetricCard 
                    label="Global Patient Network" 
                    value={stats.totalPatients} 
                    subValue="Across all nodes" 
                    icon={<Users className="text-purple-400" />}
                    trend="1.2k new entries"
                />
                <MetricCard 
                    label="Global Medical Staff" 
                    value={stats.totalDoctors} 
                    subValue="Doctors & Specialists" 
                    icon={<Activity className="text-blue-500" />}
                    trend="+5 new onboarded"
                />
                <MetricCard 
                    label="MRR (Global Revenue)" 
                    value={`$${stats.totalRevenue.toLocaleString()}`} 
                    subValue="Estimated Monthly" 
                    icon={<CreditCard className="text-green-400" />}
                    trend="+8.4% growth"
                />
            </div>

            {/* Global Launch Pad */}
            <div className="glass-card border-blue-500/10 p-4">
                <div className="flex items-center gap-2 mb-4 px-2">
                    <Zap size={14} className="text-blue-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Global Module Control</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    <ModuleShortcut label="Patients" icon={<Users size={20} />} to="/patients" color="text-blue-400" />
                    <ModuleShortcut label="Doctors" icon={<Stethoscope size={20} />} to="/doctors" color="text-purple-400" />
                    <ModuleShortcut label="Pharmacy" icon={<Pill size={20} />} to="/pharmacy" color="text-green-400" />
                    <ModuleShortcut label="Laboratory" icon={<TestTube size={20} />} to="/lab" color="text-yellow-400" />
                    <ModuleShortcut label="Admissions" icon={<Activity size={20} />} to="/inpatients" color="text-red-400" />
                    <ModuleShortcut label="Billing" icon={<CreditCard size={20} />} to="/billing" color="text-emerald-400" />
                    <ModuleShortcut label="Staff" icon={<Shield size={20} />} to="/staff" color="text-orange-400" />
                    <ModuleShortcut label="Reports" icon={<BarChart3 size={20} />} to="/reports" color="text-indigo-400" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Control Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-0 overflow-hidden border-white/5">
                        <div className="flex border-b border-white/10">
                            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Clinics Hub" icon={<Building2 size={16} />} />
                            <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} label="Global User Directory" icon={<Users size={16} />} />
                            <TabButton active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} label="Finance Monitor" icon={<TrendingUp size={16} />} />
                        </div>

                        <div className="p-6">
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold">Node Management</h3>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                            <input placeholder="Search clinics..." className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-blue-500/50 outline-none" />
                                        </div>
                                    </div>
                                    
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-left text-xs font-bold text-white/30 uppercase tracking-widest border-b border-white/5">
                                                    <th className="pb-4 px-2">Clinic Instance</th>
                                                    <th className="pb-4 px-2">License</th>
                                                    <th className="pb-4 px-2">Protocol Status</th>
                                                    <th className="pb-4 px-2">Sync Date</th>
                                                    <th className="pb-4 px-2 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {clinics.map(c => (
                                                    <tr key={c.id} className="group hover:bg-blue-500/5 transition-all">
                                                        <td className="py-4 px-2">
                                                            <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{c.name}</div>
                                                            <div className="text-xs text-white/30">{c.contact_email}</div>
                                                        </td>
                                                        <td className="py-4 px-2">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                                c.subscription_tier === 'PRO' ? 'bg-purple-500/20 text-purple-400' :
                                                                c.subscription_tier === 'BASIC' ? 'bg-blue-500/20 text-blue-400' :
                                                                'bg-gray-500/20 text-gray-400'
                                                            }`}>
                                                                {c.subscription_tier}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${c.subscription_status === 'ACTIVE' ? 'bg-green-400' : 'bg-red-400'}`} />
                                                                <span className="text-xs font-medium uppercase tracking-tighter">{c.subscription_status}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-2 text-xs text-white/40">
                                                            {new Date(c.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className="py-4 px-2 text-right">
                                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button className="text-blue-400 hover:text-blue-300"><ArrowUpRight size={18} /></button>
                                                                <button onClick={() => deleteClinic(c.id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'users' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold">Global User Base</h3>
                                        <Link to="/staff" className="text-xs font-bold text-blue-400 hover:underline">Manage All Permissions →</Link>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="glass-card p-4 border-white/5 bg-white/[0.01]">
                                            <p className="text-[10px] font-bold text-white/30 uppercase mb-4">Role Distribution</p>
                                            <div className="space-y-3">
                                                <RoleProgress label="Doctors" count={stats.totalDoctors} total={stats.totalDoctors + 10} color="bg-blue-500" />
                                                <RoleProgress label="Admins" count={12} total={stats.totalDoctors + 10} color="bg-purple-500" />
                                                <RoleProgress label="Reception" count={25} total={stats.totalDoctors + 10} color="bg-green-500" />
                                            </div>
                                        </div>
                                        <div className="glass-card p-4 border-white/5 bg-white/[0.01]">
                                            <p className="text-[10px] font-bold text-white/30 uppercase mb-4">Security Overview</p>
                                            <div className="flex flex-col gap-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-white/60">Global MFA Adoption</span>
                                                    <span className="text-xs font-bold text-green-400">84%</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-white/60">Password Rotations (24h)</span>
                                                    <span className="text-xs font-bold text-blue-400">12</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-white/60">Blocked Intrusions</span>
                                                    <span className="text-xs font-bold text-red-400">0</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'finance' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold">Revenue Trajectory</h3>
                                    <div className="h-[200px] flex items-end gap-2 px-4 border-b border-l border-white/10 pt-8">
                                        {[40, 55, 45, 60, 75, 90, 85, 100].map((h, i) => (
                                            <div key={i} className="flex-1 bg-gradient-to-t from-blue-600/20 to-blue-500/60 rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    ${(h * 120).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest px-4">
                                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Intelligence */}
                <div className="space-y-6">
                    {/* Live Action Feed */}
                    <div className="glass-card border-blue-500/10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400">Live Action Feed</h3>
                            <div className="flex gap-1">
                                <div className="w-1 h-1 rounded-full bg-blue-400 animate-ping" />
                                <div className="w-1 h-1 rounded-full bg-blue-400" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <FeedItem icon={<Zap size={12} />} color="text-yellow-400" label="New Clinic Joined" time="2m ago" detail="City Life Care just onboarded." />
                            <FeedItem icon={<AlertCircle size={12} />} color="text-red-400" label="Critical Error" time="15m ago" detail="Failed API call from Node: DW-02" />
                            <FeedItem icon={<Users size={12} />} color="text-blue-400" label="Registration" time="1h ago" detail="50 new patients registered globally." />
                            <FeedItem icon={<TrendingUp size={12} />} color="text-green-400" label="Revenue Event" time="2h ago" detail="Upgrade: MedStar (FREE -> PRO)" />
                        </div>
                        <button className="w-full mt-6 py-2 text-xs font-bold text-white/20 hover:text-blue-400 transition-colors uppercase tracking-widest border-t border-white/5 pt-4">View All Logs</button>
                    </div>

                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <QuickTool label="System Backup" icon={<Database size={18} />} />
                        <QuickTool label="Global Notice" icon={<Zap size={18} />} />
                        <QuickTool label="Sync Nodes" icon={<Activity size={18} />} />
                        <QuickTool label="Security Audit" icon={<Lock size={18} />} />
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Clinic Instance" size="md">
                <form onSubmit={handleCreateClinic} className="space-y-4">
                    <div className="form-group">
                        <label className="form-label">Instance Name</label>
                        <input className="form-input" required value={newClinic.name} onChange={e => setNewClinic({...newClinic, name: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Admin Control Email</label>
                        <input className="form-input" type="email" required value={newClinic.contact_email} onChange={e => setNewClinic({...newClinic, contact_email: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Tier Assignment</label>
                            <select className="form-input" value={newClinic.subscription_tier} onChange={e => setNewClinic({...newClinic, subscription_tier: e.target.value})}>
                                <option value="FREE">FREE (Limited)</option>
                                <option value="BASIC">BASIC (Standard)</option>
                                <option value="PRO">PRO (Enterprise)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Initial Status</label>
                            <select className="form-input" value={newClinic.subscription_status} onChange={e => setNewClinic({...newClinic, subscription_status: e.target.value})}>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="PENDING">PROVISIONING</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex-end pt-4">
                        <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Abort</button>
                        <button type="submit" className="btn btn-primary bg-blue-600" disabled={submitting}>Deploy Instance</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

const MetricCard = ({ label, value, subValue, icon, trend }: any) => (
    <div className="glass-card relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            {icon}
        </div>
        <div className="relative z-10">
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">{label}</p>
            <div className="text-3xl font-black text-white mb-1">{value}</div>
            <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/40">{subValue}</span>
                <span className="text-[10px] font-bold text-green-400 flex items-center gap-1">
                    <ArrowUpRight size={10} /> {trend}
                </span>
            </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </div>
);

const FeedItem = ({ icon, color, label, time, detail }: any) => (
    <div className="flex gap-3 group">
        <div className={`mt-1 p-2 rounded-md bg-white/5 ${color} group-hover:bg-white/10 transition-colors`}>
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-0.5">
                <span className="text-xs font-bold text-white/80">{label}</span>
                <span className="text-[9px] text-white/20">{time}</span>
            </div>
            <p className="text-[10px] text-white/40 truncate">{detail}</p>
        </div>
    </div>
);

const RoleProgress = ({ label, count, total, color }: any) => (
    <div className="space-y-1">
        <div className="flex justify-between text-[9px] font-bold uppercase tracking-tighter">
            <span className="text-white/60">{label}</span>
            <span className="text-white/80">{count} Units</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full ${color}`} style={{ width: `${(count/total)*100}%` }} />
        </div>
    </div>
);

const TabButton = ({ active, onClick, label, icon }: any) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition-all border-b-2 ${
            active 
            ? 'text-blue-400 border-blue-400 bg-blue-400/5' 
            : 'text-white/30 border-transparent hover:text-white/60 hover:bg-white/5'
        }`}
    >
        {icon} {label}
    </button>
);

const ModuleShortcut = ({ label, icon, to, color }: any) => (
    <Link to={to} className="glass-card p-4 flex flex-col items-center gap-2 group hover:border-blue-500/30 transition-all text-center no-underline">
        <div className={`p-2 rounded-lg bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{label}</span>
    </Link>
);

const QuickTool = ({ label, icon }: any) => (
    <button className="glass-card p-4 flex flex-col items-center gap-2 group hover:bg-blue-600/10 hover:border-blue-500/40 transition-all text-center">
        <div className="p-2 rounded-lg bg-white/5 text-white/40 group-hover:text-blue-400 transition-colors">
            {icon}
        </div>
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white/80">{label}</span>
    </button>
);
