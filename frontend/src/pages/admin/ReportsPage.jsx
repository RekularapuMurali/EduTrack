import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Card, Badge, Avatar, Button, Spinner } from '../../components/ui/index.jsx';
import { studentAPI, userAPI, sessionAPI, activityAPI } from '../../utils/api.js';

const PIE_COLORS = ['#166534', '#15803D', '#4ADE80', '#86EFAC', '#DCFCE7'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0F172A', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <p style={{ color: '#94A3B8', marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: '#fff', margin: '2px 0' }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function ReportsPage() {
  const [students,    setStudents]   = useState([]);
  const [volunteers,  setVols]       = useState([]);
  const [sessions,    setSessions]   = useState([]);
  const [activities,  setActivities] = useState([]);
  const [loading,     setLoading]    = useState(true);
  const [activeTab,   setActiveTab]  = useState('overview');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [studsRes, volsRes, sessRes, actRes] = await Promise.all([
          studentAPI.getAll(),
          userAPI.getVolunteers(),
          sessionAPI.getAll(),
          activityAPI.getAll(),
        ]);
        setStudents(studsRes.data.data  || []);
        setVols(volsRes.data.data       || []);
        setSessions(sessRes.data.data   || []);
        setActivities(actRes.data.data  || []);
      } catch (err) {
        console.error('Admin reports error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12 }}>
        <Spinner /> <span style={{ fontSize: 13, color: '#64748B' }}>Loading reports...</span>
      </div>
    );
  }

  // ── Computed stats ────────────────────────────────────────
  const totalStudents   = students.length;
  const activeStudents  = students.filter(s => s.status === 'active').length;
  const totalVols       = volunteers.length;
  const activeVols      = volunteers.filter(v => v.isActive !== false).length;
  const totalSessions   = sessions.length;
  const completedSess   = sessions.filter(s => s.status === 'completed').length;
  const totalActivities = activities.length;
  const verifiedActs    = activities.filter(a => a.verified).length;
  const totalPoints     = activities.filter(a => a.verified).reduce((s, a) => s + (a.pointsEarned || 0), 0);
  const attendRate      = totalSessions > 0 ? Math.round((completedSess / totalSessions) * 100) : 0;

  // Activity type distribution for pie
  const actTypeMap = {};
  activities.forEach(a => { actTypeMap[a.type] = (actTypeMap[a.type] || 0) + 1; });
  const actPieData = Object.entries(actTypeMap).map(([type, value]) => ({
    name: type.replace('_', ' '), value,
  }));

  // Volunteer performance bar chart
  const volPerformance = volunteers.map(v => ({
    name:       v.name?.split(' ')[0] || 'Vol',
    students:   students.filter(s => s.volunteer?._id === v._id || s.volunteer === v._id).length,
    sessions:   sessions.filter(s => s.volunteer?._id === v._id || s.volunteer === v._id).length,
    activities: activities.filter(a => a.volunteer?._id === v._id || a.volunteer === v._id).length,
  }));

  // Student status distribution
  const studentStatus = [
    { name: 'Active',    value: activeStudents,                           color: '#166534' },
    { name: 'Inactive',  value: students.filter(s=>s.status==='inactive').length, color: '#94A3B8' },
    { name: 'Graduated', value: students.filter(s=>s.status==='graduated').length,color: '#1E40AF' },
  ].filter(s => s.value > 0);

  // Session status distribution
  const sessionStatus = [
    { name: 'Completed', value: completedSess,                             color: '#166534' },
    { name: 'Scheduled', value: sessions.filter(s=>s.status==='scheduled').length, color: '#1E40AF' },
    { name: 'Cancelled', value: sessions.filter(s=>s.status==='cancelled').length, color: '#EF4444' },
  ];

  const tabs = [
    { key: 'overview',    label: 'Overview'    },
    { key: 'students',    label: 'Students'    },
    { key: 'volunteers',  label: 'Volunteers'  },
    { key: 'activities',  label: 'Activities'  },
    { key: 'sessions',    label: 'Sessions'    },
  ];

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1200 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: 0 }}>Organization Reports</h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>Complete overview of all system data</p>
        </div>
        <Button variant="secondary" onClick={() => window.print()}
          icon={<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>}>
          Print Report
        </Button>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 2, background: '#F1F5F9', borderRadius: 10, padding: 3, width: 'fit-content', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding: '7px 18px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none', transition: 'all 0.15s', background: activeTab === t.key ? '#FFFFFF' : 'transparent', color: activeTab === t.key ? '#0F172A' : '#64748B', boxShadow: activeTab === t.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <>
          {/* Top stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Total Students',   value: totalStudents,   sub: `${activeStudents} active`,    color: '#166534', bg: '#DCFCE7' },
              { label: 'Total Volunteers', value: totalVols,       sub: `${activeVols} active`,        color: '#1E40AF', bg: '#DBEAFE' },
              { label: 'Total Sessions',   value: totalSessions,   sub: `${attendRate}% completion`,   color: '#92400E', bg: '#FEF3C7' },
              { label: 'Points Awarded',   value: totalPoints,     sub: `${verifiedActs} verified acts`,color: '#166534', bg: '#DCFCE7' },
            ].map(s => (
              <div key={s.label} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 6px' }}>{s.label}</p>
                <p style={{ fontSize: 30, fontWeight: 700, color: '#0F172A', margin: '0 0 4px', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: s.color, fontWeight: 500, margin: 0 }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Volunteer performance */}
          <Card title="Volunteer Performance" subtitle="Students, sessions, and activities per volunteer">
            {volPerformance.length === 0 ? (
              <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '24px 0' }}>No volunteers yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={volPerformance} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="students"   name="Students"   fill="#DCFCE7" stroke="#166534" strokeWidth={1} radius={[4,4,0,0]} />
                  <Bar dataKey="sessions"   name="Sessions"   fill="#166534" radius={[4,4,0,0]} />
                  <Bar dataKey="activities" name="Activities" fill="#4ADE80" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Distributions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { title: 'Student Status',   data: studentStatus  },
              { title: 'Session Status',   data: sessionStatus  },
              { title: 'Activity Types',   data: actPieData     },
            ].map(({ title, data }) => (
              <Card key={title} title={title}>
                {data.length === 0 ? (
                  <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '20px 0' }}>No data yet.</p>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={120}>
                      <PieChart>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" paddingAngle={3}>
                          {data.map((entry, i) => <Cell key={i} fill={entry.color || PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 8 }}>
                      {data.map((d, i) => (
                        <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color || PIE_COLORS[i % PIE_COLORS.length], display: 'inline-block' }} />
                            <span style={{ fontSize: 12, color: '#64748B', textTransform: 'capitalize' }}>{d.name}</span>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ── STUDENTS TAB ── */}
      {activeTab === 'students' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'Total',    value: totalStudents },
              { label: 'Active',   value: activeStudents },
              { label: 'Inactive', value: totalStudents - activeStudents },
            ].map(s => (
              <div key={s.label} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, textAlign: 'center' }}>
                <p style={{ fontSize: 32, fontWeight: 800, color: '#166534', margin: '0 0 4px' }}>{s.value}</p>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>{s.label} Students</p>
              </div>
            ))}
          </div>
          <Card title="All Students" subtitle={`${totalStudents} enrolled`} padding="0">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {['Name', 'Grade', 'School', 'Volunteer', 'Green Points', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#64748B' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', fontSize: 13, color: '#94A3B8' }}>No students yet.</td></tr>
                ) : students.map((s, i) => (
                  <tr key={s._id} style={{ borderBottom: i < students.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar name={s.user?.name} size="sm" />
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{s.user?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{s.grade || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{s.school || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{s.volunteer?.name || 'Not assigned'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>{s.greenPoints || 0}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}><Badge variant={s.status}>{s.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {/* ── VOLUNTEERS TAB ── */}
      {activeTab === 'volunteers' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'Total Volunteers', value: totalVols  },
              { label: 'Active',           value: activeVols },
              { label: 'Avg Students Each',value: totalVols > 0 ? Math.round(totalStudents / totalVols) : 0 },
            ].map(s => (
              <div key={s.label} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, textAlign: 'center' }}>
                <p style={{ fontSize: 32, fontWeight: 800, color: '#1E40AF', margin: '0 0 4px' }}>{s.value}</p>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
          <Card title="Volunteer Details" subtitle={`${totalVols} volunteers`} padding="0">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {['Volunteer', 'Email', 'Students Assigned', 'Sessions Run', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#64748B' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {volunteers.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', fontSize: 13, color: '#94A3B8' }}>No volunteers yet.</td></tr>
                ) : volunteers.map((v, i) => {
                  const stuCount  = students.filter(s => s.volunteer?._id === v._id || s.volunteer === v._id).length;
                  const sessCount = sessions.filter(s => s.volunteer?._id === v._id || s.volunteer === v._id).length;
                  return (
                    <tr key={v._id} style={{ borderBottom: i < volunteers.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Avatar name={v.name} size="sm" color="#15803D" />
                          <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{v.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{v.email}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{stuCount}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{sessCount}</td>
                      <td style={{ padding: '12px 16px' }}><Badge variant={v.isActive !== false ? 'active' : 'inactive'}>{v.isActive !== false ? 'active' : 'inactive'}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {/* ── ACTIVITIES TAB ── */}
      {activeTab === 'activities' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Total',         value: totalActivities },
              { label: 'Verified',      value: verifiedActs },
              { label: 'Pending',       value: totalActivities - verifiedActs },
              { label: 'Points Issued', value: totalPoints },
            ].map(s => (
              <div key={s.label} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, textAlign: 'center' }}>
                <p style={{ fontSize: 28, fontWeight: 700, color: '#166534', margin: '0 0 4px' }}>{s.value}</p>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
          <Card title="All Activities" subtitle={`${totalActivities} total`} padding="0">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {['Title', 'Student', 'Type', 'Points', 'Volunteer', 'Date', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#64748B' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', fontSize: 13, color: '#94A3B8' }}>No activities yet.</td></tr>
                ) : activities.map((a, i) => (
                  <tr key={a._id} style={{ borderBottom: i < activities.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{a.title}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{a.student?.user?.name || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B', textTransform: 'capitalize' }}>{(a.type || '').replace('_', ' ')}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>+{a.pointsEarned}</span></td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{a.volunteer?.name || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{a.completedAt ? new Date(a.completedAt).toLocaleDateString() : '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 10px', borderRadius: 999, background: a.verified ? '#DCFCE7' : '#FEF3C7', color: a.verified ? '#166534' : '#92400E' }}>
                        {a.verified ? '✓ Verified' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {/* ── SESSIONS TAB ── */}
      {activeTab === 'sessions' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'Total Sessions', value: totalSessions  },
              { label: 'Completed',      value: completedSess  },
              { label: 'Completion Rate',value: `${attendRate}%` },
            ].map(s => (
              <div key={s.label} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, textAlign: 'center' }}>
                <p style={{ fontSize: 32, fontWeight: 800, color: '#92400E', margin: '0 0 4px' }}>{s.value}</p>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
          <Card title="All Sessions" subtitle={`${totalSessions} total`} padding="0">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {['Student', 'Volunteer', 'Date', 'Duration', 'Topics', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#64748B' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', fontSize: 13, color: '#94A3B8' }}>No sessions yet.</td></tr>
                ) : sessions.map((s, i) => (
                  <tr key={s._id} style={{ borderBottom: i < sessions.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar name={s.student?.user?.name || 'Unknown'} size="sm" />
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{s.student?.user?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{s.volunteer?.name || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{s.scheduledAt ? new Date(s.scheduledAt).toLocaleDateString() : '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{s.duration} min</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {(s.topics || []).slice(0, 2).map(t => (
                          <span key={t} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#F1F5F9', color: '#64748B' }}>{t}</span>
                        ))}
                        {(s.topics || []).length > 2 && <span style={{ fontSize: 11, color: '#94A3B8' }}>+{s.topics.length - 2}</span>}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}><Badge variant={s.status}>{s.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </div>
  );
}