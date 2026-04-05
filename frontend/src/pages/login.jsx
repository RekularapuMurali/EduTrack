import { useState } from 'react';

const DEMO_ACCOUNTS = {
  admin:     { name: 'Kavita Reddy', email: 'admin@edutrack.org',  role: 'admin',     avatar: 'KR' },
  volunteer: { name: 'Priya Nair',   email: 'priya@edutrack.org',  role: 'volunteer', avatar: 'PN' },
  student:   { name: 'Arjun Sharma', email: 'arjun@student.org',   role: 'student',   avatar: 'AS' },
};

export default function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [email,    setEmail]    = useState('admin@edutrack.org');
  const [password, setPassword] = useState('password123');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const selectRole = (role) => {
    setSelectedRole(role);
    setEmail(DEMO_ACCOUNTS[role].email);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 700)); // simulate network delay
    const account = DEMO_ACCOUNTS[selectedRole];
    if (!account) { setError('Invalid credentials'); setLoading(false); return; }
    onLogin({ ...account, email });
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>

      {/* ── Left green panel ── */}
      <div style={{
        width: '42%',
        background: 'linear-gradient(160deg, #166534 0%, #15803D 100%)',
        padding: 40,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path d="M12 14l6.16-3.422a12.083 12.083 0 0 1 .665 6.479A11.952
                11.952 0 0 0 12 20.055a11.952 11.952 0 0 0-6.824-2.998
                12.078 12.078 0 0 1 .665-6.479L12 14z"/>
            </svg>
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: 'white' }}>EduTrack</span>
        </div>

        {/* Tagline + stats */}
        <div>
          <h2 style={{
            fontSize: 36, fontWeight: 800, color: 'white',
            lineHeight: 1.2, marginBottom: 14,
          }}>
            Empowering<br/>Students to<br/>Grow Further
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.75)', fontSize: 14,
            lineHeight: 1.7, maxWidth: 300, marginBottom: 32,
          }}>
            A centralized platform for NGOs and community programs
            to track student progress and drive meaningful outcomes.
          </p>

          {[
            ['1,200+', 'Students Tracked'],
            ['85',     'Active Volunteers'],
            ['4,500+', 'Sessions Completed'],
          ].map(([val, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 36, height: 36,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 8, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: 'white', fontSize: 14 }}>✓</span>
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
          © 2024 EduTrack. Built for impact.
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div style={{
        flex: 1, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: 40, background: '#F8FAFC',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 13, color: '#64748B', marginBottom: 28 }}>
            Sign in to access your dashboard
          </p>

          {/* Demo role switcher */}
          <div style={{
            background: '#F1F5F9', border: '1px solid #E2E8F0',
            borderRadius: 12, padding: 14, marginBottom: 22,
          }}>
            <p style={{
              fontSize: 11, fontWeight: 600, color: '#64748B',
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10,
            }}>
              Demo — click to login as:
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {['admin', 'volunteer', 'student'].map(role => (
                <button
                  key={role}
                  onClick={() => selectRole(role)}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 8,
                    border: selectedRole === role ? '1px solid #86EFAC' : '1px solid #E2E8F0',
                    background: selectedRole === role ? '#DCFCE7' : '#FFFFFF',
                    color: selectedRole === role ? '#166534' : '#64748B',
                    fontSize: 12, fontWeight: 500,
                    cursor: 'pointer', transition: 'all 0.15s',
                    textTransform: 'capitalize',
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 8,
                background: '#FEE2E2', color: '#991B1B',
                fontSize: 13, marginBottom: 14,
                border: '1px solid #FECACA',
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={{
                fontSize: 12, fontWeight: 500, color: '#374151',
                display: 'block', marginBottom: 4,
              }}>
                Email address
              </label>
              <input
                type="email" value={email} required
                onChange={e => setEmail(e.target.value)}
                onFocus={e => e.target.style.borderColor = '#166534'}
                onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
                style={{
                  width: '100%', fontSize: 13, padding: '9px 12px',
                  borderRadius: 8, border: '1px solid #E2E8F0',
                  background: '#F8FAFC', color: '#0F172A', outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{
                fontSize: 12, fontWeight: 500, color: '#374151',
                display: 'block', marginBottom: 4,
              }}>
                Password
              </label>
              <input
                type="password" value={password} required
                onChange={e => setPassword(e.target.value)}
                onFocus={e => e.target.style.borderColor = '#166534'}
                onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
                style={{
                  width: '100%', fontSize: 13, padding: '9px 12px',
                  borderRadius: 8, border: '1px solid #E2E8F0',
                  background: '#F8FAFC', color: '#0F172A', outline: 'none',
                }}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '10px 0',
                background: loading ? '#4ADE80' : '#166534',
                color: 'white', border: 'none', borderRadius: 8,
                fontSize: 14, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}