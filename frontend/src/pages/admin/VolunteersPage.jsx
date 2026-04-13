import React, { useState, useEffect, useCallback } from 'react';
import { Badge, Avatar, Button, Modal, Input, ProgressBar, Spinner, EmptyState } from '../../components/ui/index.jsx';
import { userAPI, authAPI } from '../../utils/api.js';

export default function VolunteersPage() {
  const [volunteers, setVols]   = useState([]);
  const [loading,    setLoading] = useState(true);
  const [addOpen,    setAddOpen] = useState(false);
  const [saving,     setSaving]  = useState(false);
  const [apiError,   setApiError]= useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const fetchVols = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await userAPI.getVolunteers();
      setVols(data.data || []);
    } catch (err) {
      console.error('Fetch volunteers error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVols(); }, [fetchVols]);

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.password) {
      setApiError('Name, email and password are required.');
      return;
    }
    setSaving(true);
    setApiError('');
    try {
      await authAPI.register({ ...form, role: 'volunteer' });
      setAddOpen(false);
      setForm({ name: '', email: '', phone: '', password: '' });
      await fetchVols();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to add volunteer.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (vol) => {
    const action = vol.isActive ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} ${vol.name}?`)) return;
    try {
      await userAPI.setStatus(vol._id, !vol.isActive);
      await fetchVols();
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} volunteer.`);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12 }}>
        <Spinner /> <span style={{ fontSize: 13, color: '#64748B' }}>Loading volunteers...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1200 }}>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={() => { setAddOpen(true); setApiError(''); }}
          icon={<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}>
          Add Volunteer
        </Button>
      </div>

      {volunteers.length === 0 ? (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14 }}>
          <EmptyState
            icon={<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}
            title="No volunteers yet"
            description="Add your first volunteer to start assigning students."
            action={<Button onClick={() => setAddOpen(true)}>Add Volunteer</Button>}
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {volunteers.map(v => <VolunteerCard key={v._id} volunteer={v} onToggleStatus={() => handleToggleStatus(v)} />)}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Volunteer"
        footer={<><Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={handleAdd} disabled={saving}>{saving ? 'Adding...' : 'Add Volunteer'}</Button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {apiError && <div style={{ padding: '8px 12px', borderRadius: 8, background: '#FEE2E2', color: '#991B1B', fontSize: 13, border: '1px solid #FECACA' }}>{apiError}</div>}
          <Input label="Full Name"      placeholder="Volunteer name"    required value={form.name}     onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Email"          placeholder="email@example.com" required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input label="Phone"          placeholder="+91 XXXXX XXXXX"            type="tel"   value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <Input label="Password"       placeholder="Set initial password" required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
      </Modal>
    </div>
  );
}

function VolunteerCard({ volunteer: v, onToggleStatus }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20, boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={v.name} size="lg" color="#285A48" />
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#091413', margin: 0 }}>{v.name}</p>
            <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>{v.email}</p>
          </div>
        </div>
        <Badge variant={v.isActive ? 'active' : 'inactive'}>{v.isActive ? 'active' : 'inactive'}</Badge>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {[[v.studentsCount || 0, 'Students']].map(([val, label]) => (
          <div key={label} style={{ background: '#F0F8F5', borderRadius: 10, padding: 10, textAlign: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#285A48', margin: 0 }}>{val}</p>
            <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0' }}>{label}</p>
          </div>
        ))}
        <div style={{ background: '#F0F8F5', borderRadius: 10, padding: 10, textAlign: 'center' }}>
          <p style={{ fontSize: 20, fontWeight: 700, color: '#285A48', margin: 0 }}>{v.phone ? '✓' : '—'}</p>
          <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0' }}>Phone</p>
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: '#64748B' }}>Student capacity</span>
          <span style={{ fontSize: 12, fontWeight: 500 }}>{v.studentsCount || 0}/10</span>
        </div>
        <ProgressBar value={v.studentsCount || 0} max={10} height={6} />
      </div>
      <button onClick={onToggleStatus}
        style={{ width: '100%', padding: '7px 0', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', background: v.isActive ? '#FEE2E2' : '#E8F4F8', color: v.isActive ? '#991B1B' : '#285A48' }}>
        {v.isActive ? 'Deactivate' : 'Activate'}
      </button>
    </div>
  );
}
