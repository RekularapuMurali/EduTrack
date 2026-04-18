import React, { useState } from 'react';
import { Button, Card, Input, Select, Textarea } from '../components/ui/index.jsx';

const AMOUNTS = [250, 500, 1000, 2500];

export default function DonatePage() {
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [type, setType] = useState('money');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setSubmitted(true);
    }, 2000);
  };

  const finalAmount = customAmount ? parseInt(customAmount) || 500 : amount;

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: '0 auto', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 300 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Donate or Volunteer Time</h2>
        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>Support Visions India via secure donations or by offering volunteer hours for ongoing initiatives.</p>

        <Card title="Donation options" subtitle="Choose an amount and a contribution type">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            {AMOUNTS.map(value => (
              <button key={value} onClick={() => { setAmount(value); setCustomAmount(''); }} style={{ padding: '12px 18px', borderRadius: 12, border: amount === value && !customAmount ? '1px solid #285A48' : '1px solid #E2E8F0', background: amount === value && !customAmount ? '#E8F4F9' : '#FFFFFF', color: '#0F172A', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                ₹{value}
              </button>
            ))}
          </div>
          <Input label="Or enter custom amount (₹)" type="number" value={customAmount} onChange={e => { setCustomAmount(e.target.value); setAmount(0); }} placeholder="Enter amount" min="1" />
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
              <p style={{ color: '#475569', fontSize: 14 }}>Your donation of ₹{finalAmount} has been processed successfully. We will follow up with the next steps by email.</p>
            </div>
          ) : processing ? (
            <div style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>⏳</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Processing Payment...</div>
              <p style={{ color: '#475569', fontSize: 14 }}>Please wait while we process your ₹{finalAmount} donation.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
              <Input label="Full name (optional)" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
              <Input label="Email address (optional)" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              <Select label="Contribution type" value={type} onChange={e => setType(e.target.value)} options={[
                { value: 'money', label: 'Donate money' },
                { value: 'time', label: 'Donate volunteer time' },
              ]} required />
              {type === 'money' && (
                <Select label="Payment method" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} options={[
                  { value: 'credit_card', label: 'Credit Card' },
                  { value: 'debit_card', label: 'Debit Card' },
                  { value: 'upi', label: 'UPI' },
                  { value: 'paypal', label: 'PayPal' },
                  { value: 'bank_transfer', label: 'Bank Transfer' },
                ]} required />
              )}
              <Textarea label="Message (optional)" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note for the team" rows={4} />
              <Button type="submit" variant="primary" disabled={processing}>
                {type === 'money' ? `Donate ₹${finalAmount}` : 'Submit Volunteer Time'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
