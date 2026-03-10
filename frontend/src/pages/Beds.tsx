import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BedDouble, Info } from 'lucide-react';

export const Beds = () => {
    const [wards, setWards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWards();
    }, []);

    const fetchWards = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('wards')
            .select('*, beds(*)');

        if (!error) setWards(data || []);
        setLoading(false);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-3xl">Ward & Bed Occupancy</h1>
                <p className="text-muted">Real-time monitoring of hospital capacity.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {loading ? (
                    <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Syncing with Supabase...</div>
                ) : wards.length > 0 ? wards.map((ward) => {
                    const occupied = ward.beds?.filter((b: any) => b.is_occupied).length || 0;
                    const total = ward.capacity;
                    const percentage = (occupied / total) * 100;

                    return (
                        <div key={ward.id} className="glass-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{ward.name}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ward.type} Ward</p>
                                </div>
                                <div style={{ padding: '4px 10px', background: percentage > 80 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: percentage > 80 ? 'var(--status-danger)' : 'var(--status-success)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                    {percentage > 80 ? 'Critical' : 'Available'}
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                                    <span className="text-secondary">Occupancy</span>
                                    <span className="font-bold">{occupied} / {total} Beds</span>
                                </div>
                                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${percentage}%`, height: '100%', background: percentage > 80 ? 'var(--status-danger)' : 'var(--accent-primary)', borderRadius: '4px' }}></div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                                {ward.beds?.map((bed: any) => (
                                    <div
                                        key={bed.id}
                                        title={`Bed ${bed.bed_number} - ${bed.is_occupied ? 'Occupied' : 'Free'}`}
                                        style={{
                                            aspectRatio: '1',
                                            borderRadius: '6px',
                                            background: bed.is_occupied ? 'var(--status-danger)' : 'rgba(255,255,255,0.05)',
                                            opacity: bed.is_occupied ? 0.6 : 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: bed.is_occupied ? '#fff' : 'var(--text-muted)'
                                        }}
                                    >
                                        <BedDouble size={14} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }) : (
                    <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px' }}>
                        <Info size={40} className="text-muted" style={{ marginBottom: '16px' }} />
                        <p className="text-muted">No wards configured in database yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
