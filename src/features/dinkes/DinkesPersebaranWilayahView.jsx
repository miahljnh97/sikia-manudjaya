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

// Helper pengecekan filter global (Kecamatan, Desa, Posyandu)
function matchesAreaFilter(item, filters) {
  if (!item) return false;

  // 1. Filter Posyandu
  if (filters.posyandu && filters.posyandu !== 'Semua Posyandu') {
    const targetPos = filters.posyandu.toLowerCase().trim();
    const itemPos = (item.nama || item.posyandu || '').toLowerCase().trim();
    if (!itemPos.includes(targetPos) && !targetPos.includes(itemPos)) {
      return false;
    }
  }

  // 2. Filter Desa / Kelurahan
  if (filters.desa && filters.desa !== 'Semua Desa') {
    const cleanFilterDesa = filters.desa.replace(/^(Desa|Kelurahan)\s+/i, '').toLowerCase().trim();
    const cleanItemDesa = (item.desa || '').replace(/^(Desa|Kelurahan)\s+/i, '').toLowerCase().trim();
    if (!cleanItemDesa.includes(cleanFilterDesa) && !cleanFilterDesa.includes(cleanItemDesa)) {
      return false;
    }
  }

  // 3. Filter Kecamatan
  if (filters.kecamatan && filters.kecamatan !== 'Semua Kecamatan') {
    const cleanKec = filters.kecamatan.replace(/^Kecamatan\s+/i, '').toLowerCase().trim();
    if (item.kecamatan) {
      const cleanItemKec = item.kecamatan.replace(/^Kecamatan\s+/i, '').toLowerCase().trim();
      if (!cleanItemKec.includes(cleanKec) && !cleanKec.includes(cleanItemKec)) {
        return false;
      }
    }
  }

  return true;
}

