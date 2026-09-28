import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

export default function Navbar({ user, onLogout, onToggleSidebar }) {
  const displayName = user?.nama || 'Annisa Wati';
  const roleName = user?.role ? (user.role === 'kader' ? 'Kader Posyandu' : user.role) : 'Kader Posyandu';

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
      {/* Left Menu Toggle - Aktif membuka/tutup sidebar */}
      <button 
        onClick={onToggleSidebar}
        title="Toggle Menu"
        className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
      >
        <Menu size={22} />
      </button>

      {/* Right User & Notification Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell */}
        <button 
          title="Notifikasi"
          className="relative p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile Card */}
        <div className="flex items-center gap-2.5 sm:gap-3 pl-1 sm:pl-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 font-semibold shrink-0">
            <User size={18} />
          </div>
          <div className="text-left hidden sm:block">
            <h4 className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">{displayName}</h4>
            <p className="text-[11px] text-slate-400 font-medium">{roleName}</p>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Keluar / Logout"
              className="text-xs font-medium text-slate-400 hover:text-red-500 hover:underline pl-2 border-l border-slate-200"
            >
              Keluar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
