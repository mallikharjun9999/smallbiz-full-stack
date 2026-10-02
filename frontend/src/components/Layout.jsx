import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>🏪 SmallBiz Manager</h2>
        <small>MERN • Products • Customers • Sales</small>
        <div style={{ height: 12 }} />
        <NavLink className="nav-link" to="/">Dashboard</NavLink>
        <NavLink className="nav-link" to="/products">Products</NavLink>
        <NavLink className="nav-link" to="/customers">Customers</NavLink>
        <NavLink className="nav-link" to="/sales">Sales</NavLink>
        <NavLink className="nav-link" to="/sales/new">+ New Sale</NavLink>
        {user?.role === 'admin' && <NavLink className="nav-link" to="/users">Users</NavLink>}
        <div style={{ flex: 1 }} />
        <small>{user?.name} ({user?.role})</small>
        <button className="btn-ghost" onClick={handleLogout}>Logout</button>
      </aside>
      <div className="main">{children}</div>
    </div>
  );
}
