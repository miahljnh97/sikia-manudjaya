import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, Plus, X, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { maskNik } from '../../../utils/nikUtils';

export default function PencarianPasien({
  searchQuery,
  setSearchQuery,
  jenisFilter,
  setJenisFilter,
  statusFilter,
  setStatusFilter,
  wilayahFilter,
  setWilayahFilter,
  onResetFilter,
  pesertaList = [],
  onSelectPeserta,
  onTambahPesertaBaru
}) {
  const [sortOrder, setSortOrder] = useState('Nama A-Z');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Sorting logic
  const sortedList = useMemo(() => {
    let list = [...pesertaList];
    if (sortOrder === 'Nama A-Z') {
      list.sort((a, b) => (a.nama || '').localeCompare(b.nama || ''));
    } else if (sortOrder === 'Nama Z-A') {
      list.sort((a, b) => (b.nama || '').localeCompare(a.nama || ''));
    }
    return list;
  }, [pesertaList, sortOrder]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedList.length / itemsPerPage));
  const currentActualPage = Math.min(currentPage, totalPages);
  const startIndex = (currentActualPage - 1) * itemsPerPage;
  const paginatedList = sortedList.slice(startIndex, startIndex + itemsPerPage);

  const handleReset = () => {
    onResetFilter();
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & CTA Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Search & Filters Card (Spans 2 columns on lg) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Cari berdasarkan nama, NIK, atau nomor KK
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, NIK, atau nomor KK..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Sub Filters Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="block text-[11px] text-slate-400 font-medium mb-1">Jenis Peserta</span>
              <select
                value={jenisFilter}
                onChange={(e) => {
                  setJenisFilter(e.target.value);
                  setCurrentPage(1);
                }}
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
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
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
                onChange={(e) => {
                  setWilayahFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none"
              >
                <option value="Semua">Semua</option>
                <option value="Dusun 1">Dusun 1</option>
                <option value="Dusun 2">Dusun 2</option>
                <option value="Dusun 3">Dusun 3</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleReset}
                className="w-full p-2 text-xs font-semibold text-[#3B82F6] bg-white border border-slate-200 hover:bg-slate-50 rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <RotateCcw size={13} className="text-[#3B82F6]" />
                <span>Reset Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right CTA Box: Tidak menemukan peserta? Sesuai Figma media_1791225071580.jpg */}
        <div className="bg-[#FFF1F2] border border-[#FDA4AF] rounded-2xl p-6 flex flex-col justify-between shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-[#FFE4E6] flex items-center justify-center shrink-0">
              <Plus size={20} className="text-[#991B1B]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#991B1B]">Tidak menemukan peserta?</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Daftarkan sebagai peserta baru terlebih dahulu di sistem.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onTambahPesertaBaru}
            className="mt-4 w-full py-2.5 px-4 bg-[#881337] hover:bg-[#70102d] active:bg-[#4c0519] text-[#FFFFFF] rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Tambah Peserta Baru</span>
          </button>
        </div>
      </div>

      {/* Tabel Hasil Pencarian */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Hasil Pencarian
            </h4>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Menampilkan {sortedList.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + itemsPerPage, sortedList.length)} dari {sortedList.length} hasil pencarian{searchQuery ? ` untuk "${searchQuery}"` : ''}
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-500">
            <span>Urutan</span>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none cursor-pointer"
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
                <th className="py-3.5 px-5 w-12">No</th>
                <th className="py-3.5 px-5">Nama Peserta</th>
                <th className="py-3.5 px-5">NIK</th>
                <th className="py-3.5 px-5">Jenis Peserta</th>
                <th className="py-3.5 px-5">Tanggal Lahir</th>
                <th className="py-3.5 px-5">Usia</th>
                <th className="py-3.5 px-5">Alamat</th>
                <th className="py-3.5 px-5">Status Kehadiran</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    Tidak ada data peserta ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedList.map((item, idx) => {
                  // Badge kategori peserta sesuai spek Figma
                  let badgeClass = 'bg-slate-100 text-slate-600 border-slate-200';
                  let iconBg = 'bg-slate-100 text-slate-600';
                  if (item.jenis_peserta === 'Ibu Hamil') {
                    badgeClass = 'bg-[#FEE2E2] text-[#991B1B] border-[#FECDD3]';
                    iconBg = 'bg-rose-100 text-rose-600';
                  } else if (item.jenis_peserta === 'Balita') {
                    badgeClass = 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]';
                    iconBg = 'bg-emerald-100 text-emerald-600';
                  } else if (item.jenis_peserta === 'Bayi') {
                    badgeClass = 'bg-[#DBEAFE] text-[#1D4ED8] border-[#BFDBFE]';
                    iconBg = 'bg-blue-100 text-blue-600';
                  } else if (item.jenis_peserta === 'Lansia') {
                    badgeClass = 'bg-purple-100 text-purple-700 border-purple-200';
                    iconBg = 'bg-purple-100 text-purple-600';
                  }

                  // Status badge dengan bullet dot sesuai Figma
                  const statusStr = (item.status_kehadiran || 'Menunggu').toLowerCase();
                  let statusBadge = (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Menunggu
                    </span>
                  );

                  if (statusStr.includes('hadir') && !statusStr.includes('tidak') && !statusStr.includes('belum')) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#DCFCE7] text-[#166534]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                        Hadir
                      </span>
                    );
                  } else if (statusStr.includes('tidak')) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FEE2E2] text-[#991B1B]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                        Tidak Hadir
                      </span>
                    );
                  } else if (statusStr.includes('selesai') || statusStr.includes('dilayani')) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#ECFDF3] text-[#12B76A]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A]" />
                        Sudah dilayani
                      </span>
                    );
                  }

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-5 text-slate-400 font-medium">{startIndex + idx + 1}</td>
                      <td className="py-3.5 px-5 font-bold text-slate-900 flex items-center gap-2.5">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 ${iconBg}`}>
                          <User size={13} />
                        </span>
                        <span>{item.nama}</span>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-slate-600 font-medium">{maskNik(item.nik)}</td>
                      <td className="py-3.5 px-5">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${badgeClass}`}>
                          {item.jenis_peserta}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-500">{item.tanggal_lahir || item.tgl_lahir || '-'}</td>
                      <td className="py-3.5 px-5 text-slate-600">{item.usia || '-'}</td>
                      <td className="py-3.5 px-5 text-slate-600">{item.alamat || '-'}</td>
                      <td className="py-3.5 px-5">{statusBadge}</td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectPeserta(item)}
                          className="px-4 py-1.5 bg-[#3B82F6] hover:bg-[#2563EB] active:bg-[#1D4ED8] text-[#FFFFFF] rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                          Pilih
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Menampilkan {sortedList.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + itemsPerPage, sortedList.length)} dari {sortedList.length} hasil
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
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
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                    isAct ? 'bg-[#3B82F6] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              type="button"
              disabled={currentActualPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
