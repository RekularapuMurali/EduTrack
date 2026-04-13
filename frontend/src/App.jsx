import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';

import Sidebar from './components/layout/Sidebar';
import Topbar  from './components/layout/Topbar';
import Login   from './pages/Login';

import AdminDashboard     from './pages/admin/AdminDashboard';
import StudentsPage       from './pages/admin/StudentsPage';
import VolunteersPage     from './pages/admin/VolunteersPage';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import ProgressPage       from './pages/volunteer/ProgressPage';
import ActivitiesPage     from './pages/volunteer/ActivitiesPage';
import SessionsPage       from './pages/volunteer/SessionsPage';
import StudentDashboard   from './pages/student/StudentDashboard';

const PAGE_INFO = {
  dashboard:  { title: 'Dashboard',        sub: 'Overview of your organization'       },
  students:   { title: 'Students',         sub: 'Manage student profiles and records' },
  volunteers: { title: 'Volunteers',       sub: 'Manage volunteers and assignments'   },
  progress:   { title: 'Progress',         sub: 'Monitor academic performance'        },
  activities: { title: 'Green Activities', sub: 'Track environmental initiatives'     },
  sessions:   { title: 'Sessions',         sub: 'Schedule and manage sessions'        },
  reports:    { title: 'Reports',          sub: 'Analytics and summaries'             },
  profile:    { title: 'My Profile',       sub: 'Your personal information'           },
  settings:   { title: 'Settings',         sub: 'System configuration'               },
};

function renderPage(page, role, user) {
  if (role === 'admin') {
    if (page === 'dashboard')  return <AdminDashboard />;
    if (page === 'students')   return <StudentsPage role={role} />;
    if (page === 'volunteers') return <VolunteersPage />;
    if (page === 'activities') return <ActivitiesPage role={role} />;
    if (page === 'sessions')   return <SessionsPage role={role} />;
    if (page === 'progress')   return <ProgressPage role={role} />;
  }
  if (role === 'volunteer') {
    if (page === 'dashboard')  return <VolunteerDashboard user={user} />;
    if (page === 'students')   return <StudentsPage role={role} />;
    if (page === 'progress')   return <ProgressPage role={role} />;
    if (page === 'activities') return <ActivitiesPage role={role} />;
    if (page === 'sessions')   return <SessionsPage role={role} />;
  }
  if (role === 'student') {
    if (page === 'dashboard')  return <StudentDashboard user={user} />;
    if (page === 'progress')   return <ProgressPage role={role} />;
    if (page === 'activities') return <ActivitiesPage role={role} />;
    if (page === 'sessions')   return <SessionsPage role={role} />;
  }
  return <ComingSoon />;
}

export default function App() {
  const { user, loading, logout } = useAuth();
  const [activePage, setPage]     = useState('dashboard');

  if (loading) return <LoadingScreen />;
  if (!user)   return <Login />;

  const pageInfo = PAGE_INFO[activePage] || { title: activePage, sub: '' };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F8FAFC' }}>
      <Sidebar role={user.role} activePage={activePage} onNavigate={setPage} user={user} onLogout={logout} />
      <div style={{ marginLeft: 256, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar title={pageInfo.title} subtitle={pageInfo.sub} />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {renderPage(activePage, user.role, user)}
        </main>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', gap: 16 }}>
      <div style={{ width: 48, height: 48, background: '#285A48', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="26" height="26" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 14l9-5-9-5-9 5 9 5z"/>
          <path d="M12 14l6.16-3.422a12.083 12.083 0 0 1 .665 6.479A11.952 11.952 0 0 0 12 20.055a11.952 11.952 0 0 0-6.824-2.998 12.078 12.078 0 0 1 .665-6.479L12 14z"/>
        </svg>
      </div>
      <p style={{ fontSize: 16, fontWeight: 600, color: '#091413' }}>EduTrack</p>
      <div style={{ width: 24, height: 24, border: '2.5px solid #E2E8F0', borderTop: '2.5px solid #285A48', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ComingSoon() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 14 }}>🚧</div>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>Coming Soon</h3>
        <p style={{ fontSize: 13, color: '#64748B', maxWidth: 300, margin: '0 auto' }}>
          This page will be connected in Week 2 when the backend is ready.
        </p>
      </div>
    </div>
  );
}