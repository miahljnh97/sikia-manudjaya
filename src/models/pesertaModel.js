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
