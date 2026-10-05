import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { getTanggalFormatStandar } from '../../utils/dateUtils';

export default function ScheduleBanner({ onRegistrasiClick }) {
  const tanggalHariIni = getTanggalFormatStandar();

  return (
    <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Left Schedule Info */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-white border border-[#FECDD3] flex items-center justify-center text-[#991B1B] shrink-0 shadow-xs">
          <Calendar size={22} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#991B1B]">
            Jadwal Posyandu Hari Ini
          </h3>
          <p className="text-xs text-[#4B5563] mt-0.5">
            {tanggalHariIni} &nbsp;|&nbsp; 08.30 - 12.00 WIB &nbsp;|&nbsp; Posyandu Desa Manud Jaya
          </p>
        </div>
      </div>

      {/* Right Action Button - Merah Marun Sesuai Figma */}
      <button
        onClick={onRegistrasiClick}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#881337] hover:bg-[#70102d] active:bg-[#4c0519] text-[#FFFFFF] rounded-xl text-sm font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
      >
        <Plus size={16} strokeWidth={2.5} />
        <span>Registrasi Kunjungan</span>
      </button>
    </div>
  );
}
