import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, Check, Calendar, AlertCircle, Baby, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar({ user, onLogout, onToggleSidebar }) {
  const displayName = user?.nama || 'Annisa Wati';
  const roleName = user?.role ? (user.role === 'kader' ? 'Kader Posyandu' : user.role) : 'Kader Posyandu';

  // State Notifikasi dengan LocalStorage Persistence
  const [isOpenNotif, setIsOpenNotif] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
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
  const profileRef = useRef(null);

  // Hitung jumlah notif belum dibaca
  const unreadCount = notifList.filter((n) => n.unread).length;

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpenNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsOpenProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotifIcon = (type) => {
    switch (type) {
      case 'jadwal':
        return <Calendar size={16} className="text-blue-500" />;
      case 'imunisasi':
        return <Baby size={16} className="text-emerald-500" />;
      case 'alert':
        return <AlertCircle size={16} className="text-rose-500" />;
      default:
        return <Bell size={16} className="text-slate-500" />;
    }
  };

  const handleMarkAllRead = () => {
    setNotifList((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 z-20 shrink-0">
      {/* Tombol Hamburger Menu (HP & Toggle Desktop) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
          aria-label="Toggle Sidebar Menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Header Right: Notifikasi & Profil Akun */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifikasi Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpenNotif((prev) => !prev)}
            className="w-10 h-10 rounded-full border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-50 relative transition-colors cursor-pointer"
            aria-label="Notifikasi"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Panel Notifikasi */}
          {isOpenNotif && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-800">Notifikasi</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600">
                      {unreadCount} Baru
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
                  >
                    Tandai dibaca
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {notifList.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Tidak ada notifikasi
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
            </div>
          )}
        </div>

        {/* Profile Card & Dropdown Menu (Poin 7: Tombol Keluar hanya muncul saat profil diklik) */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsOpenProfile((prev) => !prev)}
            className="flex items-center gap-2.5 sm:gap-3 pl-1 sm:pl-2 p-1.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer text-left border border-transparent hover:border-slate-100"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 font-semibold shrink-0">
              <User size={18} />
            </div>
            <div className="text-left hidden sm:block">
              <h4 className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight flex items-center gap-1">
                {displayName}
                <ChevronDown size={14} className="text-slate-400" />
              </h4>
              <p className="text-[11px] text-slate-400 font-medium">{roleName}</p>
            </div>
          </button>

          {/* Dropdown Menu Profil Pengguna */}
          {isOpenProfile && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                <p className="text-xs font-bold text-slate-800">{displayName}</p>
                <p className="text-[10px] text-slate-400">{roleName}</p>
              </div>

              <div className="px-1 py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpenProfile(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <LogOut size={15} />
                  <span>Keluar dari Akun</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
