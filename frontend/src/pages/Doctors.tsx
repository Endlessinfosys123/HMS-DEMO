import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Stethoscope, Calendar, Star, UserPlus, ArrowRight, ArrowLeft, CheckCircle, IdCard, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../components/Modal';

export const Doctors = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [registrationStep, setRegistrationStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        specialization: ''
    });
    const [generatedId, setGeneratedId] = useState('');

    const generateStaffId = () => {
        const prefix = "HMS-DOC-";
        const randomNum = Math.floor(100 + Math.random() * 900);
        return `${prefix}${randomNum}`;
    };

    useEffect(() => {
        if (registrationStep === 3 && !generatedId) {
            setGeneratedId(generateStaffId());
        }
    }, [registrationStep]);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*, roles!inner(name)')
            .eq('roles.name', 'DOCTOR');

        if (!error) setDoctors(data || []);
        setLoading(false);
    };

    const handleAddDoctor = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        // Find DOCTOR role id
        const { data: roleData } = await supabase.from('roles').select('id').eq('name', 'DOCTOR').single();
        
        if (roleData) {
            const { error } = await supabase
                .from('profiles')
                .insert([{
                    ...formData,
                    role_id: roleData.id,
                    employee_id: generatedId,
                    created_at: new Date().toISOString()
                }]);

            if (!error) {
                setIsModalOpen(false);
                setRegistrationStep(1);
                setGeneratedId('');
                setFormData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone: '',
                    specialization: ''
                });
                fetchDoctors();
            } else {
                alert('Error adding doctor: ' + error.message);
            }
        }
        setSubmitting(false);
    };

    const filteredDoctors = doctors.filter(d => 
        `${d.first_name} ${d.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.specialization && d.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Medical Directory</h1>
                    <p className="text-muted">Browse and manage hospital's medical professionals.</p>
                </div>
                <button 
                    className="btn btn-primary"
                    onClick={() => setIsModalOpen(true)}
                >
                    <UserPlus size={18} /> Register Professional
                </button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setRegistrationStep(1);
                    setGeneratedId('');
                }}
                title="Register New Medical Professional"
            >
                <div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
                        {[1, 2, 3].map(s => (
                            <div key={s} style={{ 
                                height: '4px', 
                                flex: 1, 
                                background: registrationStep >= s ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                borderRadius: '2px',
                                transition: 'all 0.3s ease'
                            }} />
                        ))}
                    </div>

                    <form onSubmit={handleAddDoctor}>
                        {registrationStep === 1 && (
                            <div className="animate-slide-up">
                                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Mail size={20} className="text-accent" /> Bio Information
                                </h3>
                                <div className="grid-2">
                                    <div className="form-group">
                                        <label className="form-label">First Name</label>
                                        <input 
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
                                            className="form-input" 
                                            required 
                                            value={formData.last_name}
                                            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input 
                                        type="email"
                                        className="form-input" 
                                        required 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        placeholder="dr.doe@hospital.com"
                                    />
                                </div>
                                <div className="flex-end" style={{ marginTop: '2rem' }}>
                                    <button 
                                        type="button" 
                                        className="btn btn-primary" 
                                        onClick={() => setRegistrationStep(2)}
                                        disabled={!formData.first_name || !formData.last_name || !formData.email}
                                    >
                                        Specialization <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {registrationStep === 2 && (
                            <div className="animate-slide-up">
                                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Stethoscope size={20} className="text-accent" /> Clinical Expertise
                                </h3>
                                <div className="form-group">
                                    <label className="form-label">Medical Specialization</label>
                                    <select 
                                        className="form-input" 
                                        required 
                                        value={formData.specialization}
                                        onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                                        style={{ background: 'var(--bg-sidebar)' }}
                                    >
                                        <option value="">Select Specialty</option>
                                        <option value="Cardiology">Cardiology</option>
                                        <option value="Neurology">Neurology</option>
                                        <option value="Orthopedics">Orthopedics</option>
                                        <option value="Pediatrics">Pediatrics</option>
                                        <option value="Dermatology">Dermatology</option>
                                        <option value="General Physician">General Physician</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Contact</label>
                                    <input 
                                        className="form-input" 
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div className="flex-end" style={{ marginTop: '2rem', gap: '12px' }}>
                                    <button 
                                        type="button" 
                                        className="btn btn-outline" 
                                        onClick={() => setRegistrationStep(1)}
                                    >
                                        <ArrowLeft size={18} /> Back
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-primary" 
                                        onClick={() => setRegistrationStep(3)}
                                        disabled={!formData.specialization}
                                    >
                                        Review Credentials <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {registrationStep === 3 && (
                            <div className="animate-slide-up">
                                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
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
                                        <IdCard size={32} />
                                    </div>
                                    <h3 style={{ margin: 0 }}>Review Professional Credentials</h3>
                                    <p className="text-muted">Assigned ID: <span className="text-accent" style={{ fontWeight: 'bold' }}>{generatedId}</span></p>
                                </div>

                                <div className="glass-card" style={{ padding: '16px', marginBottom: '2rem', background: 'rgba(255,255,255,0.02)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Doctor Name</p>
                                            <p style={{ fontWeight: '600' }}>Dr. {formData.first_name} {formData.last_name}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Specialty</p>
                                            <p style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>{formData.specialization}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Contact</p>
                                            <p style={{ fontWeight: '600' }}>{formData.email}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Hospital ID</p>
                                            <p style={{ fontWeight: '600' }}>{generatedId}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-end" style={{ gap: '12px' }}>
                                    <button 
                                        type="button" 
                                        className="btn btn-outline" 
                                        onClick={() => setRegistrationStep(2)}
                                        disabled={submitting}
                                    >
                                        <ArrowLeft size={18} /> Edit Info
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Registering...' : (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                Authorize & Complete <CheckCircle size={18} />
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </Modal>

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 16px', width: '350px' }}>
                        <Search size={18} className="text-muted" style={{ marginRight: '8px' }} />
                        <input
                            type="text"
                            placeholder="Search by name, specialty or staff ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>Syncing clinical directory...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <th style={{ padding: '12px 16px' }}>PROFESSIONAL</th>
                                <th style={{ padding: '12px 16px' }}>SPECIALIZATION</th>
                                <th style={{ padding: '12px 16px' }}>STAFF ID</th>
                                <th style={{ padding: '12px 16px' }}>RATING</th>
                                <th style={{ padding: '12px 16px' }}>EXPERIENCE</th>
                                <th style={{ padding: '12px 16px' }}>STATUS</th>
                                <th style={{ padding: '12px 16px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDoctors.length > 0 ? filteredDoctors.map((doc) => (
                                <tr key={doc.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="patient-row">
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                                                {doc.first_name[0]}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>Dr. {doc.first_name} {doc.last_name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 'bold' }}>{doc.specialization || 'General'}</span>
                                    </td>
                                    <td style={{ padding: '16px', fontWeight: '500' }}>{doc.employee_id || '-'}</td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B' }}>
                                            <Star size={14} fill="#F59E0B" />
                                            <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#fff' }}>4.8</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', color: 'var(--text-muted)' }}>8y+</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-success)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>On Duty</span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button 
                                                className="btn btn-outline" 
                                                style={{ padding: '6px' }}
                                                title="View Appointments"
                                                onClick={() => navigate(`/doctors/${doc.id}`)}
                                            >
                                                <Calendar size={14} />
                                            </button>
                                            <button 
                                                className="btn btn-outline" 
                                                style={{ padding: '6px' }}
                                                onClick={() => navigate(`/doctors/${doc.id}`)}
                                            >
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No clinical professionals found matching your query.
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


