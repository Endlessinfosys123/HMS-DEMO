import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Users, Building2, CreditCard, Activity, Search, Plus } from 'lucide-react';

export const SuperAdminDashboard = () => {
    const { profile } = useAuth();
    const [clinics, setClinics] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalClinics: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
        pendingApprovals: 0
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
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20">
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
                                        <button className="text-blue-400 hover:text-blue-300 font-medium text-sm">Manage</button>
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
