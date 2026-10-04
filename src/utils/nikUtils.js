/**
 * Helper untuk format dan masking NIK (Nomor Induk Kependudukan)
 */

/**
 * Masking NIK untuk keamanan & privasi data peserta.
 * Standar: 6 digit pertama (kode wilayah), bintang tengah, 4 digit terakhir.
 * Contoh: "3275021911970001" -> "327502******0001"
 * 
 * @param {string|number} nik 
 * @returns {string}
 */
export function maskNik(nik) {
  if (!nik) return '-';
  const str = String(nik).trim();
  
  // Jika sudah dalam format masked (mengandung * atau •)
  if (str.includes('*') || str.includes('•')) {
    // Normalisasi panjang jika perlu atau kembalikan as-is
    return str;
  }

  const clean = str.replace(/\D/g, '');
  if (clean.length < 10) {
    return str;
  }

  // Ambil 6 digit pertama dan 4 digit terakhir
  const prefix = clean.slice(0, 6);
  const suffix = clean.slice(-4);
  const maskLength = Math.max(clean.length - 10, 6);
  return `${prefix}${'*'.repeat(maskLength)}${suffix}`;
}

/**
 * Format NIK 16-digit menjadi spasi per 4 digit jika ingin mudah dibaca
 * Contoh: "3275 0219 1197 0001"
 * @param {string|number} nik 
 * @returns {string}
 */
export function formatNikSpaces(nik) {
  if (!nik) return '-';
  const clean = String(nik).trim();
  return clean.replace(/(\d{4})(?=\d)/g, '$1 ');
}
