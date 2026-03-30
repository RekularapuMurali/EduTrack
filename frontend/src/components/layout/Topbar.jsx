import React, { useState } from 'react';

export default function Topbar({ title, subtitle, actions }) {
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, text: 'New session scheduled with Arjun Sharma', time: '5m ago', unread: true },
    { id: 2, text: 'Activity verified: Tree Plantation Drive', time: '1h ago', unread: true },
    { id: 3, text: 'Assessment submitted by Meera Patel', time: '3h ago', unread: false },
  ];

  return (
    <div className="h-16 flex items-center justify-between px-6" style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
      <div>
        <h1 className="text-lg font-semibold" style={{ color: '#0F172A', lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p className="text-xs" style={{ color: '#64748B' }}>{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {actions}

        {/* Search */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="text-sm pl-9 pr-4 py-2 rounded-lg outline-none transition-all"
            style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A', width: 200 }}
            onFocus={e => { e.target.style.borderColor = '#166534'; e.target.style.width = '240px'; }}
            onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.width = '200px'; }}
          />
          <svg className="absolute left-2.5 top-2.5 w-4 h-4" style={{ color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg transition-colors"
            style={{ color: '#64748B' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#EF4444' }}></span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl shadow-lg z-50 overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid #E2E8F0' }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: '#0F172A' }}>Notifications</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#DCFCE7', color: '#166534' }}>2 new</span>
                </div>
              </div>
              {notifications.map(n => (
                <div key={n.id} className="px-4 py-3 flex gap-3 transition-colors cursor-pointer" style={{ borderBottom: '1px solid #F1F5F9', background: n.unread ? '#F8FFF9' : 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = n.unread ? '#F8FFF9' : 'transparent'}>
                  {n.unread && <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#22C55E' }}></span>}
                  {!n.unread && <span className="w-2 h-2 mt-1.5 flex-shrink-0"></span>}
                  <div>
                    <p className="text-sm" style={{ color: '#0F172A' }}>{n.text}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}