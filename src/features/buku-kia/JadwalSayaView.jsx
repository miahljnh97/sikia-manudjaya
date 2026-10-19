import React, { useState } from 'react';
import { 
  Stethoscope, 
  Syringe, 
  UserCheck, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  MapPin, 
  Clock, 
  X,
  Calendar as CalendarIcon
} from 'lucide-react';

export default function JadwalSayaView({ onShowToast }) {
  const [selectedDate, setSelectedDate] = useState(15);
  const [selectedJadwal, setSelectedJadwal] = useState(null);

  const jadwalList = [
    {
      no: 1,
      tanggal: '12 Sep 2026',
      waktu: '09:00 - 10:00',
      jenis: 'Pemeriksaan Kehamilan ANC',
      lokasi: 'Puskesmas Manud Jaya',
      status: 'Akan Datang',
      petugas: 'Bidan Siti, S.Tr.Keb',
      catatan: 'Pemeriksaan rutin trimester 3 dan cek kadar Hemoglobin (Hb)'
    },
    {
      no: 2,
      tanggal: '17 Sep 2026',
      waktu: '09:00 - 10:00',
      jenis: 'Konseling Gizi',
      lokasi: 'Puskesmas Manud Jaya',
      status: 'Akan Datang',
      petugas: 'Ahli Gizi Puskesmas',
      catatan: 'Edukasi asupan zat besi, kalsium, dan pola makan sehat ibu hamil'
    },
    {
      no: 3,
      tanggal: '24 Sep 2026',
      waktu: '09:00 - 10:00',
      jenis: 'Pemeriksaan Kehamilan ANC',
      lokasi: 'Puskesmas Manud Jaya',
      status: 'Akan Datang',
      petugas: 'Bidan Siti, S.Tr.Keb',
      catatan: 'Pengukuran tinggi fundus uteri dan detak jantung janin'
    },
    {
      no: 4,
      tanggal: '10 Okt 2026',
      waktu: '09:00 - 10:00',
      jenis: 'Kelas Ibu Hamil',
      lokasi: 'Puskesmas Manud Jaya',
      status: 'Akan Datang',
      petugas: 'Tim Promkes Posyandu',
      catatan: 'Senam hamil, persiapan menyusui, dan tanda bahaya persalinan'
    }
  ];

  // Calendar dates representation (September 2026)
  // Sep 1, 2026 is Tuesday (Index 2 if Sunday is 0)
  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const calendarDays = [
    { day: 31, isPrev: true },
    { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 }, { day: 6 },
    { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12, hasDot: true }, { day: 13 },
    { day: 14 }, { day: 15, isSelected: true }, { day: 16 }, { day: 17, hasDot: true }, { day: 18 }, { day: 19 }, { day: 20 },
    { day: 21 }, { day: 22 }, { day: 23 }, { day: 24, hasDot: true }, { day: 25 }, { day: 26 }, { day: 27 },
    { day: 28 }, { day: 29 }, { day: 30 },
    { day: 1, isNext: true }, { day: 2, isNext: true }, { day: 3, isNext: true }, { day: 4, isNext: true }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Jadwal Saya
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Lihat dan kelola semua jadwal pemeriksaan, konseling, imunisasi dan kegiatan lainnya
        </p>
      </div>

      {/* 2. 4 Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Stethoscope size={20} />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Jadwal Pemeriksaan</span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">3</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Syringe size={20} />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Jadwal Imunisasi</span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">0</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <UserCheck size={20} />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Jadwal Konseling</span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">1</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <BookOpen size={20} />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Kelas Ibu Hamil</span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">2</span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Calendar (Left) & Jadwal Terdekat (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kalender Widget (5 Col) */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          {/* Header Kalender */}
          <div className="flex items-center justify-between pb-2">
            <button 
              type="button" 
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <h3 className="text-sm font-bold text-slate-900">September 2026</h3>
            <button 
              type="button" 
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Grid Kalender */}
          <div>
            <div className="grid grid-cols-7 text-center text-xs text-slate-400 font-medium mb-2">
              {daysOfWeek.map((d, i) => (
                <div key={i} className="py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 text-center text-xs">
              {calendarDays.map((item, idx) => {
                const isCurrentSelected = selectedDate === item.day && !item.isPrev && !item.isNext;
                return (
                  <div key={idx} className="py-1.5 flex flex-col items-center justify-center">
                    <button
                      type="button"
                      onClick={() => !item.isPrev && !item.isNext && setSelectedDate(item.day)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer relative ${
                        isCurrentSelected
                          ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                          : item.isPrev || item.isNext
                          ? 'text-slate-300'
                          : 'text-slate-700 hover:bg-slate-100 font-medium'
                      }`}
                    >
                      {item.day}
                      {item.hasDot && !isCurrentSelected && (
                        <span className="w-1 h-1 rounded-full bg-rose-500 absolute bottom-0.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Jadwal Terdekat (7 Col) */}
        <div className="lg:col-span-7 space-y-3.5">
          <h3 className="text-sm font-bold text-slate-900">Jadwal Terdekat</h3>

          <div className="space-y-3">
            {[
              {
                dateBadge: '12 Sep',
                title: 'Pemeriksaan Kehamilan (ANC)',
                waktu: '09:00 - 10:00 WIB',
                lokasi: 'Puskesmas Manud Jaya',
                ref: jadwalList[0]
              },
              {
                dateBadge: '24 Sep',
                title: 'Konseling Gizi Ibu Hamil',
                waktu: '09:00 - 10:00 WIB',
                lokasi: 'Puskesmas Manud Jaya',
                ref: jadwalList[1]
              },
              {
                dateBadge: '10 Okt',
                title: 'Pemeriksaan Kehamilan',
                waktu: '09:00 - 10:00 WIB',
                lokasi: 'Puskesmas Manud Jaya',
                ref: jadwalList[3]
              }
            ].map((j, i) => (
              <div
                key={i}
                onClick={() => setSelectedJadwal(j.ref)}
                className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  {/* Blue date box */}
                  <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex flex-col items-center justify-center shrink-0 border border-blue-100 font-bold leading-tight">
                    <span className="text-xs">{j.dateBadge.split(' ')[0]}</span>
                    <span className="text-[10px] uppercase">{j.dateBadge.split(' ')[1]}</span>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {j.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{j.waktu}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{j.lokasi}</p>
                  </div>
                </div>

                <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Daftar Jadwal Table */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 sm:p-6 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Daftar Jadwal</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FFF1F2] text-slate-700 font-bold border-b border-pink-100">
                <th className="py-3 px-5 w-12">No</th>
                <th className="py-3 px-5">Tanggal</th>
                <th className="py-3 px-5">Waktu</th>
                <th className="py-3 px-5">Jenis Kegiatan</th>
                <th className="py-3 px-5">Lokasi</th>
                <th className="py-3 px-5 text-center">Status</th>
                <th className="py-3 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {jadwalList.map((item) => (
                <tr key={item.no} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-medium">{item.no}</td>
                  <td className="py-3.5 px-5 font-medium text-slate-900 whitespace-nowrap">{item.tanggal}</td>
                  <td className="py-3.5 px-5 text-slate-600 whitespace-nowrap">{item.waktu}</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-900">{item.jenis}</td>
                  <td className="py-3.5 px-5 text-slate-600">{item.lokasi}</td>
                  <td className="py-3.5 px-5 text-center">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#EDE9FE] text-[#6D28D9] border border-purple-200">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedJadwal(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Lihat Detail Jadwal"
                    >
                      <Eye size={16} />
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CalendarIcon size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedJadwal.jenis}</h3>
                  <span className="text-xs text-slate-400">{selectedJadwal.tanggal}</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedJadwal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-slate-700">
                <Clock size={16} className="text-slate-400" />
                <span><strong>Waktu:</strong> {selectedJadwal.waktu} WIB</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-slate-700">
                <MapPin size={16} className="text-slate-400" />
                <span><strong>Lokasi:</strong> {selectedJadwal.lokasi}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-slate-700">
                <UserCheck size={16} className="text-slate-400" />
                <span><strong>Petugas:</strong> {selectedJadwal.petugas}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 text-slate-700">
                <span className="font-semibold text-blue-700 block text-[11px] mb-1">Catatan Persiapan:</span>
                <p className="text-[11px] leading-relaxed text-slate-600">{selectedJadwal.catatan}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedJadwal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
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
