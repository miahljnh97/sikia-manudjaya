import React from 'react';
import { 
  Scale, 
  Ruler, 
  CircleDot, 
  Syringe, 
  Pill, 
  Stethoscope, 
  Apple, 
  MessageSquare, 
  FileText,
  HeartPulse,
  Activity,
  HeartHandshake,
  Check
} from 'lucide-react';

export default function Step2JenisPelayanan({
  selectedPelayanan,
  onTogglePelayanan,
  onBack,
  onNext
}) {
  const layananDasar = [
    { id: 'Penimbangan', label: 'Penimbangan', desc: 'Berat badan dan panjang badan', icon: Scale },
    { id: 'Pengukuran Tinggi Badan', label: 'Pengukuran Tinggi Badan', desc: 'Tinggi badan peserta', icon: Ruler },
    { id: 'Pengukuran Lingkar Kepala', label: 'Pengukuran Lingkar Kepala', desc: 'Lingkar kepala peserta', icon: CircleDot },
    { id: 'Imunisasi', label: 'Imunisasi', desc: 'Pemberian Imunisasi dasar', icon: Syringe },
    { id: 'Pemberian Vitamin', label: 'Pemberian Vitamin', desc: 'Vitamin A dan suplemen', icon: Pill },
    { id: 'Pemeriksaan Kesehatan', label: 'Pemeriksaan Kesehatan', desc: 'Pemeriksaan umum peserta', icon: Stethoscope },
    { id: 'Konseling Gizi', label: 'Konseling Gizi', desc: 'Penilaian gizi dan pola makan', icon: Apple },
    { id: 'Konsultasi', label: 'Konsultasi', desc: 'Konsultasi kesehatan ibu dan anak', icon: MessageSquare },
    { id: 'Layanan Lainnya', label: 'Layanan Lainnya', desc: 'Pelayanan lainnya', icon: FileText },
  ];

  const layananIbuHamil = [
    { id: 'Pemeriksaan Kehamilan', label: 'Pemeriksaan Kehamilan', desc: 'Tekanan darah, tinggi fundus, dan DJJ', icon: HeartPulse },
    { id: 'Pemberian Tablet Tambah Darah', label: 'Pemberian Tablet Tambah Darah', desc: 'Suplemen zat besi ibu hamil', icon: Activity },
    { id: 'Konseling Kehamilan', label: 'Konseling Kehamilan', desc: 'Edukasi kesehatan ibu hamil', icon: HeartHandshake },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Pilih Jenis Pelayanan</h3>
          <p className="text-xs text-blue-600 font-medium mt-0.5">ℹ️ Jenis pelayanan dapat dipilih lebih dari satu</p>
        </div>
      </div>

      {/* Pelayanan Dasar */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-800">Pelayanan Dasar</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {layananDasar.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedPelayanan.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onTogglePelayanan(item.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200/80 bg-white hover:bg-slate-50'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 shrink-0 ${
                  isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {isSelected && <Check size={13} strokeWidth={3} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                    <Icon size={14} className={isSelected ? 'text-blue-600' : 'text-slate-400'} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-1">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pelayanan Khusus Ibu Hamil */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <h4 className="text-xs font-bold text-rose-600">Pelayanan Khusus Ibu Hamil</h4>
          <span className="text-[10px] text-slate-400 font-medium">(Tersedia untuk peserta kategori Ibu Hamil)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {layananIbuHamil.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedPelayanan.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onTogglePelayanan(item.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-rose-400 bg-rose-50/40 shadow-xs'
                    : 'border-rose-100 bg-rose-50/15 hover:bg-rose-50/30'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 shrink-0 ${
                  isSelected ? 'bg-rose-600 border-rose-600 text-white' : 'border-rose-200 bg-white'
                }`}>
                  {isSelected && <Check size={13} strokeWidth={3} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                    <Icon size={14} className={isSelected ? 'text-rose-600' : 'text-rose-400'} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-1">{item.desc}</p>
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
          className="px-5 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl"
        >
          ← Kembali ke Data Kunjungan
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
        >
          Lanjut ke Status Kehadiran →
        </button>
      </div>
    </div>
  );
}
