import { useState } from 'react';

const DEMO_ACCOUNTS = {
  admin:     { name: 'Kavita Reddy', email: 'admin@edutrack.org',  role: 'admin',     avatar: 'KR' },
  volunteer: { name: 'Priya Nair',   email: 'priya@edutrack.org',  role: 'volunteer', avatar: 'PN' },
  student:   { name: 'Arjun Sharma', email: 'arjun@student.org',   role: 'student',   avatar: 'AS' },
};

export default function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [email, setEmail] = useState('admin@edutrack.org');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectRole = (role) => {
    setSelectedRole(role);
    setEmail(DEMO_ACCOUNTS[role].email);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 700));
    const account = DEMO_ACCOUNTS[selectedRole];
    if (!account) { setError('Invalid credentials'); setLoading(false); return; }
    onLogin({ ...account, email });
    setLoading(false);
  };

  return (
    <div className="flex h-screen">

      {/* Left panel */}
      <div className="w-[42%] bg-gradient-to-br from-green-800 to-green-600 p-10 flex flex-col justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path d="M12 14l6.16-3.422a12.083 12.083 0 0 1 .665 6.479A11.952
                11.952 0 0 0 12 20.055a11.952 11.952 0 0 0-6.824-2.998
                12.078 12.078 0 0 1 .665-6.479L12 14z"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-white">EduTrack</span>
        </div>

        {/* Content */}
        <div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Empowering<br/>Students to<br/>Grow Further
          </h2>

          <p className="text-sm text-white/70 leading-relaxed max-w-xs mb-8">
            A centralized platform for NGOs and community programs
            to track student progress and drive meaningful outcomes.
          </p>

          {[
            ['1,200+', 'Students Tracked'],
            ['85', 'Active Volunteers'],
            ['4,500+', 'Sessions Completed'],
          ].map(([val, label]) => (
            <div key={label} className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-white/10 rounded-md flex items-center justify-center text-white">
                ✓
              </div>
              <div>
                <div className="text-lg font-bold text-white">{val}</div>
                <div className="text-xs text-white/60">{label}</div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/40">
          © 2024 EduTrack. Built for impact.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-10 bg-gray-50">
        <div className="w-full max-w-md">

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Sign in to access your dashboard
          </p>

          {/* Role switcher */}
          <div className="bg-gray-100 border rounded-xl p-4 mb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Demo — click to login as:
            </p>

            <div className="flex gap-2">
              {['admin', 'volunteer', 'student'].map(role => (
                <button
                  key={role}
                  onClick={() => selectRole(role)}
                  className={`flex-1 py-2 rounded-md text-xs capitalize
                    ${selectedRole === role
                      ? 'bg-green-100 border border-green-300 text-green-800'
                      : 'bg-white border text-gray-500'}`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {error && (
              <div className="bg-red-100 text-red-700 border border-red-200 text-sm p-2 rounded mb-3">
                {error}
              </div>
            )}

            <div className="mb-3">
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                required
                onChange={e => setEmail(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded border bg-gray-50 focus:border-green-700 outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium text-gray-700 block mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                required
                onChange={e => setPassword(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded border bg-gray-50 focus:border-green-700 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded text-sm font-semibold text-white
                ${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-800 hover:bg-green-700'}`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}