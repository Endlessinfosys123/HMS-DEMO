import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar as CalendarIcon, Clock, User, Plus, Check, XCircle, CheckCircle } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Appointments = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        reason: '',
        status: 'SCHEDULED'
    });

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
                onClose={() => setIsModalOpen(false)} 
                title="Schedule New Appointment"
                size="md"
            >
                <form onSubmit={handleSchedule}>
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
                        <label className="form-label">Consulting Doctor</label>
                        <select 
                            className="form-input" 
                            required 
                            value={formData.doctor_id}
                            onChange={(e) => setFormData({...formData, doctor_id: e.target.value})}
                            style={{ background: 'var(--bg-sidebar)' }}
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map(d => (
                                <option key={d.id} value={d.id}>Dr. {d.first_name} {d.last_name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Date & Time</label>
                        <input 
                            type="datetime-local" 
                            className="form-input" 
                            required 
                            value={formData.appointment_date}
                            onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Reason for Visit</label>
                        <textarea 
                            className="form-input" 
                            rows={3}
                            value={formData.reason}
                            onChange={(e) => setFormData({...formData, reason: e.target.value})}
                            placeholder="Symptoms or check-up..."
                        />
                    </div>

                    <div className="flex-end" style={{ marginTop: '1rem' }}>
                        <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Scheduling...' : 'Confirm Appointment'}
                        </button>
                    </div>
                </form>
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
