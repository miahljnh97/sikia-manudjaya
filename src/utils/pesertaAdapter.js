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

  // 1. Cek jika sudah memiliki jenis_peserta non-default yang valid
  if (raw.jenis_peserta && ['Ibu Hamil', 'Bayi', 'Lansia'].includes(raw.jenis_peserta)) {
    return raw.jenis_peserta;
  }

  // 2. Cek status ibu dari DB ('hamil', 'menyusui')
  const statusIbu = (raw.status_ibu || '').toLowerCase();
  if (statusIbu.includes('hamil') || statusIbu.includes('menyusui')) {
    return 'Ibu Hamil';
  }

  // 3. Cek tipe_id UUID atau kode tipe_peserta
  const tipeId = String(raw.tipe_id || '').toLowerCase();
  const tipeKode = (raw.tipe_peserta?.kode || raw.tipe || '').toLowerCase();

  const isTipeIbu = tipeKode.includes('ibu') || tipeId === 'b5e84397-0be0-4515-9fe1-6222b6792bc3';
  const isTipeAnak = tipeKode.includes('anak') || tipeKode.includes('balita') || tipeKode.includes('bayi') || tipeId === '29bad3a5-2808-4ebd-be57-391ff0126b80';
  const isTipeLansia = tipeKode.includes('lansia');

  // 4. Hitung usia dari tgl_lahir
  const tglLahirStr = raw.tgl_lahir || raw.tanggal_lahir;
  let usiaTahun = null;
  let usiaBulan = null;

  if (tglLahirStr) {
    const lahir = new Date(tglLahirStr);
    if (!isNaN(lahir.getTime())) {
      const now = new Date();
      usiaTahun = now.getFullYear() - lahir.getFullYear();
      usiaBulan = (now.getFullYear() - lahir.getFullYear()) * 12 + (now.getMonth() - lahir.getMonth());
    }
  }

  // Lansia: usia >= 60 tahun atau tipe lansia
  if (isTipeLansia || (usiaTahun !== null && usiaTahun >= 60)) {
    return 'Lansia';
  }

  // Klasifikasi berdasarkan usia jika tersedia
  if (usiaTahun !== null) {
    // Bayi: usia di bawah 12 bulan (< 1 tahun)
    if (usiaBulan !== null && usiaBulan < 12 && !isTipeIbu) {
      return 'Bayi';
    }

    // Balita: usia 1 s.d. 5 tahun
    if (usiaTahun >= 1 && usiaTahun < 6 && !isTipeIbu) {
      return 'Balita';
    }

    // Usia remaja / dewasa (>= 12 tahun)
    if (usiaTahun >= 12) {
      return 'Ibu Hamil';
    }
  }

  // Fallback berdasarkan tipe_id / kode
  if (isTipeIbu) return 'Ibu Hamil';
  if (isTipeLansia) return 'Lansia';
  if (isTipeAnak) {
    if (usiaBulan !== null && usiaBulan < 12) return 'Bayi';
    return 'Balita';
  }

  if (raw.jenis_peserta) return raw.jenis_peserta;

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
  'anak': '29bad3a5-2808-4ebd-be57-391ff0126b80',
  'balita': '29bad3a5-2808-4ebd-be57-391ff0126b80',
  'bayi': '29bad3a5-2808-4ebd-be57-391ff0126b80',
  'lansia': 'b5e84397-0be0-4515-9fe1-6222b6792bc3'
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

