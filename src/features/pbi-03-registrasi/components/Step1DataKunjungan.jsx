import React, { useState } from 'react';
import { User, Edit2, Calendar, Clock, Check, ChevronDown } from 'lucide-react';

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
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
        >
          <Edit2 size={13} />
          <span>Ubah Peserta</span>
        </button>
      </div>

      {/* Identitas Card Box Sesuai Figma (Issue #13) */}
      <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center font-bold shrink-0">
            <User size={26} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">{peserta?.nama || 'Siti Aminah'}</h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF1F2] text-[#F43F5E] border border-[#FFE4E6]">
                {peserta?.jenis_peserta || 'Ibu Hamil'}
              </span>
            </div>
            <div className="text-xs text-slate-500 flex flex-wrap gap-x-6 gap-y-1">
              <div>
                <span className="text-[10px] text-slate-400 block">NIK</span>
                <span className="font-mono text-slate-800 font-medium">{peserta?.nik || '3273055205940003'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Tanggal Lahir</span>
                <span className="text-slate-800 font-medium">{peserta?.tanggal_lahir || '12 Mei 1994'} ({peserta?.usia || '32 tahun'})</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Alamat</span>
                <span className="text-slate-800 font-medium">{peserta?.alamat || 'Dusun 1, Desa Manud Jaya'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6 space-y-1 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 block">Nama Suami</span>
            <strong className="text-slate-800">{peserta?.nama_suami || 'Budi Santoso'}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">No. KK</span>
            <strong className="text-slate-800">{peserta?.no_kk || '3273 0501 0412'}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">No. HP</span>
            <strong className="text-slate-800">{peserta?.telepon || '0812 3456 7890'}</strong>
          </div>
        </div>
      </div>

      {/* 2. Informasi Kunjungan Form */}
      <div>
        <h4 className="text-sm font-bold text-slate-900">Informasi Kunjungan</h4>
        <p className="text-xs text-slate-400 mt-0.5">Tanggal kunjungan dan petugas yang mencatat.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Tanggal Kunjungan dengan Date Picker (Issue #20) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tanggal Kunjungan <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={kunjunganData.tanggalValue || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  onChangeData('tanggalValue', val);
                  if (val) {
                    const [y, m, d] = val.split('-');
                    const bulanIndo = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                    const dateFormatted = `${parseInt(d, 10)} ${bulanIndo[parseInt(m, 10) - 1]} ${y}`;
                    onChangeData('tanggal', dateFormatted);
                  }
                }}
                className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Terpilih: <strong>{kunjunganData.tanggal || 'Hari ini'}</strong>
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jam Kedatangan <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="time"
                value={kunjunganData.jam || '08:30'}
                onChange={(e) => onChangeData('jam', e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Posyandu resmi dari Database */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Posyandu <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={kunjunganData.posyandu || 'Posyandu Desa Manud Jaya'}
                onChange={(e) => onChangeData('posyandu', e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-800 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Posyandu Desa Manud Jaya">Posyandu Desa Manud Jaya</option>
              </select>
              <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
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

      {/* Success alert pill (Issue #14: check icon hijau bundar) */}
      <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center gap-2.5 text-xs text-[#065F46]">
        <div className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
          <Check size={12} strokeWidth={3} />
        </div>
        <span className="font-medium">Data peserta ditemukan. Silakan lanjutkan ke tahap berikutnya untuk memilih jenis pelayanan.</span>
      </div>

      {/* Bottom Action Buttons */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
        <button
          type="button"
          onClick={onBatal}
          className="px-5 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer"
        >
          Batal
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>Lanjut ke Jenis Pelayanan</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
