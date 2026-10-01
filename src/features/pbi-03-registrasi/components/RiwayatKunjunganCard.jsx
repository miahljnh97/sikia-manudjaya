import React from 'react';
import { Calendar, Lightbulb, ExternalLink } from 'lucide-react';
import { getTanggalFormatStandar } from '../../../utils/dateUtils';

export default function RiwayatKunjunganCard({ riwayatList = [] }) {
  return (
    <div className="w-full lg:w-80 shrink-0 space-y-4">
      {/* 1. Card Jadwal Posyandu Hari Ini */}
      <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Calendar size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-rose-900 leading-tight">
              Jadwal Posyandu Hari Ini
            </h4>
            <div className="text-[11px] text-rose-700 font-medium mt-0.5">{getTanggalFormatStandar()}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              08:30 - 12:00 WIB<br />Posyandu Desa Manud Jaya
            </div>
          </div>
        </div>
      </div>

      {/* 2. Alert Card Petunjuk Data */}
      <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Lightbulb size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900 leading-tight">
              Pastikan Data Sudah Benar
            </h4>
            <p className="text-[11px] text-amber-800/80 mt-1 leading-relaxed">
              Periksa kembali identitas peserta sebelum melanjutkan ke tahap jenis pelayanan.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Riwayat Kunjungan Terakhir (PBI 03E) */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <h4 className="text-xs font-bold text-slate-800">Riwayat Kunjungan Terakhir</h4>
          <button 
            onClick={() => alert('Buka riwayat lengkap')}
            className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            Lihat semua
          </button>
        </div>

        <div className="space-y-3.5">
          {riwayatList.map((item, idx) => (
            <div key={idx} className="text-xs">
              <div className="font-bold text-slate-800 leading-tight">{item.tanggal}</div>
              <div className="text-slate-500 mt-0.5 text-[11px]">{item.jenis}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{item.status} • {item.petugas}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