export default function DinkesPersebaranWilayahView({ onShowToast }) {
  const [filters, setFilters] = useState({
    periode: 'Oktober 2024',
    kecamatan: 'Semua Kecamatan',
    desa: 'Semua Desa',
    posyandu: 'Semua Posyandu'
  });

  const [selectedIndikator, setSelectedIndikator] = useState('Kasus Stunting (Balita)');

  // Table 1: Posyandu state
  const [searchPosyandu, setSearchPosyandu] = useState('');
  const [posyanduPage, setPosyanduPage] = useState(1);
  const [posyanduData, setPosyanduData] = useState([]);

  // Table 2: Desa state
  const [searchDesa, setSearchDesa] = useState('');
  const [desaPage, setDesaPage] = useState(1);
  const [desaData, setDesaData] = useState([]);

  const itemsPerPage = 10;

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [posData, desData] = await Promise.all([
          dinkesService.getRekapitulasiByPosyandu(),
          dinkesService.getRekapitulasiByDesa()
        ]);
        if (!isMounted) return;
        if (posData) setPosyanduData(posData);
        if (desData) setDesaData(desData);
      } catch (err) {
        console.warn('Gagal memuat data persebaran wilayah:', err);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [filters.periode]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPosyanduPage(1);
    setDesaPage(1);
  };

  // Filtered Posyandu list (Reaktif terhadap Filter Bar & Search)
  const filteredPosyandu = useMemo(() => {
    return posyanduData.filter((item) => {
      const q = searchPosyandu.toLowerCase().trim();
      const matchQuery = !q ||
        (item.nama && item.nama.toLowerCase().includes(q)) ||
        (item.desa && item.desa.toLowerCase().includes(q));
      const matchArea = matchesAreaFilter(item, filters);
      return matchQuery && matchArea;
    });
  }, [posyanduData, searchPosyandu, filters]);

  // Filtered Desa list (Reaktif terhadap Filter Bar & Search)
  const filteredDesa = useMemo(() => {
    return desaData.filter((item) => {
      const q = searchDesa.toLowerCase().trim();
      const matchQuery = !q || (item.desa && item.desa.toLowerCase().includes(q));
      const matchArea = matchesAreaFilter(item, {
        kecamatan: filters.kecamatan,
        desa: filters.desa,
        posyandu: 'Semua Posyandu' // Posyandu filter tidak mengeliminasi desa jika desa bersangkutan memuat posyandu
      });
      return matchQuery && matchArea;
    });
  }, [desaData, searchDesa, filters]);

  // Hitung Summary Stat Cards Dinamis
  const summaryStats = useMemo(() => {
    const isFiltered = (filters.desa && filters.desa !== 'Semua Desa') || (filters.posyandu && filters.posyandu !== 'Semua Posyandu');
    if (!isFiltered) {
      return {
        totalPosyandu: 26,
        totalBayi: '1.036',
        totalBalita: '892',
        totalIbuHamil: '168',
        totalIbuNifas: '72'
      };
    }
    const totalPos = filteredPosyandu.length;
    const totalBayi = filteredPosyandu.reduce((acc, p) => acc + (p.totalBayi || 0), 0);
    const totalBalita = filteredPosyandu.reduce((acc, p) => acc + (p.totalBalita || 0), 0);
    const totalIbuHamil = filteredPosyandu.reduce((acc, p) => acc + (p.totalIbuHamil || 0), 0);
    const totalIbuNifas = filteredPosyandu.reduce((acc, p) => acc + (p.totalIbuNifas || 0), 0);
    return {
      totalPosyandu: totalPos,
      totalBayi: totalBayi.toLocaleString('id-ID'),
      totalBalita: totalBalita.toLocaleString('id-ID'),
      totalIbuHamil: totalIbuHamil.toLocaleString('id-ID'),
      totalIbuNifas: totalIbuNifas.toLocaleString('id-ID')
    };
  }, [filteredPosyandu, filters]);

  // Pagination for Posyandu
  const totalPosyanduPages = Math.max(1, Math.ceil(filteredPosyandu.length / itemsPerPage));
  const currentPosyanduPage = Math.min(posyanduPage, totalPosyanduPages);
  const posyanduStartIndex = (currentPosyanduPage - 1) * itemsPerPage;
  const paginatedPosyandu = filteredPosyandu.slice(posyanduStartIndex, posyanduStartIndex + itemsPerPage);

  // Pagination for Desa
  const totalDesaPages = Math.max(1, Math.ceil(filteredDesa.length / itemsPerPage));
  const currentDesaPage = Math.min(desaPage, totalDesaPages);
  const desaStartIndex = (currentDesaPage - 1) * itemsPerPage;
  const paginatedDesa = filteredDesa.slice(desaStartIndex, desaStartIndex + itemsPerPage);

  // Export Handlers
  const handleExportPosyandu = () => {
    try {
      const headers = ['No', 'Nama Posyandu', 'Desa/Kelurahan', 'Total Kunjungan', 'Total Pasien', 'Total Bayi', 'Total Balita', 'Total Ibu Hamil', 'Total Ibu Nifas', 'Tren Kunjungan', 'Terakhir Diperbarui'];
      const rows = filteredPosyandu.map((row, idx) => [
        idx + 1,
        row.nama || '',
        row.desa || '',
        row.totalKunjungan ?? 0,
        row.totalPasien ?? 0,
        row.totalBayi ?? 0,
        row.totalBalita ?? 0,
        row.totalIbuHamil ?? 0,
        row.totalIbuNifas ?? 0,
        row.trend || '',
        row.terakhirDiperbarui || row.tanggal || ''
      ]);
      const filename = `Rekapitulasi_Kunjungan_Posyandu_${(filters.periode || 'Oktober_2024').replace(/\s+/g, '_')}.csv`;
      dinkesService.exportToCsv(filename, headers, rows);
      if (onShowToast) onShowToast(`Rekapitulasi Kunjungan Posyandu (${rows.length} posyandu) berhasil diunduh!`, 'success');
    } catch (e) {
      console.error('Export posyandu error:', e);
      if (onShowToast) onShowToast('Gagal mengunduh laporan', 'error');
    }
  };

  const handleExportDesa = () => {
    try {
      const headers = ['No', 'Desa/Kelurahan', 'Jumlah Posyandu', 'Total Pasien', 'Total Bayi', 'Total Balita', 'Total Ibu Hamil', 'Total Ibu Nifas', 'Tren Kunjungan', 'Terakhir Diperbarui'];
      const rows = filteredDesa.map((row, idx) => [
        idx + 1,
        row.desa || '',
        row.jumlahPosyandu ?? 0,
        row.totalPasien ?? 0,
        row.totalBayi ?? 0,
        row.totalBalita ?? 0,
        row.totalIbuHamil ?? 0,
        row.totalIbuNifas ?? 0,
        row.trend || '',
        row.terakhirDiperbarui || row.tanggal || ''
      ]);
      const filename = `Rekapitulasi_Kunjungan_Desa_${(filters.periode || 'Oktober_2024').replace(/\s+/g, '_')}.csv`;
      dinkesService.exportToCsv(filename, headers, rows);
      if (onShowToast) onShowToast(`Rekapitulasi Kunjungan Desa (${rows.length} desa) berhasil diunduh!`, 'success');
    } catch (e) {
      console.error('Export desa error:', e);
      if (onShowToast) onShowToast('Gagal mengunduh laporan', 'error');
    }
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
            <span className="block text-xl font-bold text-slate-900 leading-tight mt-0.5">{summaryStats.totalPosyandu}</span>
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
            <span className="block text-xl font-bold text-slate-900 leading-tight mt-0.5">{summaryStats.totalBayi}</span>
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
            <span className="block text-xl font-bold text-slate-900 leading-tight mt-0.5">{summaryStats.totalBalita}</span>
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
            <span className="block text-xl font-bold text-slate-900 leading-tight mt-0.5">{summaryStats.totalIbuHamil}</span>
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
            <span className="block text-xl font-bold text-slate-900 leading-tight mt-0.5">{summaryStats.totalIbuNifas}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
            <ArrowUpRight size={12} />
            <span>+7%</span>
            <span className="text-slate-400 font-normal">77% dari sasaran</span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. Peta Persebaran Wilayah Interaktif (Full Width Sesuai Gambar 1 & 3)*/}
      {/* ==================================================================== */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Peta Persebaran Kesehatan Ibu & Anak</h3>
            <p className="text-[11px] text-slate-400">Pemetaan sebaran kasus dan titik pelayanan posyandu per desa</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 shadow-2xs flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Tampilkan:</span>
            <select
              value={selectedIndikator}
              onChange={(e) => setSelectedIndikator(e.target.value)}
              className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer text-xs pr-1"
            >
              <option value="Kasus Stunting (Balita)">Kasus Stunting (Balita)</option>
              <option value="Ibu Hamil Berisiko">Ibu Hamil Berisiko</option>
              <option value="Cakupan Imunisasi Rendah">Cakupan Imunisasi Rendah</option>
            </select>
          </div>
        </div>

        <PetaPersebaranWilayah
          height="450px"
          isCompact={false}
          selectedIndikator={selectedIndikator}
          onIndikatorChange={setSelectedIndikator}
        />
      </div>

      {/* ==================================================================== */}
      {/* 4. Tabel 1: Rekapitulasi Kunjungan Berdasarkan Posyandu (Gambar 2 & 3)*/}
      {/* ==================================================================== */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Rekapitulasi Kunjungan</h3>
          <p className="text-[11px] text-slate-400">Jumlah kunjungan berdasarkan posyandu</p>
        </div>

        {/* Search & Export Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchPosyandu}
              onChange={(e) => { setSearchPosyandu(e.target.value); setPosyanduPage(1); }}
              placeholder="Cari nama Desa/Kelurahan, Posyandu..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <button
            type="button"
            onClick={handleExportPosyandu}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#E11D48] hover:bg-[#BE185D] text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Download size={14} />
            <span>Export Laporan</span>
          </button>
        </div>

        {/* Table Posyandu */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/60 text-slate-600 font-bold border-b border-slate-100 whitespace-nowrap">
                <th className="py-3 px-3 w-10">No.</th>
                <th className="py-3 px-3">Nama Posyandu</th>
                <th className="py-3 px-3">Desa/Kelurahan</th>
                <th className="py-3 px-3 text-center">Total Kunjungan</th>
                <th className="py-3 px-3 text-center">Total Pasien</th>
                <th className="py-3 px-3 text-center">Total Bayi</th>
                <th className="py-3 px-3 text-center">Total Balita</th>
                <th className="py-3 px-3 text-center">Total Ibu Hamil</th>
                <th className="py-3 px-3 text-center">Total Ibu Nifas</th>
                <th className="py-3 px-3 text-center">Trend Kunjungan</th>
                <th className="py-3 px-3 text-right">Terakhir Diperbarui</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 whitespace-nowrap">
              {paginatedPosyandu.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    Tidak ada data posyandu pada filter ini.
                  </td>
                </tr>
              ) : (
                paginatedPosyandu.map((row, idx) => (
                  <tr key={row.id || `${row.nama}-${idx}`} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-slate-400 font-medium">{posyanduStartIndex + idx + 1}.</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{row.nama}</td>
                    <td className="py-3 px-3 text-slate-600">{row.desa}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">{row.totalKunjungan}</td>
                    <td className="py-3 px-3 text-center font-medium text-slate-700">{row.totalPasien}</td>
                    <td className="py-3 px-3 text-center text-slate-600">{row.totalBayi}</td>
                    <td className="py-3 px-3 text-center text-slate-600">{row.totalBalita}</td>
                    <td className="py-3 px-3 text-center text-slate-600">{row.totalIbuHamil}</td>
                    <td className="py-3 px-3 text-center text-slate-600">{row.totalIbuNifas}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {row.trend || '↑ 10%'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500 font-mono text-[11px]">
                      {row.terakhirDiperbarui || row.tanggal || '30/10/2026 21:50'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Posyandu */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div>
            {filteredPosyandu.length === 0
              ? 'Menampilkan 0 Posyandu'
              : totalPosyanduPages === 1
                ? `Menampilkan ${filteredPosyandu.length} dari ${filteredPosyandu.length} Posyandu`
                : `Menampilkan ${posyanduStartIndex + 1} - ${Math.min(posyanduStartIndex + itemsPerPage, filteredPosyandu.length)} dari ${filteredPosyandu.length} Posyandu`
            }
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPosyanduPage === 1}
              onClick={() => setPosyanduPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPosyanduPages }).map((_, i) => {
              const pageNum = i + 1;
              const isAct = pageNum === currentPosyanduPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setPosyanduPage(pageNum)}
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
              disabled={currentPosyanduPage === totalPosyanduPages}
              onClick={() => setPosyanduPage((p) => Math.min(totalPosyanduPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 5. Tabel 2: Rekapitulasi Kunjungan Berdasarkan Desa (Gambar 2 & 3)   */}
      {/* ==================================================================== */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Rekapitulasi Kunjungan</h3>
          <p className="text-[11px] text-slate-400">Jumlah kunjungan berdasarkan desa</p>
        </div>

        {/* Search & Export Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchDesa}
              onChange={(e) => { setSearchDesa(e.target.value); setDesaPage(1); }}
              placeholder="Cari nama Desa/Kelurahan..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <button
            type="button"
            onClick={handleExportDesa}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#E11D48] hover:bg-[#BE185D] text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Download size={14} />
            <span>Export Laporan</span>
          </button>
        </div>

        {/* Table Desa */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/60 text-slate-600 font-bold border-b border-slate-100 whitespace-nowrap">
                <th className="py-3 px-3 w-10">No.</th>
                <th className="py-3 px-3">Desa/Kelurahan</th>
                <th className="py-3 px-3 text-center">Jumlah Posyandu</th>
                <th className="py-3 px-3 text-center">Total Pasien</th>
                <th className="py-3 px-3 text-center">Total Bayi</th>
                <th className="py-3 px-3 text-center">Total Balita</th>
                <th className="py-3 px-3 text-center">Total Ibu Hamil</th>
                <th className="py-3 px-3 text-center">Total Ibu Nifas</th>
                <th className="py-3 px-3 text-center">Trend Kunjungan</th>
                <th className="py-3 px-3 text-right">Terakhir Diperbarui</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 whitespace-nowrap">
              {paginatedDesa.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Tidak ada data desa pada filter ini.
                  </td>
                </tr>
              ) : (
                paginatedDesa.map((row, idx) => (
                  <tr key={row.id || `${row.desa}-${idx}`} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-slate-400 font-medium">{desaStartIndex + idx + 1}.</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{row.desa}</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">{row.jumlahPosyandu}</td>
                    <td className="py-3 px-3 text-center font-medium text-slate-700">{row.totalPasien}</td>
                    <td className="py-3 px-3 text-center text-slate-600">{row.totalBayi}</td>
                    <td className="py-3 px-3 text-center text-slate-600">{row.totalBalita}</td>
                    <td className="py-3 px-3 text-center text-slate-600">{row.totalIbuHamil}</td>
                    <td className="py-3 px-3 text-center text-slate-600">{row.totalIbuNifas}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {row.trend || '↑ 10%'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500 font-mono text-[11px]">
                      {row.terakhirDiperbarui || row.tanggal || '30/10/2026 21:50'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Desa */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div>
            {filteredDesa.length === 0
              ? 'Menampilkan 0 Desa'
              : totalDesaPages === 1
                ? `Menampilkan ${filteredDesa.length} dari ${filteredDesa.length} Desa`
                : `Menampilkan ${desaStartIndex + 1} - ${Math.min(desaStartIndex + itemsPerPage, filteredDesa.length)} dari ${filteredDesa.length} Desa`
            }
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentDesaPage === 1}
              onClick={() => setDesaPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalDesaPages }).map((_, i) => {
              const pageNum = i + 1;
              const isAct = pageNum === currentDesaPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setDesaPage(pageNum)}
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
              disabled={currentDesaPage === totalDesaPages}
              onClick={() => setDesaPage((p) => Math.min(totalDesaPages, p + 1))}
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
