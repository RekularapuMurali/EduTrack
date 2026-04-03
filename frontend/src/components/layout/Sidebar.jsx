import React, { useState } from 'react';

// ── All SVG icons inline — no icon library needed ─────────
const ICONS = {
  dashboard: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  students: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  volunteers: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5
        5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  progress: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  activities: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  sessions: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  reports: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  settings: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83
        2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2
        2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2
        2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2
        2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2
        2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2
        2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2
        2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2
        2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  profile: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  logout: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

// ── Nav items shown per role ──────────────────────────────
const NAV_BY_ROLE = {
  admin: [
    { label: 'Dashboard',   key: 'dashboard'  },
    { label: 'Students',    key: 'students'   },
    { label: 'Volunteers',  key: 'volunteers' },
    { label: 'Activities',  key: 'activities' },
    { label: 'Sessions',    key: 'sessions'   },
    { label: 'Reports',     key: 'reports'    },
    { label: 'Settings',    key: 'settings'   },
  ],
  volunteer: [
    { label: 'Dashboard',   key: 'dashboard'  },
    { label: 'My Students', key: 'students'   },
    { label: 'Progress',    key: 'progress'   },
    { label: 'Activities',  key: 'activities' },
    { label: 'Sessions',    key: 'sessions'   },
    { label: 'Reports',     key: 'reports'    },
  ],
  student: [
    { label: 'Dashboard',   key: 'dashboard'  },
    { label: 'My Progress', key: 'progress'   },
    { label: 'Activities',  key: 'activities' },
    { label: 'Sessions',    key: 'sessions'   },
    { label: 'My Profile',  key: 'profile'    },
  ],
};

// ── NavItem — single button in the sidebar nav ────────────
function NavItem({ label, icon, isActive, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`w-full flex items-center gap-2 px-2 py-2 text-sm 
        ${isActive ? 'bg-green-100' : hovered ? 'bg-gray-200' : ''}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function LogoutButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-1 cursor-pointer"
      title="Logout"
    >
      {ICONS.logout}
    </button>
  );
}

export default function Sidebar({ role, activePage, onNavigate, user, onLogout }) {
  const navItems = NAV_BY_ROLE[role] || NAV_BY_ROLE.student;

  return (
    <div className="w-60 h-screen flex flex-col border-r bg-gray-100">

      {/* Logo */}
      <div className="flex items-center gap-2 p-3 border-b">
        <div className="w-8 h-8 bg-green-600 text-white flex items-center justify-center">
          📘
        </div>
        <div>
          <div className="font-semibold">EduTrack</div>
          <div className="text-xs text-gray-500">Student Management</div>
        </div>
      </div>

      {/* Role */}
      <div className="p-2 text-xs text-green-700">
        {role}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2">
        {navItems.map(item => (
          <NavItem
            key={item.key}
            label={item.label}
            icon={ICONS[item.key]}
            isActive={activePage === item.key}
            onClick={() => onNavigate(item.key)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="flex items-center gap-2 p-3 border-t">
        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">
          {user?.name?.slice(0, 2).toUpperCase() || 'U'}
        </div>

        <div className="flex-1 text-sm">
          <div>{user?.name || 'User'}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>

        <LogoutButton onClick={onLogout} />
      </div>
    </div>
  );
}