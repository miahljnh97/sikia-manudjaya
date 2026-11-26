import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { dinkesService } from '../../../services/dinkesService';

export default function DinkesFilterBar({ filters, onFilterChange }) {
  const options = dinkesService.getFilterOptions();

  return (
    <div className="flex items-end justify-start xl:justify-end gap-2 sm:gap-2.5 text-xs flex-wrap sm:flex-nowrap shrink-0">
      {/* 1. Periode */}
      <div className="shrink-0">
        <span className="block text-[11px] text-slate-400 font-medium mb-1">Periode</span>
        <div className="relative flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-2.5 py-1.5 shadow-2xs transition-colors">
          <Calendar size={13} className="text-slate-400 shrink-0 pointer-events-none" />
          <select
            value={filters.periode}
            onChange={(e) => onFilterChange('periode', e.target.value)}
            className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer pr-4 appearance-none text-xs"
          >
            {options.periode.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown size={13} className="text-slate-400 absolute right-2 pointer-events-none" />
        </div>
      </div>

      {/* 2. Kecamatan */}
      <div className="shrink-0">
        <span className="block text-[11px] text-slate-400 font-medium mb-1">Kecamatan</span>
        <div className="relative flex items-center bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-2.5 py-1.5 shadow-2xs transition-colors min-w-[115px] sm:min-w-[125px]">
          <select
            value={filters.kecamatan}
            onChange={(e) => onFilterChange('kecamatan', e.target.value)}
            className="w-full bg-transparent font-semibold text-slate-700 outline-none cursor-pointer pr-4 appearance-none text-xs"
          >
            {options.kecamatan.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown size={13} className="text-slate-400 absolute right-2 pointer-events-none" />
        </div>
      </div>

      {/* 3. Desa/Kelurahan */}
      <div className="shrink-0">
        <span className="block text-[11px] text-slate-400 font-medium mb-1">Desa/Kelurahan</span>
        <div className="relative flex items-center bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-2.5 py-1.5 shadow-2xs transition-colors min-w-[115px] sm:min-w-[125px]">
          <select
            value={filters.desa}
            onChange={(e) => onFilterChange('desa', e.target.value)}
            className="w-full bg-transparent font-semibold text-slate-700 outline-none cursor-pointer pr-4 appearance-none text-xs"
          >
            {options.desa.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown size={13} className="text-slate-400 absolute right-2 pointer-events-none" />
        </div>
      </div>

      {/* 4. Posyandu */}
      <div className="shrink-0">
        <span className="block text-[11px] text-slate-400 font-medium mb-1">Posyandu</span>
        <div className="relative flex items-center bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-2.5 py-1.5 shadow-2xs transition-colors min-w-[120px] sm:min-w-[130px]">
          <select
            value={filters.posyandu}
            onChange={(e) => onFilterChange('posyandu', e.target.value)}
            className="w-full bg-transparent font-semibold text-slate-700 outline-none cursor-pointer pr-4 appearance-none text-xs"
          >
            {options.posyandu.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown size={13} className="text-slate-400 absolute right-2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
