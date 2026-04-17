import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button } from '../components/ui/index.jsx';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <div style={{ flex: 1.2, padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(160deg, #091413 0%, #285A48 100%)', color: 'white' }}>
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: 38, fontWeight: 800, marginBottom: 18 }}>Reset your password</h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>Enter your email and we will send instructions to securely reset your password.</p>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 420, background: 'white', borderRadius: 24, boxShadow: '0 22px 80px rgba(15,23,42,0.12)', padding: '32px 30px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>📧</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Check your inbox</h2>
              <p style={{ color: '#64748B', fontSize: 14 }}>We sent password reset instructions to {email}. Follow the link in your email to continue.</p>
              <Link to="/login" style={{ display: 'inline-block', marginTop: 24, color: '#285A48', fontWeight: 600 }}>Back to login</Link>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>Forgot Password</h2>
              <p style={{ color: '#64748B', fontSize: 13, marginBottom: 24 }}>Enter the email address associated with your account.</p>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
                <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                <Button type="submit" variant="primary">Send reset link</Button>
              </form>
              <p style={{ marginTop: 20, fontSize: 13, color: '#64748B' }}>
                Remembered your password? <Link to="/login" style={{ color: '#285A48', fontWeight: 600 }}>Log in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
