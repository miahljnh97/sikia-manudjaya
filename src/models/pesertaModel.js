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

// Daftar peserta diambil 100% dari tabel `peserta` Supabase
export const INITIAL_DUMMY_PESERTA = [];

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
  ibu_hamil: {
    email: 'ibu.hamil@manudjaya.id',
    role: 'Ibu',
    nama: 'Najwa Sihab',
    peserta_id: '214fbe12-2216-4e61-9b12-9fccca445e84', // Ibu Hamil Saja (Belum punya anak)
  },
  ibu_balita: {
    email: 'ibu.balita@manudjaya.id',
    role: 'Ibu',
    nama: 'Ibu Ratna',
    peserta_id: 'd5eeb9a6-3509-44ec-8fce-e95f3edd1a73', // Ibu Balita Saja (Alea Shanum Almahira)
  },
  ibu_hamil_anak: {
    email: 'ibu.hamil.anak@manudjaya.id',
    role: 'Ibu',
    nama: 'Siti Aminah',
    peserta_id: '55af67c9-6695-4435-b4ea-2720efd73c92', // Ibu Hamil dengan Balita (Dian Pranata)
  },
  calon_ibu: {
    email: 'calon.ibu@manudjaya.id',
    role: 'Ibu',
    nama: 'Dewi Lestari',
    peserta_id: '77777777-7777-7777-7777-777777777777', // Calon Ibu / Prakonsepsi
  },
  ibu: {
    email: 'ibu.hamil@manudjaya.id',
    role: 'Ibu',
    nama: 'Najwa Sihab',
    peserta_id: '214fbe12-2216-4e61-9b12-9fccca445e84',
  },
  admin: {
    email: 'admin.desa@manudjaya.id',
    role: 'Super Admin',
    nama: 'Bambang Sudarmono, S.STP',
  }
};