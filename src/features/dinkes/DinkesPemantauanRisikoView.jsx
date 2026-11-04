import React, { useState, useEffect, useMemo } from 'react';
import { 
  Heart, 
  AlertCircle, 
  Smile, 
  Search, 
  Download, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import DinkesFilterBar from './components/DinkesFilterBar';
import { dinkesService } from '../../services/dinkesService';

// Helper pengecekan filter global (Kecamatan, Desa, Posyandu)
function matchesAreaFilter(item, filters) {
  if (!item) return false;

  // 1. Filter Posyandu
  if (filters.posyandu && filters.posyandu !== 'Semua Posyandu') {
    const targetPos = filters.posyandu.toLowerCase().trim();
    const itemPos = (item.posyandu || item.nama || '').toLowerCase().trim();
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

export default function DinkesPemantauanRisikoView({ onShowToast }) {
  const [filters, setFilters] = useState({
    periode: 'Oktober 2024',
    kecamatan: 'Semua Kecamatan',
    desa: 'Semua Desa',
    posyandu: 'Semua Posyandu'
  });

  // State Ibu Hamil Risiko
  const [ibuSearch, setIbuSearch] = useState('');
  const [ibuTab, setIbuTab] = useState('Semua');
  const [ibuList, setIbuList] = useState([]);
  const [ibuPage, setIbuPage] = useState(1);
  const [selectedIbuDetail, setSelectedIbuDetail] = useState(null);

  // State Balita Stunting
  const [balitaSearch, setBalitaSearch] = useState('');
  const [balitaTab, setBalitaTab] = useState('Semua');
  const [balitaList, setBalitaList] = useState([]);
  const [balitaPage, setBalitaPage] = useState(1);
  const [selectedBalitaDetail, setSelectedBalitaDetail] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    let isMounted = true;
    const loadRisiko = async () => {
      try {
        const [ibuData, balitaData] = await Promise.all([
          dinkesService.getIbuHamilRisiko(),
          dinkesService.getBalitaStunting()
        ]);
        if (!isMounted) return;
        if (ibuData) setIbuList(ibuData);
        if (balitaData) setBalitaList(balitaData);
      } catch (err) {
        console.warn('Gagal memuat data pemantauan risiko:', err);
      }
    };
    loadRisiko();
    return () => { isMounted = false; };
  }, [filters.periode]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setIbuPage(1);
    setBalitaPage(1);
  };

  // 1. Data terfilter berdasarkan filter area (Kecamatan, Desa, Posyandu)
  const ibuListAreaFiltered = useMemo(() => {
    return ibuList.filter((item) => matchesAreaFilter(item, filters));
  }, [ibuList, filters]);

  const balitaListAreaFiltered = useMemo(() => {
    return balitaList.filter((item) => matchesAreaFilter(item, filters));
  }, [balitaList, filters]);

  // 2. Data terfilter penuh (termasuk Tab status tindak lanjut & text search)
  const filteredIbu = useMemo(() => {
    return ibuListAreaFiltered.filter((item) => {
      const q = ibuSearch.toLowerCase().trim();
      const matchQuery = !q ||
        (item.namaIbu && item.namaIbu.toLowerCase().includes(q)) ||
        (item.nik && item.nik.includes(q)) ||
        (item.posyandu && item.posyandu.toLowerCase().includes(q));
      const matchTab = ibuTab === 'Semua' || item.statusTindakLanjut === ibuTab;
      return matchQuery && matchTab;
    });
  }, [ibuListAreaFiltered, ibuSearch, ibuTab]);

  const filteredBalita = useMemo(() => {
    return balitaListAreaFiltered.filter((item) => {
      const q = balitaSearch.toLowerCase().trim();
      const matchQuery = !q ||
        (item.namaAnak && item.namaAnak.toLowerCase().includes(q)) ||
        (item.nik && item.nik.includes(q)) ||
        (item.posyandu && item.posyandu.toLowerCase().includes(q));
      const matchTab = balitaTab === 'Semua' || item.statusTindakLanjut === balitaTab;
      return matchQuery && matchTab;
    });
  }, [balitaListAreaFiltered, balitaSearch, balitaTab]);

  // 3. Paginasi Dinamis Ibu Hamil (10 per halaman)
  const totalIbuPages = Math.max(1, Math.ceil(filteredIbu.length / itemsPerPage));
  const currentIbuPage = Math.min(ibuPage, totalIbuPages);
  const ibuStartIndex = (currentIbuPage - 1) * itemsPerPage;
  const paginatedIbu = filteredIbu.slice(ibuStartIndex, ibuStartIndex + itemsPerPage);

  // 4. Paginasi Dinamis Balita Stunting (10 per halaman)
  const totalBalitaPages = Math.max(1, Math.ceil(filteredBalita.length / itemsPerPage));
  const currentBalitaPage = Math.min(balitaPage, totalBalitaPages);
  const balitaStartIndex = (currentBalitaPage - 1) * itemsPerPage;
  const paginatedBalita = filteredBalita.slice(balitaStartIndex, balitaStartIndex + itemsPerPage);

  // 5. Hitung Tab Counts Dinamis
  const ibuCounts = useMemo(() => ({
    semua: ibuListAreaFiltered.length,
    perluTindakLanjut: ibuListAreaFiltered.filter(i => i.statusTindakLanjut === 'Perlu Tindak Lanjut').length,
    rujuk: ibuListAreaFiltered.filter(i => i.statusTindakLanjut === 'Rujuk').length,
    sudahDitindaklanjuti: ibuListAreaFiltered.filter(i => i.statusTindakLanjut === 'Sudah Ditindaklanjuti').length
  }), [ibuListAreaFiltered]);

  const balitaCounts = useMemo(() => ({
    semua: balitaListAreaFiltered.length,
    perluTindakLanjut: balitaListAreaFiltered.filter(b => b.statusTindakLanjut === 'Perlu Tindak Lanjut').length,
    rujuk: balitaListAreaFiltered.filter(b => b.statusTindakLanjut === 'Rujuk').length,
    sudahDitindaklanjuti: balitaListAreaFiltered.filter(b => b.statusTindakLanjut === 'Sudah Ditindaklanjuti').length
  }), [balitaListAreaFiltered]);

  // Export Handlers
  const handleExportIbu = () => {
    try {
      const headers = ['No', 'Nama Ibu', 'NIK', 'Usia Kehamilan', 'Hasil Pemeriksaan Terakhir', 'Posyandu', 'Desa', 'Tanggal Periksa', 'Status Tindak Lanjut'];
      const rows = filteredIbu.map((item, idx) => [
        idx + 1,
        item.namaIbu || '',
        `'${item.nik || ''}`,
        item.usiaKehamilan || '',
        item.hasilPemeriksaan || '',
        item.posyandu || '',
        item.desa || '',
        item.tanggalPeriksa || '',
        item.statusTindakLanjut || ''
      ]);
      const filename = `Pemantauan_Ibu_Hamil_Risiko_${(filters.periode || 'Oktober_2024').replace(/\s+/g, '_')}.csv`;
      dinkesService.exportToCsv(filename, headers, rows);
      if (onShowToast) onShowToast(`Laporan Ibu Hamil Berisiko (${rows.length} data) berhasil diunduh!`, 'success');
    } catch (e) {
      console.error('Export ibu error:', e);
      if (onShowToast) onShowToast('Gagal mengunduh laporan', 'error');
    }
  };

  const handleExportBalita = () => {
    try {
      const headers = ['No', 'Nama Anak', 'NIK', 'Usia', 'Jenis Kelamin', 'Hasil Ukur Terakhir', 'BB Terakhir', 'Posyandu', 'Desa', 'Tanggal Ukur', 'Status Tindak Lanjut', 'Status Gizi'];
      const rows = filteredBalita.map((item, idx) => [
        idx + 1,
        item.namaAnak || '',
        `'${item.nik || ''}`,
        item.usia || '',
        item.jenisKelamin || '',
        item.hasilUkur || '',
        item.bbUkur || '',
        item.posyandu || '',
        item.desa || '',
        item.tanggalUkur || '',
        item.statusTindakLanjut || '',
        item.statusGizi || ''
      ]);
      const filename = `Pemantauan_Balita_Stunting_${(filters.periode || 'Oktober_2024').replace(/\s+/g, '_')}.csv`;
      dinkesService.exportToCsv(filename, headers, rows);
      if (onShowToast) onShowToast(`Laporan Balita Stunting (${rows.length} data) berhasil diunduh!`, 'success');
    } catch (e) {
      console.error('Export balita error:', e);
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
            Pemantauan Risiko
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ringkasan data kesehatan ibu dan anak yang berisiko tinggi di wilayah kerja
          </p>
        </div>

        <DinkesFilterBar filters={filters} onFilterChange={handleFilterChange} />
      </div>

      {/* ==================================================================== */}
      {/* 2. Empat Stat Cards Risiko Dinamis Sesuai Filter                    */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Ibu Hamil Berisiko Tinggi */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-pink-50 text-rose-600 flex items-center justify-center">
            <Heart size={16} />
          </div>
          <div>
            <span className="block text-[11px] text-slate-500 font-medium leading-tight">
              Ibu Hamil Berisiko Tinggi
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-slate-900 leading-tight">
                {ibuCounts.semua}
              </span>
              <span className="text-xs text-slate-400 font-medium">/148</span>
            </div>
          </div>
        </div>

        {/* Card 2: Ibu Hamil Perlu Tindak Lanjut */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle size={16} />
          </div>
          <div>
            <span className="block text-[11px] text-slate-500 font-medium leading-tight">
              Ibu Hamil Perlu Tindak Lanjut
            </span>
            <span className="block text-2xl font-bold text-slate-900 leading-tight mt-0.5">
              {ibuCounts.perluTindakLanjut}
            </span>
          </div>
        </div>

        {/* Card 3: Balita Indikasi Stunting */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Smile size={16} />
          </div>
          <div>
            <span className="block text-[11px] text-slate-500 font-medium leading-tight">
              Balita Indikasi Stunting
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-bold text-slate-900 leading-tight">
                {balitaCounts.semua}
              </span>
              <span className="text-xs text-slate-400 font-medium">/1.023</span>
            </div>
          </div>
        </div>

        {/* Card 4: Balita Perlu Tindak Lanjut */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle size={16} />
          </div>
          <div>
            <span className="block text-[11px] text-slate-500 font-medium leading-tight">
              Balita Perlu Tindak Lanjut
            </span>
            <span className="block text-2xl font-bold text-slate-900 leading-tight mt-0.5">
              {balitaCounts.perluTindakLanjut}
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. Section 1: Ibu Hamil Berisiko Tinggi                              */}
      {/* ==================================================================== */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Ibu Hamil Berisiko Tinggi</h3>
          <p className="text-[11px] text-slate-400">
            Ibu hamil dengan risiko tinggi berdasarkan hasil pemeriksaan di Posyandu.
          </p>
        </div>

        {/* Baris Search, Export, dan Tab Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={ibuSearch}
              onChange={(e) => { setIbuSearch(e.target.value); setIbuPage(1); }}
              placeholder="Cari nama ibu, NIK atau Posyandu..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <button
            type="button"
            onClick={handleExportIbu}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#E11D48] hover:bg-[#BE185D] text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Download size={14} />
            <span>Export Laporan</span>
          </button>
        </div>

        {/* Filter Tabs Dinamis */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
          {[
            { id: 'Semua', label: `Semua (${ibuCounts.semua})` },
            { id: 'Perlu Tindak Lanjut', label: `Perlu Tindak Lanjut (${ibuCounts.perluTindakLanjut})` },
            { id: 'Rujuk', label: `Rujuk (${ibuCounts.rujuk})` },
            { id: 'Sudah Ditindaklanjuti', label: `Sudah Ditindaklanjuti (${ibuCounts.sudahDitindaklanjuti})` }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setIbuTab(tab.id); setIbuPage(1); }}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0 ${
                ibuTab === tab.id
                  ? 'bg-[#E11D48] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tabel Ibu Hamil */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/60 text-slate-600 font-bold border-b border-slate-100 whitespace-nowrap">
                <th className="py-3 px-4 w-10">No.</th>
                <th className="py-3 px-4">Nama Ibu</th>
                <th className="py-3 px-4">Usia Kehamilan</th>
                <th className="py-3 px-4">Hasil Pemeriksaan Terakhir</th>
                <th className="py-3 px-4">Posyandu</th>
                <th className="py-3 px-4">Tanggal Periksa</th>
                <th className="py-3 px-4">Status Tindak Lanjut</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 whitespace-nowrap">
              {paginatedIbu.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ada data ibu hamil berisiko pada filter ini.
                  </td>
                </tr>
              ) : (
                paginatedIbu.map((row, idx) => {
                  let badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
                  if (row.statusTindakLanjut === 'Perlu Tindak Lanjut') {
                    badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
                  } else if (row.statusTindakLanjut === 'Rujuk') {
                    badgeClass = 'bg-purple-50 text-purple-700 border-purple-200';
                  }
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-slate-400 font-medium">{ibuStartIndex + idx + 1}.</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{row.namaIbu}</td>
                      <td className="py-3 px-4">{row.usiaKehamilan}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{row.hasilPemeriksaan}</td>
                      <td className="py-3 px-4 text-slate-600">{row.posyandu}</td>
                      <td className="py-3 px-4 text-slate-500">{row.tanggalPeriksa}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border shrink-0 ${badgeClass}`}>
                          {row.statusTindakLanjut}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedIbuDetail(row)}
                          className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
                        >
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & pagination dinamis */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div>
            {filteredIbu.length === 0
              ? 'Menampilkan 0 pasien'
              : totalIbuPages === 1
                ? `Menampilkan ${filteredIbu.length} dari ${filteredIbu.length} pasien`
                : `Menampilkan ${ibuStartIndex + 1} - ${Math.min(ibuStartIndex + itemsPerPage, filteredIbu.length)} dari ${filteredIbu.length} pasien`
            }
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentIbuPage === 1}
              onClick={() => setIbuPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalIbuPages }).map((_, i) => {
              const pageNum = i + 1;
              const isAct = pageNum === currentIbuPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setIbuPage(pageNum)}
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
              disabled={currentIbuPage === totalIbuPages}
              onClick={() => setIbuPage((p) => Math.min(totalIbuPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Halaman Selanjutnya"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. Section 2: Balita dengan Indikasi Stunting                        */}
      {/* ==================================================================== */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Balita dengan Indikasi Stunting</h3>
          <p className="text-[11px] text-slate-400">
            Balita dengan status gizi kurang atau sangat pendek berdasarkan pengukuran di Posyandu.
          </p>
        </div>

        {/* Baris Search, Export, dan Tab Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={balitaSearch}
              onChange={(e) => { setBalitaSearch(e.target.value); setBalitaPage(1); }}
              placeholder="Cari nama balita, NIK, atau Posyandu..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <button
            type="button"
            onClick={handleExportBalita}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#E11D48] hover:bg-[#BE185D] text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Download size={14} />
            <span>Export Laporan</span>
          </button>
        </div>

        {/* Filter Tabs Dinamis */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
          {[
            { id: 'Semua', label: `Semua (${balitaCounts.semua})` },
            { id: 'Perlu Tindak Lanjut', label: `Perlu Tindak Lanjut (${balitaCounts.perluTindakLanjut})` },
            { id: 'Rujuk', label: `Rujuk (${balitaCounts.rujuk})` },
            { id: 'Sudah Ditindaklanjuti', label: `Sudah Ditindaklanjuti (${balitaCounts.sudahDitindaklanjuti})` }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => { setBalitaTab(tab.id); setBalitaPage(1); }}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0 ${
                balitaTab === tab.id
                  ? 'bg-[#E11D48] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tabel Balita Stunting */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/60 text-slate-600 font-bold border-b border-slate-100 whitespace-nowrap">
                <th className="py-3 px-4 w-10">No.</th>
                <th className="py-3 px-4">Nama Anak</th>
                <th className="py-3 px-4">Usia</th>
                <th className="py-3 px-4">Jenis Kelamin</th>
                <th className="py-3 px-4">Hasil Ukur Terakhir</th>
                <th className="py-3 px-4">Posyandu</th>
                <th className="py-3 px-4">Tanggal Ukur</th>
                <th className="py-3 px-4">Status Tindak Lanjut</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 whitespace-nowrap">
              {paginatedBalita.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Tidak ada data balita stunting pada filter ini.
                  </td>
                </tr>
              ) : (
                paginatedBalita.map((row, idx) => {
                  let badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
                  if (row.statusTindakLanjut === 'Perlu Tindak Lanjut') {
                    badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
                  } else if (row.statusTindakLanjut === 'Rujuk') {
                    badgeClass = 'bg-purple-50 text-purple-700 border-purple-200';
                  }
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-slate-400 font-medium">{balitaStartIndex + idx + 1}.</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{row.namaAnak}</td>
                      <td className="py-3 px-4">{row.usia}</td>
                      <td className="py-3 px-4 text-slate-600">{row.jenisKelamin}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{row.hasilUkur}</td>
                      <td className="py-3 px-4 text-slate-600">{row.posyandu}</td>
                      <td className="py-3 px-4 text-slate-500">{row.tanggalUkur}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border shrink-0 ${badgeClass}`}>
                          {row.statusTindakLanjut}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedBalitaDetail(row)}
                          className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
                        >
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & pagination dinamis */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div>
            {filteredBalita.length === 0
              ? 'Menampilkan 0 pasien'
              : totalBalitaPages === 1
                ? `Menampilkan ${filteredBalita.length} dari ${filteredBalita.length} pasien`
                : `Menampilkan ${balitaStartIndex + 1} - ${Math.min(balitaStartIndex + itemsPerPage, filteredBalita.length)} dari ${filteredBalita.length} pasien`
            }
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentBalitaPage === 1}
              onClick={() => setBalitaPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalBalitaPages }).map((_, i) => {
              const pageNum = i + 1;
              const isAct = pageNum === currentBalitaPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setBalitaPage(pageNum)}
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
              disabled={currentBalitaPage === totalBalitaPages}
              onClick={() => setBalitaPage((p) => Math.min(totalBalitaPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Halaman Selanjutnya"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 5. Modal Detail Pasien (Ibu & Balita)                                */}
      {/* ==================================================================== */}
      {selectedIbuDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-[#E11D48]" />
                <h3 className="font-bold text-sm text-slate-900">Detail Rekam Medis Risiko Ibu Hamil</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIbuDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                <span className="block text-slate-400 text-[10px]">Nama Ibu</span>
                <span className="block font-bold text-slate-900 text-sm">{selectedIbuDetail.namaIbu}</span>
                <span className="text-slate-500 font-mono text-[11px]">NIK: {selectedIbuDetail.nik}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <span className="block text-slate-400 text-[10px]">Usia Kehamilan</span>
                  <span className="block font-bold text-slate-800">{selectedIbuDetail.usiaKehamilan}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <span className="block text-slate-400 text-[10px]">Posyandu & Faskes</span>
                  <span className="block font-bold text-slate-800">{selectedIbuDetail.posyandu}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                <span className="block text-slate-400 text-[10px]">Hasil Pemeriksaan Terakhir</span>
                <span className="block font-bold text-rose-700">{selectedIbuDetail.hasilPemeriksaan}</span>
                <span className="block text-[11px] text-slate-500">Tanggal Periksa: {selectedIbuDetail.tanggalPeriksa}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="block text-slate-400 text-[10px]">Status Tindak Lanjut</span>
                  <span className="block font-bold text-slate-800">{selectedIbuDetail.statusTindakLanjut}</span>
                </div>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 font-semibold text-[11px]">
                  Faskes Rujukan Terkait
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedIbuDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedBalitaDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Smile size={18} className="text-[#10B981]" />
                <h3 className="font-bold text-sm text-slate-900">Detail Status Stunting Balita</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBalitaDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                <span className="block text-slate-400 text-[10px]">Nama Balita</span>
                <span className="block font-bold text-slate-900 text-sm">{selectedBalitaDetail.namaAnak}</span>
                <span className="text-slate-500 font-mono text-[11px]">NIK: {selectedBalitaDetail.nik}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <span className="block text-slate-400 text-[10px]">Usia & Gender</span>
                  <span className="block font-bold text-slate-800">{selectedBalitaDetail.usia} ({selectedBalitaDetail.jenisKelamin})</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <span className="block text-slate-400 text-[10px]">Posyandu</span>
                  <span className="block font-bold text-slate-800">{selectedBalitaDetail.posyandu}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                <span className="block text-slate-400 text-[10px]">Hasil Ukur Terakhir</span>
                <span className="block font-bold text-rose-600">{selectedBalitaDetail.hasilUkur}</span>
                <span className="block text-[11px] text-slate-500">Tanggal Pengukuran: {selectedBalitaDetail.tanggalUkur}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="block text-slate-400 text-[10px]">Status Tindak Lanjut</span>
                  <span className="block font-bold text-slate-800">{selectedBalitaDetail.statusTindakLanjut}</span>
                </div>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-600 font-semibold text-[11px]">
                  Pemberian PMT
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBalitaDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
