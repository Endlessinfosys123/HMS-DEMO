import { useState } from 'react';
import { Search, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';

const MOCK_PATIENTS = [
    { id: '1', name: 'John Doe', age: 45, gender: 'Male', blood: 'O+', lastVisit: '2026-03-08' },
    { id: '2', name: 'Jane Smith', age: 32, gender: 'Female', blood: 'A-', lastVisit: '2026-03-10' },
    { id: '3', name: 'Robert Johnson', age: 58, gender: 'Male', blood: 'B+', lastVisit: '2026-02-28' },
    { id: '4', name: 'Emily Davis', age: 24, gender: 'Female', blood: 'AB+', lastVisit: '2026-03-05' },
    { id: '5', name: 'Michael Wilson', age: 67, gender: 'Male', blood: 'O-', lastVisit: '2026-01-15' },
];

export const Patients = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Patient Management</h1>
                    <p className="text-muted">View, search, and manage hospital patients.</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} /> Register Patient
                </button>
            </div>

            <div className="glass-card mb-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="header-search" style={{ border: '1px solid var(--border-light)', width: '350px' }}>
                        <Search size={18} className="text-muted" />
                        <input
                            type="text"
                            placeholder="Search by name, ID, or phone number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ marginLeft: '8px' }}
                        />
                    </div>
                    <div className="flex gap-4">
                        <button className="btn btn-outline text-sm">Filter</button>
                        <button className="btn btn-outline text-sm">Export CSV</button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '16px' }}>ID</th>
                                <th style={{ padding: '16px' }}>Patient Name</th>
                                <th style={{ padding: '16px' }}>Age/Gender</th>
                                <th style={{ padding: '16px' }}>Blood Group</th>
                                <th style={{ padding: '16px' }}>Last Visit</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_PATIENTS.map((p, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="hover:bg-white/5 transition-colors cursor-pointer">
                                    <td style={{ padding: '16px', fontWeight: '500', color: 'var(--text-muted)' }}>#{p.id.padStart(4, '0')}</td>
                                    <td style={{ padding: '16px', fontWeight: 'bold' }}>{p.name}</td>
                                    <td style={{ padding: '16px' }}>{p.age} / {p.gender}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            background: 'rgba(239, 68, 68, 0.2)',
                                            color: '#ef4444',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {p.blood}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{p.lastVisit}</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div className="flex justify-end gap-2">
                                            <button className="btn btn-outline" style={{ padding: '6px' }} title="Edit">
                                                <Edit size={16} />
                                            </button>
                                            <button className="btn btn-outline" style={{ padding: '6px' }} title="Delete">
                                                <Trash2 size={16} className="text-red-500" />
                                            </button>
                                            <button className="btn btn-outline" style={{ padding: '6px' }}>
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
