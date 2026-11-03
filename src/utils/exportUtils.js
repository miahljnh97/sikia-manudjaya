/**
 * Utilitas Universal Export CSV & PDF untuk SIKIA
 * - Menggunakan UTF-8 BOM (\uFEFF) agar terbaca sempurna di Microsoft Excel (Windows & Mac)
 * - Mencegah NIK terpotong / menjadi notasi ilmiah (3.2E+15)
 * - Kompatibel penuh dengan modern browser menggunakan Blob & URL.createObjectURL
 * - Menyediakan cetak laporan bulanan siap pakai (PDF) dengan kop resmi Posyandu
 */

function escapeCsvField(val) {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToCsvFile({ filename = 'laporan.csv', headers = [], rows = [] }) {
  if (!filename.toLowerCase().endsWith('.csv')) {
    filename += '.csv';
  }

  const csvRows = [
    headers.map(escapeCsvField).join(','),
    ...rows.map((row) => row.map(escapeCsvField).join(','))
  ];

  const csvString = csvRows.join('\r\n');
  const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
  
  if (navigator.msSaveBlob) {
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
  
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 300);
}

/**
 * Membuka jendela cetak / simpan ke PDF dengan template kop surat resmi
 */
export function printLaporanToPdf({
  judul = 'LAPORAN REKAPITULASI POSYANDU BULANAN',
  periode = 'Oktober 2026',
  posyandu = 'Posyandu Desa Manud Jaya',
  kpiStats = [],
  headers = [],
  rows = [],
  catatan = ''
}) {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    alert('Popup diblokir oleh browser. Izinkan popup untuk mengunduh PDF.');
    return;
  }

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${judul} - ${periode}</title>
  <style>
    @page { size: A4; margin: 15mm 15mm 20mm 15mm; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; margin: 0; padding: 20px; font-size: 11pt; line-height: 1.4; }
    .header { text-align: center; border-bottom: 3px double #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
    .header h1 { margin: 0; font-size: 14pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
    .header h2 { margin: 3px 0; font-size: 12pt; font-weight: 600; color: #334155; }
    .header p { margin: 2px 0 0; font-size: 9pt; color: #64748b; }
    .meta-table { width: 100%; margin-bottom: 15px; font-size: 10pt; }
    .meta-table td { padding: 3px 0; }
    .kpi-grid { display: flex; gap: 10px; margin-bottom: 20px; }
    .kpi-card { flex: 1; border: 1px solid #cbd5e1; border-radius: 8px; padding: 8px 12px; background: #f8fafc; }
    .kpi-card .label { font-size: 8pt; color: #64748b; text-transform: uppercase; font-weight: 600; }
    .kpi-card .val { font-size: 14pt; font-weight: bold; color: #0f172a; margin-top: 2px; }
    table.data-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 9.5pt; }
    table.data-table th, table.data-table td { border: 1px solid #cbd5e1; padding: 6px 8px; }
    table.data-table th { background-color: #f1f5f9; font-weight: bold; color: #1e293b; text-align: left; }
    table.data-table tr:nth-child(even) { background-color: #fafafa; }
    .ttd-container { margin-top: 40px; display: flex; justify-content: space-between; page-break-inside: avoid; }
    .ttd-box { width: 220px; text-align: center; font-size: 10pt; }
    .ttd-space { height: 65px; }
    .ttd-name { font-weight: bold; text-decoration: underline; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>PEMERINTAH KABUPATEN ADMINISTRASI</h1>
    <h2>DINAS KESEHATAN &mdash; PUSKESMAS MANUD JAYA</h2>
    <p>Jl. Raya Manud Jaya No. 12, Jawa Barat | Email: dinkes.kabupaten@manudjaya.id</p>
  </div>

  <table class="meta-table">
    <tr>
      <td style="width: 140px; font-weight: bold;">Jenis Laporan</td>
      <td>: ${judul}</td>
      <td style="width: 120px; font-weight: bold;">Tanggal Cetak</td>
      <td>: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
    </tr>
    <tr>
      <td style="font-weight: bold;">Periode Data</td>
      <td>: ${periode}</td>
      <td style="font-weight: bold;">Wilayah Posyandu</td>
      <td>: ${posyandu}</td>
    </tr>
  </table>

  ${kpiStats && kpiStats.length > 0 ? `
  <div class="kpi-grid">
    ${kpiStats.map(s => `
      <div class="kpi-card">
        <div class="label">${s.label}</div>
        <div class="val">${s.value}</div>
      </div>
    `).join('')}
  </div>` : ''}

  <table class="data-table">
    <thead>
      <tr>
        ${headers.map(h => `<th>${h}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${rows.map(r => `
        <tr>
          ${r.map((c, i) => `<td style="${i === 0 ? 'text-align: center;' : ''}">${c ?? '-'}</td>`).join('')}
        </tr>
      `).join('')}
    </tbody>
  </table>

  ${catatan ? `<p style="margin-top: 15px; font-size: 9pt; color: #64748b;"><em>* ${catatan}</em></p>` : ''}

  <div class="ttd-container">
    <div class="ttd-box">
      <p>Mengetahui,<br>Ketua Kader Posyandu</p>
      <div class="ttd-space"></div>
      <p class="ttd-name">Annisa Wati</p>
      <p style="font-size: 8pt; color: #64748b; margin-top: -8px;">NIP. - / Kader Utama</p>
    </div>
    <div class="ttd-box">
      <p>Petugas Penanggung Jawab,<br>Bidan Desa Manud Jaya</p>
      <div class="ttd-space"></div>
      <p class="ttd-name">Khansa Fatin, S.Tr.Keb</p>
      <p style="font-size: 8pt; color: #64748b; margin-top: -8px;">NIP. 19940512 201903 2 004</p>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
