import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard, Card, Badge, Avatar, ProgressBar } from '../../components/ui/index.jsx';
import { mockStudents, mockSessions, progressChartData } from '../../data/mockData.js';

const myStudents        = mockStudents.slice(0, 3);
const upcomingSessions  = mockSessions.filter(s => s.status === 'scheduled');
const completedSessions = mockSessions.filter(s => s.status === 'completed');

const ICONS = {
  students: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  check:    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  calendar: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  progress: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
};

export default function VolunteerDashboard({ user }) {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1200 }}>

      {/* Welcome */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Avatar name={user?.name || 'Priya Nair'} size="lg" />
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: '#0F172A', margin: 0 }}>
            Welcome, {user?.name?.split(' ')[0] || 'Priya'}
          </h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>
            You have <span style={{ color: '#166534', fontWeight: 600 }}>{upcomingSessions.length} sessions</span> coming up this week.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard title="My Students"   value={myStudents.length}        subtitle="Assigned to you" color="#166534" bg="#DCFCE7" icon={ICONS.students} />
        <StatCard title="Sessions Done" value={completedSessions.length} subtitle="This month"      trend={15} color="#1E40AF" bg="#DBEAFE" icon={ICONS.check} />
        <StatCard title="Upcoming"      value={upcomingSessions.length}  subtitle="Scheduled"       color="#92400E" bg="#FEF3C7" icon={ICONS.calendar} />
        <StatCard title="Avg. Score"    value="81%"                      subtitle="Across students" trend={6} color="#166534" bg="#DCFCE7" icon={ICONS.progress} />
      </div>

      {/* Charts + sessions */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <Card title="Student Progress Trend" subtitle="Average score over time">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={progressChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Line type="monotone" dataKey="score" name="Avg Score" stroke="#166534" strokeWidth={2.5}
                dot={{ r: 4, fill: '#166534', strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Upcoming Sessions" subtitle="Next 7 days">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcomingSessions.map(s => (
              <div key={s._id} style={{ background: '#F8FAFC', borderRadius: 10, padding: 12, border: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Avatar name={s.student} size="sm" />
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{s.student}</span>
                </div>
                <p style={{ fontSize: 11, color: '#64748B', margin: '0 0 6px' }}>📅 {s.date} · ⏰ {s.time}</p>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {s.topics.map(t => (
                    <span key={t} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#DCFCE7', color: '#166534' }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* My students */}
      <Card
        title="My Students" subtitle={`${myStudents.length} students assigned`}
        action={<button style={{ fontSize: 12, fontWeight: 500, color: '#166534', background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {myStudents.map(s => <StudentCard key={s._id} student={s} />)}
        </div>
      </Card>
    </div>
  );
}

function StudentCard({ student: s }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? '#86EFAC' : '#F1F5F9'}`,
        borderRadius: 12, padding: 16,
        background: '#F8FAFC', transition: 'border-color 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <Avatar name={s.name} />
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', margin: 0 }}>{s.name}</p>
          <p style={{ fontSize: 11, color: '#64748B', margin: '2px 0 0' }}>{s.grade} · {s.school}</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: '#64748B' }}>Progress</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#166534' }}>{Math.round(s.points / 6)}%</span>
      </div>
      <ProgressBar value={s.points} max={600} height={6} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
        <span style={{ fontSize: 11, color: '#94A3B8' }}>🌿 {s.points} pts</span>
        <Badge variant={s.status}>{s.status}</Badge>
      </div>
    </div>
  );
}