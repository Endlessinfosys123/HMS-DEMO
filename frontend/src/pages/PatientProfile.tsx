import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
    ArrowLeft, 
    Calendar, 
    ClipboardList, 
    FileText, 
    CreditCard, 
    Activity, 
    Clock,
    Plus,
    Stethoscope
} from 'lucide-react';

export const PatientProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState<any>(null);
    const [consultations, setConsultations] = useState<any[]>([]);
    const [labOrders, setLabOrders] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('clinical');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchPatientData();
    }, [id]);

    const fetchPatientData = async () => {
        setLoading(true);
        const [patientRes, consultRes, labRes, invoiceRes] = await Promise.all([
            supabase.from('patients').select('*').eq('id', id).single(),
            supabase.from('consultations').select('*, profiles(first_name, last_name)').eq('patient_id', id).order('created_at', { ascending: false }),
            supabase.from('lab_orders').select('*, lab_tests(name)').eq('patient_id', id).order('created_at', { ascending: false }),
            supabase.from('invoices').select('*').eq('patient_id', id).order('created_at', { ascending: false })
        ]);

        if (!patientRes.error) setPatient(patientRes.data);
        if (!consultRes.error) setConsultations(consultRes.data || []);
        if (!labRes.error) setLabOrders(labRes.data || []);
        if (!invoiceRes.error) setInvoices(invoiceRes.data || []);
        setLoading(false);
    };

    if (loading) return <div style={{ padding: '40px', color: 'var(--text-muted)' }}>Loading clinical profile...</div>;
    if (!patient) return <div style={{ padding: '40px', color: 'var(--status-danger)' }}>Patient not found.</div>;

    return (
        <div className="animate-fade-in">
            <button 
                onClick={() => navigate(-1)} 
                className="btn btn-outline" 
                style={{ marginBottom: '1.5rem', padding: '8px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}
            >
                <ArrowLeft size={16} /> Back to Directory
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '24px' }}>
                {/* Profile Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card" style={{ textAlign: 'center', padding: '32px 24px' }}>
                        <div style={{ 
                            width: '96px', 
                            height: '96px', 
                            borderRadius: '50%', 
                            background: 'linear-gradient(45deg, var(--accent-primary), var(--accent-secondary))', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            margin: '0 auto 16px',
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            color: '#fff'
                        }}>
                            {patient.first_name[0]}{patient.last_name[0]}
                        </div>
                        <h2 style={{ marginBottom: '4px' }}>{patient.first_name} {patient.last_name}</h2>
                        <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Patient ID: #{patient.id.slice(0, 8).toUpperCase()}</p>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                            <Badge label={patient.gender} />
                            <Badge label={`Age: ${calculateAge(patient.date_of_birth)}`} />
                            {patient.blood_group && <Badge label={patient.blood_group} color="var(--status-danger)" />}
                        </div>

                        <div style={{ textAlign: 'left', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
                            <InfoRow icon={<Calendar size={14} />} label="DOB" value={patient.date_of_birth || 'N/A'} />
                            <InfoRow icon={<Clock size={14} />} label="Contact" value={patient.phone} />
                            <InfoRow icon={<FileText size={14} />} label="Address" value={patient.address || 'N/A'} />
                        </div>
                    </div>

                    <div className="glass-card" style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
                        <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={18} className="text-accent" /> Medical Status
                        </h4>
                        <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>No active alerts or allergies reported in the primary database.</p>
                    </div>
                </div>

                {/* Evolution Wall / Tabs */}
                <div>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'var(--bg-sidebar)', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
                        <TabButton active={activeTab === 'clinical'} onClick={() => setActiveTab('clinical')} icon={<Stethoscope size={16} />} label="Clinical History" />
                        <TabButton active={activeTab === 'lab'} onClick={() => setActiveTab('lab')} icon={<Activity size={16} />} label="Lab Results" />
                        <TabButton active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} icon={<CreditCard size={16} />} label="Billing" />
                    </div>

                    <div className="glass-card" style={{ minHeight: '600px' }}>
                        {activeTab === 'clinical' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0 }}>Consultation Timeline</h4>
                                    <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}><Plus size={14} /> New Record</button>
                                </div>
                                {consultations.length > 0 ? consultations.map((c) => (
                                    <div key={c.id} style={{ padding: '16px', border: '1px solid var(--border-light)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ padding: '6px', background: 'var(--bg-sidebar)', borderRadius: '6px' }}><Clock size={14} /></div>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{new Date(c.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)' }}>Dr. {c.profiles?.first_name} {c.profiles?.last_name}</span>
                                        </div>
                                        <div style={{ marginBottom: '8px' }}>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Diagnosis</p>
                                            <p style={{ fontWeight: '500' }}>{c.diagnosis}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Treatment Plan</p>
                                            <p style={{ fontSize: '0.85rem' }}>{c.notes}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <EmptyState label="No prior clinical consultations recorded." />
                                )}
                            </div>
                        )}

                        {activeTab === 'lab' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <h4>Diagnostic History</h4>
                                {labOrders.length > 0 ? labOrders.map((o) => (
                                    <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-light)' }}>
                                        <div>
                                            <p style={{ fontWeight: '600' }}>{o.lab_tests?.name}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ordered: {new Date(o.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ 
                                                padding: '4px 8px', 
                                                borderRadius: '6px', 
                                                fontSize: '0.7rem', 
                                                background: o.status === 'COMPLETED' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', 
                                                color: o.status === 'COMPLETED' ? 'var(--status-success)' : 'var(--status-warning)'
                                            }}>
                                                {o.status}
                                            </span>
                                            {o.result && <p style={{ fontSize: '0.8rem', marginTop: '4px', maxWidth: '200px' }}>{o.result}</p>}
                                        </div>
                                    </div>
                                )) : (
                                    <EmptyState label="No lab diagnostic records available." />
                                )}
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <h4>Financial Transactions</h4>
                                {invoices.length > 0 ? (
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                <th style={{ padding: '12px' }}>ID</th>
                                                <th style={{ padding: '12px' }}>AMOUNT</th>
                                                <th style={{ padding: '12px' }}>STATUS</th>
                                                <th style={{ padding: '12px' }}>DATE</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoices.map(inv => (
                                                <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                                    <td style={{ padding: '12px', fontSize: '0.85rem' }}>#{inv.id.slice(0,6)}</td>
                                                    <td style={{ padding: '12px', fontWeight: '600' }}>${inv.amount}</td>
                                                    <td style={{ padding: '12px' }}>
                                                        <span style={{ 
                                                            padding: '2px 6px', 
                                                            borderRadius: '4px', 
                                                            fontSize: '0.7rem', 
                                                            background: inv.status === 'PAID' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                                            color: inv.status === 'PAID' ? 'var(--status-success)' : 'var(--status-danger)'
                                                        }}>
                                                            {inv.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(inv.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <EmptyState label="No billing records found for this patient." />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Badge = ({ label, color = 'rgba(255,255,255,0.05)' }: any) => (
    <span style={{ padding: '4px 12px', borderRadius: '20px', background: color, border: '1px solid var(--border-light)', fontSize: '0.75rem' }}>
        {label}
    </span>
);

const InfoRow = ({ icon, label, value }: any) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ color: 'var(--text-muted)' }}>{icon}</div>
        <div style={{ minWidth: '80px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</div>
        <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>{value}</div>
    </div>
);

const TabButton = ({ active, onClick, icon, label }: any) => (
    <button 
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            border: 'none',
            background: active ? 'var(--accent-primary)' : 'transparent',
            color: active ? '#fff' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '0.85rem',
            fontWeight: active ? '600' : '400'
        }}
    >
        {icon} {label}
    </button>
);

const EmptyState = ({ label }: { label: string }) => (
    <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <ClipboardList size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
        <p>{label}</p>
    </div>
);

const calculateAge = (dob: string) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
};
