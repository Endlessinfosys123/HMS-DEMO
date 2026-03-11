import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    Activity, 
    Download,
    FileText,
    Calendar,
    ChevronRight,
    Search,
    CreditCard
} from 'lucide-react';

export const Reports = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        patientGrowth: 0,
        bedOccupancy: 0,
        labTests: 0
    });

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        setLoading(true);
        // Mock data fetching for reports summary
        const [revenueRes, patientsRes, bedsRes, labsRes] = await Promise.all([
            supabase.from('invoices').select('amount').eq('status', 'PAID'),
            supabase.from('patients').select('id', { count: 'exact' }),
            supabase.from('beds').select('id, is_occupied'),
            supabase.from('lab_orders').select('id', { count: 'exact' })
        ]);

        const rev = revenueRes.data?.reduce((sum, i) => sum + Number(i.amount), 0) || 0;
        const totalBeds = bedsRes.data?.length || 0;
        const occ = bedsRes.data?.filter(b => b.is_occupied).length || 0;

        setStats({
            totalRevenue: rev,
            patientGrowth: patientsRes.count || 0,
            bedOccupancy: totalBeds > 0 ? Math.round((occ / totalBeds) * 100) : 0,
            labTests: labsRes.count || 0
        });
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Analytics & Reports</h1>
                    <p className="text-muted">Hospital operational and clinical status overview.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-outline"><Calendar size={18} /> Last 30 Days</button>
                    <button className="btn btn-primary"><Download size={18} /> Export Data</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <ReportStatCard title="Financial Growth" value={`$${stats.totalRevenue.toLocaleString()}`} icon={<TrendingUp size={20} />} change="+12.4%" color="var(--status-success)" />
                <ReportStatCard title="Patient Intake" value={stats.patientGrowth.toString()} icon={<Users size={20} />} change="+5" color="var(--accent-primary)" />
                <ReportStatCard title="Bed Utilization" value={`${stats.bedOccupancy}%`} icon={<Activity size={20} />} change="-2%" color="var(--status-warning)" />
                <ReportStatCard title="Lab Efficiency" value={stats.labTests.toString()} icon={<BarChart3 size={20} />} change="+24.2%" color="var(--status-info)" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                {/* Advanced Reports Selection */}
                <div className="glass-card">
                    <h4 className="mb-6">Generate Detailed Report</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <ReportOption icon={<CreditCard size={18} />} title="Revenue & Tax Report" desc="Detailed breakdown of all income, grouped by department and date range." />
                        <ReportOption icon={<Users size={18} />} title="Patient Demographic Analysis" desc="Understand your patient base by age, gender, and geographical region." />
                        <ReportOption icon={<Activity size={18} />} title="Clinical Outcome Summary" desc="Success rates of treatments and patient discharge statuses." />
                        <ReportOption icon={<FileText size={18} />} title="Inventory Asset Review" desc="Current stock valuation and medication expiration alerts." />
                    </div>
                </div>

                {/* Searchable Records List */}
                <div className="glass-card">
                    <h4 className="mb-4">Internal Search</h4>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 16px', marginBottom: '20px' }}>
                        <Search size={18} className="text-muted" style={{ marginRight: '8px' }} />
                        <input
                            type="text"
                            placeholder="Find specific transaction..."
                            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
                        />
                    </div>
                    <div className="text-muted text-sm" style={{ textAlign: 'center', padding: '40px' }}>
                        <BarChart3 size={40} style={{ opacity: 0.1, margin: '0 auto 12px' }} />
                        Enter parameters to generate a live data visualization.
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReportStatCard = ({ title, value, icon, change, color }: any) => (
    <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ color: color }}>{icon}</div>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: change.startsWith('+') ? 'var(--status-success)' : 'var(--status-danger)' }}>{change}</span>
        </div>
        <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '4px' }}>{title}</p>
        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{value}</h3>
    </div>
);

const ReportOption = ({ icon, title, desc }: any) => (
    <div className="report-option" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px', 
        padding: '16px', 
        borderRadius: '12px', 
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border-light)',
        cursor: 'pointer',
        transition: 'all 0.2s'
    }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
            {icon}
        </div>
        <div style={{ flex: 1 }}>
            <h5 style={{ margin: '0 0 2px' }}>{title}</h5>
            <p className="text-muted" style={{ fontSize: '0.75rem', margin: 0 }}>{desc}</p>
        </div>
        <ChevronRight size={18} className="text-muted" />
    </div>
);
