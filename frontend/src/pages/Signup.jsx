import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { authAPI } from '../utils/api.js';
import { Input, Select, Button } from '../components/ui/index.jsx';

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('volunteer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authAPI.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      const responseErrors = err.response?.data?.errors;
      const responseMessage = err.response?.data?.message;
      if (responseErrors && responseErrors.length) {
        setError(responseErrors.map(item => item.message || item.msg).join(', '));
      } else if (responseMessage) {
        setError(responseMessage);
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <div style={{ flex: 1.2, padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(160deg, #091413 0%, #285A48 100%)', color: 'white' }}>
        <div style={{ maxWidth: 420 }}>
          <div style={{ marginBottom: 30 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#B0E4CC', marginBottom: 8 }}>Welcome to Edutrack</div>
            <h1 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.05, marginBottom: 18 }}>Join the movement for community change.</h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>Create an admin or volunteer account. Student accounts are created by your team.</p>
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: 999, background: '#B0E4CC' }} />
              <span style={{ fontSize: 13, color: '#E2F0E8' }}>Role-based dashboards for every contributor</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: 999, background: '#B0E4CC' }} />
              <span style={{ fontSize: 13, color: '#E2F0E8' }}>Track projects, events and donations in one place.</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 420, background: 'white', borderRadius: 24, boxShadow: '0 22px 80px rgba(15,23,42,0.12)', padding: '32px 30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Create a new account</h2>
              <p style={{ color: '#64748B', fontSize: 13, margin: 0 }}>Sign up and access your Edutrack dashboard.</p>
            </div>
            <Link to="/" style={{ color: '#285A48', fontWeight: 600, fontSize: 14 }}>Home</Link>
          </div>

          {error && <div style={{ padding: '12px 14px', borderRadius: 12, background: '#FEE2E2', color: '#991B1B', marginBottom: 18 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
            <Input label="Full name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required autoComplete="name" />
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" required autoComplete="new-password" />
            <Select label="Role" value={role} onChange={e => setRole(e.target.value)} options={[
              { value: 'volunteer', label: 'Volunteer' },
              { value: 'admin', label: 'Admin' },
            ]} required />
            <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Creating account…' : 'Sign up'}</Button>
          </form>

          <p style={{ marginTop: 20, fontSize: 13, color: '#64748B' }}>
            Already have an account? <Link to="/login" style={{ color: '#285A48', fontWeight: 600 }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
