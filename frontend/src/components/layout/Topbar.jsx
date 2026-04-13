import React, { useState, useEffect, useRef } from 'react';

const NOTIFICATIONS = [
  { id: 1, text: 'New session scheduled with Arjun Sharma', time: '5m ago',  unread: true  },
  { id: 2, text: 'Activity verified: Tree Plantation Drive',  time: '1h ago',  unread: true  },
  { id: 3, text: 'Assessment submitted by Meera Patel',       time: '3h ago',  unread: false },
];

export default function Topbar({ title, subtitle, actions }) {
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const notifRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  return (
    <div style={{
      height: 60, background: '#FFFFFF', borderBottom: '1px solid #E2E8F0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', flexShrink: 0, position: 'relative', zIndex: 5,
    }}>

      <div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#091413', lineHeight: 1.2 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: '#64748B' }}>{subtitle}</div>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {actions}

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <input type="text" placeholder="Search..."
            onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
            style={{
              fontSize: 13, padding: '7px 14px 7px 34px', borderRadius: 8, outline: 'none',
              border: `1px solid ${searchFocused ? '#285A48' : '#E2E8F0'}`,
              background: '#F8FAFC', color: '#091413',
              width: searchFocused ? 240 : 200, transition: 'all 0.2s',
            }}
          />
          <svg width="15" height="15" fill="none" stroke="#94A3B8" viewBox="0 0 24 24" strokeWidth="2"
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Notification bell */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button onClick={() => setNotifOpen(o => !o)}
            style={{ width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: 'transparent', color: '#64748B', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unreadCount > 0 && <span style={{ position: 'absolute', top: 7, right: 7, width: 8, height: 8, background: '#EF4444', borderRadius: '50%', border: '2px solid #FFFFFF' }} />}
          </button>

          {notifOpen && (
            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 300, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 50, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#091413' }}>Notifications</span>
                {unreadCount > 0 && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: '#408A71', color: '#B0E4CC' }}>{unreadCount} new</span>}
              </div>
              {NOTIFICATIONS.map((n, i) => (
                <div key={n.id}
                  style={{ padding: '12px 16px', display: 'flex', gap: 10, borderBottom: i < NOTIFICATIONS.length - 1 ? '1px solid #F1F5F9' : 'none', background: n.unread ? '#F0F8F5' : 'transparent', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F0F8F5'}
                  onMouseLeave={e => e.currentTarget.style.background = n.unread ? '#F0F8F5' : 'transparent'}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: n.unread ? '#B0E4CC' : 'transparent', flexShrink: 0, marginTop: 4 }} />
                  <div>
                    <p style={{ fontSize: 12, color: '#091413', margin: 0, lineHeight: 1.4 }}>{n.text}</p>
                    <p style={{ fontSize: 11, color: '#94A3B8', margin: '3px 0 0' }}>{n.time}</p>
                  </div>
                </div>
              ))}
              <div style={{ padding: '10px 16px', borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
                <button style={{ fontSize: 12, color: '#285A48', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}