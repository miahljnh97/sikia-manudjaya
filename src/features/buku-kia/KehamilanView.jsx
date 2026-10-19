import React, { useState } from 'react';
import { 
  Calendar, 
  HeartPulse, 
  Stethoscope, 
  Weight, 
  ChevronRight, 
  Info, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  X
} from 'lucide-react';

export default function KehamilanView({ onNavigate, onShowToast }) {
  const [selectedPanduan, setSelectedPanduan] = useState(null);

  const panduanList = [
    {
      id: 'tanda-bahaya',
      title: 'Tanda bahaya kehamilan',
      desc: 'Kenali tanda bahaya seperti perdarahan, sakit kepala hebat, bengkak pada wajah dan kaki, serta gerakan janin berkurang.',
      points: [
        'Perdarahan dari jalan lahir',
        'Bengkak pada kaki, tangan, dan wajah disertai sakit kepala hebat',
        'Demam tinggi atau kejang',
        'Gerakan janin berkurang atau tidak terasa',
        'Air ketuban keluar sebelum waktunya'
      ]
    },
    {
      id: 'persiapan-persalinan',
      title: 'Persiapan persalinan',
      desc: 'Panduan persiapan P4K (Program Perencanaan Persalinan dan Pencegahan Komplikasi) menyambut kelahiran sang buah hati.',
      points: [
        'Tentukan tempat persalinan dan penolong persalinan (Bidan/Dokter)',
        'Siapkan dana persalinan dan jaminan kesehatan (BPJS/KIS)',
        'Siapkan kendaraan/transportasi siaga',
        'Siapkan calon pendonor darah jika diperlukan',
        'Siapkan perlengkapan ibu dan bayi baru lahir minimal 1 bulan sebelum HPL'
      ]
    },
    {
      id: 'perawatan-pasca-persalinan',
      title: 'Perawatan pasca persalinan',
      desc: 'Langkah awal perawatan masa nifas, inisiasi menyusu dini (IMD), dan perawatan tali pusat bayi baru lahir.',
      points: [
        'Inisiasi Menyusu Dini (IMD) segera dalam 1 jam pertama setelah lahir',
        'Pemberian ASI Eksklusif selama 6 bulan pertama',
        'Menjaga kebersihan area intim dan luka jahitan pasca bersalin',
        'Istirahat yang cukup saat bayi sedang tidur',
        'Kontrol nifas (KF 1 - KF 4) sesuai anjuran bidan'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Breadcrumb */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Kesehatan Ibu / Kehamilan
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Pantau perkembangan kehamilan dan jaga kesehatan ibu serta janin sesuai panduan buku KIA
        </p>
      </div>

      {/* 2. Top Banner Card (Sesuai Screenshot 3) */}
      <div className="bg-gradient-to-r from-[#FFF0F4] via-[#FFE4EC] to-[#FFD6E4] border border-pink-200/80 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Sisi Kiri: Usia Kehamilan + Progress Bar */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs text-slate-600 font-medium block">Usia Kehamilan</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#E11D48] tracking-tight">
                28 Minggu
              </span>
              <span className="text-xs text-slate-500 font-medium">dari 40 minggu</span>
            </div>

            {/* Progress Bar 28/40 minggu (~70%) */}
            <div className="w-full max-w-xs h-2.5 bg-pink-200/80 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#E11D48] rounded-full transition-all duration-500" 
                style={{ width: '70%' }}
              />
            </div>

            {/* Trimester Badge */}
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Trimester</span>
              <span className="px-3 py-1 rounded-xl bg-pink-100 text-[#BE185D] text-xs font-bold border border-pink-200">
                Trimester 3
              </span>
            </div>
          </div>

          {/* Sisi Tengah: Perkiraan Hari Lahir Box */}
          <div className="lg:col-span-4">
            <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-pink-50 text-slate-800 flex items-center justify-center shrink-0 border border-pink-100">
                <Calendar size={22} className="text-slate-800" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Perkiraan Hari Lahir</span>
                <div className="text-base sm:text-lg font-extrabold text-[#E11D48] leading-tight mt-0.5">
                  20 Desember 2026
                </div>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                  (32 minggu lagi)
                </span>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Ilustrasi Ibu Hamil */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end">
            <img 
              src="/images/ibu-kehamilan-banner.png" 
              alt="Ilustrasi Ibu Hamil" 
              className="h-44 sm:h-52 object-contain drop-shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* 3 Sub-Kotak Informasi Bawah Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-pink-200/60">
          <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3.5 border border-white/80">
            <span className="text-[11px] text-slate-500 font-medium block">Hari Pertama Haid Terakhir</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 mt-1 block">15 Maret 2026</span>
          </div>

          <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3.5 border border-white/80">
            <span className="text-[11px] text-slate-500 font-medium block">Taksiran Persalinan</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 mt-1 block">20 Desember 2026</span>
          </div>

          <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3.5 border border-white/80">
            <span className="text-[11px] text-slate-500 font-medium block">Usia Kehamilan Saat Ini</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 mt-1 block">28 Minggu 3 hari</span>
          </div>
        </div>
      </div>

      {/* 3. 4 Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pemeriksaan Kehamilan */}
        <div 
          onClick={() => onNavigate && onNavigate('/kesehatan-ibu/pemeriksaan')}
          className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-200 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Stethoscope size={20} />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Pemeriksaan Kehamilan</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">5 dari 8 kali</span>
            </div>
          </div>
        </div>

        {/* Konsumsi TTD/MMS */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <HeartPulse size={20} />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Konsumsi TTD/MMS</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">23 / 28</span>
              <span className="text-[10px] text-slate-400">hari konsumsi bulan ini</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </div>

        {/* Jadwal Mendatang */}
        <div 
          onClick={() => onNavigate && onNavigate('/jadwal-saya')}
          className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-200 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Jadwal Mendatang</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">2</span>
              <span className="text-[10px] text-slate-400">Agenda berikutnya</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </div>

        {/* Berat Badan */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Weight size={20} />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Berat badan</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">62 kg</span>
              <span className="text-[10px] text-emerald-600 font-semibold">+8 kg</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </div>
      </div>

      {/* 4. Main Two Column Section: Perkembangan Kehamilan (Chart) & Konsumsi/Panduan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Perkembangan Kehamilan Line Chart (7 Col) */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Perkembangan Kehamilan</h3>
          </div>

          {/* SVG Line Chart */}
          <div className="pt-2 pb-4">
            <div className="relative w-full h-64 sm:h-72">
              <svg viewBox="0 0 500 240" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FB7185" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#FB7185" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Grid Lines Horisontal (100, 80, 60, 40, 20, 0) */}
                {[
                  { y: 20, val: 100 },
                  { y: 60, val: 80 },
                  { y: 100, val: 60 },
                  { y: 140, val: 40 },
                  { y: 180, val: 20 },
                  { y: 220, val: 0 },
                ].map((g, idx) => (
                  <g key={idx}>
                    <line x1="30" y1={g.y} x2="490" y2={g.y} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="5" y={g.y + 4} fill="#94A3B8" fontSize="10" fontFamily="sans-serif">{g.val}</text>
                  </g>
                ))}

                {/* Data Points:
                    Week 12: x=40,  val=54 kg -> y = 220 - (54/100)*200 = 112
                    Week 16: x=150, val=57 kg -> y = 220 - (57/100)*200 = 106
                    Week 20: x=260, val=59 kg -> y = 220 - (59/100)*200 = 102
                    Week 24: x=370, val=60 kg -> y = 220 - (60/100)*200 = 100
                    Week 28: x=480, val=62 kg -> y = 220 - (62/100)*200 = 96
                */}
                {/* Area under curve */}
                <path
                  d="M 40 112 L 150 106 L 260 102 L 370 100 L 480 96 L 480 220 L 40 220 Z"
                  fill="url(#pinkGradient)"
                />

                {/* Line Path */}
                <path
                  d="M 40 112 L 150 106 L 260 102 L 370 100 L 480 96"
                  fill="none"
                  stroke="#FB7185"
                  strokeWidth="2.5"
                />

                {/* Data Points circles */}
                {[
                  { x: 40, y: 112, label: '12', val: '54 kg' },
                  { x: 150, y: 106, label: '16', val: '57 kg' },
                  { x: 260, y: 102, label: '20', val: '59 kg' },
                  { x: 370, y: 100, label: '24', val: '60 kg' },
                  { x: 480, y: 96, label: '28', val: '62 kg' },
                ].map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="4.5" fill="#FFFFFF" stroke="#E11D48" strokeWidth="2.5" />
                    <text x={pt.x} y="235" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="sans-serif">
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs font-semibold text-slate-700">
              <span className="w-3 h-3 rounded-full bg-[#FB7185] border-2 border-[#E11D48] inline-block" />
              <span>Berat Badan</span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Konsumsi TTD/MMS & Panduan untuk Ibu (5 Col) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Box Konsumsi TTD/MMS */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Konsumsi TTD/MMS</h3>

            {/* Donut Chart and Stats */}
            <div className="flex items-center gap-6">
              {/* SVG Donut */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle (Belum diminum - 5 hari) */}
                  <path
                    className="text-slate-200"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Progress Circle (Sudah diminum - 23/28 = 82%) */}
                  <path
                    className="text-[#E11D48]"
                    strokeDasharray="82, 100"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>

              {/* Legend List */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
                    <span className="text-slate-600">Sudah diminum</span>
                  </div>
                  <span className="font-bold text-slate-900">23 hari</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span className="text-slate-600">Belum diminum</span>
                  </div>
                  <span className="font-bold text-slate-900">5 hari</span>
                </div>
              </div>
            </div>

            {/* Info Blue Box */}
            <div className="bg-[#EFF6FF] border border-[#BFDBFE]/70 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-[#1E40AF]">
              <Info size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Tablet Tambah Darah (TTD) dilanjutkan diminum setiap hari selama kehamilan, minimal 90 tablet (3 bulan) sesuai buku KIA
              </p>
            </div>
          </div>

          {/* Box Panduan untuk Ibu */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Panduan untuk Ibu</h3>
              <button 
                type="button"
                onClick={() => setSelectedPanduan(panduanList[0])}
                className="text-xs font-semibold text-[#E11D48] hover:text-[#BE185D] cursor-pointer"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-2.5">
              {panduanList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPanduan(item)}
                  className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-100/80 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                      <FileText size={16} />
                    </div>
                    <span className="text-xs font-medium text-slate-800 group-hover:text-[#E11D48] transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <ChevronRight size={15} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Panduan Ibu */}
      {selectedPanduan && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900">{selectedPanduan.title}</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedPanduan(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-4 leading-relaxed">
              {selectedPanduan.desc}
            </p>

            <div className="mt-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-800">Poin Penting Buku KIA:</h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {selectedPanduan.points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#E11D48] font-bold mt-0.5">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPanduan(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
