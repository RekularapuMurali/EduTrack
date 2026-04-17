import React, { useState } from 'react';

// ─── 1. STAT CARD ─────────────────────────────────────────
export function StatCard({ title, value, subtitle, icon, trend, color = '#285A48', bg = '#408A71' }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 20,
        boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>{title}</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#091413', lineHeight: 1 }}>{value}</p>
          {subtitle && <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>{subtitle}</p>}
          {trend !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: trend >= 0 ? '#22C55E' : '#EF4444' }}>
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
              <span style={{ fontSize: 11, color: '#94A3B8' }}>vs last month</span>
            </div>
          )}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, color,
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ─── 2. BADGE ─────────────────────────────────────────────
export function Badge({ children, variant = 'default' }) {
  const styles = {
    default:   { background: '#F1F5F9', color: '#64748B' },
    success:   { background: '#408A71', color: '#B0E4CC' },
    active:    { background: '#408A71', color: '#B0E4CC' },
    inactive:  { background: '#F1F5F9', color: '#64748B' },
    warning:   { background: '#FEF3C7', color: '#92400E' },
    error:     { background: '#FEE2E2', color: '#991B1B' },
    info:      { background: '#E8F4F8', color: '#285A48' },
    scheduled: { background: '#E8F4F8', color: '#285A48' },
    completed: { background: '#408A71', color: '#B0E4CC' },
    cancelled: { background: '#FEE2E2', color: '#991B1B' },
  };
  const s = styles[variant] || styles.default;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 10px', borderRadius: 999,
      fontSize: 11, fontWeight: 500, ...s,
    }}>
      {children}
    </span>
  );
}

// ─── 3. AVATAR ────────────────────────────────────────────
export function Avatar({ name, size = 'md', color = '#285A48' }) {
  const initials = (name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const sizes = {
    sm: { width: 28, height: 28, fontSize: 11 },
    md: { width: 36, height: 36, fontSize: 13 },
    lg: { width: 48, height: 48, fontSize: 16 },
  };
  const s = sizes[size] || sizes.md;
  return (
    <div style={{
      ...s, borderRadius: '50%', background: color, color: 'white',
      fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

// ─── 4. BUTTON ────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = 'md', onClick, icon, disabled = false, type = 'button' }) {
  const [hovered, setHovered] = useState(false);
  const variants = {
    primary:   { background: '#285A48', color: '#FFFFFF', border: 'none' },
    secondary: { background: '#F1F5F9', color: '#091413', border: '1px solid #E2E8F0' },
    outline:   { background: 'transparent', color: '#285A48', border: '1px solid #285A48' },
    danger:    { background: '#FEE2E2', color: '#991B1B', border: 'none' },
    ghost:     { background: 'transparent', color: '#64748B', border: 'none' },
  };
  const sizes = {
    sm: { padding: '5px 12px', fontSize: 12 },
    md: { padding: '7px 16px', fontSize: 13 },
    lg: { padding: '10px 20px', fontSize: 14 },
  };
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 8, fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer', transition: 'opacity 0.15s',
        opacity: disabled ? 0.5 : hovered ? 0.85 : 1, ...v, ...s,
      }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </button>
  );
}

// ─── 5. CARD ──────────────────────────────────────────────
export function Card({ children, title, subtitle, action, padding = '20px' }) {
  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
    }}>
      {(title || action) && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderBottom: '1px solid #F1F5F9',
        }}>
          <div>
            {title && <h3 style={{ fontSize: 13, fontWeight: 600, color: '#091413', margin: 0 }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: 11, color: '#64748B', margin: '2px 0 0' }}>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}

