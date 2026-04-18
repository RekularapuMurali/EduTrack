import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { authAPI } from '../utils/api.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authAPI.login(email, password);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <aside style={{ flex: 1.1, padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(160deg, #091413 0%, #285A48 100%)', color: 'white' }}>
        <div style={{ maxWidth: 440 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B0E4CC', marginBottom: 14 }}>Visions India</div>
          <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.05, marginBottom: 18 }}>Secure access for mission-driven teams.</h1>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.82)', marginBottom: 30 }}>Sign in to coordinate volunteers, manage projects, and share impact stories across communities.</p>
          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#B0E4CC' }} />
              <span style={{ fontSize: 14, color: '#E2F0E8' }}>Role-based dashboards for every team member.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#B0E4CC' }} />
              <span style={{ fontSize: 14, color: '#E2F0E8' }}>Track people, projects, and donations in one place.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#B0E4CC' }} />
              <span style={{ fontSize: 14, color: '#E2F0E8' }}>Secure sign-in with team-level access.</span>
            </div>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 420, background: 'white', borderRadius: 24, boxShadow: '0 24px 90px rgba(15, 23, 42, 0.12)', padding: 34 }}>
          <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Sign in to your account</h2>
              <p style={{ fontSize: 14, color: '#64748B' }}>Use your Visions India credentials to continue.</p>
            </div>
            <Link to="/" style={{ color: '#285A48', fontWeight: 600, fontSize: 14 }}>Home</Link>
          </div>

          {error && (
            <div style={{ padding: '14px 16px', borderRadius: 14, background: '#FEE2E2', color: '#991B1B', marginBottom: 18, border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18 }}>
            <label style={{ display: 'grid', gap: 8, fontSize: 13, color: '#475569' }}>
              Email address
              <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', borderRadius: 12, border: '1px solid #E2E8F0', padding: '12px 14px', fontSize: 14, outline: 'none' }} />
            </label>
            <label style={{ display: 'grid', gap: 8, fontSize: 13, color: '#475569' }}>
              Password
              <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', borderRadius: 12, border: '1px solid #E2E8F0', padding: '12px 14px', fontSize: 14, outline: 'none' }} />
            </label>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px 0', borderRadius: 12, border: 'none', background: '#285A48', color: 'white', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s ease' }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, fontSize: 13, color: '#64748B' }}>
            <Link to="/forgot-password" style={{ color: '#285A48', fontWeight: 600 }}>Forgot password?</Link>
            <Link to="/signup" style={{ color: '#285A48', fontWeight: 600 }}>Create account</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
