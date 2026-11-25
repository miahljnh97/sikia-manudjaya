import React, { useState, useMemo } from 'react';
import { Plus, Minus } from 'lucide-react';

// Fungsi penentuan warna dan kontras teks berdasarkan jumlah kasus & legenda Figma
function getColorForKasus(kasus) {
  if (kasus > 30) return { fill: '#F43F5E', textColor: '#FFFFFF', stroke: '#BE123C' }; // > 30
  if (kasus >= 21) return { fill: '#FB7185', textColor: '#FFFFFF', stroke: '#E11D48' }; // 21 - 30
  if (kasus >= 11) return { fill: '#FDA4AF', textColor: '#881337', stroke: '#F43F5E' }; // 11 - 20
  if (kasus >= 6) return { fill: '#FECDD3', textColor: '#881337', stroke: '#FB7185' }; // 6 - 10
  if (kasus >= 1) return { fill: '#FFE4E6', textColor: '#9F1239', stroke: '#FDA4AF' }; // 1 - 5
  return { fill: '#FFFFFF', textColor: '#475569', stroke: '#E2E8F0' }; // 0
}

export default function PetaPersebaranWilayah({
  height = '440px',
  isCompact = false,
  selectedIndikator = 'Kasus Stunting (Balita)',
  onIndikatorChange = null,
  showDropdownInside = false
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Data Wilayah & Kasus per Indikator Kesehatan sesuai geografi Figma (skala 1550 x 652)
  const rawRegions = useMemo(() => [
    {
      id: 'sungai-rejo',
      nama: 'Desa Sungai Rejo',
      shortName: 'Sungai Rejo',
      // Poligon zona atas (merah tua di figma)
      d: 'M 646,105 L 690,75 L 755,90 L 800,75 L 850,95 L 900,80 L 970,110 L 1020,125 L 1085,190 L 1045,215 L 1000,205 L 960,250 L 980,310 L 870,315 L 850,220 L 730,195 L 675,215 L 646,170 Z',
      labelX: 590,
      labelY: 300,
      kasusMap: {
        'Kasus Stunting (Balita)': 24,
        'Ibu Hamil Berisiko': 26,
        'Cakupan Imunisasi Rendah': 14
      },
      posyandus: [
        { x: 508, y: 245, type: 'ring' },
        { x: 570, y: 252, type: 'ring' },
        { x: 610, y: 242, type: 'yellow' },
        { x: 635, y: 325, type: 'yellow' }
      ]
    },
    {
      id: 'manud-jaya',
      nama: 'Desa Manud Jaya',
      shortName: 'Manud Jaya',
      // Poligon zona tengah-kiri (pink lembut di figma)
      d: 'M 440,310 L 565,305 L 610,240 L 730,195 L 850,220 L 870,315 L 755,315 L 870,410 L 865,550 L 760,595 L 660,570 L 550,650 L 450,570 L 330,460 L 330,370 Z',
      labelX: 405,
      labelY: 415,
      kasusMap: {
        'Kasus Stunting (Balita)': 32,
        'Ibu Hamil Berisiko': 16,
        'Cakupan Imunisasi Rendah': 25
      },
      posyandus: [
        { x: 350, y: 450, type: 'green' },
        { x: 320, y: 480, type: 'yellow' },
        { x: 428, y: 458, type: 'green' },
        { x: 426, y: 492, type: 'yellow' },
        { x: 462, y: 465, type: 'green' },
        { x: 490, y: 488, type: 'yellow' },
        { x: 550, y: 492, type: 'green' },
        { x: 382, y: 635, type: 'green' }
      ]
    },
    {
      id: 'tanjung-sari',
      nama: 'Desa Tanjung Sari',
      shortName: 'Tanjung Sari',
      // Poligon zona tengah-kanan (pink sedang di figma)
      d: 'M 870,315 L 980,310 L 1050,335 L 1100,345 L 1180,410 L 1140,445 L 1060,430 L 1170,510 L 1230,580 L 1120,645 L 945,615 L 865,550 L 870,410 L 755,315 Z',
      labelX: 720,
      labelY: 500,
      kasusMap: {
        'Kasus Stunting (Balita)': 14,
        'Ibu Hamil Berisiko': 22,
        'Cakupan Imunisasi Rendah': 8
      },
      posyandus: [
        { x: 552, y: 358, type: 'yellow' },
        { x: 685, y: 345, type: 'yellow' },
        { x: 742, y: 520, type: 'yellow' },
        { x: 765, y: 535, type: 'yellow' },
        { x: 735, y: 562, type: 'yellow' },
        { x: 705, y: 590, type: 'yellow' }
      ]
    }
  ], []);

  // Hitung kasus, warna, dan styling secara reaktif berdasarkan selectedIndikator
  const regions = useMemo(() => {
    return rawRegions.map((reg) => {
      const kasus = reg.kasusMap[selectedIndikator] ?? reg.kasusMap['Kasus Stunting (Balita)'];
      const { fill, textColor, stroke } = getColorForKasus(kasus);
      return {
        ...reg,
        kasus,
        fill,
        textColor,
        stroke
      };
    });
  }, [rawRegions, selectedIndikator]);

  const legendItems = [
    { label: '> 30', color: '#F43F5E' },
    { label: '21 - 30', color: '#FB7185' },
    { label: '11 - 20', color: '#FDA4AF' },
    { label: '6 - 10', color: '#FECDD3' },
    { label: '1 - 5', color: '#FFE4E6' },
    { label: '0', color: '#FFFFFF' }
  ];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#EBF2F4] border border-slate-200/90 shadow-2xs select-none">
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
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5 shadow-xs">
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
      <div className={`absolute ${isCompact ? 'top-2 right-2' : 'top-4 right-4'} z-10 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-3 shadow-xs text-[11px] space-y-1.5 min-w-[110px]`}>
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
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* 2. Layer Zona Kesehatan (Gambar Asli Figma Bertekstur Organik) */}
          <img
            src="/images/picture/pesebaran-wilayah/ZonaKesehatan.png"
            alt="Zona Kesehatan"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90 mix-blend-multiply"
          />

          {/* 3. SVG Overlay Interaktif untuk Reaktivitas Filter, Hover, Label, & Titik Posyandu */}
          <svg
            viewBox="0 0 1550 652"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Label Wilayah Tetangga dari Figma */}
            <text x="140" y="70" fill="#64748B" fontSize="13" fontWeight="600" opacity="0.75">
              Kecamatan Sumberrejo
            </text>
            <text x="750" y="110" fill="#64748B" fontSize="13" fontWeight="600" opacity="0.75">
              Kecamatan Melati Jaya
            </text>
            <text x="100" y="440" fill="#64748B" fontSize="13" fontWeight="600" opacity="0.75">
              Kecamatan Karangrejo
            </text>

            {/* Poligon Interaktif (Translucent Overlay untuk menangkap interaksi hover & reaktivitas warna saat filter berubah) */}
            {regions.map((reg) => {
              const isHovered = hoveredRegion?.id === reg.id;
              return (
                <g
                  key={reg.id}
                  onMouseEnter={() => setHoveredRegion(reg)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  className="cursor-pointer"
                >
                  {/* Highlight overlay saat difilter atau dihover */}
                  <path
                    d={reg.d}
                    fill={reg.fill}
                    fillOpacity={isHovered ? 0.45 : 0.22}
                    stroke={isHovered ? '#BE123C' : reg.stroke}
                    strokeWidth={isHovered ? 3 : 1.5}
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                  />

                  {/* Label Nama Desa Sesuai Desain Figma */}
                  <text
                    x={reg.labelX}
                    y={reg.labelY}
                    textAnchor="middle"
                    fill="#1E293B"
                    fontSize={isCompact ? '13' : '15'}
                    fontWeight="800"
                    className="pointer-events-none select-none drop-shadow-xs"
                  >
                    {reg.shortName}
                  </text>
                  <text
                    x={reg.labelX}
                    y={reg.labelY + 16}
                    textAnchor="middle"
                    fill="#475569"
                    fontSize={isCompact ? '11' : '12'}
                    fontWeight="700"
                    className="pointer-events-none select-none"
                  >
                    ({reg.kasus} kasus)
                  </text>
                </g>
              );
            })}

            {/* Titik Posyandu dari Desain Figma: Kuning, Hijau, dan Ring Putih */}
            {regions.map((reg) => (
              <g key={`pos-${reg.id}`} className="pointer-events-none">
                {reg.posyandus.map((p, idx) => {
                  if (p.type === 'ring') {
                    return (
                      <circle
                        key={`pt-${reg.id}-${idx}`}
                        cx={p.x}
                        cy={p.y}
                        r={8}
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth={2.5}
                        className="drop-shadow-xs"
                      />
                    );
                  }
                  if (p.type === 'green') {
                    return (
                      <circle
                        key={`pt-${reg.id}-${idx}`}
                        cx={p.x}
                        cy={p.y}
                        r={5.5}
                        fill="#10B981"
                        stroke="#FFFFFF"
                        strokeWidth={2}
                        className="drop-shadow-xs"
                      />
                    );
                  }
                  // default yellow
                  return (
                    <circle
                      key={`pt-${reg.id}-${idx}`}
                      cx={p.x}
                      cy={p.y}
                      r={5.5}
                      fill="#FACC15"
                      stroke="#FFFFFF"
                      strokeWidth={2}
                      className="drop-shadow-xs"
                    />
                  );
                })}
              </g>
            ))}
          </svg>
        </div>
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

