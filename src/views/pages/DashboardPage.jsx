import React, { useState } from 'react';
import { Calendar, Edit3 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatCards from '../components/StatCards';
import ScheduleBanner from '../components/ScheduleBanner';
import ParticipantTable from '../components/ParticipantTable';
import RegistrasiModal from '../components/RegistrasiModal';
import RegistrasiPage from '../../features/pbi-03-registrasi/RegistrasiPage';
import DataPesertaPage from '../../features/data-peserta/DataPesertaPage';
import UnderDevelopmentPage from '../../shared/components/UnderDevelopmentPage';
import { useDashboardController } from '../../controllers/useDashboardController';

export default function DashboardPage({ currentUser, onLogout }) {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    loading,
    pesertaList,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    stats,
    handleUpdateStatus,
    handleTambahPeserta,
    isModalOpen,
    setIsModalOpen
  } = useDashboardController();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-800 relative overflow-x-hidden">
      {/* 1. Left Sidebar Navigation dengan drawer mobile */}
      <Sidebar 
        activeMenu={activeMenu} 
        onMenuClick={setActiveMenu} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 2. Main Workspace Content */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Navbar 
          user={currentUser} 
          onLogout={onLogout} 
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {activeMenu === 'Registrasi Kunjungan' ? (
            <RegistrasiPage 
              currentUser={currentUser} 
              onBackToDashboard={() => setActiveMenu('Dashboard')} 
            />
          ) : activeMenu === 'Data Peserta' ? (
            <DataPesertaPage
              onTambahPesertaBaru={() => setIsModalOpen(true)}
            />
          ) : activeMenu !== 'Dashboard' ? (
            <UnderDevelopmentPage
              featureName={activeMenu}
              onBackToDashboard={() => setActiveMenu('Dashboard')}
            />
          ) : (
            <>
              {/* Top Greeting & Date Widget */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    Selamat pagi, {currentUser?.nama?.split(' ')[0] || 'Annisa'} <span>👋</span>
                  </h1>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Berikut ringkasan kegiatan Posyandu hari ini.
                  </p>
                </div>

                {/* Date Widget Pill */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="bg-white border border-slate-100 shadow-xs px-3.5 py-2 rounded-xl flex items-center gap-2.5">
                    <Calendar size={18} className="text-blue-500 shrink-0" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-800 leading-tight">
                        Sabtu, 27 September 2026
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        Posyandu Desa Manud Jaya
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => alert('Fitur ubah tanggal kegiatan.')}
                    className="bg-white border border-slate-200 shadow-xs px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Edit3 size={14} className="text-slate-500" />
                    <span>Ubah Tanggal</span>
                  </button>
                </div>
              </div>

              {/* 6 Metrik Kartu Ringkasan */}
              <StatCards stats={stats} />

              {/* Banner Jadwal Hari Ini & CTA Registrasi */}
              <ScheduleBanner onRegistrasiClick={() => setActiveMenu('Registrasi Kunjungan')} />

              {/* Tabel Peserta Hari Ini */}
              <ParticipantTable
                pesertaList={pesertaList}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterType={filterType}
                setFilterType={setFilterType}
                onUpdateStatus={handleUpdateStatus}
                loading={loading}
              />
            </>
          )}
        </main>
      </div>

      {/* Modal Dialog Form Tambah Peserta Baru */}
      <RegistrasiModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleTambahPeserta}
      />
    </div>
  );
}
