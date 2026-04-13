import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard, Card, Badge, Avatar, ProgressBar, Spinner } from '../../components/ui/index.jsx';
import { studentAPI, sessionAPI, activityAPI } from '../../utils/api.js';

const ICONS = {
  students: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  check:    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  calendar: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  progress: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
};

export default function VolunteerDashboard({ user }) {
  const [students,  setStudents]  = useState([]);
  const [sessions,  setSessions]  = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [studsRes, sessRes] = await Promise.all([
          studentAPI.getAll(),
          sessionAPI.getAll(),
        ]);
        setStudents(studsRes.data.data || []);
        setSessions(sessRes.data.data  || []);
      } catch (err) {
        console.error('Volunteer dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12 }}>
        <Spinner /> <span style={{ fontSize: 13, color: '#64748B' }}>Loading dashboard...</span>
      </div>
    );
  }

  const upcoming  = sessions.filter(s => s.status === 'scheduled');
  const completed = sessions.filter(s => s.status === 'completed');

  // Build a simple progress trend from whatever data we have
  const trendData = sessions.length > 0
    ? [{ month: 'This month', score: completed.length * 10 }]
    : [{ month: 'No data', score: 0 }];

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1200 }}>

      {/* Welcome */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Avatar name={user?.name || 'Volunteer'} size="lg" />
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: '#0F172A', margin: 0 }}>
            Welcome, {user?.name?.split(' ')[0] || 'Volunteer'}
          </h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>
            You have <span style={{ color: '#285A48', fontWeight: 600 }}>{upcoming.length} sessions</span> scheduled.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard title="My Students"   value={students.length}   subtitle="Assigned to you" color="#285A48" bg="#E8F4F8" icon={ICONS.students} />
        <StatCard title="Sessions Done" value={completed.length}  subtitle="This month"      color="#1E40AF" bg="#DBEAFE" icon={ICONS.check} />
        <StatCard title="Upcoming"      value={upcoming.length}   subtitle="Scheduled"       color="#92400E" bg="#FEF3C7" icon={ICONS.calendar} />
        <StatCard title="Total Sessions"value={sessions.length}   subtitle="All time"        color="#285A48" bg="#E8F4F8" icon={ICONS.progress} />
      </div>

      {/* Chart + Sessions */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <Card title="Upcoming Sessions" subtitle={`${upcoming.length} scheduled`}>
          {upcoming.length === 0 ? (
            <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '30px 0' }}>No upcoming sessions. Schedule one from the Sessions page.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcoming.slice(0, 4).map(s => {
                const studentName = s.student?.user?.name || 'Unknown';
                const date = s.scheduledAt ? new Date(s.scheduledAt).toLocaleDateString() : '—';
                const time = s.scheduledAt ? new Date(s.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
                return (
                  <div key={s._id} style={{ background: '#F8FAFC', borderRadius: 10, padding: 12, border: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Avatar name={studentName} size="sm" />
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{studentName}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#64748B', margin: '0 0 6px' }}>📅 {date} · ⏰ {time}</p>
                    {s.topics?.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {s.topics.map(t => <span key={t} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#E8F4F8', color: '#285A48' }}>{t}</span>)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card title="My Students" subtitle={`${students.length} assigned`}>
          {students.length === 0 ? (
            <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '30px 0' }}>No students assigned yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {students.slice(0, 5).map(s => (
                <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={s.user?.name} size="sm" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.user?.name || 'Unknown'}</p>
                    <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{s.grade} · {s.school}</p>
                  </div>
                  <Badge variant={s.status}>{s.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}