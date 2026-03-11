import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserPlus, LogOut, Activity, Search } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Inpatients = () => {
    const [admissions, setAdmissions] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [availableBeds, setAvailableBeds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Admission Modal State
    const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [admissionData, setAdmissionData] = useState({
        patient_id: '',
        bed_id: '',
        reason: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        const [admRes, patientRes, bedRes] = await Promise.all([
            supabase.from('beds').select('*, patients(first_name, last_name)').eq('is_occupied', true),
            supabase.from('patients').select('id, first_name, last_name'),
            supabase.from('beds').select('id, bed_number, wards(name)').eq('is_occupied', false)
        ]);

        if (!admRes.error) setAdmissions(admRes.data || []);
        if (!patientRes.error) setPatients(patientRes.data || []);
        if (!bedRes.error) setAvailableBeds(bedRes.data || []);
        setLoading(false);
    };

    const handleAdmission = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        const { error } = await supabase
            .from('beds')
            .update({ 
                is_occupied: true, 
                current_patient_id: admissionData.patient_id 
            })
            .eq('id', admissionData.bed_id);

        if (!error) {
            setIsAdmissionModalOpen(false);
            setAdmissionData({ patient_id: '', bed_id: '', reason: '' });
            fetchInitialData();
        } else {
            alert('Error during admission: ' + error.message);
        }
        setSubmitting(false);
    };

    const handleDischarge = async (bedId: string) => {
        if (!confirm('Proceed with patient discharge? This will free the assigned bed.')) return;
        
        const { error } = await supabase
            .from('beds')
            .update({ 
                is_occupied: false, 
                current_patient_id: null 
            })
            .eq('id', bedId);

        if (!error) fetchInitialData();
        else alert('Error during discharge: ' + error.message);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Inpatient Management</h1>
                    <p className="text-muted">Currently admitted patients and ward status.</p>
                </div>
                <button 
                    className="btn btn-primary"
                    onClick={() => setIsAdmissionModalOpen(true)}
                >
                    <UserPlus size={18} /> New Admission
                </button>
            </div>

            <Modal 
                isOpen={isAdmissionModalOpen} 
                onClose={() => setIsAdmissionModalOpen(false)} 
                title="Direct Inpatient Admission"
                size="md"
            >
                <form onSubmit={handleAdmission}>
                    <div className="form-group">
                        <label className="form-label">Patient</label>
                        <select 
                            className="form-input" 
                            required 
                            value={admissionData.patient_id}
                            onChange={(e) => setAdmissionData({...admissionData, patient_id: e.target.value})}
                            style={{ background: 'var(--bg-sidebar)' }}
                        >
                            <option value="">Select Patient</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Assign Bed</label>
                        <select 
                            className="form-input" 
                            required 
                            value={admissionData.bed_id}
                            onChange={(e) => setAdmissionData({...admissionData, bed_id: e.target.value})}
                            style={{ background: 'var(--bg-sidebar)' }}
                        >
                            <option value="">Select Available Bed</option>
                            {availableBeds.map(b => (
                                <option key={b.id} value={b.id}>Room {b.bed_number} ({b.wards?.name})</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Admission Reason</label>
                        <textarea 
                            className="form-input" 
                            rows={3}
                            value={admissionData.reason}
                            onChange={(e) => setAdmissionData({...admissionData, reason: e.target.value})}
                            placeholder="Initial diagnosis / observation required"
                        />
                    </div>

                    <div className="flex-end">
                        <button type="button" className="btn btn-outline" onClick={() => setIsAdmissionModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Processing...' : 'Confirm Admission'}
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
                                        <button 
                                            className="btn btn-outline" 
                                            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                                            onClick={() => handleDischarge(adm.id)}
                                        >
                                            <LogOut size={14} style={{ marginRight: '4px' }} /> Discharge
                                        </button>
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
