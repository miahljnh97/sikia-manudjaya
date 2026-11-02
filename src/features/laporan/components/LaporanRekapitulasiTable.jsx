import React from 'react';

export default function LaporanRekapitulasiTable({ data = [], searchQuery = '' }) {
  // Filter berdasarkan search input jika diisi
  const filteredData = data.filter((row) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      row.kategori?.toLowerCase().includes(q) ||
      row.keterangan?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">
            <th className="py-3 px-4 w-12 text-center">No</th>
            <th className="py-3 px-4">Kategori</th>
            <th className="py-3 px-4 text-center">Jumlah</th>
            <th className="py-3 px-4 text-center">Laki-laki</th>
            <th className="py-3 px-4 text-center">Perempuan</th>
            <th className="py-3 px-4">Keterangan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-10 text-slate-400">
                Tidak ada data rekapitulasi untuk periode ini.
              </td>
            </tr>
          ) : (
            filteredData.map((row) => (
              <tr
                key={row.no}
                className="hover:bg-slate-50/70 transition-colors"
              >
                <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                  {row.no}
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">
                  {row.kategori}
                </td>
                <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                  {row.jumlah}
                </td>
                <td className="py-3.5 px-4 text-center font-medium text-slate-600">
                  {row.lakiLaki}
                </td>
                <td className="py-3.5 px-4 text-center font-medium text-slate-600">
                  {row.perempuan}
                </td>
                <td className="py-3.5 px-4 text-slate-500 text-xs">
                  {row.keterangan}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
