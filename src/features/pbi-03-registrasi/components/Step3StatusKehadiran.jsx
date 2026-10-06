import React from 'react';
import { Check, Clock, X, CheckCircle2 } from 'lucide-react';

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
      icon: Check,
      iconBg: 'bg-[#A7F3D0] text-[#059669]',
    },
    {
      id: 'Menunggu',
      label: 'Menunggu',
      desc: 'Peserta sudah datang namun belum dilayani',
      icon: Clock,
      iconBg: 'bg-[#E0E7FF] text-[#4F46E5]',
    },
    {
      id: 'Tidak Hadir',
      label: 'Tidak Hadir',
      desc: 'Peserta tidak datang pada jadwal kunjungan hari ini',
      icon: X,
      iconBg: 'bg-[#FFE4E6] text-[#E11D48]',
    },
    {
      id: 'Belum Dilayani',
      label: 'Belum Dilayani',
      desc: 'Status pelayanan belum ditentukan',
      icon: CheckCircle2,
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

      {/* 4 Pilihan Kartu Status Sesuai Gambar 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {statusOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = statusKehadiran === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => onChangeStatus(opt.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between min-h-[170px] ${
                isSelected
                  ? 'border-2 border-[#10B981] bg-[#F0FDF4] shadow-xs'
                  : 'border border-slate-200/90 bg-white hover:border-slate-300'
              }`}
            >
              {/* Checkbox di kiri atas */}
              <div className="flex items-center justify-between">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                  isSelected ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'border-slate-300 bg-white'
                }`}>
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </div>
              </div>

              {/* Icon Status Bundar di Tengah */}
              <div className="flex flex-col items-center text-center my-auto px-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center mb-2.5 ${opt.iconBg}`}>
                  <Icon size={18} strokeWidth={2.5} />
                </div>
                <div className="font-bold text-sm text-slate-900">{opt.label}</div>
                <p className="text-[11px] text-slate-500 mt-1 leading-tight text-center">
                  {opt.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Banner Hijau Terpilih Sesuai Gambar 3 dengan New Line */}
      <div className="p-3.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex items-start gap-2.5">
        <CheckCircle2 size={18} className="text-[#16A34A] shrink-0 mt-0.5" />
        <div className="text-xs">
          <div className="font-bold text-[#166534]">Status "{statusKehadiran}" dipilih.</div>
          <div className="text-slate-600 font-normal mt-0.5">
            Lanjutkan ke tahap Konfirmasi untuk menyimpan registrasi kunjungan.
          </div>
        </div>
      </div>

      {/* Catatan Opsional Sesuai Gambar 1 */}
      <div>
        <label className="block text-xs font-bold text-slate-900 mb-1.5">
          Catatan (Opsional)
        </label>
        <textarea
          rows={3}
          value={catatan}
          onChange={(e) => onChangeCatatan(e.target.value)}
          placeholder="Tambahkan catatan jika ada (misal: kondisi kesehatan, keluhan, atau informasi tambahan)..."
          className="w-full p-4 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 resize-none placeholder:text-slate-400 min-h-[96px]"
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
          className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer shadow-xs transition-colors"
        >
          ← Kembali ke Jenis Pelayanan
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-xs cursor-pointer transition-colors"
        >
          Lanjut ke Konfirmasi →
        </button>
      </div>
    </div>
  );
}
