import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Baby, 
  Smile, 
  Heart, 
  Sparkles, 
  ArrowUpRight, 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import DinkesFilterBar from './components/DinkesFilterBar';
import PetaPersebaranWilayah from './components/PetaPersebaranWilayah';
import { dinkesService } from '../../services/dinkesService';

export default function DinkesPersebaranWilayahView() {
  const [filters, setFilters] = useState({
    periode: 'Oktober 2024',
    kecamatan: 'Semua Kecamatan',
    desa: 'Semua Desa',
    posyandu: 'Semua Posyandu'
  });

  const [selectedIndikator, setSelectedIndikator] = useState('Kasus Stunting (Balita)');
  const [activeTab, setActiveTab] = useState('posyandu'); // 'posyandu' | 'desa'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [posyanduData, setPosyanduData] = useState([]);
  const [desaData, setDesaData] = useState([]);

  useEffect(() => {
    setPosyanduData(dinkesService.getRekapitulasiByPosyandu());
    setDesaData(dinkesService.getRekapitulasiByDesa());
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Filtered lists based on search query
  const filteredPosyandu = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return posyanduData;
    return posyanduData.filter(
      (item) => item.nama.toLowerCase().includes(q) || item.desa.toLowerCase().includes(q)
    );
  }, [posyanduData, searchQuery]);

  const filteredDesa = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return desaData;
    return desaData.filter((item) => item.desa.toLowerCase().includes(q));
  }, [desaData, searchQuery]);

  const currentList = activeTab === 'posyandu' ? filteredPosyandu : filteredDesa;
  const totalPages = Math.max(1, Math.ceil(currentList.length / itemsPerPage));
  const currentActualPage = Math.min(currentPage, totalPages);
  const startIndex = (currentActualPage - 1) * itemsPerPage;
  const paginatedList = currentList.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    const filename = `rekapitulasi-kunjungan-${activeTab}-${filters.periode.replace(/\s+/g, '-').toLowerCase()}.csv`;
    dinkesService.exportToCsv(currentList, filename);
  };

  return (
    <div className="space-y-6">
      {/* ==================================================================== */}
      {/* 1. Header & Global Filters                                          */}
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
      {/* 2. Lima Stat Cards (Sesuai Desain Figma Gambar 2 & 3)               */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total Posyandu Aktif */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-pink-50 text-rose-600 flex items-center justify-center">
            <Building2 size={16} />
          </div>
          <div>
            <span className="block text-[11px] text-slate-500 font-medium">Total Posyandu Aktif</span>
            <span className="block text-xl font-bold text-slate-900 leading-tight mt-0.5">26</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
            <ArrowUpRight size={12} />
            <span>+4%</span>
            <span className="text-slate-400 font-normal">Dari 28 Posyandu</span>
          </div>
        </div>

        {/* Card 2: Total Bayi */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Baby size={16} />
          </div>
          <div>
            <span className="block text-[11px] text-slate-500 font-medium">Total Bayi</span>
            <span className="block text-xl font-bold text-slate-900 leading-tight mt-0.5">1.036</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
            <ArrowUpRight size={12} />
            <span>+9%</span>
            <span className="text-slate-400 font-normal">83% dari sasaran</span>
          </div>
        </div>

        {/* Card 3: Total Balita */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Smile size={16} />
          </div>
          <div>
            <span className="block text-[11px] text-slate-500 font-medium">Total Balita</span>
            <span className="block text-xl font-bold text-slate-900 leading-tight mt-0.5">892</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
            <ArrowUpRight size={12} />
            <span>+11%</span>
            <span className="text-slate-400 font-normal">72% dari sasaran</span>
          </div>
        </div>

        {/* Card 4: Total Ibu Hamil */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Heart size={16} />
          </div>
          <div>
            <span className="block text-[11px] text-slate-500 font-medium">Total Ibu Hamil</span>
            <span className="block text-xl font-bold text-slate-900 leading-tight mt-0.5">168</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
            <ArrowUpRight size={12} />
            <span>+6%</span>
            <span className="text-slate-400 font-normal">89% dari sasaran</span>
          </div>
        </div>

        {/* Card 5: Total Ibu Nifas & Menyusui */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div>
            <span className="block text-[11px] text-slate-500 font-medium">Total Ibu Nifas & Menyusui</span>
            <span className="block text-xl font-bold text-slate-900 leading-tight mt-0.5">72</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
            <ArrowUpRight size={12} />
            <span>+7%</span>
            <span className="text-slate-400 font-normal">77% dari sasaran</span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. Peta Persebaran Wilayah Interaktif (Full Width)                  */}
      {/* ==================================================================== */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Peta Persebaran Kesehatan Ibu & Anak</h3>
          <p className="text-[11px] text-slate-400">Pemetaan sebaran kasus dan titik pelayanan posyandu per desa</p>
        </div>

        <PetaPersebaranWilayah
          height="420px"
          isCompact={false}
          selectedIndikator={selectedIndikator}
          onIndikatorChange={setSelectedIndikator}
        />
      </div>

      {/* ==================================================================== */}
      {/* 4. Tabel Rekapitulasi Kunjungan (Posyandu & Desa)                    */}
      {/* ==================================================================== */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
        {/* Sub Header & Switch Tab Posyandu vs Desa */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Rekapitulasi Kunjungan</h3>
            <p className="text-[11px] text-slate-400">
              {activeTab === 'posyandu' ? 'Jumlah kunjungan berdasarkan posyandu' : 'Jumlah kunjungan berdasarkan desa/kelurahan'}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setActiveTab('posyandu'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'posyandu' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Berdasarkan Posyandu
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('desa'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'desa' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Berdasarkan Desa
            </button>
          </div>
        </div>

        {/* Search & Export Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Cari nama Desa/Kelurahan, Posyandu..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#E11D48] hover:bg-[#BE185D] text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Download size={14} />
            <span>Export Laporan</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {activeTab === 'posyandu' ? (
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
                {paginatedList.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-8 text-center text-slate-400">
                      Tidak ada data posyandu ditemukan.
                    </td>
                  </tr>
                ) : (
                  paginatedList.map((row, idx) => (
                    <tr key={`${row.nama}-${idx}`} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-slate-400 font-medium">{startIndex + idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{row.nama}</td>
                      <td className="py-3 px-4 text-slate-600">{row.desa}</td>
                      <td className="py-3 px-4 text-center font-semibold text-slate-900">{row.totalKunjungan}</td>
                      <td className="py-3 px-4 text-center">{row.totalPasien}</td>
                      <td className="py-3 px-4 text-center">{row.totalBayi}</td>
                      <td className="py-3 px-4 text-center">{row.totalBalita}</td>
                      <td className="py-3 px-4 text-center">{row.totalIbuHamil}</td>
                      <td className="py-3 px-4 text-center">{row.totalIbuNifas}</td>
                      <td className="py-3 px-4 text-center text-emerald-600 font-bold">{row.trend}</td>
                      <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px]">{row.tanggal}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/60 text-slate-600 font-bold border-b border-slate-100 whitespace-nowrap">
                  <th className="py-3 px-4 w-10">No</th>
                  <th className="py-3 px-4">Desa/Kelurahan</th>
                  <th className="py-3 px-4 text-center">Jumlah Posyandu</th>
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
                {paginatedList.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400">
                      Tidak ada data desa ditemukan.
                    </td>
                  </tr>
                ) : (
                  paginatedList.map((row, idx) => (
                    <tr key={`${row.desa}-${idx}`} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-slate-400 font-medium">{startIndex + idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{row.desa}</td>
                      <td className="py-3 px-4 text-center font-semibold text-slate-900">{row.jumlahPosyandu}</td>
                      <td className="py-3 px-4 text-center">{row.totalPasien}</td>
                      <td className="py-3 px-4 text-center">{row.totalBayi}</td>
                      <td className="py-3 px-4 text-center">{row.totalBalita}</td>
                      <td className="py-3 px-4 text-center">{row.totalIbuHamil}</td>
                      <td className="py-3 px-4 text-center">{row.totalIbuNifas}</td>
                      <td className="py-3 px-4 text-center text-emerald-600 font-bold">{row.trend}</td>
                      <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px]">{row.tanggal}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div>
            Menampilkan {currentList.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + itemsPerPage, currentList.length)} dari {currentList.length} {activeTab === 'posyandu' ? 'Posyandu' : 'Desa'}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentActualPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isAct = pageNum === currentActualPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg font-semibold text-xs flex items-center justify-center transition-colors cursor-pointer ${
                    isAct ? 'bg-[#E11D48] text-white' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              type="button"
              disabled={currentActualPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
