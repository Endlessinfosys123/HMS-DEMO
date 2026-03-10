import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Plus, MoreVertical, ExternalLink } from 'lucide-react';

export const Patients = () => {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error) setPatients(data || []);
        setLoading(false);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Patient Directory</h1>
                    <p className="text-muted">Manage health records and admission history.</p>
                </div>
                <button className="btn btn-primary"><Plus size={18} /> Register Patient</button>
            </div>

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 16px', width: '350px' }}>
                        <Search size={18} className="text-muted" style={{ marginRight: '8px' }} />
                        <input
                            type="text"
                            placeholder="Search by ID, Name or Phone..."
                            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
                        />
                    </div>
                    <button className="btn btn-outline" style={{ fontSize: '0.85rem' }}>Filter</button>
                </div>

                {loading ? (
                    <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading records...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <th style={{ padding: '12px 16px' }}>NAME</th>
                                <th style={{ padding: '12px 16px' }}>GENDER / AGE</th>
                                <th style={{ padding: '12px 16px' }}>PHONE</th>
                                <th style={{ padding: '12px 16px' }}>STATUS</th>
                                <th style={{ padding: '12px 16px' }}>ADMISSION</th>
                                <th style={{ padding: '12px 16px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.length > 0 ? patients.map((p) => (
                                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }} className="patient-row">
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: '600' }}>{p.first_name} {p.last_name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{p.id.slice(0, 8).toUpperCase()}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>{p.gender || 'N/A'}</td>
                                    <td style={{ padding: '16px' }}>{p.phone}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-success)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>Active</span>
                                    </td>
                                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>-</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button className="btn btn-outline" style={{ padding: '6px' }}><ExternalLink size={14} /></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No patients found. Get started by registering one!
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
