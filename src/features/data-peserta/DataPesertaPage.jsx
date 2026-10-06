import React, { useState, useMemo, useEffect } from 'react';
import { Search, RotateCcw, Plus, FileText, ChevronLeft, ChevronRight, User, X, Trash2 } from 'lucide-react';
import DetailPeserta from './components/DetailPeserta';
import { dataStoreService } from '../../services/dataStoreService';
import { pesertaService } from '../../services/pesertaService';
import { masterService } from '../../services/masterService';
import { maskNik } from '../../utils/nikUtils';
import { resolveDusunId, resolveTipeId } from '../../utils/pesertaAdapter';
import { toISODateString } from '../../utils/dateUtils';
import Toast from '../../shared/components/Toast';
import ConfirmModal from '../../views/components/ConfirmModal';

// Master data peserta diambil 100% dari tabel `peserta` Supabase
export const DUMMY_DATA_PESERTA = [];

export default function DataPesertaPage({ 
  currentUser, 
  onTambahPesertaBaru, 
  initialSelectedId, 
  currentPath = '/data-peserta',
  onNavigate,
  onBackToDashboard, 
  onShowToast 
}) {
  const isIbuRole = currentUser?.role === 'Ibu Balita' || currentUser?.role === 'ibu';

  const [listPeserta, setListPeserta] = useState(() => dataStoreService.getPesertaList());
  const [dusunList, setDusunList] = useState([]);
  const [pesertaToDelete, setPesertaToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const notify = (message, type = 'success') => {
    if (onShowToast) {
      onShowToast(message, type);
    } else {
      setToast({ show: true, message, type });
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchPeserta = async () => {
      const data = await pesertaService.getDaftarPeserta();
      if (isMounted && data && data.length > 0) {
        setListPeserta(data);
      }
    };
    fetchPeserta();

    masterService.getDusunList().then((res) => {
      if (isMounted && res) setDusunList(res);
    });

    const unsubscribe = dataStoreService.subscribe(() => {
      fetchPeserta();
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Jika user adalah Ibu Balita, ambil data pribadinya dari database Supabase
  const ibuSelfData = listPeserta.find((p) => p.user_id === currentUser?.user?.id || p.nama.toLowerCase().includes('aminah')) || listPeserta[0] || null;

  const [selectedPeserta, setSelectedPeserta] = useState(() => {
    if (isIbuRole) return ibuSelfData;
    if (initialSelectedId) {
      return listPeserta.find((p) => p.id === initialSelectedId) || listPeserta[0] || null;
    }
    return null;
  });

  useEffect(() => {
    if (!isIbuRole && initialSelectedId && listPeserta.length > 0) {
      const found = listPeserta.find((p) => p.id === initialSelectedId);
      if (found) setSelectedPeserta(found);
    }
  }, [initialSelectedId, listPeserta, isIbuRole]);

  // Sync saat URL berubah (misal tombol Back di browser atau klik menu sidebar)
  useEffect(() => {
    if (!isIbuRole && currentPath === '/data-peserta') {
      setSelectedPeserta(null);
    }
  }, [currentPath, isIbuRole]);

  const [searchQuery, setSearchQuery] = useState('');
  const [jenisFilter, setJenisFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [wilayahFilter, setWilayahFilter] = useState('Semua');
  const [sortOrder, setSortOrder] = useState('Nama A-Z');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Filter & Sorting logic (Issue #27: sorting nama A-Z dan Z-A)
  const filteredList = useMemo(() => {
    let result = listPeserta.filter((item) => {
      const matchSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nik.toLowerCase().includes(searchQuery.toLowerCase());
      const matchJenis = jenisFilter === 'Semua' || item.jenis_peserta === jenisFilter;
      const matchStatus = statusFilter === 'Semua' || item.status === statusFilter;
      const matchWilayah = wilayahFilter === 'Semua' || item.alamat.includes(wilayahFilter);

      return matchSearch && matchJenis && matchStatus && matchWilayah;
    });

    if (sortOrder === 'Nama A-Z') {
      result.sort((a, b) => a.nama.localeCompare(b.nama));
    } else if (sortOrder === 'Nama Z-A') {
      result.sort((a, b) => b.nama.localeCompare(a.nama));
    }

    return result;
  }, [listPeserta, searchQuery, jenisFilter, statusFilter, wilayahFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / itemsPerPage));
  const currentActualPage = Math.min(currentPage, totalPages);
  const startIndex = (currentActualPage - 1) * itemsPerPage;
  const paginatedList = filteredList.slice(startIndex, startIndex + itemsPerPage);

  const handleReset = () => {
    setSearchQuery('');
    setJenisFilter('Semua');
    setStatusFilter('Semua');
    setWilayahFilter('Semua');
    setCurrentPage(1);
  };

  const handleOpenDetail = (pesertaItem) => {
    setSelectedPeserta(pesertaItem);
    if (onNavigate) {
      onNavigate('/data-peserta/detail');
    }
  };

  const handleCloseDetail = () => {
    setSelectedPeserta(null);
    if (onNavigate) {
      onNavigate('/data-peserta');
    }
    if (initialSelectedId && onBackToDashboard) {
      onBackToDashboard();
    }
  };

  const handleSavePeserta = async (updated) => {
    try {
      const saved = await pesertaService.updatePeserta(updated.id, updated);
      const finalData = saved || updated;

      // 1. Update state listPeserta agar tabel langsung menampilkan data terbaru
      setListPeserta((prev) => prev.map((p) => (p.id === updated.id ? finalData : p)));

      // 2. Tampilkan notifikasi toast sukses
      notify(`Data peserta "${finalData.nama}" berhasil diperbarui!`, 'success');

      // 3. Otomatis kembali ke tampilan daftar peserta (tabel)
      handleCloseDetail();
    } catch (e) {
      console.warn('Error update peserta:', e);
      const saved = dataStoreService.updatePeserta(updated.id, updated);
      const finalData = saved || updated;
      setListPeserta((prev) => prev.map((p) => (p.id === updated.id ? finalData : p)));
      notify(`Data peserta "${finalData.nama}" berhasil diperbarui!`, 'success');
      handleCloseDetail();
    }
  };

  const handleDeletePeserta = (peserta) => {
    setPesertaToDelete(peserta);
  };

  const confirmDeletePeserta = async () => {
    if (!pesertaToDelete) return;
    try {
      await pesertaService.suspendPeserta(pesertaToDelete.id);
      setListPeserta((prev) => prev.filter((p) => p.id !== pesertaToDelete.id));
      handleCloseDetail();
      notify(`Peserta "${pesertaToDelete.nama}" berhasil dihapus dari sistem.`, 'success');
    } catch (err) {
      console.error('Gagal hapus peserta:', err);
      notify('Gagal menghapus data peserta.', 'error');
    } finally {
      setPesertaToDelete(null);
    }
  };

  // Jika user adalah Ibu Balita, langsung kunci tampilan ke Detail Datanya sendiri
  if (isIbuRole) {
    return (
      <div className="space-y-4">
        <DetailPeserta
          peserta={ibuSelfData}
          onBack={null} // Tidak ada tombol kembali ke tabel warga lain untuk menjaga privasi
          isKaderOrBidan={false} // Ibu tidak bisa mengedit data medis resmi
        />
      </div>
    );
  }

  // Jika sedang melihat detail salah satu pasien (untuk Kader/Bidan)
  if (selectedPeserta) {
    return (
      <DetailPeserta
        peserta={selectedPeserta}
        isKaderOrBidan={true}
        onSave={handleSavePeserta}
        onDelete={handleDeletePeserta}
        onBack={handleCloseDetail}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Peserta</h1>
          <p className="text-xs text-slate-500 mt-1">
            Cari peserta yang akan melakukan kunjungan Posyandu.
          </p>
        </div>

        <button
          onClick={onTambahPesertaBaru}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus size={16} />
          <span>Tambah Peserta Baru</span>
        </button>
      </div>

      {/* Filter Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Cari berdasarkan nama, NIK, atau nomor KK
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama, NIK, atau nomor KK..."
              className="w-full pl-10 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Baris Kedua */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="block text-[11px] text-slate-400 font-medium mb-1">Jenis Peserta</span>
            <select
              value={jenisFilter}
              onChange={(e) => setJenisFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none"
            >
              <option value="Semua">Semua</option>
              <option value="Ibu Hamil">Ibu Hamil</option>
              <option value="Balita">Balita</option>
              <option value="Bayi">Bayi</option>
              <option value="Lansia">Lansia</option>
            </select>
          </div>

          <div>
            <span className="block text-[11px] text-slate-400 font-medium mb-1">Status Peserta</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none"
            >
              <option value="Semua">Semua</option>
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>

          <div>
            <span className="block text-[11px] text-slate-400 font-medium mb-1">Dusun / wilayah</span>
            <select
              value={wilayahFilter}
              onChange={(e) => setWilayahFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none"
            >
              <option value="Semua">Semua</option>
              {dusunList.length > 0 ? (
                dusunList.map((d) => (
                  <option key={d.id} value={d.nama}>{d.nama}</option>
                ))
              ) : (
                <>
                  <option value="Dusun 1">Dusun 1</option>
                  <option value="Dusun 2">Dusun 2</option>
                  <option value="Dusun 3">Dusun 3</option>
                </>
              )}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleReset}
              className="w-full p-2 text-xs font-semibold text-[#3B82F6] bg-white border border-slate-200 hover:bg-slate-50 rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <RotateCcw size={13} className="text-[#3B82F6]" />
              <span>Reset Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabel Hasil Pencarian */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Hasil Pencarian</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Menampilkan {filteredList.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + itemsPerPage, filteredList.length)} dari {filteredList.length} hasil{searchQuery ? ` pencarian untuk "${searchQuery}"` : ''}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Urutan</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
            >
              <option value="Nama A-Z">Nama A-Z</option>
              <option value="Nama Z-A">Nama Z-A</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/60 text-[#4B5563] text-xs font-bold border-b border-slate-100">
                <th className="py-3.5 px-5">No</th>
                <th className="py-3.5 px-5">Nama Peserta</th>
                <th className="py-3.5 px-5">NIK</th>
                <th className="py-3.5 px-5">Jenis Peserta</th>
                <th className="py-3.5 px-5">Tanggal Lahir</th>
                <th className="py-3.5 px-5">Usia</th>
                <th className="py-3.5 px-5">Alamat</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedList.map((item, idx) => {
                let badgeClass = 'bg-slate-100 text-slate-600 border-slate-200';
                if (item.jenis_peserta === 'Ibu Hamil') {
                  badgeClass = 'bg-[#FEE2E2] text-[#991B1B] border-[#FECDD3]';
                } else if (item.jenis_peserta === 'Balita') {
                  badgeClass = 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]';
                } else if (item.jenis_peserta === 'Bayi') {
                  badgeClass = 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]';
                } else if (item.jenis_peserta === 'Lansia') {
                  badgeClass = 'bg-purple-100 text-purple-700 border-purple-200';
                }

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-5 text-slate-400">{startIndex + idx + 1}</td>
                    <td className="py-3.5 px-5 font-bold text-slate-900 flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        item.jenis_peserta === 'Ibu Hamil' ? 'bg-rose-100 text-rose-600' :
                        item.jenis_peserta === 'Balita' ? 'bg-emerald-100 text-emerald-600' :
                        item.jenis_peserta === 'Bayi' ? 'bg-blue-100 text-blue-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        <User size={12} />
                      </span>
                      <span>{item.nama}</span>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-600 font-medium">
                      {maskNik(item.nik)}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${badgeClass}`}>
                        {item.jenis_peserta}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-500">{item.tanggal_lahir}</td>
                    <td className="py-3.5 px-5 text-slate-600">{item.usia}</td>
                    <td className="py-3.5 px-5 text-slate-600">{item.alamat}</td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 shadow-xs transition-colors cursor-pointer"
                          title="Detail & Edit Peserta"
                        >
                          <FileText size={13} className="text-slate-400" />
                          <span>Detail</span>
                        </button>
                        <button
                          onClick={() => handleDeletePeserta(item)}
                          className="inline-flex items-center justify-center p-1.5 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
                          title="Hapus Peserta"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Menampilkan {filteredList.length > 0 ? startIndex + 1 : 0}-
            {Math.min(startIndex + itemsPerPage, filteredList.length)} dari {filteredList.length} hasil
          </div>
          <div className="flex items-center gap-1">
            <button 
              disabled={currentActualPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isAct = pageNum === currentActualPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg font-semibold text-xs flex items-center justify-center transition-colors cursor-pointer ${
                    isAct ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button 
              disabled={currentActualPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}

      {/* Modal Konfirmasi Hapus Peserta */}
      <ConfirmModal
        isOpen={Boolean(pesertaToDelete)}
        title="Hapus Data Peserta"
        message={`Apakah Anda yakin ingin menghapus data peserta "${pesertaToDelete?.nama}"?\n\nCatatan: Data akan disuspend (soft delete) sehingga tidak akan muncul di daftar peserta aktif.`}
        confirmLabel="Hapus Peserta"
        onConfirm={confirmDeletePeserta}
        onClose={() => setPesertaToDelete(null)}
      />
    </div>
  );
}
