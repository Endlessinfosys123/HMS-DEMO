import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CreditCard, Download, FileText, Search } from 'lucide-react';

export const Billing = () => {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('invoices')
            .select('*, patients(first_name, last_name)')
            .order('created_at', { ascending: false });

        if (!error) setInvoices(data || []);
        setLoading(false);
    };

    const totalRevenue = invoices.reduce((acc, inv) => acc + (inv.status === 'PAID' ? Number(inv.amount) : 0), 0);
    const outstanding = invoices.reduce((acc, inv) => acc + (inv.status !== 'PAID' ? Number(inv.amount) : 0), 0);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Billing & Financials</h1>
                    <p className="text-muted">Track invoices, payments, and insurance claims.</p>
                </div>
                <button className="btn btn-primary"><CreditCard size={18} /> Generic Invoice</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 16px', width: '300px' }}>
                            <Search size={18} className="text-muted" style={{ marginRight: '8px' }} />
                            <input
                                type="text"
                                placeholder="Search invoices..."
                                style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
                            />
                        </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <th style={{ padding: '12px 16px' }}>INVOICE ID</th>
                                <th style={{ padding: '12px 16px' }}>PATIENT</th>
                                <th style={{ padding: '12px 16px' }}>AMOUNT</th>
                                <th style={{ padding: '12px 16px' }}>STATUS</th>
                                <th style={{ padding: '12px 16px' }}>DATE</th>
                                <th style={{ padding: '12px 16px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center' }}>Loading financials...</td></tr>
                            ) : invoices.length > 0 ? invoices.map((inv) => (
                                <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <td style={{ padding: '16px', fontWeight: 'bold' }}>#{inv.id.slice(0, 6).toUpperCase()}</td>
                                    <td style={{ padding: '16px' }}>{inv.patients?.first_name} {inv.patients?.last_name}</td>
                                    <td style={{ padding: '16px' }}>${Number(inv.amount).toFixed(2)}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                fontSize: '0.7rem',
                                                fontWeight: 'bold',
                                                background: inv.status === 'PAID' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                color: inv.status === 'PAID' ? 'var(--status-success)' : 'var(--status-warning)'
                                            }}
                                        >
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{new Date(inv.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button className="btn btn-outline" style={{ padding: '6px' }}><Download size={14} /></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={6} style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>No invoices generated yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card">
                        <h4 className="mb-4">Quick Summary</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-secondary">Paid Revenue</span>
                                <span className="font-bold">${totalRevenue.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-secondary">Outstanding</span>
                                <span className="font-bold text-accent">${outstanding.toFixed(2)}</span>
                            </div>
                            <button className="btn btn-outline" style={{ width: '100%', marginTop: '8px' }}>View Report</button>
                        </div>
                    </div>

                    <div className="glass-card" style={{ background: 'rgba(59, 130, 246, 0.05)' }}>
                        <h4 className="mb-2 flex items-center gap-2"><FileText size={18} /> Insurance Tracking</h4>
                        <p className="text-xs text-muted mb-4">4 Claims pending approval from Medicare.</p>
                        <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.8rem' }}>Process Claims</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
