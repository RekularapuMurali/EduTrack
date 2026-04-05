import React, { useState } from 'react';
import { Badge, Avatar, Button, Modal, Input, ProgressBar, EmptyState } from '../../components/ui/index.jsx';
import { mockVolunteers } from '../../data/mockData.js';

export default function VolunteersPage() {
  const [addOpen,   setAddOpen]   = useState(false);
  const [viewVol,   setViewVol]   = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const handleFormChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleAdd = () => {
    console.log('Add volunteer:', form);
    setAddOpen(false);
    setForm({ name: '', email: '', phone: '', password: '' });
  };

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1200 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={() => setAddOpen(true)}
          icon={<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}
        >
          Add Volunteer
        </Button>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {mockVolunteers.map(v => (
          <VolunteerCard key={v._id} volunteer={v} onView={() => setViewVol(v)} />
        ))}
      </div>

      {/* ── Add Volunteer Modal ── */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Volunteer"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Volunteer</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Full Name"    placeholder="Volunteer full name"  required value={form.name}     onChange={e => handleFormChange('name', e.target.value)} />
          <Input label="Email"        placeholder="email@example.com"    required type="email" value={form.email} onChange={e => handleFormChange('email', e.target.value)} />
          <Input label="Phone"        placeholder="+91 XXXXX XXXXX"               type="tel"   value={form.phone} onChange={e => handleFormChange('phone', e.target.value)} />
          <Input label="Temp Password" placeholder="Set initial password" required type="password" value={form.password} onChange={e => handleFormChange('password', e.target.value)} />
        </div>
      </Modal>

      {/* ── View Volunteer Modal ── */}
      {viewVol && (
        <Modal
          open={!!viewVol}
          onClose={() => setViewVol(null)}
          title="Volunteer Details"
          footer={<Button variant="secondary" onClick={() => setViewVol(null)}>Close</Button>}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 16, borderBottom: '1px solid #F1F5F9', marginBottom: 16 }}>
              <Avatar name={viewVol.name} size="lg" color="#15803D" />
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', margin: 0 }}>{viewVol.name}</h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 6px' }}>{viewVol.email}</p>
                <Badge variant={viewVol.status}>{viewVol.status}</Badge>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                ['Students Assigned', viewVol.studentsCount],
                ['Sessions This Month', viewVol.sessionsThisMonth],
              ].map(([label, value]) => (
                <div key={label}>
                  <p style={{ fontSize: 11, color: '#94A3B8', margin: '0 0 2px' }}>{label}</p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: '#166534', margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>Monthly target</span>
                <span style={{ fontSize: 12, fontWeight: 500 }}>{viewVol.sessionsThisMonth}/10</span>
              </div>
              <ProgressBar value={viewVol.sessionsThisMonth} max={10} height={6} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── VolunteerCard sub-component ───────────────────────────
function VolunteerCard({ volunteer: v, onView }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 14, padding: 20,
        boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={v.name} size="lg" color="#15803D" />
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>{v.name}</p>
            <p style={{ fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>{v.email}</p>
          </div>
        </div>
        <Badge variant={v.status}>{v.status}</Badge>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        {[
          [v.studentsCount,   'Students'],
          [v.sessionsThisMonth, 'Sessions'],
        ].map(([val, label]) => (
          <div key={label} style={{ background: '#F8FAFC', borderRadius: 10, padding: 10, textAlign: 'center' }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#166534', margin: 0 }}>{val}</p>
            <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: '#64748B' }}>Monthly target</span>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#0F172A' }}>{v.sessionsThisMonth}/10</span>
        </div>
        <ProgressBar value={v.sessionsThisMonth} max={10} height={6} />
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <VolBtn onClick={onView} hoverBg="#DCFCE7" hoverColor="#166534">View Students</VolBtn>
        <VolBtn hoverBg="#DBEAFE" hoverColor="#1E40AF">Assign Student</VolBtn>
      </div>
    </div>
  );
}

function VolBtn({ children, onClick, hoverBg, hoverColor }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, padding: '7px 0', borderRadius: 8,
        border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 500,
        cursor: 'pointer', transition: 'all 0.15s',
        background: hovered ? hoverBg    : '#F8FAFC',
        color:      hovered ? hoverColor : '#64748B',
        borderColor: hovered ? 'transparent' : '#E2E8F0',
      }}
    >
      {children}
    </button>
  );
}