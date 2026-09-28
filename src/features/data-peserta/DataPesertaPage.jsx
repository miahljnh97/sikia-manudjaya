import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, Plus, FileText, ChevronLeft, ChevronRight, User } from 'lucide-react';
import DetailPeserta from './components/DetailPeserta';

export const DUMMY_DATA_PESERTA = [
  {
    id: 1,
    nama: 'Siti Aminah',
    nik: '327502152664875',
    jenis_peserta: 'Ibu Hamil',
    tanggal_lahir: '19/11/1997',
    usia: '29 tahun',
    alamat: 'Dusun 1',
    telepon: '081292836382',
    email: 'siti.aminah@example.com',
    jenis_kelamin: 'Perempuan',
    telepon_pj: '081291281928',
    catatan_observasi: 'Pasien perlu rujukan',
    status: 'Aktif'
  },
  {
    id: 2,
    nama: 'Siti Nurhaliza',
    nik: '327502********',
    jenis_peserta: 'Balita',
    tanggal_lahir: '03 Feb 2023',
    usia: '3 tahun',
    alamat: 'Dusun 2',
    telepon: '081234567891',
    email: 'nurhaliza@example.com',
    jenis_kelamin: 'Perempuan',
    telepon_pj: '081234567800',
    catatan_observasi: 'Imunisasi lengkap sesuai jadwal',
    status: 'Aktif'
  },
  {
    id: 3,
    nama: 'Siti Aisyah',
    nik: '327502********',
    jenis_peserta: 'Bayi',
    tanggal_lahir: '18 Ags 2025',
    usia: '1 bulan',
    alamat: 'Dusun 1',
    telepon: '081234567892',
    email: 'aisyah@example.com',
    jenis_kelamin: 'Perempuan',
    telepon_pj: '081234567801',
    catatan_observasi: 'Pemberian ASI eksklusif',
    status: 'Aktif'
  },
  {
    id: 4,
    nama: 'Siti Fatimah',
    nik: '327501********',
    jenis_peserta: 'Ibu Hamil',
    tanggal_lahir: '21 Jan 1996',
    usia: '30 tahun',
    alamat: 'Dusun 3',
    telepon: '081234567893',
    email: 'fatimah@example.com',
    jenis_kelamin: 'Perempuan',
    telepon_pj: '081234567802',
    catatan_observasi: 'Pemberian vitamin dan zat besi',
    status: 'Aktif'
  },
  {
    id: 5,
    nama: 'Siti Zhafira',
    nik: '327502********',
    jenis_peserta: 'Balita',
    tanggal_lahir: '18 Mar 2022',
    usia: '4 tahun',
    alamat: 'Dusun 2',
    telepon: '081234567894',
    email: 'zhafira@example.com',
    jenis_kelamin: 'Perempuan',
    telepon_pj: '081234567803',
    catatan_observasi: 'Tumbuh kembang normal',
    status: 'Aktif'
  },
  {
    id: 6,
    nama: 'Siti Zulaikha',
    nik: '327501********',
    jenis_peserta: 'Balita',
    tanggal_lahir: '27 Jul 2021',
    usia: '5 tahun',
    alamat: 'Dusun 1',
    telepon: '081234567895',
    email: 'zulaikha@example.com',
    jenis_kelamin: 'Perempuan',
    telepon_pj: '081234567804',
    catatan_observasi: 'Perlu cek lingkar kepala lanjutan',
    status: 'Aktif'
  },
  {
    id: 7,
    nama: 'Siti Shakiva',
    nik: '327501********',
    jenis_peserta: 'Balita',
    tanggal_lahir: '27 Jul 2021',
    usia: '5 tahun',
    alamat: 'Dusun 1',
    telepon: '081234567896',
    email: 'shakiva@example.com',
    jenis_kelamin: 'Perempuan',
    telepon_pj: '081234567805',
    catatan_observasi: 'Pemeriksaan rutin berkala',
    status: 'Aktif'
  }
];

