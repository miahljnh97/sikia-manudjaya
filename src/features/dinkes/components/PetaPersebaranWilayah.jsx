import React, { useState, useMemo } from 'react';

// Fungsi penentuan warna dan kontras teks berdasarkan jumlah kasus & indikator
function getColorForKasus(kasus, selectedIndikator) {
  if (selectedIndikator === 'Ibu Hamil Berisiko') {
    if (kasus > 30) return { fill: '#EA580C', textColor: '#FFFFFF' };
    if (kasus >= 21) return { fill: '#FB923C', textColor: '#FFFFFF' };
    if (kasus >= 11) return { fill: '#FDBA74', textColor: '#7C2D12' };
    if (kasus >= 6) return { fill: '#FED7AA', textColor: '#7C2D12' };
    return { fill: '#FFF7ED', textColor: '#7C2D12' };
  }
  if (selectedIndikator === 'Cakupan Imunisasi Rendah') {
    if (kasus > 30) return { fill: '#E6007A', textColor: '#FFFFFF' };
    if (kasus >= 21) return { fill: '#FF52AB', textColor: '#FFFFFF' };
    if (kasus >= 11) return { fill: '#FF80C2', textColor: '#701A75' };
    if (kasus >= 6) return { fill: '#FFA8D5', textColor: '#701A75' };
    return { fill: '#FFDFF1', textColor: '#701A75' };
  }
  // Default: Kasus Stunting (Balita) - Skala Rose / Pink Sesuai Gambar Figma
  if (kasus > 30) return { fill: '#BE123C', textColor: '#FFFFFF' };
  if (kasus >= 21) return { fill: '#FB7185', textColor: '#FFFFFF' };
  if (kasus >= 11) return { fill: '#FDA4AF', textColor: '#334155' };
  if (kasus >= 6) return { fill: '#FECDD3', textColor: '#334155' };
  return { fill: '#FFF1F2', textColor: '#334155' };
}

