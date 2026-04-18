import React, { useState, useEffect } from 'react';
import { Card, Badge, Avatar, Button, Input, Modal, Spinner } from '../../components/ui/index.jsx';
import { authAPI } from '../../utils/api.js';

const ECO_LEVELS = [
  { name: 'Seedling', icon: '🌱', min: 0,   max: 100,  color: '#166534' },
  { name: 'Sapling',  icon: '🌿', min: 100,  max: 250,  color: '#15803D' },
  { name: 'Sprout',   icon: '🌳', min: 250,  max: 400,  color: '#16a34a' },
  { name: 'Eco Hero', icon: '🌍', min: 400,  max: 600,  color: '#166534' },
];

export default function ProfilePage({ user }) {
  const [profile,    setProfile]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [pwdOpen,    setPwdOpen]    = useState(false);
  const [pwdForm,    setPwdForm]    = useState({ current: '', newPwd: '', confirm: '' });
  const [pwdSaving,  setPwdSaving]  = useState(false);
  const [pwdError,   setPwdError]   = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  useEffect(() => {
    authAPI.me()
      .then(({ data }) => setProfile(data.studentProfile))
      .catch(err => console.error('Profile fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleChangePassword = async () => {
    setPwdError('');
    setPwdSuccess('');
    if (!pwdForm.current || !pwdForm.newPwd || !pwdForm.confirm) {
      setPwdError('All fields are required.');
      return;
    }
    if (pwdForm.newPwd !== pwdForm.confirm) {
      setPwdError('New passwords do not match.');
      return;
    }
    if (pwdForm.newPwd.length < 6) {
      setPwdError('New password must be at least 6 characters.');
      return;
    }
    setPwdSaving(true);
    try {
      await authAPI.updatePassword(pwdForm.current, pwdForm.newPwd);
      setPwdSuccess('Password changed successfully!');
      setPwdForm({ current: '', newPwd: '', confirm: '' });
      setTimeout(() => { setPwdOpen(false); setPwdSuccess(''); }, 1500);
    } catch (err) {
      setPwdError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPwdSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 12 }}>
        <Spinner /> <span style={{ fontSize: 13, color: '#64748B' }}>Loading profile...</span>
      </div>
    );
  }

  const totalPoints  = profile?.greenPoints || 0;
  const currentLevel = ECO_LEVELS.find(l => totalPoints >= l.min && totalPoints < l.max) || ECO_LEVELS[ECO_LEVELS.length - 1];
  const nextLevel    = ECO_LEVELS[ECO_LEVELS.indexOf(currentLevel) + 1];
  const levelPct     = Math.min(100, Math.round(((totalPoints - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100));

  const details = [
    { label: 'Full Name',        value: user?.name || '—'              },
    { label: 'Email Address',    value: user?.email || '—'             },
    { label: 'Grade',            value: profile?.grade || '—'          },
    { label: 'School',           value: profile?.school || '—'         },
    { label: 'Date of Birth',    value: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : '—' },
    { label: 'Address',          value: profile?.address || '—'        },
    { label: 'Parent / Guardian',value: profile?.parentName || '—'    },
    { label: 'Parent Contact',   value: profile?.parentPhone || '—'   },
    { label: 'Volunteer',        value: profile?.volunteer?.name || 'Not assigned' },
    { label: 'Enrollment Date',  value: profile?.enrollmentDate ? new Date(profile.enrollmentDate).toLocaleDateString() : '—' },
    { label: 'Status',           value: profile?.status || '—'         },
  ];

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>

      {/* ── Profile banner ── */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ height: 100, background: 'linear-gradient(135deg, #166534, #15803D 60%, #4ADE80)' }} />
        <div style={{ padding: '0 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: -32 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: 16, background: '#166534', border: '4px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                {user?.avatar || user?.name?.slice(0, 2).toUpperCase() || 'S'}
              </div>
              <div style={{ paddingBottom: 4 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff',paddingBottom: 20, margin: 0 }}>{user?.name}</h2>
                <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>
                  {profile?.grade || '—'} · {profile?.school || '—'}
                </p>
              </div>
            </div>
            <div style={{ paddingBottom: 4, display: 'flex', gap: 10 }}>
              <Button variant="secondary" size="sm" onClick={() => { setPwdOpen(true); setPwdError(''); setPwdSuccess(''); }}
                icon={<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}>
                Change Password
              </Button>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 }}>
            {[
              { label: 'Green Points', value: totalPoints,     color: '#166534' },
              { label: 'Eco Level',    value: currentLevel.name, color: '#15803D' },
              { label: 'Status',       value: profile?.status || '—', color: '#0F172A' },
            ].map(s => (
              <div key={s.label} style={{ background: '#F8FAFC', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: s.color, margin: '0 0 3px' }}>{s.value}</p>
                <p style={{ fontSize: 11, color: '#64748B', margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Eco level progress ── */}
      <Card title="Eco Level Progress" subtitle="Earn points by completing verified green activities">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            {ECO_LEVELS.map((lvl, i) => {
              const isCurrentOrPast = totalPoints >= lvl.min;
              const isCurrent       = currentLevel.name === lvl.name;
              return (
                <div key={lvl.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 24, opacity: isCurrentOrPast ? 1 : 0.35 }}>{lvl.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: isCurrent ? 700 : 400, color: isCurrent ? '#166534' : '#94A3B8' }}>
                    {lvl.name}
                  </span>
                  <span style={{ fontSize: 10, color: '#94A3B8' }}>{lvl.min}+ pts</span>
                </div>
              );
            })}
          </div>
          {nextLevel && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 2px' }}>
                Next: <span style={{ color: '#166534', fontWeight: 600 }}>{nextLevel.icon} {nextLevel.name}</span>
              </p>
              <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>
                {nextLevel.min - totalPoints} pts to go
              </p>
            </div>
          )}
        </div>
        <div style={{ height: 10, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ width: `${levelPct}%`, height: 10, background: 'linear-gradient(90deg, #166534, #4ADE80)', borderRadius: 99, transition: 'width 0.6s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>{totalPoints} pts earned</span>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>{currentLevel.max} pts (level max)</span>
        </div>
      </Card>

      {/* ── Personal details ── */}
      <Card title="Personal Information" subtitle="Your profile details managed by your administrator">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {details.map(({ label, value }, i) => (
            <div key={label} style={{
              padding: '14px 0',
              borderBottom: i < details.length - 2 ? '1px solid #F1F5F9' : 'none',
              paddingRight: i % 2 === 0 ? 24 : 0,
              paddingLeft:  i % 2 === 1 ? 24 : 0,
              borderLeft:   i % 2 === 1 ? '1px solid #F1F5F9' : 'none',
            }}>
              <p style={{ fontSize: 11, color: '#94A3B8', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', margin: 0 }}>
                {label === 'Status'
                  ? <Badge variant={value}>{value}</Badge>
                  : value
                }
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Account info ── */}
      <Card title="Account" subtitle="Login and security settings">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', margin: '0 0 2px' }}>Password</p>
            <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>Last changed: unknown</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => { setPwdOpen(true); setPwdError(''); setPwdSuccess(''); }}>
            Change Password
          </Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', margin: '0 0 2px' }}>Account Role</p>
            <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>Your access level in the system</p>
          </div>
          <Badge variant="info">Student</Badge>
        </div>
      </Card>

      {/* ── Change password modal ── */}
      <Modal open={pwdOpen} onClose={() => setPwdOpen(false)} title="Change Password"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPwdOpen(false)}>Cancel</Button>
            <Button onClick={handleChangePassword} disabled={pwdSaving}>
              {pwdSaving ? 'Saving...' : 'Change Password'}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {pwdError && (
            <div style={{ padding: '8px 12px', borderRadius: 8, background: '#FEE2E2', color: '#991B1B', fontSize: 13, border: '1px solid #FECACA' }}>
              {pwdError}
            </div>
          )}
          {pwdSuccess && (
            <div style={{ padding: '8px 12px', borderRadius: 8, background: '#DCFCE7', color: '#166534', fontSize: 13, border: '1px solid #86EFAC' }}>
              {pwdSuccess}
            </div>
          )}
          <Input label="Current Password" type="password" required
            value={pwdForm.current} onChange={e => setPwdForm({ ...pwdForm, current: e.target.value })} />
          <Input label="New Password" type="password" required
            value={pwdForm.newPwd} onChange={e => setPwdForm({ ...pwdForm, newPwd: e.target.value })} />
          <Input label="Confirm New Password" type="password" required
            value={pwdForm.confirm} onChange={e => setPwdForm({ ...pwdForm, confirm: e.target.value })} />
          <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>
            Password must be at least 6 characters long.
          </p>
        </div>
      </Modal>
    </div>
  );
}