import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Card, Badge, ProgressBar, Avatar, Spinner } from '../../components/ui/index.jsx';
import { authAPI, assessmentAPI, activityAPI, sessionAPI } from '../../utils/api.js';

const ECO_LEVELS = [
  { name: 'Seedling', icon: '🌱', min: 0,   max: 100  },
  { name: 'Sapling',  icon: '🌿', min: 100,  max: 250  },
  { name: 'Sprout',   icon: '🌳', min: 250,  max: 400  },
  { name: 'Eco Hero', icon: '🌍', min: 400,  max: 600  },
];

const TYPE_ICON = { tree_plantation: '🌱', recycling: '♻️', water_conservation: '💧', energy_saving: '⚡', other: '🎯' };

export default function StudentDashboard({ user }) {
  const [studentProfile, setProfile]     = useState(null);
  const [assessments,    setAssessments] = useState([]);
  const [activities,     setActivities]  = useState([]);
  const [sessions,       setSessions]    = useState([]);
  const [loading,        setLoading]     = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const meRes = await authAPI.me();
        const sp    = meRes.data.studentProfile;
        setProfile(sp);

        if (sp?._id) {
          const [asmtRes, actRes, sessRes] = await Promise.all([
            assessmentAPI.getByStudent(sp._id),
            activityAPI.getAll({ student: sp._id }),
            sessionAPI.getAll({ student: sp._id }),
          ]);
          const sortedAsmt = (asmtRes.data.data || []).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setAssessments(sortedAsmt);
          setActivities(actRes.data.data  || []);
          setSessions(sessRes.data.data   || []);
        }
      } catch (err) {
        console.error('Student dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12 }}>
        <Spinner /> <span style={{ fontSize: 13, color: '#64748B' }}>Loading your dashboard...</span>
      </div>
    );
  }

  const totalPoints  = studentProfile?.greenPoints || 0;
  const latest       = assessments[assessments.length - 1];
  const trendData    = assessments.map(a => ({ period: a.period?.replace(' 2024','').replace(' 2025','') || '', score: a.overallScore }));
  const radarData    = latest?.subjects?.map(s => ({ subject: s.name, score: s.score, fullMark: 100 })) || [];

  const currentLevel = ECO_LEVELS.find(l => totalPoints >= l.min && totalPoints < l.max) || ECO_LEVELS[ECO_LEVELS.length - 1];
  const nextLevel    = ECO_LEVELS[ECO_LEVELS.indexOf(currentLevel) + 1];

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1200 }}>

      {/* Profile banner */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ height: 80, background: 'linear-gradient(135deg, #285A48, #408A71 60%, #B0E4CC)' }} />
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: -28, marginBottom: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: '#285A48', border: '3px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'white', flexShrink: 0 }}>
              {user?.avatar || user?.name?.slice(0,2).toUpperCase() || 'AS'}
            </div>
            <div style={{ paddingBottom: 4 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#091413', margin: 0 }}>{user?.name || 'Student'}</h2>
              <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>
                {studentProfile?.grade || '—'} · {studentProfile?.school || '—'}
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Overall Score',   value: latest ? `${latest.overallScore}%` : '—' },
              { label: 'Activities Done', value: activities.length },
              { label: 'Green Points',    value: totalPoints },
            ].map(s => (
              <div key={s.label} style={{ background: '#F0F8F5', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                <p style={{ fontSize: 22, fontWeight: 700, color: '#285A48', margin: 0 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: '#64748B', margin: '3px 0 0' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Eco level */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>{currentLevel.icon}</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#091413', margin: 0 }}>{currentLevel.name}</p>
              <p style={{ fontSize: 11, color: '#64748B', margin: '2px 0 0' }}>Current eco level</p>
            </div>
          </div>
          {nextLevel && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>Next: <span style={{ color: '#285A48', fontWeight: 600 }}>{nextLevel.icon} {nextLevel.name}</span></p>
              <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0' }}>{nextLevel.min - totalPoints} pts to go</p>
            </div>
          )}
        </div>
        <ProgressBar value={totalPoints - currentLevel.min} max={currentLevel.max - currentLevel.min} height={10} showLabel />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>{totalPoints} pts</span>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>{currentLevel.max} pts</span>
        </div>
      </div>

      {/* Charts */}
      {assessments.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card title="My Academic Progress" subtitle="Score trend">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0,100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
                <Line type="monotone" dataKey="score" stroke="#285A48" strokeWidth={2.5} dot={{ r: 5, fill: '#285A48', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Subject Performance" subtitle={latest?.period || ''}>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#F1F5F9" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748B' }} />
                <Radar dataKey="score" stroke="#285A48" fill="#285A48" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: '32px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#94A3B8' }}>No assessments recorded yet. Your volunteer will add them soon.</p>
        </div>
      )}

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card title="My Green Activities" subtitle="Recent contributions">
          {activities.length === 0 ? (
            <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '20px 0' }}>No activities logged yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activities.slice(0, 4).map(a => (
                <div key={a._id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F8FAFC', borderRadius: 10, padding: 12 }}>
                  <span style={{ fontSize: 18 }}>{TYPE_ICON[a.type] || '🎯'}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', margin: 0 }}>{a.title}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0' }}>
                      {a.completedAt ? new Date(a.completedAt).toLocaleDateString() : '—'}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#285A48', margin: 0 }}>+{a.pointsEarned}</p>
                    <p style={{ fontSize: 11, margin: '2px 0 0', color: a.verified ? '#22C55E' : '#F59E0B' }}>
                      {a.verified ? '✓ Verified' : 'Pending'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="My Sessions" subtitle="With your volunteer">
          {sessions.length === 0 ? (
            <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', padding: '20px 0' }}>No sessions scheduled yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sessions.slice(0, 4).map(s => (
                <div key={s._id} style={{ background: '#F0F8F5', borderRadius: 10, padding: 14, border: '1px solid #E8F4F8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#091413', margin: 0 }}>
                      With {s.volunteer?.name || 'Volunteer'}
                    </p>
                    <Badge variant={s.status}>{s.status}</Badge>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 6px' }}>
                    📅 {s.scheduledAt ? new Date(s.scheduledAt).toLocaleDateString() : '—'} · ⏱ {s.duration}min
                  </p>
                  {s.topics?.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {s.topics.map(t => <span key={t} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#E8F4F8', color: '#285A48' }}>{t}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}