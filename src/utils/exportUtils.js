/**
 * Utilitas Universal Export CSV untuk SIKIA
 * - Menggunakan UTF-8 BOM (\uFEFF) agar terbaca sempurna di Microsoft Excel (Windows & Mac)
 * - Mencegah NIK terpotong / menjadi notasi ilmiah (3.2E+15)
 * - Kompatibel penuh dengan modern browser menggunakan Blob & URL.createObjectURL
 */

/**
 * Format string agar aman di CSV
 */
function escapeCsvField(val) {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  // Jika field mengandung koma, kutip ganda, atau baris baru, bungkus dengan tanda kutip ganda
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Download CSV dari headers dan rows
 * @param {Object} options
 * @param {string} options.filename Nama file target (misal: 'laporan.csv')
 * @param {string[]} options.headers Array header kolom
 * @param {Array<Array<any>>} options.rows Array 2 dimensi baris data
 */
export function exportToCsvFile({ filename = 'laporan.csv', headers = [], rows = [] }) {
  if (!filename.toLowerCase().endsWith('.csv')) {
    filename += '.csv';
  }

  const csvRows = [
    headers.map(escapeCsvField).join(','),
    ...rows.map((row) => row.map(escapeCsvField).join(','))
  ];

  const csvString = csvRows.join('\r\n');
  // Tambahkan UTF-8 BOM (\uFEFF)
  const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
  
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
    return;
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  
  // Cleanup memory
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 300);
}
