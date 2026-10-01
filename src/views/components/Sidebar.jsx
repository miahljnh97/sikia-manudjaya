import React from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  History, 
  FileText, 
  Settings,
  X,
  UserCheck
} from 'lucide-react';

export default function Sidebar({ 
  activeMenu = 'Dashboard', 
  onMenuClick, 
  isOpen = true, 
  onClose,
  currentUser
}) {
  const roleNormalized = (currentUser?.role || '').toLowerCase();
  const isSuperAdmin = roleNormalized.includes('admin') || roleNormalized === 'superadmin' || roleNormalized === 'super admin';

  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ...(isSuperAdmin ? [{ id: 'Kelola Kader', label: 'Kelola Kader', icon: UserCheck }] : []),
    { id: 'Registrasi Kunjungan', label: 'Registrasi Kunjungan', icon: UserPlus },
    { id: 'Data Peserta', label: 'Data Peserta', icon: Users },
    { id: 'Riwayat Kunjungan', label: 'Riwayat Kunjungan', icon: History },
    { id: 'Laporan', label: 'Laporan', icon: FileText },
  ];

  const handleSelect = (id) => {
    if (onMenuClick) onMenuClick(id);
    // Di layar HP tutup otomatis saat item diklik
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay (Hanya saat di HP & terbuka) */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 bg-white border-r border-slate-100 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'w-64 translate-x-0 shadow-2xl lg:shadow-none' 
            : 'w-0 -translate-x-full lg:w-0 lg:-translate-x-full overflow-hidden border-none'
        }`}
      >
        <div className="w-64">
          {/* Brand Logo & Mobile Close Button */}
          <div className="p-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Posyandu</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Desa Manud Jaya</p>
            </div>
            
            {/* Tombol Tutup (X) hanya di HP */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Settings */}
        <div className="w-64 p-4 border-t border-slate-100">
          <button 
            onClick={() => handleSelect('Pengaturan')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeMenu === 'Pengaturan' 
                ? 'bg-blue-50 text-blue-600 font-semibold' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings size={18} className={activeMenu === 'Pengaturan' ? 'text-blue-600' : 'text-slate-400'} />
            <span>Pengaturan</span>
          </button>
        </div>
      </aside>
    </>
  );
}
