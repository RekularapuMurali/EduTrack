import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StatCard, Card, Badge, Avatar, ProgressBar } from '../../components/ui/index.jsx';
import { studentAPI, userAPI, sessionAPI, activityAPI } from '../../utils/api.js';
import { activityDistribution, adminOverviewData } from '../../data/mockData.js';

const ICONS = {
  students:   <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  volunteers: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  sessions:   <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  activities: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0F172A', borderRadius: 8, padding: '8px 12px' }}>
      <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>{label}</p>
      {payload.map(p => <p key={p.dataKey} style={{ fontSize: 12, color: '#fff', margin: '2px 0' }}>{p.name}: {p.value}</p>)}
    </div>
  );
};

export default function AdminDashboard({ user }) {
  const [stats, setStats]         = useState({ students: 0, volunteers: 0, sessions: 0, activities: 0 });
  const [students, setStudents]   = useState([]);
  const [volunteers, setVols]     = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [studRes, volRes, sessRes, actRes] = await Promise.all([
          studentAPI.getAll(),
          userAPI.getVolunteers(),
          sessionAPI.getAll(),
          activityAPI.getAll(),
        ]);
        const studs = studRes.data.data   || [];
        const vols  = volRes.data.data    || [];
        const sess  = sessRes.data.data   || [];
        const acts  = actRes.data.data    || [];

        setStudents(studs);
        setVols(vols);
        setStats({
          students:   studs.length,
          volunteers: vols.length,
          sessions:   sess.filter(s => s.status === 'scheduled').length,
          activities: acts.length,
        });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <div style={{ width: 28, height: 28, border: '3px solid #E2E8F0', borderTop: '3px solid #166534', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1200 }}>

      {/* Welcome banner */}
      <div style={{ background: 'linear-gradient(135deg, #166534 0%, #15803D 100%)', borderRadius: 14, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 20px rgba(22,101,52,0.25)' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 4 }}>
            Good morning, {user?.name?.split(' ')[0] || 'Admin'} 👋
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Here's your organization overview.</p>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          {[
            [stats.students > 0 ? `${Math.round((students.filter(s=>s.status==='active').length/stats.students)*100)}%` : '—', 'Active Rate'],
            [stats.students, 'Total Students'],
          ].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: 'white' }}>{val}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard title="Total Students"   value={stats.students}   subtitle="In the system"      color="#166534" bg="#DCFCE7" icon={ICONS.students}   />
        <StatCard title="Volunteers"        value={stats.volunteers} subtitle="Active members"     color="#1E40AF" bg="#DBEAFE" icon={ICONS.volunteers} />
        <StatCard title="Active Sessions"   value={stats.sessions}   subtitle="Scheduled"          color="#92400E" bg="#FEF3C7" icon={ICONS.sessions}   />
        <StatCard title="Green Activities"  value={stats.activities} subtitle="Total logged"       color="#166534" bg="#DCFCE7" icon={ICONS.activities} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <Card title="Growth Overview" subtitle="Monthly trend (sample)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={adminOverviewData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
              <Bar dataKey="students" name="Students" fill="#DCFCE7" radius={[4,4,0,0]} stroke="#166534" strokeWidth={1} />
              <Bar dataKey="sessions" name="Sessions"  fill="#166534" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Activity Types" subtitle="Distribution">
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={activityDistribution} cx="50%" cy="50%" innerRadius={38} outerRadius={62} dataKey="value" paddingAngle={3}>
                {activityDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={v => [`${v}%`, '']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {activityDistribution.map(a => (
              <div key={a.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: a.color, display: 'inline-block' }} />
                  <span style={{ fontSize: 12, color: '#64748B' }}>{a.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#0F172A' }}>{a.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card title="Recent Students" subtitle="Latest enrollments" action={<button style={{ fontSize: 12, fontWeight: 500, color: '#166534', background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {students.slice(0, 4).map(s => (
              <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={s.user?.name || 'Unknown'} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.user?.name}</p>
                  <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{s.grade} · {s.school}</p>
                </div>
                <Badge variant={s.status}>{s.status}</Badge>
              </div>
            ))}
            {students.length === 0 && <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '20px 0' }}>No students yet.</p>}
          </div>
        </Card>

        <Card title="Volunteer Overview" subtitle="Active team" action={<button style={{ fontSize: 12, fontWeight: 500, color: '#166534', background: 'none', border: 'none', cursor: 'pointer' }}>Manage →</button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {volunteers.slice(0, 4).map(v => (
              <div key={v._id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={v.name} color="#15803D" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', margin: 0 }}>{v.name}</p>
                  <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{v.studentsCount || 0} students assigned</p>
                </div>
                <div style={{ width: 80 }}>
                  <ProgressBar value={v.studentsCount || 0} max={10} height={5} />
                </div>
              </div>
            ))}
            {volunteers.length === 0 && <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '20px 0' }}>No volunteers yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}