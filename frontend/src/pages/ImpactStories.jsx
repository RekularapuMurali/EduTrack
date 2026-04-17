import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/index.jsx';

const STORIES = [
  { id: 1, title: 'Education for Every Child', location: 'Bihar', summary: 'Local volunteers tutored 80 students through summer learning camps.', impact: '35% improvement in literacy outcomes.' },
  { id: 2, title: 'Clean Village Campaign', location: 'Tamil Nadu', summary: 'Waste segregation awareness reached 1,200 households.', impact: 'Reduced community waste by 42%.' },
  { id: 3, title: 'Skill Uplift Program', location: 'Karnataka', summary: 'Micro-enterprise training enrolled 60 women in digital embroidery and retail.', impact: '12 new small businesses launched.' },
];

export default function ImpactStories() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 1160, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Impact Stories & Media</h2>
        <p style={{ fontSize: 13, color: '#64748B' }}>Stories from our community partners, volunteers, and beneficiaries.</p>
      </div>

      {!loaded ? (
        <div style={{ minHeight: 260, display: 'grid', placeItems: 'center', color: '#64748B' }}>Loading stories…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          {STORIES.map(story => (
            <Card key={story.id} title={story.title} subtitle={story.location} action={<span style={{ fontSize: 11, color: '#285A48', fontWeight: 700 }}>Impact Story</span>}>
              <p style={{ fontSize: 14, color: '#475569', marginBottom: 14 }}>{story.summary}</p>
              <div style={{ padding: '14px 16px', background: '#F8FAFC', borderRadius: 14 }}>
                <p style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>Key Result</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', margin: 0 }}>{story.impact}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
