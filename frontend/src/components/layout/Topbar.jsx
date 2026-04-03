import React, { useState } from 'react';

export default function Topbar({ title, subtitle, actions }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const notifications = [
    { id: 1, text: 'New session scheduled with Arjun Sharma', time: '5m ago', unread: true },
    { id: 2, text: 'Activity verified: Tree Plantation Drive', time: '1h ago', unread: true },
    { id: 3, text: 'Assessment submitted by Meera Patel', time: '3h ago', unread: false },
  ];

  return (
    <div className="h-[60px] bg-white border-b flex items-center justify-between px-6 relative z-10">

      {/* Title */}
      <div>
        <div className="text-sm font-semibold text-gray-900">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-500">{subtitle}</div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {actions}

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`text-sm pl-8 pr-3 py-1.5 rounded border bg-gray-50 outline-none transition-all
              ${searchFocused ? 'border-green-700 w-60' : 'border-gray-200 w-48'}`}
          />
          <svg
            width="15" height="15"
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Notifications */}
        <div className="relative">
          <NotifButton onClick={() => setNotifOpen(o => !o)} />

          {notifOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-72 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <span className="text-sm font-semibold text-gray-900">
                  Notifications
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                  2 new
                </span>
              </div>

              {/* Items */}
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`flex gap-2 px-4 py-3 border-b cursor-pointer
                    ${n.unread ? 'bg-green-50' : ''}`}
                >
                  <span className={`w-2 h-2 mt-1 rounded-full
                    ${n.unread ? 'bg-green-500' : 'bg-transparent'}`} />

                  <div>
                    <p className="text-xs text-gray-900">{n.text}</p>
                    <p className="text-[11px] text-gray-400">{n.time}</p>
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

// Notification button
function NotifButton({ onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`w-9 h-9 flex items-center justify-center rounded-md relative
        ${hovered ? 'bg-gray-100' : ''}`}
    >
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>

      {/* Red dot */}
      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
    </button>
  );
}