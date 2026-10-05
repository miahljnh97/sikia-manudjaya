import React from 'react';
import { Calendar, Lightbulb } from 'lucide-react';

export default function RiwayatKunjunganCard({ riwayatList = [] }) {
  const fallbackRiwayat = [
    { tanggal: '26 Sep 2026', jenis: 'Pemeriksaan Kehamilan', status: 'Hadir', petugas: 'Kader Siti' },
    { tanggal: '26 Agu 2026', jenis: 'Pemeriksaan Kehamilan', status: 'Hadir', petugas: 'Kader Ani' },
    { tanggal: '26 Jul 2026', jenis: 'Pemeriksaan Kehamilan', status: 'Hadir', petugas: 'Kader Ani' },
    { tanggal: '26 Jun 2026', jenis: 'Pemeriksaan Kehamilan', status: 'Hadir', petugas: 'Kader Ani' },
    { tanggal: '26 Mei 2026', jenis: 'Pemeriksaan Kehamilan', status: 'Hadir', petugas: 'Kader Ani' },
  ];

  const itemsToDisplay = riwayatList && riwayatList.length > 0 ? riwayatList : fallbackRiwayat;

  return (
    <div className="w-full lg:w-80 shrink-0 bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
      <h3 className="text-sm font-bold text-slate-900 mb-1">
        Informasi Tambahan
      </h3>

      {/* 1. Card Jadwal Posyandu Hari Ini */}
      <div className="bg-[#FFF1F2] border border-[#FFE4E6] rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-white text-[#E11D48] flex items-center justify-center shrink-0 shadow-2xs">
            <Calendar size={17} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#E11D48] leading-tight">
              Jadwal Posyandu Hari Ini
            </h4>
            <div className="text-xs font-bold text-slate-900 mt-0.5">27 September 2026</div>
            <div className="text-[11px] text-slate-600 font-medium mt-1">08:30 - 12:00 WIB</div>
            <div className="text-[11px] text-slate-500">Posyandu Desa Manud Jaya</div>
          </div>
        </div>
      </div>

      {/* 2. Alert Card Petunjuk Data */}
      <div className="bg-[#FEFCE8] border border-[#FEF08A] rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FEF9C3] text-[#CA8A04] flex items-center justify-center shrink-0">
            <Lightbulb size={17} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#854D0E] leading-tight">
              Pastikan Data Sudah Benar
            </h4>
            <p className="text-[11px] text-[#A16207] mt-1 leading-relaxed">
              Periksa kembali identitas peserta sebelum melanjutkan ke tahap jenis pelayanan.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Riwayat Kunjungan Terakhir */}
      <div className="pt-2">
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
          <h4 className="text-xs font-bold text-slate-900">Riwayat Kunjungan Terakhir</h4>
          <button 
            type="button"
            className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            Lihat semua
          </button>
        </div>

        <div className="space-y-3">
          {itemsToDisplay.slice(0, 5).map((item, idx) => (
            <div key={idx} className="text-xs">
              <div className="font-bold text-slate-900 leading-tight">{item.tanggal}</div>
              <div className="text-slate-600 mt-0.5 text-[11px]">{item.jenis}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{item.status} • {item.petugas}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
