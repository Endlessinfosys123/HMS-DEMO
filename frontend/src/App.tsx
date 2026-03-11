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
import { Staff } from './pages/Staff';
import { Settings } from './pages/Settings';

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div style={{ color: 'white', padding: '20px' }}>Initializing HMS...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

        <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="inpatients" element={<Inpatients />} />
          <Route path="beds" element={<Beds />} />
          <Route path="pharmacy" element={<Pharmacy />} />
          <Route path="billing" element={<Billing />} />
          <Route path="lab" element={<Lab />} />
          <Route path="staff" element={<Staff />} />
          <Route path="settings" element={<Settings />} />
          {/* Add more routes here in Phase 3 */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
