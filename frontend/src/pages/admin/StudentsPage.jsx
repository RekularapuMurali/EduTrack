import React, { useState } from 'react';
import {
  Badge, Avatar, Button, Modal,
  Input, Select, FilterPills, EmptyState,
} from '../../components/ui/index.jsx';
import { mockStudents, mockVolunteers } from '../../data/mockData.js';

const GRADE_OPTIONS = [
  { value: '', label: 'Select grade' },
  ...['6th','7th','8th','9th','10th','11th','12th'].map(g => ({ value: g, label: `${g} Grade` })),
];

const STATUS_OPTIONS = [
  { value: 'active',   label: 'Active'   },
  { value: 'inactive', label: 'Inactive' },
];

export default function StudentsPage({ role }) {
  const [filter,  setFilter]  = useState('all');
  const [search,  setSearch]  = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  // Form state for add modal
  const [form, setForm] = useState({ name: '', grade: '', school: '', volunteer: '', parentName: '', parentPhone: '', status: 'active' });

  const volunteerOptions = [
    { value: '', label: 'Assign a volunteer' },
    ...mockVolunteers.filter(v => v.status === 'active').map(v => ({ value: v._id, label: v.name })),
  ];

  // Filter + search logic
  const filtered = mockStudents.filter(s => {
    const matchFilter = filter === 'all' || s.status === filter;
    const matchSearch = search === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.school.toLowerCase().includes(search.toLowerCase()) ||
      s.volunteer.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all:      mockStudents.length,
    active:   mockStudents.filter(s => s.status === 'active').length,
    inactive: mockStudents.filter(s => s.status === 'inactive').length,
  };

  const handleFormChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleAdd = () => {
    // In Week 2: call studentAPI.create(form) here
    console.log('Add student:', form);
    setAddOpen(false);
    setForm({ name: '', grade: '', school: '', volunteer: '', parentName: '', parentPhone: '', status: 'active' });
  };

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1200 }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <FilterPills
          options={['all', 'active', 'inactive']}
          active={filter}
          onChange={setFilter}
          counts={counts}
        />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                fontSize: 13, padding: '7px 14px 7px 34px',
                borderRadius: 8, border: '1px solid #E2E8F0',
                background: '#F8FAFC', color: '#0F172A', outline: 'none', width: 220,
              }}
              onFocus={e  => e.target.style.borderColor = '#166534'}
              onBlur={e   => e.target.style.borderColor = '#E2E8F0'}
            />
            <svg width="15" height="15" fill="none" stroke="#94A3B8" viewBox="0 0 24 24" strokeWidth="2"
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Add button — hidden from student role */}
          {role !== 'student' && (
            <Button
              onClick={() => setAddOpen(true)}
              icon={<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}
            >
              Add Student
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              {['Student', 'Grade', 'School', 'Volunteer', 'Points', 'Status', ''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#64748B', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <EmptyState
                    icon={<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
                    title="No students found"
                    description="Try adjusting your search or filter, or add a new student."
                    action={role !== 'student' ? <Button onClick={() => setAddOpen(true)}>Add Student</Button> : null}
                  />
                </td>
              </tr>
            ) : (
              filtered.map(s => <StudentRow key={s._id} student={s} role={role} onView={() => setViewStudent(s)} />)
            )}
          </tbody>
        </table>
      </div>

      {/* ── Add Student Modal ── */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Student"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Student</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Full Name" placeholder="Student full name" required value={form.name} onChange={e => handleFormChange('name', e.target.value)} />
            <Select label="Grade" required options={GRADE_OPTIONS} value={form.grade} onChange={e => handleFormChange('grade', e.target.value)} />
          </div>
          <Input label="School" placeholder="School name" value={form.school} onChange={e => handleFormChange('school', e.target.value)} />
          <Select label="Assign Volunteer" options={volunteerOptions} value={form.volunteer} onChange={e => handleFormChange('volunteer', e.target.value)} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Parent / Guardian Name" placeholder="Parent name" value={form.parentName} onChange={e => handleFormChange('parentName', e.target.value)} />
            <Input label="Contact Number" placeholder="+91 XXXXX XXXXX" type="tel" value={form.parentPhone} onChange={e => handleFormChange('parentPhone', e.target.value)} />
          </div>
          <Select label="Status" options={STATUS_OPTIONS} value={form.status} onChange={e => handleFormChange('status', e.target.value)} />
        </div>
      </Modal>

      {/* ── View Student Modal ── */}
      {viewStudent && (
        <Modal
          open={!!viewStudent}
          onClose={() => setViewStudent(null)}
          title="Student Details"
          footer={<Button variant="secondary" onClick={() => setViewStudent(null)}>Close</Button>}
        >
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 16, borderBottom: '1px solid #F1F5F9', marginBottom: 16 }}>
              <Avatar name={viewStudent.name} size="lg" />
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', margin: 0 }}>{viewStudent.name}</h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 6px' }}>{viewStudent.grade} · {viewStudent.school}</p>
                <Badge variant={viewStudent.status}>{viewStudent.status}</Badge>
              </div>
            </div>
            {/* Details grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                ['Volunteer',    viewStudent.volunteer],
                ['Green Points', viewStudent.points],
                ['Parent Name',  viewStudent.parentName  || '—'],
                ['Contact',      viewStudent.parentPhone || '—'],
                ['Address',      viewStudent.address     || '—'],
                ['DOB',          viewStudent.dateOfBirth || '—'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p style={{ fontSize: 11, color: '#94A3B8', margin: '0 0 2px' }}>{label}</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── StudentRow sub-component ──────────────────────────────
function StudentRow({ student: s, role, onView }) {
  const [hovered, setHovered] = useState(false);

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderBottom: '1px solid #F1F5F9', background: hovered ? '#FAFAFA' : 'transparent', transition: 'background 0.1s' }}
    >
      {/* Name + avatar */}
      <td style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={s.name} size="sm" />
          <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{s.name}</span>
        </div>
      </td>
      <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{s.grade}</td>
      <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{s.school}</td>
      <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{s.volunteer}</td>
      {/* Points */}
      <td style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{s.points}</span>
        </div>
      </td>
      <td style={{ padding: '12px 16px' }}><Badge variant={s.status}>{s.status}</Badge></td>
      {/* Action buttons */}
      <td style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <IconBtn title="View" onClick={onView} hoverColor="#166534" hoverBg="#DCFCE7">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </IconBtn>
          {role !== 'student' && (
            <IconBtn title="Edit" hoverColor="#1E40AF" hoverBg="#DBEAFE">
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </IconBtn>
          )}
        </div>
      </td>
    </tr>
  );
}

function IconBtn({ children, onClick, title, hoverColor, hoverBg }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick} title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hovered ? hoverBg   : 'transparent',
        color:      hovered ? hoverColor : '#94A3B8',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}