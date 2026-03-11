import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Stethoscope, Calendar, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Doctors = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        setLoading(true);
        // Fetch users with DOCTOR role
        const { data, error } = await supabase
            .from('profiles')
            .select('*, roles!inner(name)')
            .eq('roles.name', 'DOCTOR');

        if (!error) setDoctors(data || []);
        setLoading(false);
    };

    const filteredDoctors = doctors.filter(d => 
        `${d.first_name} ${d.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.specialization && d.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-3xl">Medical Directory</h1>
                    <p className="text-muted">Browse and manage hospital's medical professionals.</p>
                </div>
            </div>

            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 20px' }}>
                    <Search size={20} className="text-muted" style={{ marginRight: '12px' }} />
                    <input
                        type="text"
                        placeholder="Search by name or specialization (e.g. Cardiology)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '1rem' }}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>Syncing clinical directory...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {filteredDoctors.length > 0 ? filteredDoctors.map((doc) => (
                        <div key={doc.id} className="glass-card doctor-card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ height: '80px', background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))', opacity: 0.2 }}></div>
                            <div style={{ padding: '24px', marginTop: '-40px', textAlign: 'center' }}>
                                <div style={{ 
                                    width: '80px', 
                                    height: '80px', 
                                    borderRadius: '50%', 
                                    background: 'var(--bg-sidebar)', 
                                    border: '4px solid var(--bg-main)',
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    margin: '0 auto 16px',
                                    fontWeight: 'bold',
                                    color: 'var(--accent-primary)',
                                    fontSize: '1.5rem'
                                }}>
                                    <Stethoscope size={32} />
                                </div>
                                <h3 style={{ margin: '0 0 4px' }}>Dr. {doc.first_name} {doc.last_name}</h3>
                                <p style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '16px' }}>
                                    {doc.specialization || 'General Physician'}
                                </p>
                                
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '24px' }}>
                                    <DocStat icon={<Star size={14} />} label="Rating" value="4.8" />
                                    <DocStat icon={<Clock size={14} />} label="Exp" value="8y+" />
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                        className="btn btn-outline" 
                                        style={{ flex: 1, fontSize: '0.8rem' }}
                                        onClick={() => navigate(`/doctors/${doc.id}`)}
                                    >
                                        View Profile
                                    </button>
                                    <button className="btn btn-primary" style={{ padding: '10px' }}>
                                        <Calendar size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>
                            No medical professionals found matching your search.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const DocStat = ({ icon, label, value }: any) => (
    <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 'bold', color: '#fff', justifyContent: 'center' }}>
            {icon} {value}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{label}</div>
    </div>
);
