import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, Check } from 'lucide-react';

export default function Step3StatusKehadiran({
  statusKehadiran,
  onChangeStatus,
  catatan,
  onChangeCatatan,
  onBack,
  onNext
}) {
  const statusOptions = [
    {
      id: 'Hadir',
      label: 'Hadir',
      desc: 'Peserta datang ke kegiatan dan mendapat pelayanan',
      icon: CheckCircle2,
      activeColor: 'border-emerald-500 bg-emerald-50/50 text-emerald-700',
      iconColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-100 text-emerald-700'
    },
    {
      id: 'Menunggu',
      label: 'Menunggu',
      desc: 'Peserta sudah datang namun belum dilayani',
      icon: Clock,
      activeColor: 'border-indigo-500 bg-indigo-50/50 text-indigo-700',
      iconColor: 'text-indigo-600',
      badgeBg: 'bg-indigo-100 text-indigo-700'
    },
    {
      id: 'Tidak Hadir',
      label: 'Tidak Hadir',
      desc: 'Peserta tidak datang pada jadwal kunjungan hari ini',
      icon: XCircle,
      activeColor: 'border-rose-500 bg-rose-50/50 text-rose-700',
      iconColor: 'text-rose-600',
      badgeBg: 'bg-rose-100 text-rose-700'
    },
    {
      id: 'Belum Dilayani',
      label: 'Belum Dilayani',
      desc: 'Status pelayanan belum ditentukan',
      icon: AlertCircle,
      activeColor: 'border-blue-500 bg-blue-50/50 text-blue-700',
      iconColor: 'text-blue-600',
      badgeBg: 'bg-blue-100 text-blue-700'
    },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Status Kehadiran</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Pilih status kehadiran peserta berdasarkan kondisi saat registrasi Posyandu.
        </p>
      </div>

      {/* 4 Pilihan Kartu Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {statusOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = statusKehadiran === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => onChangeStatus(opt.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between h-36 ${
                isSelected
                  ? `${opt.activeColor} shadow-xs ring-1 ring-emerald-500`
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                  isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {isSelected && <Check size={11} strokeWidth={3} />}
                </div>
              </div>

              <div className="flex flex-col items-center text-center my-auto">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 ${opt.badgeBg}`}>
                  <Icon size={18} className={opt.iconColor} />
                </div>
                <div className="font-bold text-xs">{opt.label}</div>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                  {opt.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Pill Status Terpilih */}
      <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
        <span>Status "{statusKehadiran}" dipilih. Lanjutkan ke tahap Konfirmasi untuk menyimpan registrasi kunjungan.</span>
      </div>

      {/* Catatan Opsional Form */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700">Catatan (Opsional)</label>
          <span className="text-[10px] text-slate-400">{catatan.length}/500</span>
        </div>
        <textarea
          rows={3}
          maxLength={500}
          value={catatan}
          onChange={(e) => onChangeCatatan(e.target.value)}
          placeholder="Tambahkan catatan jika ada (misal: kondisi kesehatan, keluhan, atau informasi tambahan)..."
          className="w-full p-3.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl"
        >
          ← Kembali ke Jenis Pelayanan
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
        >
          Lanjut ke Konfirmasi →
        </button>
      </div>
    </div>
  );
}
