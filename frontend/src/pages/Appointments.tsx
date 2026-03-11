import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar as CalendarIcon, Clock, User, Plus, Check, XCircle } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Appointments = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingStep, setBookingStep] = useState(1);
    const [currentSpecialization, setCurrentSpecialization] = useState('');
    const [formData, setFormData] = useState({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        reason: '',
        status: 'SCHEDULED'
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        const [apptsRes, patientsRes, doctorsRes] = await Promise.all([
            supabase.from('appointments').select('*, patients(first_name, last_name), profiles:doctor_id(first_name, last_name)').order('appointment_date', { ascending: true }),
            supabase.from('patients').select('id, first_name, last_name'),
            supabase.from('profiles').select('id, first_name, last_name').not('first_name', 'eq', '')
        ]);

        if (!apptsRes.error) setAppointments(apptsRes.data || []);
        if (!patientsRes.error) setPatients(patientsRes.data || []);
        if (!doctorsRes.error) setDoctors(doctorsRes.data || []);
        setLoading(false);
    };

    const handleSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        const { error } = await supabase
            .from('appointments')
            .insert([formData]);

        if (!error) {
            setIsModalOpen(false);
            setBookingStep(1);
            setFormData({
                patient_id: '',
                doctor_id: '',
                appointment_date: '',
                reason: '',
                status: 'SCHEDULED'
            });
            fetchInitialData();
        } else {
            alert('Error scheduling appointment: ' + error.message);
        }
        setSubmitting(false);
    };

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase
            .from('appointments')
            .update({ status })
            .eq('id', id);

        if (!error) fetchInitialData();
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Appointment Schedule</h1>
                    <p className="text-muted">Manage patient visits and doctor availability.</p>
                </div>
                <button 
                    className="btn btn-primary"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={18} /> Schedule Appointment
                </button>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    setBookingStep(1);
                }} 
                title="Book an Appointment"
                size="md"
            >
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                        {[1, 2, 3].map(s => (
                            <div key={s} style={{ 
                                height: '4px', 
                                flex: 1, 
                                borderRadius: '2px', 
                                background: s <= bookingStep ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                                transition: 'all 0.3s'
                            }}></div>
                        ))}
                    </div>

                    {bookingStep === 1 && (
                        <div className="animate-fade-in">
                            <h4 style={{ marginBottom: '1rem' }}>Step 1: Select Professional</h4>
                            <div className="form-group">
                                <label className="form-label">Specialization</label>
                                <select 
                                    className="form-input" 
                                    style={{ background: 'var(--bg-sidebar)' }}
                                    value={currentSpecialization}
                                    onChange={(e) => setCurrentSpecialization(e.target.value)}
                                >
                                    <option value="">All Services</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Surgery">General Surgery</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Doctor</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {doctors
                                        .filter(d => !currentSpecialization || d.specialization === currentSpecialization)
                                        .map(d => (
                                        <div 
                                            key={d.id} 
                                            onClick={() => setFormData({...formData, doctor_id: d.id})}
                                            style={{ 
                                                padding: '12px', 
                                                borderRadius: '10px', 
                                                background: formData.doctor_id === d.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)',
                                                border: `1px solid ${formData.doctor_id === d.id ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Dr. {d.first_name} {d.last_name}</span>
                                            {formData.doctor_id === d.id && <Check size={16} className="text-accent" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-end" style={{ marginTop: '2rem' }}>
                                <button className="btn btn-primary" disabled={!formData.doctor_id} onClick={() => setBookingStep(2)}>
                                    Next: Choose Time
                                </button>
                            </div>
                        </div>
                    )}

                    {bookingStep === 2 && (
                        <div className="animate-fade-in">
                            <h4 style={{ marginBottom: '1rem' }}>Step 2: Schedule & Patient</h4>
                            <div className="form-group">
                                <label className="form-label">Patient</label>
                                <select 
                                    className="form-input" 
                                    required 
                                    value={formData.patient_id}
                                    onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                                    style={{ background: 'var(--bg-sidebar)' }}
                                >
                                    <option value="">Select Patient</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Appointment Time</label>
                                <input 
                                    type="datetime-local" 
                                    className="form-input" 
                                    required 
                                    value={formData.appointment_date}
                                    onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                                />
                            </div>
                            <div className="flex-end" style={{ marginTop: '2rem', gap: '12px' }}>
                                <button className="btn btn-outline" onClick={() => setBookingStep(1)}>Back</button>
                                <button className="btn btn-primary" disabled={!formData.patient_id || !formData.appointment_date} onClick={() => setBookingStep(3)}>
                                    Next: Review
                                </button>
                            </div>
                        </div>
                    )}

                    {bookingStep === 3 && (
                        <div className="animate-fade-in">
                            <h4 style={{ marginBottom: '1rem' }}>Step 3: Confirm Details</h4>
                            <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div>
                                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>Professional</span>
                                        <p style={{ margin: 0, fontWeight: 'bold' }}>Dr. {doctors.find(d => d.id === formData.doctor_id)?.first_name} {doctors.find(d => d.id === formData.doctor_id)?.last_name}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>Patient</span>
                                        <p style={{ margin: 0, fontWeight: 'bold' }}>{patients.find(p => p.id === formData.patient_id)?.first_name} {patients.find(p => p.id === formData.patient_id)?.last_name}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>Time</span>
                                        <p style={{ margin: 0, fontWeight: 'bold' }}>{new Date(formData.appointment_date).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Reason for Visit</label>
                                <input 
                                    className="form-input" 
                                    value={formData.reason}
                                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                    placeholder="Brief description..."
                                />
                            </div>
                            <div className="flex-end" style={{ marginTop: '2rem', gap: '12px' }}>
                                <button className="btn btn-outline" onClick={() => setBookingStep(2)}>Back</button>
                                <button className="btn btn-primary" disabled={submitting} onClick={handleSchedule}>
                                    {submitting ? 'Confirming...' : 'Book Appointment'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {loading ? (
                    <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Loading schedule...</div>
                ) : appointments.length > 0 ? appointments.map((apt) => (
                    <div key={apt.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={20} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0 }}>{apt.patients?.first_name} {apt.patients?.last_name}</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dr. {apt.profiles?.first_name} {apt.profiles?.last_name}</p>
                                </div>
                            </div>
                            <span style={{ 
                                padding: '4px 8px', 
                                borderRadius: '6px', 
                                background: apt.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : apt.status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                                color: apt.status === 'COMPLETED' ? 'var(--status-success)' : apt.status === 'CANCELLED' ? 'var(--status-danger)' : 'var(--status-warning)', 
                                fontSize: '0.7rem', 
                                fontWeight: 'bold' 
                            }}>{apt.status}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <CalendarIcon size={14} /> {new Date(apt.appointment_date).toLocaleDateString()}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <Clock size={14} /> {new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>

                        {apt.status === 'SCHEDULED' && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                <button 
                                    className="btn btn-outline" 
                                    style={{ flex: 1, fontSize: '0.8rem', padding: '8px' }}
                                    onClick={() => updateStatus(apt.id, 'CANCELLED')}
                                >
                                    <XCircle size={14} /> Cancel
                                </button>
                                <button 
                                    className="btn btn-primary" 
                                    style={{ flex: 1, fontSize: '0.8rem', padding: '8px' }}
                                    onClick={() => updateStatus(apt.id, 'COMPLETED')}
                                >
                                    <Check size={14} /> Complete
                                </button>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
                        <CalendarIcon size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                        <p>No appointments scheduled.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
