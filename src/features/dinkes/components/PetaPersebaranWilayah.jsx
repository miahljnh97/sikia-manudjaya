import React, { useState } from 'react';
import { Plus, Minus, MapPin } from 'lucide-react';

export default function PetaPersebaranWilayah({
  height = '420px',
  isCompact = false,
  selectedIndikator = 'Kasus Stunting (Balita)',
  onIndikatorChange = null
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Data Wilayah & Kasus Sesuai Desain Figma
  const regions = [
    {
      id: 'manud-jaya',
      nama: 'Desa Manud Jaya',
      shortName: 'Manud Jaya',
      kasus: 32,
      fill: '#E11D48', // > 30 (deep rose)
      textColor: '#FFFFFF',
      d: 'M 220,160 L 360,150 L 400,210 L 370,270 L 260,260 L 200,210 Z',
      labelX: 285,
      labelY: 205,
      posyandus: [
        { x: 250, y: 190 },
        { x: 310, y: 185 },
        { x: 330, y: 230 },
        { x: 260, y: 240 }
      ]
    },
    {
      id: 'sungai-rejo',
      nama: 'Desa Sungai Rejo',
      shortName: 'Sungai Rejo',
      kasus: 24,
      fill: '#FB7185', // 21 - 30 (rose-400)
      textColor: '#FFFFFF',
      d: 'M 280,70 L 380,60 L 410,120 L 360,150 L 250,140 L 230,100 Z',
      labelX: 320,
      labelY: 105,
      posyandus: [
        { x: 300, y: 85 },
        { x: 350, y: 100 },
        { x: 365, y: 135 }
      ]
    },
    {
      id: 'soreang-baru',
      nama: 'Desa Soreang Baru',
      shortName: 'Desa Soreang Baru',
      kasus: 18,
      fill: '#FDA4AF', // 11 - 20 (rose-300)
      textColor: '#9F1239',
      d: 'M 140,90 L 230,100 L 250,140 L 220,160 L 170,160 L 120,130 Z',
      labelX: 185,
      labelY: 130,
      posyandus: [
        { x: 160, y: 120 },
        { x: 200, y: 145 }
      ]
    },
    {
      id: 'tanjung-sari',
      nama: 'Desa Tanjung Sari',
      shortName: 'Tanjung Sari',
      kasus: 14,
      fill: '#FDA4AF', // 11 - 20 (rose-300)
      textColor: '#9F1239',
      d: 'M 360,150 L 450,140 L 480,220 L 430,270 L 370,270 L 400,210 Z',
      labelX: 420,
      labelY: 205,
      posyandus: [
        { x: 390, y: 175 },
        { x: 440, y: 190 },
        { x: 425, y: 240 }
      ]
    },
    {
      id: 'mandiri-jaya',
      nama: 'Desa Mandiri Jaya',
      shortName: 'Desa Mandiri Jaya',
      kasus: 8,
      fill: '#FECDD3', // 6 - 10 (rose-200)
      textColor: '#881337',
      d: 'M 170,160 L 220,160 L 200,210 L 260,260 L 200,290 L 140,240 L 130,180 Z',
      labelX: 175,
      labelY: 215,
      posyandus: [
        { x: 170, y: 195 },
        { x: 180, y: 250 }
      ]
    },
    {
      id: 'melati',
      nama: 'Desa Melati',
      shortName: 'Desa Melati',
      kasus: 6,
      fill: '#FECDD3', // 6 - 10 (rose-200)
      textColor: '#881337',
      d: 'M 370,270 L 430,270 L 410,340 L 330,350 L 320,290 L 360,280 Z',
      labelX: 375,
      labelY: 310,
      posyandus: [
        { x: 360, y: 315 },
        { x: 395, y: 325 }
      ]
    },
    {
      id: 'purnama',
      nama: 'Desa Purnama',
      shortName: 'Desa Purnama',
      kasus: 5,
      fill: '#FFF1F2', // 0 - 5 (rose-50)
      textColor: '#9F1239',
      d: 'M 200,290 L 260,260 L 320,290 L 330,350 L 240,360 L 190,320 Z',
      labelX: 255,
      labelY: 315,
      posyandus: [
        { x: 235, y: 325 },
        { x: 285, y: 335 }
      ]
    }
  ];

  const legendItems = [
    { label: '> 30', color: '#E11D48' },
    { label: '21 - 30', color: '#FB7185' },
    { label: '11 - 20', color: '#FDA4AF' },
    { label: '6 - 10', color: '#FECDD3' },
    { label: '1 - 5', color: '#FFF1F2' },
    { label: '0', color: '#F1F5F9' }
  ];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#F4F6F9] border border-slate-200/80 shadow-2xs">
      {/* Top Header / Indikator Filter (Hanya tampil di mode non-compact) */}
      {!isCompact && (
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

      {/* Kontrol Zoom (+ / -) */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
          className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-slate-600 flex items-center justify-center shadow-xs border border-slate-200 cursor-pointer active:scale-95 transition-all"
          title="Zoom In"
        >
          <Plus size={16} />
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
          className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-slate-600 flex items-center justify-center shadow-xs border border-slate-200 cursor-pointer active:scale-95 transition-all"
          title="Zoom Out"
        >
          <Minus size={16} />
        </button>
      </div>

      {/* Legenda Jumlah Kasus (Pojok Kiri / Kanan Atas) */}
      <div className={`absolute ${isCompact ? 'top-3 left-3' : 'top-4 right-4 sm:top-14'} z-10 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-2.5 shadow-xs text-[11px] space-y-1.5`}>
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

      {/* SVG Canvas Map */}
      <div className="w-full flex items-center justify-center overflow-hidden" style={{ height }}>
        <svg
          viewBox="100 40 420 330"
          className="w-full h-full transition-transform duration-200 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Background Map Context Labels (Kecamatan Tetangga) */}
          <text x="120" y="270" fill="#94A3B8" fontSize="10" fontWeight="600" opacity="0.6">
            Kecamatan Sumberrejo
          </text>
          <text x="140" y="380" fill="#94A3B8" fontSize="10" fontWeight="600" opacity="0.6">
            Kecamatan Karangrejo
          </text>
          <text x="390" y="70" fill="#94A3B8" fontSize="10" fontWeight="600" opacity="0.6">
            Kecamatan Melati Jaya
          </text>

          {/* Poligon Wilayah Desa */}
          {regions.map((reg) => {
            const isHovered = hoveredRegion?.id === reg.id;
            return (
              <g
                key={reg.id}
                onMouseEnter={() => setHoveredRegion(reg)}
                onMouseLeave={() => setHoveredRegion(null)}
                className="cursor-pointer transition-all duration-150"
              >
                <path
                  d={reg.d}
                  fill={reg.fill}
                  stroke={isHovered ? '#BE123C' : '#FFFFFF'}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  strokeLinejoin="round"
                  className="transition-all hover:filter hover:brightness-95"
                />

                {/* Label Nama Desa & Kasus */}
                <text
                  x={reg.labelX}
                  y={reg.labelY - 5}
                  textAnchor="middle"
                  fill={reg.textColor}
                  fontSize={isCompact ? '9' : '10'}
                  fontWeight="bold"
                  className="pointer-events-none select-none drop-shadow-2xs"
                >
                  {reg.shortName}
                </text>
                <text
                  x={reg.labelX}
                  y={reg.labelY + 9}
                  textAnchor="middle"
                  fill={reg.textColor}
                  fontSize={isCompact ? '8' : '9'}
                  fontWeight="600"
                  opacity="0.95"
                  className="pointer-events-none select-none"
                >
                  {reg.kasus} kasus
                </text>

                {/* Titik Lokasi Posyandu (Yellow Dots Sesuai Gambar 3) */}
                {reg.posyandus.map((p, pIdx) => (
                  <circle
                    key={`${reg.id}-p-${pIdx}`}
                    cx={p.x}
                    cy={p.y}
                    r={3.5}
                    fill="#FACC15"
                    stroke="#FFFFFF"
                    strokeWidth={1.5}
                    className="drop-shadow-xs"
                  />
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tooltip Hover Wilayah */}
      {hoveredRegion && (
        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 text-white rounded-xl px-3 py-2 text-xs shadow-lg backdrop-blur-xs pointer-events-none animate-in fade-in duration-100">
          <p className="font-bold">{hoveredRegion.nama}</p>
          <p className="text-[11px] text-rose-200">
            {hoveredRegion.kasus} kasus {selectedIndikator.toLowerCase()}
          </p>
        </div>
      )}
    </div>
  );
}
