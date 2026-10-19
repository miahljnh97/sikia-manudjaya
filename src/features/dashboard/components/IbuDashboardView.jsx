import React from 'react';
import { 
  Calendar, 
  Bell, 
  Heart, 
  Star, 
  MapPin, 
  Pill, 
  Syringe, 
  ChevronRight, 
  Weight, 
  Activity, 
  Droplet, 
  Ruler, 
  TrendingUp,
  ArrowRight,
  ClipboardList
} from 'lucide-react';

export default function IbuDashboardView({ user, onNavigate, onShowToast }) {
  const handleNav = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Ringkasan Kesehatan Ibu dan Anak
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Pantau kesehatan Anda dan si kecil dalam satu halaman.
        </p>
      </div>

      {/* 2. Top Row: 2 Big Cards (Kesehatan Ibu & Kesehatan Anak) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Card 1: Kesehatan Ibu */}
        <div className="bg-gradient-to-r from-[#FFF0F4] via-[#FFE4EC] to-[#FFD6E4] border border-pink-200/70 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xs flex flex-col justify-between min-h-[220px]">
          <div className="relative z-10 space-y-3 max-w-[62%] sm:max-w-[65%]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 border border-pink-200 text-[#E11D48] text-xs font-bold">
              <ClipboardList size={13} />
              <span>Kesehatan Ibu</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E11D48] tracking-tight">
                Siti Aminah
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Usia Kehamilan: <strong className="text-slate-900 font-bold">28 Minggu</strong> · Trimester 3
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleNav('/kesehatan-ibu/kehamilan')}
                className="px-5 py-2.5 bg-[#FF4D80] hover:bg-[#F43F5E] text-white rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-pink-300/40 transition-all cursor-pointer active:scale-95"
              >
                <span>Lihat Detail Ibu</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Ilustrasi Ibu Hamil di sebelah kanan */}
          <div className="absolute right-2 bottom-0 top-2 flex items-end pointer-events-none">
            <img 
              src="/images/ibu-hamil-card.png" 
              alt="Ilustrasi Ibu Hamil" 
              className="h-44 sm:h-52 object-contain drop-shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Card 2: Kesehatan Anak */}
        <div className="bg-gradient-to-r from-[#FDF4FF] via-[#FFF1F2] to-[#FFE4EC] border border-pink-200/70 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xs flex flex-col justify-between items-center text-center min-h-[220px]">
          <div className="w-full flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 text-pink-600 text-xs font-bold">
              <Star size={14} className="fill-pink-500 text-pink-500" />
              <span>Kesehatan Anak</span>
            </div>
          </div>

          <div className="my-1 flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
              <img 
                src="/images/baby-card.png" 
                alt="Alya Putri" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#BE185D] tracking-tight mt-1">
              Alya Putri
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              1 Tahun 6 Bulan
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => handleNav('/kesehatan-anak/pertumbuhan')}
              className="px-5 py-2.5 bg-[#FF4D80] hover:bg-[#F43F5E] text-white rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-pink-300/40 transition-all cursor-pointer active:scale-95"
            >
              <span>Lihat Detail Anak</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Middle Row: Jadwal Terdekat & Pengingat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Card Jadwal Terdekat */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <Calendar size={18} className="text-[#E11D48]" />
            <h3 className="text-sm font-bold text-slate-900">Jadwal Terdekat</h3>
          </div>

          <div className="space-y-3">
            {/* Item 1 */}
            <div 
              onClick={() => handleNav('/jadwal-saya')}
              className="p-3.5 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex flex-col items-center justify-center text-[#E11D48] shrink-0 font-bold leading-tight">
                  <span className="text-base font-extrabold">20</span>
                  <span className="text-[10px] uppercase font-semibold">Okt</span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#E11D48] transition-colors">
                    Pemeriksaan Kehamilan
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                    <MapPin size={12} className="text-slate-400" />
                    <span>Puskesmas Manud Jaya</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>

            {/* Item 2 */}
            <div 
              onClick={() => handleNav('/jadwal-saya')}
              className="p-3.5 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex flex-col items-center justify-center text-[#E11D48] shrink-0 font-bold leading-tight">
                  <span className="text-base font-extrabold">20</span>
                  <span className="text-[10px] uppercase font-semibold">Okt</span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#E11D48] transition-colors">
                    Posyandu Balita
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                    <MapPin size={12} className="text-slate-400" />
                    <span>Puskesmas Manud Jaya</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </div>
        </div>

        {/* Card Pengingat */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <Bell size={18} className="text-[#E11D48]" />
            <h3 className="text-sm font-bold text-slate-900">Pengingat</h3>
          </div>

          <div className="space-y-3">
            {/* Item 1: Konsumsi TTD */}
            <div 
              onClick={() => handleNav('/kesehatan-ibu/kehamilan')}
              className="p-3.5 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0 border border-pink-100">
                  <Pill size={18} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#E11D48] transition-colors">
                    Konsumsi Tablet Tambah Darah
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Setiap hari
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>

            {/* Item 2: Imunisasi Campak Rubella */}
            <div 
              onClick={() => handleNav('/kesehatan-anak/imunisasi')}
              className="p-3.5 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                  <Syringe size={18} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#E11D48] transition-colors">
                    Imunisasi Campak Rubella
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    20 Oktober 2026
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Ringkasan Kesehatan Ibu & Ringkasan Kesehatan Anak */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Section Ringkasan Kesehatan Ibu */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Ringkasan Kesehatan Ibu</h3>
            <button
              type="button"
              onClick={() => handleNav('/kesehatan-ibu/kehamilan')}
              className="text-xs font-semibold text-[#E11D48] hover:text-[#BE185D] cursor-pointer"
            >
              Lihat Detail
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 1. Pemeriksaan Kehamilan */}
            <div 
              onClick={() => handleNav('/kesehatan-ibu/pemeriksaan')}
              className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between min-h-[105px] cursor-pointer hover:border-pink-200 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0 mb-1">
                <Heart size={14} />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block leading-tight">5 dari 8 kali</span>
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5 mt-1">
                  <span>Pemeriksaan Kehamilan</span>
                  <ChevronRight size={10} />
                </span>
              </div>
            </div>

            {/* 2. Kenaikan Berat Badan */}
            <div 
              onClick={() => handleNav('/kesehatan-ibu/kehamilan')}
              className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between min-h-[105px] cursor-pointer hover:border-pink-200 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0 mb-1">
                <Weight size={14} />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block leading-tight">+7 kg</span>
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5 mt-1">
                  <span>Kenaikan Berat Badan</span>
                  <ChevronRight size={10} />
                </span>
              </div>
            </div>

            {/* 3. Tekanan Darah */}
            <div 
              onClick={() => handleNav('/kesehatan-ibu/pemeriksaan')}
              className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between min-h-[105px] cursor-pointer hover:border-pink-200 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0 mb-1">
                <Activity size={14} />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">110/70 mmHg</span>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Tekanan Darah</span>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-1">
                  <span>Normal</span>
                  <ChevronRight size={8} />
                </span>
              </div>
            </div>

            {/* 4. Hasil HB Terakhir */}
            <div 
              onClick={() => handleNav('/kesehatan-ibu/pemeriksaan')}
              className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between min-h-[105px] cursor-pointer hover:border-pink-200 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0 mb-1">
                <Droplet size={14} />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block leading-tight">Normal</span>
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5 mt-1">
                  <span>Hasil HB Terakhir</span>
                  <ChevronRight size={10} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Ringkasan Kesehatan Anak */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Ringkasan Kesehatan Anak</h3>
            <button
              type="button"
              onClick={() => handleNav('/kesehatan-anak/pertumbuhan')}
              className="text-xs font-semibold text-[#E11D48] hover:text-[#BE185D] cursor-pointer"
            >
              Lihat Detail
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 1. Berat Badan */}
            <div 
              onClick={() => handleNav('/kesehatan-anak/pertumbuhan')}
              className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between min-h-[105px] cursor-pointer hover:border-pink-200 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0 mb-1">
                <Weight size={14} />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block leading-tight">10,5 kg</span>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Berat Badan</span>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-1">
                  <span>Sesuai Usia</span>
                  <ChevronRight size={8} />
                </span>
              </div>
            </div>

            {/* 2. Tinggi Badan */}
            <div 
              onClick={() => handleNav('/kesehatan-anak/pertumbuhan')}
              className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between min-h-[105px] cursor-pointer hover:border-pink-200 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0 mb-1">
                <Ruler size={14} />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block leading-tight">80 cm</span>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Tinggi Badan</span>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-1">
                  <span>Sesuai Usia</span>
                  <ChevronRight size={8} />
                </span>
              </div>
            </div>

            {/* 3. Imunisasi */}
            <div 
              onClick={() => handleNav('/kesehatan-anak/imunisasi')}
              className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between min-h-[105px] cursor-pointer hover:border-pink-200 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0 mb-1">
                <Syringe size={14} />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block leading-tight">3 dari 5</span>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Imunisasi</span>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-pink-700 bg-pink-50 px-1.5 py-0.2 rounded mt-1">
                  <span>Dalam Proses</span>
                  <ChevronRight size={8} />
                </span>
              </div>
            </div>

            {/* 4. Perkembangan */}
            <div 
              onClick={() => handleNav('/kesehatan-anak/perkembangan')}
              className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-xs flex flex-col justify-between min-h-[105px] cursor-pointer hover:border-pink-200 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0 mb-1">
                <TrendingUp size={14} />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">Sesuai Usia</span>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Perkembangan</span>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-1">
                  <span>Normal</span>
                  <ChevronRight size={8} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
