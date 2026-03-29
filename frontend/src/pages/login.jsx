import React, { useState } from 'react';

const DARK_BG = '#3A0519';
const BRAND_PRIMARY = '#670D2F';
const BRAND_HOVER = '#A53860';
const BRAND_ACCENT = '#EF88AD';

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

      {/* Left panel */}
      <div
        className="flex flex-col justify-between w-full lg:w-[30%] px-8 py-10 sm:px-12 sm:py-12 lg:min-h-screen shrink-0"
        style={{ background: DARK_BG }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <GradCapIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">EduTrack</span>
        </div>

        <div className="mt-10 flex-1 flex flex-col justify-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 max-w-md">
            Empowering Students to Grow Further
          </h2>

          <p className="text-base max-w-md" style={{ color: 'rgba(255,255,255,0.75)' }}>
            A centralized platform for NGOs, schools, and community programs to track student progress.
          </p>

          <ul className="mt-10 space-y-5">
            {stats.map((stat) => (
              <li key={stat.label} className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: BRAND_PRIMARY }}
                >
                  <span className="text-sm font-bold" style={{ color: BRAND_ACCENT }}>✓</span>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {stat.label}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          © 2026 EduTrack. Built for impact.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

          {/* Header */}
          <h1 className="text-3xl font-bold mb-1 tracking-tight" style={{ color: DARK_BG }}>
            Welcome back
          </h1>
          <p className="text-sm mb-8" style={{ color: '#64748b' }}>
            Sign in to access your dashboard
          </p>

          {/* Demo selector */}
          <div className="mb-8">
            <p className="text-xs mb-3 text-gray-400 font-semibold tracking-wide">
              DEMO ACCESS
            </p>

            <div className="flex gap-2">
              {demoAccounts.map((acc) => {
                const selected = role === acc.role;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => fillDemo(acc)}
                    className="flex-1 py-2 rounded-full text-xs font-semibold transition-all duration-200"
                    style={{
                      background: selected ? BRAND_PRIMARY : '#fff',
                      color: selected ? '#fff' : '#64748b',
                      border: selected
                        ? `1px solid ${BRAND_PRIMARY}`
                        : '1px solid #e2e8f0',
                      boxShadow: selected
                        ? `0 4px 12px ${BRAND_PRIMARY}33`
                        : 'none',
                    }}
                  >
                    {acc.role}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg transition-all duration-200 outline-none"
                placeholder="Enter your email"
                onFocus={(e) => {
                  e.target.style.borderColor = BRAND_PRIMARY;
                  e.target.style.boxShadow = `0 0 0 3px ${BRAND_PRIMARY}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg transition-all duration-200 outline-none"
                placeholder="Enter your password"
                onFocus={(e) => {
                  e.target.style.borderColor = BRAND_PRIMARY;
                  e.target.style.boxShadow = `0 0 0 3px ${BRAND_PRIMARY}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold tracking-wide transition-all duration-200"
              style={{
                background: loading ? BRAND_HOVER : BRAND_PRIMARY,
                boxShadow: `0 6px 14px ${BRAND_PRIMARY}40`,
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = BRAND_HOVER;
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = BRAND_PRIMARY;
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

//Navy Theme mapping used:
//#3A0519 → dark background (left panel)
//#670D2F → primary brand color
//#A53860 → hover / secondary
//#EF88AD → soft accent highlights