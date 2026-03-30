import React from 'react';

const icons = {
  dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  students: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4" strokeWidth="2"/>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  progress: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polyline strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  activities: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  sessions: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
      <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round"/>
      <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round"/>
      <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
    </svg>
  ),
  reports: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="17" x2="8" y2="17" strokeWidth="2" strokeLinecap="round"/>
      <polyline strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points="10 9 9 9 8 9"/>
    </svg>
  ),
  volunteers: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" strokeWidth="2"/>
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  logout: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
    </svg>
  ),
  profile: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4" strokeWidth="2"/>
    </svg>
  ),
};

const navByRole = {
  admin: [
    { label: 'Dashboard', key: 'dashboard', icon: 'dashboard' },
    { label: 'Students', key: 'students', icon: 'students' },
    { label: 'Volunteers', key: 'volunteers', icon: 'volunteers' },
    { label: 'Activities', key: 'activities', icon: 'activities' },
    { label: 'Sessions', key: 'sessions', icon: 'sessions' },
    { label: 'Reports', key: 'reports', icon: 'reports' },
    { label: 'Settings', key: 'settings', icon: 'settings' },
  ],
  volunteer: [
    { label: 'Dashboard', key: 'dashboard', icon: 'dashboard' },
    { label: 'My Students', key: 'students', icon: 'students' },
    { label: 'Progress', key: 'progress', icon: 'progress' },
    { label: 'Activities', key: 'activities', icon: 'activities' },
    { label: 'Sessions', key: 'sessions', icon: 'sessions' },
    { label: 'Reports', key: 'reports', icon: 'reports' },
  ],
  student: [
    { label: 'Dashboard', key: 'dashboard', icon: 'dashboard' },
    { label: 'My Progress', key: 'progress', icon: 'progress' },
    { label: 'Activities', key: 'activities', icon: 'activities' },
    { label: 'Sessions', key: 'sessions', icon: 'sessions' },
    { label: 'My Profile', key: 'profile', icon: 'profile' },
  ],
};

export default function Sidebar({ role, activePage, onNavigate, user, onLogout }) {
  const navItems = navByRole[role] || navByRole.student;

  return (
    <div className="fixed left-0 top-0 h-full w-64 flex flex-col" style={{ background: '#F1F5F9', borderRight: '1px solid #E2E8F0' }}>
      {/* Logo */}
      <div className="px-6 py-5" style={{ borderBottom: '1px solid #E2E8F0' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#166534' }}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"/>
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 0 1 .665 6.479A11.952 11.952 0 0 0 12 20.055a11.952 11.952 0 0 0-6.824-2.998 12.078 12.078 0 0 1 .665-6.479L12 14z"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-700 leading-tight" style={{ color: '#0F172A', fontWeight: 700 }}>EduTrack</div>
            <div className="text-xs" style={{ color: '#64748B' }}>Student Management</div>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-6 py-3">
        <span className="text-xs font-medium px-2 py-1 rounded-full uppercase tracking-wide" style={{ background: '#DCFCE7', color: '#166534' }}>
          {role}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map(item => {
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 text-left"
                style={{
                  background: isActive ? '#DCFCE7' : 'transparent',
                  color: isActive ? '#166534' : '#64748B',
                  fontWeight: isActive ? 600 : 400,
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#0F172A'; }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; }}}
              >
                <span style={{ color: isActive ? '#166534' : '#94A3B8' }}>{icons[item.icon]}</span>
                {item.label}
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#166534' }}></span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User footer */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid #E2E8F0' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0" style={{ background: '#15803D' }}>
            {user?.avatar || user?.name?.slice(0,2).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate" style={{ color: '#0F172A' }}>{user?.name || 'User'}</div>
            <div className="text-xs truncate" style={{ color: '#64748B' }}>{user?.email || ''}</div>
          </div>
          <button onClick={onLogout} className="p-1.5 rounded-md transition-colors" style={{ color: '#94A3B8' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = '#FEF2F2'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'transparent'; }}>
            {icons.logout}
          </button>
        </div>
      </div>
    </div>
  );
}