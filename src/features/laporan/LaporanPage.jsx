import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, FileText, Download, Search, RefreshCw } from 'lucide-react';
import { laporanService } from '../../services/laporanService';
import LaporanStatCards from './components/LaporanStatCards';
import LaporanCharts from './components/LaporanCharts';
import LaporanRekapitulasiTable from './components/LaporanRekapitulasiTable';
import LaporanDataKunjunganTable from './components/LaporanDataKunjunganTable';

export default function LaporanPage({ currentUser, currentPath = '/laporan', onNavigate, onShowToast }) {
  // Periode default: Oktober 2026
  const [selectedPeriode, setSelectedPeriode] = useState('2026-10');
  const [selectedJenisLaporan, setSelectedJenisLaporan] = useState('Rekap Lengkap');
  
  // Tentukan tab awal berdasarkan currentPath
  const [activeTab, setActiveTab] = useState(() => {
    return (currentPath && currentPath.includes('data-kunjungan')) ? 'Data Kunjungan' : 'Rekapitulasi';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [periodesList, setPeriodesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [laporanData, setLaporanData] = useState({
    statCards: {
      totalKunjungan: { value: 0, trend: 0 },
      balitaDitimbang: { value: 0, trend: 0 },
      imunisasiDiberi: { value: 0, trend: 0 },
      pemeriksaanIbu: { value: 0, trend: 0 }
    },
    trenKunjungan: [],
    statusImunisasi: { total: 0, lengkap: 0, belumLengkap: 0, belumImunisasi: 0 },
    rekapitulasiTable: [],
    dataKunjungan: []
  });

  // Sinkronkan activeTab jika URL browser berubah (Back / Forward)
  useEffect(() => {
    if (currentPath && currentPath.includes('data-kunjungan')) {
      setActiveTab('Data Kunjungan');
    } else if (currentPath === '/laporan' || currentPath.includes('rekapitulasi')) {
      setActiveTab('Rekapitulasi');
    }
  }, [currentPath]);

  // Handler saat user mengklik tab
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    if (onNavigate) {
      if (tabName === 'Data Kunjungan') {
        onNavigate('/laporan/data-kunjungan');
      } else {
        onNavigate('/laporan');
      }
    }
  };

  // Ambil opsi periode saat pertama kali render
  useEffect(() => {
    async function loadPeriodes() {
      const list = await laporanService.getAvailablePeriodes();
      setPeriodesList(list);
    }
    loadPeriodes();
  }, []);

  // Fetch data laporan dari database
  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const [yearStr, monthStr] = selectedPeriode.split('-');
      const y = parseInt(yearStr, 10) || 2026;
      const m = parseInt(monthStr, 10) || 10;

      const data = await laporanService.getLaporanBulanan({
        tahun: y,
        bulan: m,
        jenisLaporan: selectedJenisLaporan
      });

      setLaporanData(data);
    } catch (err) {
      console.error('Error load laporan:', err);
      if (onShowToast) {
        onShowToast('Gagal memuat data laporan dari database', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, [selectedPeriode]);

  const handleTampilkan = () => {
    fetchLaporan();
    if (onShowToast) {
      onShowToast('Data laporan berhasil diperbarui!', 'success');
    }
  };

  // Filter Data Kunjungan berdasarkan Jenis Laporan yang dipilih di dropdown
  const filteredDataKunjungan = useMemo(() => {
    const list = laporanData.dataKunjungan || [];
    if (!selectedJenisLaporan || selectedJenisLaporan === 'Rekap Lengkap') {
      return list;
    }
    if (selectedJenisLaporan === 'Kesehatan Ibu') {
      return list.filter((item) =>
        item.jenis_pasien === 'Ibu Hamil' ||
        item.jenis_pasien === 'Ibu Nifas' ||
        item.jenis_pelayanan.toLowerCase().includes('hamil') ||
        item.jenis_pelayanan.toLowerCase().includes('nifas')
      );
    }
    if (selectedJenisLaporan === 'Kesehatan Anak') {
      return list.filter((item) =>
        item.jenis_pasien === 'Balita' ||
        item.jenis_pasien === 'Bayi' ||
        item.jenis_pelayanan.toLowerCase().includes('timbang') ||
        item.jenis_pelayanan.toLowerCase().includes('tinggi')
      );
    }
    if (selectedJenisLaporan === 'Imunisasi') {
      return list.filter((item) =>
        item.jenis_pelayanan.toLowerCase().includes('imunisasi') ||
        item.jenis_pelayanan.toLowerCase().includes('vaksin') ||
        item.hasil_catatan.toLowerCase().includes('dosis')
      );
    }
    return list;
  }, [laporanData.dataKunjungan, selectedJenisLaporan]);

  // Handler Export Laporan CSV
  const handleExportLaporan = () => {
    try {
      if (activeTab === 'Rekapitulasi') {
        const headers = ['No', 'Kategori', 'Jumlah', 'Laki-laki', 'Perempuan', 'Keterangan'];
        const rows = laporanData.rekapitulasiTable.map((r) => [
          r.no,
          `"${r.kategori}"`,
          r.jumlah,
          r.lakiLaki,
          r.perempuan,
          `"${r.keterangan}"`
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Laporan_Rekapitulasi_${selectedPeriode}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const headers = ['No', 'Tanggal Kunjungan', 'Nama', 'NIK', 'Jenis Pasien', 'Jenis Pelayanan', 'Status', 'Hasil/Catatan'];
        const rows = filteredDataKunjungan.map((item, idx) => [
          idx + 1,
          `"${item.tanggal_kunjungan}"`,
          `"${item.nama}"`,
          `"${item.nik}"`,
          `"${item.jenis_pasien}"`,
          `"${item.jenis_pelayanan}"`,
          `"${item.status}"`,
          `"${item.hasil_catatan}"`
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Laporan_Data_Kunjungan_${selectedPeriode}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      if (onShowToast) {
        onShowToast(`Laporan ${activeTab} (${selectedPeriode}) berhasil diekspor!`, 'success');
      }
    } catch (err) {
      console.error('Export error:', err);
      if (onShowToast) {
        onShowToast('Gagal mengekspor laporan', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Laporan Bulanan Sesuai Gambar 1 & 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Laporan Bulanan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Rekapitulasi data kegiatan Posyandu secara otomatis berdasarkan input data harian.
          </p>
        </div>

        {/* Tombol Export Laporan */}
        <div>
          <button
            type="button"
            onClick={handleExportLaporan}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Download size={16} />
            <span>Export Laporan</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Bar (Periode, Jenis Laporan, Tombol Tampilkan) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
          {/* Dropdown Periode */}
          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">
              Periode
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Calendar size={16} />
              </div>
              <select
                value={selectedPeriode}
                onChange={(e) => setSelectedPeriode(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all cursor-pointer"
              >
                {periodesList.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dropdown Jenis Laporan */}
          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">
              Jenis Laporan
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FileText size={16} />
              </div>
              <select
                value={selectedJenisLaporan}
                onChange={(e) => setSelectedJenisLaporan(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all cursor-pointer"
              >
                <option value="Rekap Lengkap">Rekap Lengkap</option>
                <option value="Kesehatan Ibu">Kesehatan Ibu (ANC & Nifas)</option>
                <option value="Kesehatan Anak">Kesehatan Anak & Balita</option>
                <option value="Imunisasi">Imunisasi Balita</option>
              </select>
            </div>
          </div>

          {/* Tombol Tampilkan */}
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={handleTampilkan}
              disabled={loading}
              className="w-full py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading && <RefreshCw size={14} className="animate-spin" />}
              <span>Tampilkan</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Empat Kartu Ringkasan (Stat Cards) */}
      <LaporanStatCards stats={laporanData.statCards} />

      {/* 4. Dua Visualisasi Grafik (Tren Kunjungan & Status Imunisasi) */}
      <LaporanCharts
        trenKunjungan={laporanData.trenKunjungan}
        statusImunisasi={laporanData.statusImunisasi}
      />

      {/* 5. Kontainer Tab Tabel (Rekapitulasi vs Data Kunjungan) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs space-y-5">
        {/* Navigasi Tab & Input Pencarian Sesuai Gambar 1 & 2 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-3">
          {/* Tombol Tab Rekapitulasi vs Data Kunjungan */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => handleTabClick('Rekapitulasi')}
              className={`pb-2.5 text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'Rekapitulasi'
                  ? 'text-[#E11D48] border-b-2 border-[#E11D48]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Rekapitulasi
            </button>

            <button
              type="button"
              onClick={() => handleTabClick('Data Kunjungan')}
              className={`pb-2.5 text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'Data Kunjungan'
                  ? 'text-[#E11D48] border-b-2 border-[#E11D48]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Data Kunjungan
            </button>
          </div>

          {/* Input Pencarian "Cari kegiatan..." */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={14} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kegiatan..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
          </div>
        </div>

        {/* Konten Tab Aktif */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-2">
            <RefreshCw size={24} className="animate-spin text-[#E11D48]" />
            <p className="text-xs">Memuat data laporan...</p>
          </div>
        ) : activeTab === 'Rekapitulasi' ? (
          <LaporanRekapitulasiTable
            data={laporanData.rekapitulasiTable}
            searchQuery={searchQuery}
          />
        ) : (
          <LaporanDataKunjunganTable
            data={filteredDataKunjungan}
            searchQuery={searchQuery}
          />
        )}
      </div>
    </div>
  );
}
