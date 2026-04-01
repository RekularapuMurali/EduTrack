import { useState } from 'react';

// Pages – all currently show placeholder text
import AdminDashboard     from './pages/admin/AdminDashboard';
import StudentsPage       from './pages/admin/StudentsPage';
import VolunteersPage     from './pages/admin/VolunteersPage';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import ProgressPage       from './pages/volunteer/ProgressPage';
import ActivitiesPage     from './pages/volunteer/ActivitiesPage';
import SessionsPage       from './pages/volunteer/SessionsPage';
import StudentDashboard   from './pages/student/StudentDashboard';
import Login              from './pages/Login';

// Layout (placeholder stubs today, real ones built Day 2)
import Sidebar from './components/layout/Sidebar';
import Topbar  from './components/layout/Topbar';

// ── Page title map ──────────────────────────────────────
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

// ── Render the correct page based on role + page key ───
function renderPage(page, role, user) {
  // Admin routes
  if (role === 'admin') {
    if (page === 'dashboard')  return <AdminDashboard />;
    if (page === 'students')   return <StudentsPage role={role} />;
    if (page === 'volunteers') return <VolunteersPage />;
    if (page === 'activities') return <ActivitiesPage role={role} />;
    if (page === 'sessions')   return <SessionsPage role={role} />;
    if (page === 'progress')   return <ProgressPage role={role} />;
  }

  // Volunteer routes
  if (role === 'volunteer') {
    if (page === 'dashboard')  return <VolunteerDashboard user={user} />;
    if (page === 'students')   return <StudentsPage role={role} />;
    if (page === 'progress')   return <ProgressPage role={role} />;
    if (page === 'activities') return <ActivitiesPage role={role} />;
    if (page === 'sessions')   return <SessionsPage role={role} />;
  }

  // Student routes
  if (role === 'student') {
    if (page === 'dashboard')  return <StudentDashboard user={user} />;
    if (page === 'progress')   return <ProgressPage role={role} />;
    if (page === 'activities') return <ActivitiesPage role={role} />;
    if (page === 'sessions')   return <SessionsPage role={role} />;
  }

  // Fallback for any page not yet built
  return (
    <div style={{ padding: 24 }}>
      <div style={{
        background: '#fff', border: '1px solid #E2E8F0', borderRadius: 14,
        padding: '64px 24px', textAlign: 'center'
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

// ── Main App ────────────────────────────────────────────
export default function App() {
  // Auth state – will be replaced by AuthContext on Day 7
  const [user, setUser]         = useState(null);
  const [activePage, setPage]   = useState('dashboard');

  // Handle login from Login page
  const handleLogin = (userData) => {
    setUser(userData);
    setPage('dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setPage('dashboard');
  };

  // Show login if not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const pageInfo = PAGE_INFO[activePage] || { title: activePage, sub: '' };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F8FAFC' }}>

      {/* Sidebar – 256px fixed left panel */}
      <Sidebar
        role={user.role}
        activePage={activePage}
        onNavigate={setPage}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main content area – everything to the right of sidebar */}
      <div style={{ marginLeft: 256, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar – fixed 60px header */}
        <Topbar
          title={pageInfo.title}
          subtitle={pageInfo.sub}
        />

        {/* Page content – scrollable */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {renderPage(activePage, user.role, user)}
        </main>

      </div>
    </div>
  );
}