export default function PetaPersebaranWilayah({
  height = '260px',
  isCompact = false,
  selectedIndikator = 'Kasus Stunting (Balita)',
  onIndikatorChange = null,
  showDropdownInside = false
}) {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // 5 Tingkatan Legenda Kasus Sesuai Desain Figma (Expected Result)
  const legendItems = useMemo(() => {
    if (selectedIndikator === 'Ibu Hamil Berisiko') {
      return [
        { label: '> 30', color: '#EA580C' },
        { label: '21 - 30', color: '#FB923C' },
        { label: '11 - 20', color: '#FDBA74' },
        { label: '6 - 10', color: '#FED7AA' },
        { label: '0 - 5', color: '#FFF7ED' }
      ];
    }
    if (selectedIndikator === 'Cakupan Imunisasi Rendah') {
      return [
        { label: '> 30', color: '#E6007A' },
        { label: '21 - 30', color: '#FF52AB' },
        { label: '11 - 20', color: '#FF80C2' },
        { label: '6 - 10', color: '#FFA8D5' },
        { label: '0 - 5', color: '#FFDFF1' }
      ];
    }
    // Default Stunting (Balita)
    return [
      { label: '> 30', color: '#BE123C' },
      { label: '21 - 30', color: '#FB7185' },
      { label: '11 - 20', color: '#FDA4AF' },
      { label: '6 - 10', color: '#FECDD3' },
      { label: '0 - 5', color: '#FFF1F2' }
    ];
  }, [selectedIndikator]);

  // Data 5 Wilayah Desa dengan Poligon Organik Sesuai Desain Figma
  const rawRegions = useMemo(() => [
    {
      id: 'soreang-baru',
      nama: 'Desa Soreang Baru',
      shortName: 'Desa Soreang Baru',
      labelX: 242,
      labelY: 90,
      d: "M 185,105 L 183.4,100 L 177,93.9 L 180.4,87.7 L 174,81.5 L 177.3,75.4 L 177.4,69.5 L 183.2,65.3 L 183.2,59.3 L 189.1,55.1 L 191.6,49.8 L 198.8,47.8 L 202.9,43.3 L 210.8,42.8 L 215.8,39.6 L 223.7,40.6 L 227.6,44.9 L 235.1,43.4 L 238.1,49.1 L 246.1,49.1 L 249.7,44.7 L 257.6,44.2 L 261.7,39.6 L 269.4,41 L 273.9,45.8 L 281.8,46.7 L 286.9,51 L 293.7,56.2 L 297.8,62.3 L 303.4,68.9 L 305.6,76.1 L 309.8,83.4 L 309.7,90.9 L 312.1,98.1 L 309.7,104.9 L 309.8,112.4 L 305.4,118.8 L 303.8,126 L 297.8,128.5 L 294.6,134.7 L 285,125 L 245,145 Z",
      kasusMap: {
        'Kasus Stunting (Balita)': 18,
        'Ibu Hamil Berisiko': 9,
        'Cakupan Imunisasi Rendah': 34
      }
    },
    {
      id: 'manud-jaya',
      nama: 'Desa Manud Jaya',
      shortName: 'Desa Manud Jaya',
      labelX: 308,
      labelY: 180,
      d: "M 245,145 L 285,125 L 290.7,123.6 L 297,128.8 L 303,124.9 L 309.1,130.2 L 315.4,127.3 L 320.9,133.4 L 327.6,131.5 L 332.6,138.2 L 339.7,137.3 L 344.2,144.5 L 351.6,144.9 L 355.3,152.6 L 362.8,154.3 L 365.4,162.4 L 372.4,165.7 L 373.4,174.1 L 379.7,178.6 L 378.8,187 L 383.9,192.7 L 381.1,201 L 384.6,207.7 L 379.9,215.3 L 381.6,223.3 L 375.4,229.4 L 375.2,237.7 L 367.6,242 L 365.7,250.2 L 356.5,251.9 L 353.4,259.9 L 343.4,258.9 L 339.2,266.6 L 329.4,263.8 L 325,252 L 260,205 Z",
      kasusMap: {
        'Kasus Stunting (Balita)': 32,
        'Ibu Hamil Berisiko': 16,
        'Cakupan Imunisasi Rendah': 25
      }
    },
    {
      id: 'mandai-jaya',
      nama: 'Desa Mandai Jaya',
      shortName: 'Desa Mandai Jaya',
      labelX: 195,
      labelY: 170,
      d: "M 165,240 L 160.7,235.8 L 153.9,239.5 L 149.6,235.3 L 144.4,226.5 L 138.4,228.3 L 134.6,218.4 L 129.5,219 L 127.4,208.7 L 123.6,207.9 L 123.4,197.6 L 120.9,195.4 L 122.7,185.2 L 121.7,181.7 L 125.1,171.7 L 125.6,167 L 130.6,157.9 L 133,154 L 139.7,146.5 L 142.2,142.5 L 149.3,135.5 L 150.3,129.4 L 159.2,125.7 L 163,118.9 L 171.7,116.1 L 175.7,109.3 L 185,105 L 245,145 L 260,205 L 230,235 Z",
      kasusMap: {
        'Kasus Stunting (Balita)': 8,
        'Ibu Hamil Berisiko': 12,
        'Cakupan Imunisasi Rendah': 17
      }
    },
    {
      id: 'purnama',
      nama: 'Desa Purnama',
      shortName: 'Desa Purnama',
      labelX: 190,
      labelY: 280,
      d: "M 230,235 L 232,335 L 227.8,337.8 L 222.1,337.9 L 217.4,342.3 L 212.1,340.9 L 206.9,344.6 L 202.2,341.6 L 196.4,343.8 L 192.6,339.5 L 186.2,340 L 183.5,334.6 L 177,333.3 L 175.7,327.1 L 169.8,324 L 170.1,317.5 L 165.2,312.9 L 167.3,306.6 L 163.6,300.9 L 167.4,295.5 L 165.1,288.9 L 170.4,284.9 L 169.7,277.9 L 176.4,275.6 L 177.3,268.6 L 184.8,268.1 L 187.3,261.6 L 178.6,259.4 L 174,254.4 L 173.3,246.6 L 165,240 Z",
      kasusMap: {
        'Kasus Stunting (Balita)': 5,
        'Ibu Hamil Berisiko': 2,
        'Cakupan Imunisasi Rendah': 5
      }
    },
    {
      id: 'melati',
      nama: 'Desa Melati',
      shortName: 'Desa Melati',
      labelX: 278,
      labelY: 270,
      d: "M 260,205 L 325,252 L 326.8,257.7 L 333,263.2 L 332.9,269.9 L 337.5,276.4 L 335.6,283.3 L 338.4,290.7 L 334.5,297.8 L 335.3,305.6 L 329.5,311.7 L 328.2,319.6 L 320.6,324 L 316.9,331.4 L 308.2,333.5 L 303.1,339.8 L 293.7,339.4 L 287.4,344.4 L 277.6,341.4 L 270.4,344.5 L 260.6,339.2 L 253.2,340.5 L 243.7,333.3 L 236.9,333.2 L 232,335 L 230,235 Z",
      kasusMap: {
        'Kasus Stunting (Balita)': 6,
        'Ibu Hamil Berisiko': 4,
        'Cakupan Imunisasi Rendah': 3
      }
    }
  ], []);

  // Garis Pemisah Putih Putus-putus Antar-Desa (Sesuai Desain Figma)
  const interiorDividers = [
    'M 185,105 L 245,145',
    'M 285,125 L 245,145',
    'M 245,145 L 260,205',
    'M 260,205 L 325,252',
    'M 260,205 L 230,235',
    'M 165,240 L 230,235',
    'M 230,235 L 232,335'
  ];

  // Hitung kasus & pewarnaan dinamis
  const regions = useMemo(() => {
    return rawRegions.map((reg) => {
      const kasus = reg.kasusMap[selectedIndikator] ?? reg.kasusMap['Kasus Stunting (Balita)'];
      const { fill, textColor } = getColorForKasus(kasus, selectedIndikator);
      return {
        ...reg,
        kasus,
        fill,
        textColor
      };
    });
  }, [rawRegions, selectedIndikator]);

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 select-none bg-white relative">
      
      {/* Optional dropdown bila diaktifkan */}
      {showDropdownInside && !isCompact && (
        <div className="absolute top-0 right-0 z-10">
          <select
            value={selectedIndikator}
            onChange={(e) => onIndikatorChange && onIndikatorChange(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="Kasus Stunting (Balita)">Kasus Stunting (Balita)</option>
            <option value="Ibu Hamil Berisiko">Ibu Hamil Berisiko</option>
            <option value="Cakupan Imunisasi Rendah">Cakupan Imunisasi Rendah</option>
          </select>
        </div>
      )}

      {/* 1. Legenda Jumlah Kasus di Sisi Kiri (Sesuai Expected Result) */}
      <div className="shrink-0 space-y-1.5 self-start pt-2 pl-1 sm:pl-2">
        <span className="block font-semibold text-slate-700 text-xs mb-2">
          Jumlah Kasus
        </span>
        <div className="space-y-1.5">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-xs shrink-0 border border-slate-200/90"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600 font-medium text-[11px]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Gambar Vektor Peta 5 Wilayah Desa (Sesuai Expected Result) */}
      <div className="flex-1 w-full flex items-center justify-center overflow-visible" style={{ height }}>
        <svg
          viewBox="110 25 285 330"
          className="w-full h-full max-h-[300px] transition-transform duration-200 ease-out"
        >
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
                  className="transition-all duration-200 hover:brightness-95"
                />

                {/* Label Nama Desa */}
                <text
                  x={reg.labelX}
                  y={reg.labelY}
                  textAnchor="middle"
                  fill={reg.textColor}
                  fontSize="11"
                  fontWeight="bold"
                  className="pointer-events-none select-none drop-shadow-2xs"
                >
                  {reg.shortName}
                </text>

                {/* Label Jumlah Kasus */}
                <text
                  x={reg.labelX}
                  y={reg.labelY + 14}
                  textAnchor="middle"
                  fill={reg.textColor}
                  fontSize="10"
                  fontWeight="500"
                  opacity={reg.textColor === '#FFFFFF' ? 1 : 0.9}
                  className="pointer-events-none select-none"
                >
                  {reg.kasus} kasus
                </text>
              </g>
            );
          })}

          {/* Garis Pembatas Putih Putus-putus Antar-Desa Sesuai Desain Figma */}
          {interiorDividers.map((dStr, idx) => (
            <path
              key={`divider-${idx}`}
              d={dStr}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeDasharray="3 3"
              className="pointer-events-none"
            />
          ))}
        </svg>
      </div>

      {/* Tooltip Hover Wilayah Interaktif */}
      {hoveredRegion && (
        <div className="absolute bottom-2 right-4 z-20 bg-slate-900/90 text-white rounded-xl px-3 py-1.5 text-xs shadow-lg backdrop-blur-xs pointer-events-none animate-in fade-in duration-100">
          <p className="font-bold">{hoveredRegion.nama}</p>
          <p className="text-[11px] text-rose-200">
            {hoveredRegion.kasus} kasus {selectedIndikator.toLowerCase()}
          </p>
        </div>
      )}

    </div>
  );
}
