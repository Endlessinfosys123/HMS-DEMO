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
    CreditCard
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const Reports = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        patientGrowth: 0,
        bedOccupancy: 0,
        labTests: 0,
        genderDist: { male: 0, female: 0, other: 0 }
    });
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {
        setLoading(true);
        const [revenueRes, patientsRes, bedsRes, labsRes] = await Promise.all([
            supabase.from('invoices').select('amount').eq('status', 'PAID'),
            supabase.from('patients').select('id, gender'),
            supabase.from('beds').select('id, is_occupied'),
            supabase.from('lab_orders').select('id', { count: 'exact' })
        ]);

        const rev = revenueRes.data?.reduce((sum, i) => sum + Number(i.amount), 0) || 0;
        const totalBeds = bedsRes.data?.length || 0;
        const occ = bedsRes.data?.filter(b => b.is_occupied).length || 0;
        
        const patients = patientsRes.data || [];
        const genderDist = patients.reduce((acc: any, p: any) => {
            const g = (p.gender || 'Other').toLowerCase();
            if (g === 'male') acc.male++;
            else if (g === 'female') acc.female++;
            else acc.other++;
            return acc;
        }, { male: 0, female: 0, other: 0 });

        setStats({
            totalRevenue: rev,
            patientGrowth: patients.length,
            bedOccupancy: totalBeds > 0 ? Math.round((occ / totalBeds) * 100) : 0,
            labTests: labsRes.count || 0,
            genderDist
        });
        setLoading(false);
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
                    <button className="btn btn-primary" disabled={loading} onClick={() => fetchReportData()}><Download size={18} /> {loading ? 'Syncing...' : 'Export Data'}</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <ReportStatCard title="Financial Growth" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={<TrendingUp size={20} />} change="+12.4%" color="var(--status-success)" />
                <ReportStatCard title="Patient Intake" value={stats.patientGrowth.toString()} icon={<Users size={20} />} change="+5" color="var(--accent-primary)" />
                <ReportStatCard title="Bed Utilization" value={`${stats.bedOccupancy}%`} icon={<Activity size={20} />} change="-2%" color="var(--status-warning)" />
                <ReportStatCard title="Lab Efficiency" value={stats.labTests.toString()} icon={<BarChart3 size={20} />} change="+24.2%" color="var(--status-info)" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                {/* Advanced Reports Selection */}
                <div className="glass-card">
                    <h4 className="mb-6">Generate Detailed Report</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <ReportOption 
                            icon={<CreditCard size={18} />} 
                            title="Revenue & Tax Report" 
                            desc="Detailed breakdown of all income." 
                            onClick={() => { setSelectedReport('REVENUE'); setIsModalOpen(true); }}
                        />
                        <ReportOption 
                            icon={<Users size={18} />} 
                            title="Patient Demographic Analysis" 
                            desc="Understand your patient base by gender." 
                            onClick={() => { setSelectedReport('DEMO'); setIsModalOpen(true); }}
                        />
                        <ReportOption icon={<Activity size={18} />} title="Clinical Outcome Summary" desc="Success rates of treatments." />
                        <ReportOption icon={<FileText size={18} />} title="Inventory Asset Review" desc="Current stock valuation." />
                    </div>
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedReport === 'REVENUE' ? 'Revenue Report' : 'Demographic Analysis'}>
                    {selectedReport === 'REVENUE' ? (
                        <div className="animate-fade-in">
                            <h3 style={{ marginBottom: '1rem', color: 'var(--status-success)' }}>Total Realized: ₹{stats.totalRevenue.toLocaleString()}</h3>
                            <p className="text-muted">This report considers all invoices marked as PAID.</p>
                            <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span>Grosse Income</span>
                                    <span>₹{stats.totalRevenue.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--status-danger)' }}>
                                    <span>Estimated Tax (18%)</span>
                                    <span>₹{(stats.totalRevenue * 0.18).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <h4 style={{ marginBottom: '1.5rem' }}>Gender Distribution</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <GenderStat label="Male" count={stats.genderDist.male} total={stats.patientGrowth} color="var(--accent-primary)" />
                                <GenderStat label="Female" count={stats.genderDist.female} total={stats.patientGrowth} color="#ec4899" />
                                <GenderStat label="Other" count={stats.genderDist.other} total={stats.patientGrowth} color="var(--text-muted)" />
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Searchable Records List */}
                <div className="glass-card">
                    <h4 className="mb-4">Live Patient Inflow</h4>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '20px 0' }}>
                        {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60, 75, 55].map((h, i) => (
                            <div key={i} style={{ flex: 1, background: 'linear-gradient(to top, var(--accent-primary), var(--accent-secondary))', height: `${h}%`, borderRadius: '4px', opacity: 0.8 }}></div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                        <span>Jan</span>
                        <span>Jun</span>
                        <span>Dec</span>
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ marginTop: '24px' }}>
                <h4 className="mb-6">Operational Efficiency Index</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px' }}>
                    <EfficiencyMeter label="Avg Wait Time" value="12m" percentage={20} color="var(--status-success)" />
                    <EfficiencyMeter label="Discharge Rate" value="94%" percentage={94} color="var(--accent-primary)" />
                    <EfficiencyMeter label="Bed Turnover" value="2.4d" percentage={60} color="var(--status-info)" />
                </div>
            </div>
        </div>
    );
};

const EfficiencyMeter = ({ label, value, percentage, color }: any) => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{label}</span>
            <span style={{ fontWeight: 'bold' }}>{value}</span>
        </div>
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: '3px' }}></div>
        </div>
    </div>
);

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

const GenderStat = ({ label, count, total, color }: any) => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span>{label}</span>
                <span style={{ fontWeight: 'bold' }}>{count} ({pct}%)</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: color }}></div>
            </div>
        </div>
    );
};

const ReportOption = ({ icon, title, desc, onClick }: any) => (
    <div className="report-option" onClick={onClick} style={{ 
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
