import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function LaporanCharts({ trenKunjungan = [], statusImunisasi = {} }) {
  const [imunisasiFilter, setImunisasiFilter] = useState('Imunisasi Balita');
  const [hoveredBar, setHoveredBar] = useState(null);

  // Normalisasi data tren 10 bulan (Jan - Okt)
  const months = trenKunjungan && trenKunjungan.length > 0
    ? trenKunjungan.slice(0, 10)
    : [
        { bulan: 'Jan', balita: 0, ibuHamil: 0, ibuNifas: 0, total: 0 },
        { bulan: 'Feb', balita: 0, ibuHamil: 0, ibuNifas: 0, total: 0 },
        { bulan: 'Mar', balita: 0, ibuHamil: 0, ibuNifas: 0, total: 0 },
        { bulan: 'Apr', balita: 0, ibuHamil: 0, ibuNifas: 0, total: 0 },
        { bulan: 'Mei', balita: 0, ibuHamil: 0, ibuNifas: 0, total: 0 },
        { bulan: 'Jun', balita: 0, ibuHamil: 0, ibuNifas: 0, total: 0 },
        { bulan: 'Jul', balita: 0, ibuHamil: 0, ibuNifas: 0, total: 0 },
        { bulan: 'Agu', balita: 0, ibuHamil: 0, ibuNifas: 0, total: 0 },
        { bulan: 'Sep', balita: 0, ibuHamil: 0, ibuNifas: 0, total: 0 },
        { bulan: 'Okt', balita: 0, ibuHamil: 0, ibuNifas: 0, total: 0 },
      ];

  // Hitung nilai maksimum untuk skala sumbu Y (kelipatan 10 atau minimal 40)
  const maxTotal = Math.max(...months.map((m) => m.total || 0), 20);
  const yMax = Math.ceil(maxTotal / 10) * 10;
  const ySteps = [yMax, Math.round(yMax * 0.75), Math.round(yMax * 0.5), Math.round(yMax * 0.25), 0];

  // Data status imunisasi
  const totalImun = statusImunisasi?.total || 0;
  const lengkap = statusImunisasi?.lengkap || 0;
  const belumLengkap = statusImunisasi?.belumLengkap || 0;
  const belumImun = statusImunisasi?.belumImunisasi || 0;

  // Kalkulasi persentase untuk Donut Chart SVG stroke-dasharray
  const circumference = 2 * Math.PI * 40; // r = 40 => ~251.32
  const pctLengkap = totalImun > 0 ? (lengkap / totalImun) : 0.6;
  const pctBelumLengkap = totalImun > 0 ? (belumLengkap / totalImun) : 0.25;
  const pctBelum = totalImun > 0 ? (belumImun / totalImun) : 0.15;

  const strokeLengkap = pctLengkap * circumference;
  const strokeBelumLengkap = pctBelumLengkap * circumference;
  const strokeBelum = pctBelum * circumference;

  const offsetLengkap = 0;
  const offsetBelumLengkap = -strokeLengkap;
  const offsetBelum = -(strokeLengkap + strokeBelumLengkap);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Grafik Tren Kunjungan Posyandu (7 kolom) */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Tren Kunjungan Posyandu
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Distribusi kunjungan bulanan berdasarkan jenis peserta
            </p>
          </div>

          {/* Legenda Kategori */}
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]" />
              Balita
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7]" />
              Ibu Hamil
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBCFE8]" />
              Ibu Nifas
            </span>
          </div>
        </div>

        {/* Visualisasi Grafik Stacked Bar */}
        <div className="relative pt-6 pb-2">
          {/* Garis Horizontal Sumbu Y */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pr-2">
            {ySteps.map((val, idx) => (
              <div key={idx} className="flex items-center w-full">
                <span className="text-[10px] text-slate-400 w-6 text-right pr-2">
                  {val}
                </span>
                <div className="flex-1 border-b border-dashed border-slate-100" />
              </div>
            ))}
          </div>

          {/* Batang Bar Chart */}
          <div className="ml-7 grid grid-cols-10 gap-2 sm:gap-3 items-end h-48 sm:h-52 z-10 relative pb-7">
            {months.map((item, idx) => {
              const total = item.total || 0;
              const hTotal = yMax > 0 ? (total / yMax) * 100 : 0;
              const hBalita = total > 0 ? ((item.balita || 0) / total) * 100 : 0;
              const hIbuHamil = total > 0 ? ((item.ibuHamil || 0) / total) * 100 : 0;
              const hIbuNifas = total > 0 ? ((item.ibuNifas || 0) / total) * 100 : 0;

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                  onMouseEnter={() => setHoveredBar(item)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Tooltip Hover */}
                  {hoveredBar?.bulan === item.bulan && (
                    <div className="absolute -top-16 bg-slate-900 text-white text-[10px] py-1.5 px-2.5 rounded-xl shadow-lg z-30 whitespace-nowrap pointer-events-none animate-fadeIn">
                      <p className="font-bold border-b border-slate-700 pb-0.5 mb-1">{item.bulan}: {total} Kunjungan</p>
                      <p className="text-rose-300">Balita: {item.balita || 0}</p>
                      <p className="text-purple-300">Ibu Hamil: {item.ibuHamil || 0}</p>
                      <p className="text-pink-300">Ibu Nifas: {item.ibuNifas || 0}</p>
                    </div>
                  )}

                  {/* Stacked Bar */}
                  <div
                    className="w-full max-w-[20px] rounded-t-md overflow-hidden flex flex-col-reverse transition-all duration-300 group-hover:brightness-95 shadow-2xs"
                    style={{ height: `${Math.max(hTotal, total > 0 ? 6 : 2)}%` }}
                  >
                    {total === 0 ? (
                      <div className="w-full h-1 bg-slate-100 rounded-xs" />
                    ) : (
                      <>
                        <div style={{ height: `${hBalita}%` }} className="w-full bg-[#F43F5E]" />
                        <div style={{ height: `${hIbuHamil}%` }} className="w-full bg-[#A855F7]" />
                        <div style={{ height: `${hIbuNifas}%` }} className="w-full bg-[#FBCFE8]" />
                      </>
                    )}
                  </div>

                  {/* Label Nama Bulan */}
                  <span className="text-[10px] font-medium text-slate-500 absolute -bottom-5">
                    {item.bulan}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Donut Chart Status Imunisasi Balita (5 kolom) */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            Status Imunisasi Balita
          </h3>

          <div className="relative">
            <button
              type="button"
              className="text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{imunisasiFilter}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Lingkaran Donut Chart & Legend */}
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4 flex-1">
          {/* SVG Donut */}
          <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#F1F5F9"
                strokeWidth="12"
              />

              {/* Segmen 1: Lengkap (Rose) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#E11D48"
                strokeWidth="12"
                strokeDasharray={`${strokeLengkap} ${circumference}`}
                strokeDashoffset={offsetLengkap}
                strokeLinecap="round"
                className="transition-all duration-700"
              />

              {/* Segmen 2: Belum Lengkap (Indigo) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#818CF8"
                strokeWidth="12"
                strokeDasharray={`${strokeBelumLengkap} ${circumference}`}
                strokeDashoffset={offsetBelumLengkap}
                className="transition-all duration-700"
              />

              {/* Segmen 3: Belum Imunisasi (Peach) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#FED7AA"
                strokeWidth="12"
                strokeDasharray={`${strokeBelum} ${circumference}`}
                strokeDashoffset={offsetBelum}
                className="transition-all duration-700"
              />
            </svg>

            {/* Label Angka Tengah */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                {totalImun}
              </span>
              <span className="text-[11px] font-medium text-slate-400 mt-1">
                Total Imunisasi
              </span>
            </div>
          </div>

          {/* Legenda Donut */}
          <div className="space-y-3 text-xs font-medium text-slate-600 w-full sm:w-auto">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
                <span>Lengkap</span>
              </span>
              <span className="text-slate-400 font-semibold">{lengkap}</span>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#818CF8]" />
                <span>Belum Lengkap</span>
              </span>
              <span className="text-slate-400 font-semibold">{belumLengkap}</span>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FED7AA]" />
                <span>Belum Imunisasi</span>
              </span>
              <span className="text-slate-400 font-semibold">{belumImun}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
