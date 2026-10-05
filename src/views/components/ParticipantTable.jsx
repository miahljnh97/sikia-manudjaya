import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Check, 
  Clock, 
  X, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { maskNik } from '../../utils/nikUtils';

export default function ParticipantTable({
  pesertaList = [],
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  onUpdateStatus,
  onLihatDetail,
  loading
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Pagination kalkulasi (Issue #26)
  const totalPages = Math.max(1, Math.ceil(pesertaList.length / itemsPerPage));
  const currentActualPage = Math.min(currentPage, totalPages);
  const startIndex = (currentActualPage - 1) * itemsPerPage;
  const paginatedList = pesertaList.slice(startIndex, startIndex + itemsPerPage);

  // Badge jenis peserta styling sesuai spesifikasi Figma
  const renderJenisBadge = (jenis) => {
    switch (jenis) {
      case 'Ibu Hamil':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FEE2E2] text-[#991B1B] border border-[#FECDD3]">
            Ibu Hamil
          </span>
        );
      case 'Balita':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]">
            Balita
          </span>
        );
      case 'Bayi':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE]">
            Bayi
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
            {jenis}
          </span>
        );
    }
  };

  // Cycle urutan status: Menunggu -> Hadir -> Sudah dilayani -> Tidak Hadir -> Menunggu
  const getNextStatus = (curr) => {
    const s = (curr || '').toLowerCase();
    if (s.includes('dilayani') || s.includes('selesai')) return 'Tidak Hadir';
    if (s.includes('tidak')) return 'Menunggu';
    if (s.includes('hadir') && !s.includes('belum')) return 'Sudah dilayani';
    return 'Hadir';
  };

  // Badge status kehadiran styling + interaksi ubah ke 4 status
  const renderStatusBadge = (item) => {
    const s = (item.status_kehadiran || 'Menunggu').toLowerCase();

    if (s.includes('dilayani') || s.includes('selesai')) {
      return (
        <button
          onClick={() => onUpdateStatus(item.id, getNextStatus(item.status_kehadiran))}
          title="Status: Sudah dilayani (Klik untuk ubah ke status berikutnya)"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE] hover:bg-[#BFDBFE]/60 transition-colors cursor-pointer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
          <span>Sudah dilayani</span>
        </button>
      );
    }

    if (s.includes('tidak')) {
      return (
        <button
          onClick={() => onUpdateStatus(item.id, getNextStatus(item.status_kehadiran))}
          title="Status: Tidak Hadir (Klik untuk ubah ke status berikutnya)"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FEE2E2] text-[#991B1B] border border-[#FECDD3] hover:bg-[#FECDD3]/60 transition-colors cursor-pointer"
        >
          <X size={13} strokeWidth={3} className="text-[#991B1B]" />
          <span>Tidak Hadir</span>
        </button>
      );
    }

    if (s.includes('hadir') && !s.includes('belum')) {
      return (
        <button
          onClick={() => onUpdateStatus(item.id, getNextStatus(item.status_kehadiran))}
          title="Status: Hadir (Klik untuk ubah ke status berikutnya)"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0] hover:bg-[#BBF7D0]/60 transition-colors cursor-pointer"
        >
          <Check size={13} strokeWidth={3} className="text-[#166534]" />
          <div className="flex flex-col text-left leading-tight">
            <span>Sudah Hadir</span>
            <span className="text-[10px] text-[#15803D] font-normal font-mono">
              {item.waktu_hadir || '08.45'}
            </span>
          </div>
        </button>
      );
    }

    // Default: Menunggu / Belum Hadir
    return (
      <button
        onClick={() => onUpdateStatus(item.id, getNextStatus(item.status_kehadiran))}
        title="Status: Menunggu (Klik untuk ubah ke status berikutnya)"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
      >
        <Clock size={13} className="text-[#64748B]" />
        <span>Menunggu</span>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
      {/* Table Header Action Bar */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Daftar Peserta Hari Ini
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, NIK, atau nomor KK..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
            />
          </div>

          {/* Filter Dropdown (Issue #9: default text "Filter", tanpa terpilih otomatis) */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none pl-8 pr-8 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 focus:outline-none cursor-pointer"
            >
              <option value="Semua">Filter</option>
              <option value="Ibu Hamil">Ibu Hamil</option>
              <option value="Balita">Balita</option>
              <option value="Bayi">Bayi</option>
            </select>
            <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Export Button */}
          <button 
            type="button"
            onClick={() => alert('Data peserta berhasil disiapkan untuk diunduh.')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download size={13} className="text-slate-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Table (Issue #10: Header font lebih gelap & tegas) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-700">
              <th className="py-3.5 px-5 w-12">No</th>
              <th className="py-3.5 px-5">Nama Peserta</th>
              <th className="py-3.5 px-5">NIK</th>
              <th className="py-3.5 px-5">Jenis Peserta</th>
              <th className="py-3.5 px-5">Usia</th>
              <th className="py-3.5 px-5">Alamat</th>
              <th className="py-3.5 px-5">Status Kehadiran</th>
              <th className="py-3.5 px-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
            {loading ? (
              <tr>
                <td colSpan="8" className="py-10 text-center text-slate-400">
                  Memuat data peserta...
                </td>
              </tr>
            ) : paginatedList.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-10 text-center text-slate-400">
                  Tidak ada peserta yang cocok dengan pencarian.
                </td>
              </tr>
            ) : (
              paginatedList.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5 text-slate-500 font-medium">
                    {startIndex + index + 1}
                  </td>
                  <td className="py-4 px-5 font-bold text-slate-900">{item.nama}</td>
                  <td className="py-4 px-5 font-mono text-slate-600 font-medium">
                    {maskNik(item.nik)}
                  </td>
                  <td className="py-4 px-5">{renderJenisBadge(item.jenis_peserta)}</td>
                  <td className="py-4 px-5 text-slate-600">{item.usia}</td>
                  <td className="py-4 px-5 text-slate-600">{item.alamat}</td>
                  <td className="py-4 px-5">{renderStatusBadge(item)}</td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => onLihatDetail && onLihatDetail(item)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      Lihat
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer (Issue #26: pagination responsif terhadap jumlah data) */}
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Menampilkan {pesertaList.length > 0 ? startIndex + 1 : 0}-
          {Math.min(startIndex + itemsPerPage, pesertaList.length)} dari {pesertaList.length} peserta
        </div>

        <div className="flex items-center gap-1 self-center">
          <button 
            disabled={currentActualPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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
                className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                  isAct 
                    ? 'bg-[#881337] text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button 
            disabled={currentActualPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
