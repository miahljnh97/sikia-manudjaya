import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, Check, Calendar, AlertCircle, Baby } from 'lucide-react';

export default function Navbar({ user, onLogout, onToggleSidebar }) {
  const displayName = user?.nama || 'Annisa Wati';
  const roleName = user?.role ? (user.role === 'kader' ? 'Kader Posyandu' : user.role) : 'Kader Posyandu';

  // State Notifikasi dengan LocalStorage Persistence
  const [isOpenNotif, setIsOpenNotif] = useState(false);
  const [notifList, setNotifList] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('sikia_notifications');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Gagal membaca notifikasi dari localStorage:', e);
      }
    }
    return [
      {
        id: 1,
        title: 'Jadwal Posyandu Hari Ini',
        desc: 'Pelayanan Posyandu Desa Manud Jaya dimulai pukul 08:30 WIB.',
        time: '15 menit lalu',
        unread: true,
        type: 'jadwal',
      },
      {
        id: 2,
        title: '3 Bayi Terjadwal Imunisasi',
        desc: 'Ananda Budi Santoso dan 2 bayi lainnya terjadwal imunisasi hari ini.',
        time: '1 jam lalu',
        unread: true,
        type: 'imunisasi',
      },
      {
        id: 3,
        title: 'Perhatian Pasien Perlu Rujukan',
        desc: 'Ibu Siti Aminah (Ibu Hamil) memerlukan observasi rujukan lanjutan.',
        time: 'Kemarin',
        unread: false,
        type: 'alert',
      },
    ];
  });

  const dropdownRef = useRef(null);

  // Hitung jumlah notif belum dibaca
  const unreadCount = notifList.filter((n) => n.unread).length;

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpenNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setNotifList((prev) => {
      const updated = prev.map((item) => ({ ...item, unread: false }));
      if (typeof window !== 'undefined') {
        localStorage.setItem('sikia_notifications', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'jadwal':
        return <Calendar size={15} className="text-blue-600" />;
      case 'imunisasi':
        return <Baby size={15} className="text-emerald-600" />;
      default:
        return <AlertCircle size={15} className="text-amber-600" />;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
      {/* Left Menu Toggle */}
      <button 
        onClick={onToggleSidebar}
        title="Toggle Menu"
        className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
      >
        <Menu size={22} />
      </button>

      {/* Right User & Notification Controls */}
      <div className="flex items-center gap-3 sm:gap-4 relative">
        {/* Notification Bell Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpenNotif((prev) => !prev)}
            title="Notifikasi"
            className="relative p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>

          {/* Popover Dropdown Notifikasi */}
          {isOpenNotif && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
              {/* Header Dropdown */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">Notifikasi</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                      {unreadCount} Baru
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Check size={12} /> Tandai sudah dibaca
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifList.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Tidak ada notifikasi baru.
                  </div>
                ) : (
                  notifList.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                        item.unread ? 'bg-blue-50/30' : 'bg-white'
                      }`}
                      onClick={() => {
                        setNotifList((prev) =>
                          prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
                        );
                      }}
                    >
                      <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                        {getNotifIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-xs font-bold text-slate-800 truncate">{item.title}</h5>
                          {item.unread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                          {item.desc}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Dropdown */}
              <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
                <span className="text-[11px] font-medium text-slate-400">
                  Pengingat Otomatis via WhatsApp (PBI-01)
                </span>
              </div>
            </div>
          )}
        </div>

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
