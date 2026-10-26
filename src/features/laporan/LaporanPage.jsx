import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Calendar, 
  Download, 
  TrendingUp, 
  Users, 
  Scale, 
  Syringe, 
  UserCheck, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  X,
  CheckCircle2,
  Filter,
  FileSpreadsheet
} from 'lucide-react';

export default function LaporanPage({ currentUser, onShowToast }) {
  const [selectedPeriode, setSelectedPeriode] = useState('Oktober 2025');
  const [selectedJenisLaporan, setSelectedJenisLaporan] = useState('Rekap Lengkap');
  const [activeTab, setActiveTab] = useState('rekapitulasi'); // 'rekapitulasi' | 'kunjungan'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf'); // 'pdf' | 'csv'
  const [isExporting, setIsExporting] = useState(false);
  const itemsPerPage = 7;

  // 1. Data Ringkasan Metrik
  const stats = [
    {
      id: 'stat-1',
      title: 'Total Kunjungan',
      value: 124,
      trend: '+ 12% dari bulan lalu',
      icon: Users,
      iconColor: 'text-[#E11D48]',
      iconBg: 'bg-rose-50'
    },
    {
      id: 'stat-2',
      title: 'Balita Ditimbang',
      value: 98,
      trend: '+ 8% dari bulan lalu',
      icon: Scale,
      iconColor: 'text-[#0284C7]',
      iconBg: 'bg-sky-50'
    },
    {
      id: 'stat-3',
      title: 'Imunisasi Diberi',
      value: 76,
      trend: '+ 15% dari bulan lalu',
      icon: Syringe,
      iconColor: 'text-[#8B5CF6]',
      iconBg: 'bg-purple-50'
    },
    {
      id: 'stat-4',
      title: 'Pemeriksaan Ibu',
      value: 12,
      trend: '+ 4% dari bulan lalu',
      icon: UserCheck,
      iconColor: 'text-[#10B981]',
      iconBg: 'bg-emerald-50'
    }
  ];

  // 2. Data Tren Kunjungan Posyandu Bulanan (Stacked Bar Chart Jan - Des)
  const monthlyTrendData = [
    { bulan: 'Jan', balita: 65, ibuHamil: 14, ibuNifas: 6 },
    { bulan: 'Feb', balita: 70, ibuHamil: 16, ibuNifas: 8 },
    { bulan: 'Mar', balita: 74, ibuHamil: 15, ibuNifas: 7 },
    { bulan: 'Apr', balita: 80, ibuHamil: 18, ibuNifas: 9 },
    { bulan: 'Mei', balita: 85, ibuHamil: 20, ibuNifas: 10 },
    { bulan: 'Jun', balita: 88, ibuHamil: 19, ibuNifas: 8 },
    { bulan: 'Jul', balita: 92, ibuHamil: 22, ibuNifas: 11 },
    { bulan: 'Agu', balita: 90, ibuHamil: 20, ibuNifas: 10 },
    { bulan: 'Sep', balita: 98, ibuHamil: 24, ibuNifas: 12 },
    { bulan: 'Okt', balita: 105, ibuHamil: 25, ibuNifas: 14 },
    { bulan: 'Nov', balita: 95, ibuHamil: 21, ibuNifas: 11 },
    { bulan: 'Des', balita: 100, ibuHamil: 22, ibuNifas: 12 },
  ];

  // 3. Data Status Imunisasi Balita (Donut Chart)
  const imunisasiData = {
    total: 76,
    lengkap: 58,       // ~76.3%
    belumLengkap: 12,  // ~15.8%
    belumImunisasi: 6  // ~7.9%
  };

  // 4. Data Rekapitulasi (Tab 1 Sesuai Desain Figma)
  const rekapitulasiList = [
    {
      no: 1,
      kategori: 'Total Kunjungan',
      jumlah: 124,
      lakiLaki: '-',
      perempuan: '-',
      keterangan: 'Balita, ibu hamil, ibu nifas'
    },
    {
      no: 2,
      kategori: 'Balita Ditimbang',
      jumlah: 98,
      lakiLaki: 52,
      perempuan: 46,
      keterangan: 'Usia 0-59 bulan'
    },
    {
      no: 3,
      kategori: 'Balita Diukur Tinggi/Panjang Badan',
      jumlah: 96,
      lakiLaki: 50,
      perempuan: 46,
      keterangan: 'Usia 0-59 bulan'
    },
    {
      no: 4,
      kategori: 'Imunisasi Diberikan',
      jumlah: 76,
      lakiLaki: 38,
      perempuan: 38,
      keterangan: 'Sesuai jadwal imunisasi'
    },
    {
      no: 5,
      kategori: 'Ibu Hamil Diperiksa',
      jumlah: 12,
      lakiLaki: '-',
      perempuan: 12,
      keterangan: 'Pemeriksaan ANC'
    },
    {
      no: 6,
      kategori: 'Ibu Nifas Diperiksa',
      jumlah: 5,
      lakiLaki: '-',
      perempuan: 5,
      keterangan: 'Pemeriksaan nifas'
    },
    {
      no: 7,
      kategori: 'Konseling Gizi',
      jumlah: 18,
      lakiLaki: 8,
      perempuan: 10,
      keterangan: 'Edukasi gizi seimbang'
    }
  ];

  // 5. Data Kunjungan Lengkap (Tab 2 Sesuai Desain Figma)
  const allKunjunganList = [
    {
      no: 1,
      tanggal: '20 Sep 2026',
      nama: 'Siti Aminah',
      nik: '327502*******',
      jenisPasien: 'Ibu Hamil',
      jenisPelayanan: 'Pemeriksaan Kehamilan',
      status: 'Selesai',
      hasilCatatan: 'BB: 62 Kg, TD: 110/70'
    },
    {
      no: 2,
      tanggal: '20 Sep 2026',
      nama: 'Siti Nurhaliza',
      nik: '327502*******',
      jenisPasien: 'Balita',
      jenisPelayanan: 'Imunisasi DPT-HB-Hib',
      status: 'Selesai',
      hasilCatatan: 'Diberikan dosis 1'
    },
    {
      no: 3,
      tanggal: '20 Sep 2026',
      nama: 'Siti Aisyah',
      nik: '327502*******',
      jenisPasien: 'Bayi',
      jenisPelayanan: 'Penimbangan',
      status: 'Selesai',
      hasilCatatan: 'BB: 9 Kg, TB: 50 cm'
    },
    {
      no: 4,
      tanggal: '20 Sep 2026',
      nama: 'Siti Fatimah',
      nik: '327502*******',
      jenisPasien: 'Ibu Hamil',
      jenisPelayanan: 'Pemeriksaan Kehamilan',
      status: 'Selesai',
      hasilCatatan: 'BB: 62 Kg, TD: 120/80'
    },
    {
      no: 5,
      tanggal: '20 Sep 2026',
      nama: 'Siti Zhafira',
      nik: '327502*******',
      jenisPasien: 'Balita',
      jenisPelayanan: 'Pemberian Vitamin',
      status: 'Selesai',
      hasilCatatan: 'Vitamin A'
    },
    {
      no: 6,
      tanggal: '20 Sep 2026',
      nama: 'Siti Zulaikha',
      nik: '327502*******',
      jenisPasien: 'Balita',
      jenisPelayanan: 'Imunisasi BCG',
      status: 'Selesai',
      hasilCatatan: 'BB: 62 Kg, TD: 110/70'
    },
    {
      no: 7,
      tanggal: '20 Sep 2026',
      nama: 'Siti Shakira',
      nik: '327502*******',
      jenisPasien: 'Balita',
      jenisPelayanan: 'Imunisasi Polio',
      status: 'Selesai',
      hasilCatatan: 'BB: 62 Kg, TD: 110/70'
    },
    {
      no: 8,
      tanggal: '19 Sep 2026',
      nama: 'Dewi Sartika',
      nik: '327502*******',
      jenisPasien: 'Ibu Hamil',
      jenisPelayanan: 'Pemeriksaan Kehamilan',
      status: 'Selesai',
      hasilCatatan: 'BB: 58 Kg, TD: 115/75'
    },
    {
      no: 9,
      tanggal: '19 Sep 2026',
      nama: 'Ahmad Rizky',
      nik: '327502*******',
      jenisPasien: 'Balita',
      jenisPelayanan: 'Imunisasi Campak',
      status: 'Selesai',
      hasilCatatan: 'Kondisi sehat'
    },
    {
      no: 10,
      tanggal: '18 Sep 2026',
      nama: 'Nurul Hidayah',
      nik: '327502*******',
      jenisPasien: 'Ibu Nifas',
      jenisPelayanan: 'Pemeriksaan Nifas',
      status: 'Selesai',
      hasilCatatan: 'Kondisi luka baik, ASI lancar'
    },
    {
      no: 11,
      tanggal: '18 Sep 2026',
      nama: 'Farhan Pratama',
      nik: '327502*******',
      jenisPasien: 'Balita',
      jenisPelayanan: 'Penimbangan & Pengukuran',
      status: 'Selesai',
      hasilCatatan: 'BB: 10.2 Kg, TB: 78 cm'
    },
    {
      no: 12,
      tanggal: '17 Sep 2026',
      nama: 'Putri Ayu',
      nik: '327502*******',
      jenisPasien: 'Bayi',
      jenisPelayanan: 'Imunisasi Polio 1',
      status: 'Selesai',
      hasilCatatan: 'Tetes polio diberikan'
    },
    {
      no: 13,
      tanggal: '17 Sep 2026',
      nama: 'Ratna Dewi',
      nik: '327502*******',
      jenisPasien: 'Ibu Balita',
      jenisPelayanan: 'Konseling Gizi',
      status: 'Selesai',
      hasilCatatan: 'Edukasi MPASI 6 bulan'
    }
  ];

  // Filter Data Kunjungan berdasarkan Search Query
  const filteredKunjunganList = useMemo(() => {
    if (!searchQuery.trim()) return allKunjunganList;
    const q = searchQuery.toLowerCase().trim();
    return allKunjunganList.filter(item => 
      item.nama.toLowerCase().includes(q) ||
      item.nik.includes(q) ||
      item.jenisPelayanan.toLowerCase().includes(q) ||
      item.jenisPasien.toLowerCase().includes(q) ||
      item.hasilCatatan.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filter Data Rekapitulasi berdasarkan Search Query
  const filteredRekapitulasiList = useMemo(() => {
    if (!searchQuery.trim()) return rekapitulasiList;
    const q = searchQuery.toLowerCase().trim();
    return rekapitulasiList.filter(item => 
      item.kategori.toLowerCase().includes(q) ||
      item.keterangan.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Pagination untuk Data Kunjungan
  const totalPages = Math.ceil(filteredKunjunganList.length / itemsPerPage) || 1;
  const paginatedKunjungan = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredKunjunganList.slice(start, start + itemsPerPage);
  }, [filteredKunjunganList, currentPage]);

  const handleTampilkan = () => {
    onShowToast && onShowToast(`Data laporan untuk periode ${selectedPeriode} (${selectedJenisLaporan}) berhasil diperbarui!`, 'success');
  };

  // Helper Badge Jenis Pasien
  const getBadgeJenisPasien = (jenis) => {
    switch (jenis) {
      case 'Ibu Hamil':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Balita':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Bayi':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Ibu Nifas':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Ekspor Laporan Handler
  const handleDownloadExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      try {
        if (exportFormat === 'csv') {
          // Buat file CSV untuk diunduh
          let csvContent = 'No,Kategori,Jumlah,Laki-laki,Perempuan,Keterangan\n';
          rekapitulasiList.forEach(r => {
            csvContent += `"${r.no}","${r.kategori}","${r.jumlah}","${r.lakiLaki}","${r.perempuan}","${r.keterangan}"\n`;
          });
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.setAttribute('href', url);
          link.setAttribute('download', `Laporan_Posyandu_${selectedPeriode.replace(/\s+/g, '_')}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // File download PDF resmi Buku KIA
          const link = document.createElement('a');
          link.href = 'https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/Buku_KIA_2024.pdf';
          link.target = '_blank';
          link.download = `Laporan_Bulanan_Posyandu_${selectedPeriode.replace(/\s+/g, '_')}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        onShowToast && onShowToast(`Laporan ${selectedPeriode} berhasil diekspor dalam format ${exportFormat.toUpperCase()}!`, 'success');
        setIsExportModalOpen(false);
      } catch (err) {
        console.error(err);
        onShowToast && onShowToast('Gagal mengekspor laporan: ' + err.message, 'error');
      } finally {
        setIsExporting(false);
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Laporan Bulanan
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Rekapitulasi data kegiatan Posyandu secara otomatis berdasarkan input data harian.
          </p>
        </div>

        {/* Tombol Export Laporan */}
        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE185D] text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
        >
          <Download size={15} />
          <span>Export Laporan</span>
        </button>
      </div>

      {/* 2. Filter Card: Periode, Jenis Laporan, & Tombol Tampilkan */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          {/* Input Periode */}
          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 block">
              Periode
            </label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={selectedPeriode}
                onChange={(e) => setSelectedPeriode(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="Oktober 2025">Oktober 2025</option>
                <option value="September 2025">September 2025</option>
                <option value="Agustus 2025">Agustus 2025</option>
                <option value="Juli 2025">Juli 2025</option>
                <option value="Oktober 2026">Oktober 2026</option>
                <option value="September 2026">September 2026</option>
              </select>
              <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Input Jenis Laporan */}
          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 block">
              Jenis Laporan
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={selectedJenisLaporan}
                onChange={(e) => setSelectedJenisLaporan(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-pink-500 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="Rekap Lengkap">Rekap Lengkap</option>
                <option value="Laporan Balita & Imunisasi">Laporan Balita & Imunisasi</option>
                <option value="Laporan Ibu Hamil & Nifas">Laporan Ibu Hamil & Nifas</option>
                <option value="Laporan Konseling Gizi">Laporan Konseling Gizi</option>
              </select>
              <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Tombol Tampilkan */}
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={handleTampilkan}
              className="w-full py-2.5 bg-[#E11D48] hover:bg-[#BE185D] text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer text-center"
            >
              Tampilkan
            </button>
          </div>
        </div>
      </div>

      {/* 3. 4 Kartu Metrik Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((item) => {
          const IconComp = item.icon;
          return (
            <div 
              key={item.id}
              className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center gap-4 hover:border-pink-200 transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}>
                <IconComp size={22} />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">
                  {item.title}
                </span>
                <span className="text-2xl font-extrabold text-slate-900 block leading-tight mt-0.5">
                  {item.value}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
                  <span>↑</span>
                  <span>{item.trend}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Baris Grafik: Tren Kunjungan Posyandu & Status Imunisasi Balita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Tren Kunjungan Posyandu (Stacked Bar Chart) */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-900">
              Tren Kunjungan Posyandu
            </h3>
            {/* Legend */}
            <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF168B]" />
                <span>Balita</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                <span>Ibu Hamil</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                <span>Ibu Nifas</span>
              </div>
            </div>
          </div>

          {/* SVG / Stacked Bar Visualizer */}
          <div className="pt-2">
            <div className="relative h-48 w-full flex items-end justify-between gap-2 sm:gap-3 px-2 border-b border-slate-100 pb-2">
              {/* Garis Horizontal Acuan */}
              <div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-100 pointer-events-none" />
              <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-slate-100 pointer-events-none" />
              <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-slate-100 pointer-events-none" />
              <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-slate-100 pointer-events-none" />

              {monthlyTrendData.map((d, idx) => {
                const total = d.balita + d.ibuHamil + d.ibuNifas;
                const maxVal = 145; // Skala maksimal bar
                const barHeightPct = Math.min(100, (total / maxVal) * 100);

                const balitaPct = (d.balita / total) * 100;
                const ibuHamilPct = (d.ibuHamil / total) * 100;
                const ibuNifasPct = (d.ibuNifas / total) * 100;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip Hover */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-slate-900 text-white text-[10px] p-2 rounded-xl shadow-xl z-20 whitespace-nowrap pointer-events-none">
                      <span className="font-bold border-b border-slate-700 pb-0.5 mb-1">{d.bulan} (Total: {total})</span>
                      <span className="text-[#FF4D80]">Balita: {d.balita}</span>
                      <span className="text-purple-300">Ibu Hamil: {d.ibuHamil}</span>
                      <span className="text-sky-300">Ibu Nifas: {d.ibuNifas}</span>
                    </div>

                    {/* Stacked Bar Container */}
                    <div 
                      style={{ height: `${barHeightPct}%` }}
                      className="w-full max-w-[18px] rounded-t-md overflow-hidden flex flex-col justify-end transition-all group-hover:opacity-90"
                    >
                      {/* Segment 3: Balita (Pink) */}
                      <div style={{ height: `${balitaPct}%` }} className="bg-[#FF168B] w-full" />
                      {/* Segment 2: Ibu Hamil (Purple) */}
                      <div style={{ height: `${ibuHamilPct}%` }} className="bg-[#8B5CF6] w-full" />
                      {/* Segment 1: Ibu Nifas (Cyan) */}
                      <div style={{ height: `${ibuNifasPct}%` }} className="bg-[#38BDF8] w-full" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Label Bulan (X-Axis) */}
            <div className="flex justify-between gap-2 sm:gap-3 px-2 pt-2 text-[10px] font-semibold text-slate-400 text-center">
              {monthlyTrendData.map((d, idx) => (
                <span key={idx} className="flex-1">{d.bulan}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Status Imunisasi Balita (Donut Chart) */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Status Imunisasi Balita
            </h3>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
              <span>Imunisasi Balita</span>
              <ChevronDown size={13} className="text-slate-400" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 py-2">
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                {/* Lingkaran Background */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#F1F5F9"
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* Segmen 1: Lengkap (76% Pink) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#FF168B"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${(58 / 76) * 238.76} 238.76`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                {/* Segmen 2: Belum Lengkap (16% Purple) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#8B5CF6"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${(12 / 76) * 238.76} 238.76`}
                  strokeDashoffset={`-${(58 / 76) * 238.76}`}
                />
                {/* Segmen 3: Belum Imunisasi (8% Light Pink) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#FDA4AF"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${(6 / 76) * 238.76} 238.76`}
                  strokeDashoffset={`-${((58 + 12) / 76) * 238.76}`}
                />
              </svg>

              {/* Teks di Tengah Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-slate-900 leading-none">
                  {imunisasiData.total}
                </span>
                <span className="text-[10px] text-slate-400 font-medium mt-1">
                  Total Imunisasi
                </span>
              </div>
            </div>

            {/* Legend Donut */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#FF168B] shrink-0" />
                <span className="text-slate-600 font-medium">Lengkap</span>
                <span className="text-slate-900 font-bold ml-auto pl-2">58</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#8B5CF6] shrink-0" />
                <span className="text-slate-600 font-medium">Belum Lengkap</span>
                <span className="text-slate-900 font-bold ml-auto pl-2">12</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#FDA4AF] shrink-0" />
                <span className="text-slate-600 font-medium">Belum Imunisasi</span>
                <span className="text-slate-900 font-bold ml-auto pl-2">6</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Tabel Rekapitulasi & Data Kunjungan (Dengan Tab Navigation) */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
        {/* Header Tab & Search Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tab Navigation */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('rekapitulasi');
                setCurrentPage(1);
              }}
              className={`pb-2.5 text-xs sm:text-sm transition-all cursor-pointer relative ${
                activeTab === 'rekapitulasi'
                  ? 'font-bold text-[#E11D48]'
                  : 'font-semibold text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>Rekapitulasi</span>
              {activeTab === 'rekapitulasi' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E11D48] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('kunjungan');
                setCurrentPage(1);
              }}
              className={`pb-2.5 text-xs sm:text-sm transition-all cursor-pointer relative ${
                activeTab === 'kunjungan'
                  ? 'font-bold text-[#E11D48]'
                  : 'font-semibold text-slate-400 hover:text-slate-600'
              }`}
            >
              <span>Data Kunjungan</span>
              {activeTab === 'kunjungan' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E11D48] rounded-full" />
              )}
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={activeTab === 'rekapitulasi' ? 'Cari kegiatan...' : 'Cari nama atau NIK...'}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-pink-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Konten Tab 1: Rekapitulasi */}
        {activeTab === 'rekapitulasi' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-slate-700 font-bold border-b border-slate-100">
                  <th className="py-3.5 px-5 w-12 text-center">No</th>
                  <th className="py-3.5 px-5">Kategori</th>
                  <th className="py-3.5 px-5 text-center w-24">Jumlah</th>
                  <th className="py-3.5 px-5 text-center w-28">Laki-laki</th>
                  <th className="py-3.5 px-5 text-center w-28">Perempuan</th>
                  <th className="py-3.5 px-5">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredRekapitulasiList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Tidak ada data kegiatan yang cocok dengan "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  filteredRekapitulasiList.map((item, idx) => (
                    <tr key={item.no || idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5 text-center font-medium text-slate-500">{item.no}</td>
                      <td className="py-3.5 px-5 font-semibold text-slate-900">{item.kategori}</td>
                      <td className="py-3.5 px-5 text-center font-bold text-slate-900">{item.jumlah}</td>
                      <td className="py-3.5 px-5 text-center text-slate-600">{item.lakiLaki}</td>
                      <td className="py-3.5 px-5 text-center text-slate-600">{item.perempuan}</td>
                      <td className="py-3.5 px-5 text-slate-500">{item.keterangan}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Konten Tab 2: Data Kunjungan */}
        {activeTab === 'kunjungan' && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 text-slate-700 font-bold border-b border-slate-100">
                    <th className="py-3.5 px-4 w-12 text-center">No</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Tanggal Kunjungan</th>
                    <th className="py-3.5 px-4">Nama</th>
                    <th className="py-3.5 px-4">NIK</th>
                    <th className="py-3.5 px-4 text-center">Jenis Pasien</th>
                    <th className="py-3.5 px-4">Jenis Pelayanan</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4">Hasil / Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {paginatedKunjungan.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Tidak ada data kunjungan yang cocok dengan "{searchQuery}".
                      </td>
                    </tr>
                  ) : (
                    paginatedKunjungan.map((item, idx) => (
                      <tr key={item.no || idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 text-center font-medium text-slate-500">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">{item.tanggal}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">{item.nama}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">{item.nik}</td>
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeJenisPasien(item.jenisPasien)}`}>
                            {item.jenisPasien}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">{item.jenisPelayanan}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-emerald-200">
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{item.hasilCatatan}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Data Kunjungan */}
            <div className="p-4 sm:p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 font-medium">
                Menampilkan {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredKunjunganList.length)} dari {filteredKunjunganList.length} hasil
              </span>

              {/* Tombol Halaman */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-[#E11D48] text-white shadow-xs'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 6. Modal Ekspor Laporan */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Download size={18} className="text-[#E11D48]" />
                <span>Export Laporan Posyandu</span>
              </div>
              <button 
                type="button" 
                onClick={() => setIsExportModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <p className="text-slate-500 leading-relaxed">
                Pilih format dokumen laporan rekapitulasi Posyandu untuk periode <strong>{selectedPeriode}</strong>:
              </p>

              {/* Opsi PDF */}
              <div 
                onClick={() => setExportFormat('pdf')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  exportFormat === 'pdf'
                    ? 'border-[#E11D48] bg-rose-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Format PDF Resmi</h4>
                    <span className="text-[11px] text-slate-400">Standar Buku KIA & Rekapitulasi Kemenkes</span>
                  </div>
                </div>
                {exportFormat === 'pdf' && (
                  <CheckCircle2 size={18} className="text-[#E11D48]" />
                )}
              </div>

              {/* Opsi CSV / Excel */}
              <div 
                onClick={() => setExportFormat('csv')}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  exportFormat === 'csv'
                    ? 'border-[#E11D48] bg-rose-50/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Format Spreadsheet (CSV)</h4>
                    <span className="text-[11px] text-slate-400">Kompatibel dengan Microsoft Excel & Google Sheets</span>
                  </div>
                </div>
                {exportFormat === 'csv' && (
                  <CheckCircle2 size={18} className="text-[#E11D48]" />
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isExporting}
                onClick={handleDownloadExport}
                className="inline-flex items-center gap-2 px-5 py-2 bg-[#E11D48] hover:bg-[#BE185D] text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isExporting ? (
                  <span>Mengunduh...</span>
                ) : (
                  <>
                    <Download size={14} />
                    <span>Unduh Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
