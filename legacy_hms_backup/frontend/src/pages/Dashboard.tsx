
import {
    Users, Calendar, CreditCard, Activity, TrendingUp
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';

const data = [
    { name: 'Mon', patients: 40, revenue: 2400 },
    { name: 'Tue', patients: 30, revenue: 1398 },
    { name: 'Wed', patients: 20, revenue: 9800 },
    { name: 'Thu', patients: 27, revenue: 3908 },
    { name: 'Fri', patients: 18, revenue: 4800 },
    { name: 'Sat', patients: 23, revenue: 3800 },
    { name: 'Sun', patients: 34, revenue: 4300 },
];

export const Dashboard = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted">Welcome back, Dr. Smith. Here's today's overview.</p>
                </div>
                <button className="btn btn-primary">
                    + New Admission
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>

                <div className="glass-card flex items-center gap-4">
                    <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--status-info)', color: 'white' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Total Patients</p>
                        <h3 className="text-2xl font-bold">1,248</h3>
                    </div>
                </div>

                <div className="glass-card flex items-center gap-4">
                    <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--status-warning)', color: 'white' }}>
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Appointments Today</p>
                        <h3 className="text-2xl font-bold">42</h3>
                    </div>
                </div>

                <div className="glass-card flex items-center gap-4">
                    <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--status-success)', color: 'white' }}>
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Revenue (Today)</p>
                        <h3 className="text-2xl font-bold">$4,520</h3>
                    </div>
                </div>

                <div className="glass-card flex items-center gap-4">
                    <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--status-danger)', color: 'white' }}>
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Available Beds</p>
                        <h3 className="text-2xl font-bold">14 / 50</h3>
                    </div>
                </div>

            </div>

            {/* Charts Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

                <div className="glass-card">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-muted" /> Patient Flow & Revenue
                    </h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                                <XAxis dataKey="name" stroke="var(--text-muted)" />
                                <YAxis stroke="var(--text-muted)" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-light)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--text-primary)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="var(--accent-primary)" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card">
                    <h3 className="font-bold mb-4">Appointments Overview</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                                <XAxis dataKey="name" stroke="var(--text-muted)" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-light)', borderRadius: '8px' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="patients" fill="var(--accent-secondary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

        </div>
    );
};
