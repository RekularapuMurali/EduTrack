import React, { useState } from 'react';

const BRAND_GREEN = '#336339';
const BRAND_GREEN_HOVER = '#2a5230';

function GradCapIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
    </svg>
  );
}

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@edutrack.org');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    { role: 'admin', email: 'admin@edutrack.org', name: 'Kavita Reddy', avatar: 'KR' },
    { role: 'volunteer', email: 'priya@edutrack.org', name: 'Priya Nair', avatar: 'PN' },
    { role: 'student', email: 'arjun@student.org', name: 'Arjun Sharma', avatar: 'AS' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    const account = demoAccounts.find(a => a.role === role);
    if (!account) { setError('Invalid credentials'); setLoading(false); return; }
    onLogin({ ...account, email });
    setLoading(false);
  };

  const fillDemo = (acc) => {
    setRole(acc.role);
    setEmail(acc.email);
    setPassword('password123');
  };

  const stats = [
    { label: 'Students Tracked', value: '1,200+' },
    { label: 'Active Volunteers', value: '85' },
    { label: 'Sessions Completed', value: '4,500+' },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel — brand */}
      <div
        className="flex flex-col justify-between w-full lg:w-[30%] px-8 py-10 sm:px-12 sm:py-12 lg:min-h-screen shrink-0"
        style={{ background: BRAND_GREEN }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <GradCapIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">EduTrack</span>
        </div>

        <div className="mt-10 lg:mt-0 flex-1 flex flex-col justify-center py-8 lg:py-0">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4 max-w-md">
            Empowering Students to Grow Further
          </h2>
          <p className="text-base leading-relaxed max-w-md" style={{ color: 'rgba(255,255,255,0.82)' }}>
            A centralized platform for NGOs, schools, and community programs to track student progress and drive meaningful outcomes.
          </p>

          <ul className="mt-10 space-y-5 list-none p-0 m-0">
            {stats.map((stat) => (
              <li key={stat.label} className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'rgba(0,0,0,0.18)' }}
                >
                  <span className="text-sm font-bold" style={{ color: '#B8E6B3' }}>✓</span>
                </div>
                <div>
                  <div className="text-lg font-bold text-white leading-tight">{stat.value}</div>
                  <div className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{stat.label}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs mt-8 lg:mt-0" style={{ color: 'rgba(255,255,255,0.38)' }}>
          © 2026 EduTrack. Built for impact.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12 sm:px-10 lg:px-16 min-h-0">
        <div className="w-full max-w-[420px]">
          <header className="mb-8">
            <h1 className="text-2xl sm:text-[1.75rem] font-bold mb-2 tracking-tight" style={{ color: '#1e293b' }}>
              Welcome back
            </h1>
            <p className="text-sm sm:text-[0.9375rem]" style={{ color: '#64748b' }}>
              Sign in to access your dashboard
            </p>
          </header>

          <div
            className="mb-6 p-4 rounded-lg"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
          >
            <p
              className="text-[0.6875rem] font-semibold tracking-wide mb-3"
              style={{ color: '#64748b' }}
            >
              DEMO — CLICK TO LOGIN AS:
            </p>
            <div className="flex gap-2">
              {demoAccounts.map((acc) => {
                const selected = role === acc.role;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => fillDemo(acc)}
                    className="flex-1 py-2.5 px-2 rounded-lg text-xs font-semibold transition-colors"
                    style={{
                      background: selected ? '#e8f5e9' : '#ffffff',
                      color: selected ? BRAND_GREEN : '#64748b',
                      border: selected ? `1px solid ${BRAND_GREEN}` : '1px solid #e2e8f0',
                      boxShadow: selected ? 'none' : undefined,
                    }}
                  >
                    {acc.role.charAt(0).toUpperCase() + acc.role.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="px-4 py-3 rounded-lg text-sm"
                style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}
              >
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-sm font-medium" style={{ color: '#334155' }}>
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full text-sm px-3.5 py-3 rounded-lg outline-none transition-[border-color,box-shadow] focus:ring-2"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  color: '#0f172a',
                  borderRadius: '8px',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = BRAND_GREEN;
                  e.target.style.boxShadow = `0 0 0 3px ${BRAND_GREEN}26`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-password" className="text-sm font-medium" style={{ color: '#334155' }}>
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full text-sm px-3.5 py-3 rounded-lg outline-none transition-[border-color,box-shadow]"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  color: '#0f172a',
                  borderRadius: '8px',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = BRAND_GREEN;
                  e.target.style.boxShadow = `0 0 0 3px ${BRAND_GREEN}26`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-bold text-white transition-colors disabled:opacity-85"
              style={{
                background: loading ? BRAND_GREEN_HOVER : BRAND_GREEN,
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = BRAND_GREEN_HOVER;
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = BRAND_GREEN;
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
