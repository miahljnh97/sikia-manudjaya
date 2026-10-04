import React from 'react';
import { Check, Clock, X, CheckCircle } from 'lucide-react';

export default function Step3StatusKehadiran({
  statusKehadiran,
  onChangeStatus,
  catatan,
  onChangeCatatan,
  onBack,
  onNext
}) {
  // Sesuai persis dengan registrasi-pengunjung3.png di Figma (Issue #22 & #23)
  const statusOptions = [
    {
      id: 'Hadir',
      label: 'Hadir',
      desc: 'Peserta datang ke kegiatan dan mendapat pelayanan',
      icon: Check,
      iconType: 'check-circle-filled',
      iconBg: 'bg-[#A7F3D0] text-[#059669]',
    },
    {
      id: 'Menunggu',
      label: 'Menunggu',
      desc: 'Peserta sudah datang namun belum dilayani',
      icon: Clock,
      iconType: 'clock-circle',
      iconBg: 'bg-[#E0E7FF] text-[#4F46E5]',
    },
    {
      id: 'Tidak Hadir',
      label: 'Tidak Hadir',
      desc: 'Peserta tidak datang pada jadwal kunjungan hari ini',
      icon: X,
      iconType: 'x-circle',
      iconBg: 'bg-[#FFE4E6] text-[#E11D48]',
    },
    {
      id: 'Belum Dilayani',
      label: 'Belum Dilayani',
      desc: 'Status pelayanan belum ditentukan',
      icon: CheckCircle,
      iconType: 'check-circle-outline',
      iconBg: 'bg-[#E0F2FE] text-[#0284C7]',
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

      {/* 4 Pilihan Kartu Status Sesuai Figma */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {statusOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = statusKehadiran === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => onChangeStatus(opt.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between h-40 ${
                isSelected
                  ? 'border-[#10B981] bg-[#F0FDF4] shadow-xs ring-1 ring-[#10B981]'
                  : 'border-slate-200/80 bg-white hover:bg-slate-50'
              }`}
            >
              {/* Checkbox di kiri atas */}
              <div className="flex items-center justify-between">
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                  isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {isSelected && <Check size={11} strokeWidth={3} />}
                </div>
              </div>

              {/* Icon Status Bundar di Tengah */}
              <div className="flex flex-col items-center text-center my-auto">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${opt.iconBg}`}>
                  <Icon size={16} strokeWidth={2.5} />
                </div>
                <div className="font-bold text-xs text-slate-900">{opt.label}</div>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                  {opt.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Banner Hijau Terpilih (Issue #23) */}
      <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center gap-2.5 text-xs text-[#065F46]">
        <div className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
          <Check size={12} strokeWidth={3} />
        </div>
        <div>
          <span className="font-bold">Status "{statusKehadiran}" dipilih.</span>{' '}
          <span className="text-[11px] text-[#047857]">Lanjutkan ke tahap Konfirmasi untuk menyimpan registrasi kunjungan.</span>
        </div>
      </div>

      {/* Catatan Opsional */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Catatan (Opsional)
        </label>
        <textarea
          rows={3}
          value={catatan}
          onChange={(e) => onChangeCatatan(e.target.value)}
          placeholder="Tambahkan catatan jika ada (misal: kondisi kesehatan, keluhan, atau informasi tambahan)..."
          className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 resize-none placeholder:text-slate-400"
        />
        <div className="text-[10px] text-slate-400 text-right mt-1">
          {catatan?.length || 0}/500
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer"
        >
          ← Kembali ke Jenis Pelayanan
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer"
        >
          Lanjut ke Konfirmasi →
        </button>
      </div>
    </div>
  );
}
