import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try { await login(email, password); navigate('/'); }
    catch (e2) { setErr(e2.response?.data?.message || 'Login failed'); }
  };
  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <h2>🏪 SmallBiz Manager</h2>
        <p>MERN • Login to manage products, customers & sales</p>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ marginBottom: 10 }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ marginBottom: 10 }} />
        <button className="btn" type="submit" style={{ width: '100%' }}>Login</button>
        {err && <p className="error">{err}</p>}
        <p style={{ fontSize: 13 }}>No account? <Link to="/register" style={{ color: '#2563eb' }}>Register</Link></p>
        <p style={{ fontSize: 12, color: '#64748b' }}>Tip: first registered user becomes <b>admin</b>. Or run <code>npm run seed</code> for admin@shop.com / admin123.</p>
      </form>
    </div>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try { await register(name, email, password); navigate('/'); }
    catch (e2) { setErr(e2.response?.data?.message || e2.response?.data?.errors?.[0]?.msg || 'Register failed'); }
  };
  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <h2>Create account</h2>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ marginBottom: 10 }} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ marginBottom: 10 }} />
        <input type="password" placeholder="Password (min 6)" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ marginBottom: 10 }} />
        <button className="btn" type="submit" style={{ width: '100%' }}>Register</button>
        {err && <p className="error">{err}</p>}
        <p style={{ fontSize: 13 }}><Link to="/login" style={{ color: '#2563eb' }}>Back to login</Link></p>
      </form>
    </div>
  );
}
