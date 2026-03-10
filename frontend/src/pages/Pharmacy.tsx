import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Pill, Plus, Search, AlertTriangle, ShoppingCart } from 'lucide-react';

export const Pharmacy = () => {
    const [inventory, setInventory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('inventory')
            .select('*')
            .order('item_name', { ascending: true });

        if (!error) setInventory(data || []);
        setLoading(false);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Pharmacy & Inventory</h1>
                    <p className="text-muted">Monitor stock levels and manage medication catalog.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-outline"><ShoppingCart size={18} /> Point of Sale</button>
                    <button className="btn btn-primary"><Plus size={18} /> Add Medicine</button>
                </div>
            </div>

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 16px', width: '350px' }}>
                        <Search size={18} className="text-muted" style={{ marginRight: '8px' }} />
                        <input
                            type="text"
                            placeholder="Search medications..."
                            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>Syncing inventory...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <th style={{ padding: '12px 16px' }}>ITEM NAME</th>
                                <th style={{ padding: '12px 16px' }}>CATEGORY</th>
                                <th style={{ padding: '12px 16px' }}>PRICE</th>
                                <th style={{ padding: '12px 16px' }}>STOCK</th>
                                <th style={{ padding: '12px 16px' }}>SUPPLIER</th>
                                <th style={{ padding: '12px 16px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.length > 0 ? inventory.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Pill size={16} className="text-accent" />
                                            <span style={{ fontWeight: '600' }}>{item.item_name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>{item.category}</td>
                                    <td style={{ padding: '16px' }}>${item.price.toFixed(2)}</td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontWeight: 'bold', color: item.stock_quantity < 20 ? 'var(--status-danger)' : 'var(--text-primary)' }}>
                                                {item.stock_quantity}
                                            </span>
                                            {item.stock_quantity < 20 && <AlertTriangle size={14} className="text-danger" />}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{item.supplier || 'Generic Corp'}</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>Edit</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        Pharmacy inventory is currently empty.
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
