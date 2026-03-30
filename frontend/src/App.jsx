import React, { useState } from 'react';
import Login from './pages/login.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Topbar from './components/layout/Topbar.jsx';


const pageTitles = {
  dashboard:  { title: 'Dashboard', subtitle: 'Overview of your organization' },
  students:   { title: 'Students', subtitle: 'Manage student profiles and data' },
  volunteers: { title: 'Volunteers', subtitle: 'Manage volunteers and assignments' },
  progress:   { title: 'Progress Tracking', subtitle: 'Monitor academic performance' },
  activities: { title: 'Green Activities', subtitle: 'Track environmental initiatives' },
  sessions:   { title: 'Sessions', subtitle: 'Schedule and manage learning sessions' },
  reports:    { title: 'Reports', subtitle: 'Analytics and summaries' },
  profile:    { title: 'My Profile', subtitle: 'Your personal information' },
  settings:   { title: 'Settings', subtitle: 'System configuration' },
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
    <div className="p-6">
      <div className="rounded-xl p-12 text-center" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
        <div className="text-4xl mb-4">🚧</div>
        <h3 className="text-base font-semibold mb-1" style={{ color: '#0F172A' }}>Coming Soon</h3>
        <p className="text-sm" style={{ color: '#64748B' }}>This page is under construction.</p>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');

  const handleLogin = (userData) => {
    setUser(userData);
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setActivePage('dashboard');
  };

  if (!user) return <Login onLogin={handleLogin} />;

  const pageInfo = pageTitles[activePage] || { title: activePage, subtitle: '' };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F8FAFC' }}>
      <Sidebar
        role={user.role}
        activePage={activePage}
        onNavigate={setActivePage}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden" style={{ marginLeft: 256 }}>
        <Topbar title={pageInfo.title} subtitle={pageInfo.subtitle} />
        <main className="flex-1 overflow-y-auto">
          {renderPage(activePage, user.role, user)}
        </main>
      </div>
    </div>
  );
}