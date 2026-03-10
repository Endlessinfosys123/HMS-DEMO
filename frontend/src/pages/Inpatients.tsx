import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserPlus, LogOut, Activity, Search } from 'lucide-react';

export const Inpatients = () => {
    const [admissions, setAdmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdmissions();
    }, []);

    const fetchAdmissions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('beds')
            .select('*, patients(first_name, last_name)')
            .eq('is_occupied', true);

        if (!error) setAdmissions(data || []);
        setLoading(false);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Inpatient Management</h1>
                    <p className="text-muted">Currently admitted patients and ward status.</p>
                </div>
                <button className="btn btn-primary"><UserPlus size={18} /> New Admission</button>
            </div>

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 16px', width: '350px' }}>
                        <Search size={18} className="text-muted" style={{ marginRight: '8px' }} />
                        <input
                            type="text"
                            placeholder="Search by Patient or Room..."
                            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading admissions...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <th style={{ padding: '12px 16px' }}>PATIENT</th>
                                <th style={{ padding: '12px 16px' }}>WARD / BED</th>
                                <th style={{ padding: '12px 16px' }}>ADMISSION DATE</th>
                                <th style={{ padding: '12px 16px' }}>STATUS</th>
                                <th style={{ padding: '12px 16px' }}>Vitals</th>
                                <th style={{ padding: '12px 16px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {admissions.length > 0 ? admissions.map((adm) => (
                                <tr key={adm.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: '600' }}>{adm.patients?.first_name} {adm.patients?.last_name}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>Bed {adm.bed_number}</td>
                                    <td style={{ padding: '16px' }}>{new Date(adm.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>Stable</span>
                                    </td>
                                    <td style={{ padding: '16px' }}><Activity size={16} className="text-accent" /></td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px' }}><LogOut size={14} style={{ marginRight: '4px' }} /> Discharge</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No patients currently admitted to any wards.
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
