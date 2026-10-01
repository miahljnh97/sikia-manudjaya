import { getTanggalFormatSingkat, getTanggalFormatStandar } from '../../utils/dateUtils';

const todayShort = getTanggalFormatSingkat();
const todayLong = getTanggalFormatStandar();

export const DUMMY_RIWAYAT_KUNJUNGAN = [
  {
    id: 1,
    no_registrasi: 'KJ-0924-0185',
    no_antrean: 'A-12',
    nama: 'Siti Aminah',
    nik: '327502*******',
    nik_lengkap: '327301******0004',
    jenis_peserta: 'Ibu Hamil',
    tanggal_kunjungan: todayShort,
    tanggal_kunjungan_lengkap: todayLong,
    waktu: '09:30 WIB',
    tempat: 'Posyandu Desa Manud Jaya',
    jenis_pelayanan: 'Pemeriksaan Kehamilan',
    hasil_catatan: 'BB: 62 Kg TD: 110/70',
    status: 'Selesai',
    status_lengkap: 'Selesai Dilayani',
    status_kehadiran: 'Hadir',
    status_peserta: 'Aktif',
    dusun: 'Dusun 1',
    petugas: 'Bidan Siti, S.Tr.Keb',
    hasil_pemeriksaan: {
      berat_badan: '62 kg',
      tinggi_badan: '158 cm',
      tekanan_darah: '110/70 mmHg',
      lingkar_lengan: '28 cm',
      usia_kehamilan: '24 minggu'
    },
    layanan_tambahan: {
      tablet_fe: '62 kg',
      konseling_gizi: 'Pola makan',
      edukasi: 'Tanda Bahaya Kehamilan'
    },
    catatan_pemeriksaan: 'Kondisi ibu dan janin baik. Tidak ada keluhan. Disarankan istirahat cukup, konsumsi tablet tambah darah, dan kontrol kembali sesuai jadwal.'
  },
  {
    id: 2,
    no_registrasi: 'KJ-0924-0186',
    no_antrean: 'A-13',
    nama: 'Siti Nurhaliza',
    nik: '327502*******',
    nik_lengkap: '327502******0012',
    jenis_peserta: 'Balita',
    tanggal_kunjungan: todayShort,
    tanggal_kunjungan_lengkap: todayLong,
    waktu: '09:45 WIB',
    tempat: 'Posyandu Desa Manud Jaya',
    jenis_pelayanan: 'Imunisasi DPT-HB-Hib',
    hasil_catatan: 'Diberikan dosis 1',
    status: 'Selesai',
    status_lengkap: 'Selesai Dilayani',
    status_kehadiran: 'Hadir',
    status_peserta: 'Aktif',
    dusun: 'Dusun 2',
    petugas: 'Bidan Siti, S.Tr.Keb',
    hasil_pemeriksaan: {
      berat_badan: '12.4 kg',
      tinggi_badan: '88 cm',
      lingkar_kepala: '48 cm',
      suhu_tubuh: '36.6 °C'
    },
    layanan_tambahan: {
      vitamin: 'Vitamin A Biru',
      edukasi: 'Imunisasi Lanjutan'
    },
    catatan_pemeriksaan: 'Balita sehat, nafsu makan baik. Diberikan parasetamol drop sebagai antisipasi demam pasca imunisasi.'
  },
  {
    id: 3,
    no_registrasi: 'KJ-0924-0187',
    no_antrean: 'A-14',
    nama: 'Siti Aisyah',
    nik: '327502*******',
    nik_lengkap: '327502******0033',
    jenis_peserta: 'Bayi',
    tanggal_kunjungan: todayShort,
    tanggal_kunjungan_lengkap: todayLong,
    waktu: '10:00 WIB',
    tempat: 'Posyandu Desa Manud Jaya',
    jenis_pelayanan: 'Penimbangan',
    hasil_catatan: 'BB: 6 Kg TB: 50 cm',
    status: 'Selesai',
    status_lengkap: 'Selesai Dilayani',
    status_kehadiran: 'Hadir',
    status_peserta: 'Aktif',
    dusun: 'Dusun 1',
    petugas: 'Annisa Wati (Kader)',
    hasil_pemeriksaan: {
      berat_badan: '6 kg',
      tinggi_badan: '50 cm',
      lingkar_kepala: '38 cm'
    },
    layanan_tambahan: {
      edukasi: 'ASI Eksklusif 6 Bulan'
    },
    catatan_pemeriksaan: 'Pertumbuhan bayi sangat baik pada kurva KMS (garis hijau).'
  },
  {
    id: 4,
    no_registrasi: 'KJ-0924-0188',
    no_antrean: 'A-15',
    nama: 'Siti Fatimah',
    nik: '327501*******',
    nik_lengkap: '327501******0054',
    jenis_peserta: 'Ibu Hamil',
    tanggal_kunjungan: todayShort,
    tanggal_kunjungan_lengkap: todayLong,
    waktu: '10:15 WIB',
    tempat: 'Posyandu Desa Manud Jaya',
    jenis_pelayanan: 'Pemeriksaan Kehamilan',
    hasil_catatan: 'BB: 62 Kg TD: 120/80',
    status: 'Selesai',
    status_lengkap: 'Selesai Dilayani',
    status_kehadiran: 'Hadir',
    status_peserta: 'Aktif',
    dusun: 'Dusun 3',
    petugas: 'Bidan Siti, S.Tr.Keb',
    hasil_pemeriksaan: {
      berat_badan: '62 kg',
      tinggi_badan: '155 cm',
      tekanan_darah: '120/80 mmHg',
      lingkar_lengan: '27 cm',
      usia_kehamilan: '30 minggu'
    },
    layanan_tambahan: {
      tablet_fe: '30 tablet',
      konseling_gizi: 'Cegah Anemia'
    },
    catatan_pemeriksaan: 'Tekanan darah normal, denyut jantung janin reguler.'
  },
  {
    id: 5,
    no_registrasi: 'KJ-0924-0189',
    no_antrean: 'A-16',
    nama: 'Siti Zhafira',
    nik: '327502*******',
    nik_lengkap: '327502******0065',
    jenis_peserta: 'Balita',
    tanggal_kunjungan: todayShort,
    tanggal_kunjungan_lengkap: todayLong,
    waktu: '10:30 WIB',
    tempat: 'Posyandu Desa Manud Jaya',
    jenis_pelayanan: 'Pemberian Vitamin',
    hasil_catatan: 'Vitamin A',
    status: 'Selesai',
    status_lengkap: 'Selesai Dilayani',
    status_kehadiran: 'Hadir',
    status_peserta: 'Aktif',
    dusun: 'Dusun 2',
    petugas: 'Annisa Wati (Kader)',
    hasil_pemeriksaan: {
      berat_badan: '14.1 kg',
      tinggi_badan: '95 cm'
    },
    layanan_tambahan: {
      vitamin: 'Kapsul Vitamin A Merah'
    },
    catatan_pemeriksaan: 'Pemberian kapsul vitamin A merah berjalan lancar.'
  },
  {
    id: 6,
    no_registrasi: 'KJ-0924-0190',
    no_antrean: 'A-17',
    nama: 'Siti Zulaikha',
    nik: '327501*******',
    nik_lengkap: '327501******0076',
    jenis_peserta: 'Balita',
    tanggal_kunjungan: todayShort,
    tanggal_kunjungan_lengkap: todayLong,
    waktu: '10:45 WIB',
    tempat: 'Posyandu Desa Manud Jaya',
    jenis_pelayanan: 'Imunisasi BCG',
    hasil_catatan: 'BB: 62 Kg TD: 110/70',
    status: 'Selesai',
    status_lengkap: 'Selesai Dilayani',
    status_kehadiran: 'Hadir',
    status_peserta: 'Aktif',
    dusun: 'Dusun 1',
    petugas: 'Bidan Siti, S.Tr.Keb',
    hasil_pemeriksaan: {
      berat_badan: '5.2 kg',
      tinggi_badan: '58 cm'
    },
    layanan_tambahan: {
      edukasi: 'Perawatan bekas suntikan BCG'
    },
    catatan_pemeriksaan: 'Penyuntikan BCG intrakutan lengan kanan atas berhasil.'
  },
  {
    id: 7,
    no_registrasi: 'KJ-0924-0191',
    no_antrean: 'A-18',
    nama: 'Siti Shakiva',
    nik: '327501*******',
    nik_lengkap: '327501******0087',
    jenis_peserta: 'Balita',
    tanggal_kunjungan: todayShort,
    tanggal_kunjungan_lengkap: todayLong,
    waktu: '11:00 WIB',
    tempat: 'Posyandu Desa Manud Jaya',
    jenis_pelayanan: 'Imunisasi Polio',
    hasil_catatan: 'BB: 62 Kg TD: 110/70',
    status: 'Selesai',
    status_lengkap: 'Selesai Dilayani',
    status_kehadiran: 'Hadir',
    status_peserta: 'Aktif',
    dusun: 'Dusun 1',
    petugas: 'Annisa Wati (Kader)',
    hasil_pemeriksaan: {
      berat_badan: '11.8 kg',
      tinggi_badan: '86 cm'
    },
    layanan_tambahan: {
      imunisasi: 'Tetes Polio bOPV Dosis 2'
    },
    catatan_pemeriksaan: '2 tetes polio berhasil diminum balita tanpa muntah.'
  }
];
