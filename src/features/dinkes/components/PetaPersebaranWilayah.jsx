import React, { useState, useMemo } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function PetaPersebaranWilayah({
  height = '440px',
  isCompact = false,
  selectedIndikator = 'Kasus Stunting (Balita)',
  onIndikatorChange = null,
  showDropdownInside = false
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Data Wilayah & Kasus per Indikator Kesehatan sesuai geografi Figma
  // Koordinat persen (%) agar responsif dan presisi di atas gambar peta
  const regions = useMemo(() => [
    {
      id: 'sungai-rejo',
      nama: 'Desa Sungai Rejo',
      shortName: 'Sungai Rejo',
      leftPct: 40,
      topPct: 45,
      kasusMap: {
        'Kasus Stunting (Balita)': 24,
        'Ibu Hamil Berisiko': 26,
        'Cakupan Imunisasi Rendah': 14
      }
    },
    {
      id: 'manud-jaya',
      nama: 'Desa Manud Jaya',
      shortName: 'Manud Jaya',
      leftPct: 27,
      topPct: 62,
      kasusMap: {
        'Kasus Stunting (Balita)': 32,
        'Ibu Hamil Berisiko': 16,
        'Cakupan Imunisasi Rendah': 25
      }
    },
    {
      id: 'tanjung-sari',
      nama: 'Desa Tanjung Sari',
      shortName: 'Tanjung Sari',
      leftPct: 49,
      topPct: 75,
      kasusMap: {
        'Kasus Stunting (Balita)': 14,
        'Ibu Hamil Berisiko': 22,
        'Cakupan Imunisasi Rendah': 8
      }
    }
  ], []);

  // Filter tint/hue untuk ZonaKesehatan saat indikator diubah
  const filterStyle = useMemo(() => {
    if (selectedIndikator === 'Ibu Hamil Berisiko') {
      return { filter: 'hue-rotate(25deg) saturate(1.15)' };
    }
    if (selectedIndikator === 'Cakupan Imunisasi Rendah') {
      return { filter: 'hue-rotate(-20deg) saturate(1.2)' };
    }
    return { filter: 'none' };
  }, [selectedIndikator]);

  const legendItems = [
    { label: '> 30', color: '#F43F5E' },
    { label: '21 - 30', color: '#FB7185' },
    { label: '11 - 20', color: '#FDA4AF' },
    { label: '6 - 10', color: '#FECDD3' },
    { label: '1 - 5', color: '#FFE4E6' },
    { label: '0', color: '#FFFFFF' }
  ];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#EDF3F5] border border-slate-200/90 shadow-2xs select-none">
      {/* Optional dropdown inside map canvas if requested */}
      {showDropdownInside && !isCompact && (
        <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-2">
          <div className="bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs flex items-center gap-2 text-xs">
            <span className="text-[11px] text-slate-400 font-medium">Tampilkan:</span>
            <select
              value={selectedIndikator}
              onChange={(e) => onIndikatorChange && onIndikatorChange(e.target.value)}
              className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer text-xs"
            >
              <option value="Kasus Stunting (Balita)">Kasus Stunting (Balita)</option>
              <option value="Ibu Hamil Berisiko">Ibu Hamil Berisiko</option>
              <option value="Cakupan Imunisasi Rendah">Cakupan Imunisasi Rendah</option>
            </select>
          </div>
        </div>
      )}

      {/* Kontrol Zoom (+ / -) Sesuai Desain Figma */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 shadow-xs">
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
          className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-slate-600 flex items-center justify-center shadow-xs border border-slate-200 cursor-pointer active:scale-95 transition-all font-bold text-sm"
          title="Zoom In"
        >
          <Plus size={16} />
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
          className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-slate-600 flex items-center justify-center shadow-xs border border-slate-200 cursor-pointer active:scale-95 transition-all font-bold text-sm"
          title="Zoom Out"
        >
          <Minus size={16} />
        </button>
      </div>

      {/* Legenda Jumlah Kasus Sesuai Desain Figma (Sudut Kanan Atas) */}
      <div className={`absolute ${isCompact ? 'top-2 right-2' : 'top-4 right-4'} z-20 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-3 shadow-xs text-[11px] space-y-1.5 min-w-[110px]`}>
        <span className="block font-bold text-slate-800 text-[10px] uppercase tracking-wider">
          Jumlah Kasus
        </span>
        <div className="space-y-1">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-xs shrink-0 border border-slate-300/40"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600 font-medium text-[10px]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas Map Wrapper */}
      <div className="w-full flex items-center justify-center overflow-hidden" style={{ height }}>
        <div 
          className="relative w-full h-full transition-transform duration-200 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* 1. Latar Belakang Peta (Jalan, Sungai, Kecamatan Tetangga) */}
          <img
            src="/images/picture/pesebaran-wilayah/LatarPeta.png"
            alt="Latar Peta Persebaran Wilayah"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />

          {/* 2. Layer Zona Kesehatan (Gambar Asli Figma Bertekstur Organik) */}
          <img
            src="/images/picture/pesebaran-wilayah/ZonaKesehatan.png"
            alt="Zona Kesehatan"
            style={filterStyle}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-all duration-300"
          />

          {/* 3. HTML Overlay Label & Titik Posyandu Presisi Figma */}
          {/* Label Wilayah Tetangga dari Figma */}
          <span className="absolute left-[8%] top-[18%] text-[11px] font-semibold text-slate-400 pointer-events-none select-none">
            Kecamatan Sumberrejo
          </span>
          <span className="absolute left-[50%] top-[24%] text-[11px] font-semibold text-slate-400 pointer-events-none select-none">
            Kecamatan Melati Jaya
          </span>
          <span className="absolute left-[5%] top-[82%] text-[11px] font-semibold text-slate-400 pointer-events-none select-none">
            Kecamatan Karangrejo
          </span>

          {/* Label Nama Desa & Kasus yang Reaktif */}
          {regions.map((reg) => {
            const kasus = reg.kasusMap[selectedIndikator] ?? reg.kasusMap['Kasus Stunting (Balita)'];
            return (
              <div
                key={reg.id}
                onMouseEnter={() => setHoveredRegion({ ...reg, kasus })}
                onMouseLeave={() => setHoveredRegion(null)}
                style={{ left: `${reg.leftPct}%`, top: `${reg.topPct}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer pointer-events-auto px-2 py-1 rounded-lg hover:bg-white/60 transition-colors z-10"
              >
                <span className="text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight drop-shadow-2xs leading-none">
                  {reg.shortName}
                </span>
                <span className="text-[10px] font-semibold text-slate-600 mt-0.5">
                  ({kasus} kasus)
                </span>
              </div>
            );
          })}

          {/* Titik Posyandu Figma (Posisi Presisi Berdasarkan Gambar 2) */}
          {/* Zona Atas (Sungai Rejo) */}
          <div className="absolute left-[33%] top-[24%] w-3.5 h-3.5 rounded-full border-2 border-white pointer-events-none shadow-xs" />
          <div className="absolute left-[37%] top-[26%] w-3.5 h-3.5 rounded-full border-2 border-white pointer-events-none shadow-xs" />
          <div className="absolute left-[39.5%] top-[25%] w-2.5 h-2.5 rounded-full bg-amber-400 border border-white pointer-events-none shadow-xs" />
          <div className="absolute left-[36.5%] top-[34%] w-2.5 h-2.5 rounded-full bg-amber-400 border border-white pointer-events-none shadow-xs" />
          <div className="absolute left-[41%] top-[34%] w-2.5 h-2.5 rounded-full bg-amber-400 border border-white pointer-events-none shadow-xs" />
          <div className="absolute left-[44.5%] top-[36%] w-2.5 h-2.5 rounded-full bg-amber-400 border border-white pointer-events-none shadow-xs" />

          {/* Zona Kiri (Manud Jaya) */}
          <div className="absolute left-[20%] top-[50%] w-2.5 h-2.5 rounded-full bg-amber-400 border border-white pointer-events-none shadow-xs" />
          <div className="absolute left-[22.5%] top-[48%] w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white pointer-events-none shadow-xs" />
          <div className="absolute left-[27.5%] top-[49%] w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white pointer-events-none shadow-xs" />
          <div className="absolute left-[27.5%] top-[52%] w-2.5 h-2.5 rounded-full bg-amber-400 border border-white pointer-events-none shadow-xs" />
          <div className="absolute left-[30%] top-[50%] w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white pointer-events-none shadow-xs" />
          <div className="absolute left-[32%] top-[51%] w-2.5 h-2.5 rounded-full bg-amber-400 border border-white pointer-events-none shadow-xs" />
          <div className="absolute left-[36%] top-[52%] w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white pointer-events-none shadow-xs" />
          <div className="absolute left-[24.5%] top-[66%] w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white pointer-events-none shadow-xs" />

          {/* Zona Kanan (Tanjung Sari) */}
          <div className="absolute left-[45%] top-[51%] w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white pointer-events-none shadow-xs" />
          <div className="absolute left-[48.2%] top-[55%] w-2.5 h-2.5 rounded-full bg-amber-400 border border-white pointer-events-none shadow-xs" />
          <div className="absolute left-[49.5%] top-[57%] w-2.5 h-2.5 rounded-full bg-amber-400 border border-white pointer-events-none shadow-xs" />
          <div className="absolute left-[47.7%] top-[60%] w-2.5 h-2.5 rounded-full bg-amber-400 border border-white pointer-events-none shadow-xs" />
          <div className="absolute left-[45.5%] top-[63%] w-2.5 h-2.5 rounded-full bg-amber-400 border border-white pointer-events-none shadow-xs" />
        </div>
      </div>

      {/* Tooltip Hover Wilayah */}
      {hoveredRegion && (
        <div className="absolute bottom-4 left-4 z-30 bg-slate-900/90 text-white rounded-xl px-3 py-2 text-xs shadow-lg backdrop-blur-xs pointer-events-none animate-in fade-in duration-100">
          <p className="font-bold">{hoveredRegion.nama}</p>
          <p className="text-[11px] text-rose-200">
            {hoveredRegion.kasus} kasus {selectedIndikator.toLowerCase()}
          </p>
        </div>
      )}
    </div>
  );
}


