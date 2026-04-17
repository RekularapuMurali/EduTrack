import React, { useState } from 'react';
import { Button, Card, Input, Select, Textarea } from '../components/ui/index.jsx';

const AMOUNTS = [250, 500, 1000, 2500];

export default function DonatePage() {
  const [amount, setAmount] = useState(500);
  const [type, setType] = useState('money');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: '0 auto', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 300 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Donate or Volunteer Time</h2>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>Support Visions India via secure donations or by offering volunteer hours for ongoing initiatives.</p>

        <Card title="Donation options" subtitle="Choose an amount and a contribution type">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {AMOUNTS.map(value => (
              <button key={value} onClick={() => setAmount(value)} style={{ padding: '12px 18px', borderRadius: 12, border: amount === value ? '1px solid #285A48' : '1px solid #E2E8F0', background: amount === value ? '#E8F4F9' : '#FFFFFF', color: '#0F172A', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                ₹{value}
              </button>
            ))}
          </div>
        </Card>

        <Card title="Why donate?" subtitle="Your support fuels community projects">
          <ul style={{ listStyle: 'disc', marginLeft: 18, color: '#475569', lineHeight: 1.9, fontSize: 14 }}>
            <li>Deliver educational resources for girls and under-resourced schools.</li>
            <li>Fund health camps, counseling, and critical wellness campaigns.</li>
            <li>Create sustainable livelihoods through training and entrepreneurship.</li>
          </ul>
        </Card>
      </div>

      <div style={{ flex: 1, minWidth: 340 }}>
        <Card title="Secure donation form" subtitle="Complete your support in one step">
          {submitted ? (
            <div style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>🎉</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Thank you!</div>
              <p style={{ color: '#475569', fontSize: 14 }}>Your support has been recorded. We will follow up with the next steps by email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
              <Input label="Full name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required />
              <Input label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
              <Select label="Contribution type" value={type} onChange={e => setType(e.target.value)} options={[
                { value: 'money', label: 'Donate money' },
                { value: 'time', label: 'Donate volunteer time' },
              ]} required />
              <Textarea label="Message (optional)" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note for the team" rows={4} />
              <Button type="submit" variant="primary">Proceed with donation</Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
