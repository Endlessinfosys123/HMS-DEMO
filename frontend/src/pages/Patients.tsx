import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ExternalLink, ClipboardList, Stethoscope, ArrowRight, ArrowLeft, CheckCircle, User, Phone, ShieldCheck, Droplets, Calendar as CalendarIcon } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useAuth } from '../contexts/AuthContext';

export const Patients = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [registrationStep, setRegistrationStep] = useState(1);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        gender: 'Male',
        date_of_birth: '',
        blood_group: '',
        address: '',
    });

    const [consultData, setConsultData] = useState({
        symptoms: '',
        diagnosis: '',
        notes: ''
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setPatients(data || []);
        setLoading(false);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        const { error } = await supabase
            .from('patients')
            .insert([formData]);

        if (!error) {
            setIsModalOpen(false);
            setRegistrationStep(1);
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                gender: 'Male',
                date_of_birth: '',
                blood_group: '',
                address: '',
            });
            fetchPatients();
        } else {
            alert('Error registering patient: ' + error.message);
        }
        setSubmitting(false);
    };

    const handleConsultation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient || !profile) return;
        setSubmitting(true);
        
        const { error } = await supabase
            .from('consultations')
            .insert([{
                patient_id: selectedPatient.id,
                doctor_id: profile.id,
                symptoms: consultData.symptoms,
                diagnosis: consultData.diagnosis,
                notes: consultData.notes
            }]);

        if (!error) {
            setIsConsultModalOpen(false);
            setConsultData({ symptoms: '', diagnosis: '', notes: '' });
            alert('Consultation record saved successfully!');
        } else {
            alert('Error saving record: ' + error.message);
        }
        setSubmitting(false);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Patient Directory</h1>
                    <p className="text-muted">Manage health records and admission history.</p>
                </div>
                <button 
                    className="btn btn-primary"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={18} /> Register Patient
                </button>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    setRegistrationStep(1);
                }} 
                title="Hospital Patient Admission"
                size="lg"
            >
                <div>
                    {/* Progress Bar */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '2.5rem' }}>
                        {['Identity', 'Contact', 'Review'].map((label, idx) => (
                            <div key={label} style={{ flex: 1 }}>
                                <div style={{ 
                                    height: '4px', 
                                    background: registrationStep > idx ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                    borderRadius: '2px',
                                    marginBottom: '8px',
                                    transition: 'all 0.4s'
                                }} />
                                <span style={{ 
                                    fontSize: '0.7rem', 
                                    fontWeight: 'bold', 
                                    color: registrationStep > idx ? 'var(--accent-primary)' : 'var(--text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>{label}</span>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleRegister}>
                        {registrationStep === 1 && (
                            <div className="animate-slide-up">
                                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <User size={20} className="text-accent" /> Personal Profile
                                </h3>
                                <div className="grid-2">
                                    <div className="form-group">
                                        <label className="form-label">First Name</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            required 
                                            value={formData.first_name}
                                            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                            placeholder="John"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Last Name</label>
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            required 
                                            value={formData.last_name}
                                            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

                                <div className="grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Gender</label>
                                        <select 
                                            className="form-input"
                                            value={formData.gender}
                                            onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                            style={{ background: 'var(--bg-sidebar)' }}
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Date of Birth</label>
                                        <input 
                                            type="date" 
                                            className="form-input" 
                                            required
                                            value={formData.date_of_birth}
                                            onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="flex-end" style={{ marginTop: '2.5rem' }}>
                                    <button 
                                        type="button" 
                                        className="btn btn-primary" 
                                        onClick={() => setRegistrationStep(2)}
                                        disabled={!formData.first_name || !formData.last_name || !formData.date_of_birth}
                                    >
                                        Next Component <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {registrationStep === 2 && (
                            <div className="animate-slide-up">
                                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Phone size={20} className="text-accent" /> Contact & Clinical Data
                                </h3>
                                <div className="grid-2">
                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <input 
                                            type="email" 
                                            className="form-input" 
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            placeholder="john.doe@example.com"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            className="form-input" 
                                            required 
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Blood Group</label>
                                    <select 
                                        className="form-input"
                                        value={formData.blood_group}
                                        onChange={(e) => setFormData({...formData, blood_group: e.target.value})}
                                        style={{ background: 'var(--bg-sidebar)' }}
                                    >
                                        <option value="">Select Group</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Address</label>
                                    <textarea 
                                        className="form-input"
                                        rows={3}
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        placeholder="Full residential address..."
                                    />
                                </div>

                                <div className="flex-end" style={{ marginTop: '2.5rem', gap: '12px' }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setRegistrationStep(1)}>
                                        <ArrowLeft size={18} /> Back
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-primary" 
                                        onClick={() => setRegistrationStep(3)}
                                        disabled={!formData.phone}
                                    >
                                        Review Profile <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {registrationStep === 3 && (
                            <div className="animate-slide-up">
                                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                    <div style={{ 
                                        width: '64px', 
                                        height: '64px', 
                                        borderRadius: '50%', 
                                        background: 'rgba(59, 130, 246, 0.1)', 
                                        color: 'var(--accent-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1rem'
                                    }}>
                                        <ShieldCheck size={32} />
                                    </div>
                                    <h3 style={{ margin: 0 }}>Review Registration Summary</h3>
                                    <p className="text-muted">Please confirm the details before admission.</p>
                                </div>

                                <div className="glass-card" style={{ padding: '20px', marginBottom: '2rem', background: 'rgba(255,255,255,0.02)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><User size={12} /> Full Name</p>
                                            <p style={{ fontWeight: '600' }}>{formData.first_name} {formData.last_name}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><CalendarIcon size={12} /> Age / Gender</p>
                                            <p style={{ fontWeight: '600' }}>{formData.gender} ({new Date().getFullYear() - new Date(formData.date_of_birth).getFullYear()} yrs)</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> Contact</p>
                                            <p style={{ fontWeight: '600' }}>{formData.phone}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><Droplets size={12} /> Blood Group</p>
                                            <p style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>{formData.blood_group || 'Not Specified'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-end" style={{ gap: '12px' }}>
                                    <button type="button" className="btn btn-outline" onClick={() => setRegistrationStep(2)}>
                                        <ArrowLeft size={18} /> Edit Info
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={submitting}
                                        style={{ background: 'var(--status-success)', borderColor: 'var(--status-success)' }}
                                    >
                                        {submitting ? 'Registering...' : (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                Complete Admission <CheckCircle size={18} />
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </Modal>

            {/* Consultation / EMR Modal */}
            <Modal
                isOpen={isConsultModalOpen}
                onClose={() => setIsConsultModalOpen(false)}
                title={`Clinical Consultation: ${selectedPatient?.first_name} ${selectedPatient?.last_name}`}
                size="lg"
            >
                <form onSubmit={handleConsultation}>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '1.5rem', padding: '12px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px' }}>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Patient ID</p>
                            <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>#{selectedPatient?.id.slice(0,8).toUpperCase()}</p>
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Attending Professional</p>
                            <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{profile?.first_name} {profile?.last_name} ({profile?.roles?.name})</p>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label flex items-center gap-2"><ClipboardList size={16} className="text-accent" /> Subjective (Symptoms & History)</label>
                        <textarea 
                            className="form-input" 
                            rows={3} 
                            required
                            value={consultData.symptoms}
                            onChange={(e) => setConsultData({...consultData, symptoms: e.target.value})}
                            placeholder="Patient reports headache, fever for 3 days..."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label flex items-center gap-2"><Stethoscope size={16} className="text-accent" /> Objective / Assessment (Diagnosis)</label>
                        <textarea 
                            className="form-input" 
                            rows={2} 
                            required
                            value={consultData.diagnosis}
                            onChange={(e) => setConsultData({...consultData, diagnosis: e.target.value})}
                            placeholder="Bacterial Infection / Viral Fever"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Plan (Treatment & Prescription)</label>
                        <textarea 
                            className="form-input" 
                            rows={4} 
                            value={consultData.notes}
                            onChange={(e) => setConsultData({...consultData, notes: e.target.value})}
                            placeholder="Prescribed Amoxicillin 500mg TID for 5 days. Bed rest recommended."
                        />
                    </div>

                    <div className="flex-end" style={{ marginTop: '1.5rem' }}>
                        <button type="button" className="btn btn-outline" onClick={() => setIsConsultModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Saving Record...' : 'Finalize Consultation'}
                        </button>
                    </div>
                </form>
            </Modal>

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 16px', width: '350px' }}>
                        <Search size={18} className="text-muted" style={{ marginRight: '8px' }} />
                        <input
                            type="text"
                            placeholder="Search by ID, Name or Phone..."
                            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
                        />
                    </div>
                    <button className="btn btn-outline" style={{ fontSize: '0.85rem' }}>Filter</button>
                </div>

                {loading ? (
                    <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading records...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <th style={{ padding: '12px 16px' }}>NAME</th>
                                <th style={{ padding: '12px 16px' }}>GENDER / AGE</th>
                                <th style={{ padding: '12px 16px' }}>PHONE</th>
                                <th style={{ padding: '12px 16px' }}>STATUS</th>
                                <th style={{ padding: '12px 16px' }}>ADMISSION</th>
                                <th style={{ padding: '12px 16px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.length > 0 ? patients.map((p) => (
                                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="patient-row">
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: '600' }}>{p.first_name} {p.last_name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{p.id.slice(0, 8).toUpperCase()}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>{p.gender || 'N/A'}</td>
                                    <td style={{ padding: '16px' }}>{p.phone}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-success)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>Active</span>
                                    </td>
                                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>-</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button 
                                                className="btn btn-outline" 
                                                style={{ padding: '6px' }}
                                                title="New Consultation"
                                                onClick={() => {
                                                    setSelectedPatient(p);
                                                    setIsConsultModalOpen(true);
                                                }}
                                            >
                                                <Stethoscope size={14} />
                                            </button>
                                            <button 
                                                className="btn btn-outline" 
                                                style={{ padding: '6px' }}
                                                onClick={() => navigate(`/patients/${p.id}`)}
                                            >
                                                <ExternalLink size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No patients found. Get started by registering one!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
