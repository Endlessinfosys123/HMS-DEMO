import { CreditCard, Printer, DollarSign } from 'lucide-react';

const MOCK_INVOICES = [
    { id: 'INV-1021', patient: 'John Doe', date: '2026-03-10', amount: '$150.00', status: 'PAID' },
    { id: 'INV-1022', patient: 'Jane Smith', date: '2026-03-10', amount: '$420.00', status: 'UNPAID' },
    { id: 'INV-1023', patient: 'Robert Johnson', date: '2026-03-09', amount: '$85.00', status: 'PAID' },
    { id: 'INV-1024', patient: 'Emily Davis', date: '2026-03-08', amount: '$1,200.00', status: 'PARTIAL' },
];

export const Billing = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Billing & Invoicing</h1>
                    <p className="text-muted">Manage patient invoices, payments, and financial records.</p>
                </div>
                <button className="btn btn-primary">
                    <DollarSign size={18} /> Generate Invoice
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 1fr)', gap: '24px' }}>

                <div className="glass-card">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold">Recent Invoices</h3>
                        <div className="flex gap-2">
                            <button className="btn btn-outline text-sm">All</button>
                            <button className="btn btn-outline text-sm">Unpaid</button>
                        </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '12px' }}>Invoice No</th>
                                <th style={{ padding: '12px' }}>Patient</th>
                                <th style={{ padding: '12px' }}>Date</th>
                                <th style={{ padding: '12px' }}>Amount</th>
                                <th style={{ padding: '12px' }}>Status</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_INVOICES.map((inv) => (
                                <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="hover:bg-white/5">
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{inv.id}</td>
                                    <td style={{ padding: '12px' }}>{inv.patient}</td>
                                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{inv.date}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{inv.amount}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                                            background: inv.status === 'PAID' ? 'var(--status-success-bg)' : inv.status === 'UNPAID' ? 'var(--status-danger-bg)' : 'var(--status-warning-bg)',
                                            color: inv.status === 'PAID' ? 'var(--status-success)' : inv.status === 'UNPAID' ? 'var(--status-danger)' : 'var(--status-warning)'
                                        }}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        <div className="flex justify-end gap-2">
                                            {inv.status !== 'PAID' && (
                                                <button className="btn btn-primary text-sm py-1 px-2" title="Accept Payment">
                                                    Pay
                                                </button>
                                            )}
                                            <button className="btn btn-outline text-sm py-1 px-2" title="Print Invoice">
                                                <Printer size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="glass-card">
                    <h3 className="font-bold mb-4">Payment Methods</h3>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-[var(--border-light)]">
                            <CreditCard className="text-accent-primary" />
                            <div>
                                <div className="font-bold">Stripe POS</div>
                                <div className="text-xs text-muted">Connected</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-[var(--border-light)]">
                            <DollarSign className="text-success" />
                            <div>
                                <div className="font-bold">Cash Drawer</div>
                                <div className="text-xs text-muted">Register 1 • Open</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
