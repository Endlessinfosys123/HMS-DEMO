import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
    Users, 
    Calendar, 
    CreditCard, 
    Activity, 
    TrendingUp
} from 'lucide-react';

export const Dashboard = () => {
    const [stats, setStats] = useState({
        patients: 0,
        appointments: 0,
        revenue: 0,
        occupancy: 0
    });
    const [recentAdmissions, setRecentAdmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        const [patientsRes, apptsRes, revenueRes, bedsRes] = await Promise.all([
            supabase.from('patients').select('id', { count: 'exact' }),
            supabase.from('appointments').select('id', { count: 'exact' }).eq('status', 'SCHEDULED'),
            supabase.from('invoices').select('amount').eq('status', 'PAID'),
            supabase.from('beds').select('id, is_occupied')
        ]);

        const totalRevenue = revenueRes.data?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;
        const totalBeds = bedsRes.data?.length || 0;
        const occupiedBeds = bedsRes.data?.filter(b => b.is_occupied).length || 0;
        const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

        setStats({
            patients: patientsRes.count || 0,
            appointments: apptsRes.count || 0,
            revenue: totalRevenue,
            occupancy: occupancyRate
        });

        const { data: admissions } = await supabase
            .from('patients')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
        
        setRecentAdmissions(admissions || []);
        setLoading(false);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-3xl">System Overview</h1>
                <p className="text-muted">Real-time clinical and operational performance.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <StatCard 
                    title="Total Patients" 
                    value={stats.patients.toString()} 
                    icon={<Users size={24} />} 
                    trend="+12% this month"
                    color="var(--accent-primary)"
                />
                <StatCard 
                    title="Pending Visits" 
                    value={stats.appointments.toString()} 
                    icon={<Calendar size={24} />} 
                    trend="6 new today"
                    color="var(--status-warning)"
                />
                <StatCard 
                    title="Net Revenue" 
                    value={`$${stats.revenue.toLocaleString()}`} 
                    icon={<CreditCard size={24} />} 
                    trend="+5.4% vs last week"
                    color="var(--status-success)"
                />
                <StatCard 
                    title="Bed Occupancy" 
                    value={`${stats.occupancy}%`} 
                    icon={<Activity size={24} />} 
                    trend="Stable"
                    color="var(--status-info)"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: 0 }}>Recent Patient Registrations</h4>
                        <button className="btn btn-outline" style={{ fontSize: '0.8rem' }}>View All</button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {loading ? (
                            <p className="text-muted">Loading data...</p>
                        ) : recentAdmissions.length > 0 ? recentAdmissions.map((p) => (
                            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {p.first_name[0]}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{p.first_name} {p.last_name}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.phone}</p>
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(p.created_at).toLocaleDateString()}</span>
                            </div>
                        )) : (
                            <p className="text-muted">No recent registrations.</p>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(37,99,235,0.05) 100%)' }}>
                        <h4 className="mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-accent" /> Efficiency Goal</h4>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                                <span className="text-secondary">Monthly Target</span>
                                <span className="font-bold">82%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: '82%', height: '100%', background: 'var(--accent-primary)' }}></div>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>You are on track to exceed your patient throughput goal this month.</p>
                    </div>

                    <div className="glass-card">
                        <h4 className="mb-4">System Health</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <HealthItem label="Database" status="Optimal" />
                            <HealthItem label="Storage" status="92% Free" />
                            <HealthItem label="API Latency" status="24ms" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, trend, color }: any) => (
    <div className="glass-card" style={{ borderLeft: `4px solid ${color}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{title}</span>
            <div style={{ color: color }}>{icon}</div>
        </div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>{value}</h2>
        <span style={{ fontSize: '0.75rem', color: 'var(--status-success)' }}>{trend}</span>
    </div>
);

const HealthItem = ({ label, status }: any) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--status-success)' }}>{status}</span>
    </div>
);
