import { BedDouble, UserPlus, CheckCircle } from 'lucide-react';

const MOCK_INPATIENTS = [
    { id: 'IP-201', patient: 'John Doe', ward: 'General Ward', bed: 'G-12', admissionDate: '2026-03-05', doctor: 'Dr. Sarah Smith', status: 'Admitted' },
    { id: 'IP-202', patient: 'Jane Smith', ward: 'ICU', bed: 'ICU-04', admissionDate: '2026-03-09', doctor: 'Dr. Emily Chen', status: 'Critical' },
    { id: 'IP-203', patient: 'Robert Johnson', ward: 'Cardiology', bed: 'C-02', admissionDate: '2026-03-08', doctor: 'Dr. James Wilson', status: 'Stable' },
    { id: 'IP-204', patient: 'Emily Davis', ward: 'Maternity', bed: 'M-15', admissionDate: '2026-03-10', doctor: 'Dr. Sarah Smith', status: 'Discharging' },
];

export const Inpatients = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Inpatient Management</h1>
                    <p className="text-muted">Manage hospital admissions, discharges, and ward allocations.</p>
                </div>
                <button className="btn btn-primary">
                    <UserPlus size={18} /> New Admission
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 1fr)', gap: '24px' }}>

                <div className="glass-card">
                    <h3 className="font-bold mb-4">Current Inpatients</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '12px' }}>Admission ID</th>
                                <th style={{ padding: '12px' }}>Patient</th>
                                <th style={{ padding: '12px' }}>Ward & Bed</th>
                                <th style={{ padding: '12px' }}>Admitted On</th>
                                <th style={{ padding: '12px' }}>Attending Doctor</th>
                                <th style={{ padding: '12px' }}>Status</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_INPATIENTS.map((ip) => (
                                <tr key={ip.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="hover:bg-white/5 cursor-pointer">
                                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{ip.id}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{ip.patient}</td>
                                    <td style={{ padding: '12px' }}>{ip.ward} ({ip.bed})</td>
                                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{ip.admissionDate}</td>
                                    <td style={{ padding: '12px' }}>{ip.doctor}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                                            background: ip.status === 'Discharging' ? 'var(--status-success-bg)' : ip.status === 'Critical' ? 'var(--status-danger-bg)' : 'var(--status-info-bg)',
                                            color: ip.status === 'Discharging' ? 'var(--status-success)' : ip.status === 'Critical' ? 'var(--status-danger)' : 'var(--status-info)'
                                        }}>
                                            {ip.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        <button className="btn btn-outline text-sm py-1 px-3">Manage</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(0,0,0,0.4))' }}>
                        <h3 className="font-bold flex items-center gap-2 mb-2"><BedDouble size={18} className="text-info" /> Total Admissions</h3>
                        <h1 className="text-4xl font-bold">42</h1>
                        <p className="text-sm text-muted mt-2">Active inpatients currently admitted.</p>
                    </div>

                    <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(0,0,0,0.4))' }}>
                        <h3 className="font-bold flex items-center gap-2 mb-2"><CheckCircle size={18} className="text-success" /> Discharges Today</h3>
                        <h1 className="text-4xl font-bold">5</h1>
                        <p className="text-sm text-muted mt-2">Patients cleared for discharge.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};
