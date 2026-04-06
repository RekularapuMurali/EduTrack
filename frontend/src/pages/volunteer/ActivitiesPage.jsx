import React, { useState } from 'react';
import { Avatar, Button, Modal, Input, Select, Textarea, FilterPills, EmptyState } from '../../components/ui/index.jsx';
import { mockActivities, mockStudents } from '../../data/mockData.js';

const TYPE_CONFIG = {
  tree_plantation:    { label: 'Tree Plantation',     icon: '🌱', color: '#166534', bg: '#DCFCE7' },
  recycling:          { label: 'Recycling',            icon: '♻️', color: '#1E40AF', bg: '#DBEAFE' },
  water_conservation: { label: 'Water Conservation',  icon: '💧', color: '#0369A1', bg: '#E0F2FE' },
  energy_saving:      { label: 'Energy Saving',        icon: '⚡', color: '#92400E', bg: '#FEF3C7' },
  other:              { label: 'Other',                icon: '🎯', color: '#64748B', bg: '#F1F5F9' },
};

const TYPE_OPTIONS = [
  { value: '', label: 'Select activity type' },
  ...Object.entries(TYPE_CONFIG).map(([value, { label, icon }]) => ({ value, label: `${icon} ${label}` })),
];

const STUDENT_OPTIONS = [
  { value: '', label: 'Select student' },
  ...mockStudents.map(s => ({ value: s._id, label: s.name })),
];

export default function ActivitiesPage({ role }) {
  const [typeFilter,  setTypeFilter]  = useState('all');
  const [addOpen,     setAddOpen]     = useState(false);
  const [activities,  setActivities]  = useState(mockActivities);
  const [form, setForm] = useState({ student: '', type: '', title: '', description: '', points: '20' });

  const handleFormChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const totalPoints = activities.reduce((sum, a) => sum + a.points, 0);
  const verified    = activities.filter(a => a.verified).length;
  const pending     = activities.length - verified;

  const filtered = activities.filter(a => typeFilter === 'all' || a.type === typeFilter);

  const handleAdd = () => {
    const studentName = mockStudents.find(s => s._id === form.student)?.name || 'Unknown';
    const newActivity = {
      _id: `act${Date.now()}`,
      title: form.title, type: form.type,
      student: studentName, studentId: form.student,
      points: parseInt(form.points) || 20,
      date: new Date().toISOString().split('T')[0],
      verified: false, description: form.description,
    };
    setActivities(prev => [newActivity, ...prev]);
    setAddOpen(false);
    setForm({ student: '', type: '', title: '', description: '', points: '20' });
  };

  const verifyActivity = (id) => setActivities(prev => prev.map(a => a._id === id ? { ...a, verified: true } : a));

  const filterOptions = ['all', ...Object.keys(TYPE_CONFIG)];

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1200 }}>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { icon: '🎯', value: activities.length, label: 'Total Activities', bg: '#F1F5F9' },
          { icon: '⭐', value: totalPoints,        label: 'Total Points',     bg: '#FEF3C7' },
          { icon: '✅', value: verified,           label: 'Verified',         bg: '#DCFCE7' },
          { icon: '⏳', value: pending,            label: 'Pending Review',   bg: '#FEE2E2' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: 22 }}>{s.icon}</span>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: 0 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: '#64748B', margin: '2px 0 0' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + add button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <FilterPill label="All" value="all" active={typeFilter} onChange={setTypeFilter} />
          {Object.entries(TYPE_CONFIG).map(([key, { label, icon }]) => (
            <FilterPill key={key} label={`${icon} ${label}`} value={key} active={typeFilter} onChange={setTypeFilter} />
          ))}
        </div>
        {role !== 'student' && (
          <Button
            onClick={() => setAddOpen(true)}
            icon={<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}
          >
            Log Activity
          </Button>
        )}
      </div>

      {/* Activity cards */}
      {filtered.length === 0 ? (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14 }}>
          <EmptyState
            icon={<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
            title="No activities found"
            description="Log a green initiative activity for a student."
            action={role !== 'student' ? <Button onClick={() => setAddOpen(true)}>Log Activity</Button> : null}
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map(a => (
            <ActivityCard key={a._id} activity={a} role={role} onVerify={() => verifyActivity(a._id)} />
          ))}
        </div>
      )}

      {/* ── Log Activity Modal ── */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Log Green Activity"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.student || !form.type || !form.title}>Log Activity</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Select label="Student"       required options={STUDENT_OPTIONS} value={form.student} onChange={e => handleFormChange('student', e.target.value)} />
          <Select label="Activity Type" required options={TYPE_OPTIONS}    value={form.type}    onChange={e => handleFormChange('type', e.target.value)} />
          <Input  label="Title"         required placeholder="e.g. Tree Plantation Drive at School" value={form.title} onChange={e => handleFormChange('title', e.target.value)} />
          <Textarea label="Description" placeholder="Describe the activity in detail..." value={form.description} onChange={e => handleFormChange('description', e.target.value)} rows={3} />
          <Input  label="Points to Award" type="number" value={form.points} onChange={e => handleFormChange('points', e.target.value)} />
        </div>
      </Modal>
    </div>
  );
}

// ── ActivityCard ──────────────────────────────────────────
function ActivityCard({ activity: a, role, onVerify }) {
  const [hovered, setHovered] = useState(false);
  const cfg = TYPE_CONFIG[a.type] || TYPE_CONFIG.other;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16,
        boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
            {cfg.icon}
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', margin: 0 }}>{a.title}</p>
            <p style={{ fontSize: 11, color: cfg.color, margin: '2px 0 0' }}>{cfg.label}</p>
          </div>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 500, padding: '2px 10px', borderRadius: 999,
          background: a.verified ? '#DCFCE7' : '#FEF3C7',
          color:      a.verified ? '#166534' : '#92400E',
        }}>
          {a.verified ? '✓ Verified' : 'Pending'}
        </span>
      </div>

      {/* Student */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Avatar name={a.student} size="sm" />
        <span style={{ fontSize: 13, color: '#64748B' }}>{a.student}</span>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
        <span style={{ fontSize: 11, color: '#94A3B8' }}>📅 {a.date}</span>
        <div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#166534' }}>+{a.points}</span>
          <span style={{ fontSize: 11, color: '#94A3B8' }}> pts</span>
        </div>
      </div>

      {/* Verify button */}
      {!a.verified && role !== 'student' && (
        <VerifyBtn onClick={onVerify} />
      )}
    </div>
  );
}

function VerifyBtn({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', marginTop: 10, padding: '7px 0', borderRadius: 8,
        border: 'none', fontSize: 12, fontWeight: 500, cursor: 'pointer',
        transition: 'background 0.15s',
        background: hovered ? '#BBF7D0' : '#DCFCE7', color: '#166534',
      }}
    >
      Verify Activity
    </button>
  );
}

function FilterPill({ label, value, active, onChange }) {
  const isActive = active === value;
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={() => onChange(value)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
        cursor: 'pointer', transition: 'all 0.15s',
        background: isActive ? '#DCFCE7' : (hovered ? '#F8FAFC' : '#FFFFFF'),
        color:      isActive ? '#166534' : '#64748B',
        border:     isActive ? '1px solid #86EFAC' : '1px solid #E2E8F0',
      }}
    >
      {label}
    </button>
  );
}