import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import AppLayout from './ui/AppLayout';
import Collecte from './pages/Collecte';
import Vendeurs from './pages/Vendeurs';
import Taxes from './pages/Taxes';
import Signalements from './pages/Signalements';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected/Dashboard Routes */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/collecte" element={<Collecte />} />
          <Route path="/vendeurs" element={<Vendeurs />} />
          <Route path="/taxes" element={<Taxes />} />
          <Route path="/signalements" element={<Signalements />} />
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
