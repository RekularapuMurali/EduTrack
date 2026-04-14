import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { Card, Badge, Avatar, Button, Spinner, FilterPills } from '../../components/ui/index.jsx';
import { studentAPI, sessionAPI, activityAPI, assessmentAPI } from '../../utils/api.js';

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

export default function ReportsPage({ role }) {
  const [students,    setStudents]    = useState([]);
  const [sessions,    setSessions]    = useState([]);
  const [activities,  setActivities]  = useState([]);
  const [selectedStudent, setSelected] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState('overview');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [studsRes, sessRes, actRes] = await Promise.all([
          studentAPI.getAll(),
          sessionAPI.getAll(),
          activityAPI.getAll(),
        ]);
        const studs = studsRes.data.data || [];
        setStudents(studs);
        setSessions(sessRes.data.data  || []);
        setActivities(actRes.data.data || []);
        if (studs.length > 0) setSelected(studs[0]);
      } catch (err) {
        console.error('Reports fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Fetch assessments when selected student changes
  useEffect(() => {
    if (!selectedStudent?._id) return;
    assessmentAPI.getByStudent(selectedStudent._id)
      .then(({ data }) => {
        const sorted = (data.data || []).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setAssessments(sorted);
      })
      .catch(() => setAssessments([]));
  }, [selectedStudent]);

  if (loading) {
    return (
      <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12 }}>
        <Spinner /> <span style={{ fontSize: 13, color: '#64748B' }}>Loading reports...</span>
      </div>
    );
  }

  // ── Computed data ─────────────────────────────────────────
  const totalStudents   = students.length;
  const activeStudents  = students.filter(s => s.status === 'active').length;
  const totalSessions   = sessions.length;
  const completedSess   = sessions.filter(s => s.status === 'completed').length;
  const cancelledSess   = sessions.filter(s => s.status === 'cancelled').length;
  const totalActivities = activities.length;
  const verifiedActs    = activities.filter(a => a.verified).length;
  const totalPoints     = activities.filter(a => a.verified).reduce((s, a) => s + (a.pointsEarned || 0), 0);
  const attendanceRate  = totalSessions > 0 ? Math.round((completedSess / totalSessions) * 100) : 0;

  // Session status breakdown
  const sessionBreakdown = [
    { label: 'Completed', count: completedSess,                         color: '#166534' },
    { label: 'Scheduled', count: sessions.filter(s => s.status === 'scheduled').length, color: '#1E40AF' },
    { label: 'Cancelled', count: cancelledSess,                         color: '#EF4444' },
  ];

  // Activity type breakdown
  const actTypeMap = {};
  activities.forEach(a => {
    actTypeMap[a.type] = (actTypeMap[a.type] || 0) + 1;
  });
  const actTypeData = Object.entries(actTypeMap).map(([type, count]) => ({
    type: type.replace('_', ' '),
    count,
  }));

  // Per-student summary
  const studentSummary = students.map(s => ({
    name:       s.user?.name || 'Unknown',
    grade:      s.grade || '—',
    status:     s.status,
    points:     s.greenPoints || 0,
    sessions:   sessions.filter(sess => sess.student?._id === s._id || sess.student === s._id).length,
    activities: activities.filter(a => a.student?._id === s._id || a.student === s._id).length,
  }));

  // Assessment trend for selected student
  const trendData = assessments.map(a => ({
    period:  a.period?.replace(/ 20\d\d/, '') || '',
    overall: a.overallScore,
    ...Object.fromEntries((a.subjects || []).map(s => [s.name, s.score])),
  }));

  const latest = assessments[assessments.length - 1];
  const radarData = latest?.subjects?.map(s => ({ subject: s.name, score: s.score, fullMark: 100 })) || [];

  const tabs = [
    { key: 'overview',   label: 'Overview'         },
    { key: 'sessions',   label: 'Sessions'          },
    { key: 'activities', label: 'Activities'        },
    { key: 'progress',   label: 'Student Progress'  },
    { key: 'students',   label: 'Student Summary'   },
  ];

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1200 }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: 0 }}>Reports</h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>Summary of all your students, sessions and activities</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => window.print()}
          icon={<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>}
        >
          Print Report
        </Button>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 2, background: '#F1F5F9', borderRadius: 10, padding: 3, width: 'fit-content' }}>
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
          {/* Summary stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'My Students',       value: totalStudents,   sub: `${activeStudents} active`,      color: '#166534', bg: '#DCFCE7' },
              { label: 'Total Sessions',    value: totalSessions,   sub: `${attendanceRate}% completion`, color: '#1E40AF', bg: '#DBEAFE' },
              { label: 'Green Activities',  value: totalActivities, sub: `${verifiedActs} verified`,      color: '#92400E', bg: '#FEF3C7' },
              { label: 'Points Awarded',    value: totalPoints,     sub: 'from verified activities',      color: '#166534', bg: '#DCFCE7' },
            ].map(s => (
              <div key={s.label} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 6px' }}>{s.label}</p>
                <p style={{ fontSize: 30, fontWeight: 700, color: '#0F172A', margin: '0 0 4px', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: s.color, margin: 0, fontWeight: 500 }}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Session breakdown + activity type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Card title="Session Breakdown" subtitle="By status">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                {sessionBreakdown.map(item => (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: '#64748B' }}>{item.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{item.count}</span>
                    </div>
                    <div style={{ height: 8, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: totalSessions > 0 ? `${Math.round((item.count / totalSessions) * 100)}%` : '0%', height: 8, background: item.color, borderRadius: 99, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Activity Types" subtitle="Count by category">
              {actTypeData.length === 0 ? (
                <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '24px 0' }}>No activities logged yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={actTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="type" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
                    <Bar dataKey="count" name="Count" fill="#166534" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>
        </>
      )}

      {/* ── SESSIONS TAB ── */}
      {activeTab === 'sessions' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'Total Sessions',     value: totalSessions,  color: '#0F172A' },
              { label: 'Completed',          value: completedSess,  color: '#166534' },
              { label: 'Completion Rate',    value: `${attendanceRate}%`, color: '#1E40AF' },
            ].map(s => (
              <div key={s.label} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, textAlign: 'center' }}>
                <p style={{ fontSize: 32, fontWeight: 800, color: s.color, margin: '0 0 4px' }}>{s.value}</p>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>

          <Card title="All Sessions" subtitle={`${totalSessions} total`} padding="0">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {['Student', 'Date', 'Duration', 'Topics', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#64748B' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', fontSize: 13, color: '#94A3B8' }}>No sessions found.</td></tr>
                ) : sessions.map((s, i) => (
                  <tr key={s._id} style={{ borderBottom: i < sessions.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar name={s.student?.user?.name || 'Unknown'} size="sm" />
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{s.student?.user?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>
                      {s.scheduledAt ? new Date(s.scheduledAt).toLocaleDateString() : '—'}
                    </td>
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

      {/* ── ACTIVITIES TAB ── */}
      {activeTab === 'activities' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Total Logged',  value: totalActivities },
              { label: 'Verified',      value: verifiedActs },
              { label: 'Pending',       value: totalActivities - verifiedActs },
              { label: 'Points Issued', value: totalPoints },
            ].map(s => (
              <div key={s.label} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, textAlign: 'center' }}>
                <p style={{ fontSize: 30, fontWeight: 700, color: '#166534', margin: '0 0 4px' }}>{s.value}</p>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>

          <Card title="All Activities" subtitle={`${totalActivities} total`} padding="0">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {['Title', 'Student', 'Type', 'Points', 'Date', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#64748B' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', fontSize: 13, color: '#94A3B8' }}>No activities found.</td></tr>
                ) : activities.map((a, i) => (
                  <tr key={a._id} style={{ borderBottom: i < activities.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{a.title}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{a.student?.user?.name || 'Unknown'}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B', textTransform: 'capitalize' }}>{(a.type || '').replace('_', ' ')}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>+{a.pointsEarned}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>
                      {a.completedAt ? new Date(a.completedAt).toLocaleDateString() : '—'}
                    </td>
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

      {/* ── PROGRESS TAB ── */}
      {activeTab === 'progress' && (
        <>
          {/* Student selector */}
          <Card title="Select Student">
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {students.map(s => {
                const isSel = selectedStudent?._id === s._id;
                return (
                  <button key={s._id} onClick={() => setSelected(s)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s', background: isSel ? '#DCFCE7' : '#F8FAFC', border: isSel ? '1px solid #86EFAC' : '1px solid #E2E8F0', color: isSel ? '#166534' : '#64748B', fontWeight: isSel ? 600 : 400 }}>
                    <Avatar name={s.user?.name} size="sm" color={isSel ? '#166534' : '#15803D'} />
                    {s.user?.name || 'Unknown'}
                  </button>
                );
              })}
            </div>
          </Card>

          {selectedStudent && (
            <>
              {assessments.length === 0 ? (
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: '40px 24px', textAlign: 'center' }}>
                  <p style={{ fontSize: 13, color: '#94A3B8' }}>No assessments recorded for {selectedStudent.user?.name} yet.</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Card title={`${selectedStudent.user?.name} — Score Trend`} subtitle="All quarters">
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                          <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                          {['Math','Science','English','Hindi'].map((sub, i) => (
                            <Line key={sub} type="monotone" dataKey={sub} stroke={['#166534','#15803D','#4ADE80','#86EFAC'][i]} strokeWidth={2} dot={{ r: 3 }} />
                          ))}
                          <Line type="monotone" dataKey="overall" name="Overall" stroke="#0F172A" strokeWidth={2.5} strokeDasharray="5 5" />
                        </LineChart>
                      </ResponsiveContainer>
                    </Card>

                    <Card title="Subject Radar" subtitle={latest?.period || ''}>
                      <ResponsiveContainer width="100%" height={220}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#F1F5F9" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748B' }} />
                          <Radar dataKey="score" stroke="#166534" fill="#166534" fillOpacity={0.15} strokeWidth={2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </Card>
                  </div>

                  {/* Assessment history table */}
                  <Card title="Assessment History" padding="0">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                          {['Period', ...(latest?.subjects?.map(s => s.name) || []), 'Overall', 'Change'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#64748B', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {assessments.map((a, i) => {
                          const prev = assessments[i - 1];
                          const chg  = prev ? a.overallScore - prev.overallScore : null;
                          return (
                            <tr key={a._id} style={{ borderBottom: i < assessments.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                              <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{a.period}</td>
                              {(a.subjects || []).map(s => (
                                <td key={s.name} style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{s.score}%</td>
                              ))}
                              <td style={{ padding: '12px 16px' }}>
                                <span style={{ fontSize: 14, fontWeight: 700, color: '#166534' }}>{a.overallScore}%</span>
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                {chg !== null
                                  ? <span style={{ fontSize: 12, fontWeight: 600, color: chg >= 0 ? '#22C55E' : '#EF4444' }}>{chg >= 0 ? '↑' : '↓'} {Math.abs(chg)}%</span>
                                  : <span style={{ color: '#94A3B8' }}>—</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </Card>
                </>
              )}
            </>
          )}
        </>
      )}

      {/* ── STUDENT SUMMARY TAB ── */}
      {activeTab === 'students' && (
        <Card title="Student Summary" subtitle={`${totalStudents} students`} padding="0">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                {['Student', 'Grade', 'Status', 'Sessions', 'Activities', 'Green Points'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#64748B' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studentSummary.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', fontSize: 13, color: '#94A3B8' }}>No students yet.</td></tr>
              ) : studentSummary.map((s, i) => (
                <tr key={i} style={{ borderBottom: i < studentSummary.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar name={s.name} size="sm" />
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{s.grade}</td>
                  <td style={{ padding: '12px 16px' }}><Badge variant={s.status}>{s.status}</Badge></td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#0F172A', fontWeight: 500 }}>{s.sessions}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#0F172A', fontWeight: 500 }}>{s.activities}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>{s.points}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}