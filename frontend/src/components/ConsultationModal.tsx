import { useState } from 'react';
import { Modal } from './Modal';
import { clinicalTemplates, type Specialty } from '../data/templates';
import { supabase } from '../lib/supabase';
import { FlaskConical, Pill, Save } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    patientId: string;
    onSuccess: () => void;
}

export const ConsultationModal = ({ isOpen, onClose, patientId, onSuccess }: Props) => {
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        diagnosis: '',
        notes: '',
        sendToLab: false,
        sendToPharmacy: false
    });

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
                    diagnosis: formData.diagnosis,
                    notes: formData.notes
                }]);

            if (consultError) throw consultError;

            // 2. Handle Internal Orders (Mock Logic for SaaS Demo)
            if (formData.sendToLab) {
                console.log("Internal Order: Lab requested for patient", patientId);
                // Real implementation would insert into lab_orders
            }
            if (formData.sendToPharmacy) {
                console.log("Internal Order: Pharmacy requested for patient", patientId);
                // Real implementation would insert into prescriptions
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

                    <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
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
