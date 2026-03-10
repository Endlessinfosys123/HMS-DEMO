import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar as CalendarIcon, Clock, User, Plus, Check } from 'lucide-react';

export const Appointments = () => {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('appointments')
            .select('*, patients(first_name, last_name)')
            .order('appointment_date', { ascending: true });

        if (!error) setAppointments(data || []);
        setLoading(false);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Appointment Schedule</h1>
                    <p className="text-muted">Manage doctor availability and patient visits.</p>
                </div>
                <button className="btn btn-primary"><Plus size={18} /> New Appointment</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
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
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {apt.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                            </div>
                            <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-success)', fontSize: '0.7rem', fontWeight: 'bold' }}>{apt.status}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <CalendarIcon size={14} /> {new Date(apt.appointment_date).toLocaleDateString()}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <Clock size={14} /> {new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            <button className="btn btn-outline" style={{ flex: 1, fontSize: '0.8rem', padding: '8px' }}>Reschedule</button>
                            <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.8rem', padding: '8px' }}><Check size={14} /> Complete</button>
                        </div>
                    </div>
                )) : (
                    <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
                        <CalendarIcon size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                        <p>No appointments scheduled for today.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
