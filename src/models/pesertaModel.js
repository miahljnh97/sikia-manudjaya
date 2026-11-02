/**
 * @typedef {Object} Peserta
 * @property {number|string} id
 * @property {string} nama
 * @property {string} nik
 * @property {'Ibu Hamil'|'Balita'|'Bayi'|'Lansia'} jenis_peserta
 * @property {string} usia
 * @property {string} alamat
 * @property {'Sudah Hadir'|'Belum Hadir'|'Tidak Hadir'} status_kehadiran
 * @property {string|null} waktu_hadir
 */

// Data peserta murni diambil langsung dari tabel peserta Supabase
export const INITIAL_DUMMY_PESERTA = [];

export const DUMMY_ACCOUNTS = {
  kader: {
    email: 'kader.posyandu@manudjaya.id',
    role: 'Kader Posyandu',
    nama: 'Annisa Wati',
    id: '5c69e5ca-ba37-41b5-964e-5ef2525ef36d',
    petugas_id: '5c69e5ca-ba37-41b5-964e-5ef2525ef36d',
  },
  bidan: {
    email: 'bidan.desa@manudjaya.id',
    role: 'Bidan Desa',
    nama: 'Khansa Fatin', // Sesuai profil Figma Bidan
    id: 'fb044287-90d3-4d64-b30e-e5fc58f85f91',
    petugas_id: 'fb044287-90d3-4d64-b30e-e5fc58f85f91',
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

/**
 * Helper untuk mendapatkan peserta_id yang valid berdasarkan data user login.
 * Memastikan persona ibu hamil, ibu balita, dan ibu hamil-balita memiliki ID peserta yang tepat.
 */
export function getPesertaIdFromUser(user) {
  if (!user) return null;
  if (user.peserta_id) return user.peserta_id;
  const email = (user.user?.email || user.email || '').toLowerCase().trim();
  if (email === 'ibu.balita@manudjaya.id') return 'd5eeb9a6-3509-44ec-8fce-e95f3edd1a73';
  if (email === 'ibu.hamil@manudjaya.id') return '214fbe12-2216-4e61-9b12-9fccca445e84';
  if (email === 'ibu.hamil.anak@manudjaya.id' || email === 'siti.aminah@manudjaya.id') return '55af67c9-6695-4435-b4ea-2720efd73c92';
  return user.user?.id || user.id || null;
}
