import { useState } from 'react';
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
  return (
    <div style={{ padding: 24 }}>
      <div style={{
        background: '#fff', border: '1px solid #E2E8F0',
        borderRadius: 14, padding: '64px 24px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🚧</div>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>
          Coming Soon
        </h3>
        <p style={{ fontSize: 13, color: '#64748B' }}>
          This page will be built in an upcoming day.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser]       = useState(null);
  const [activePage, setPage] = useState('dashboard');

  const handleLogin  = (userData) => { setUser(userData); setPage('dashboard'); };
  const handleLogout = ()         => { setUser(null);     setPage('dashboard'); };

  if (!user) return <Login onLogin={handleLogin} />;

  const pageInfo = PAGE_INFO[activePage] || { title: activePage, sub: '' };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F8FAFC' }}>
      <Sidebar
        role={user.role}
        activePage={activePage}
        onNavigate={setPage}
        user={user}
        onLogout={handleLogout}
      />
      <div style={{ marginLeft: 256, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar title={pageInfo.title} subtitle={pageInfo.sub} />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {renderPage(activePage, user.role, user)}
        </main>
      </div>
    </div>
  );
}