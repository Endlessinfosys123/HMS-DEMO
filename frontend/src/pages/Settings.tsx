
import { 
    Activity, 
    Users, 
    Shield,
    FileText,
    Brain,
    Database
} from 'lucide-react';

export const SettingsPage = () => {

    const sections = [
        {
            title: 'Localization & Global',
            icon: <Database size={20} />,
            options: [
                { label: 'Currency & Pricing', value: 'INR (₹)', desc: 'Localized for India' },
                { label: 'Timezone', value: 'Asia/Kolkata (GMT+5:30)', desc: 'System default' }
            ]
        },
        {
            title: 'Hospital Hierarchy',
            icon: <Shield size={20} />,
            options: [
                { label: 'Multi-Step Wizards', value: 'Enabled', desc: 'Patients, Staff, Doctors' },
                { label: 'Professional Directory', value: 'Table View', desc: 'Premium Layout' }
            ]
        },
        {
            title: 'KiviBot AI Settings',
            icon: <Brain size={20} />,
            options: [
                { label: 'Assistant Status', value: 'Active', desc: 'Floating Help Bot' },
                { label: 'AI Model', value: 'MedCore-Pro', desc: 'Clinical Knowledge Base' }
            ]
        }
    ];

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-3xl">System Configurations</h1>
                <p className="text-muted">Master control for HMS localization and module features.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {sections.map(section => (
                        <div key={section.title} className="glass-card">
                            <h4 className="mb-6 flex items-center gap-2">
                                <span className="text-accent">{section.icon}</span>
                                {section.title}
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {section.options.map(opt => (
                                    <div key={opt.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>{opt.label}</p>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{opt.desc}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{opt.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)' }}>
                        <h4 className="mb-4">Quick Actions</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <SettingsAction icon={<FileText size={16} />} label="Export Config" />
                            <SettingsAction icon={<Activity size={16} />} label="System Logs" />
                            <SettingsAction icon={<Users size={16} />} label="User Permissions" />
                        </div>
                    </div>

                    <div className="glass-card">
                        <h4 className="mb-2">System Version</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enterprise HMS v2.4.0-INR</p>
                        <div className="mt-4 p-3 bg-white/5 rounded-lg">
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>All modules synchronized with Supabase Realtime.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsAction = ({ icon, label }: any) => (
    <button className="btn btn-outline" style={{ justifyContent: 'flex-start', gap: '12px', width: '100%', fontSize: '0.85rem' }}>
        {icon} {label}
    </button>
);
