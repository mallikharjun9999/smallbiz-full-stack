import { useEffect, useState } from 'react';
import api from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/dashboard/stats').then((r) => setStats(r.data)).catch((e) => setErr(e.response?.data?.message || 'Failed to load'));
  }, []);

  if (err) return <div className="card"><p className="error">{err}</p></div>;
  if (!stats) return <div className="card">Loading dashboard…</div>;

  return (
    <div>
      <div className="topbar"><h2>Dashboard</h2></div>
      <div className="grid">
        <div className="stat"><h3>Total Revenue</h3><p>₹{stats.revenue.toLocaleString()}</p></div>
        <div className="stat"><h3>Completed Sales</h3><p>{stats.salesCount}</p></div>
        <div className="stat"><h3>Products</h3><p>{stats.productCount}</p></div>
        <div className="stat"><h3>Customers</h3><p>{stats.customerCount}</p></div>
        <div className="stat"><h3>Stock Units</h3><p>{stats.stockUnits}</p></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
        <div className="card">
          <h3>⚠️ Low Stock (≤ threshold)</h3>
          {stats.lowStock.length === 0 ? <p>All stocked well.</p> : (
            <table><thead><tr><th>Product</th><th>SKU</th><th>Qty</th></tr></thead>
            <tbody>{stats.lowStock.map((p) => <tr key={p._id}><td>{p.name}</td><td>{p.sku}</td><td>{p.quantity}</td></tr>)}</tbody></table>
          )}
        </div>
        <div className="card">
          <h3>🧾 Recent Sales</h3>
          {stats.recentSales.length === 0 ? <p>No sales yet.</p> : (
            <table><thead><tr><th>Invoice</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>{stats.recentSales.map((s) => (
              <tr key={s._id}><td>{s.invoiceNo}</td><td>{s.customer?.name}</td><td>₹{s.total}</td><td><span className="badge">{s.status}</span></td></tr>
            ))}</tbody></table>
          )}
        </div>
      </div>

      <div className="card">
        <h3>📊 Revenue — last 7 days</h3>
        {stats.dailyRevenue.length === 0 ? <p>No revenue in last 7 days.</p> : (
          <table><thead><tr><th>Date</th><th>Orders</th><th>Total</th></tr></thead>
          <tbody>{stats.dailyRevenue.map((d) => <tr key={d._id}><td>{d._id}</td><td>{d.count}</td><td>₹{d.total}</td></tr>)}</tbody></table>
        )}
      </div>
    </div>
  );
}
