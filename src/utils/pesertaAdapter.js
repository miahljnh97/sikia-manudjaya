import { toISODateString } from './dateUtils';

/**
 * Normalizer untuk memetakan skema database Supabase tabel `peserta`
 * ke format standar yang digunakan oleh komponen antarmuka front-end SIKIA.
 *
 * Skema Supabase:
 * - id: number
 * - tipe: "ibu" | "anak"
 * - status_ibu: "hamil" | "menyusui" | null
 * - tgl_lahir: "YYYY-MM-DD"
 * - nama, nik, no_kk, alamat, dusun, aktif, is_suspended, nama_suami, no_wa
 */

/**
 * Hitung usia dalam bentuk teks ramah pengguna (misal: "8 bulan", "2 tahun", "28 tahun")
 * @param {string} tglLahirStr - Format YYYY-MM-DD
 * @returns {string}
 */
export function hitungUsiaDariTglLahir(tglLahirStr) {
  if (!tglLahirStr) return '-';
  const lahir = new Date(tglLahirStr);
  if (isNaN(lahir.getTime())) return '-';

  const sekarang = new Date();
  let tahun = sekarang.getFullYear() - lahir.getFullYear();
  let bulan = sekarang.getMonth() - lahir.getMonth();
  let hari = sekarang.getDate() - lahir.getDate();

  if (hari < 0) {
    bulan -= 1;
  }
  if (bulan < 0) {
    tahun -= 1;
    bulan += 12;
  }

  if (tahun < 0) return '0 bulan';

  if (tahun === 0) {
    const totalBulan = bulan <= 0 ? 0 : bulan;
    return `${totalBulan} bulan`;
  }

  if (tahun < 5 && bulan > 0) {
    return `${tahun} tahun ${bulan} bulan`;
  }

  return `${tahun} tahun`;
}

/**
 * Tentukan kategori peserta ('Ibu Hamil' | 'Balita' | 'Bayi' | 'Lansia')
 * @param {Object} raw 
 * @returns {'Ibu Hamil'|'Balita'|'Bayi'|'Lansia'}
 */
export function tentukanJenisPeserta(raw) {
  if (!raw) return 'Balita';

  // 1. Prioritas Utama: Baca langsung dari relasi master tipe_peserta di Supabase (nama / kode)
  if (raw.tipe_peserta?.nama) {
    const nama = raw.tipe_peserta.nama.trim();
    const namaLower = nama.toLowerCase();
    if (namaLower.includes('ibu')) return 'Ibu Hamil';
    if (namaLower.includes('lansia')) return 'Lansia';
    if (namaLower.includes('bayi')) return 'Bayi';
    if (namaLower.includes('balita')) return 'Balita';
    if (namaLower.includes('anak')) return 'Balita';
    return nama;
  }

  if (raw.tipe_peserta?.kode) {
    const k = raw.tipe_peserta.kode.toLowerCase();
    if (k.includes('ibu')) return 'Ibu Hamil';
    if (k.includes('lansia')) return 'Lansia';
    if (k.includes('bayi')) return 'Bayi';
    if (k.includes('balita') || k.includes('anak')) return 'Balita';
  }

  // 2. Cek tipe_id UUID langsung (4 UUID resmi master tipe_peserta di database Supabase)
  const tipeId = String(raw.tipe_id || '').toLowerCase();
  if (tipeId === 'b5e84397-0be0-4515-9fe1-6222b6792bc3') return 'Ibu Hamil';
  if (tipeId === '7e4f92a1-8812-4d34-99fe-abcdef123456') return 'Lansia';
  if (tipeId === '3a7c81d2-9901-4c12-88ef-123456789abc') return 'Bayi';
  if (tipeId === '29bad3a5-2808-4ebd-be57-391ff0126b80') return 'Balita';

  // 3. Cek properti jenis_peserta eksplisit
  if (raw.jenis_peserta && ['Ibu Hamil', 'Balita', 'Bayi', 'Lansia'].includes(raw.jenis_peserta)) {
    return raw.jenis_peserta;
  }

  // 4. Cek status_ibu dari DB ('hamil', 'menyusui')
  const statusIbu = (raw.status_ibu || '').toLowerCase();
  if (statusIbu.includes('hamil') || statusIbu.includes('menyusui')) {
    return 'Ibu Hamil';
  }

  // 5. Cek kolom legacy tipe
  const legacyTipe = (raw.tipe || '').toLowerCase();
  if (legacyTipe.includes('ibu')) return 'Ibu Hamil';
  if (legacyTipe.includes('lansia')) return 'Lansia';

  // 6. Fallback kalkulasi usia jika tipe_peserta tidak diset di database
  const tglLahirStr = raw.tgl_lahir || raw.tanggal_lahir;
  if (tglLahirStr) {
    const lahir = new Date(tglLahirStr);
    if (!isNaN(lahir.getTime())) {
      const now = new Date();
      const usiaTahun = now.getFullYear() - lahir.getFullYear();
      const usiaBulan = (now.getFullYear() - lahir.getFullYear()) * 12 + (now.getMonth() - lahir.getMonth());
      if (usiaTahun >= 60) return 'Lansia';
      if (usiaBulan < 12) return 'Bayi';
      if (usiaTahun >= 1 && usiaTahun < 6) return 'Balita';
      if (usiaTahun >= 12) return 'Ibu Hamil';
    }
  }

  return 'Balita';
}

