import React from 'react';
import { 
  User, 
  Calendar, 
  Baby, 
  Building2, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';

export default function PersalinanView({ onNavigate, onShowToast }) {
  const persiapanList = [
    { label: 'Kartu Identitas', status: 'Sudah' },
    { label: 'Buku KIA', status: 'Sudah' },
    { label: 'BPJS / Kartu Jaminan Kesehatan', status: 'Sudah' },
    { label: 'Pakaian Ibu dan Bayi', status: 'Belum' },
    { label: 'Perlengkapan Ibu', status: 'Belum' },
    { label: 'Dana Darurat', status: 'Belum' },
    { label: 'Kontak Darurat', status: 'Belum' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Halaman */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Kesehatan Ibu / Persalinan
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Pantau riwayat pemeriksaan kehamilan dan kondisi ibu secara menyeluruh
        </p>
      </div>

      {/* 2. Top Card: Profil Pasien */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 flex-1">
          {/* Avatar Pasien */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-200 border-2 border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
            <img 
              src="/images/siti-aminah-avatar.png" 
              alt="Siti Aminah" 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          {/* Info Pasien */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs flex-1">
            <div className="space-y-1.5">
              <h2 className="text-base font-bold text-slate-900">Siti Aminah</h2>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-28 text-slate-400">Nama</span>
                <span className="font-medium text-slate-800">Siti Aminah</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-28 text-slate-400">NIK</span>
                <span className="font-medium text-slate-800">293920102029029</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-28 text-slate-400">No Rekam Medis</span>
                <span className="font-medium text-slate-800">293920102029029</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-28 text-slate-400">Usia</span>
                <span className="font-medium text-slate-800">27 Tahun</span>
              </div>
            </div>

            <div className="space-y-1.5 sm:pt-6">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-32 text-slate-400">Usia Kehamilan</span>
                <span className="font-medium text-slate-800">28 Minggu 3 hari</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-32 text-slate-400">HPHT</span>
                <span className="font-medium text-slate-800">12 Februari 2026</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-32 text-slate-400">Taksiran Persalinan</span>
                <span className="font-medium text-slate-800">20 Desember 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Lihat Profil */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => onShowToast && onShowToast('Membuka profil lengkap pasien...', 'info')}
            className="px-4 py-2 bg-[#F1E8FB] hover:bg-[#E7D6FA] text-[#7E22CE] rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Lihat Profil</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* 3. 4 Kartu Metrik Persalinan */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
            <User size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Status Persalinan</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Belum Melahirkan</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
            <Calendar size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Taksiran Persalinan</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">20 Des 2026</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
            <Baby size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Usia Kehamilan</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">28 Minggu 3 Hari</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
            <Building2 size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Rencana Tempat Persalinan</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Puskesmas Manud Jaya</span>
          </div>
        </div>
      </div>

      {/* 4. Baris Tengah: Rencana Persalinan & Persiapan Persalinan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Rencana Persalinan */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Rencana Pesalinan</h3>
          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-50">
              <span className="text-slate-400">Jenis Persalinan</span>
              <span className="font-semibold text-slate-800">Persalinan normal</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-50">
              <span className="text-slate-400">Tempat Persalinan</span>
              <span className="font-semibold text-slate-800">Puskesmas Manud Jaya</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-50">
              <span className="text-slate-400">Penolong Persalinan</span>
              <span className="font-semibold text-slate-800">Bidan Siti Nurhayati</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-50">
              <span className="text-slate-400">Pendamping</span>
              <span className="font-semibold text-slate-800">Suami</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-50">
              <span className="text-slate-400">Transportasi</span>
              <span className="font-semibold text-slate-800">Mobil Pribadi</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Rujukan jika diperlukan</span>
              <span className="font-semibold text-slate-800">RSUD Begawan</span>
            </div>
          </div>
        </div>

        {/* Persiapan Persalinan */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Persiapan Persalinan</h3>
          <div className="space-y-2.5 text-xs">
            {persiapanList.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between pb-2 border-b border-slate-50 last:border-none">
                <span className="text-slate-600 font-medium">{item.label}</span>
                {item.status === 'Sudah' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D]">
                    Sudah
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs font-medium">
                    Belum
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Baris Bawah: Tanda Bahaya & Catatan Tindak Lanjut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Tanda Bahaya Menjelang Persalinan */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Tanda Bahaya Menjelang Persalinan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-slate-700">
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Kontraksi teratur dan semakin sering</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Ketuban pecah</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Perdarahan dari jalan lahir</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Gerakan Janin berkurang</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Nyeri perut hebat tidak bisa hilang</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Demam tinggi</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Pusing hebat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Catatan dan Tindak Lanjut */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Catatan dan Tindak Lanjut</h3>
          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <span>Lanjutkan kontrol sesuai jadwal</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <span>Pastikan semua persiapan persalinan sudah lengkap</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <span>Segera ke puskesmas jika ada tanda bahaya</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <span>Jaga kondisi kesehatan ibu dan janin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
