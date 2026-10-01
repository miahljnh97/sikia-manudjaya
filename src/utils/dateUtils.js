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
