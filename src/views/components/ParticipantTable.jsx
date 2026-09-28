import React from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Check, 
  Clock, 
  X, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export default function ParticipantTable({
  pesertaList,
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  onUpdateStatus,
  loading
}) {
  // Badge jenis peserta styling
  const renderJenisBadge = (jenis) => {
    switch (jenis) {
      case 'Ibu Hamil':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
            Ibu Hamil
          </span>
        );
      case 'Balita':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
            Balita
          </span>
        );
      case 'Bayi':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
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

  // Badge status kehadiran styling + dropdown switch status
  const renderStatusBadge = (item) => {
    const status = item.status_kehadiran;

    if (status === 'Sudah Hadir') {
      return (
        <button
          onClick={() => onUpdateStatus(item.id, 'Belum Hadir')}
          title="Klik untuk ubah jadi Belum Hadir"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100 transition-colors"
        >
          <Check size={14} className="text-emerald-600 stroke-[3]" />
          <span>Sudah Hadir {item.waktu_hadir ? item.waktu_hadir : '08.45'}</span>
        </button>
      );
    }

    if (status === 'Belum Hadir') {
      return (
        <button
          onClick={() => onUpdateStatus(item.id, 'Sudah Hadir')}
          title="Klik untuk tandai Sudah Hadir"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 hover:bg-amber-100 transition-colors"
        >
          <Clock size={14} className="text-amber-600" />
          <span>Belum Hadir</span>
        </button>
      );
    }

    // Tidak Hadir
    return (
      <button
        onClick={() => onUpdateStatus(item.id, 'Sudah Hadir')}
        title="Klik untuk tandai Sudah Hadir"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 hover:bg-rose-100 transition-colors"
      >
        <X size={14} className="text-rose-600" />
        <span>Tidak Hadir</span>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Table Header: Search, Filter, Export */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-base font-bold text-slate-800">
          Daftar Peserta Hari Ini
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, NIK, atau nomor KK..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none pl-8 pr-8 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 focus:outline-none cursor-pointer"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Ibu Hamil">Ibu Hamil</option>
              <option value="Balita">Balita</option>
              <option value="Bayi">Bayi</option>
            </select>
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>

          {/* Export Button */}
          <button 
            onClick={() => alert('Fitur ekspor CSV/Excel siap dihubungkan!')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Download size={14} className="text-slate-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-5">No</th>
              <th className="py-3.5 px-5">Nama Peserta</th>
              <th className="py-3.5 px-5">NIK</th>
              <th className="py-3.5 px-5">Jenis Peserta</th>
              <th className="py-3.5 px-5">Usia</th>
              <th className="py-3.5 px-5">Alamat</th>
              <th className="py-3.5 px-5">Status Kehadiran</th>
              <th className="py-3.5 px-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {loading ? (
              <tr>
                <td colSpan="8" className="py-10 text-center text-slate-400">
                  Memuat data peserta...
                </td>
              </tr>
            ) : pesertaList.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-10 text-center text-slate-400">
                  Tidak ada peserta yang cocok dengan pencarian.
                </td>
              </tr>
            ) : (
              pesertaList.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5 text-slate-400 font-medium">{index + 1}</td>
                  <td className="py-4 px-5 font-bold text-slate-900">{item.nama}</td>
                  <td className="py-4 px-5 text-slate-500">{item.nik}</td>
                  <td className="py-4 px-5">{renderJenisBadge(item.jenis_peserta)}</td>
                  <td className="py-4 px-5 text-slate-600">{item.usia}</td>
                  <td className="py-4 px-5 text-slate-600">{item.alamat}</td>
                  <td className="py-4 px-5">{renderStatusBadge(item)}</td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => alert(`Detail Peserta: ${item.nama} (${item.jenis_peserta})`)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
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

      {/* Table Pagination Footer */}
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          Menampilkan 1-{pesertaList.length} dari {pesertaList.length} peserta
        </div>

        <div className="flex items-center gap-1 self-center">
          <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40">
            <ChevronLeft size={16} />
          </button>
          <button className="w-7 h-7 rounded-lg bg-rose-700 text-white font-semibold text-xs flex items-center justify-center">
            1
          </button>
          <button className="w-7 h-7 rounded-lg hover:bg-slate-100 font-medium text-xs flex items-center justify-center text-slate-600">
            2
          </button>
          <button className="w-7 h-7 rounded-lg hover:bg-slate-100 font-medium text-xs flex items-center justify-center text-slate-600">
            3
          </button>
          <button className="w-7 h-7 rounded-lg hover:bg-slate-100 font-medium text-xs flex items-center justify-center text-slate-600">
            4
          </button>
          <button className="w-7 h-7 rounded-lg hover:bg-slate-100 font-medium text-xs flex items-center justify-center text-slate-600">
            5
          </button>
          <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
