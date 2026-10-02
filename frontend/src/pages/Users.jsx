import { useEffect, useState } from 'react';
import api from '../api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState('');
  const load = () => api.get('/auth/users').then((r) => setUsers(r.data)).catch((e) => setErr(e.response?.data?.message || 'Failed'));
  useEffect(() => { load(); }, []);

  const setRole = async (id, role) => {
    await api.put(`/auth/users/${id}/role`, { role });
    load();
  };
  const del = async (id) => {
    if (!confirm('Delete user?')) return;
    try { await api.delete(`/auth/users/${id}`); load(); }
    catch (e) { alert(e.response?.data?.message || 'Delete failed'); }
  };

  if (err) return <div className="card"><p className="error">{err} (admin only)</p></div>;
  return (
    <div>
      <div className="topbar"><h2>Users & Roles</h2></div>
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td><td>{u.email}</td>
              <td><span className="badge">{u.role}</span></td>
              <td style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-small" onClick={() => setRole(u._id, u.role === 'admin' ? 'staff' : 'admin')}>
                  Make {u.role === 'admin' ? 'staff' : 'admin'}
                </button>
                <button className="btn-danger btn-small" onClick={() => del(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
