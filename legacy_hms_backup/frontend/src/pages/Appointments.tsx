import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, FileText, CheckCircle, XCircle } from 'lucide-react';

const MOCK_APPOINTMENTS = [
    { id: '1', patientName: 'John Doe', time: '09:00 AM', type: 'General Checkup', status: 'COMPLETED' },
    { id: '2', patientName: 'Jane Smith', time: '10:30 AM', type: 'Follow-up', status: 'IN_PROGRESS' },
    { id: '3', patientName: 'Robert Johnson', time: '11:45 AM', type: 'Cardiology Review', status: 'SCHEDULED' },
    { id: '4', patientName: 'Emily Davis', time: '02:00 PM', type: 'Lab Results', status: 'SCHEDULED' },
    { id: '5', patientName: 'Michael Wilson', time: '04:15 PM', type: 'Vaccination', status: 'CANCELLED' },
];

export const Appointments = () => {
    const [selectedDate, setSelectedDate] = useState('2026-03-10');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Appointments Schedule</h1>
                    <p className="text-muted">Manage doctor schedules and patient bookings.</p>
                </div>
                <button className="btn btn-primary">
                    <CalendarIcon size={18} /> Book Appointment
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>

                {/* Calendar Side */}
                <div className="glass-card mt-2">
                    <h3 className="font-bold mb-4">Select Date</h3>
                    <input
                        type="date"
                        className="form-input mb-6"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />

                    <h3 className="font-bold mb-4">Doctors on Duty</h3>
                    <div className="flex flex-col gap-3">
                        {[
                            { name: 'Dr. Sarah Smith', spec: 'Cardiologist', status: 'Available' },
                            { name: 'Dr. James Wilson', spec: 'Pediatrician', status: 'In Surgery' },
                            { name: 'Dr. Emily Chen', spec: 'General Physician', status: 'Available' }
                        ].map((doc, idx) => (
                            <div key={idx} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)' }}>
                                <div className="font-bold">{doc.name}</div>
                                <div className="text-sm text-muted mb-2">{doc.spec}</div>
                                <div style={{ fontSize: '0.8rem', color: doc.status === 'Available' ? 'var(--status-success)' : 'var(--status-warning)' }}>
                                    • {doc.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Schedule Side */}
                <div className="glass-card mt-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl">Schedule for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                        <div className="flex gap-2">
                            <span className="badge badge-success">COMPLETED</span>
                            <span className="badge badge-warning">IN PROGRESS</span>
                            <span className="badge badge-info">SCHEDULED</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {MOCK_APPOINTMENTS.map((apt) => (
                            <div key={apt.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '16px',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                borderLeft: `4px solid ${apt.status === 'COMPLETED' ? 'var(--status-success)' :
                                        apt.status === 'IN_PROGRESS' ? 'var(--status-warning)' :
                                            apt.status === 'CANCELLED' ? 'var(--status-danger)' :
                                                'var(--status-info)'
                                    }`
                            }}
                                className="hover:bg-white/10 transition-colors"
                            >
                                <div className="flex gap-6 items-center">
                                    <div className="flex flex-col items-center justify-center p-3 rounded bg-black/20" style={{ width: '80px' }}>
                                        <Clock size={18} className="text-muted mb-1" />
                                        <span className="font-bold text-sm">{apt.time}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg flex items-center gap-2"><User size={16} /> {apt.patientName}</h4>
                                        <p className="text-muted text-sm flex items-center gap-2 mt-1"><FileText size={14} /> {apt.type}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="btn btn-outline" style={{ padding: '8px' }} title="Start Consultation">
                                        <CheckCircle size={18} className="text-success" />
                                    </button>
                                    <button className="btn btn-outline" style={{ padding: '8px' }} title="Cancel">
                                        <XCircle size={18} className="text-danger" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </div>
    );
};
