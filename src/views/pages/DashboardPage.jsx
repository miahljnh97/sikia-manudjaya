import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatCards from '../components/StatCards';
import ScheduleBanner from '../components/ScheduleBanner';
import ParticipantTable from '../components/ParticipantTable';
import RegistrasiModal from '../components/RegistrasiModal';
import RegistrasiPage from '../../features/pbi-03-registrasi/RegistrasiPage';
import DataPesertaPage from '../../features/data-peserta/DataPesertaPage';
import RiwayatKunjunganPage from '../../features/riwayat-kunjungan/RiwayatKunjunganPage';
import KelolaKaderPage from '../../features/super-admin/KelolaKaderPage';
import UnderDevelopmentPage from '../../shared/components/UnderDevelopmentPage';
import IbuDashboardView from '../../features/dashboard/components/IbuDashboardView';
import Toast from '../../shared/components/Toast';
import { useDashboardController } from '../../controllers/useDashboardController';

export default function DashboardPage({ currentUser, onLogout, currentPath = '/dashboard', onNavigate }) {
  const getMenuFromPath = (path) => {
    if (!path) return 'Dashboard';
    if (path.startsWith('/registrasi-kunjungan')) return 'Registrasi Kunjungan';
    if (path.startsWith('/data-peserta')) return 'Data Peserta';
    if (path.startsWith('/riwayat-kunjungan')) return 'Riwayat Kunjungan';
    if (path.startsWith('/kelola-kader')) return 'Kelola Kader';
    if (path.startsWith('/laporan')) return 'Laporan';
    return 'Dashboard';
  };

  const menuToPath = {
    'Dashboard': '/dashboard',
    'Registrasi Kunjungan': '/registrasi-kunjungan',
    'Data Peserta': '/data-peserta',
    'Riwayat Kunjungan': '/riwayat-kunjungan',
    'Kelola Kader': '/kelola-kader',
    'Laporan': '/laporan',
  };

  const [activeMenu, setActiveMenu] = useState(() => getMenuFromPath(currentPath));

  // Sinkronkan saat URL browser berubah (misal tombol Back/Forward)
  useEffect(() => {
    const matched = getMenuFromPath(currentPath);
    if (matched && matched !== activeMenu) {
      setActiveMenu(matched);
    }
  }, [currentPath]);

  const handleMenuChange = (menu) => {
    setActiveMenu(menu);
    setSelectedPesertaIdForDetail(null);
    if (onNavigate && menuToPath[menu]) {
      onNavigate(menuToPath[menu]);
    }
  };

  const [selectedPesertaIdForDetail, setSelectedPesertaIdForDetail] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const isIbuRole = currentUser?.role === 'Ibu Balita' || currentUser?.role === 'ibu';

  // Di desktop default terbuka, di HP default tertutup
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  });

  // Listener resize layar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleUpdateStatusWithToast = async (id, nextStatus) => {
    await handleUpdateStatus(id, nextStatus);
    setToast({
      show: true,
      message: `Status kehadiran berhasil diubah menjadi "${nextStatus}"`,
      type: 'success'
    });
  };

  const handleRegistrasiSuccess = (suksesMsg) => {
    handleMenuChange('Dashboard');
    setToast({
      show: true,
      message: suksesMsg || 'Registrasi kunjungan berhasil disimpan!',
      type: 'success'
    });
  };

  const handleLihatDetailDariDashboard = (peserta) => {
    setSelectedPesertaIdForDetail(peserta.id);
    if (onNavigate) {
      onNavigate(`/data-peserta/detail/${peserta.id}`);
    }
    setActiveMenu('Data Peserta');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-800 relative overflow-x-hidden">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar 
        activeMenu={activeMenu} 
        onMenuClick={(menu) => {
          handleMenuChange(menu);
        }} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentUser={currentUser}
      />

      {/* 2. Main Workspace Content */}
      <div className="flex-1 flex flex-col min-w-0 w-full transition-all duration-300">
        <Navbar 
          user={currentUser} 
          onLogout={onLogout} 
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {activeMenu === 'Data Peserta' ? (
            <DataPesertaPage
              currentUser={currentUser}
              initialSelectedId={selectedPesertaIdForDetail}
              currentPath={currentPath}
              onNavigate={onNavigate}
              onBackToDashboard={() => {
                setSelectedPesertaIdForDetail(null);
                handleMenuChange('Dashboard');
              }}
              onTambahPesertaBaru={() => setIsModalOpen(true)}
              onShowToast={(msg, type) => setToast({ show: true, message: msg, type: type || 'success' })}
            />
          ) : activeMenu === 'Riwayat Kunjungan' ? (
            <RiwayatKunjunganPage currentUser={currentUser} />
          ) : activeMenu === 'Kelola Kader' ? (
            <KelolaKaderPage 
              currentUser={currentUser}
              onShowToast={(msg, type) => setToast({ show: true, message: msg, type: type || 'success' })}
            />
          ) : isIbuRole ? (
            <IbuDashboardView 
              user={currentUser} 
              onShowToast={(msg, type) => setToast({ show: true, message: msg, type: type || 'success' })}
            />
          ) : activeMenu === 'Registrasi Kunjungan' ? (
            <RegistrasiPage 
              currentUser={currentUser} 
              currentPath={currentPath}
              onNavigate={onNavigate}
              onBackToDashboard={handleRegistrasiSuccess} 
              onTambahPesertaBaru={() => setIsModalOpen(true)}
              onShowToast={(msg, type) => setToast({ show: true, message: msg, type: type || 'success' })}
            />
          ) : activeMenu !== 'Dashboard' ? (
            <UnderDevelopmentPage
              featureName={activeMenu}
              onBackToDashboard={() => handleMenuChange('Dashboard')}
            />
          ) : (
            <>
              {/* Top Greeting */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Selamat pagi, {currentUser?.nama || 'Annisa Wati'} <span>👋</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Berikut ringkasan kegiatan Posyandu hari ini.
                </p>
              </div>

              {/* 6 Metrik Kartu Ringkasan */}
              <StatCards stats={stats} />

              {/* Banner Jadwal Hari Ini & CTA Registrasi */}
              <ScheduleBanner onRegistrasiClick={() => handleMenuChange('Registrasi Kunjungan')} />

              {/* Tabel Peserta Hari Ini */}
              <ParticipantTable
                pesertaList={pesertaList}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterType={filterType}
                setFilterType={setFilterType}
                onUpdateStatus={handleUpdateStatusWithToast}
                onLihatDetail={handleLihatDetailDariDashboard}
                onShowToast={(msg, type) => setToast({ show: true, message: msg, type: type || 'success' })}
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
        onShowToast={(msg, type) => setToast({ show: true, message: msg, type: type || 'success' })}
      />

      {/* Modern Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
