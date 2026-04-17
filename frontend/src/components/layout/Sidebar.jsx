import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const ICONS = {
  dashboard: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  students: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  volunteers: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  progress: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  activities: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  sessions: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  reports: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  settings: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  profile: (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  logout: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

const NAV_BY_ROLE = {
  admin: [
    { label: 'Dashboard', key: 'dashboard', path: '/dashboard' },
    { label: 'Projects', key: 'projects', path: '/projects' },
    { label: 'Volunteers', key: 'volunteers', path: '/volunteers' },
    { label: 'Activities', key: 'activities', path: '/activities' },
    { label: 'Events', key: 'sessions', path: '/sessions' },
    { label: 'Reports', key: 'reports', path: '/reports' },
    { label: 'Impact Stories', key: 'stories', path: '/stories' },
    { label: 'Donate', key: 'donate', path: '/donate' },
    { label: 'Settings', key: 'settings', path: '/settings' },
  ],
  volunteer: [
    { label: 'Dashboard', key: 'dashboard', path: '/dashboard' },
    { label: 'Projects', key: 'projects', path: '/projects' },
    { label: 'Activities', key: 'activities', path: '/activities' },
    { label: 'Events', key: 'sessions', path: '/sessions' },
    { label: 'Progress', key: 'progress', path: '/progress' },
    { label: 'Impact Stories', key: 'stories', path: '/stories' },
    { label: 'Donate', key: 'donate', path: '/donate' },
  ],
  student: [
    { label: 'Dashboard', key: 'dashboard', path: '/dashboard' },
    { label: 'Projects', key: 'projects', path: '/projects' },
    { label: 'Progress', key: 'progress', path: '/progress' },
    { label: 'Activities', key: 'activities', path: '/activities' },
    { label: 'Events', key: 'sessions', path: '/sessions' },
    { label: 'Impact Stories', key: 'stories', path: '/stories' },
    { label: 'Donate', key: 'donate', path: '/donate' },
    { label: 'Profile', key: 'profile', path: '/profile' },
  ],
};

function NavItem({ label, icon, to }) {
  return (
    <NavLink
      to={to}
      end
      style={({ isActive }) => ({
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 12px',
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: isActive ? 600 : 400,
        marginBottom: 2,
        textAlign: 'left',
        transition: 'all 0.15s',
        background: isActive ? '#285A48' : 'transparent',
        color: isActive ? '#B0E4CC' : '#FFFFFF',
        textDecoration: 'none',
      })}
    >
      {({ isActive }) => (
        <>
          <span style={{ display: 'flex', alignItems: 'center', color: '#B0E4CC' }}>{icon}</span>
          <span style={{ flex: 1 }}>{label}</span>
          {isActive && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#B0E4CC', flexShrink: 0 }} />}
        </>
      )}
    </NavLink>
  );
}

function LogoutButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Logout"
      style={{
        padding: 6,
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        transition: 'all 0.15s',
        background: hovered ? '#408A71' : 'transparent',
        color: hovered ? '#B0E4CC' : '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {ICONS.logout}
    </button>
  );
}

export default function Sidebar({ role, user, onLogout }) {
  const navItems = NAV_BY_ROLE[role] || NAV_BY_ROLE.student;

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: 256,
      height: '100vh',
      background: '#091413',
      borderRight: '1px solid #285A48',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 10,
    }}>
      <div style={{
        padding: '18px 20px 14px',
        borderBottom: '1px solid #285A48',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 36,
          height: 36,
          background: '#285A48',
          borderRadius: 10,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="18" height="18" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 14l9-5-9-5-9 5 9 5z"/>
            <path d="M12 14l6.16-3.422a12.083 12.083 0 0 1 .665 6.479A11.952 11.952 0 0 0 12 20.055a11.952 11.952 0 0 0-6.824-2.998 12.078 12.078 0 0 1 .665-6.479L12 14z"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#B0E4CC', lineHeight: 1.2 }}>
            Visions India
          </div>
          <div style={{ fontSize: 11, color: '#408A71' }}>Social Impact Portal</div>
        </div>
      </div>
      <div style={{ padding: '10px 20px 6px' }}>
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          padding: '3px 10px',
          borderRadius: 999,
          background: '#285A48',
          color: '#B0E4CC',
        }}>
          {role}
        </span>
      </div>
      <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>
        {navItems.map((item) => (
          <NavItem key={item.key} label={item.label} icon={ICONS[item.key]} to={item.path} />
        ))}
      </nav>
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #285A48',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: '#285A48',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 600,
          color: 'white',
        }}>
          {user?.avatar || user?.name?.slice(0, 2).toUpperCase() || 'U'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13,
            fontWeight: 500,
            color: '#B0E4CC',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {user?.name || 'Guest'}
          </div>
          <div style={{
            fontSize: 11,
            color: '#408A71',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {user?.role || 'Member'}
          </div>
        </div>
        <LogoutButton onClick={onLogout} />
      </div>
    </div>
  );
}
