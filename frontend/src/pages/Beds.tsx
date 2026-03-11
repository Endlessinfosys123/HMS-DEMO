import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BedDouble, Info } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Beds = () => {
    const [wards, setWards] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Admission Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedBed, setSelectedBed] = useState<any>(null);
    const [patientId, setPatientId] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        const [wardsRes, patientsRes] = await Promise.all([
            supabase.from('wards').select('*, beds(*)'),
            supabase.from('patients').select('id, first_name, last_name')
        ]);

        if (!wardsRes.error) setWards(wardsRes.data || []);
        if (!patientsRes.error) setPatients(patientsRes.data || []);
        setLoading(false);
    };

    const handleAssignBed = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        const { error } = await supabase
            .from('beds')
            .update({ 
                is_occupied: true, 
                current_patient_id: patientId 
            })
            .eq('id', selectedBed.id);

        if (!error) {
            setIsModalOpen(false);
            setSelectedBed(null);
            setPatientId('');
            fetchInitialData();
        } else {
            alert('Error assigning bed: ' + error.message);
        }
        setSubmitting(false);
    };

    const handleReleaseBed = async (bedId: string) => {
        if (!confirm('Are you sure you want to discharge the patient from this bed?')) return;
        const { error } = await supabase
            .from('beds')
            .update({ 
                is_occupied: false, 
                current_patient_id: null 
            })
            .eq('id', bedId);

        if (!error) fetchInitialData();
    };

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-3xl">Ward & Bed Occupancy</h1>
                <p className="text-muted">Real-time monitoring of hospital capacity and patient admissions.</p>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={`Assign Bed: ${selectedBed?.bed_number}`}
            >
                <form onSubmit={handleAssignBed}>
                    <p className="text-muted mb-4">Please select a patient to admit to this bed.</p>
                    <div className="form-group">
                        <label className="form-label">Patient</label>
                        <select 
                            className="form-input" 
                            required 
                            value={patientId}
                            onChange={(e) => setPatientId(e.target.value)}
                            style={{ background: 'var(--bg-sidebar)' }}
                        >
                            <option value="">Select Patient</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-end">
                        <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Assigning...' : 'Confirm Admission'}
                        </button>
                    </div>
                </form>
            </Modal>

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
                                        onClick={() => {
                                            if (bed.is_occupied) {
                                                handleReleaseBed(bed.id);
                                            } else {
                                                setSelectedBed(bed);
                                                setIsModalOpen(true);
                                            }
                                        }}
                                        style={{
                                            aspectRatio: '1',
                                            borderRadius: '6px',
                                            background: bed.is_occupied ? 'var(--status-danger)' : 'rgba(255,255,255,0.05)',
                                            opacity: bed.is_occupied ? 0.8 : 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: bed.is_occupied ? '#fff' : 'var(--text-muted)',
                                            cursor: 'pointer',
                                            border: '1px solid var(--border-light)'
                                        }}
                                        className="bed-icon"
                                    >
                                        <BedDouble size={16} />
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
