import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Search, CheckCircle, Clock, Beaker, FileText } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Lab = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [tests, setTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Order Modal State
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [orderSubmitting, setOrderSubmitting] = useState(false);
    const [orderForm, setOrderForm] = useState({ patient_id: '', test_id: '' });

    // Result Modal State
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [resultSubmitting, setResultSubmitting] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [resultText, setResultText] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        const [ordersRes, patientsRes, testsRes] = await Promise.all([
            supabase.from('lab_orders').select('*, patients(first_name, last_name), lab_tests(name)').order('created_at', { ascending: false }),
            supabase.from('patients').select('id, first_name, last_name'),
            supabase.from('lab_tests').select('id, name')
        ]);

        if (!ordersRes.error) setOrders(ordersRes.data || []);
        if (!patientsRes.error) setPatients(patientsRes.data || []);
        if (!testsRes.error) setTests(testsRes.data || []);
        setLoading(false);
    };

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setOrderSubmitting(true);
        const { error } = await supabase.from('lab_orders').insert([orderForm]);
        if (!error) {
            setIsOrderModalOpen(false);
            setOrderForm({ patient_id: '', test_id: '' });
            fetchInitialData();
        } else {
            alert('Error creating order: ' + error.message);
        }
        setOrderSubmitting(false);
    };

    const handleSaveResult = async (e: React.FormEvent) => {
        e.preventDefault();
        setResultSubmitting(true);
        const { error } = await supabase
            .from('lab_orders')
            .update({ result: resultText, status: 'COMPLETED' })
            .eq('id', selectedOrder.id);

        if (!error) {
            setIsResultModalOpen(false);
            setSelectedOrder(null);
            setResultText('');
            fetchInitialData();
        } else {
            alert('Error saving result: ' + error.message);
        }
        setResultSubmitting(false);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Laboratory System</h1>
                    <p className="text-muted">Track diagnostic tests and results.</p>
                </div>
                <button 
                    className="btn btn-primary"
                    onClick={() => setIsOrderModalOpen(true)}
                >
                    <Plus size={18} /> New Lab Order
                </button>
            </div>

            {/* New Order Modal */}
            <Modal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} title="Place New Lab Order">
                <form onSubmit={handleCreateOrder}>
                    <div className="form-group">
                        <label className="form-label">Patient</label>
                        <select 
                            className="form-input" 
                            required 
                            value={orderForm.patient_id}
                            onChange={(e) => setOrderForm({...orderForm, patient_id: e.target.value})}
                            style={{ background: 'var(--bg-sidebar)' }}
                        >
                            <option value="">Select Patient</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Test Type</label>
                        <select 
                            className="form-input" 
                            required 
                            value={orderForm.test_id}
                            onChange={(e) => setOrderForm({...orderForm, test_id: e.target.value})}
                            style={{ background: 'var(--bg-sidebar)' }}
                        >
                            <option value="">Select Test</option>
                            {tests.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-end">
                        <button type="button" className="btn btn-outline" onClick={() => setIsOrderModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={orderSubmitting}>
                            {orderSubmitting ? 'Ordering...' : 'Place Order'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Record Result Modal */}
            <Modal isOpen={isResultModalOpen} onClose={() => setIsResultModalOpen(false)} title="Record Test Result">
                {selectedOrder && (
                    <form onSubmit={handleSaveResult}>
                        <div style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Patient</p>
                            <p style={{ fontWeight: 'bold' }}>{selectedOrder.patients?.first_name} {selectedOrder.patients?.last_name}</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>Test requested</p>
                            <p style={{ fontWeight: 'bold' }}>{selectedOrder.lab_tests?.name}</p>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Test Results / Findings</label>
                            <textarea 
                                className="form-input" 
                                required 
                                rows={5}
                                value={resultText}
                                onChange={(e) => setResultText(e.target.value)}
                                placeholder="Enter laboratory findings here..."
                            />
                        </div>
                        <div className="flex-end">
                            <button type="button" className="btn btn-outline" onClick={() => setIsResultModalOpen(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={resultSubmitting}>
                                {resultSubmitting ? 'Saving...' : 'Complete & Send Result'}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 16px', width: '350px' }}>
                        <Search size={18} className="text-muted" style={{ marginRight: '8px' }} />
                        <input
                            type="text"
                            placeholder="Search by Patient or Test..."
                            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>Syncing Lab Orders...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <th style={{ padding: '12px 16px' }}>ORDER ID</th>
                                <th style={{ padding: '12px 16px' }}>PATIENT</th>
                                <th style={{ padding: '12px 16px' }}>TEST NAME</th>
                                <th style={{ padding: '12px 16px' }}>STATUS</th>
                                <th style={{ padding: '12px 16px' }}>DATE</th>
                                <th style={{ padding: '12px 16px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? orders.map((order) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <td style={{ padding: '16px', fontWeight: '600' }}>#{order.id.slice(0, 8).toUpperCase()}</td>
                                    <td style={{ padding: '16px' }}>{order.patients?.first_name} {order.patients?.last_name}</td>
                                    <td style={{ padding: '16px' }}>{order.lab_tests?.name}</td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: order.status === 'COMPLETED' ? 'var(--status-success)' : 'var(--status-warning)' }}>
                                            {order.status === 'COMPLETED' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{order.status}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        {order.status === 'PENDING' ? (
                                            <button 
                                                className="btn btn-outline" 
                                                style={{ fontSize: '0.8rem', padding: '6px 12px', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setIsResultModalOpen(true);
                                                }}
                                            >
                                                <Beaker size={14} /> Record Result
                                            </button>
                                        ) : (
                                            <button 
                                                className="btn btn-outline" 
                                                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                                                onClick={() => {
                                                    alert('Result: ' + order.result);
                                                }}
                                            >
                                                <FileText size={14} /> View
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No lab orders found.
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