/**
 * Normalisasi satu baris data peserta dari Supabase
 * @param {Object} row
 * @returns {Object}
 */
export function normalizePeserta(row) {
  if (!row) return null;

  const jenisPeserta = tentukanJenisPeserta(row);
  const usia = row.usia || hitungUsiaDariTglLahir(row.tgl_lahir);

  // Ambil nama dusun dari relasi dusun_id (objek relasi dusun) atau fallback ke kolom dusun
  const namaDusun = row.dusun?.nama || row.dusun || 'Dusun 1';

  // Jenis kelamin
  let jenisKelamin = row.jenis_kelamin;
  if (jenisPeserta === 'Ibu Hamil') {
    jenisKelamin = 'Perempuan';
  } else if (!jenisKelamin) {
    jenisKelamin = 'Laki-laki';
  } else if (jenisKelamin === 'P') {
    jenisKelamin = 'Perempuan';
  } else if (jenisKelamin === 'L') {
    jenisKelamin = 'Laki-laki';
  }

  return {
    ...row,
    id: row.id,
    dusun_id: row.dusun_id || row.dusun?.id || null,
    tipe_id: row.tipe_id || row.tipe_peserta?.id || null,
    nama: row.nama || 'Peserta Tanpa Nama',
    nik: row.nik || '',
    nik_lengkap: row.nik || '',
    no_kk: row.no_kk || '',
    jenis_peserta: jenisPeserta,
    usia: usia,
    alamat: row.alamat || namaDusun || 'Desa Manud Jaya',
    dusun: namaDusun,
    tanggal_lahir: row.tgl_lahir || row.tanggal_lahir || '',
    telepon: row.no_wa || row.telepon || '-',
    jenis_kelamin: jenisKelamin,
    nama_suami: row.nama_suami || null,
    status: (row.aktif !== false && !row.is_suspended) ? 'Aktif' : 'Non-Aktif',
    status_kehadiran: row.status_kehadiran || 'Belum Hadir',
    waktu_hadir: row.waktu_hadir || null,
  };
}

export const DUSUN_MAP = {
  'dusun 1': 'fbe91bbd-c11a-4a19-90ba-ca78f929d791',
  'dusun 2': '200a7c92-6671-4b31-a39f-0a03e1fb4a9f',
  'dusun 3': '3250c081-51e4-44af-b2b6-5535c73f2c41'
};

export const TIPE_MAP = {
  'ibu': 'b5e84397-0be0-4515-9fe1-6222b6792bc3',
  'ibu hamil': 'b5e84397-0be0-4515-9fe1-6222b6792bc3',
  'ibu_hamil': 'b5e84397-0be0-4515-9fe1-6222b6792bc3',
  'balita': '29bad3a5-2808-4ebd-be57-391ff0126b80',
  'anak': '29bad3a5-2808-4ebd-be57-391ff0126b80',
  'bayi': '3a7c81d2-9901-4c12-88ef-123456789abc',
  'lansia': '7e4f92a1-8812-4d34-99fe-abcdef123456'
};

