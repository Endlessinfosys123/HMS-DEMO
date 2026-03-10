import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Search, CheckCircle, Clock } from 'lucide-react';

export const Lab = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('lab_orders')
            .select('*, patients(first_name, last_name), lab_tests(name)')
            .order('created_at', { ascending: false });

        if (!error) setOrders(data || []);
        setLoading(false);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Laboratory System</h1>
                    <p className="text-muted">Track diagnostic tests and results.</p>
                </div>
                <button className="btn btn-primary"><Plus size={18} /> New Lab Order</button>
            </div>

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
                                        <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>View Results</button>
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
