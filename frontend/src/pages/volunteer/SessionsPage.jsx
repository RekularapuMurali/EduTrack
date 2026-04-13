import React, { useState, useEffect, useCallback } from 'react';
import { Badge, Avatar, Button, Modal, Input, Select, Textarea, FilterPills, EmptyState, Spinner } from '../../components/ui/index.jsx';
import { sessionAPI, studentAPI } from '../../utils/api.js';

const DURATION_OPTIONS = ['30','45','60','90','120'].map(d => ({ value: d, label: `${d} minutes` }));

export default function SessionsPage({ role }) {
  const [sessions,  setSessions]  = useState([]);
  const [students,  setStudents]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('all');
  const [addOpen,   setAddOpen]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [apiError,  setApiError]  = useState('');
  const [form, setForm] = useState({ student: '', date: '', time: '', duration: '60', topics: '', notes: '' });

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await sessionAPI.getAll();
      setSessions(data.data || []);
    } catch (err) {
      console.error('Fetch sessions error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
    studentAPI.getAll().then(({ data }) => setStudents(data.data || [])).catch(() => {});
  }, [fetchSessions]);

  const counts = {
    all:       sessions.length,
    scheduled: sessions.filter(s => s.status === 'scheduled').length,
    completed: sessions.filter(s => s.status === 'completed').length,
    cancelled: sessions.filter(s => s.status === 'cancelled').length,
  };

  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.status === filter);

  const studentOptions = [
    { value: '', label: 'Select student' },
    ...students.map(s => ({ value: s._id, label: s.user?.name || 'Unknown' })),
  ];

  const handleAdd = async () => {
    if (!form.student || !form.date || !form.time) {
      setApiError('Student, date, and time are required.');
      return;
    }
    setSaving(true);
    setApiError('');
    try {
      const scheduledAt = new Date(`${form.date}T${form.time}`).toISOString();
      await sessionAPI.create({
        student:    form.student,
        scheduledAt,
        duration:   parseInt(form.duration),
        topics:     form.topics.split(',').map(t => t.trim()).filter(Boolean),
        notes:      form.notes,
      });
      setAddOpen(false);
      setForm({ student: '', date: '', time: '', duration: '60', topics: '', notes: '' });
      await fetchSessions();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to schedule session.');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkDone = async (id) => {
    try {
      await sessionAPI.complete(id, { attended: true });
      await fetchSessions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete session.');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this session?')) return;
    try {
      await sessionAPI.cancel(id);
      await fetchSessions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel session.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12 }}>
        <Spinner /> <span style={{ fontSize: 13, color: '#64748B' }}>Loading sessions...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1200 }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <FilterPills options={['all','scheduled','completed','cancelled']} active={filter} onChange={setFilter} counts={counts} />
        {role !== 'student' && (
          <Button onClick={() => { setAddOpen(true); setApiError(''); }}
            icon={<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}>
            Schedule Session
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14 }}>
          <EmptyState
            icon={<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
            title="No sessions found"
            description={filter === 'all' ? 'Schedule your first session with a student.' : `No ${filter} sessions.`}
            action={role !== 'student' && filter === 'all' ? <Button onClick={() => setAddOpen(true)}>Schedule Session</Button> : null}
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map(s => (
            <SessionCard key={s._id} session={s} role={role}
              onMarkDone={() => handleMarkDone(s._id)}
              onCancel={() => handleCancel(s._id)}
            />
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Schedule New Session"
        footer={<><Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={handleAdd} disabled={saving}>{saving ? 'Scheduling...' : 'Schedule'}</Button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {apiError && <div style={{ padding: '8px 12px', borderRadius: 8, background: '#FEE2E2', color: '#991B1B', fontSize: 13, border: '1px solid #FECACA' }}>{apiError}</div>}
          <Select label="Student" required options={studentOptions} value={form.student} onChange={e => setForm({ ...form, student: e.target.value })} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Date" type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <Input label="Time" type="time" required value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
          </div>
          <Select label="Duration" options={DURATION_OPTIONS} value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
          <Input label="Topics (comma separated)" placeholder="e.g. Algebra, Physics" value={form.topics} onChange={e => setForm({ ...form, topics: e.target.value })} />
          <Textarea label="Notes" placeholder="Session goals..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} />
        </div>
      </Modal>
    </div>
  );
}

function SessionCard({ session: s, role, onMarkDone, onCancel }) {
  const [hovered, setHovered] = useState(false);
  const studentName = s.student?.user?.name || 'Unknown Student';
  const scheduledDate = s.scheduledAt ? new Date(s.scheduledAt).toLocaleDateString() : '—';
  const scheduledTime = s.scheduledAt ? new Date(s.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16, boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar name={studentName} size="sm" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{studentName}</span>
        </div>
        <Badge variant={s.status}>{s.status}</Badge>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          {scheduledDate} at {scheduledTime}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14" strokeLinecap="round"/></svg>
          {s.duration} minutes
        </div>
      </div>
      {s.topics?.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
          {s.topics.map(t => <span key={t} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 999, background: '#F1F5F9', color: '#64748B' }}>{t}</span>)}
        </div>
      )}
      {s.status === 'completed' && (
        <p style={{ fontSize: 11, color: '#285A48', margin: '0 0 8px' }}>✓ Student attended</p>
      )}
      {s.status === 'scheduled' && role !== 'student' && (
        <div style={{ display: 'flex', gap: 8, paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
          <ActionBtn onClick={onMarkDone} bg="#E8F4F8" hoverBg="#B0E4CC" color="#285A48">Mark Done</ActionBtn>
          <ActionBtn onClick={onCancel}   bg="#FEE2E2" hoverBg="#FECACA" color="#991B1B">Cancel</ActionBtn>
        </div>
      )}
    </div>
  );
}

function ActionBtn({ children, onClick, bg, hoverBg, color }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ flex: 1, fontSize: 12, padding: '6px 0', borderRadius: 8, border: 'none', fontWeight: 500, cursor: 'pointer', transition: 'background 0.15s', background: hovered ? hoverBg : bg, color }}>
      {children}
    </button>
  );
}
