import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import SaleNew from './pages/SaleNew';
import Users from './pages/Users';
import { Login, Register } from './pages/Auth';

function Protected({ children, adminOnly }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="login-wrap">Loading…</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Protected><Dashboard /></Protected>} />
          <Route path="/products" element={<Protected><Products /></Protected>} />
          <Route path="/customers" element={<Protected><Customers /></Protected>} />
          <Route path="/sales" element={<Protected><Sales /></Protected>} />
          <Route path="/sales/new" element={<Protected><SaleNew /></Protected>} />
          <Route path="/users" element={<Protected adminOnly><Users /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
