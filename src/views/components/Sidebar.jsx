import React from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  History, 
  FileText, 
  Settings 
} from 'lucide-react';

export default function Sidebar({ activeMenu = 'Dashboard', onMenuClick }) {
  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Registrasi Kunjungan', label: 'Registrasi Kunjungan', icon: UserPlus },
    { id: 'Data Peserta', label: 'Data Peserta', icon: Users },
    { id: 'Riwayat Kunjungan', label: 'Riwayat Kunjungan', icon: History },
    { id: 'Laporan', label: 'Laporan', icon: FileText },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-100 flex flex-col justify-between shrink-0">
      <div>
        {/* Brand Logo & Header */}
        <div className="p-6">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Posyandu</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Desa Manud Jaya</p>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onMenuClick && onMenuClick(item.id)}
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
      <div className="p-4 border-t border-slate-100">
        <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <Settings size={18} className="text-slate-400" />
          <span>Pengaturan</span>
        </button>
      </div>
    </aside>
  );
}
