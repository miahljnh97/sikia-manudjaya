import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  RotateCcw, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  X,
  Printer
} from 'lucide-react';
import { dataStoreService } from '../../services/dataStoreService';
import { kunjunganService } from '../../services/kunjunganService';
import DetailKunjunganModal from './components/DetailKunjunganModal';
import { maskNik } from '../../utils/nikUtils';
import { getTodayISODate, toISODateString } from '../../utils/dateUtils';

export default function RiwayatKunjunganPage({ currentUser }) {
  const [riwayatList, setRiwayatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [periodeAwal, setPeriodeAwal] = useState('');
  const [periodeAkhir, setPeriodeAkhir] = useState('');
  const [selectedJenisPeserta, setSelectedJenisPeserta] = useState('Semua');
  const [selectedStatusPeserta, setSelectedStatusPeserta] = useState('Aktif');
  const [selectedDusun, setSelectedDusun] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKunjunganForDetail, setSelectedKunjunganForDetail] = useState(null);

  const loadRiwayat = async () => {
    setLoading(true);
    try {
      const data = await kunjunganService.getRiwayatKunjungan();
      setRiwayatList(data);
    } catch (e) {
      console.warn('Gagal memuat riwayat kunjungan:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRiwayat();
    const unsubscribe = dataStoreService.subscribe(() => {
      loadRiwayat();
    });
    return () => unsubscribe();
  }, []);

  const isIbuRole = currentUser?.role === 'Ibu Balita' || currentUser?.role === 'ibu';

  const handleResetFilter = () => {
    setSearchQuery('');
    setPeriodeAwal('');
    setPeriodeAkhir('');
    setSelectedJenisPeserta('Semua');
    setSelectedStatusPeserta('Aktif');
    setSelectedDusun('Semua');
    setCurrentPage(1);
  };

  const filteredList = useMemo(() => {
    return riwayatList.filter((item) => {
      // Role Privacy
      if (isIbuRole && item.nama !== 'Siti Aminah') {
        return false;
      }

      // Filter Pencarian (nama, NIK, No Registrasi)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchNama = item.nama.toLowerCase().includes(query);
        const matchNik = item.nik.toLowerCase().includes(query) || (item.nik_lengkap && item.nik_lengkap.toLowerCase().includes(query));
        const matchNoReg = item.no_registrasi.toLowerCase().includes(query);
        if (!matchNama && !matchNik && !matchNoReg) return false;
      }

      // Filter Periode Kunjungan (Rentang Tanggal)
      if (periodeAwal || periodeAkhir) {
        const itemIso = item.tanggal_iso || toISODateString(item.tanggal_kunjungan);
        if (periodeAwal && itemIso < periodeAwal) return false;
        if (periodeAkhir && itemIso > periodeAkhir) return false;
      }

      // Filter Jenis Peserta
      if (selectedJenisPeserta !== 'Semua' && item.jenis_peserta !== selectedJenisPeserta) {
        return false;
      }

      // Filter Status Peserta
      if (selectedStatusPeserta !== 'Semua' && item.status_peserta !== selectedStatusPeserta) {
        return false;
      }

      // Filter Dusun / Wilayah
      if (selectedDusun !== 'Semua' && item.dusun !== selectedDusun) {
        return false;
      }

      return true;
    });
  }, [riwayatList, searchQuery, periodeAwal, periodeAkhir, selectedJenisPeserta, selectedStatusPeserta, selectedDusun, isIbuRole]);

  // Pagination (7 per halaman sesuai desain)
  const itemsPerPage = 7;
  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(start, start + itemsPerPage);
  }, [filteredList, currentPage]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Riwayat Kunjungan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Cari peserta yang akan dilihat riwayat kunjungan Posyandu.
        </p>
      </div>

      {/* Filter Card Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        {/* Search Bar with clear button */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Cari berdasarkan nama, NIK, atau nomor KK
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Ketik nama atau NIK peserta..."
              className="w-full pl-9 pr-9 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          {/* Periode Kunjungan (2 Date Pickers or Inputs) */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Periode Kunjungan
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={periodeAwal}
                onChange={(e) => setPeriodeAwal(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <input
                type="date"
                value={periodeAkhir}
                onChange={(e) => setPeriodeAkhir(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Jenis Peserta */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Jenis Peserta
            </label>
            <select
              value={selectedJenisPeserta}
              onChange={(e) => {
                setSelectedJenisPeserta(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="Semua">Semua</option>
              <option value="Ibu Hamil">Ibu Hamil</option>
              <option value="Balita">Balita</option>
              <option value="Bayi">Bayi</option>
              <option value="Lansia">Lansia</option>
            </select>
          </div>

          {/* Status Peserta */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Status Peserta
            </label>
            <select
              value={selectedStatusPeserta}
              onChange={(e) => {
                setSelectedStatusPeserta(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="Semua">Semua</option>
              <option value="Aktif">Aktif</option>
              <option value="Pindah">Pindah</option>
              <option value="Non-Aktif">Non-Aktif</option>
            </select>
          </div>

          {/* Dusun / Wilayah + Reset Button */}
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Dusun / wilayah
              </label>
              <select
                value={selectedDusun}
                onChange={(e) => {
                  setSelectedDusun(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Semua">Semua</option>
                <option value="Dusun 1">Dusun 1</option>
                <option value="Dusun 2">Dusun 2</option>
                <option value="Dusun 3">Dusun 3</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleResetFilter}
              className="mt-5 px-3 py-2 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Data Kunjungan */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/70 text-slate-600 font-bold">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Tanggal Kunjungan</th>
                <th className="py-3 px-4">NIK</th>
                <th className="py-3 px-4">Jenis Peserta</th>
                <th className="py-3 px-4">Jenis Pelayanan</th>
                <th className="py-3 px-4">Hasil/Catatan</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
                    Tidak ada riwayat kunjungan yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                paginatedList.map((item, idx) => {
                  const isHamil = item.jenis_peserta === 'Ibu Hamil';
                  const isBayi = item.jenis_peserta === 'Bayi';
                  const isLansia = item.jenis_peserta === 'Lansia';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 text-center font-medium text-slate-500">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                            isHamil 
                              ? 'bg-rose-50 text-rose-500' 
                              : isBayi 
                              ? 'bg-blue-50 text-blue-500' 
                              : isLansia
                              ? 'bg-purple-50 text-purple-500'
                              : 'bg-emerald-50 text-emerald-500'
                          }`}>
                            <User size={14} />
                          </div>
                          <span className="font-bold text-slate-900">{item.nama}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                        {item.tanggal_kunjungan}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 font-medium whitespace-nowrap">
                        {maskNik(item.nik_lengkap || item.nik)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold inline-block ${
                          isHamil 
                            ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                            : isBayi 
                            ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                            : isLansia
                            ? 'bg-purple-50 text-purple-600 border border-purple-100'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                          {item.jenis_peserta}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {item.jenis_pelayanan}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {item.hasil_catatan}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {(() => {
                          const s = (item.status || item.status_kehadiran || '').toLowerCase();
                          if (s.includes('tidak')) {
                            return (
                              <span className="px-2.5 py-1 bg-[#FEE2E2] border border-[#FECDD3] text-[#991B1B] rounded-full text-[11px] font-semibold">
                                Tidak Hadir
                              </span>
                            );
                          }
                          if (s.includes('tunggu')) {
                            return (
                              <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-full text-[11px] font-semibold">
                                Menunggu
                              </span>
                            );
                          }
                          if (s.includes('dilayani') || s.includes('selesai')) {
                            return (
                              <span className="px-2.5 py-1 bg-[#DBEAFE] border border-[#BFDBFE] text-[#1D4ED8] rounded-full text-[11px] font-semibold">
                                Selesai Dilayani
                              </span>
                            );
                          }
                          return (
                            <span className="px-2.5 py-1 bg-[#DCFCE7] border border-[#BBF7D0] text-[#166534] rounded-full text-[11px] font-semibold">
                              Hadir
                            </span>
                          );
                        })()}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedKunjunganForDetail(item)}
                          className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 hover:border-slate-400 text-slate-700 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                          <FileText size={13} className="text-slate-600" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer & Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Menampilkan {filteredList.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, filteredList.length)} dari {filteredList.length} hasil
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  currentPage === page
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Detail Kunjungan */}
      <DetailKunjunganModal 
        isOpen={Boolean(selectedKunjunganForDetail)}
        kunjungan={selectedKunjunganForDetail}
        onClose={() => setSelectedKunjunganForDetail(null)}
      />
    </div>
  );
}
