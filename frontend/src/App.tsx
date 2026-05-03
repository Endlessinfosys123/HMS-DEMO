import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { Appointments } from './pages/Appointments';
import { Inpatients } from './pages/Inpatients';
import { Beds } from './pages/Beds';
import { Pharmacy } from './pages/Pharmacy';
import { Billing } from './pages/Billing';
import { Lab } from './pages/Lab';
import { PatientProfile } from './pages/PatientProfile';
import { Staff } from './pages/Staff';
import { Reports } from './pages/Reports';
import { Doctors } from './pages/Doctors';
import { DoctorProfile } from './pages/DoctorProfile';
import { Settings } from './pages/Settings';

import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { Onboarding } from './pages/Onboarding';

function App() {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) return <div style={{ color: 'white', padding: '20px' }}>Initializing HMS...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : (profile?.roles?.name === 'SUPER_ADMIN' ? <Navigate to="/super-admin" replace /> : <Navigate to="/dashboard" replace />)} />
        <Route path="/onboarding" element={<Onboarding />} />

        <Route path="/" element={user ? <Layout /> : <Navigate to="/login" replace />}>
          <Route index element={profile?.roles?.name === 'SUPER_ADMIN' ? <Navigate to="/super-admin" replace /> : <Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={profile?.roles?.name === 'SUPER_ADMIN' ? <Navigate to="/super-admin" replace /> : <Dashboard />} />
          <Route path="super-admin" element={profile?.roles?.name === 'SUPER_ADMIN' ? <SuperAdminDashboard /> : <Navigate to="/dashboard" replace />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:id" element={<PatientProfile />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="doctors/:id" element={<DoctorProfile />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="inpatients" element={<Inpatients />} />
          <Route path="beds" element={<Beds />} />
          <Route path="pharmacy" element={<Pharmacy />} />
          <Route path="billing" element={<Billing />} />
          <Route path="lab" element={<Lab />} />
          <Route path="staff" element={<Staff />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
