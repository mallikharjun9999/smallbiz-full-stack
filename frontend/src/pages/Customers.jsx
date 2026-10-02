import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

const empty = { name: '', email: '', phone: '', company: '', address: '', notes: '' };

export default function Customers() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');

  const load = async () => {
    const res = await api.get('/customers', { params: { search, limit: 100 } });
    setItems(res.data.data);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      if (editing) await api.put(`/customers/${editing}`, form);
      else await api.post('/customers', form);
      setForm(empty); setEditing(null); load();
    } catch (e2) {
      setErr(e2.response?.data?.message || e2.response?.data?.errors?.[0]?.msg || 'Save failed');
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this customer?')) return;
    try { await api.delete(`/customers/${id}`); load(); }
    catch { alert('Delete failed (admin only)'); }
  };

  return (
    <div>
      <div className="topbar"><h2>Customers</h2></div>
      <div className="toolbar">
        <input placeholder="Search name / email / phone…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn" onClick={load}>Search</button>
      </div>
      <div className="card">
        <h3>{editing ? 'Edit Customer' : 'Add Customer'}</h3>
        <form onSubmit={submit}>
          <div className="form-row">
            <input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input placeholder="Phone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>
          <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ marginBottom: 10 }} />
          <input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ marginBottom: 10 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" type="submit">{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" className="btn-ghost" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button>}
          </div>
          {err && <p className="error">{err}</p>}
        </form>
      </div>
      <table>
        <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Company</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td><td>{c.phone}</td><td>{c.email}</td><td>{c.company}</td>
              <td style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-small" onClick={() => { setEditing(c._id); setForm({ name: c.name, email: c.email, phone: c.phone, company: c.company, address: c.address, notes: c.notes }); }}>Edit</button>
                {user?.role === 'admin' && <button className="btn-danger btn-small" onClick={() => del(c._id)}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