export default function DataPesertaPage({ onTambahPesertaBaru }) {
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [searchQuery, setSearchQuery] = useState('siti');
  const [jenisFilter, setJenisFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Aktif');
  const [wilayahFilter, setWilayahFilter] = useState('Semua');
  const [sortOrder, setSortOrder] = useState('Nama A-Z');

  // Filter logic
  const filteredList = useMemo(() => {
    return DUMMY_DATA_PESERTA.filter((item) => {
      const matchSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nik.toLowerCase().includes(searchQuery.toLowerCase());
      const matchJenis = jenisFilter === 'Semua' || item.jenis_peserta === jenisFilter;
      const matchStatus = statusFilter === 'Semua' || item.status === statusFilter;
      const matchWilayah = wilayahFilter === 'Semua' || item.alamat.includes(wilayahFilter);

      return matchSearch && matchJenis && matchStatus && matchWilayah;
    });
  }, [searchQuery, jenisFilter, statusFilter, wilayahFilter]);

  const handleReset = () => {
    setSearchQuery('');
    setJenisFilter('Semua');
    setStatusFilter('Semua');
    setWilayahFilter('Semua');
  };

  // Jika sedang melihat detail salah satu pasien
  if (selectedPeserta) {
    return (
      <DetailPeserta
        peserta={selectedPeserta}
        onBack={() => setSelectedPeserta(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Peserta</h1>
          <p className="text-xs text-slate-500 mt-1">
            Cari peserta yang akan melakukan kunjungan Posyandu.
          </p>
        </div>

        <button
          onClick={onTambahPesertaBaru}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
        >
          <Plus size={16} />
          <span>Tambah Peserta Baru</span>
        </button>
      </div>

      {/* Filter Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Cari berdasarkan nama, NIK, atau nomor KK
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
            />
          </div>
        </div>

        {/* Filter Baris Kedua */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="block text-[11px] text-slate-400 font-medium mb-1">Jenis Peserta</span>
            <select
              value={jenisFilter}
              onChange={(e) => setJenisFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none"
            >
              <option value="Semua">Semua</option>
              <option value="Ibu Hamil">Ibu Hamil</option>
              <option value="Balita">Balita</option>
              <option value="Bayi">Bayi</option>
            </select>
          </div>

          <div>
            <span className="block text-[11px] text-slate-400 font-medium mb-1">Status Peserta</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none"
            >
              <option value="Semua">Semua</option>
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>

          <div>
            <span className="block text-[11px] text-slate-400 font-medium mb-1">Dusun / wilayah</span>
            <select
              value={wilayahFilter}
              onChange={(e) => setWilayahFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none"
            >
              <option value="Semua">Semua</option>
              <option value="Dusun 1">Dusun 1</option>
              <option value="Dusun 2">Dusun 2</option>
              <option value="Dusun 3">Dusun 3</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleReset}
              className="w-full p-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl inline-flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={13} />
              <span>Reset Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabel Hasil Pencarian */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Hasil Pencarian</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Menampilkan 1-{filteredList.length} dari 13 hasil pencarian untuk "{searchQuery || 'semua'}"
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Urutan</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
            >
              <option value="Nama A-Z">Nama A-Z</option>
              <option value="Nama Z-A">Nama Z-A</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/60 text-slate-400 text-[11px] uppercase font-semibold border-b border-slate-100">
                <th className="py-3.5 px-5">No</th>
                <th className="py-3.5 px-5">Nama Peserta</th>
                <th className="py-3.5 px-5">NIK</th>
                <th className="py-3.5 px-5">Jenis Peserta</th>
                <th className="py-3.5 px-5">Tanggal Lahir</th>
                <th className="py-3.5 px-5">Usia</th>
                <th className="py-3.5 px-5">Alamat</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredList.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-5 text-slate-400">{idx + 1}</td>
                  <td className="py-3.5 px-5 font-bold text-slate-900 flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      item.jenis_peserta === 'Ibu Hamil' ? 'bg-rose-100 text-rose-600' :
                      item.jenis_peserta === 'Balita' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <User size={12} />
                    </span>
                    <span>{item.nama}</span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-500">{item.nik}</td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                      item.jenis_peserta === 'Ibu Hamil' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      item.jenis_peserta === 'Balita' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {item.jenis_peserta}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-500">{item.tanggal_lahir}</td>
                  <td className="py-3.5 px-5 text-slate-600">{item.usia}</td>
                  <td className="py-3.5 px-5 text-slate-600">{item.alamat}</td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => setSelectedPeserta(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 shadow-xs transition-colors"
                    >
                      <FileText size={13} className="text-slate-400" />
                      <span>Detail</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>Menampilkan 1-{filteredList.length} dari 13 hasil</div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
              <ChevronLeft size={16} />
            </button>
            <button className="w-7 h-7 rounded-lg bg-blue-600 text-white font-semibold text-xs flex items-center justify-center">
              1
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-slate-100 font-medium text-xs flex items-center justify-center text-slate-600">
              2
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
