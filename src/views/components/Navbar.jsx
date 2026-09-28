import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  const displayName = user?.nama || 'Annisa Wati';
  const roleName = user?.role ? (user.role === 'kader' ? 'Kader Posyandu' : user.role) : 'Kader Posyandu';

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-20">
      {/* Left Menu Toggle */}
      <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
        <Menu size={20} />
      </button>

      {/* Right User & Notification Controls */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button 
          title="Notifikasi"
          className="relative p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile Card & Logout Dropdown Trigger */}
        <div className="flex items-center gap-3 pl-2">
          <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 font-semibold">
            <User size={20} />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-semibold text-slate-800 leading-tight">{displayName}</h4>
            <p className="text-xs text-slate-400 font-medium">{roleName}</p>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Keluar / Logout"
              className="ml-3 text-xs font-medium text-slate-400 hover:text-red-500 hover:underline pl-2 border-l border-slate-200"
            >
              Keluar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
