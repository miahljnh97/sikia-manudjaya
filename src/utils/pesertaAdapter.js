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
 * Tentukan kategori peserta ('Ibu Hamil' | 'Balita' | 'Bayi' | 'Ibu Menyusui' | 'Lainnya')
 * @param {Object} raw 
 * @returns {'Ibu Hamil'|'Balita'|'Bayi'|'Ibu Balita'}
 */
export function tentukanJenisPeserta(raw) {
  // Jika sudah memiliki field jenis_peserta (misal format dummy atau sudah dinormalisasi)
  if (raw.jenis_peserta) return raw.jenis_peserta;

  // Baca dari kolom tipe langsung atau relasi tipe_peserta
  const tipe = (raw.tipe_peserta?.kode || raw.tipe || '').toLowerCase();
  const statusIbu = (raw.status_ibu || '').toLowerCase();

  if (tipe === 'ibu') {
    if (statusIbu === 'hamil') return 'Ibu Hamil';
    return 'Ibu Hamil'; // Default kategori ibu di Posyandu KIA jika tidak spesifik
  }

  if (tipe === 'anak') {
    if (raw.tgl_lahir) {
      const lahir = new Date(raw.tgl_lahir);
      if (!isNaN(lahir.getTime())) {
        const selisihBulan = (new Date().getFullYear() - lahir.getFullYear()) * 12 + (new Date().getMonth() - lahir.getMonth());
        if (selisihBulan < 12) {
          return 'Bayi';
        }
        return 'Balita';
      }
    }
    return 'Balita';
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
  if (!jenisKelamin) {
    const tipeKode = (row.tipe_peserta?.kode || row.tipe || '').toLowerCase();
    jenisKelamin = (tipeKode === 'ibu' || jenisPeserta === 'Ibu Hamil') ? 'Perempuan' : 'Laki-laki';
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
  'anak': '29bad3a5-2808-4ebd-be57-391ff0126b80',
  'balita': '29bad3a5-2808-4ebd-be57-391ff0126b80',
  'bayi': '29bad3a5-2808-4ebd-be57-391ff0126b80'
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
  for (const [key, uuid] of Object.entries(TIPE_MAP)) {
    if (lower.includes(key)) return uuid;
  }
  return null;
}

