import React from 'react';
import { Search, QrCode, RotateCcw, Plus } from 'lucide-react';
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
  pesertaList,
  onSelectPeserta,
  onTambahPesertaBaru
}) {
  return (
    <div className="space-y-6">
      {/* Top Filter Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        {/* Left Search and Filters */}
        <div className="w-full lg:max-w-2xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Cari berdasarkan nama, NIK, atau nomor KK
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, NIK, atau nomor KK..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              />
            </div>
          </div>

          {/* Sub Filters Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="block text-[11px] text-slate-400 font-medium mb-1">Jenis Peserta</span>
              <select
                value={jenisFilter}
                onChange={(e) => setJenisFilter(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
              >
                <option value="Semua">Semua</option>
                <option value="Ibu Hamil">Ibu Hamil</option>
                <option value="Balita">Balita</option>
                <option value="Bayi">Bayi</option>
              </select>
            </div>

            <div>
              <span className="block text-[11px] text-slate-400 font-medium mb-1">Status Peserta</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
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
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
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
                onClick={onResetFilter}
                className="w-full p-2 text-xs font-semibold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 rounded-xl inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Reset Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right CTA Box: Tidak menemukan peserta? */}
        <div className="w-full lg:w-72 bg-rose-50/60 border border-rose-100 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-800">Tidak menemukan peserta?</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Daftarkan sebagai peserta baru terlebih dahulu di sistem.
            </p>
          </div>
          <button
            onClick={onTambahPesertaBaru}
            className="mt-4 w-full py-2.5 px-3 bg-rose-800 hover:bg-rose-900 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5"
          >
            <Plus size={15} />
            <span>Tambah Peserta Baru</span>
          </button>
        </div>
      </div>

      {/* Tabel Hasil Pencarian */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800">
            Hasil Pencarian
          </h4>
          <span className="text-[11px] text-slate-400">
            Menampilkan 1-{pesertaList.length} dari {pesertaList.length} hasil pencarian
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/60 text-slate-400 text-[11px] uppercase font-semibold border-b border-slate-100">
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Nama Peserta</th>
                <th className="py-3 px-4">NIK</th>
                <th className="py-3 px-4">Jenis Peserta</th>
                <th className="py-3 px-4">Tanggal Lahir</th>
                <th className="py-3 px-4">Usia</th>
                <th className="py-3 px-4">Alamat</th>
                <th className="py-3 px-4">Status Kehadiran</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {pesertaList.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400">{idx + 1}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{item.nama}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 font-medium">{maskNik(item.nik)}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      item.jenis_peserta === 'Ibu Hamil' ? 'bg-rose-50 text-rose-600' :
                      item.jenis_peserta === 'Balita' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {item.jenis_peserta}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{item.tanggal_lahir || '12 Mei 1996'}</td>
                  <td className="py-3.5 px-4">{item.usia}</td>
                  <td className="py-3.5 px-4">{item.alamat}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {item.status_kehadiran}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectPeserta(item)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                    >
                      Pilih
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
