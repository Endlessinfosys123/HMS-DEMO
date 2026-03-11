import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CreditCard, Download, FileText, Search, Plus, Trash2, CheckCircle } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Billing = () => {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Invoice Form State
    const [invoiceData, setInvoiceData] = useState({
        patient_id: '',
        status: 'UNPAID',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    const [items, setItems] = useState([{ description: 'Consultation', amount: 0 }]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        const [invRes, patientRes] = await Promise.all([
            supabase.from('invoices').select('*, patients(first_name, last_name)').order('created_at', { ascending: false }),
            supabase.from('patients').select('id, first_name, last_name')
        ]);

        if (!invRes.error) setInvoices(invRes.data || []);
        if (!patientRes.error) setPatients(patientRes.data || []);
        setLoading(false);
    };

    const handleAddItem = () => {
        setItems([...items, { description: '', amount: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const totalAmount = items.reduce((sum, item) => sum + Number(item.amount), 0);

    const handleCreateInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        // In a real system, we'd have an invoice_items table. 
        // For this demo, we'll store the total in 'invoices'.
        const { error } = await supabase
            .from('invoices')
            .insert([{
                ...invoiceData,
                amount: totalAmount
            }]);

        if (!error) {
            setIsModalOpen(false);
            setItems([{ description: 'Consultation', amount: 0 }]);
            setInvoiceData({
                patient_id: '',
                status: 'UNPAID',
                due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            });
            fetchInitialData();
        } else {
            alert('Error creating invoice: ' + error.message);
        }
        setSubmitting(false);
    };

    const updateInvoiceStatus = async (id: string, status: string) => {
        const { error } = await supabase
            .from('invoices')
            .update({ status })
            .eq('id', id);

        if (!error) fetchInitialData();
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
                <button 
                    className="btn btn-primary"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={18} /> Create Invoice
                </button>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title="Generate New Invoice"
                size="lg"
            >
                <form onSubmit={handleCreateInvoice}>
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Patient</label>
                            <select 
                                className="form-input" 
                                required 
                                value={invoiceData.patient_id}
                                onChange={(e) => setInvoiceData({...invoiceData, patient_id: e.target.value})}
                                style={{ background: 'var(--bg-sidebar)' }}
                            >
                                <option value="">Select Patient</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Due Date</label>
                            <input 
                                type="date" 
                                className="form-input" 
                                required
                                value={invoiceData.due_date}
                                onChange={(e) => setInvoiceData({...invoiceData, due_date: e.target.value})}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h4 style={{ margin: 0 }}>Invoice Items</h4>
                            <button type="button" className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem' }} onClick={handleAddItem}>
                                <Plus size={14} /> Add Item
                            </button>
                        </div>
                        
                        {items.map((item, index) => (
                            <div key={index} className="grid-2" style={{ gridTemplateColumns: '1fr 150px 40px', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                                <input 
                                    className="form-input" 
                                    placeholder="Description (e.g. Paracetamol)" 
                                    value={item.description}
                                    onChange={(e) => {
                                        const newItems = [...items];
                                        newItems[index].description = e.target.value;
                                        setItems(newItems);
                                    }}
                                />
                                <input 
                                    type="number" 
                                    className="form-input" 
                                    placeholder="Amount" 
                                    value={item.amount}
                                    onChange={(e) => {
                                        const newItems = [...items];
                                        newItems[index].amount = Number(e.target.value);
                                        setItems(newItems);
                                    }}
                                />
                                {items.length > 1 && (
                                    <button type="button" style={{ background: 'transparent', border: 'none', color: 'var(--status-danger)', cursor: 'pointer' }} onClick={() => handleRemoveItem(index)}>
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ))}

                        <div style={{ textAlign: 'right', borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '12px' }}>
                            <span className="text-muted">Total Amount:</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', marginLeft: '12px' }}>${totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex-end">
                        <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Creating...' : 'Generate Invoice'}
                        </button>
                    </div>
                </form>
            </Modal>

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
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            {inv.status !== 'PAID' && (
                                                <button 
                                                    className="btn btn-outline" 
                                                    style={{ padding: '6px', color: 'var(--status-success)', borderColor: 'rgba(16, 185, 129, 0.3)' }} 
                                                    onClick={() => updateInvoiceStatus(inv.id, 'PAID')}
                                                    title="Mark as Paid"
                                                >
                                                    <CheckCircle size={14} />
                                                </button>
                                            )}
                                            <button className="btn btn-outline" style={{ padding: '6px' }}><Download size={14} /></button>
                                        </div>
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
                                <span className="text-secondary">Total Paid</span>
                                <span className="font-bold" style={{ color: 'var(--status-success)' }}>${totalRevenue.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="text-secondary">Outstanding</span>
                                <span className="font-bold text-accent">${outstanding.toFixed(2)}</span>
                            </div>
                            <button className="btn btn-outline" style={{ width: '100%', marginTop: '8px' }}>Financial Report</button>
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
