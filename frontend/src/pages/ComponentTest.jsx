// src/pages/ComponentTest.jsx  — DELETE after Day 3 testing
import { useState } from 'react';
import {
  StatCard, Badge, Avatar, Button, Card, Modal,
  Input, Select, Textarea, ProgressBar,
  EmptyState, FilterPills, Table, SectionHeader, Spinner,
} from '../components/ui/index.jsx';

export default function ComponentTest() {
  const [modalOpen, setModalOpen] = useState(false);
  const [filter,    setFilter]    = useState('all');
  const [inputVal,  setInputVal]  = useState('');

  const rows = [
    { _id: '1', name: 'Arjun Sharma', grade: '8th', status: 'active'   },
    { _id: '2', name: 'Meera Patel',  grade: '7th', status: 'inactive' },
  ];

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 900 }}>

      <section>
        <SectionHeader>Badges</SectionHeader>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['active','inactive','scheduled','completed','cancelled','warning','error','info'].map(v => (
            <Badge key={v} variant={v}>{v}</Badge>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Avatars</SectionHeader>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Avatar name="Arjun Sharma" size="sm" />
          <Avatar name="Meera Patel"  size="md" color="#1E40AF" />
          <Avatar name="Vikram Rao"   size="lg" color="#92400E" />
        </div>
      </section>

      <section>
        <SectionHeader>Buttons</SectionHeader>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {['primary','secondary','outline','danger','ghost'].map(v => (
            <Button key={v} variant={v}>{v}</Button>
          ))}
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section>
        <SectionHeader>Stat Cards</SectionHeader>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <StatCard title="Total Students" value={124} subtitle="this month" trend={8}
            color="#285A48" bg="#E8F4F8"
            icon={<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
          />
          <StatCard title="Volunteers" value={18} trend={-2} color="#1E40AF" bg="#DBEAFE"
            icon={<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}
          />
          <StatCard title="Sessions" value={47} trend={12} color="#92400E" bg="#FEF3C7"
            icon={<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
          />
        </div>
      </section>

      <section>
        <SectionHeader>Progress Bars</SectionHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ProgressBar value={75} showLabel />
          <ProgressBar value={40} height={4} color="#1E40AF" />
          <ProgressBar value={8} max={10} height={8} color="#F59E0B" showLabel />
        </div>
      </section>

      <section>
        <SectionHeader>Filter Pills</SectionHeader>
        <FilterPills
          options={['all','active','inactive']}
          active={filter}
          onChange={setFilter}
          counts={{ all: 6, active: 5, inactive: 1 }}
        />
      </section>

      <section>
        <SectionHeader>Form Inputs</SectionHeader>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="Full Name" placeholder="Student name" required value={inputVal} onChange={e => setInputVal(e.target.value)} />
          <Select label="Grade"
            options={[{ value: '', label: 'Select grade' }, { value: '8th', label: '8th Grade' }]}
          />
          <Input label="Date" type="date" />
          <Input label="Disabled" disabled value="Cannot edit" />
        </div>
        <div style={{ marginTop: 16 }}>
          <Textarea label="Notes" placeholder="Write notes..." />
        </div>
      </section>

      <section>
        <SectionHeader>Table + Card</SectionHeader>
        <Card title="Students" subtitle="test data"
          action={<Button size="sm" onClick={() => setModalOpen(true)}>Open Modal</Button>}>
          <Table
            headers={['Name', 'Grade', 'Status']}
            rows={rows}
            renderRow={s => [
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar name={s.name} size="sm" />
                <span style={{ fontWeight: 500, color: '#0F172A' }}>{s.name}</span>
              </div>,
              s.grade,
              <Badge variant={s.status}>{s.status}</Badge>,
            ]}
          />
        </Card>
      </section>

      <section>
        <SectionHeader>Empty State</SectionHeader>
        <Card>
          <EmptyState
            icon={<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
            title="No students yet"
            description="Add your first student to start tracking progress."
            action={<Button>Add Student</Button>}
          />
        </Card>
      </section>

      <section>
        <SectionHeader>Spinner</SectionHeader>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Spinner />
          <Spinner size={28} color="#1E40AF" />
          <Spinner size={36} color="#EF4444" />
        </div>
      </section>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Student"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Save</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Input label="Full Name" placeholder="Student name" required />
            <Select label="Grade" options={[{ value: '', label: 'Select' }, { value: '8th', label: '8th' }]} />
          </div>
          <Textarea label="Notes" placeholder="Any notes..." />
        </div>
      </Modal>
    </div>
  );
}