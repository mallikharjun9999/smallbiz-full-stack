import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function Sales() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('');

  const load = async () => {
    const res = await api.get('/sales', { params: { status, limit: 100 } });
    setItems(res.data.data);
  };
  useEffect(() => { load(); }, []);

  const cancelSale = async (id) => {
    if (!confirm('Cancel this sale? Stock will be restored.')) return;
    await api.put(`/sales/${id}`, { status: 'cancelled' });
    load();
  };
  const del = async (id) => {
    if (!confirm('Delete this sale? Stock will be restored.')) return;
    try { await api.delete(`/sales/${id}`); load(); }
    catch { alert('Delete failed (admin only)'); }
  };

  return (
    <div>
      <div className="topbar"><h2>Sales</h2></div>
      <div className="toolbar">
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ maxWidth: 220 }}>
          <option value="">All statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button className="btn" onClick={load}>Filter</button>
      </div>
      <table>
        <thead><tr><th>Invoice</th><th>Date</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map((s) => (
            <tr key={s._id}>
              <td>{s.invoiceNo}</td>
              <td>{new Date(s.saleDate).toLocaleDateString()}</td>
              <td>{s.customer?.name}</td>
              <td>{s.items.reduce((a, i) => a + i.quantity, 0)}</td>
              <td>₹{s.total}</td>
              <td><span className="badge">{s.status}</span></td>
              <td style={{ display: 'flex', gap: 6 }}>
                {s.status !== 'cancelled' && <button className="btn btn-small" onClick={() => cancelSale(s._id)}>Cancel</button>}
                {user?.role === 'admin' && <button className="btn-danger btn-small" onClick={() => del(s._id)}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
