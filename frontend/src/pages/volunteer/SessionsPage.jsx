import React, { useState } from 'react';
import { Badge, Avatar, Button, Modal, Input, Select, Textarea, FilterPills, EmptyState } from '../../components/ui/index.jsx';
import { mockSessions, mockStudents } from '../../data/mockData.js';

const STUDENT_OPTIONS = [
  { value: '', label: 'Select student' },
  ...mockStudents.map(s => ({ value: s._id, label: s.name })),
];
const DURATION_OPTIONS = ['30','45','60','90','120'].map(d => ({ value: d, label: `${d} minutes` }));

export default function SessionsPage({ role }) {
  const [filter,   setFilter]   = useState('all');
  const [addOpen,  setAddOpen]  = useState(false);
  const [sessions, setSessions] = useState(mockSessions);
  const [form, setForm] = useState({ student: '', date: '', time: '', duration: '60', topics: '', notes: '' });

  const counts = {
    all:       sessions.length,
    scheduled: sessions.filter(s => s.status === 'scheduled').length,
    completed: sessions.filter(s => s.status === 'completed').length,
    cancelled: sessions.filter(s => s.status === 'cancelled').length,
  };

  const filtered = sessions.filter(s => filter === 'all' || s.status === filter);

  const handleFormChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleAdd = () => {
    const studentName = mockStudents.find(s => s._id === form.student)?.name || 'Unknown';
    const newSession = {
      _id: `s${Date.now()}`,
      student: studentName, studentId: form.student,
      date: form.date, time: form.time,
      duration: parseInt(form.duration),
      status: 'scheduled',
      topics: form.topics.split(',').map(t => t.trim()).filter(Boolean),
      notes: form.notes,
    };
    setSessions(prev => [newSession, ...prev]);
    setAddOpen(false);
    setForm({ student: '', date: '', time: '', duration: '60', topics: '', notes: '' });
  };

  const markDone = (id) => setSessions(prev => prev.map(s => s._id === id ? { ...s, status: 'completed', attended: true } : s));
  const cancel   = (id) => setSessions(prev => prev.map(s => s._id === id ? { ...s, status: 'cancelled' } : s));

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1200 }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <FilterPills options={['all','scheduled','completed','cancelled']} active={filter} onChange={setFilter} counts={counts} />
        {role !== 'student' && (
          <Button
            onClick={() => setAddOpen(true)}
            icon={<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}
          >
            Schedule Session
          </Button>
        )}
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14 }}>
          <EmptyState
            icon={<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
            title="No sessions found"
            description="Schedule your first session with a student."
            action={role !== 'student' ? <Button onClick={() => setAddOpen(true)}>Schedule Session</Button> : null}
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map(s => (
            <SessionCard key={s._id} session={s} role={role} onMarkDone={() => markDone(s._id)} onCancel={() => cancel(s._id)} />
          ))}
        </div>
      )}

      {/* ── Add Session Modal ── */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Schedule New Session"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.student || !form.date || !form.time}>Schedule</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Select label="Student" required options={STUDENT_OPTIONS} value={form.student} onChange={e => handleFormChange('student', e.target.value)} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Date" type="date" required value={form.date} onChange={e => handleFormChange('date', e.target.value)} />
            <Input label="Time" type="time" required value={form.time} onChange={e => handleFormChange('time', e.target.value)} />
          </div>
          <Select label="Duration" options={DURATION_OPTIONS} value={form.duration} onChange={e => handleFormChange('duration', e.target.value)} />
          <Input label="Topics (comma separated)" placeholder="e.g. Algebra, Physics" value={form.topics} onChange={e => handleFormChange('topics', e.target.value)} />
          <Textarea label="Notes" placeholder="Session goals or notes..." value={form.notes} onChange={e => handleFormChange('notes', e.target.value)} rows={3} />
        </div>
      </Modal>
    </div>
  );
}

// ── SessionCard ───────────────────────────────────────────
function SessionCard({ session: s, role, onMarkDone, onCancel }) {
  const [hovered, setHovered] = useState(false);

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar name={s.student} size="sm" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{s.student}</span>
        </div>
        <Badge variant={s.status}>{s.status}</Badge>
      </div>

      {/* Meta info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          {s.date} at {s.time}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14" strokeLinecap="round"/></svg>
          {s.duration} minutes
        </div>
      </div>

      {/* Topic pills */}
      {s.topics?.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
          {s.topics.map(t => (
            <span key={t} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#F1F5F9', color: '#64748B' }}>{t}</span>
          ))}
        </div>
      )}

      {/* Attended indicator */}
      {s.status === 'completed' && (
        <div style={{ fontSize: 11, color: '#166534', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
          <span>✓</span> Student attended
        </div>
      )}

      {/* Action buttons — only for scheduled sessions, not for student role */}
      {s.status === 'scheduled' && role !== 'student' && (
        <div style={{ display: 'flex', gap: 8, paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
          <ActionBtn onClick={onMarkDone} bg="#DCFCE7" hoverBg="#BBF7D0" color="#166534">Mark Done</ActionBtn>
          <ActionBtn onClick={onCancel}   bg="#FEE2E2" hoverBg="#FECACA" color="#991B1B">Cancel</ActionBtn>
        </div>
      )}
    </div>
  );
}

function ActionBtn({ children, onClick, bg, hoverBg, color }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, fontSize: 12, padding: '6px 0', borderRadius: 8, border: 'none',
        fontWeight: 500, cursor: 'pointer', transition: 'background 0.15s',
        background: hovered ? hoverBg : bg, color,
      }}
    >
      {children}
    </button>
  );
}