import React from 'react';
import { 
  Edit2, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Check, 
  Scale, 
  Ruler, 
  Pill, 
  Syringe, 
  Heart, 
  HeartPulse, 
  FileText 
} from 'lucide-react';

export default function Step4Konfirmasi({
  peserta,
  kunjunganData = {},
  selectedPelayanan = [],
  statusKehadiran = 'Hadir',
  catatan = '',
  onGoToStep,
  onBack,
  onSubmit,
  loading
}) {
  const formatMasked = (val) => {
    if (!val) return '-';
    const str = String(val).trim();
    const clean = str.replace(/\D/g, '');
    if (clean.length >= 10) {
      const prefix = clean.slice(0, 4);
      const suffix = clean.slice(-4);
      return `${prefix}••••••••${suffix}`;
    }
    return str;
  };

  const getLayananIcon = (name) => {
    switch (name) {
      case 'Penimbangan':
        return <Scale size={18} className="text-[#2563EB]" />;
      case 'Pengukuran Tinggi Badan':
        return <Ruler size={18} className="text-[#7C3AED]" />;
      case 'Pemberian Vitamin':
        return <Pill size={18} className="text-[#E11D48]" />;
      case 'Imunisasi':
        return <Syringe size={18} className="text-[#059669]" />;
      case 'Pemeriksaan Kehamilan':
        return <Heart size={18} className="text-[#E11D48]" />;
      case 'Pemeriksaan Lansia':
        return <HeartPulse size={18} className="text-[#A21CAF]" />;
      default:
        return <FileText size={18} className="text-slate-500" />;
    }
  };

  const getLayananDesc = (name) => {
    switch (name) {
      case 'Penimbangan':
        return 'Berat badan dan panjang badan';
      case 'Pengukuran Tinggi Badan':
        return 'Tinggi badan dalam sentimeter';
      case 'Pemberian Vitamin':
        return 'Vitamin A dan suplemen';
      case 'Imunisasi':
        return 'Pemberian imunisasi dasar';
      case 'Pemeriksaan Kehamilan':
        return 'Tekanan darah, tinggi fundus, DJJ';
      case 'Pemeriksaan Lansia':
        return 'Pemeriksaan kesehatan lansia';
      default:
        return 'Pelayanan kesehatan Posyandu';
    }
  };

  const getLayananCardStyle = (name) => {
    switch (name) {
      case 'Penimbangan':
        return {
          bg: 'bg-[#EFF6FF] border-[#BFDBFE]',
          iconText: 'text-[#2563EB]'
        };
      case 'Pengukuran Tinggi Badan':
        return {
          bg: 'bg-[#F5F3FF] border-[#DDD6FE]',
          iconText: 'text-[#7C3AED]'
        };
      case 'Pemberian Vitamin':
        return {
          bg: 'bg-[#FFF1F2] border-[#FECDD3]',
          iconText: 'text-[#E11D48]'
        };
      case 'Imunisasi':
        return {
          bg: 'bg-[#ECFDF5] border-[#A7F3D0]',
          iconText: 'text-[#059669]'
        };
      case 'Pemeriksaan Kehamilan':
        return {
          bg: 'bg-[#FFF1F2] border-[#FECDD3]',
          iconText: 'text-[#E11D48]'
        };
      case 'Pemeriksaan Lansia':
        return {
          bg: 'bg-[#FDF4FF] border-[#F5D0FE]',
          iconText: 'text-[#A21CAF]'
        };
      default:
        return {
          bg: 'bg-slate-50 border-slate-200',
          iconText: 'text-slate-600'
        };
    }
  };

  const getPesertaAvatar = () => {
    const jenis = peserta?.jenis_peserta || 'Ibu Hamil';
    if (jenis === 'Ibu Hamil') {
      return {
        bg: 'bg-[#FFF1F2] text-[#E11D48]',
        badgeColor: 'text-[#E11D48]',
        icon: <Heart size={22} className="text-[#E11D48]" />
      };
    }
    if (jenis === 'Bayi' || jenis === 'Balita') {
      return {
        bg: 'bg-[#EFF6FF] text-[#2563EB]',
        badgeColor: 'text-[#2563EB]',
        icon: <User size={22} className="text-[#2563EB]" />
      };
    }
    if (jenis === 'Lansia') {
      return {
        bg: 'bg-[#FDF4FF] text-[#A21CAF]',
        badgeColor: 'text-[#A21CAF]',
        icon: <HeartPulse size={22} className="text-[#A21CAF]" />
      };
    }
    return {
      bg: 'bg-[#ECFDF5] text-[#059669]',
      badgeColor: 'text-[#059669]',
      icon: <User size={22} className="text-[#059669]" />
    };
  };

  const avatarInfo = getPesertaAvatar();

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-7">
      {/* Title */}
      <div>
        <h3 className="text-base font-bold text-slate-900">Konfirmasi Data Registrasi Kunjungan</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Pastikan semua informasi sudah sesuai. Anda masih dapat kembali untuk mengubah data.
        </p>
      </div>

      {/* 1. Data Peserta Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900">Data Peserta</h4>
          <button
            type="button"
            onClick={() => onGoToStep(1)}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Edit2 size={13} />
            <span>Ubah</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-1">
          {/* Kolom Kiri: Avatar + Nama & Kategori */}
          <div className="md:col-span-4 flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${avatarInfo.bg}`}>
              {avatarInfo.icon}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                {peserta?.nama || 'Siti Aminah'}
              </div>
              <div className={`text-xs font-semibold ${avatarInfo.badgeColor} mt-0.5`}>
                {peserta?.jenis_peserta || 'Ibu Hamil'}
              </div>
            </div>
          </div>

          {/* Kolom Tengah: NIK, Tanggal Lahir, Alamat */}
          <div className="md:col-span-4 space-y-2.5">
            <div>
              <span className="text-[11px] text-slate-400 block font-normal">NIK</span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block tracking-wide">
                {formatMasked(peserta?.nik) || '3273••••••••0041'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-normal">Tanggal Lahir</span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                {peserta?.tanggal_lahir || '12 Mei 1994'} {peserta?.usia ? `(${peserta.usia})` : '(32 tahun)'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-normal">Alamat</span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                {peserta?.alamat || 'Dusun 3, Desa Manud Jaya'}
              </span>
            </div>
          </div>

          {/* Kolom Kanan: No. KK, No. HP */}
          <div className="md:col-span-4 space-y-2.5">
            <div>
              <span className="text-[11px] text-slate-400 block font-normal">No. KK</span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block tracking-wide">
                {formatMasked(peserta?.no_kk) || '3273••••••••1099'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-normal">No. HP</span>
              <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                {peserta?.telepon || peserta?.no_wa || '0812-3456-7890'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Grid Informasi Kunjungan & Status Kehadiran (Sesuai Gambar 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
        {/* Kolom Kiri: Informasi Kunjungan */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900">Informasi Kunjungan</h4>
            <button
              type="button"
              onClick={() => onGoToStep(1)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 size={13} />
              <span>Ubah</span>
            </button>
          </div>

          <div className="space-y-3.5 pt-1">
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-slate-400 block">Tanggal Kunjungan</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">
                  {kunjunganData?.tanggal || '27 September 2026'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-slate-400 block">Jam Kunjungan</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">
                  {kunjunganData?.jam || '08:30'} WIB
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-slate-400 block">Posyandu</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">
                  {kunjunganData?.posyandu || 'Posyandu Desa Manud Jaya'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-slate-400 block">Kader Pencatat</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">
                  {kunjunganData?.kaderPencatat || 'Siti Rahma'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Status Kehadiran (dengan border pemisah di kiri) */}
        <div className="space-y-4 md:border-l md:border-slate-100 md:pl-8">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900">Status Kehadiran</h4>
            <button
              type="button"
              onClick={() => onGoToStep(3)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 size={13} />
              <span>Ubah</span>
            </button>
          </div>

          <div className="pt-1 space-y-3">
            <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl flex items-center gap-3.5">
              <div className="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
                <Check size={16} strokeWidth={3} />
              </div>
              <div>
                <div className="font-bold text-sm text-[#166534]">{statusKehadiran || 'Hadir'}</div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {statusKehadiran === 'Hadir' 
                    ? 'Peserta datang ke Posyandu dan mendapatkan pelayanan.'
                    : statusKehadiran === 'Izin'
                    ? 'Peserta berhalangan hadir dengan pemberitahuan sebelumnya.'
                    : statusKehadiran === 'Sakit'
                    ? 'Peserta tidak dapat hadir karena kondisi kesehatan.'
                    : 'Peserta tidak hadir tanpa konfirmasi atau keterangan.'}
                </p>
              </div>
            </div>

            <div className="pt-1">
              <span className="text-[11px] text-slate-400 block">Catatan</span>
              <span className="text-xs font-bold text-slate-900 block mt-0.5">
                {catatan || '-'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Jenis Pelayanan yang Dipilih */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900">Jenis Pelayanan yang Dipilih</h4>
          <button
            type="button"
            onClick={() => onGoToStep(2)}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Edit2 size={13} />
            <span>Ubah</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          {selectedPelayanan.map((layanan, i) => {
            const style = getLayananCardStyle(layanan);
            return (
              <div key={i} className={`p-3.5 rounded-2xl border flex items-center gap-3.5 ${style.bg}`}>
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-2xs">
                  {getLayananIcon(layanan)}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate">{layanan}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">{getLayananDesc(layanan)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Action Buttons */}
      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer transition-all inline-flex items-center gap-1.5"
        >
          <span>←</span>
          <span>Kembali ke Status Kehadiran</span>
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={onSubmit}
          className="px-6 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 rounded-xl shadow-xs inline-flex items-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
        >
          {loading ? 'Menyimpan...' : (
            <>
              <span>Simpan Registrasi Kunjungan</span>
              <Check size={16} strokeWidth={3} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
