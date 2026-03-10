import { useState } from 'react';
import { Pill, Box, AlertTriangle, Plus, Search } from 'lucide-react';

const MOCK_INVENTORY = [
    { id: '1', name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 1540, status: 'In Stock' },
    { id: '2', name: 'Paracetamol 650mg', category: 'Analgesic', stock: 45, status: 'Low Stock' },
    { id: '3', name: 'Ibuprofen 400mg', category: 'NSAID', stock: 890, status: 'In Stock' },
    { id: '4', name: 'Cetirizine 10mg', category: 'Antihistamine', stock: 0, status: 'Out of Stock' },
    { id: '5', name: 'Omeprazole 20mg', category: 'Antacid', stock: 320, status: 'In Stock' },
];

export const Pharmacy = () => {
    const [activeTab, setActiveTab] = useState('inventory');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Pharmacy & Inventory</h1>
                    <p className="text-muted">Manage medicines, stock levels, and dispensaries.</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} /> Add New Item
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div className="glass-card flex items-center gap-4">
                    <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--status-info)', color: 'white' }}>
                        <Pill size={24} />
                    </div>
                    <div>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Total Items</p>
                        <h3 className="text-2xl font-bold">1,425</h3>
                    </div>
                </div>

                <div className="glass-card flex items-center gap-4">
                    <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--status-warning)', color: 'white' }}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Low Stock</p>
                        <h3 className="text-2xl font-bold">12</h3>
                    </div>
                </div>

                <div className="glass-card flex items-center gap-4">
                    <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--status-success)', color: 'white' }}>
                        <Box size={24} />
                    </div>
                    <div>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Dispensaries Today</p>
                        <h3 className="text-2xl font-bold">84</h3>
                    </div>
                </div>
            </div>

            <div className="glass-card">
                <div className="flex border-b border-[var(--border-light)] mb-4">
                    <button
                        className={`px-4 py-2 font-bold transition-colors ${activeTab === 'inventory' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-muted'}`}
                        onClick={() => setActiveTab('inventory')}
                    >
                        Inventory List
                    </button>
                    <button
                        className={`px-4 py-2 font-bold transition-colors ${activeTab === 'orders' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-muted'}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        Purchase Orders
                    </button>
                </div>

                {activeTab === 'inventory' && (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <div className="header-search" style={{ border: '1px solid var(--border-light)', width: '300px' }}>
                                <Search size={18} className="text-muted" />
                                <input type="text" placeholder="Search medicines..." style={{ marginLeft: '8px' }} />
                            </div>
                            <button className="btn btn-outline text-sm">Filter Category</button>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                                    <th style={{ padding: '12px' }}>Item ID</th>
                                    <th style={{ padding: '12px' }}>Name</th>
                                    <th style={{ padding: '12px' }}>Category</th>
                                    <th style={{ padding: '12px' }}>Stock Qty</th>
                                    <th style={{ padding: '12px' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_INVENTORY.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="hover:bg-white/5 cursor-pointer">
                                        <td style={{ padding: '12px', color: 'var(--text-muted)' }}>#{item.id.padStart(4, '0')}</td>
                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.name}</td>
                                        <td style={{ padding: '12px' }}>{item.category}</td>
                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.stock}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{
                                                padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                                                background: item.status === 'In Stock' ? 'var(--status-success-bg)' : item.status === 'Low Stock' ? 'var(--status-warning-bg)' : 'var(--status-danger-bg)',
                                                color: item.status === 'In Stock' ? 'var(--status-success)' : item.status === 'Low Stock' ? 'var(--status-warning)' : 'var(--status-danger)'
                                            }}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="animate-fade-in text-center p-8 text-muted">
                        Purchase Orders Management interface will appear here.
                    </div>
                )}
            </div>
        </div>
    );
};
