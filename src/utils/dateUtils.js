/**
 * Helper untuk format tanggal & waktu Bahasa Indonesia
 */

const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function getTanggalHariIniLengkap(date = new Date()) {
  const hari = NAMA_HARI[date.getDay()];
  const tanggal = date.getDate();
  const bulan = NAMA_BULAN[date.getMonth()];
  const tahun = date.getFullYear();
  return `${hari}, ${tanggal} ${bulan} ${tahun}`;
}

export function getTanggalFormatStandar(date = new Date()) {
  const tanggal = date.getDate();
  const bulan = NAMA_BULAN[date.getMonth()];
  const tahun = date.getFullYear();
  return `${tanggal} ${bulan} ${tahun}`;
}

export function getTanggalFormatSingkat(date = new Date()) {
  const bulanSingkat = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${date.getDate()} ${bulanSingkat[date.getMonth()]} ${date.getFullYear()}`;
}

export function getJadwalBulanDepan() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 28);
  return getTanggalFormatStandar(nextMonth);
}

export function getJamMenitSekarang(date = new Date()) {
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
}

/**
 * Mengambil tanggal hari ini dalam format ISO 'YYYY-MM-DD' sesuai zona waktu lokal pengguna
 */
export function getTodayISODate(d = new Date()) {
  const target = d instanceof Date && !isNaN(d.getTime()) ? d : new Date();
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const day = String(target.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Konversi teks tanggal (seperti "6 Oktober 2026", "26 Sep 2026", atau Date) ke format ISO 'YYYY-MM-DD' untuk PostgreSQL
 */
export function toISODateString(input) {
  if (!input) return getTodayISODate();
  if (input instanceof Date && !isNaN(input.getTime())) {
    return getTodayISODate(input);
  }
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    const parts = trimmed.split(/\s+/);
    if (parts.length === 3) {
      const day = String(parts[0]).padStart(2, '0');
      const monthStr = parts[1].toLowerCase();
      const year = parts[2];
      
      const bulanMap = {
        januari: '01', jan: '01',
        februari: '02', feb: '02',
        maret: '03', mar: '03',
        april: '04', apr: '04',
        mei: '05', may: '05',
        juni: '06', jun: '06',
        juli: '07', jul: '07',
        agustus: '08', agu: '08', ags: '08', aug: '08',
        september: '09', sep: '09',
        oktober: '10', okt: '10', oct: '10',
        november: '11', nov: '11',
        desember: '12', des: '12', dec: '12'
      };
      
      const month = bulanMap[monthStr];
      if (month && year.length === 4) {
        return `${year}-${month}-${day}`;
      }
    }
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      return getTodayISODate(d);
    }
  }
  return getTodayISODate();
}

/**
 * Menghitung usia anak dalam teks ramah pengguna (contoh: "1 Tahun 3 Bulan")
 */
export function hitungUsiaString(tglLahir) {
  if (!tglLahir) return '1 Tahun 3 Bulan';
  const birth = new Date(tglLahir);
  if (isNaN(birth.getTime())) return '1 Tahun 3 Bulan';
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  if (now.getDate() < birth.getDate()) {
    months--;
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  if (years > 0 && months > 0) return `${years} Tahun ${months} Bulan`;
  if (years > 0) return `${years} Tahun`;
  if (months > 0) return `${months} Bulan`;
  return 'Baru Lahir';
}

/**
 * Memformat tanggal string (ISO yyyy-mm-dd atau Date) menjadi format Indonesia yang ramah (dd MMMM yyyy)
 * Contoh: '2026-12-20' -> '20 Desember 2026'
 */
export function formatTanggalIndo(input) {
  if (!input) return '-';
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return '-';
    // Jika sudah ada nama bulan teks dan spasi (misal: "20 Desember 2026"), langsung return
    if (/[a-zA-Z]/.test(trimmed) && trimmed.includes(' ')) {
      return trimmed;
    }
    const cleanStr = trimmed.split('T')[0];
    const parts = cleanStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (month >= 0 && month < 12 && !isNaN(day)) {
        return `${day} ${NAMA_BULAN[month]} ${year}`;
      }
    }
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      return `${d.getDate()} ${NAMA_BULAN[d.getMonth()]} ${d.getFullYear()}`;
    }
    return trimmed;
  }
  if (input instanceof Date && !isNaN(input.getTime())) {
    return `${input.getDate()} ${NAMA_BULAN[input.getMonth()]} ${input.getFullYear()}`;
  }
  return String(input);
}
