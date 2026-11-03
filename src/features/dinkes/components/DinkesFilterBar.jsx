import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { dinkesService } from '../../../services/dinkesService';

export default function DinkesFilterBar({ filters, onFilterChange }) {
  const options = dinkesService.getFilterOptions();

  return (
    <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
      {/* 1. Periode */}
      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
        <Calendar size={14} className="text-slate-400 shrink-0" />
        <select
          value={filters.periode}
          onChange={(e) => onFilterChange('periode', e.target.value)}
          className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer pr-1"
        >
          {options.periode.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* 2. Kecamatan */}
      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
        <span className="text-[11px] text-slate-400 font-medium">Kecamatan:</span>
        <select
          value={filters.kecamatan}
          onChange={(e) => onFilterChange('kecamatan', e.target.value)}
          className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer pr-1"
        >
          {options.kecamatan.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* 3. Desa/Kelurahan */}
      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
        <span className="text-[11px] text-slate-400 font-medium">Desa:</span>
        <select
          value={filters.desa}
          onChange={(e) => onFilterChange('desa', e.target.value)}
          className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer pr-1"
        >
          {options.desa.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* 4. Posyandu */}
      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
        <span className="text-[11px] text-slate-400 font-medium">Posyandu:</span>
        <select
          value={filters.posyandu}
          onChange={(e) => onFilterChange('posyandu', e.target.value)}
          className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer pr-1"
        >
          {options.posyandu.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
