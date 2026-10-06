import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Hash, 
  MapPin, 
  Stethoscope, 
  UserCheck, 
  User, 
  Printer, 
  Scale, 
  Ruler, 
  HeartPulse, 
  Activity, 
  FileText,
  Pill,
  Utensils,
  BookOpen,
  CheckCircle2,
  MessageSquare,
  Heart
} from 'lucide-react';
import { maskNik } from '../../../utils/nikUtils';

export default function DetailKunjunganModal({ kunjungan, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('Informasi Kunjungan');

  if (!isOpen || !kunjungan) return null;

  const handlePrint = () => {
    window.print();
  };

  const isIbuHamil = kunjungan.jenis_peserta === 'Ibu Hamil';
  const isBalita = kunjungan.jenis_peserta === 'Balita';
  const isBayi = kunjungan.jenis_peserta === 'Bayi';
  const isLansia = kunjungan.jenis_peserta === 'Lansia';

  const formatMasked = (val) => {
    if (!val) return '-';
    const str = String(val).trim();
    const clean = str.replace(/\D/g, '');
    if (clean.length >= 10) {
      const prefix = clean.slice(0, 6);
      const suffix = clean.slice(-4);
      return `${prefix}••••••${suffix}`;
    }
    return str;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible print:block">
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }
          html, body {
            height: auto !important;
            min-height: 100% !important;
            overflow: visible !important;
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden;
          }
          #detail-kunjungan-printable, #detail-kunjungan-printable * {
            visibility: visible;
          }
          #detail-kunjungan-printable {
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            border-radius: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #detail-kunjungan-body {
            max-height: none !important;
            height: auto !important;
            overflow: visible !important;
            padding: 12px 0 0 0 !important;
            scrollbar-width: none !important;
          }
          #detail-kunjungan-body::-webkit-scrollbar {
            display: none !important;
          }
          .print-avoid-break {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            margin-bottom: 12px !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div 
        id="detail-kunjungan-printable"
        className="relative w-full max-w-3xl lg:max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto print:shadow-none print:border-none print:rounded-none print:max-w-none print:w-full print:overflow-visible"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-7 pt-6 pb-2 no-print">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Detail Kunjungan
          </h2>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Patient Profile Card Header */}
        <div className="px-7 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:px-0 print:py-2">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 border ${
              isIbuHamil 
                ? 'bg-[#FFF1F2] border-[#FFE4E6] text-[#E11D48]' 
                : isBayi 
                ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]'
                : isLansia
                ? 'bg-[#FDF4FF] border-[#F5D0FE] text-[#A21CAF]'
                : 'bg-[#ECFDF5] border-[#BBF7D0] text-[#059669]'
            }`}>
              <User size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-slate-900 text-base sm:text-lg">
                  {kunjungan.nama}
                </span>
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                  isIbuHamil 
                    ? 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECDD3]' 
                    : isBalita
                    ? 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]'
                    : isBayi
                    ? 'bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE]'
                    : isLansia
                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                    : 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]'
                }`}>
                  {kunjungan.jenis_peserta}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-400 mt-1">
                <span>
                  NIK <span className="text-slate-800 font-mono font-bold ml-1">{formatMasked(kunjungan.nik_lengkap || kunjungan.nik)}</span>
                </span>
                <span>
                  No. Registrasi <span className="text-slate-800 font-mono font-bold ml-1">{kunjungan.no_registrasi}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <div className="text-[11px] text-slate-400 font-medium">Status Kunjungan</div>
            <div className="mt-1">
              <span className={`px-3 py-1 rounded-md text-xs font-semibold inline-block ${
                (kunjungan.status_kehadiran || kunjungan.status_lengkap || '').toLowerCase().includes('tidak')
                  ? 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECDD3]'
                  : (kunjungan.status_kehadiran || kunjungan.status_lengkap || '').toLowerCase().includes('tunggu')
                  ? 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]'
                  : 'bg-[#ECFDF3] text-[#12B76A] border border-[#A6F4C5]'
              }`}>
                {kunjungan.status_lengkap || kunjungan.status_kehadiran || 'Selesai Dilayani'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">
              No. Antrean <span className="font-semibold text-slate-700">{kunjungan.no_antrean}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-7 pt-1 no-print">
          <button 
            type="button"
            onClick={() => setActiveTab('Informasi Kunjungan')}
            className={`pb-3 text-xs sm:text-sm font-semibold transition-all relative cursor-pointer ${
              activeTab === 'Informasi Kunjungan' 
                ? 'text-blue-600 border-b-2 border-blue-600 font-bold' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Informasi Kunjungan
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('Lampiran')}
            className={`ml-6 pb-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'Lampiran' 
                ? 'text-blue-600 border-b-2 border-blue-600 font-bold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Lampiran
          </button>
        </div>

        {/* Body Content */}
        <div 
          id="detail-kunjungan-body"
          className="p-7 space-y-4 max-h-[70vh] overflow-y-auto print:max-h-none print:h-auto print:overflow-visible print:p-0 print:space-y-3"
        >
          {activeTab === 'Lampiran' ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <FileText size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-600">Tidak ada lampiran berkas fisik</p>
              <p className="text-[11px] text-slate-400 mt-1">Seluruh data pemeriksaan tersimpan secara digital di sistem Posyandu.</p>
            </div>
          ) : (
            <>
              {/* Section 1: Informasi Kunjungan */}
              <div className="border border-slate-100 rounded-2xl p-4 sm:p-5 bg-white shadow-xs print-avoid-break">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  <FileText size={15} className="text-blue-600" />
                  <span>Informasi Kunjungan</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs print:grid-cols-3">
                  {/* Tanggal Kunjungan */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                      <Calendar size={15} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Tanggal Kunjungan</div>
                      <div className="font-bold text-slate-900 mt-0.5">{kunjungan.tanggal_kunjungan_lengkap || kunjungan.tanggal_kunjungan || '27 September 2024'}</div>
                    </div>
                  </div>

                  {/* Waktu */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center shrink-0">
                      <Clock size={15} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Waktu</div>
                      <div className="font-bold text-slate-900 mt-0.5">{kunjungan.waktu || '09:30 WIB'}</div>
                    </div>
                  </div>

                  {/* No. Antrean */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center shrink-0">
                      <Hash size={15} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">No. Antrean</div>
                      <div className="font-bold text-slate-900 mt-0.5">{kunjungan.no_antrean || 'A-12'}</div>
                    </div>
                  </div>

                  {/* Tempat */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#F0F9FF] text-[#0284C7] flex items-center justify-center shrink-0">
                      <MapPin size={15} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Tempat</div>
                      <div className="font-bold text-slate-900 mt-0.5">{kunjungan.tempat || 'Posyandu Desa Manud Jaya'}</div>
                    </div>
                  </div>

                  {/* Jenis Layanan */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FFF1F2] text-[#E11D48] flex items-center justify-center shrink-0">
                      <Stethoscope size={15} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Jenis Layanan</div>
                      <div className="font-bold text-slate-900 mt-0.5">{kunjungan.jenis_peserta || 'Ibu Hamil'}</div>
                    </div>
                  </div>

                  {/* Status Kehadiran */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#F5F3FF] text-[#6366F1] flex items-center justify-center shrink-0">
                      <UserCheck size={15} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Status Kehadiran</div>
                      <div className="font-bold text-slate-900 mt-0.5">{kunjungan.status_kehadiran || 'Hadir'}</div>
                    </div>
                  </div>
                </div>

                {/* Banner Petugas Pemeriksa Sesuai Gambar 1 */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 bg-slate-50/70 border border-slate-100/90 rounded-xl px-3.5 py-2 text-xs text-slate-600">
                  <CheckCircle2 size={15} className="text-slate-400 shrink-0" />
                  <span>Petugas pemeriksa: <span className="font-bold text-slate-800">{kunjungan.petugas || 'Bidan Ratih Wulandari, A.Md.Keb'}</span></span>
                </div>
              </div>

              {/* Section 2: Hasil Pemeriksaan */}
              <div className="border border-slate-100 rounded-2xl p-4 sm:p-5 bg-white shadow-xs print-avoid-break">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
                  <CheckCircle2 size={15} className="text-blue-600" />
                  <span>Hasil Pemeriksaan</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs print:grid-cols-5">
                  {/* Berat Badan */}
                  <div className="flex items-center gap-2.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                      <Scale size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-400 truncate font-medium">Berat Badan</div>
                      <div className="font-bold text-slate-900 whitespace-nowrap mt-0.5">{kunjungan.hasil_pemeriksaan?.berat_badan || '62 kg'}</div>
                    </div>
                  </div>

                  {/* Tinggi Badan */}
                  <div className="flex items-center gap-2.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center shrink-0">
                      <Ruler size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-400 truncate font-medium">Tinggi Badan</div>
                      <div className="font-bold text-slate-900 whitespace-nowrap mt-0.5">{kunjungan.hasil_pemeriksaan?.tinggi_badan || '158 cm'}</div>
                    </div>
                  </div>

                  {/* Tekanan Darah */}
                  <div className="flex items-center gap-2.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-[#FFF1F2] text-[#E11D48] flex items-center justify-center shrink-0">
                      <HeartPulse size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-400 truncate font-medium">Tekanan Darah</div>
                      <div className="font-bold text-rose-600 whitespace-nowrap mt-0.5">{kunjungan.hasil_pemeriksaan?.tekanan_darah || '110/70 mmHg'}</div>
                    </div>
                  </div>

                  {/* Lingkar Lengan */}
                  <div className="flex items-center gap-2.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center shrink-0">
                      <Activity size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-400 truncate font-medium">Lingkar Lengan</div>
                      <div className="font-bold text-slate-900 whitespace-nowrap mt-0.5">{kunjungan.hasil_pemeriksaan?.lingkar_lengan || '28 cm'}</div>
                    </div>
                  </div>

                  {/* Usia Kehamilan */}
                  <div className="flex items-center gap-2.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-[#F0F9FF] text-[#0284C7] flex items-center justify-center shrink-0">
                      <Calendar size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-400 truncate font-medium">Usia Kehamilan</div>
                      <div className="font-bold text-slate-900 whitespace-nowrap mt-0.5">{kunjungan.hasil_pemeriksaan?.usia_kehamilan || '24 minggu'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Layanan Tambahan */}
              <div className="border border-slate-100 rounded-2xl p-4 sm:p-5 bg-white shadow-xs print-avoid-break">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
                  <CheckCircle2 size={15} className="text-blue-600" />
                  <span>Layanan Tambahan</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs print:grid-cols-3">
                  {/* Pemberian Tablet Fe */}
                  <div className="flex items-center gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF1F2] text-[#E11D48] flex items-center justify-center shrink-0">
                      <Pill size={17} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-400 font-medium">Pemberian Tablet Fe</div>
                      <div className="font-bold text-slate-900 whitespace-nowrap mt-0.5">{kunjungan.layanan_tambahan?.tablet_fe || '62 kg'}</div>
                    </div>
                  </div>

                  {/* Konseling Gizi */}
                  <div className="flex items-center gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center shrink-0">
                      <Utensils size={17} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-400 font-medium">Konseling Gizi</div>
                      <div className="font-bold text-slate-900 whitespace-nowrap mt-0.5">{kunjungan.layanan_tambahan?.konseling_gizi || 'Pola makan'}</div>
                    </div>
                  </div>

                  {/* Edukasi */}
                  <div className="flex items-center gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                      <BookOpen size={17} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-400 font-medium">Edukasi</div>
                      <div className="font-bold text-slate-900 whitespace-nowrap mt-0.5">{kunjungan.layanan_tambahan?.edukasi || 'Tanda Bahaya Kehamilan'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Catatan Pemeriksaan */}
              <div className="border border-slate-100 rounded-2xl p-4 sm:p-5 bg-white shadow-xs print-avoid-break">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-3">
                  <FileText size={15} className="text-blue-600" />
                  <span>Catatan Pemeriksaan</span>
                </div>
                <div className="bg-[#F0F7FF] border border-[#BFDBFE]/60 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-100/70 text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare size={14} />
                  </div>
                  <div className="text-xs leading-relaxed">
                    <div className="font-bold text-slate-900">
                      Kondisi ibu dan janin baik. Tidak ada keluhan.
                    </div>
                    <div className="text-slate-600 text-[11px] mt-1">
                      {kunjungan.catatan_pemeriksaan || 'Disarankan istirahat cukup, konsumsi tablet tambah darah, dan kontrol kembali sesuai jadwal.'}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-7 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer size={15} />
            <span>Cetak Detail</span>
          </button>
        </div>
      </div>
    </div>
  );
}
