import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Users, Building2, CreditCard, Activity, Search, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { Modal } from '../components/Modal';

export const SuperAdminDashboard = () => {
    const { profile } = useAuth();
    const [clinics, setClinics] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalClinics: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
        pendingApprovals: 0
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
         fetchClinics();
     }, []);
 
     const fetchClinics = async () => {
         const { data, error } = await supabase
            .from('clinics')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setClinics(data);
            setStats({
                totalClinics: data.length,
                activeSubscriptions: data.filter(c => c.subscription_status === 'ACTIVE').length,
                totalRevenue: data.reduce((acc, c) => acc + (c.subscription_tier === 'PRO' ? 99 : c.subscription_tier === 'BASIC' ? 49 : 0), 0),
                pendingApprovals: data.filter(c => c.subscription_status === 'PENDING').length
             });
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
             fetchClinics();
         } else {
             alert('Error creating clinic: ' + error.message);
         }
         setSubmitting(false);
     };

     const deleteClinic = async (id: string) => {
         if (!confirm('Are you sure you want to delete this clinic and ALL its data?')) return;
         const { error } = await supabase.from('clinics').delete().eq('id', id);
         if (!error) fetchClinics();
         else alert('Error deleting clinic: ' + error.message);
     };

    if (profile?.roles?.name !== 'SUPER_ADMIN') {
        return (
            <div className="flex items-center justify-center h-screen text-white">
                <div className="text-center p-8 glass-card">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
                    <p>Only Super Administrators can access this dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">SaaS Command Center</h1>
                    <p className="text-blue-200/70">Manage global clinics, subscriptions, and platform growth.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20"
                >
                    <Plus size={20} />
                    <span>Create Manual Clinic</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Clinics" 
                    value={stats.totalClinics} 
                    icon={<Building2 className="text-blue-400" />} 
                    trend="+12% this month"
                />
                <StatCard 
                    title="Active Subscriptions" 
                    value={stats.activeSubscriptions} 
                    icon={<Activity className="text-green-400" />} 
                    trend="94% retention"
                />
                <StatCard 
                    title="Est. Monthly Revenue" 
                    value={`$${stats.totalRevenue}`} 
                    icon={<CreditCard className="text-purple-400" />} 
                    trend="+8% growth"
                />
                <StatCard 
                    title="Pending Support" 
                    value={stats.pendingApprovals} 
                    icon={<Users className="text-orange-400" />} 
                    trend="Requires action"
                />
            </div>

            <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-white">Registered Clinics</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search clinics..." 
                            className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-white/60 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Clinic Name</th>
                                <th className="px-6 py-4 font-medium">Tier</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Created At</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {clinics.map((clinic) => (
                                <tr key={clinic.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{clinic.name}</div>
                                        <div className="text-sm text-white/40">{clinic.contact_email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            clinic.subscription_tier === 'PRO' ? 'bg-purple-500/20 text-purple-400' :
                                            clinic.subscription_tier === 'BASIC' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {clinic.subscription_tier}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-1.5 ${
                                            clinic.subscription_status === 'ACTIVE' ? 'text-green-400' : 'text-yellow-400'
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full ${
                                                clinic.subscription_status === 'ACTIVE' ? 'bg-green-400' : 'bg-yellow-400'
                                            }`} />
                                            {clinic.subscription_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-white/60">
                                        {new Date(clinic.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => deleteClinic(clinic.id)}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {clinics.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-white/40 italic">
                                        No clinics registered yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Clinic (Manual)" size="md">
                <form onSubmit={handleCreateClinic} className="space-y-4">
                    <div className="form-group">
                        <label className="form-label">Clinic Name</label>
                        <input 
                            className="form-input" 
                            required 
                            value={newClinic.name}
                            onChange={e => setNewClinic({...newClinic, name: e.target.value})}
                            placeholder="e.g. LifeCare Hospital"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Primary Contact Email</label>
                        <input 
                            className="form-input" 
                            type="email" 
                            required 
                            value={newClinic.contact_email}
                            onChange={e => setNewClinic({...newClinic, contact_email: e.target.value})}
                            placeholder="admin@lifecare.com"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Subscription Tier</label>
                            <select 
                                className="form-input"
                                value={newClinic.subscription_tier}
                                onChange={e => setNewClinic({...newClinic, subscription_tier: e.target.value})}
                            >
                                <option value="FREE">FREE</option>
                                <option value="BASIC">BASIC</option>
                                <option value="PRO">PRO</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select 
                                className="form-input"
                                value={newClinic.subscription_status}
                                onChange={e => setNewClinic({...newClinic, subscription_status: e.target.value})}
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="PENDING">PENDING</option>
                                <option value="SUSPENDED">SUSPENDED</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 mb-6">
                        <p className="text-xs text-blue-200/70 flex items-center gap-2">
                            <ShieldCheck size={14} /> Note: Manual creation skips the public onboarding flow. You will need to manually invite the admin user afterwards.
                        </p>
                    </div>
                    <div className="flex-end">
                        <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Creating...' : 'Register Clinic'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

const StatCard = ({ title, value, icon, trend }: { title: string, value: any, icon: React.ReactNode, trend: string }) => (
    <div className="glass-card p-6 border-l-4 border-blue-500/50">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/5 rounded-lg">
                {icon}
            </div>
            <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded">
                {trend}
            </span>
        </div>
        <h4 className="text-white/60 text-sm font-medium">{title}</h4>
        <div className="text-3xl font-bold text-white mt-1">{value}</div>
    </div>
);
