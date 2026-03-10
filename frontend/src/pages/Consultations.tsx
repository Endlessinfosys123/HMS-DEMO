import { useState } from 'react';
import { FileText, Save, CheckCircle, Pill } from 'lucide-react';

export const Consultations = () => {
    const [activeTab, setActiveTab] = useState('notes');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Consultation: Jane Smith</h1>
                    <p className="text-muted">ID: #0042 • Age: 32 • Female • Blood: A-</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn btn-outline">View History</button>
                    <button className="btn btn-primary"><CheckCircle size={18} /> Complete Consultation</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px' }}>

                {/* Main EMR Area */}
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)' }}>
                        <button
                            onClick={() => setActiveTab('notes')}
                            style={{
                                flex: 1, padding: '16px', fontWeight: 'bold',
                                background: activeTab === 'notes' ? 'rgba(255,255,255,0.05)' : 'transparent',
                                borderBottom: activeTab === 'notes' ? '2px solid var(--accent-primary)' : 'none'
                            }}
                        >
                            <FileText size={16} style={{ display: 'inline', marginRight: '8px' }} /> Clinical Notes
                        </button>
                        <button
                            onClick={() => setActiveTab('prescription')}
                            style={{
                                flex: 1, padding: '16px', fontWeight: 'bold',
                                background: activeTab === 'prescription' ? 'rgba(255,255,255,0.05)' : 'transparent',
                                borderBottom: activeTab === 'prescription' ? '2px solid var(--accent-primary)' : 'none'
                            }}
                        >
                            <Pill size={16} style={{ display: 'inline', marginRight: '8px' }} /> Prescription Generator
                        </button>
                    </div>

                    <div style={{ padding: '24px' }}>
                        {activeTab === 'notes' ? (
                            <div className="animate-fade-in">
                                <div className="form-group">
                                    <label className="form-label">Presenting Complaints / Symptoms</label>
                                    <textarea className="form-input" rows={4} placeholder="E.g., High fever since 3 days, body ache..."></textarea>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Vitals</label>
                                    <div className="flex gap-4">
                                        <input type="text" className="form-input" placeholder="BP: 120/80" />
                                        <input type="text" className="form-input" placeholder="Temp: 98.6 F" />
                                        <input type="text" className="form-input" placeholder="Pulse: 72 bpm" />
                                        <input type="text" className="form-input" placeholder="Weight: 65 kg" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Diagnosis</label>
                                    <input type="text" className="form-input" placeholder="Primary Diagnosis..." />
                                </div>
                                <button className="btn btn-outline"><Save size={18} /> Save Notes</button>
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <div className="form-group flex gap-4">
                                    <div style={{ flex: 2 }}>
                                        <label className="form-label">Search Medication</label>
                                        <input type="text" className="form-input" placeholder="Type medicine name..." />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label className="form-label">Dosage</label>
                                        <input type="text" className="form-input" placeholder="1-0-1" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label className="form-label">Duration (Days)</label>
                                        <input type="number" className="form-input" placeholder="5" />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <button className="btn btn-primary">Add</button>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="font-bold mb-3">Current Prescription</h4>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                                                <th style={{ padding: '12px' }}>Medicine</th>
                                                <th style={{ padding: '12px' }}>Dosage</th>
                                                <th style={{ padding: '12px' }}>Duration</th>
                                                <th style={{ padding: '12px' }}>Instructions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '12px' }}>Amoxicillin 500mg</td>
                                                <td style={{ padding: '12px' }}>1-0-1</td>
                                                <td style={{ padding: '12px' }}>5 Days</td>
                                                <td style={{ padding: '12px' }}>After food</td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '12px' }}>Paracetamol 650mg</td>
                                                <td style={{ padding: '12px' }}>SOS</td>
                                                <td style={{ padding: '12px' }}>3 Days</td>
                                                <td style={{ padding: '12px' }}>For fever &gt; 100°F</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Previous Encounters side */}
                <div className="glass-card">
                    <h3 className="font-bold mb-4">Patient History</h3>
                    <div className="flex flex-col gap-4">
                        <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                            <div className="text-sm text-muted">Jan 15, 2026 • Dr. Emily Chen</div>
                            <div className="font-bold mt-1">Viral URI</div>
                            <p className="text-sm mt-2 text-secondary">Prescribed Azithromycin. Patient advised rest.</p>
                        </div>
                        <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                            <div className="text-sm text-muted">Nov 02, 2025 • Dr. Sarah Smith</div>
                            <div className="font-bold mt-1">Routine Checkup</div>
                            <p className="text-sm mt-2 text-secondary">All vitals normal. BP slightly elevated.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
