import { useState } from 'react';
import { Modal } from './Modal';
import { clinicalTemplates, type Specialty } from '../data/templates';
import { supabase } from '../lib/supabase';
import { FlaskConical, Pill, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    patientId: string;
    onSuccess: () => void;
}

export const ConsultationModal = ({ isOpen, onClose, patientId, onSuccess }: Props) => {
    const { profile } = useAuth();
    const [labTests, setLabTests] = useState<any[]>([]);
    const [inventory, setInventory] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        diagnosis: '',
        notes: '',
        sendToLab: false,
        sendToPharmacy: false,
        labTestId: '',
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchOptions();
        }
    }, [isOpen]);

    const fetchOptions = async () => {
        const [labRes, invRes] = await Promise.all([
            supabase.from('lab_tests').select('*'),
            supabase.from('inventory').select('*').gt('stock_quantity', 0)
        ]);
        if (!labRes.error) setLabTests(labRes.data || []);
        if (!invRes.error) setInventory(invRes.data || []);
    };

    const applyTemplate = (specialty: Specialty) => {
        const template = clinicalTemplates[specialty];
        setFormData({
            ...formData,
            diagnosis: template.diagnosis,
            notes: `Chief Complaint: ${template.chief_complaint}\n\nExamination:\n${template.examination}\n\nNotes:\n${template.notes}`
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // 1. Create Consultation
            const { error: consultError } = await supabase
                .from('consultations')
                .insert([{
                    patient_id: patientId,
                    clinic_id: profile?.clinic_id,
                    diagnosis: formData.diagnosis,
                    notes: formData.notes
                }]);

            if (consultError) throw consultError;

            // 2. Handle Lab Order
            if (formData.sendToLab && formData.labTestId) {
                const { error: labError } = await supabase
                    .from('lab_orders')
                    .insert([{
                        clinic_id: profile?.clinic_id,
                        patient_id: patientId,
                        test_id: formData.labTestId,
                        status: 'PENDING'
                    }]);
                if (labError) console.error("Lab Error:", labError);
            }

            // 3. Handle Prescription
            if (formData.sendToPharmacy && formData.medicationName) {
                const { error: prescError } = await supabase
                    .from('prescriptions')
                    .insert([{
                        clinic_id: profile?.clinic_id,
                        patient_id: patientId,
                        doctor_id: profile?.id,
                        medication_name: formData.medicationName,
                        dosage: formData.dosage,
                        frequency: formData.frequency,
                        duration: formData.duration
                    }]);
                if (prescError) console.error("Prescription Error:", prescError);
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            alert("Error saving consultation: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Clinical Consultation" size="lg">
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px' }}>
                {/* Template Sidebar */}
                <div style={{ borderRight: '1px solid var(--border-light)', paddingRight: '16px' }}>
                    <h5 style={{ marginBottom: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Templates</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(Object.keys(clinicalTemplates) as Specialty[]).map(s => (
                            <button 
                                key={s}
                                onClick={() => applyTemplate(s)}
                                style={{ textAlign: 'left', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', fontSize: '0.8rem', color: '#fff', cursor: 'pointer' }}
                                className="patient-row"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Primary Diagnosis</label>
                        <input 
                            className="form-input" 
                            required 
                            value={formData.diagnosis}
                            onChange={e => setFormData({...formData, diagnosis: e.target.value})}
                            placeholder="e.g. Type 2 Diabetes Mellitus"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Clinical Notes & Treatment Plan</label>
                        <textarea 
                            className="form-input" 
                            rows={8}
                            required
                            value={formData.notes}
                            onChange={e => setFormData({...formData, notes: e.target.value})}
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input 
                                    type="checkbox" 
                                    id="lab" 
                                    checked={formData.sendToLab}
                                    onChange={e => setFormData({...formData, sendToLab: e.target.checked})}
                                />
                                <label htmlFor="lab" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <FlaskConical size={14} className="text-accent" /> Notify Lab
                                </label>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input 
                                    type="checkbox" 
                                    id="pharmacy" 
                                    checked={formData.sendToPharmacy}
                                    onChange={e => setFormData({...formData, sendToPharmacy: e.target.checked})}
                                />
                                <label htmlFor="pharmacy" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Pill size={14} className="text-accent" /> Notify Pharmacy
                                </label>
                            </div>
                        </div>

                        {formData.sendToLab && (
                            <div className="animate-fade-in" style={{ marginTop: '8px' }}>
                                <select 
                                    className="form-input" 
                                    value={formData.labTestId}
                                    onChange={e => setFormData({...formData, labTestId: e.target.value})}
                                    required
                                >
                                    <option value="">Select Lab Test...</option>
                                    {labTests.map(t => <option key={t.id} value={t.id}>{t.name} (₹{t.price})</option>)}
                                    {labTests.length === 0 && <option disabled>No tests configured for this clinic</option>}
                                </select>
                            </div>
                        )}

                        {formData.sendToPharmacy && (
                            <div className="animate-fade-in" style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <input 
                                    list="inventory-list"
                                    placeholder="Medication Name"
                                    className="form-input"
                                    value={formData.medicationName}
                                    onChange={e => setFormData({...formData, medicationName: e.target.value})}
                                    required
                                />
                                <datalist id="inventory-list">
                                    {inventory.map(i => <option key={i.id} value={i.item_name} />)}
                                </datalist>
                                <input 
                                    placeholder="Dosage (e.g. 500mg)"
                                    className="form-input"
                                    value={formData.dosage}
                                    onChange={e => setFormData({...formData, dosage: e.target.value})}
                                />
                                <input 
                                    placeholder="Freq (e.g. 1-0-1)"
                                    className="form-input"
                                    value={formData.frequency}
                                    onChange={e => setFormData({...formData, frequency: e.target.value})}
                                />
                                <input 
                                    placeholder="Duration (e.g. 5 Days)"
                                    className="form-input"
                                    value={formData.duration}
                                    onChange={e => setFormData({...formData, duration: e.target.value})}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex-end">
                        <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            <Save size={16} /> {submitting ? 'Saving...' : 'Finalize Record'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
