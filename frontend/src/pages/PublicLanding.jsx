import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '../components/ui/index.jsx';

const IMPACT_CARDS = [
  { title: '5,200+', subtitle: 'Community members supported', accent: '#285A48' },
  { title: '120+', subtitle: 'Local projects launched', accent: '#1E3A8A' },
  { title: '48', subtitle: 'Active volunteer teams', accent: '#92400E' },
];

const PROGRAMS = [
  { title: 'Education Access', description: 'Mentoring, literacy drives, and digital learning support.' },
  { title: 'Health & Wellness', description: 'Community screenings, awareness camps, and support groups.' },
  { title: 'Sustainable Livelihoods', description: 'Skills training and micro-enterprise support for families.' },
];

export default function PublicLanding() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)', color: '#0F172A' }}>
      <header style={{ padding: '56px 32px 24px', maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: '#285A48', display: 'grid', placeItems: 'center' }}>
              <span style={{ color: 'white', fontWeight: 700 }}>V</span>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Visions India</div>
              <div style={{ fontSize: 12, color: '#475569' }}>Social Impact Portal</div>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            <a href="#top" style={{ color: '#0F172A', fontSize: 14, fontWeight: 600 }}>Home</a>
            <a href="#about" style={{ color: '#0F172A', fontSize: 14, fontWeight: 600 }}>About</a>
            <a href="#contact" style={{ color: '#0F172A', fontSize: 14, fontWeight: 600 }}>Contact</a>
            <Link to="/login" style={{ color: '#0F172A', fontSize: 14, fontWeight: 600 }}>Login</Link>
            <Link to="/signup" style={{ color: '#285A48', fontSize: 14, fontWeight: 600 }}>Signup</Link>
          </nav>
        </div>
      </header>

      <main id="top" style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px 64px' }}>
        <section style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40, alignItems: 'center', marginBottom: 48 }}>
          <div>
            <div style={{ display: 'inline-flex', padding: '8px 14px', borderRadius: 999, background: '#E8F4F8', color: '#285A48', fontSize: 12, fontWeight: 700, marginBottom: 16 }}>Build impact with technology</div>
            <h1 style={{ fontSize: 52, lineHeight: 1.05, fontWeight: 800, marginBottom: 24 }}>Connect volunteers, partners and communities with measurable social change.</h1>
            <p style={{ maxWidth: 560, fontSize: 17, lineHeight: 1.9, color: '#475569', marginBottom: 28 }}>Visions India helps mission-driven teams organize events, coordinate volunteers, and share stories of real community impact — all from one responsive platform.</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/signup"><Button variant="primary">Get Involved</Button></Link>
              <Link to="/donate"><Button variant="secondary">Donate / Support</Button></Link>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            <Card title="Featured impact" subtitle="Recent community highlights">
              <div style={{ display: 'grid', gap: 16 }}>
                {IMPACT_CARDS.map(card => (
                  <div key={card.title} style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', padding: 20 }}>
                    <div style={{ fontSize: 26, fontWeight: 700, color: card.accent }}>{card.title}</div>
                    <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{card.subtitle}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section id="about" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginBottom: 48 }}>
          {PROGRAMS.map(program => (
            <div key={program.title} style={{ background: 'white', borderRadius: 18, padding: 28, border: '1px solid #E2E8F0', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.04)' }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>{program.title}</div>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.8 }}>{program.description}</p>
            </div>
          ))}
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 24, alignItems: 'center', marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#0F172A', marginBottom: 12, fontWeight: 700 }}>Why Visions India?</div>
            <h2 style={{ fontSize: 34, lineHeight: 1.1, fontWeight: 800, marginBottom: 18 }}>A platform built to scale social good across communities.</h2>
            <ul style={{ display: 'grid', gap: 12, listStyle: 'none', paddingLeft: 0, color: '#475569', fontSize: 15, lineHeight: 1.8 }}>
              <li>• Role-based dashboards for volunteers, admins and impact partners.</li>
              <li>• Track projects, events and outcomes in one shared workspace.</li>
              <li>• Share stories and build trust with donors and local communities.</li>
            </ul>
          </div>
          <div style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #E2E8F0', padding: 28, boxShadow: '0 12px 40px rgba(15, 23, 42, 0.05)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#091413', marginBottom: 10 }}>Join your first campaign</div>
            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.9, marginBottom: 20 }}>Browse project opportunities and volunteer slots that match your interests and availability.</div>
            <Button variant="primary" onClick={() => window.location.href = '/projects'}>Explore Projects</Button>
          </div>
        </section>
        <section id="contact" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24, alignItems: 'flex-start', marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#0F172A', marginBottom: 12, fontWeight: 700 }}>Get in touch</div>
            <h2 style={{ fontSize: 34, lineHeight: 1.1, fontWeight: 800, marginBottom: 18 }}>Need help or want to partner with us?</h2>
            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.9, marginBottom: 20 }}>Contact our team to learn more about volunteering, student support, or collaborative community programs.</p>
            <div style={{ display: 'grid', gap: 12, fontSize: 14, color: '#475569' }}>
              <div><strong>Email:</strong> connect@visionsindia.org</div>
              <div><strong>Phone:</strong> +91 98765 43210</div>
              <div><strong>Address:</strong> 24 Community Center, New Delhi, India</div>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #E2E8F0', padding: 28, boxShadow: '0 12px 40px rgba(15, 23, 42, 0.05)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#091413', marginBottom: 12 }}>Stay connected</div>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.9, marginBottom: 20 }}>Subscribe to updates or reach out about a new project.</p>
            <button style={{ width: '100%', padding: '12px 0', borderRadius: 12, border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#0F172A', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Request a call</button>
          </div>
        </section>
      </main>

      <footer style={{ background: '#091413', color: '#E2F0E8', padding: '32px 20px', marginTop: 32 }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ minWidth: 220 }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Visions India</div>
            <p style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.8, maxWidth: 340 }}>A social impact portal empowering volunteers, admins and community partners to coordinate programs, share stories, and create measurable change.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Quick links</div>
              <div style={{ display: 'grid', gap: 6, fontSize: 14 }}>
                <a href="#top" style={{ color: '#E2F0E8', textDecoration: 'none' }}>Home</a>
                <a href="#about" style={{ color: '#E2F0E8', textDecoration: 'none' }}>About</a>
                <a href="#contact" style={{ color: '#E2F0E8', textDecoration: 'none' }}>Contact</a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Connect</div>
              <div style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.8 }}>connect@visionsindia.org</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
