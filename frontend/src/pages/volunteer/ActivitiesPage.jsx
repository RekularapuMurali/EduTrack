import React, { useState, useEffect, useCallback } from 'react';
import { Avatar, Button, Modal, Input, Select, Textarea, EmptyState, Spinner } from '../../components/ui/index.jsx';
import { activityAPI, studentAPI } from '../../utils/api.js';

const TYPE_CONFIG = {
  tree_plantation:    { label: 'Tree Plantation',    icon: '🌱', color: '#166534', bg: '#DCFCE7' },
  recycling:          { label: 'Recycling',           icon: '♻️', color: '#1E40AF', bg: '#DBEAFE' },
  water_conservation: { label: 'Water Conservation', icon: '💧', color: '#0369A1', bg: '#E0F2FE' },
  energy_saving:      { label: 'Energy Saving',       icon: '⚡', color: '#92400E', bg: '#FEF3C7' },
  other:              { label: 'Other',               icon: '🎯', color: '#64748B', bg: '#F1F5F9' },
};

const TYPE_OPTIONS = [
  { value: '', label: 'Select activity type' },
  ...Object.entries(TYPE_CONFIG).map(([value, { label, icon }]) => ({ value, label: `${icon} ${label}` })),
];

export default function ActivitiesPage({ role }) {
  const [activities, setActivities] = useState([]);
  const [students,   setStudents]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [addOpen,    setAddOpen]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [apiError,   setApiError]   = useState('');
  const [form, setForm] = useState({ student: '', type: '', title: '', description: '', pointsEarned: '20' });

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await activityAPI.getAll();
      setActivities(data.data || []);
    } catch (err) {
      console.error('Fetch activities error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
    studentAPI.getAll().then(({ data }) => setStudents(data.data || [])).catch(() => {});
  }, [fetchActivities]);

  const studentOptions = [
    { value: '', label: 'Select student' },
    ...students.map(s => ({ value: s._id, label: s.user?.name || 'Unknown' })),
  ];

  const totalPoints = activities.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
  const verified    = activities.filter(a => a.verified).length;

  const filtered = typeFilter === 'all' ? activities : activities.filter(a => a.type === typeFilter);

  const handleAdd = async () => {
    if (!form.student || !form.type || !form.title) {
      setApiError('Student, type, and title are required.');
      return;
    }
    setSaving(true);
    setApiError('');
    try {
      await activityAPI.create({ ...form, pointsEarned: parseInt(form.pointsEarned) || 20 });
      setAddOpen(false);
      setForm({ student: '', type: '', title: '', description: '', pointsEarned: '20' });
      await fetchActivities();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to log activity.');
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      await activityAPI.verify(id);
      await fetchActivities();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to verify activity.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12 }}>
        <Spinner /> <span style={{ fontSize: 13, color: '#64748B' }}>Loading activities...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1200 }}>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { icon: '🎯', value: activities.length, label: 'Total Activities',  bg: '#F1F5F9' },
          { icon: '⭐', value: totalPoints,        label: 'Total Points',      bg: '#FEF3C7' },
          { icon: '✅', value: verified,           label: 'Verified',          bg: '#DCFCE7' },
          { icon: '⏳', value: activities.length - verified, label: 'Pending', bg: '#FEE2E2' },
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

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[['all','All'], ...Object.entries(TYPE_CONFIG).map(([k,v]) => [k, `${v.icon} ${v.label}`])].map(([key, label]) => (
            <FilterPill key={key} label={label} value={key} active={typeFilter} onChange={setTypeFilter} />
          ))}
        </div>
        {role !== 'student' && (
          <Button onClick={() => { setAddOpen(true); setApiError(''); }}
            icon={<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}>
            Log Activity
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14 }}>
          <EmptyState
            icon={<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
            title="No activities found"
            description={typeFilter === 'all' ? 'Log your first green initiative activity.' : `No ${typeFilter.replace('_',' ')} activities.`}
            action={role !== 'student' && typeFilter === 'all' ? <Button onClick={() => setAddOpen(true)}>Log Activity</Button> : null}
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map(a => <ActivityCard key={a._id} activity={a} role={role} onVerify={() => handleVerify(a._id)} />)}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Log Green Activity"
        footer={<><Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={handleAdd} disabled={saving}>{saving ? 'Logging...' : 'Log Activity'}</Button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {apiError && <div style={{ padding: '8px 12px', borderRadius: 8, background: '#FEE2E2', color: '#991B1B', fontSize: 13, border: '1px solid #FECACA' }}>{apiError}</div>}
          <Select label="Student" required options={studentOptions} value={form.student} onChange={e => setForm({ ...form, student: e.target.value })} />
          <Select label="Activity Type" required options={TYPE_OPTIONS} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
          <Input label="Title" required placeholder="e.g. Tree Plantation Drive" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <Textarea label="Description" placeholder="Describe the activity..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
          <Input label="Points to Award" type="number" value={form.pointsEarned} onChange={e => setForm({ ...form, pointsEarned: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}

function ActivityCard({ activity: a, role, onVerify }) {
  const [hovered, setHovered] = useState(false);
  const cfg = TYPE_CONFIG[a.type] || TYPE_CONFIG.other;
  const studentName = a.student?.user?.name || 'Unknown';

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: 16, boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{cfg.icon}</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', margin: 0 }}>{a.title}</p>
            <p style={{ fontSize: 11, color: cfg.color, margin: '2px 0 0' }}>{cfg.label}</p>
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 10px', borderRadius: 999, background: a.verified ? '#DCFCE7' : '#FEF3C7', color: a.verified ? '#166534' : '#92400E', whiteSpace: 'nowrap' }}>
          {a.verified ? '✓ Verified' : 'Pending'}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Avatar name={studentName} size="sm" />
        <span style={{ fontSize: 13, color: '#64748B' }}>{studentName}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
        <span style={{ fontSize: 11, color: '#94A3B8' }}>📅 {a.completedAt ? new Date(a.completedAt).toLocaleDateString() : '—'}</span>
        <div><span style={{ fontSize: 15, fontWeight: 700, color: '#166534' }}>+{a.pointsEarned}</span><span style={{ fontSize: 11, color: '#94A3B8' }}> pts</span></div>
      </div>
      {!a.verified && role !== 'student' && (
        <VerifyBtn onClick={onVerify} />
      )}
    </div>
  );
}

function VerifyBtn({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: '100%', marginTop: 10, padding: '7px 0', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'background 0.15s', background: hovered ? '#BBF7D0' : '#DCFCE7', color: '#166534' }}>
      Verify Activity
    </button>
  );
}

function FilterPill({ label, value, active, onChange }) {
  const isActive = active === value;
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={() => onChange(value)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', background: isActive ? '#DCFCE7' : (hovered ? '#F8FAFC' : '#FFFFFF'), color: isActive ? '#166534' : '#64748B', border: isActive ? '1px solid #86EFAC' : '1px solid #E2E8F0' }}>
      {label}
    </button>
  );
}