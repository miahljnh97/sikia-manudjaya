import React, { useState } from 'react';
import { 
  Home, 
  PlusCircle, 
  Users, 
  ClipboardList, 
  TrendingUp, 
  Settings,
  X,
  UserCheck,
  Heart,
  Smile,
  Calendar,
  ChevronDown,
  ChevronUp
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

  // State Accordion Submenu Kesehatan Ibu & Anak
  const [isIbuExpanded, setIsIbuExpanded] = useState(true);
  const [isAnakExpanded, setIsAnakExpanded] = useState(true);

  const handleSelect = (id) => {
    if (onMenuClick) onMenuClick(id);
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  const subKesehatanIbu = [
    { id: 'Kehamilan', label: 'Kehamilan' },
    { id: 'Pemeriksaan Ibu', label: 'Pemeriksaan' },
    { id: 'Persalinan', label: 'Persalinan' },
    { id: 'Nifas & Menyusui', label: 'Nifas & Menyusui' },
  ];

  const subKesehatanAnak = [
    { id: 'Pertumbuhan', label: 'Pertumbuhan' },
    { id: 'Perkembangan', label: 'Perkembangan' },
    { id: 'Imunisasi', label: 'Imunisasi' },
    { id: 'Pemeriksaan Anak', label: 'Pemeriksaan' },
  ];

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
        <div className="w-64 flex flex-col h-full min-h-0">
          {/* Brand Logo SIKIA (Buku KIA Digital) & Mobile Close Button */}
          <div className="p-5 sm:p-6 flex items-center justify-between shrink-0 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <img 
                src={isIbuRole ? "/ibu.png" : "/logo-posyandu.png"} 
                alt="Logo SI KIA" 
                className="w-9 h-9 object-contain shrink-0" 
              />
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  SI KIA
                </h1>
                <p className="text-[10px] text-slate-400 font-medium">
                  {isIbuRole ? 'Buku KIA Digital' : 'Posyandu Digital'}
                </p>
              </div>
            </div>
            
            {/* Tombol Tutup (X) hanya di HP */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items (Scrollable jika layar pendek) */}
          <nav className="px-3 py-3 space-y-1 overflow-y-auto flex-1 text-xs">
            {/* 1. Dashboard */}
            <button
              onClick={() => handleSelect('Dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeMenu === 'Dashboard'
                  ? 'bg-[#EEF4FF] text-[#2563EB] font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Home size={18} className={activeMenu === 'Dashboard' ? 'text-[#2563EB]' : 'text-slate-400'} />
              <span>Dashboard</span>
            </button>

            {isIbuRole ? (
              <>
                {/* 2. Accordion: Kesehatan Ibu */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setIsIbuExpanded(!isIbuExpanded)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Heart size={18} className="text-slate-400" />
                      <span>Kesehatan Ibu</span>
                    </div>
                    {isIbuExpanded ? (
                      <ChevronUp size={16} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400" />
                    )}
                  </button>

                  {isIbuExpanded && (
                    <div className="pl-9 pr-1 py-1 space-y-1">
                      {subKesehatanIbu.map((sub) => {
                        const isSubActive = activeMenu === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSelect(sub.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                              isSubActive
                                ? 'bg-[#EEF4FF] text-[#2563EB] font-semibold'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3. Accordion: Kesehatan Anak */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAnakExpanded(!isAnakExpanded)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Smile size={18} className="text-slate-400" />
                      <span>Kesehatan Anak</span>
                    </div>
                    {isAnakExpanded ? (
                      <ChevronUp size={16} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400" />
                    )}
                  </button>

                  {isAnakExpanded && (
                    <div className="pl-9 pr-1 py-1 space-y-1">
                      {subKesehatanAnak.map((sub) => {
                        const isSubActive = activeMenu === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSelect(sub.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                              isSubActive
                                ? 'bg-[#EEF4FF] text-[#2563EB] font-semibold'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. Jadwal Saya */}
                <button
                  onClick={() => handleSelect('Jadwal Saya')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                    activeMenu === 'Jadwal Saya'
                      ? 'bg-[#EEF4FF] text-[#2563EB] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Calendar size={18} className={activeMenu === 'Jadwal Saya' ? 'text-[#2563EB]' : 'text-slate-400'} />
                  <span>Jadwal Saya</span>
                </button>
              </>
            ) : (
              <>
                {/* Menu Khusus Super Admin */}
                {isSuperAdmin && (
                  <button
                    onClick={() => handleSelect('Kelola Kader')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                      activeMenu === 'Kelola Kader'
                        ? 'bg-[#EEF4FF] text-[#2563EB] font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <UserCheck size={18} className={activeMenu === 'Kelola Kader' ? 'text-[#2563EB]' : 'text-slate-400'} />
                    <span>Kelola Kader</span>
                  </button>
                )}

                {/* 2. Registrasi Kunjungan */}
                <button
                  onClick={() => handleSelect('Registrasi Kunjungan')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                    activeMenu === 'Registrasi Kunjungan'
                      ? 'bg-[#EEF4FF] text-[#2563EB] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <PlusCircle size={18} className={activeMenu === 'Registrasi Kunjungan' ? 'text-[#2563EB]' : 'text-slate-400'} />
                  <span>Registrasi Kunjungan</span>
                </button>

                {/* 3. Data Peserta */}
                <button
                  onClick={() => handleSelect('Data Peserta')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                    activeMenu === 'Data Peserta'
                      ? 'bg-[#EEF4FF] text-[#2563EB] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Users size={18} className={activeMenu === 'Data Peserta' ? 'text-[#2563EB]' : 'text-slate-400'} />
                  <span>Data Peserta</span>
                </button>

                {/* 4. Riwayat Kunjungan */}
                <button
                  onClick={() => handleSelect('Riwayat Kunjungan')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                    activeMenu === 'Riwayat Kunjungan'
                      ? 'bg-[#EEF4FF] text-[#2563EB] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <ClipboardList size={18} className={activeMenu === 'Riwayat Kunjungan' ? 'text-[#2563EB]' : 'text-slate-400'} />
                  <span>Riwayat Kunjungan</span>
                </button>

                {/* 5. Laporan */}
                <button
                  onClick={() => handleSelect('Laporan')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                    activeMenu === 'Laporan'
                      ? 'bg-[#EEF4FF] text-[#2563EB] font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <TrendingUp size={18} className={activeMenu === 'Laporan' ? 'text-[#2563EB]' : 'text-slate-400'} />
                  <span>Laporan</span>
                </button>
              </>
            )}
          </nav>

          {/* Bottom Settings */}
          <div className="p-3 border-t border-slate-100 shrink-0">
            <button 
              type="button"
              onClick={() => handleSelect('Pengaturan')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeMenu === 'Pengaturan'
                  ? 'bg-[#EEF4FF] text-[#2563EB] font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Settings size={18} className={activeMenu === 'Pengaturan' ? 'text-[#2563EB]' : 'text-slate-400'} />
              <span>Pengaturan</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