export function isValidUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(str || '').trim());
}

export function resolveDusunId(val) {
  if (!val) return null;
  const s = String(val).trim();
  if (isValidUUID(s)) return s;
  const lower = s.toLowerCase();
  for (const [key, uuid] of Object.entries(DUSUN_MAP)) {
    if (lower.includes(key)) return uuid;
  }
  return null;
}

export function resolveTipeId(val) {
  if (!val) return null;
  const s = String(val).trim();
  if (isValidUUID(s)) return s;
  const lower = s.toLowerCase();
  if (lower.includes('ibu')) return TIPE_MAP['ibu_hamil'];
  if (lower.includes('lansia')) return TIPE_MAP['lansia'];
  if (lower.includes('bayi')) return TIPE_MAP['bayi'];
  if (lower.includes('balita') || lower.includes('anak')) return TIPE_MAP['balita'];
  for (const [key, uuid] of Object.entries(TIPE_MAP)) {
    if (lower.includes(key)) return uuid;
  }
  return null;
}

export const DUSUN_NAME_MAP = {
  'fbe91bbd-c11a-4a19-90ba-ca78f929d791': 'Dusun 1',
  '200a7c92-6671-4b31-a39f-0a03e1fb4a9f': 'Dusun 2',
  '3250c081-51e4-44af-b2b6-5535c73f2c41': 'Dusun 3',
};

/**
 * Konversi status kehadiran dari UI/Input ke format resmi database Supabase
 * Nilai DB resmi: 'hadir' | 'tidak_hadir' | 'menunggu' | 'sudah_dilayani'
 */
export function toDbStatusKehadiran(statusUi) {
  const s = String(statusUi || '').toLowerCase();
  if (s.includes('tidak')) return 'tidak_hadir';
  if (s.includes('dilayani') || s.includes('selesai')) return 'sudah_dilayani';
  if (s.includes('tunggu')) return 'menunggu';
  return 'hadir';
}

/**
 * Konversi status kehadiran dari DB ke format ramah UI
 * Label UI resmi: 'Hadir' | 'Tidak Hadir' | 'Menunggu' | 'Sudah dilayani'
 */
export function fromDbStatusKehadiran(statusDb) {
  const s = String(statusDb || '').toLowerCase();
  if (s.includes('tidak')) return 'Tidak Hadir';
  if (s.includes('dilayani') || s.includes('selesai')) return 'Sudah dilayani';
  if (s.includes('tunggu')) return 'Menunggu';
  return 'Hadir';
}

/**
 * Format payload bersih sebelum dikirim (insert/update) ke tabel `peserta` Supabase
 */
export function formatPesertaDbPayload(formData) {
  if (!formData) return {};
  const isIbu = (formData.jenis_peserta || '').toLowerCase().includes('ibu');
  
  const payload = {
    nama: formData.nama?.trim() || 'Peserta',
    nik: String(formData.nik || '').trim(),
    no_kk: formData.no_kk ? String(formData.no_kk).trim() : null,
    alamat: formData.alamat || null,
    dusun_id: resolveDusunId(formData.dusun_id || formData.dusun),
    tipe_id: resolveTipeId(formData.jenis_peserta) || resolveTipeId(formData.tipe_id),
    status_ibu: isIbu ? 'hamil' : null,
    tgl_lahir: formData.tgl_lahir || formData.tanggal_lahir || null,
    no_wa: formData.telepon || formData.no_wa || null,
    jenis_kelamin: formData.jenis_kelamin === 'Perempuan' ? 'P' : (formData.jenis_kelamin === 'Laki-laki' ? 'L' : (formData.jenis_kelamin || null)),
    nama_suami: formData.nama_suami || null,
    aktif: formData.aktif !== false,
    is_suspended: Boolean(formData.is_suspended),
  };

  // Buang properti undefined agar tidak error di Supabase
  Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
  return payload;
}

