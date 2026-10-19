import React, { useState } from 'react';
import { 
  Stethoscope, 
  Syringe, 
  User, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  X,
  MapPin,
  Clock
} from 'lucide-react';

export default function JadwalSayaView({ onNavigate, onShowToast }) {
  const [selectedDate, setSelectedDate] = useState(15);
  const [selectedJadwal, setSelectedJadwal] = useState(null);

  const jadwalList = [
    { no: 1, tanggal: '12 Sep 2026', waktu: '09:00 - 10:00', jenis: 'Pemeriksaan Kehamilan ANC', lokasi: 'Puskesmas Manud Jaya', status: 'Akan Datang', petugas: 'Bidan Siti Nurhayati', keterangan: 'Pemeriksaan ANC Trimester 3 rutin dan USG dasar.' },
    { no: 2, tanggal: '17 Sep 2026', waktu: '09:00 - 10:00', jenis: 'Konseling Gizi', lokasi: 'Puskesmas Manud Jaya', status: 'Akan Datang', petugas: 'Ahli Gizi Puskesmas', keterangan: 'Evaluasi pola makan, asupan zat besi, dan pencegahan anemia.' },
    { no: 3, tanggal: '24 Sep 2026', waktu: '09:00 - 10:00', jenis: 'Pemeriksaan Kehamilan ANC', lokasi: 'Puskesmas Manud Jaya', status: 'Akan Datang', petugas: 'dr. Haryono, Sp.OG', keterangan: 'Kontrol berkala pemantauan posisi janin dan DJJ.' },
    { no: 4, tanggal: '10 Okt 2026', waktu: '09:00 - 10:00', jenis: 'Kelas Ibu Hamil', lokasi: 'Puskesmas Manud Jaya', status: 'Akan Datang', petugas: 'Bidan Koordinator', keterangan: 'Edukasi persiapan persalinan, senam hamil, dan IMD.' },
  ];

  const calendarDays = [
    { day: 31, isPrev: true },
    { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 }, { day: 6 },
    { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12, hasEvent: true }, { day: 13 },
    { day: 14 }, { day: 15, isCurrent: true }, { day: 16 }, { day: 17, hasEvent: true }, { day: 18 }, { day: 19 }, { day: 20 },
    { day: 21 }, { day: 22 }, { day: 23 }, { day: 24, hasEvent: true }, { day: 25 }, { day: 26 }, { day: 27 },
    { day: 28 }, { day: 29 }, { day: 30 },
    { day: 1, isNext: true }, { day: 2, isNext: true }, { day: 3, isNext: true }, { day: 4, isNext: true }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Halaman */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Jadwal Saya
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Lihat dan kelola semua jadwal pemeriksaan, konseling, imunisasi dan kegiatan lainnya
        </p>
      </div>

      {/* 2. 4 Kartu Metrik Jadwal */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Pemeriksaan */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center shrink-0">
            <Stethoscope size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Jadwal Pemeriksaan</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 leading-tight">3</span>
          </div>
        </div>

        {/* Metric 2: Imunisasi */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center shrink-0">
            <Syringe size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Jadwal Imunisasi</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 leading-tight">0</span>
          </div>
        </div>

        {/* Metric 3: Konseling */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center shrink-0">
            <User size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Jadwal Konseling</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 leading-tight">1</span>
          </div>
        </div>

        {/* Metric 4: Kelas Ibu Hamil */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center shrink-0">
            <BookOpen size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Kelas Ibu Hamil</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 leading-tight">2</span>
          </div>
        </div>
      </div>

      {/* 3. Baris Tengah: Kalender September 2026 & Jadwal Terdekat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Kalender */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <button 
              type="button" 
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <h3 className="text-sm font-bold text-slate-900">September 2026</h3>
            <button 
              type="button" 
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Hari dalam seminggu */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400 pb-1 border-b border-slate-50">
            <span>Min</span>
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
            <span>Sab</span>
          </div>

          {/* Grid Tanggal */}
          <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-xs">
            {calendarDays.map((item, idx) => {
              const isSelected = item.day === selectedDate && !item.isPrev && !item.isNext;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (!item.isPrev && !item.isNext) {
                      setSelectedDate(item.day);
                    }
                  }}
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-all cursor-pointer font-medium relative ${
                    item.isPrev || item.isNext
                      ? 'text-slate-300'
                      : isSelected
                      ? 'bg-[#1E3A8A] text-white font-bold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.day}</span>
                  {item.hasEvent && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#E11D48]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Jadwal Terdekat */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Jadwal Terdekat</h3>
          <div className="space-y-3">
            {/* Item 1 */}
            <div 
              onClick={() => setSelectedJadwal(jadwalList[0])}
              className="p-3.5 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] border border-indigo-100 flex flex-col items-center justify-center text-[#4F46E5] shrink-0 font-bold leading-tight">
                  <span className="text-base font-extrabold">12</span>
                  <span className="text-[10px] uppercase font-semibold">Sep</span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors">
                    Pemeriksaan Kehamilan (ANC)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">09:00 - 10:00 WIB</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Puskesmas Manud Jaya</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>

            {/* Item 2 */}
            <div 
              onClick={() => setSelectedJadwal(jadwalList[1])}
              className="p-3.5 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] border border-indigo-100 flex flex-col items-center justify-center text-[#4F46E5] shrink-0 font-bold leading-tight">
                  <span className="text-base font-extrabold">24</span>
                  <span className="text-[10px] uppercase font-semibold">Sep</span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors">
                    Konseling Gizi Ibu Hamil
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">09:00 - 10:00 WIB</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Puskesmas Manud Jaya</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>

            {/* Item 3 */}
            <div 
              onClick={() => setSelectedJadwal(jadwalList[3])}
              className="p-3.5 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] border border-indigo-100 flex flex-col items-center justify-center text-[#4F46E5] shrink-0 font-bold leading-tight">
                  <span className="text-base font-extrabold">10</span>
                  <span className="text-[10px] uppercase font-semibold">Okt</span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#4F46E5] transition-colors">
                    Pemeriksaan Kehamilan
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">09:00 - 10:00 WIB</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Puskesmas Manud Jaya</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Tabel: Daftar Jadwal */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-50">
          <h3 className="text-sm font-bold text-slate-900">Daftar Jadwal</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FFE4EC]/70 text-slate-800 font-bold border-b border-pink-100">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-32">Tanggal</th>
                <th className="py-3 px-4 w-32">Waktu</th>
                <th className="py-3 px-4">Jenis Kegiatan</th>
                <th className="py-3 px-4">Lokasi</th>
                <th className="py-3 px-4 w-32 text-center">Status</th>
                <th className="py-3 px-4 w-20 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {jadwalList.map((row) => (
                <tr key={row.no} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 text-center font-medium">{row.no}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{row.tanggal}</td>
                  <td className="py-3.5 px-4 text-slate-600">{row.waktu}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{row.jenis}</td>
                  <td className="py-3.5 px-4 text-slate-600">{row.lokasi}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#EDE9FE] text-[#6D28D9]">
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedJadwal(row)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Lihat Detail Jadwal"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Jadwal */}
      {selectedJadwal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Detail Jadwal Pelayanan</h4>
              <button 
                type="button" 
                onClick={() => setSelectedJadwal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                <span className="text-[10px] text-purple-600 font-semibold block uppercase">Kegiatan</span>
                <span className="text-sm font-bold text-purple-950">{selectedJadwal.jenis}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Tanggal</span>
                  <span className="font-semibold text-slate-800">{selectedJadwal.tanggal}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Waktu</span>
                  <span className="font-semibold text-slate-800">{selectedJadwal.waktu} WIB</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Lokasi Pelayanan</span>
                <span className="font-semibold text-slate-800">{selectedJadwal.lokasi}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Petugas Penanggung Jawab</span>
                <span className="font-semibold text-slate-800">{selectedJadwal.petugas}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Keterangan / Persiapan</span>
                <span className="text-slate-700">{selectedJadwal.keterangan}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedJadwal(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
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
