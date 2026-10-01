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
  BookOpen
} from 'lucide-react';

export default function DetailKunjunganModal({ kunjungan, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('Informasi Kunjungan');

  if (!isOpen || !kunjungan) return null;

  const handlePrint = () => {
    window.print();
  };

  const isIbuHamil = kunjungan.jenis_peserta === 'Ibu Hamil';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Detail Kunjungan
          </h2>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Patient Profile Card Header */}
        <div className="px-6 py-3 flex items-start justify-between gap-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
              isIbuHamil ? 'bg-pink-50 text-pink-500' : 'bg-emerald-50 text-emerald-500'
            }`}>
              <User size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm sm:text-base">
                  {kunjungan.nama}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  isIbuHamil 
                    ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                }`}>
                  {kunjungan.jenis_peserta}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                <span>NIK: <span className="text-slate-700 font-mono font-medium">{kunjungan.nik_lengkap || kunjungan.nik}</span></span>
                <span>No. Registrasi: <span className="text-slate-700 font-mono font-medium">{kunjungan.no_registrasi}</span></span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-[11px] text-slate-400">Status Kunjungan</div>
            <div className="text-xs font-bold text-emerald-600 mt-0.5">
              {kunjungan.status_lengkap || 'Selesai Dilayani'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              No. Antrean <span className="font-semibold text-slate-700">{kunjungan.no_antrean}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 pt-2">
          <button 
            type="button"
            onClick={() => setActiveTab('Informasi Kunjungan')}
            className={`pb-2.5 text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === 'Informasi Kunjungan' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Informasi Kunjungan
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('Lampiran')}
            className={`ml-6 pb-2.5 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'Lampiran' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Lampiran
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {activeTab === 'Lampiran' ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <FileText size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-600">Tidak ada lampiran berkas fisik</p>
              <p className="text-[11px] text-slate-400 mt-1">Seluruh data pemeriksaan tersimpan secara digital di sistem Posyandu.</p>
            </div>
          ) : (
            <>
              {/* Section 1: Informasi Kunjungan */}
              <div className="border border-slate-200/90 rounded-2xl p-4 bg-white shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">
                  <FileText size={15} className="text-blue-600" />
                  <span>Informasi Kunjungan</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Calendar size={15} />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">Tanggal Kunjungan</div>
                      <div className="font-semibold text-slate-800">{kunjungan.tanggal_kunjungan_lengkap || kunjungan.tanggal_kunjungan}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Clock size={15} />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">Waktu</div>
                      <div className="font-semibold text-slate-800">{kunjungan.waktu}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Hash size={15} />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">No. Antrean</div>
                      <div className="font-semibold text-slate-800">{kunjungan.no_antrean}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <MapPin size={15} />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">Tempat</div>
                      <div className="font-semibold text-slate-800">{kunjungan.tempat}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <Stethoscope size={15} />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">Jenis Layanan</div>
                      <div className="font-semibold text-slate-800">{kunjungan.jenis_peserta}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <UserCheck size={15} />
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400">Status Kehadiran</div>
                      <div className="font-semibold text-slate-800">{kunjungan.status_kehadiran}</div>
                    </div>
                  </div>
                </div>

                {kunjungan.petugas && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                    <User size={13} className="text-slate-400" />
                    <span>Petugas pemeriksa: <span className="font-semibold text-slate-700">{kunjungan.petugas}</span></span>
                  </div>
                )}
              </div>

              {/* Section 2: Hasil Pemeriksaan */}
              <div className="border border-slate-200/90 rounded-2xl p-4 bg-white shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">
                  <Stethoscope size={15} className="text-blue-600" />
                  <span>Hasil Pemeriksaan</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div className="flex items-center gap-2 bg-slate-50/70 p-2 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-blue-100/60 text-blue-600 flex items-center justify-center shrink-0">
                      <Scale size={15} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Berat Badan</div>
                      <div className="font-bold text-slate-900">{kunjungan.hasil_pemeriksaan?.berat_badan || '-'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50/70 p-2 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-purple-100/60 text-purple-600 flex items-center justify-center shrink-0">
                      <Ruler size={15} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Tinggi Badan</div>
                      <div className="font-bold text-slate-900">{kunjungan.hasil_pemeriksaan?.tinggi_badan || '-'}</div>
                    </div>
                  </div>

                  {kunjungan.hasil_pemeriksaan?.tekanan_darah && (
                    <div className="flex items-center gap-2 bg-slate-50/70 p-2 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-rose-100/60 text-rose-600 flex items-center justify-center shrink-0">
                        <HeartPulse size={15} />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Tekanan Darah</div>
                        <div className="font-bold text-rose-600">{kunjungan.hasil_pemeriksaan.tekanan_darah}</div>
                      </div>
                    </div>
                  )}

                  {kunjungan.hasil_pemeriksaan?.lingkar_lengan && (
                    <div className="flex items-center gap-2 bg-slate-50/70 p-2 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-amber-100/60 text-amber-600 flex items-center justify-center shrink-0">
                        <Activity size={15} />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Lingkar Lengan</div>
                        <div className="font-bold text-slate-900">{kunjungan.hasil_pemeriksaan.lingkar_lengan}</div>
                      </div>
                    </div>
                  )}

                  {kunjungan.hasil_pemeriksaan?.usia_kehamilan && (
                    <div className="flex items-center gap-2 bg-slate-50/70 p-2 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-cyan-100/60 text-cyan-600 flex items-center justify-center shrink-0">
                        <Calendar size={15} />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Usia Kehamilan</div>
                        <div className="font-bold text-slate-900">{kunjungan.hasil_pemeriksaan.usia_kehamilan}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Layanan Tambahan */}
              <div className="border border-slate-200/90 rounded-2xl p-4 bg-white shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">
                  <Pill size={15} className="text-blue-600" />
                  <span>Layanan Tambahan</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-2.5 bg-slate-50/60 p-2 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-rose-100/60 text-rose-500 flex items-center justify-center shrink-0">
                      <Pill size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Pemberian Tablet Fe</div>
                      <div className="font-bold text-slate-900">{kunjungan.layanan_tambahan?.tablet_fe || '62 kg'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 bg-slate-50/60 p-2 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100/60 text-indigo-500 flex items-center justify-center shrink-0">
                      <Utensils size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Konseling Gizi</div>
                      <div className="font-bold text-slate-900">{kunjungan.layanan_tambahan?.konseling_gizi || 'Pola makan'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 bg-slate-50/60 p-2 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-blue-100/60 text-blue-500 flex items-center justify-center shrink-0">
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Edukasi</div>
                      <div className="font-bold text-slate-900">{kunjungan.layanan_tambahan?.edukasi || 'Tanda Bahaya Kehamilan'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Catatan Pemeriksaan */}
              <div className="border border-slate-200/90 rounded-2xl p-4 bg-white shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                  <FileText size={15} className="text-blue-600" />
                  <span>Catatan Pemeriksaan</span>
                </div>
                <div className="bg-blue-50/40 border border-blue-100/60 rounded-xl p-3 text-xs leading-relaxed text-slate-700">
                  <div className="font-bold text-slate-900 mb-1">
                    Kondisi ibu dan janin baik. Tidak ada keluhan.
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    {kunjungan.catatan_pemeriksaan}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 inline-flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer size={14} />
            <span>Cetak Detail</span>
          </button>
        </div>
      </div>
    </div>
  );
}
