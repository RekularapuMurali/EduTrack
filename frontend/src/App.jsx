import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import PublicLanding from './pages/PublicLanding';

import AdminDashboard from './pages/admin/AdminDashboard';
import StudentsPage from './pages/admin/StudentsPage';
import VolunteersPage from './pages/admin/VolunteersPage';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import ProgressPage from './pages/volunteer/ProgressPage';
import ActivitiesPage from './pages/volunteer/ActivitiesPage';
import SessionsPage from './pages/volunteer/SessionsPage';
import StudentDashboard from './pages/student/StudentDashboard';
import ReportsPage from './pages/volunteer/ReportsPage.jsx';
import AdminReportsPage from './pages/admin/ReportsPage.jsx';
import SettingsPage from './pages/admin/SettingsPage.jsx';
import ProfilePage from './pages/student/ProfilePage.jsx';
import ProjectListing from './pages/ProjectListing';
import DonatePage from './pages/DonatePage';
import ImpactStories from './pages/ImpactStories';

const PAGE_INFO = {
  dashboard: { title: 'Dashboard', sub: 'Overview of your mission work' },
  students: { title: 'Students', sub: 'Manage student profiles and support plans' },
  volunteers: { title: 'Volunteers', sub: 'Manage volunteer teams and roles' },
  progress: { title: 'Progress', sub: 'Track learning and activity results' },
  activities: { title: 'Activities', sub: 'Support social impact initiatives' },
  sessions: { title: 'Events', sub: 'Manage scheduled community sessions' },
  reports: { title: 'Reports', sub: 'Impact analytics and program summaries' },
  profile: { title: 'My Profile', sub: 'Your personal details and settings' },
  settings: { title: 'Settings', sub: 'Platform preferences and system settings' },
  projects: { title: 'Projects', sub: 'Browse initiatives to join or support' },
  donate: { title: 'Donate', sub: 'Support projects with funds or time' },
  stories: { title: 'Impact Stories', sub: 'Share achievements and community stories' },
};

export default function App() {
  const { user, loading, logout } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <PublicLanding />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
        <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />        <Route path="/donate" element={<DonatePage />} />
        <Route path="/projects" element={<ProjectListing />} />
        <Route path="/stories" element={<ImpactStories />} />
        <Route path="/" element={<ProtectedLayout user={user} logout={logout} />}>
          <Route path="dashboard" element={<DashboardPage user={user} />} />
          <Route path="projects" element={<ProjectListing />} />
          <Route path="stories" element={<ImpactStories />} />
          <Route path="students" element={user?.role === 'student' ? <Navigate to="/profile" replace /> : <StudentsPage role={user?.role} />} />
          <Route path="volunteers" element={user?.role === 'student' ? <Navigate to="/dashboard" replace /> : <VolunteersPage />} />
          <Route path="activities" element={<ActivitiesPage role={user?.role} />} />
          <Route path="sessions" element={<SessionsPage role={user?.role} />} />
          <Route path="progress" element={<ProgressPage role={user?.role} />} />
          <Route path="reports" element={user?.role === 'student' ? <Navigate to="/dashboard" replace /> : (user?.role === 'admin' ? <AdminReportsPage /> : <ReportsPage role={user?.role} />)} />
          <Route path="settings" element={user?.role === 'admin' ? <SettingsPage user={user} /> : <Navigate to="/dashboard" replace />} />
          <Route path="profile" element={<ProfilePage user={user} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedLayout({ user, logout }) {
  if (!user) return <Navigate to="/login" replace />;
  return <DashboardLayout user={user} logout={logout} />;
}

function DashboardLayout({ user, logout }) {
  const location = useLocation();
  const currentKey = location.pathname.split('/')[1] || 'dashboard';
  const pageInfo = PAGE_INFO[currentKey] || PAGE_INFO.dashboard;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <Sidebar role={user.role} user={user} onLogout={logout} />
      <div style={{ marginLeft: 256, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar title={pageInfo.title} subtitle={pageInfo.sub} />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function DashboardPage({ user }) {
  if (user?.role === 'admin') return <AdminDashboard user={user} />;
  if (user?.role === 'volunteer') return <VolunteerDashboard user={user} />;
  if (user?.role === 'student') return <StudentDashboard user={user} />;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 18, padding: 32, maxWidth: 760, margin: '24px auto' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Welcome to Edutrack</h2>
        <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8 }}>This portal helps your team coordinate impact work across communities and projects.</p>
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
      <p style={{ fontSize: 16, fontWeight: 600, color: '#091413' }}>Loading Edutrack…</p>
      <div style={{ width: 24, height: 24, border: '2.5px solid #E2E8F0', borderTop: '2.5px solid #285A48', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
