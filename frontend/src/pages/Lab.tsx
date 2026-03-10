import { TestTube, FileText, CheckCircle, Clock } from 'lucide-react';

const MOCK_LAB_ORDERS = [
    { id: '1', patient: 'John Doe', test: 'Complete Blood Count (CBC)', doctor: 'Dr. Sarah Smith', status: 'PENDING', date: '2026-03-10' },
    { id: '2', patient: 'Jane Smith', test: 'Lipid Profile', doctor: 'Dr. Emily Chen', status: 'IN_PROGRESS', date: '2026-03-10' },
    { id: '3', patient: 'Robert Johnson', test: 'HbA1c', doctor: 'Dr. James Wilson', status: 'COMPLETED', date: '2026-03-09' },
    { id: '4', patient: 'Emily Davis', test: 'Thyroid Function', doctor: 'Dr. Sarah Smith', status: 'COMPLETED', date: '2026-03-08' },
];

export const Lab = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Laboratory System</h1>
                    <p className="text-muted">Manage lab tests, specimens, and patient reports.</p>
                </div>
                <button className="btn btn-primary">
                    <TestTube size={18} /> New Test Order
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 1fr)', gap: '24px' }}>

                <div className="glass-card">
                    <h3 className="font-bold mb-4">Recent Lab Orders</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '12px' }}>Order ID</th>
                                <th style={{ padding: '12px' }}>Patient</th>
                                <th style={{ padding: '12px' }}>Test Name</th>
                                <th style={{ padding: '12px' }}>Ref Doctor</th>
                                <th style={{ padding: '12px' }}>Status</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_LAB_ORDERS.map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="hover:bg-white/5 cursor-pointer">
                                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>#{order.id.padStart(4, '0')}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{order.patient}</td>
                                    <td style={{ padding: '12px' }}>{order.test}</td>
                                    <td style={{ padding: '12px' }}>{order.doctor}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                                            background: order.status === 'COMPLETED' ? 'var(--status-success-bg)' : order.status === 'IN_PROGRESS' ? 'var(--status-warning-bg)' : 'var(--status-info-bg)',
                                            color: order.status === 'COMPLETED' ? 'var(--status-success)' : order.status === 'IN_PROGRESS' ? 'var(--status-warning)' : 'var(--status-info)'
                                        }}>
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        {order.status === 'COMPLETED' ? (
                                            <button className="btn btn-outline text-sm py-1 px-3"><FileText size={14} /> View</button>
                                        ) : (
                                            <button className="btn btn-primary text-sm py-1 px-3"><TestTube size={14} /> Update</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(0,0,0,0.4))' }}>
                        <h3 className="font-bold flex items-center gap-2 mb-2"><CheckCircle size={18} className="text-success" /> Completed Today</h3>
                        <h1 className="text-4xl font-bold">24</h1>
                        <p className="text-sm text-muted mt-2">Reports ready for dispatch</p>
                    </div>

                    <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(0,0,0,0.4))' }}>
                        <h3 className="font-bold flex items-center gap-2 mb-2"><Clock size={18} className="text-warning" /> Pending Samples</h3>
                        <h1 className="text-4xl font-bold">8</h1>
                        <p className="text-sm text-muted mt-2">Awaiting analysis completion</p>
                    </div>
                </div>

            </div>
        </div>
    );
};
