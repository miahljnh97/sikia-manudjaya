/**
 * @typedef {Object} Peserta
 * @property {number|string} id
 * @property {string} nama
 * @property {string} nik
 * @property {'Ibu Hamil'|'Balita'|'Bayi'} jenis_peserta
 * @property {string} usia
 * @property {string} alamat
 * @property {'Sudah Hadir'|'Belum Hadir'|'Tidak Hadir'} status_kehadiran
 * @property {string|null} waktu_hadir
 */

export const INITIAL_DUMMY_PESERTA = [
  {
    id: 1,
    nama: 'Siti Aminah',
    nik: '3275021911970001',
    jenis_peserta: 'Ibu Hamil',
    usia: '28 tahun',
    alamat: 'Manud Jaya',
    status_kehadiran: 'Sudah Hadir',
    waktu_hadir: '08.45'
  },
  {
    id: 2,
    nama: 'Aisyah Putri',
    nik: '3275021404220002',
    jenis_peserta: 'Balita',
    usia: '3 tahun',
    alamat: 'Manud Jaya',
    status_kehadiran: 'Belum Hadir',
    waktu_hadir: null
  },
  {
    id: 3,
    nama: 'Budi Santoso',
    nik: '3275022108250003',
    jenis_peserta: 'Bayi',
    usia: '8 bulan',
    alamat: 'Manud Jaya',
    status_kehadiran: 'Sudah Hadir',
    waktu_hadir: '08.45'
  },
  {
    id: 4,
    nama: 'Nur Halimah',
    nik: '3275021205940004',
    jenis_peserta: 'Ibu Hamil',
    usia: '31 tahun',
    alamat: 'Manud Jaya',
    status_kehadiran: 'Sudah Hadir',
    waktu_hadir: '08.45'
  },
  {
    id: 5,
    nama: 'Dimas Setiawan',
    nik: '3275020909230005',
    jenis_peserta: 'Balita',
    usia: '2 tahun',
    alamat: 'Manud Jaya',
    status_kehadiran: 'Belum Hadir',
    waktu_hadir: null
  },
  {
    id: 6,
    nama: 'Lina Marlina',
    nik: '3275021607210006',
    jenis_peserta: 'Balita',
    usia: '4 tahun',
    alamat: 'Manud Jaya',
    status_kehadiran: 'Tidak Hadir',
    waktu_hadir: null
  },
  {
    id: 7,
    nama: 'Rani Septiani',
    nik: '3275022802990007',
    jenis_peserta: 'Ibu Hamil',
    usia: '26 tahun',
    alamat: 'Manud Jaya',
    status_kehadiran: 'Sudah Hadir',
    waktu_hadir: '08.45'
  }
];

export const DUMMY_ACCOUNTS = {
  kader: {
    email: 'kader.posyandu@manudjaya.id',
    role: 'Kader Posyandu',
    nama: 'Annisa Wati',
  },
  bidan: {
    email: 'bidan.desa@manudjaya.id',
    role: 'Bidan Desa',
    nama: 'Bidan Siti, S.Tr.Keb',
  },
  ibu: {
    email: 'ibu.balita@manudjaya.id',
    role: 'Ibu Balita',
    nama: 'Ibu Aminah',
  },
  admin: {
    email: 'admin.desa@manudjaya.id',
    role: 'Super Admin',
    nama: 'Bambang Sudarmono, S.STP',
  }
};
