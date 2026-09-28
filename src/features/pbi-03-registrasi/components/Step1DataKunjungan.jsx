import React from 'react';
import { User, Edit2, Calendar, Clock, CheckCircle2 } from 'lucide-react';

export default function Step1DataKunjungan({
  peserta,
  kunjunganData,
  onChangeData,
  onUbahPeserta,
  onNext,
  onBatal
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* 1. Header Identitas Peserta Terpilih */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Data Peserta</h3>
        <button
          type="button"
          onClick={onUbahPeserta}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
        >
          <Edit2 size={13} />
          <span>Ubah Peserta</span>
        </button>
      </div>

      {/* Identitas Card Box */}
      <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">
            <User size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">{peserta?.nama || 'Siti Aminah'}</h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                {peserta?.jenis_peserta || 'Ibu Hamil'}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-4 gap-y-1">
              <span>NIK: <strong>{peserta?.nik || '3273055205940003'}</strong></span>
              <span>Lahir: <strong>12 Mei 1994 (32 tahun)</strong></span>
              <span>Alamat: <strong>Dusun 1, Desa Manud Jaya</strong></span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-5 space-y-0.5 shrink-0">
          <div>Nama Suami: <strong className="text-slate-800">Budi Santoso</strong></div>
          <div>No. KK: <strong className="text-slate-800">3273 0501 0412</strong></div>
          <div>No. HP: <strong className="text-slate-800">0812 3456 7890</strong></div>
        </div>
      </div>

      {/* 2. Informasi Kunjungan Form */}
      <div>
        <h4 className="text-sm font-bold text-slate-800">Informasi Kunjungan</h4>
        <p className="text-xs text-slate-400 mt-0.5">Tanggal kunjungan dan petugas yang mencatat.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tanggal Kunjungan <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={kunjunganData.tanggal}
                onChange={(e) => onChangeData('tanggal', e.target.value)}
                className="w-full pl-3.5 pr-9 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-800"
              />
              <Calendar size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jam Kedatangan <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={kunjunganData.jam}
                onChange={(e) => onChangeData('jam', e.target.value)}
                className="w-full pl-3.5 pr-9 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-800"
              />
              <Clock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Posyandu <span className="text-rose-500">*</span>
            </label>
            <select
              value={kunjunganData.posyandu}
              onChange={(e) => onChangeData('posyandu', e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-800"
            >
              <option value="Posyandu Desa Manud Jaya">Posyandu Desa Manud Jaya</option>
              <option value="Posyandu Mawar 1">Posyandu Mawar 1</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kader Pencatat
            </label>
            <input
              type="text"
              readOnly
              value={kunjunganData.kaderPencatat || 'Annisa Wati'}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Success alert pill */}
      <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
        <span>Data peserta ditemukan. Silakan lanjutkan ke tahap berikutnya untuk memilih jenis pelayanan.</span>
      </div>

      {/* Bottom Action Buttons */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
        <button
          type="button"
          onClick={onBatal}
          className="px-5 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl"
        >
          Batal
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
        >
          Lanjut ke Jenis Pelayanan →
        </button>
      </div>
    </div>
  );
}
