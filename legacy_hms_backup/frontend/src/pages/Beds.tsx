import { Bed, Info } from 'lucide-react';


const MOCK_WARDS = [
    { id: '1', name: 'General Ward', capacity: 30, occupied: 25 },
    { id: '2', name: 'ICU', capacity: 10, occupied: 8 },
    { id: '3', name: 'Cardiology', capacity: 15, occupied: 12 },
    { id: '4', name: 'Maternity', capacity: 20, occupied: 15 },
    { id: '5', name: 'Pediatrics', capacity: 15, occupied: 5 },
];

export const Beds = () => {
    return (
        <div>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Bed & Ward Management</h1>
                    <p className="text-muted">Monitor hospital bed occupancy spread across wards.</p>
                </div>
                <button className="btn btn-outline"><Bed size={18} style={{ marginRight: '8px' }} /> Manage Wards</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                {MOCK_WARDS.map((ward) => {
                    const occupancyRate = (ward.occupied / ward.capacity) * 100;
                    const isFull = occupancyRate >= 90;

                    return (
                        <div key={ward.id} className="glass-card hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold">{ward.name}</h3>
                                <span className={`badge ${isFull ? 'badge-danger' : 'badge-success'}`} style={{ padding: '4px 8px', borderRadius: '4px', background: isFull ? 'var(--status-danger-bg)' : 'var(--status-success-bg)', color: isFull ? 'var(--status-danger)' : 'var(--status-success)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                    {isFull ? 'Near Capacity' : 'Available'}
                                </span>
                            </div>

                            <div className="mb-2 flex justify-between text-sm">
                                <span className="text-muted">Occupied</span>
                                <span className="font-bold">{ward.occupied} / {ward.capacity}</span>
                            </div>

                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${occupancyRate}%`, height: '100%', background: isFull ? 'var(--status-danger)' : 'var(--accent-primary)', borderRadius: '4px' }}></div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-[var(--border-light)] text-sm flex items-center gap-2 text-muted">
                                <Info size={14} /> {ward.capacity - ward.occupied} beds available
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
