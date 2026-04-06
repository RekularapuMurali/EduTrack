import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, RadarChart,
  PolarGrid, PolarAngleAxis, Radar, Legend,
} from 'recharts';
import { Card, Avatar, Badge, ProgressBar, Button, Modal, Input, Select, Textarea } from '../../components/ui/index.jsx';
import { mockStudents, mockAssessments } from '../../data/mockData.js';

const SUBJECT_COLORS = { Math: '#166534', Science: '#15803D', English: '#4ADE80', Hindi: '#86EFAC' };

const SUBJECT_OPTIONS = [
  { value: 'Math',    label: 'Math'    },
  { value: 'Science', label: 'Science' },
  { value: 'English', label: 'English' },
  { value: 'Hindi',   label: 'Hindi'   },
];

const PERIOD_OPTIONS = [
  { value: '', label: 'Select period' },
  { value: 'Q1 2025', label: 'Q1 2025' },
  { value: 'Q2 2025', label: 'Q2 2025' },
];

export default function ProgressPage({ role }) {
  const [selectedId, setSelectedId] = useState(mockStudents[0]._id);
  const [addOpen,    setAddOpen]    = useState(false);
  const [assessments, setAssessments] = useState(mockAssessments);

  // Form for adding new assessment
  const [form, setForm] = useState({
    period: '', remarks: '',
    Math: '', Science: '', English: '', Hindi: '',
  });

  const selected   = mockStudents.find(s => s._id === selectedId) || mockStudents[0];
  const latest     = assessments[assessments.length - 1];

  // Build trend data for line chart
  const trendData  = assessments.map(a => ({
    period: a.period.replace(' 2024', ''),
    overall: a.overallScore,
    ...Object.fromEntries(a.subjects.map(s => [s.name, s.score])),
  }));

  // Build radar data from latest assessment
  const radarData  = latest.subjects.map(s => ({ subject: s.name, score: s.score, fullMark: 100 }));

  // Horizontal bar chart data
  const barData    = latest.subjects.map(s => ({ subject: s.name, score: s.score }));

  const handleFormChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleAddAssessment = () => {
    const subjects = SUBJECT_OPTIONS.map(s => ({ name: s.value, score: parseInt(form[s.value]) || 0 }));
    const overallScore = Math.round(subjects.reduce((sum, s) => sum + s.score, 0) / subjects.length);
    const newAssessment = { _id: `asmt${Date.now()}`, period: form.period, overallScore, subjects, remarks: form.remarks };
    setAssessments(prev => [...prev, newAssessment]);
    setAddOpen(false);
    setForm({ period: '', remarks: '', Math: '', Science: '', English: '', Hindi: '' });
  };

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1200 }}>

      {/* Student selector — only for non-student roles */}
      {role !== 'student' && (
        <Card title="Select Student" subtitle="View individual progress">
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {mockStudents.map(s => {
              const isSelected = s._id === selectedId;
              return (
                <button key={s._id} onClick={() => setSelectedId(s._id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 14px', borderRadius: 10, fontSize: 13,
                    cursor: 'pointer', transition: 'all 0.15s',
                    background: isSelected ? '#DCFCE7' : '#F8FAFC',
                    border:     isSelected ? '1px solid #86EFAC' : '1px solid #E2E8F0',
                    color:      isSelected ? '#166534' : '#64748B',
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  <Avatar name={s.name} size="sm" color={isSelected ? '#166534' : '#15803D'} />
                  {s.name}
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Student overview panel */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <Avatar name={selected.name} size="lg" />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>{selected.name}</h3>
            <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>{selected.grade} · {selected.school}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#166534', lineHeight: 1 }}>{latest.overallScore}%</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>Latest Overall</div>
          </div>
        </div>

        {/* Subject score boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {latest.subjects.map(s => (
            <div key={s.name} style={{ background: '#F8FAFC', borderRadius: 10, padding: 12, textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: '#64748B', margin: '0 0 4px' }}>{s.name}</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 6px' }}>{s.score}%</p>
              <ProgressBar value={s.score} height={4} color={SUBJECT_COLORS[s.name] || '#166534'} />
            </div>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Line chart — score trend */}
        <Card title="Progress Over Time" subtitle="Score trend across all quarters">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              {Object.entries(SUBJECT_COLORS).map(([subject, color]) => (
                <Line key={subject} type="monotone" dataKey={subject} stroke={color} strokeWidth={2} dot={{ r: 3 }} />
              ))}
              <Line type="monotone" dataKey="overall" name="Overall" stroke="#0F172A" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Radar chart */}
        <Card title="Subject Radar" subtitle={`Latest: ${latest.period}`}>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#F1F5F9" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748B' }} />
              <Radar dataKey="score" stroke="#166534" fill="#166534" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Horizontal bar chart */}
      <Card title="Subject Performance" subtitle={`Scores — ${latest.period}`}>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={barData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="subject" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} width={60} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12 }} />
            <Bar dataKey="score" fill="#166534" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Assessment history table */}
      <Card
        title="Assessment History"
        subtitle="All assessment periods"
        action={
          role !== 'student' ? (
            <Button size="sm" onClick={() => setAddOpen(true)}
              icon={<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}
            >
              Add Assessment
            </Button>
          ) : null
        }
        padding="0"
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                {['Period', ...latest.subjects.map(s => s.name), 'Overall', 'Change'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#64748B', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assessments.map((a, i) => {
                const prev   = assessments[i - 1];
                const change = prev ? a.overallScore - prev.overallScore : null;
                return (
                  <AssessmentRow key={a._id} assessment={a} change={change} />
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Add Assessment Modal ── */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Assessment"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAssessment} disabled={!form.period}>Save Assessment</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Select label="Period" required options={PERIOD_OPTIONS} value={form.period} onChange={e => handleFormChange('period', e.target.value)} />
          <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', margin: 0 }}>Subject Scores (out of 100)</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {SUBJECT_OPTIONS.map(s => (
              <Input key={s.value} label={s.label} type="number" placeholder="0–100"
                value={form[s.value]} onChange={e => handleFormChange(s.value, e.target.value)} />
            ))}
          </div>
          <Textarea label="Remarks" placeholder="Notes about this assessment period..." value={form.remarks} onChange={e => handleFormChange('remarks', e.target.value)} rows={2} />
        </div>
      </Modal>
    </div>
  );
}

// ── AssessmentRow sub-component ───────────────────────────
function AssessmentRow({ assessment: a, change }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderBottom: '1px solid #F1F5F9', background: hovered ? '#FAFAFA' : 'transparent', transition: 'background 0.1s' }}
    >
      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{a.period}</td>
      {a.subjects.map(s => (
        <td key={s.name} style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{s.score}%</td>
      ))}
      <td style={{ padding: '12px 16px' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#166534' }}>{a.overallScore}%</span>
      </td>
      <td style={{ padding: '12px 16px' }}>
        {change !== null ? (
          <span style={{ fontSize: 12, fontWeight: 600, color: change >= 0 ? '#22C55E' : '#EF4444' }}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        ) : (
          <span style={{ fontSize: 12, color: '#94A3B8' }}>—</span>
        )}
      </td>
    </tr>
  );
}