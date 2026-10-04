import React from 'react';
import { 
  User, 
  Edit2, 
  Calendar, 
  Clock, 
  MapPin, 
  Check, 
  Scale, 
  Ruler, 
  Pill, 
  Syringe, 
  Smile, 
  HeartPulse, 
  Heart, 
  FileText 
} from 'lucide-react';
import { maskNik } from '../../../utils/nikUtils';

export default function Step4Konfirmasi({
  peserta,
  kunjunganData,
  selectedPelayanan = [],
  statusKehadiran,
  catatan,
  onGoToStep,
  onBack,
  onSubmit,
  loading
}) {
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
        return <Smile size={18} className="text-[#E11D48]" />;
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
      default:
        return 'Pelayanan kesehatan posyandu';
    }
  };

  const getLayananBg = (name) => {
    switch (name) {
      case 'Penimbangan':
        return 'bg-[#EFF6FF] border-[#BFDBFE]';
      case 'Pengukuran Tinggi Badan':
        return 'bg-[#F5F3FF] border-[#DDD6FE]';
      case 'Pemberian Vitamin':
        return 'bg-[#FFF1F2] border-[#FECDD3]';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Konfirmasi Data Registrasi Kunjungan</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Pastikan semua informasi sudah sesuai. Anda masih dapat kembali untuk mengubah data.
        </p>
      </div>

      {/* 1. Ringkasan Data Peserta Sesuai Figma */}
      <div className="border border-slate-100 rounded-2xl p-5 bg-[#F8FAFC]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-800">Data Peserta</h4>
          <button
            type="button"
            onClick={() => onGoToStep(1)}
            className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <Edit2 size={12} /> Ubah
          </button>
        </div>

        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center font-bold shrink-0">
            <User size={26} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-6 flex-1 text-xs">
            <div>
              <div className="font-bold text-slate-900 text-sm">{peserta?.nama || 'Siti Aminah'}</div>
              <span className="text-[10px] font-bold text-[#F43F5E] bg-[#FFF1F2] px-2 py-0.5 rounded border border-[#FFE4E6] mt-1 inline-block">
                {peserta?.jenis_peserta || 'Ibu Hamil'}
              </span>
            </div>
            <div className="text-slate-500 space-y-1">
              <div>
                <span className="text-[10px] text-slate-400 block">NIK</span>
                <strong className="text-slate-800 font-mono font-medium">{peserta?.nik ? maskNik(peserta.nik) : '3273••••••••0041'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Tanggal Lahir</span>
                <strong className="text-slate-800">{peserta?.tanggal_lahir || '12 Mei 1994'} ({peserta?.usia || '32 tahun'})</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Alamat</span>
                <strong className="text-slate-800">{peserta?.alamat || 'Dusun 3, Desa Manud Jaya'}</strong>
              </div>
            </div>
            <div className="text-slate-500 space-y-1">
              <div>
                <span className="text-[10px] text-slate-400 block">No. KK</span>
                <strong className="text-slate-800">{peserta?.no_kk || '3273••••••••1099'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">No. HP</span>
                <strong className="text-slate-800">{peserta?.telepon || '0812-3456-7890'}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Grid Informasi Kunjungan & Status Kehadiran Sesuai Figma */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Informasi Kunjungan */}
        <div className="border border-slate-100 rounded-2xl p-5 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-900">Informasi Kunjungan</h4>
            <button
              type="button"
              onClick={() => onGoToStep(1)}
              className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Edit2 size={12} /> Ubah
            </button>
          </div>
          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Calendar size={15} className="text-slate-400 shrink-0" />
              <span>Tanggal Kunjungan: <strong className="text-slate-900">{kunjunganData.tanggal}</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock size={15} className="text-slate-400 shrink-0" />
              <span>Jam Kunjungan: <strong className="text-slate-900">{kunjunganData.jam} WIB</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin size={15} className="text-slate-400 shrink-0" />
              <span>Posyandu: <strong className="text-slate-900">{kunjunganData.posyandu}</strong></span>
            </div>
            <div className="flex items-center gap-2.5">
              <User size={15} className="text-slate-400 shrink-0" />
              <span>Kader Pencatat: <strong className="text-slate-900">{kunjunganData.kaderPencatat || 'Siti Rahma'}</strong></span>
            </div>
          </div>
        </div>

        {/* Status Kehadiran Card */}
        <div className="border border-slate-100 rounded-2xl p-5 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-900">Status Kehadiran</h4>
              <button
                type="button"
                onClick={() => onGoToStep(3)}
                className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Edit2 size={12} /> Ubah
              </button>
            </div>
            <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
                <Check size={16} strokeWidth={3} />
              </div>
              <div>
                <div className="font-bold text-xs text-[#065F46]">{statusKehadiran}</div>
                <p className="text-[11px] text-[#047857]">Peserta datang ke Posyandu dan mendapatkan pelayanan.</p>
              </div>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-100 pt-2">
            Catatan: <span className="text-slate-700 font-medium">{catatan || '-'}</span>
          </div>
        </div>
      </div>

      {/* 3. Ringkasan Jenis Pelayanan Terpilih Sesuai Figma Cards */}
      <div className="border border-slate-100 rounded-2xl p-5 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-900">Jenis Pelayanan yang Dipilih</h4>
          <button
            type="button"
            onClick={() => onGoToStep(2)}
            className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <Edit2 size={12} /> Ubah
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {selectedPelayanan.map((layanan, i) => (
            <div key={i} className={`p-3.5 rounded-2xl border flex items-center gap-3 ${getLayananBg(layanan)}`}>
              <div className="shrink-0">
                {getLayananIcon(layanan)}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-slate-900 truncate">{layanan}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate">{getLayananDesc(layanan)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Button Sesuai Figma (Issue #24: Biru dengan Check Icon) */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer"
        >
          ← Kembali ke Status Kehadiran
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
