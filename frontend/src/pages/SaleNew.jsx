import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function SaleNew() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState('');
  const [lines, setLines] = useState([{ product: '', quantity: 1 }]);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/customers', { params: { limit: 100 } }).then((r) => setCustomers(r.data.data));
    api.get('/products', { params: { limit: 100 } }).then((r) => setProducts(r.data.data));
  }, []);

  const subtotal = lines.reduce((sum, l) => {
    const p = products.find((x) => x._id === l.product);
    return sum + (p ? p.price * (parseInt(l.quantity) || 0) : 0);
  }, 0);
  const total = Math.max(0, subtotal + Number(tax || 0) - Number(discount || 0));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await api.post('/sales', { customer, items: lines, tax, discount, paymentMethod });
      navigate('/sales');
    } catch (e2) {
      setErr(e2.response?.data?.message || 'Sale failed');
    }
  };

  return (
    <div>
      <div className="topbar"><h2>New Sale</h2></div>
      <div className="card">
        <form onSubmit={submit}>
          <label>Customer *</label>
          <select value={customer} onChange={(e) => setCustomer(e.target.value)} required style={{ marginBottom: 12 }}>
            <option value="">— select customer —</option>
            {customers.map((c) => <option key={c._id} value={c._id}>{c.name} ({c.phone})</option>)}
          </select>
          <h4>Items (price × quantity)</h4>
          {lines.map((l, i) => (
            <div className="form-row" key={i}>
              <select value={l.product} onChange={(e) => { const n = [...lines]; n[i].product = e.target.value; setLines(n); }} required>
                <option value="">— product —</option>
                {products.map((p) => <option key={p._id} value={p._id}>{p.name} — ₹{p.price} (stock {p.quantity})</option>)}
              </select>
              <input type="number" min="1" value={l.quantity} onChange={(e) => { const n = [...lines]; n[i].quantity = e.target.value; setLines(n); }} required />
              <button type="button" className="btn-ghost" onClick={() => setLines(lines.filter((_, x) => x !== i))}>Remove</button>
            </div>
          ))}
          <button type="button" className="btn-ghost" onClick={() => setLines([...lines, { product: '', quantity: 1 }])}>+ Add item</button>
          <div className="form-row" style={{ marginTop: 12 }}>
            <div><label>Tax (₹)</label><input type="number" min="0" value={tax} onChange={(e) => setTax(e.target.value)} /></div>
            <div><label>Discount (₹)</label><input type="number" min="0" value={discount} onChange={(e) => setDiscount(e.target.value)} /></div>
            <div><label>Payment</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="cash">Cash</option><option value="card">Card</option><option value="upi">UPI</option><option value="bank">Bank</option><option value="other">Other</option>
              </select>
            </div>
          </div>
          <p><b>Subtotal:</b> ₹{subtotal} &nbsp; <b>Total:</b> ₹{total}</p>
          <button className="btn" type="submit">Create Sale</button>
          {err && <p className="error">{err}</p>}
        </form>
      </div>
    </div>
  );
}
