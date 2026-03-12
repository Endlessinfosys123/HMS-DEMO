import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Pill, Plus, Search, AlertTriangle, ShoppingCart, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Pharmacy = () => {
    const [inventory, setInventory] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPOSOpen, setIsPOSOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [posItem, setPosItem] = useState<any>(null);
    const [sellQuantity, setSellQuantity] = useState(1);
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        item_name: '',
        category: 'Medicine',
        stock_quantity: 0,
        price: 0,
        supplier: ''
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        const [invRes, patientRes] = await Promise.all([
            supabase.from('inventory').select('*').order('item_name', { ascending: true }),
            supabase.from('patients').select('id, first_name, last_name')
        ]);

        if (!invRes.error) setInventory(invRes.data || []);
        if (!patientRes.error) setPatients(patientRes.data || []);
        setLoading(false);
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        const { error } = await supabase
            .from('inventory')
            .insert([formData]);

        if (!error) {
            setIsModalOpen(false);
            setFormData({
                item_name: '',
                category: 'Medicine',
                stock_quantity: 0,
                price: 0,
                supplier: ''
            });
            fetchInventory();
        } else {
            alert('Error adding item: ' + error.message);
        }
        setSubmitting(false);
    };

    const handleSell = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!posItem || sellQuantity > posItem.stock_quantity || !selectedPatientId) {
            alert('Selection incomplete or insufficient stock!');
            return;
        }
        setSubmitting(true);
        
        try {
            // 1. Update Inventory
            const { error: invError } = await supabase
                .from('inventory')
                .update({ stock_quantity: posItem.stock_quantity - sellQuantity })
                .eq('id', posItem.id);

            if (invError) throw invError;

            // 2. Create Invoice
            const { error: invoiceError } = await supabase
                .from('invoices')
                .insert([{
                    patient_id: selectedPatientId,
                    amount: posItem.price * sellQuantity,
                    status: 'PAID',
                    due_date: new Date().toISOString().split('T')[0]
                }]);

            if (invoiceError) throw invoiceError;

            setIsPOSOpen(false);
            setSellQuantity(1);
            setSelectedPatientId('');
            fetchInventory();
            alert(`Sale authorized! Invoice created for ${sellQuantity} x ${posItem.item_name}`);
        } catch (error: any) {
            alert('Error during transaction: ' + error.message);
        }
        setSubmitting(false);
    };

    const deleteItem = async (id: string) => {
        if (!confirm('Are you sure you want to remove this item?')) return;
        const { error } = await supabase.from('inventory').delete().eq('id', id);
        if (!error) fetchInventory();
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Pharmacy & Inventory</h1>
                    <p className="text-muted">Monitor stock levels and manage medication catalog.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-outline" onClick={() => setIsPOSOpen(true)}><ShoppingCart size={18} /> Point of Sale</button>
                    <button 
                        className="btn btn-primary"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus size={18} /> Add Medicine
                    </button>
                </div>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title="Add New Inventory Item"
                size="md"
            >
                <form onSubmit={handleAddItem}>
                    <div className="form-group">
                        <label className="form-label">Item Name</label>
                        <input 
                            className="form-input" 
                            required 
                            value={formData.item_name}
                            onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                            placeholder="e.g. Paracetamol 500mg"
                        />
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select 
                                className="form-input" 
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                style={{ background: 'var(--bg-sidebar)' }}
                            >
                                <option value="Medicine">Medicine</option>
                                <option value="Equipment">Equipment</option>
                                <option value="Consumable">Consumable</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Supplier</label>
                            <input 
                                className="form-input" 
                                value={formData.supplier}
                                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                                placeholder="Generic Corp"
                            />
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Initial Stock</label>
                            <input 
                                type="number"
                                className="form-input" 
                                required 
                                value={formData.stock_quantity}
                                onChange={(e) => setFormData({...formData, stock_quantity: Number(e.target.value)})}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Unit Price (₹)</label>
                            <input 
                                type="number"
                                step="0.01"
                                className="form-input" 
                                required 
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                            />
                        </div>
                    </div>

                    <div className="flex-end">
                        <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Adding...' : 'Add to Inventory'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Point of Sale Modal */}
            <Modal
                isOpen={isPOSOpen}
                onClose={() => setIsPOSOpen(false)}
                title="Point of Sale / Dispensing"
                size="md"
            >
                <form onSubmit={handleSell}>
                    <div className="form-group">
                        <label className="form-label">Select Item</label>
                        <select 
                            className="form-input" 
                            required
                            style={{ background: 'var(--bg-sidebar)' }}
                            onChange={(e) => {
                                const item = inventory.find(i => i.id === e.target.value);
                                setPosItem(item);
                            }}
                        >
                            <option value="">Select Medication</option>
                            {inventory.filter(i => i.stock_quantity > 0).map(i => (
                                <option key={i.id} value={i.id}>{i.item_name} (Stock: {i.stock_quantity})</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Patient</label>
                        <select 
                            className="form-input" 
                            required
                            style={{ background: 'var(--bg-sidebar)' }}
                            value={selectedPatientId}
                            onChange={(e) => setSelectedPatientId(e.target.value)}
                        >
                            <option value="">Select Patient</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Quantity</label>
                        <input 
                            type="number" 
                            className="form-input" 
                            min={1} 
                            max={posItem?.stock_quantity || 1}
                            value={sellQuantity}
                            onChange={(e) => setSellQuantity(Number(e.target.value))}
                        />
                    </div>

                    {posItem && (
                        <div style={{ padding: '20px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(115, 63, 241, 0.1))', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                                <span className="text-muted">Item:</span>
                                <span style={{ fontWeight: '600' }}>{posItem.item_name}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                                <span className="text-muted">Price x Qty:</span>
                                <span>₹{posItem.price.toFixed(2)} x {sellQuantity}</span>
                            </div>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '12px 0', borderStyle: 'dashed', borderWidth: '1px 0 0 0' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                <span>Total:</span>
                                <span className="text-accent" style={{ color: 'var(--accent-primary)' }}>₹{(posItem.price * sellQuantity).toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    <div className="flex-end">
                        <button type="button" className="btn btn-outline" onClick={() => setIsPOSOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting || !posItem}>
                            {submitting ? 'Processing...' : 'Complete Sale'}
                        </button>
                    </div>
                </form>
            </Modal>

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 16px', width: '350px' }}>
                        <Search size={18} className="text-muted" style={{ marginRight: '8px' }} />
                        <input
                            type="text"
                            placeholder="Search medications..."
                            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                            {inventory.filter(i => i.item_name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? 
                                inventory.filter(i => i.item_name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Pill size={16} className="text-accent" />
                                            <span style={{ fontWeight: '600' }}>{item.item_name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>{item.category}</td>
                                    <td style={{ padding: '16px' }}>₹{item.price.toFixed(2)}</td>
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
                                        <button 
                                            className="btn btn-outline" 
                                            style={{ fontSize: '0.8rem', padding: '6px 12px', color: 'var(--status-danger)' }}
                                            onClick={() => deleteItem(item.id)}
                                        >
                                            <Trash2 size={14} style={{ marginRight: '4px' }} /> Remove
                                        </button>
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
