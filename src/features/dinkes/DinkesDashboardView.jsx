import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Baby, 
  Smile, 
  Heart, 
  Sparkles, 
  ArrowUpRight, 
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import DinkesFilterBar from './components/DinkesFilterBar';
import PetaPersebaranWilayah from './components/PetaPersebaranWilayah';
import { dinkesService } from '../../services/dinkesService';

export default function DinkesDashboardView({ onNavigate }) {
  const [filters, setFilters] = useState({
    periode: 'Oktober 2024',
    kecamatan: 'Semua Kecamatan',
    desa: 'Semua Desa',
    posyandu: 'Semua Posyandu'
  });

  const [stats, setStats] = useState({
    totalPosyandu: 26,
    totalPosyanduTarget: 28,
    posyanduTrend: '+4%',
    totalKunjungan: 1248,
    kunjunganTrend: '+12%',
    bayiDitimbang: 1036,
    bayiPersenSasaran: 83,
    bayiTrend: '+9%',
    balitaDitimbang: 892,
    balitaPersenSasaran: 72,
    balitaTrend: '+11%',
    ibuHamilDiperiksa: 168,
    ibuHamilPersenSasaran: 89,
    ibuHamilTrend: '+6%',
    ibuNifas: 72,
    ibuNifasPersenSasaran: 77,
    ibuNifasTrend: '+7%'
  });

  const [trenKategori, setTrenKategori] = useState('Semua');
  const [topPosyanduList, setTopPosyanduList] = useState([]);
  const [ibuRisikoList, setIbuRisikoList] = useState([]);
  const [balitaStuntingList, setBalitaStuntingList] = useState([]);
  const [trenData, setTrenData] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const loadAll = async () => {
      try {
        const [statsRes, topRes, ibuRes, balitaRes, trenRes] = await Promise.all([
          dinkesService.getDashboardStats(),
          dinkesService.getTopPosyandu(),
          dinkesService.getIbuHamilRisiko(),
          dinkesService.getBalitaStunting(),
          dinkesService.getTrenKunjungan()
        ]);
        if (!isMounted) return;
        if (statsRes) setStats(statsRes);
        if (topRes) setTopPosyanduList(topRes);
        if (ibuRes) setIbuRisikoList(ibuRes.slice(0, 5));
        if (balitaRes) setBalitaStuntingList(balitaRes.slice(0, 5));
        if (trenRes) setTrenData(trenRes);
      } catch (err) {
        console.warn('Gagal memuat data dashboard dinkes:', err);
      }
    };
    loadAll();
    return () => { isMounted = false; };
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* ==================================================================== */}
      {/* 1. Header & Filter Bar                                              */}
      {/* ==================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Rekapitulasi Posyandu
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ringkasan data kesehatan ibu dan anak di wilayah kerja
          </p>
        </div>

        <DinkesFilterBar filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* ==================================================================== */}
      {/* 2. Enam Stat Cards (Sesuai Desain Figma Gambar 1)                   */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Total Posyandu Aktif */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-pink-50 text-rose-600 flex items-center justify-center">
            <Building2 size={16} />
          </div>
          <div>
            <span className="block text-[11px] text-slate-500 font-medium">Total Posyandu Aktif</span>
            <span className="block text-xl font-bold text-slate-900 leading-tight mt-0.5">
              {stats.totalPosyandu}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
            <ArrowUpRight size={12} />
            <span>{stats.posyanduTrend}</span>
            <span className="text-slate-400 font-normal">Dari {stats.totalPosyanduTarget} Posyandu</span>
          </div>
        </div>

        {/* Card 2: Total Kunjungan */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users size={16} />
          </div>
          <div>
            <span className="block text-[11px] text-slate-500 font-medium">Total Kunjungan</span>
            <span className="block text-xl font-bold text-slate-900 leading-tight mt-0.5">
              {stats.totalKunjungan.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
            <ArrowUpRight size={12} />
            <span>{stats.kunjunganTrend}</span>
            <span className="text-slate-400 font-normal">Dari bulan lalu</span>
          </div>
        </div>

        {/* Card 3: Bayi Ditimbang */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Baby size={16} />
          </div>
          <div>
            <span className="block text-[11px] text-slate-500 font-medium">Bayi Ditimbang</span>
            <span className="block text-xl font-bold text-slate-900 leading-tight mt-0.5">
              {stats.bayiDitimbang.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
            <ArrowUpRight size={12} />
            <span>{stats.bayiTrend}</span>
            <span className="text-slate-400 font-normal">{stats.bayiPersenSasaran}% sasaran</span>
          </div>
        </div>

        {/* Card 4: Balita Ditimbang */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Smile size={16} />
          </div>
          <div>
            <span className="block text-[11px] text-slate-500 font-medium">Balita Ditimbang</span>
            <span className="block text-xl font-bold text-slate-900 leading-tight mt-0.5">
              {stats.balitaDitimbang.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
            <ArrowUpRight size={12} />
            <span>{stats.balitaTrend}</span>
            <span className="text-slate-400 font-normal">{stats.balitaPersenSasaran}% sasaran</span>
          </div>
        </div>

        {/* Card 5: Ibu Hamil Diperiksa */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Heart size={16} />
          </div>
          <div>
            <span className="block text-[11px] text-slate-500 font-medium">Ibu Hamil Diperiksa</span>
            <span className="block text-xl font-bold text-slate-900 leading-tight mt-0.5">
              {stats.ibuHamilDiperiksa.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
            <ArrowUpRight size={12} />
            <span>{stats.ibuHamilTrend}</span>
            <span className="text-slate-400 font-normal">{stats.ibuHamilPersenSasaran}% sasaran</span>
          </div>
        </div>

        {/* Card 6: Ibu Nifas & Menyusui */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div>
            <span className="block text-[11px] text-slate-500 font-medium">Ibu Nifas & Menyusui</span>
            <span className="block text-xl font-bold text-slate-900 leading-tight mt-0.5">
              {stats.ibuNifas.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
            <ArrowUpRight size={12} />
            <span>{stats.ibuNifasTrend}</span>
            <span className="text-slate-400 font-normal">{stats.ibuNifasPersenSasaran}% sasaran</span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. Baris Grafik Tren & Peta Persebaran Mini                         */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Tren Kunjungan Posyandu (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Tren Kunjungan Posyandu</h3>
              <p className="text-[11px] text-slate-400">Statistik kunjungan bulanan tahun berjalan</p>
            </div>

            {/* Filter Pills Kategori */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/80 text-[11px] font-semibold">
              {['Semua', 'Balita', 'Ibu Hamil', 'Ibu Nifas'].map((kat) => (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setTrenKategori(kat)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    trenKategori === kat
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="h-64 w-full relative pt-2">
            <svg viewBox="0 0 540 200" className="w-full h-full overflow-visible">
              {/* Horizontal Grid lines */}
              <line x1="30" y1="20" x2="520" y2="20" stroke="#F1F5F9" strokeDasharray="3 3" />
              <line x1="30" y1="60" x2="520" y2="60" stroke="#F1F5F9" strokeDasharray="3 3" />
              <line x1="30" y1="100" x2="520" y2="100" stroke="#F1F5F9" strokeDasharray="3 3" />
              <line x1="30" y1="140" x2="520" y2="140" stroke="#F1F5F9" strokeDasharray="3 3" />
              <line x1="30" y1="175" x2="520" y2="175" stroke="#E2E8F0" />

              {/* Y-axis labels */}
              <text x="5" y="24" fontSize="9" fill="#94A3B8" fontWeight="500">400</text>
              <text x="5" y="64" fontSize="9" fill="#94A3B8" fontWeight="500">300</text>
              <text x="5" y="104" fontSize="9" fill="#94A3B8" fontWeight="500">200</text>
              <text x="5" y="144" fontSize="9" fill="#94A3B8" fontWeight="500">100</text>
              <text x="15" y="179" fontSize="9" fill="#94A3B8" fontWeight="500">0</text>

              {/* Line 1: Total Kunjungan (Pink/Rose) */}
              {(trenKategori === 'Semua') && (
                <path
                  d="M 50,75 L 90,68 L 130,62 L 170,60 L 210,55 L 250,52 L 290,50 L 330,48 L 370,45 L 410,40 L 450,38 L 490,35"
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="2.5"
                />
              )}

              {/* Line 2: Balita (Blue) */}
              {(trenKategori === 'Semua' || trenKategori === 'Balita') && (
                <path
                  d="M 50,110 L 90,105 L 130,98 L 170,95 L 210,92 L 250,90 L 290,88 L 330,86 L 370,85 L 410,80 L 450,78 L 490,75"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
              )}

              {/* Line 3: Ibu Hamil (Amber) */}
              {(trenKategori === 'Semua' || trenKategori === 'Ibu Hamil') && (
                <path
                  d="M 50,148 L 90,145 L 130,140 L 170,140 L 210,138 L 250,137 L 290,137 L 330,138 L 370,139 L 410,140 L 450,138 L 490,137"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                />
              )}

              {/* Line 4: Ibu Nifas (Purple) */}
              {(trenKategori === 'Semua' || trenKategori === 'Ibu Nifas') && (
                <path
                  d="M 50,160 L 90,160 L 130,160 L 170,160 L 210,158 L 250,158 L 290,157 L 330,155 L 370,150 L 410,149 L 450,148 L 490,147"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
              )}

              {/* Data point dot & Tooltip preview on Oktober */}
              <circle cx="410" cy="40" r="4.5" fill="#F43F5E" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="410" cy="80" r="4" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="410" cy="140" r="4" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="410" cy="149" r="3.5" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="2" />

              {/* X-axis labels */}
              {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map((m, idx) => (
                <text
                  key={m}
                  x={50 + idx * 40}
                  y="192"
                  textAnchor="middle"
                  fontSize="9"
                  fill="#94A3B8"
                  fontWeight="600"
                >
                  {m}
                </text>
              ))}
            </svg>
          </div>

          {/* Chart Legends */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]" />
              <span>Total Kunjungan</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
              <span>Balita</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span>Ibu Hamil</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
              <span>Ibu Nifas</span>
            </span>
          </div>
        </div>

        {/* Kolom Kanan: Peta Persebaran Kesehatan Ibu dan Anak Mini (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Peta Persebaran Kesehatan Ibu dan Anak</h3>
              <p className="text-[11px] text-slate-400">Indikator: Kasus Stunting (Balita)</p>
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('/persebaran-wilayah')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
              >
                <span>Perbesar</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>

          <div className="flex-1 min-h-[220px]">
            <PetaPersebaranWilayah height="240px" isCompact={true} />
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. Tabel: Top 5 Posyandu dengan Kunjungan Tertinggi                  */}
      {/* ==================================================================== */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Top 5 Posyandu dengan Kunjungan Tertinggi</h3>
            <p className="text-[11px] text-slate-400">Peringkat fasilitas dengan aktivitas pelayanan teraktif</p>
          </div>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('/persebaran-wilayah')}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              Lihat Semua
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/60 text-slate-600 font-bold border-b border-slate-100 whitespace-nowrap">
                <th className="py-3 px-4 w-10">No</th>
                <th className="py-3 px-4">Nama Posyandu</th>
                <th className="py-3 px-4">Desa/Kelurahan</th>
                <th className="py-3 px-4 text-center">Total Kunjungan</th>
                <th className="py-3 px-4 text-center">Total Pasien</th>
                <th className="py-3 px-4 text-center">Total Bayi</th>
                <th className="py-3 px-4 text-center">Total Balita</th>
                <th className="py-3 px-4 text-center">Total Ibu Hamil</th>
                <th className="py-3 px-4 text-center">Total Ibu Nifas</th>
                <th className="py-3 px-4 text-center">Tren Kunjungan</th>
                <th className="py-3 px-4 text-right">Terakhir Diperbarui</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 whitespace-nowrap">
              {topPosyanduList.map((item) => (
                <tr key={item.no} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 text-slate-400 font-medium">{item.no}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{item.nama}</td>
                  <td className="py-3 px-4 text-slate-600">{item.desa}</td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-900">{item.totalKunjungan}</td>
                  <td className="py-3 px-4 text-center">{item.totalPasien}</td>
                  <td className="py-3 px-4 text-center">{item.totalBayi}</td>
                  <td className="py-3 px-4 text-center">{item.totalBalita}</td>
                  <td className="py-3 px-4 text-center">{item.totalIbuHamil}</td>
                  <td className="py-3 px-4 text-center">{item.totalIbuNifas}</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">{item.trend}</td>
                  <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px]">{item.terakhirDiperbarui}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 5. Baris Bawah: Risiko & Widgets (Imunisasi & Pertumbuhan)           */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Tabel Preview Ibu Hamil Risiko & Balita Stunting (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sub-Tabel 1: Ibu Hamil Berisiko Tinggi */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Ibu Hamil Berisiko Tinggi</h3>
                <p className="text-[11px] text-slate-400">Ibu hamil dengan faktor risiko klinis yang perlu pemantauan</p>
              </div>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('/pemantauan-risiko')}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  Lihat Semua
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 text-slate-600 font-bold border-b border-slate-100 whitespace-nowrap">
                    <th className="py-2.5 px-3 w-8">No.</th>
                    <th className="py-2.5 px-3">Nama Ibu</th>
                    <th className="py-2.5 px-3">Usia Kehamilan</th>
                    <th className="py-2.5 px-3">Hasil Pemeriksaan Terakhir</th>
                    <th className="py-2.5 px-3">Posyandu</th>
                    <th className="py-2.5 px-3">Tanggal Periksa</th>
                    <th className="py-2.5 px-3 text-right">Status Tindak Lanjut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 whitespace-nowrap">
                  {ibuRisikoList.map((row) => {
                    let badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
                    if (row.statusTindakLanjut === 'Perlu Tindak Lanjut') {
                      badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
                    } else if (row.statusTindakLanjut === 'Rujuk') {
                      badgeClass = 'bg-purple-50 text-purple-700 border-purple-200';
                    }
                    return (
                      <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 text-slate-400">{row.no}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{row.namaIbu}</td>
                        <td className="py-2.5 px-3">{row.usiaKehamilan}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{row.hasilPemeriksaan}</td>
                        <td className="py-2.5 px-3 text-slate-500">{row.posyandu}</td>
                        <td className="py-2.5 px-3 text-slate-500">{row.tanggalPeriksa}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border shrink-0 ${badgeClass}`}>
                            {row.statusTindakLanjut}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sub-Tabel 2: Balita dengan Indikasi Stunting */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Balita dengan Indikasi Stunting</h3>
                <p className="text-[11px] text-slate-400">Balita dengan status gizi kurang / sangat pendek</p>
              </div>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('/pemantauan-risiko')}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  Lihat Semua
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 text-slate-600 font-bold border-b border-slate-100 whitespace-nowrap">
                    <th className="py-2.5 px-3 w-8">No.</th>
                    <th className="py-2.5 px-3">Nama Anak</th>
                    <th className="py-2.5 px-3">Usia</th>
                    <th className="py-2.5 px-3">Jenis Kelamin</th>
                    <th className="py-2.5 px-3">Hasil Ukur Terakhir</th>
                    <th className="py-2.5 px-3">Posyandu</th>
                    <th className="py-2.5 px-3">Tanggal Ukur</th>
                    <th className="py-2.5 px-3 text-right">Status Tindak Lanjut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 whitespace-nowrap">
                  {balitaStuntingList.map((row) => {
                    let badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
                    if (row.statusTindakLanjut === 'Perlu Tindak Lanjut') {
                      badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
                    } else if (row.statusTindakLanjut === 'Rujuk') {
                      badgeClass = 'bg-purple-50 text-purple-700 border-purple-200';
                    }
                    return (
                      <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 text-slate-400">{row.no}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{row.namaAnak}</td>
                        <td className="py-2.5 px-3">{row.usia}</td>
                        <td className="py-2.5 px-3 text-slate-500">{row.jenisKelamin}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{row.hasilUkur}</td>
                        <td className="py-2.5 px-3 text-slate-500">{row.posyandu}</td>
                        <td className="py-2.5 px-3 text-slate-500">{row.tanggalUkur}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border shrink-0 ${badgeClass}`}>
                            {row.statusTindakLanjut}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Donut Imunisasi & Bar Pertumbuhan (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Widget 1: Donut Imunisasi */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Imunisasi</h3>
              <select className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-medium text-slate-600 outline-none">
                <option>Semua Posyandu</option>
              </select>
            </div>

            <div className="flex items-center justify-center gap-6 py-3">
              {/* SVG Donut */}
              <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  {/* Background Circle (Belum Lengkap - 28%) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.91549430918954"
                    fill="transparent"
                    stroke="#F43F5E"
                    strokeWidth="4"
                    strokeDasharray="28 72"
                    strokeDashoffset="0"
                  />
                  {/* Foreground Circle (Sudah Lengkap - 72%) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.91549430918954"
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth="4"
                    strokeDasharray="72 28"
                    strokeDashoffset="-28"
                  />
                </svg>
                {/* Center Number */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold text-slate-900 leading-none">892</span>
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5">balita</span>
                </div>
              </div>

              {/* Legend & Count */}
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                    <span>Sudah Lengkap</span>
                  </div>
                  <span className="text-[11px] text-slate-500 pl-4 block">638 balita (71,5%)</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]" />
                    <span>Belum Lengkap</span>
                  </div>
                  <span className="text-[11px] text-slate-500 pl-4 block">254 balita (28,5%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Widget 2: Bar Pertumbuhan */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Pertumbuhan</h3>
                <p className="text-[10px] text-slate-400">Distribusi Status Stunting</p>
              </div>
              <select className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-medium text-slate-600 outline-none">
                <option>Semua Posyandu</option>
              </select>
            </div>

            {/* Bar Chart Visualization */}
            <div className="h-44 w-full flex items-end justify-center gap-12 pt-4 px-6 pb-2 border-b border-slate-100">
              {/* Bar 1: Perlu Tindak Lanjut */}
              <div className="flex flex-col items-center gap-1.5 w-16">
                <span className="text-xs font-bold text-slate-800">2</span>
                <div className="w-full bg-[#F43F5E] rounded-t-lg transition-all" style={{ height: '80px' }} />
                <span className="text-[10px] text-slate-600 font-semibold text-center leading-tight mt-1">
                  Perlu Tindak Lanjut
                </span>
              </div>

              {/* Bar 2: Sudah Ditindaklanjuti */}
              <div className="flex flex-col items-center gap-1.5 w-16">
                <span className="text-xs font-bold text-slate-800">1</span>
                <div className="w-full bg-[#3B82F6] rounded-t-lg transition-all" style={{ height: '45px' }} />
                <span className="text-[10px] text-slate-600 font-semibold text-center leading-tight mt-1">
                  Sudah Ditindaklanjuti
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
