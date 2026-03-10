
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';

// Mock Pages
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { Appointments } from './pages/Appointments';
import { Consultations } from './pages/Consultations';
const Login = () => (<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><div className="glass-card" style={{ width: '400px' }}><h2 className="text-2xl mb-6">Login to HMS</h2><div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" placeholder="admin@hospital.com" /></div><div className="form-group"><label className="form-label">Password</label><input type="password" className="form-input" placeholder="••••••••" /></div><button className="btn btn-primary" style={{ width: '100%' }}>Sign In</button></div></div>);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="consultations" element={<Consultations />} />
          <Route path="pharmacy" element={<div className="glass-card"><h1 className="text-3xl mb-4">Pharmacy & Inventory</h1></div>} />
          <Route path="lab" element={<div className="glass-card"><h1 className="text-3xl mb-4">Laboratory System</h1></div>} />
          <Route path="billing" element={<div className="glass-card"><h1 className="text-3xl mb-4">Billing & Invoicing</h1></div>} />
          <Route path="settings" element={<div className="glass-card"><h1 className="text-3xl mb-4">System Settings</h1></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