// ─── 6. MODAL ─────────────────────────────────────────────
export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)',
        zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
    >
      <div style={{
        background: '#FFFFFF', borderRadius: 18, width: '100%', maxWidth: 520,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)', overflow: 'hidden',
        animation: 'modalIn 0.2s ease',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: '1px solid #E2E8F0',
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#091413', margin: 0 }}>{title}</h2>
          <ModalCloseBtn onClick={onClose} />
        </div>
        <div style={{ padding: '20px 24px' }}>{children}</div>
        {footer && (
          <div style={{ padding: '14px 24px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            {footer}
          </div>
        )}
      </div>
      <style>{`@keyframes modalIn { from { opacity:0; transform:scale(.96) translateY(8px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}

function ModalCloseBtn({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        width: 30, height: 30, borderRadius: 6, border: 'none', cursor: 'pointer',
        background: hovered ? '#F1F5F9' : 'transparent', color: hovered ? '#0F172A' : '#94A3B8',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
      }}>
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  );
}

// ─── 7. INPUT ─────────────────────────────────────────────
export function Input({ label, type = 'text', value, onChange, placeholder, required, disabled, autoComplete }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>
          {label}{required && <span style={{ color: '#EF4444', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        required={required} disabled={disabled} autoComplete={autoComplete}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          fontSize: 13, padding: '8px 12px', borderRadius: 8, width: '100%',
          border: `1px solid ${focused ? '#285A48' : '#E2E8F0'}`,
          background: '#F8FAFC', color: '#091413', outline: 'none',
          transition: 'border 0.15s', opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
    </div>
  );
}

// ─── 8. SELECT ────────────────────────────────────────────
export function Select({ label, value, onChange, options = [], required, disabled }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>
          {label}{required && <span style={{ color: '#EF4444', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <select value={value} onChange={onChange} required={required} disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          fontSize: 13, padding: '8px 12px', borderRadius: 8, width: '100%',
          border: `1px solid ${focused ? '#285A48' : '#E2E8F0'}`,
          background: '#F8FAFC', color: '#091413', outline: 'none',
          cursor: 'pointer', appearance: 'none', transition: 'border 0.15s',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// ─── 9. TEXTAREA ──────────────────────────────────────────
export function Textarea({ label, value, onChange, placeholder, rows = 3, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>
          {label}{required && <span style={{ color: '#EF4444', marginLeft: 2 }}>*</span>}
        </label>
      )}
      <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} required={required}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          fontSize: 13, padding: '8px 12px', borderRadius: 8, width: '100%',
          border: `1px solid ${focused ? '#285A48' : '#E2E8F0'}`,
          background: '#F8FAFC', color: '#091413', outline: 'none',
          resize: 'vertical', fontFamily: 'inherit', transition: 'border 0.15s',
        }}
      />
    </div>
  );
}

// ─── 10. PROGRESS BAR ─────────────────────────────────────
export function ProgressBar({ value, max = 100, height = 6, color = '#285A48', showLabel = false }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: '#64748B' }}>Progress</span>
          <span style={{ fontSize: 11, fontWeight: 500, color: '#0F172A' }}>{pct}%</span>
        </div>
      )}
      <div style={{ background: '#F1F5F9', borderRadius: 999, overflow: 'hidden', height }}>
        <div style={{ width: `${pct}%`, height, background: color, borderRadius: 999, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
}

// ─── 11. EMPTY STATE ──────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: '#94A3B8' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#091413', marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: 13, color: '#64748B', maxWidth: 280, marginBottom: 20, lineHeight: 1.6 }}>{description}</p>
      {action}
    </div>
  );
}

// ─── 12. FILTER PILLS ─────────────────────────────────────
export function FilterPills({ options, active, onChange, counts = {} }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map(opt => {
        const isActive = active === opt;
        return (
          <button key={opt} onClick={() => onChange(opt)}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize',
              background: isActive ? '#408A71' : '#FFFFFF',
              color:      isActive ? '#B0E4CC' : '#64748B',
              border:     isActive ? '1px solid #B0E4CC' : '1px solid #E2E8F0',
            }}
          >
            {opt}{counts[opt] !== undefined ? ` (${counts[opt]})` : ''}
          </button>
        );
      })}
    </div>
  );
}

// ─── 13. TABLE ────────────────────────────────────────────
export function Table({ headers, rows, renderRow, emptyMessage = 'No data found.' }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            {headers.map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#64748B', whiteSpace: 'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={headers.length} style={{ textAlign: 'center', padding: '32px 16px', fontSize: 13, color: '#94A3B8' }}>{emptyMessage}</td></tr>
          ) : (
            rows.map((row, i) => <TableRow key={row._id || i} cells={renderRow(row, i)} />)
          )}
        </tbody>
      </table>
    </div>
  );
}

function TableRow({ cells }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderBottom: '1px solid #F1F5F9', background: hovered ? '#F0F8F5' : 'transparent', transition: 'background 0.1s' }}>
      {cells.map((cell, ci) => (
        <td key={ci} style={{ padding: '12px 16px', fontSize: 13, color: '#091413', verticalAlign: 'middle' }}>{cell}</td>
      ))}
    </tr>
  );
}

// ─── 14. SECTION HEADER ───────────────────────────────────
export function SectionHeader({ children }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94A3B8', marginBottom: 12 }}>
      {children}
    </p>
  );
}

// ─── 15. SPINNER ──────────────────────────────────────────
export function Spinner({ size = 20, color = '#285A48' }) {
  return (
    <>
      <div style={{ width: size, height: size, border: '2px solid #E2E8F0', borderTop: `2px solid ${color}`, borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}