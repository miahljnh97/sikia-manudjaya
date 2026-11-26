import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { dinkesService } from '../../../services/dinkesService';

export default function DinkesFilterBar({ filters, onFilterChange }) {
  const options = dinkesService.getFilterOptions(filters);

  // Helper trigger cascading filter changes
  const applyChange = (updated) => {
    if (typeof onFilterChange === 'function') {
      onFilterChange(updated);
    }
  };

  const handlePeriodeChange = (val) => {
    applyChange({ ...filters, periode: val });
  };

  const handleKecamatanChange = (newKec) => {
    if (newKec === filters.kecamatan) return;

    let nextDesa = filters.desa;
    let nextPosyandu = filters.posyandu;

    if (newKec !== 'Semua Kecamatan') {
      // Pastikan desa saat ini ada di kecamatan baru
      const validDesas = dinkesService.getDesaList(newKec);
      if (nextDesa !== 'Semua Desa' && !validDesas.some(d => d.toLowerCase().trim() === nextDesa.toLowerCase().trim())) {
        nextDesa = 'Semua Desa';
        nextPosyandu = 'Semua Posyandu';
      } else {
        const validPos = dinkesService.getPosyanduList(newKec, nextDesa);
        if (nextPosyandu !== 'Semua Posyandu' && !validPos.some(p => p.toLowerCase().trim() === nextPosyandu.toLowerCase().trim())) {
          nextPosyandu = 'Semua Posyandu';
        }
      }
    }

    applyChange({
      ...filters,
      kecamatan: newKec,
      desa: nextDesa,
      posyandu: nextPosyandu
    });
  };

  const handleDesaChange = (newDesa) => {
    if (newDesa === filters.desa) return;

    if (newDesa !== 'Semua Desa') {
      // Auto-sync parent kecamatan
      const parentKec = dinkesService.getParentKecamatanByDesa(newDesa);
      const validPos = dinkesService.getPosyanduList(parentKec, newDesa);
      let nextPosyandu = filters.posyandu;
      if (nextPosyandu !== 'Semua Posyandu' && !validPos.some(p => p.toLowerCase().trim() === nextPosyandu.toLowerCase().trim())) {
        nextPosyandu = 'Semua Posyandu';
      }
      applyChange({
        ...filters,
        kecamatan: parentKec,
        desa: newDesa,
        posyandu: nextPosyandu
      });
    } else {
      applyChange({
        ...filters,
        desa: 'Semua Desa',
        posyandu: 'Semua Posyandu'
      });
    }
  };

  const handlePosyanduChange = (newPos) => {
    if (newPos === filters.posyandu) return;

    if (newPos !== 'Semua Posyandu') {
      // Auto-sync parent kecamatan dan desa
      const parentLoc = dinkesService.getParentLocationByPosyandu(newPos);
      if (parentLoc) {
        applyChange({
          ...filters,
          kecamatan: parentLoc.kecamatan,
          desa: parentLoc.desa,
          posyandu: newPos
        });
      } else {
        applyChange({
          ...filters,
          posyandu: newPos
        });
      }
    } else {
      applyChange({
        ...filters,
        posyandu: 'Semua Posyandu'
      });
    }
  };

  return (
    <div className="flex items-end justify-start xl:justify-end gap-2 sm:gap-2.5 text-xs flex-wrap sm:flex-nowrap shrink-0">
      {/* 1. Periode */}
      <div className="shrink-0">
        <span className="block text-[11px] text-slate-400 font-medium mb-1">Periode</span>
        <div className="relative flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-2.5 py-1.5 shadow-2xs transition-colors">
          <Calendar size={13} className="text-slate-400 shrink-0 pointer-events-none" />
          <select
            value={filters.periode}
            onChange={(e) => handlePeriodeChange(e.target.value)}
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
            onChange={(e) => handleKecamatanChange(e.target.value)}
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
            onChange={(e) => handleDesaChange(e.target.value)}
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
            onChange={(e) => handlePosyanduChange(e.target.value)}
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
