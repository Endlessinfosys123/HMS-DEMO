import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
    ArrowLeft, 
    Calendar, 
    Clock, 
    Award, 
    Users, 
    Activity,
    Plus,
    CheckCircle
} from 'lucide-react';

export const DoctorProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState<any>(null);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [patientCount, setPatientCount] = useState(0);
    const [activeTab, setActiveTab] = useState('schedule');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchDoctorData();
    }, [id]);

    const fetchDoctorData = async () => {
        setLoading(true);
        const [docRes, appRes, patientsRes] = await Promise.all([
            supabase.from('profiles').select('*, roles(name)').eq('id', id).single(),
            supabase.from('appointments').select('*, patients(first_name, last_name)').eq('doctor_id', id).order('appointment_date', { ascending: true }),
            supabase.from('consultations').select('patient_id', { count: 'exact', head: true }).eq('doctor_id', id)
        ]);

        if (!docRes.error) setDoctor(docRes.data);
        if (!appRes.error) setAppointments(appRes.data || []);
        if (!patientsRes.error) setPatientCount(patientsRes.count || 0);
        setLoading(false);
    };

    if (loading) return <div style={{ padding: '40px', color: 'var(--text-muted)' }}>Loading doctor profile...</div>;
    if (!doctor) return <div style={{ padding: '40px', color: 'var(--status-danger)' }}>Doctor profile not found.</div>;

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
                {/* Professional Info Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card" style={{ textAlign: 'center', padding: '32px 24px' }}>
                        <div style={{ 
                            width: '96px', 
                            height: '96px', 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, #FF3D77, #733FF1)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            margin: '0 auto 16px',
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            color: '#fff'
                        }}>
                            {doctor.first_name[0]}{doctor.last_name[0]}
                        </div>
                        <h2 style={{ marginBottom: '4px' }}>Dr. {doctor.first_name} {doctor.last_name}</h2>
                        <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>{doctor.specialization || 'General Physician'}</p>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
                            <Badge label="Available" color="rgba(16,185,129,0.1)" textColor="var(--status-success)" />
                            <Badge label="8+ Years Exp" />
                        </div>

                        <div style={{ textAlign: 'left', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
                            <InfoRow icon={<Award size={14} />} label="HOD" value="Clinical Ops" />
                            <InfoRow icon={<Clock size={14} />} label="Mon-Fri" value="09:00 - 17:00" />
                            <InfoRow icon={<Users size={14} />} label="Total Treated" value={patientCount.toString()} />
                        </div>
                    </div>

                    <div className="glass-card" style={{ background: 'rgba(115, 63, 241, 0.05)' }}>
                        <h4 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={18} className="text-accent" style={{ color: '#733FF1' }} /> Professional Bio
                        </h4>
                        <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                            Senior Specialist with extensive experience in clinical management and patient care pathways. Lead coordinator for the department's digital health initiative.
                        </p>
                    </div>

                    <div className="glass-card" style={{ padding: '20px' }}>
                        <h4 className="mb-4">Medical Credentials</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <Award size={16} className="text-accent" />
                                <span style={{ fontSize: '0.8rem' }}>MD - Internal Medicine</span>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <CheckCircle size={16} className="text-success" />
                                <span style={{ fontSize: '0.8rem' }}>Board Certified (IMA)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Schedule & History Tabs */}
                <div>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'var(--bg-sidebar)', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
                        <TabButton active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} icon={<Calendar size={16} />} label="Clinic Schedule" />
                        <TabButton active={activeTab === 'patients'} onClick={() => setActiveTab('patients')} icon={<Users size={16} />} label="Patient History" />
                        <TabButton active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} icon={<Activity size={16} />} label="Performance" />
                    </div>

                    <div className="glass-card" style={{ minHeight: '550px' }}>
                        {activeTab === 'schedule' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0 }}>Upcoming Appointments</h4>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Today</button>
                                        <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 12px' }}><Plus size={14} /> Add Booking</button>
                                    </div>
                                </div>
                                {appointments.length > 0 ? appointments.map((app) => (
                                    <div key={app.id} style={{ 
                                        padding: '16px', 
                                        borderRadius: '12px', 
                                        background: 'rgba(255,255,255,0.02)', 
                                        border: '1px solid var(--border-light)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }} className="doctor-card">
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                                                {app.patients?.first_name[0]}{app.patients?.last_name[0]}
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: '600' }}>{app.patients?.first_name} {app.patients?.last_name}</p>
                                                <div style={{ display: 'flex', gap: '12px' }}>
                                                    <p className="text-muted" style={{ margin: 0, fontSize: '0.75rem' }}>{new Date(app.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    <p className="text-accent" style={{ margin: 0, fontSize: '0.75rem', fontWeight: 'bold' }}>{app.reason || 'Checkup'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>Reschedule</button>
                                            <button className="btn btn-primary" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>Check In</button>
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        <Calendar size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
                                        <p>No appointments scheduled.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'patients' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <h4>Recently Consulted Patients</h4>
                                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ background: 'rgba(255,255,255,0.03)', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                <th style={{ padding: '12px' }}>PATIENT</th>
                                                <th style={{ padding: '12px' }}>LAST VISIT</th>
                                                <th style={{ padding: '12px' }}>DIAGNOSIS</th>
                                                <th style={{ padding: '12px' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                                                <td style={{ padding: '12px', fontSize: '0.85rem', fontWeight: '600' }}>Rajesh Kumar</td>
                                                <td style={{ padding: '12px', fontSize: '0.85rem' }}>12 Oct 2023</td>
                                                <td style={{ padding: '12px', fontSize: '0.85rem' }}>Hypertension</td>
                                                <td style={{ padding: '12px' }}><button className="btn btn-outline" style={{ padding: '4px' }}><Plus size={14} /></button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'performance' && (
                            <div style={{ padding: '20px' }}>
                                <h4>Clinical Performance Metrics</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '20px' }}>
                                    <div className="glass-card" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        <p className="text-muted text-xs mb-1">Monthly Consultations</p>
                                        <h3 className="text-xl font-bold">142</h3>
                                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '10px' }}>
                                            <div style={{ width: '70%', height: '100%', background: 'var(--accent-primary)', borderRadius: '2px' }}></div>
                                        </div>
                                    </div>
                                    <div className="glass-card" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        <p className="text-muted text-xs mb-1">Patient Satisfaction</p>
                                        <h3 className="text-xl font-bold">98.2%</h3>
                                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '10px' }}>
                                            <div style={{ width: '98%', height: '100%', background: 'var(--status-success)', borderRadius: '2px' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Badge = ({ label, color = 'rgba(255,255,255,0.05)', textColor = 'var(--text-muted)' }: any) => (
    <span style={{ padding: '4px 12px', borderRadius: '20px', background: color, border: '1px solid var(--border-light)', fontSize: '0.75rem', fontWeight: 'bold', color: textColor }}>
        {label}
    </span>
);

const InfoRow = ({ icon, label, value }: any) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ color: 'var(--text-muted)' }}>{icon}</div>
        <div style={{ minWidth: '100px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</div>
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
            background: active ? '#733FF1' : 'transparent',
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
