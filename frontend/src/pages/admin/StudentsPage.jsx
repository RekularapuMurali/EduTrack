import React, { useState, useEffect, useCallback } from 'react';
import { Badge, Avatar, Button, Modal, Input, Select, FilterPills, EmptyState, Spinner } from '../../components/ui/index.jsx';
import { studentAPI, userAPI } from '../../utils/api.js';

const GRADE_OPTIONS = [
  { value: '', label: 'Select grade' },
  ...['6th','7th','8th','9th','10th','11th','12th'].map(g => ({ value: g, label: `${g} Grade` })),
];

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function StudentsPage({ role }) {
  const [students,   setStudents]   = useState([]);
  const [volunteers, setVols]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState('all');
  const [search,     setSearch]     = useState('');
  const [addOpen,    setAddOpen]    = useState(false);
  const [viewStudent,setView]       = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [apiError,   setApiError]   = useState('');

  const debouncedSearch = useDebounce(search, 300);

  const [form, setForm] = useState({
    name: '', email: '', grade: '', school: '',
    parentName: '', parentPhone: '', volunteerId: '',
  });

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await studentAPI.getAll();
      setStudents(data.data || []);
    } catch (err) {
      console.error('Fetch students error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    if (role === 'admin') {
      userAPI.getVolunteers().then(({ data }) => setVols(data.data || [])).catch(() => {});
    }
  }, [fetchStudents, role]);

  const volOptions = [
    { value: '', label: 'Assign a volunteer' },
    ...volunteers.map(v => ({ value: v._id, label: v.name })),
  ];

  const filtered = students.filter(s => {
    const name  = s.user?.name  || '';
    const school = s.school     || '';
    const vol   = s.volunteer?.name || '';
    const matchSearch = debouncedSearch === '' ||
      name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      school.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      vol.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all:      students.length,
    active:   students.filter(s => s.status === 'active').length,
    inactive: students.filter(s => s.status === 'inactive').length,
  };

  const handleAdd = async () => {
    if (!form.name || !form.email) {
      setApiError('Name and email are required.');
      return;
    }
    setSaving(true);
    setApiError('');
    try {
      await studentAPI.create(form);
      setAddOpen(false);
      setForm({ name: '', email: '', grade: '', school: '', parentName: '', parentPhone: '', volunteerId: '' });
      await fetchStudents();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to add student.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await studentAPI.delete(id);
      await fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete student.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12 }}>
        <Spinner /> <span style={{ fontSize: 13, color: '#64748B' }}>Loading students...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1200 }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <FilterPills options={['all','active','inactive']} active={filter} onChange={setFilter} counts={counts} />
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input type="text" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ fontSize: 13, padding: '7px 14px 7px 34px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#091413', outline: 'none', width: 220 }}
              onFocus={e => e.target.style.borderColor = '#285A48'}
              onBlur={e  => e.target.style.borderColor = '#E2E8F0'}
            />
            <svg width="15" height="15" fill="none" stroke="#94A3B8" viewBox="0 0 24 24" strokeWidth="2"
              style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round"/>
            </svg>
          </div>
          {role !== 'student' && (
            <Button onClick={() => { setAddOpen(true); setApiError(''); }}
              icon={<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}>
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
              {['Student','Grade','School','Volunteer','Points','Status',''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#64748B', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7}>
                <EmptyState
                  icon={<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
                  title={search ? 'No students match your search' : 'No students yet'}
                  description={search ? 'Try a different search term.' : 'Add your first student to get started.'}
                  action={role !== 'student' ? <Button onClick={() => setAddOpen(true)}>Add Student</Button> : null}
                />
              </td></tr>
            ) : filtered.map((s, i) => (
              <StudentRow key={s._id} student={s} role={role} isLast={i === filtered.length - 1}
                onView={() => setView(s)} onDelete={() => handleDelete(s._id)} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Student"
        footer={<><Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={handleAdd} disabled={saving}>{saving ? 'Adding...' : 'Add Student'}</Button></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {apiError && <div style={{ padding: '8px 12px', borderRadius: 8, background: '#FEE2E2', color: '#991B1B', fontSize: 13, border: '1px solid #FECACA' }}>{apiError}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Full Name" placeholder="Student name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input label="Email" type="email" placeholder="student@email.com" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Select label="Grade" options={GRADE_OPTIONS} value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} />
            <Input label="School" placeholder="School name" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} />
          </div>
          {role === 'admin' && (
            <Select label="Assign Volunteer" options={volOptions} value={form.volunteerId} onChange={e => setForm({ ...form, volunteerId: e.target.value })} />
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Parent Name" placeholder="Parent / Guardian" value={form.parentName} onChange={e => setForm({ ...form, parentName: e.target.value })} />
            <Input label="Contact" placeholder="+91 XXXXX XXXXX" value={form.parentPhone} onChange={e => setForm({ ...form, parentPhone: e.target.value })} />
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      {viewStudent && (
        <Modal open={!!viewStudent} onClose={() => setView(null)} title="Student Details"
          footer={<Button variant="secondary" onClick={() => setView(null)}>Close</Button>}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 16, borderBottom: '1px solid #F1F5F9', marginBottom: 16 }}>
              <Avatar name={viewStudent.user?.name} size="lg" />
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', margin: 0 }}>{viewStudent.user?.name}</h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 6px' }}>{viewStudent.grade} · {viewStudent.school}</p>
                <Badge variant={viewStudent.status}>{viewStudent.status}</Badge>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                ['Email',        viewStudent.user?.email  || '—'],
                ['Volunteer',    viewStudent.volunteer?.name || 'Not assigned'],
                ['Green Points', viewStudent.greenPoints  || 0],
                ['Parent Name',  viewStudent.parentName   || '—'],
                ['Contact',      viewStudent.parentPhone  || '—'],
                ['Enrolled',     viewStudent.enrollmentDate ? new Date(viewStudent.enrollmentDate).toLocaleDateString() : '—'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p style={{ fontSize: 11, color: '#94A3B8', margin: '0 0 2px' }}>{label}</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', margin: 0 }}>{String(value)}</p>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StudentRow({ student: s, role, onView, onDelete, isLast }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderBottom: isLast ? 'none' : '1px solid #F1F5F9', background: hovered ? '#FAFAFA' : 'transparent', transition: 'background 0.1s' }}>
      <td style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={s.user?.name} size="sm" />
          <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{s.user?.name || 'Unknown'}</span>
        </div>
      </td>
      <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{s.grade || '—'}</td>
      <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{s.school || '—'}</td>
      <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748B' }}>{s.volunteer?.name || 'Not assigned'}</td>
      <td style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#B0E4CC', display: 'inline-block' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#091413' }}>{s.greenPoints || 0}</span>
        </div>
      </td>
      <td style={{ padding: '12px 16px' }}><Badge variant={s.status}>{s.status}</Badge></td>
      <td style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <IconBtn title="View" onClick={onView} hoverColor="#285A48" hoverBg="#E8F4F8">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </IconBtn>
          {role === 'admin' && (
            <IconBtn title="Delete" onClick={onDelete} hoverColor="#991B1B" hoverBg="#FEE2E2">
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
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
    <button onClick={onClick} title={title}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: hovered ? hoverBg : 'transparent', color: hovered ? hoverColor : '#94A3B8', transition: 'all 0.15s' }}>
      {children}
    </button>
  );
}
