import React, { useMemo, useState } from 'react';
import { Button, Card, Badge } from '../components/ui/index.jsx';

const PROJECTS = [
  { id: 1, name: 'Clean Water Initiative', location: 'Uttar Pradesh', category: 'Health', status: 'Ongoing', description: 'Building wells and water purification centers for rural communities.' },
  { id: 2, name: 'Digital Learning Hub', location: 'Maharashtra', category: 'Education', status: 'Ongoing', description: 'Establishing after-school digital labs and volunteer tutoring.' },
  { id: 3, name: 'Urban Compost Drive', location: 'Delhi', category: 'Environment', status: 'Completed', description: 'Community composting and waste segregation outreach.' },
  { id: 4, name: 'Women Empowerment Training', location: 'Rajasthan', category: 'Livelihood', status: 'Ongoing', description: 'Skill building and entrepreneurship training programs.' },
];

const FILTERS = ['All', 'Education', 'Health', 'Environment', 'Livelihood'];

function StatusBadge({ status }) {
  const variant = status === 'Ongoing' ? 'success' : status === 'Completed' ? 'completed' : 'info';
  return <Badge variant={variant}>{status}</Badge>;
}

export default function ProjectListing() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(project => {
      const matchesFilter = filter === 'All' || project.category === filter;
      const matchesSearch = search.trim() === '' || project.name.toLowerCase().includes(search.toLowerCase()) || project.location.toLowerCase().includes(search.toLowerCase()) || project.description.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1160, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Project & Initiative Listings</h2>
          <p style={{ fontSize: 13, color: '#64748B' }}>Browse active and upcoming social impact projects across India.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {FILTERS.map(option => (
            <button key={option} onClick={() => setFilter(option)} style={{ padding: '10px 16px', borderRadius: 999, border: filter === option ? '1px solid #285A48' : '1px solid #E2E8F0', background: filter === option ? '#E8F9F1' : '#FFFFFF', color: filter === option ? '#285A48' : '#475569', cursor: 'pointer', fontSize: 13 }}>
              {option}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <input type="text" value={search} placeholder="Search by name, location or description" onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 260, padding: '12px 14px', borderRadius: 12, border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#0F172A', outline: 'none' }} />
      </div>

      <div style={{ display: 'grid', gap: 18 }}>
        {filteredProjects.length ? filteredProjects.map(project => (
          <Card key={project.id} title={project.name} subtitle={`${project.location} · ${project.category}`} action={<StatusBadge status={project.status} />}>
            <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.8, marginBottom: 18 }}>{project.description}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: '#64748B' }}>Volunteers needed: 12</span>
              <Button variant="primary" onClick={() => window.alert(`You joined ${project.name}!`)}>Join / Support</Button>
            </div>
          </Card>
        )) : (
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 18, padding: 28, textAlign: 'center' }}>
            <p style={{ color: '#64748B', fontSize: 15 }}>No matching projects found. Try a broader search or clear filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
