import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

const empty = { name: '', sku: '', description: '', category: 'General', price: '', costPrice: '', quantity: '', lowStockThreshold: 5 };

export default function Products() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');

  const load = async () => {
    const res = await api.get('/products', { params: { search, limit: 100 } });
    setItems(res.data.data);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      if (editing) await api.put(`/products/${editing}`, form);
      else await api.post('/products', form);
      setForm(empty); setEditing(null); load();
    } catch (e2) {
      setErr(e2.response?.data?.message || e2.response?.data?.errors?.[0]?.msg || 'Save failed');
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); load(); }
    catch (e) { alert(e.response?.data?.message || 'Delete failed (admin only)'); }
  };

  return (
    <div>
      <div className="topbar"><h2>Products</h2></div>
      <div className="toolbar">
        <input placeholder="Search name / SKU…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn" onClick={load}>Search</button>
      </div>
      <div className="card">
        <h3>{editing ? 'Edit Product' : 'Add Product'}</h3>
        <form onSubmit={submit}>
          <div className="form-row">
            <input placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input placeholder="SKU * e.g. WM-001" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="form-row">
            <input type="number" min="0" step="0.01" placeholder="Price (₹) *" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <input type="number" min="0" step="0.01" placeholder="Cost price" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} />
            <input type="number" min="0" step="1" placeholder="Quantity *" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            <input type="number" min="0" step="1" placeholder="Low-stock threshold" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} />
          </div>
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ marginBottom: 10 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" type="submit">{editing ? 'Update' : 'Add'}</button>
            {editing && <button type="button" className="btn-ghost" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button>}
          </div>
          {err && <p className="error">{err}</p>}
        </form>
      </div>
      <table>
        <thead><tr><th>Name</th><th>SKU</th><th>Category</th><th>Price</th><th>Qty</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td><td>{p.sku}</td><td>{p.category}</td><td>₹{p.price}</td>
              <td>{p.quantity <= p.lowStockThreshold ? <span className="badge warn">{p.quantity} low</span> : p.quantity}</td>
              <td style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-small" onClick={() => { setEditing(p._id); setForm({ name: p.name, sku: p.sku, description: p.description, category: p.category, price: p.price, costPrice: p.costPrice, quantity: p.quantity, lowStockThreshold: p.lowStockThreshold }); }}>Edit</button>
                {user?.role === 'admin' && <button className="btn-danger btn-small" onClick={() => del(p._id)}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
