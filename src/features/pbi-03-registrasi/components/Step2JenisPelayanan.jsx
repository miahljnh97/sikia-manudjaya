import React from 'react';
import { 
  Scale, 
  Ruler, 
  Maximize2, 
  Syringe, 
  Pill, 
  Stethoscope, 
  Apple, 
  MessageSquare, 
  FileText,
  Smile,
  HeartPulse,
  Heart,
  Check,
  Info
} from 'lucide-react';

export default function Step2JenisPelayanan({
  peserta,
  selectedPelayanan = [],
  onTogglePelayanan,
  onBack,
  onNext
}) {
  const isIbuHamilPeserta = (peserta?.jenis_peserta || '').toLowerCase().includes('ibu');

  const layananDasar = [
    { id: 'Penimbangan', label: 'Penimbangan', desc: 'Berat badan dan panjang badan', icon: Scale },
    { id: 'Pengukuran Tinggi Badan', label: 'Pengukuran Tinggi Badan', desc: 'Tinggi badan peserta', icon: Ruler },
    { id: 'Pengukuran Lingkar Kepala', label: 'Pengukuran Lingkar Kepala', desc: 'Lingkar kepala peserta', icon: Maximize2 },
    { id: 'Imunisasi', label: 'Imunisasi', desc: 'Pemberian imunisasi dasar', icon: Syringe },
    { id: 'Pemberian Vitamin', label: 'Pemberian Vitamin', desc: 'Vitamin A dan suplemen', icon: Pill },
    { id: 'Pemeriksaan Kesehatan', label: 'Pemeriksaan Kesehatan', desc: 'Pemeriksaan umum peserta', icon: Stethoscope },
    { id: 'Konseling Gizi', label: 'Konseling Gizi', desc: 'Penilaian gizi dan pola makan', icon: Apple },
    { id: 'Konsultasi', label: 'Konsultasi', desc: 'Konsultasi kesehatan ibu dan anak', icon: MessageSquare },
    { id: 'Layanan Lainnya', label: 'Layanan Lainnya', desc: 'Pelayanan lainnya', icon: FileText },
  ];

  const layananIbuHamil = [
    { id: 'Pemeriksaan Kehamilan', label: 'Pemeriksaan Kehamilan', desc: 'Tekanan darah, tinggi fundus, dan DJJ', icon: Smile },
    { id: 'Pemberian Tablet Tambah Darah', label: 'Pemberian Tablet Tambah...', desc: 'Suplemen zat besi ibu hamil', icon: HeartPulse },
    { id: 'Konseling Kehamilan', label: 'Konseling Kehamilan', desc: 'Edukasi kesehatan ibu hamil', icon: Heart },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header & Banner Info di sebelah kanan Sesuai Gambar 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-base font-bold text-slate-900">
          Pilih Jenis Pelayanan
        </h3>
        
        {/* Banner Info Biru di Kanan */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#2563EB] font-medium self-start sm:self-auto">
          <Info size={14} className="shrink-0 text-[#2563EB]" />
          <span>Jenis pelayanan dapat dipilih lebih dari satu</span>
        </div>
      </div>

      {/* Pelayanan Dasar */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-900">Pelayanan Dasar</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {layananDasar.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedPelayanan.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onTogglePelayanan(item.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[#2563EB] bg-[#F0F7FF]/50 shadow-xs'
                    : 'border border-slate-200/90 bg-white hover:border-slate-300'
                }`}
              >
                {/* Checkbox */}
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'border-slate-300 bg-white'
                }`}>
                  {isSelected && <Check size={13} strokeWidth={3} />}
                </div>

                {/* Icon box (Soft Blue Square) */}
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  <Icon size={20} />
                </div>

                {/* Label and description */}
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-xs text-slate-900 leading-tight truncate">
                    {item.label}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight line-clamp-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pelayanan Khusus Ibu Hamil */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold text-[#E11D48]">Pelayanan Khusus Ibu Hamil</h4>
          <span className="text-[11px] text-slate-400 font-normal">Tersedia untuk peserta kategori Ibu Hamil</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {layananIbuHamil.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedPelayanan.includes(item.id);
            const isDisabled = !isIbuHamilPeserta;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (!isDisabled) onTogglePelayanan(item.id);
                }}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                  isDisabled 
                    ? 'border-slate-100 bg-slate-50/60 opacity-40 cursor-not-allowed'
                    : isSelected
                    ? 'border-2 border-[#2563EB] bg-[#F0F7FF]/50 shadow-xs cursor-pointer'
                    : 'border border-[#FECDD3] bg-white hover:border-[#FDA4AF] cursor-pointer'
                }`}
              >
                {/* Checkbox */}
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'border-[#FECDD3] bg-white'
                }`}>
                  {isSelected && <Check size={13} strokeWidth={3} />}
                </div>

                {/* Icon box (Soft Pink Square) */}
                <div className="w-10 h-10 rounded-xl bg-[#FFF1F2] text-[#E11D48] flex items-center justify-center shrink-0">
                  <Icon size={20} />
                </div>

                {/* Label and description */}
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-xs text-slate-900 leading-tight truncate">
                    {item.label}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-1 leading-tight line-clamp-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer shadow-xs transition-colors"
        >
          ← Kembali ke Data Kunjungan
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-xs cursor-pointer transition-colors"
        >
          Lanjut ke Status Kehadiran →
        </button>
      </div>
    </div>
  );
}
