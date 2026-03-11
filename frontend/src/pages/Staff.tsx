import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Mail, Phone, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../components/Modal';

export const Staff = () => {
    const navigate = useNavigate();
    const [staff, setStaff] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role_id: '',
        specialization: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        const [profilesRes, rolesRes] = await Promise.all([
            supabase.from('profiles').select('*, roles(name)').order('first_name', { ascending: true }),
            supabase.from('roles').select('*')
        ]);

        if (!profilesRes.error) setStaff(profilesRes.data || []);
        if (!rolesRes.error) setRoles(rolesRes.data || []);
        setLoading(false);
    };

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        // Note: In a real system, you'd use Supabase Auth to create the user.
        // For this demo, we'll assume the profile can be created or managed.
        // Creating a full user requires service_role or a custom edge function.
        alert('Staff registration typically requires administrative auth creation. Profile management is enabled.');
        
        setSubmitting(false);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Hospital Staff & HR</h1>
                    <p className="text-muted">Directly manage user roles and profiles.</p>
                </div>
                <button 
                    className="btn btn-primary"
                    onClick={() => setIsModalOpen(true)}
                >
                    <UserPlus size={18} /> Add Staff Member
                </button>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title="Register New Staff Member"
            >
                <form onSubmit={handleAddStaff}>
                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input 
                                className="form-input" 
                                required 
                                value={formData.first_name}
                                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input 
                                className="form-input" 
                                required 
                                value={formData.last_name}
                                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input 
                            type="email"
                            className="form-input" 
                            required 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="grid-2">
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input 
                                className="form-input" 
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <select 
                                className="form-input" 
                                required 
                                value={formData.role_id}
                                onChange={(e) => setFormData({...formData, role_id: e.target.value})}
                                style={{ background: 'var(--bg-sidebar)' }}
                            >
                                <option value="">Select Role</option>
                                {roles.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex-end">
                        <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Registering...' : 'Add Member'}
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
                            placeholder="Filter by name or role..."
                            style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%' }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: '64px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading records...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <th style={{ padding: '12px 16px' }}>MEMBER</th>
                                <th style={{ padding: '12px 16px' }}>ROLE</th>
                                <th style={{ padding: '12px 16px' }}>CONTACT</th>
                                <th style={{ padding: '12px 16px' }}>JOINED</th>
                                <th style={{ padding: '12px 16px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map((m) => (
                                <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div 
                                            style={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }}
                                            onClick={() => {
                                                if (m.roles?.name === 'DOCTOR') navigate(`/doctors/${m.id}`);
                                            }}
                                        >
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                                                {m.first_name[0]}{m.last_name[0]}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{m.first_name} {m.last_name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.specialization || 'General'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ 
                                            padding: '4px 8px', 
                                            borderRadius: '6px', 
                                            fontSize: '0.7rem', 
                                            fontWeight: 'bold',
                                            background: m.roles?.name === 'ADMIN' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                            color: m.roles?.name === 'ADMIN' ? '#ef4444' : 'var(--accent-primary)'
                                        }}>
                                            {m.roles?.name || 'STAFF'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}><Mail size={12} className="text-muted" /> {m.email}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}><Phone size={12} className="text-muted" /> {m.phone || 'N/A'}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(m.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button className="btn btn-outline" style={{ padding: '6px' }}><Edit2 size={14} /></button>
                                            <button className="btn btn-outline" style={{ padding: '6px', color: 'var(--status-danger)' }}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
