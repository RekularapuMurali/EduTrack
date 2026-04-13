import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { authAPI } from '../utils/api.js';

export default function Login() {
  const { login }               = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authAPI.login(email, password);
      // data = { success: true, token: '...', user: { name, email, role, avatar } }
      login(data.user, data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>

      {/* Left green panel */}
      <div style={{ width: '42%', background: 'linear-gradient(160deg, #091413 0%, #285A48 100%)', padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path d="M12 14l6.16-3.422a12.083 12.083 0 0 1 .665 6.479A11.952 11.952 0 0 0 12 20.055a11.952 11.952 0 0 0-6.824-2.998 12.078 12.078 0 0 1 .665-6.479L12 14z"/>
            </svg>
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'white' }}>EduTrack</span>
        </div>
        <div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 14 }}>
            Empowering<br/>Students to<br/>Grow Further
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.7, maxWidth: 300, marginBottom: 32 }}>
            A centralized platform for NGOs and community programs to track student progress.
          </p>
          {[['1,200+','Students Tracked'],['85','Active Volunteers'],['4,500+','Sessions Done']].map(([val, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.1)', borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: 14 }}>✓</span>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>© 2024 EduTrack. Built for impact.</p>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: '#F8FAFC' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#091413', marginBottom: 6 }}>Welcome back</h1>
          <p style={{ fontSize: 13, color: '#64748B', marginBottom: 32 }}>Sign in to your EduTrack dashboard</p>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: '#FEE2E2', color: '#991B1B', fontSize: 13, marginBottom: 16, border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>
                Email <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input type="email" value={email} required onChange={e => setEmail(e.target.value)}
                onFocus={e => e.target.style.borderColor = '#285A48'}
                onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
                style={{ width: '100%', fontSize: 13, padding: '9px 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#091413', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 4 }}>
                Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input type="password" value={password} required onChange={e => setPassword(e.target.value)}
                onFocus={e => e.target.style.borderColor = '#285A48'}
                onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
                style={{ width: '100%', fontSize: 13, padding: '9px 12px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#091413', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '11px 0', background: '#285A48', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#408A71'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#285A48'; }}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>
          </form>

          <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 24, textAlign: 'center' }}>
            Contact your administrator if you need an account.
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}