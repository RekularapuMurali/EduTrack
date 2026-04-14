import React, { useState } from 'react';
import { Card, Button, Input, Modal, Badge, Spinner } from '../../components/ui/index.jsx';
import { authAPI } from '../../utils/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const Section = ({ title, subtitle, children }) => (
  <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
    <div style={{ padding: '16px 24px', borderBottom: '1px solid #F1F5F9' }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', margin: 0 }}>{title}</h3>
      {subtitle && <p style={{ fontSize: 12, color: '#64748B', margin: '3px 0 0' }}>{subtitle}</p>}
    </div>
    <div style={{ padding: '0 24px' }}>{children}</div>
  </div>
);

const SettingRow = ({ label, description, children, danger }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '16px 0', borderBottom: '1px solid #F1F5F9' }}>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: 13, fontWeight: 500, color: danger ? '#991B1B' : '#0F172A', margin: '0 0 2px' }}>{label}</p>
      {description && <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>{description}</p>}
    </div>
    <div style={{ flexShrink: 0 }}>{children}</div>
  </div>
);

const Toggle = ({ value, onChange }) => {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer',
        background: value ? '#166534' : '#E2E8F0',
        position: 'relative', transition: 'background 0.2s',
      }}
    >
      <span style={{
        position: 'absolute', top: 3,
        left: value ? 23 : 3,
        width: 18, height: 18,
        borderRadius: '50%', background: 'white',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
};

export default function SettingsPage({ user }) {
  const { logout } = useAuth();

  // Account settings state
  const [pwdOpen,    setPwdOpen]    = useState(false);
  const [pwdForm,    setPwdForm]    = useState({ current: '', newPwd: '', confirm: '' });
  const [pwdSaving,  setPwdSaving]  = useState(false);
  const [pwdError,   setPwdError]   = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  // Notification preferences
  const [notifs, setNotifs] = useState({
    newStudent:   true,
    sessionAlert: true,
    activityAlert:true,
    weeklyReport: false,
  });

  // System preferences
  const [prefs, setPrefs] = useState({
    autoVerify:     false,
    requireApproval:true,
    allowSelfRegist:false,
  });

  // Danger zone
  const [dangerOpen, setDangerOpen] = useState(false);
  const [dangerConfirm, setDangerConfirm] = useState('');

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
      setPwdError('Password must be at least 6 characters.');
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

  const handleSaveNotifs = () => {
    // In production: call a PATCH /api/settings/notifications endpoint
    alert('Notification preferences saved! (Demo — not persisted to server)');
  };

  const handleSavePrefs = () => {
    alert('System preferences saved! (Demo — not persisted to server)');
  };

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800 }}>

      {/* ── Profile section ── */}
      <Section title="Admin Profile" subtitle="Your account information">
        <SettingRow label="Full Name" description="Your display name across the system">
          <span style={{ fontSize: 13, color: '#0F172A', fontWeight: 500 }}>{user?.name || '—'}</span>
        </SettingRow>
        <SettingRow label="Email Address" description="Used for login and notifications">
          <span style={{ fontSize: 13, color: '#0F172A', fontWeight: 500 }}>{user?.email || '—'}</span>
        </SettingRow>
        <SettingRow label="Role" description="Your access level">
          <Badge variant="success">Admin</Badge>
        </SettingRow>
        <SettingRow label="Password" description="Change your login password">
          <Button variant="secondary" size="sm"
            onClick={() => { setPwdOpen(true); setPwdError(''); setPwdSuccess(''); }}
            icon={<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}>
            Change Password
          </Button>
        </SettingRow>
        <div style={{ height: 1 }} />
      </Section>

      {/* ── Notifications ── */}
      <Section title="Notifications" subtitle="Control which alerts you receive">
        {[
          { key: 'newStudent',    label: 'New Student Enrolled',    desc: 'Alert when a new student is added to the system' },
          { key: 'sessionAlert',  label: 'Session Reminders',        desc: 'Notify before scheduled sessions' },
          { key: 'activityAlert', label: 'Activity Verification',    desc: 'Alert when activities are pending verification' },
          { key: 'weeklyReport',  label: 'Weekly Summary Report',    desc: 'Receive a weekly email digest of all activity' },
        ].map(({ key, label, desc }) => (
          <SettingRow key={key} label={label} description={desc}>
            <Toggle value={notifs[key]} onChange={v => setNotifs({ ...notifs, [key]: v })} />
          </SettingRow>
        ))}
        <div style={{ padding: '16px 0' }}>
          <Button size="sm" onClick={handleSaveNotifs}>Save Preferences</Button>
        </div>
      </Section>

      {/* ── System preferences ── */}
      <Section title="System Preferences" subtitle="Configure how EduTrack behaves">
        {[
          { key: 'autoVerify',      label: 'Auto-verify Activities',     desc: 'Automatically mark all logged activities as verified' },
          { key: 'requireApproval', label: 'Require Session Approval',   desc: 'Admin must approve sessions before they are confirmed' },
          { key: 'allowSelfRegist', label: 'Allow Self-Registration',    desc: 'Allow students to register without an admin account' },
        ].map(({ key, label, desc }) => (
          <SettingRow key={key} label={label} description={desc}>
            <Toggle value={prefs[key]} onChange={v => setPrefs({ ...prefs, [key]: v })} />
          </SettingRow>
        ))}
        <div style={{ padding: '16px 0' }}>
          <Button size="sm" onClick={handleSavePrefs}>Save Preferences</Button>
        </div>
      </Section>

      {/* ── Point system ── */}
      <Section title="Green Points System" subtitle="Configure the eco level thresholds">
        <div style={{ padding: '16px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: '🌱 Seedling threshold', value: '0 pts',   hint: 'Starting level' },
              { label: '🌿 Sapling threshold',  value: '100 pts', hint: 'First upgrade'  },
              { label: '🌳 Sprout threshold',   value: '250 pts', hint: 'Mid level'       },
              { label: '🌍 Eco Hero threshold', value: '400 pts', hint: 'Top level'       },
            ].map(({ label, value, hint }) => (
              <div key={label} style={{ background: '#F8FAFC', borderRadius: 10, padding: 14, border: '1px solid #E2E8F0' }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', margin: '0 0 2px' }}>{label}</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#166534', margin: '0 0 2px' }}>{value}</p>
                <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>{hint}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#94A3B8', margin: '12px 0 0' }}>
            To change thresholds, update the ECO_LEVELS array in the source code (StudentDashboard.jsx and ProfilePage.jsx).
          </p>
        </div>
      </Section>

      {/* ── About ── */}
      <Section title="About EduTrack" subtitle="System information">
        {[
          { label: 'Version',      value: 'v1.0.0'      },
          { label: 'Stack',        value: 'MERN (MongoDB, Express, React, Node.js)' },
          { label: 'API Base URL', value: 'http://localhost:5000/api' },
          { label: 'Environment',  value: 'Development' },
        ].map(({ label, value }) => (
          <SettingRow key={label} label={label}>
            <span style={{ fontSize: 13, color: '#64748B', fontFamily: 'monospace' }}>{value}</span>
          </SettingRow>
        ))}
        <div style={{ height: 1 }} />
      </Section>

      {/* ── Danger zone ── */}
      <div style={{ background: '#FFFFFF', border: '1px solid #FECACA', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #FEE2E2', background: '#FFF5F5' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#991B1B', margin: 0 }}>Danger Zone</h3>
          <p style={{ fontSize: 12, color: '#EF4444', margin: '3px 0 0' }}>These actions are irreversible. Proceed with caution.</p>
        </div>
        <div style={{ padding: '0 24px' }}>
          <SettingRow
            label="Sign Out of All Devices"
            description="Invalidates all active sessions. You will be logged out."
            danger
          >
            <Button variant="danger" size="sm" onClick={logout}>Sign Out</Button>
          </SettingRow>
          <SettingRow
            label="Reset System Data"
            description="Clears all students, sessions, and activities. User accounts are kept."
            danger
          >
            <Button variant="danger" size="sm" onClick={() => setDangerOpen(true)}>Reset Data</Button>
          </SettingRow>
          <div style={{ height: 1 }} />
        </div>
      </div>

      {/* ── Change Password Modal ── */}
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
          <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>Minimum 6 characters.</p>
        </div>
      </Modal>

      {/* ── Danger Zone Confirm Modal ── */}
      <Modal open={dangerOpen} onClose={() => { setDangerOpen(false); setDangerConfirm(''); }} title="Reset System Data"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setDangerOpen(false); setDangerConfirm(''); }}>Cancel</Button>
            <Button variant="danger" disabled={dangerConfirm !== 'RESET'} onClick={() => { alert('Reset triggered! (Demo — no data deleted)'); setDangerOpen(false); setDangerConfirm(''); }}>
              Confirm Reset
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ padding: 14, background: '#FEE2E2', borderRadius: 10, border: '1px solid #FECACA' }}>
            <p style={{ fontSize: 13, color: '#991B1B', fontWeight: 600, margin: '0 0 4px' }}>⚠️ This cannot be undone.</p>
            <p style={{ fontSize: 12, color: '#EF4444', margin: 0 }}>
              All student profiles, sessions, assessments, and activities will be permanently deleted.
              User accounts (admin, volunteer, student logins) will be kept.
            </p>
          </div>
          <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>
            Type <strong style={{ color: '#991B1B' }}>RESET</strong> to confirm:
          </p>
          <Input placeholder="Type RESET" value={dangerConfirm} onChange={e => setDangerConfirm(e.target.value.toUpperCase())} />
        </div>
      </Modal>
    </div>
  );
}