import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { Card, Badge, ProgressBar, Avatar } from '../../components/ui/index.jsx';
import { mockAssessments, mockActivities, mockSessions } from '../../data/mockData.js';

// ── Eco level system ──────────────────────────────────────
const ECO_LEVELS = [
  { name: 'Seedling', icon: '🌱', min: 0,   max: 100,  color: '#166534' },
  { name: 'Sapling',  icon: '🌿', min: 100,  max: 250,  color: '#15803D' },
  { name: 'Sprout',   icon: '🌳', min: 250,  max: 400,  color: '#16a34a' },
  { name: 'Eco Hero', icon: '🌍', min: 400,  max: 600,  color: '#166534' },
];

const TYPE_ICON = {
  tree_plantation:    '🌱',
  recycling:          '♻️',
  water_conservation: '💧',
  energy_saving:      '⚡',
  other:              '🎯',
};

export default function StudentDashboard({ user }) {
  const latest      = mockAssessments[mockAssessments.length - 1];
  const myActivities = mockActivities.slice(0, 3);
  const mySessions   = mockSessions.filter(s => s.student === 'Arjun Sharma');
  const totalPoints  = myActivities.reduce((sum, a) => sum + a.points, 0) + 75; // base points

  // Eco level calculation
  const currentLevel = ECO_LEVELS.find(l => totalPoints >= l.min && totalPoints < l.max) || ECO_LEVELS[ECO_LEVELS.length - 1];
  const nextLevel    = ECO_LEVELS[ECO_LEVELS.indexOf(currentLevel) + 1];
  const levelPct     = Math.round(((totalPoints - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100);

  // Chart data
  const trendData  = mockAssessments.map(a => ({ period: a.period.replace(' 2024', ''), score: a.overallScore }));
  const radarData  = latest.subjects.map(s => ({ subject: s.name, score: s.score, fullMark: 100 }));

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1200 }}>

      {/* ── Profile banner ── */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {/* Gradient header */}
        <div style={{ height: 80, background: 'linear-gradient(135deg, #166534, #15803D 60%, #4ADE80)' }} />
        <div style={{ padding: '0 20px 20px' }}>
          {/* Avatar overlapping gradient */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: -28, marginBottom: 14 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: '#166534', border: '3px solid #FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, color: 'white', flexShrink: 0,
            }}>
              {user?.avatar || 'AS'}
            </div>
            <div style={{ paddingBottom: 4 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {user?.name || 'Arjun Sharma'}
              </h2>
              <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>8th Grade · Delhi Public School</p>
            </div>
          </div>

          {/* Stat boxes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Overall Score',     value: `${latest.overallScore}%` },
              { label: 'Activities Done',   value: myActivities.length       },
              { label: 'Green Points',      value: totalPoints               },
            ].map(s => (
              <div key={s.label} style={{ background: '#F8FAFC', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                <p style={{ fontSize: 22, fontWeight: 700, color: '#166534', margin: 0 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: '#64748B', margin: '3px 0 0' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Eco level progress ── */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>{currentLevel.icon}</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>{currentLevel.name}</p>
              <p style={{ fontSize: 11, color: '#64748B', margin: '2px 0 0' }}>Current eco level</p>
            </div>
          </div>
          {nextLevel && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>
                Next: <span style={{ color: '#166534', fontWeight: 600 }}>{nextLevel.icon} {nextLevel.name}</span>
              </p>
              <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0' }}>
                {nextLevel.min - totalPoints} pts to go
              </p>
            </div>
          )}
        </div>
        <ProgressBar value={totalPoints - currentLevel.min} max={currentLevel.max - currentLevel.min} height={10} showLabel />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>{totalPoints} pts</span>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>{currentLevel.max} pts</span>
        </div>
      </div>

      {/* ── Charts row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Score trend */}
        <Card title="My Academic Progress" subtitle="Score trend over quarters">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Line type="monotone" dataKey="score" stroke="#166534" strokeWidth={2.5}
                dot={{ r: 5, fill: '#166534', strokeWidth: 0 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Radar */}
        <Card title="Subject Performance" subtitle={`Latest: ${latest.period}`}>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#F1F5F9" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748B' }} />
              <Radar dataKey="score" stroke="#166534" fill="#166534" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Bottom row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* My activities */}
        <Card title="My Green Activities" subtitle="Recent environmental contributions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myActivities.map(a => (
              <div key={a._id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F8FAFC', borderRadius: 10, padding: 12 }}>
                <span style={{ fontSize: 18 }}>{TYPE_ICON[a.type] || '🎯'}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', margin: 0 }}>{a.title}</p>
                  <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0' }}>{a.date}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#166534', margin: 0 }}>+{a.points}</p>
                  <p style={{ fontSize: 11, margin: '2px 0 0', color: a.verified ? '#22C55E' : '#F59E0B' }}>
                    {a.verified ? '✓ Verified' : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Subject scores */}
        <Card title={`Subject Scores — ${latest.period}`} subtitle="Latest assessment">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {latest.subjects.map(s => (
              <div key={s.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: '#64748B' }}>{s.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{s.score}%</span>
                </div>
                <ProgressBar value={s.score} height={6} color={{ Math: '#166534', Science: '#15803D', English: '#4ADE80', Hindi: '#86EFAC' }[s.name] || '#166534'} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── My sessions ── */}
      {mySessions.length > 0 && (
        <Card title="My Sessions" subtitle="Sessions with your volunteer">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {mySessions.map(s => (
              <div key={s._id} style={{ background: '#F8FAFC', borderRadius: 10, padding: 14, border: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', margin: 0 }}>Session with Priya Nair</p>
                  <Badge variant={s.status}>{s.status}</Badge>
                </div>
                <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 8px' }}>📅 {s.date} · ⏰ {s.time} · ⏱ {s.duration}min</p>
                {s.topics?.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {s.topics.map(t => (
                      <span key={t} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#DCFCE7', color: '#166534' }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}