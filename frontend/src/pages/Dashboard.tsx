import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Calendar, Activity, TrendingUp } from 'lucide-react';

export const Dashboard = () => {
    const [stats, setStats] = useState({
        patients: 0,
        appointments: 0,
        beds: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            // In a real scenario, we'd use Supabase real-time or count queries
            // For now, let's just use mock-up numbers fetching from tables
            const { count: pCount } = await supabase.from('patients').select('*', { count: 'exact', head: true });
            const { count: aCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true });
            const { count: bCount } = await supabase.from('beds').select('*', { count: 'exact', head: true });

            setStats({
                patients: pCount || 0,
                appointments: aCount || 0,
                beds: bCount || 0
            });
        };
        fetchStats();
    }, []);

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-3xl">Hospital Analytics</h1>
                <p className="text-muted">Real-time overview from Supabase Cloud.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <StatCard icon={<Users size={24} />} label="Total Patients" value={stats.patients} color="#3b82f6" />
                <StatCard icon={<Calendar size={24} />} label="Today's Appointments" value={stats.appointments} color="#10b981" />
                <StatCard icon={<Activity size={24} />} label="Available Beds" value={stats.beds} color="#0ea5e9" />
            </div>

            <div className="glass-card">
                <h3 className="mb-4 flex items-center gap-2"><TrendingUp size={20} /> Patient Flow</h3>
                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-light)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                    [Chart Placeholder from Supabase]
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) => (
    <div className="glass-card" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ padding: '16px', background: `rgba(${color}, 0.1)`, borderRadius: '14px', color: color }}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{value}</h2>
        </div>
    </div>
);
