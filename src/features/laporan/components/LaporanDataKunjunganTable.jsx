import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function LaporanDataKunjunganTable({ data = [], searchQuery = '' }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Filter pencarian
  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.nama?.toLowerCase().includes(q) ||
      item.nik?.toLowerCase().includes(q) ||
      item.nik_lengkap?.toLowerCase().includes(q) ||
      item.jenis_pelayanan?.toLowerCase().includes(q) ||
      item.jenis_pasien?.toLowerCase().includes(q) ||
      item.hasil_catatan?.toLowerCase().includes(q)
    );
  });

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Ambil slice untuk halaman aktif
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderBadgeJenisPasien = (jenis) => {
    const j = (jenis || '').toLowerCase();
    if (j.includes('ibu hamil') || j.includes('hamil')) {
      return (
        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FDF2F4] text-[#E11D48] border border-rose-100/80">
          Ibu Hamil
        </span>
      );
    }
    if (j.includes('nifas')) {
      return (
        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FDF2F8] text-[#DB2777] border border-pink-100/80">
          Ibu Nifas
        </span>
      );
    }
    if (j.includes('bayi')) {
      return (
        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-[#EFF6FF] text-[#2563EB] border border-blue-100/80">
          Bayi
        </span>
      );
    }
    return (
      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-[#ECFDF5] text-[#059669] border border-emerald-100/80">
        Balita
      </span>
    );
  };

  const renderBadgeStatus = (status) => {
    const isSelesai = (status || '').toLowerCase().includes('selesai') ||
      (status || '').toLowerCase().includes('dilayani') ||
      (status || '').toLowerCase().includes('hadir');

    return (
      <span className={`inline-block px-3 py-1 rounded-md text-[11px] font-semibold ${
        isSelesai
          ? 'bg-[#DCFCE7] text-[#15803D]'
          : 'bg-slate-100 text-slate-500'
      }`}>
        {isSelesai ? 'Selesai' : status}
      </span>
    );
  };

  // Generate daftar nomor halaman untuk paginasi
  const renderPaginationButtons = () => {
    // Di wireframe menampilkan < 1 2 3 4 >
    const pagesToShow = Math.max(totalPages, totalItems === 0 ? 1 : Math.min(totalPages, 4));
    const pages = [];
    for (let i = 1; i <= Math.min(pagesToShow, totalPages); i++) {
      pages.push(i);
    }

    return pages.map((pageNum) => (
      <button
        key={pageNum}
        type="button"
        onClick={() => handlePageChange(pageNum)}
        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
          currentPage === pageNum
            ? 'bg-[#E11D48] text-white shadow-xs'
            : 'text-slate-500 hover:bg-slate-100 font-medium'
        }`}
      >
        {pageNum}
      </button>
    ));
  };

  return (
    <div className="space-y-4">
      {/* Tabel Data Kunjungan Sesuai Gambar 2 */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">No</th>
              <th className="py-3 px-4">Tanggal Kunjungan</th>
              <th className="py-3 px-4">Nama</th>
              <th className="py-3 px-4">NIK</th>
              <th className="py-3 px-4 text-center">Jenis Pasien</th>
              <th className="py-3 px-4">Jenis Pelayanan</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4">Hasil/Catatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-400">
                  <p className="font-medium">Tidak ada data kunjungan yang cocok.</p>
                  <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau ganti periode bulan.</p>
                </td>
              </tr>
            ) : (
              currentItems.map((item, idx) => (
                <tr
                  key={item.id || idx}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                    {startIndex + idx + 1}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600 whitespace-nowrap">
                    {item.tanggal_kunjungan}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {item.nama}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-xs whitespace-nowrap">
                    {item.nik}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {renderBadgeJenisPasien(item.jenis_pasien)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                    {item.jenis_pelayanan}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {renderBadgeStatus(item.status)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-xs whitespace-nowrap">
                    {item.hasil_catatan}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bagian Paginasi Sesuai Gambar 2: "Menampilkan 1-7 dari 13 hasil" & "< 1 2 3 4 >" */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <div>
          {totalItems > 0 ? (
            <span>
              Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems} hasil
            </span>
          ) : (
            <span>Menampilkan 0 hasil</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Tombol Sebelumnya (<) */}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Tombol Nomor Halaman */}
          {renderPaginationButtons()}

          {/* Tombol Selanjutnya (>) */}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Halaman Selanjutnya"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
