import React, { useState } from 'react';
import { 
  Calendar, 
  UserCheck, 
  FastForward, 
  ShieldCheck, 
  Eye, 
  Download, 
  FileText, 
  ChevronRight,
  X,
  Heart
} from 'lucide-react';

export default function PemeriksaanIbuView({ onShowToast }) {
  const [selectedPemeriksaan, setSelectedPemeriksaan] = useState(null);

  const riwayatList = [
    {
      no: 1,
      tanggal: '15 Jan 2026',
      usiaKehamilan: '8 Minggu',
      jenis: 'ANC 1',
      hasil: 'Normal',
      catatan: 'Keluhan mual, diberikan edukasi gizi dan vitamin B6',
      tekananDarah: '110/70 mmHg',
      beratBadan: '54 kg',
      tinggiFundus: 'Belum teraba',
      djj: '-',
      petugas: 'Bidan Siti, S.Tr.Keb'
    },
    {
      no: 2,
      tanggal: '12 Feb 2026',
      usiaKehamilan: '12 Minggu',
      jenis: 'ANC 2',
      hasil: 'Normal',
      catatan: 'Tidak ada keluhan khusus, kondisi ibu dan janin sehat',
      tekananDarah: '110/70 mmHg',
      beratBadan: '57 kg',
      tinggiFundus: '3 jari di atas simfisis',
      djj: '142 x/menit',
      petugas: 'Bidan Siti, S.Tr.Keb'
    },
    {
      no: 3,
      tanggal: '14 Apr 2026',
      usiaKehamilan: '20 Minggu',
      jenis: 'ANC 3',
      hasil: 'Normal',
      catatan: 'Janin aktif bergerak, USG trimester 2 konfirmasi normal',
      tekananDarah: '115/75 mmHg',
      beratBadan: '59 kg',
      tinggiFundus: '20 cm',
      djj: '144 x/menit',
      petugas: 'Bidan Siti, S.Tr.Keb'
    },
    {
      no: 4,
      tanggal: '10 Jul 2026',
      usiaKehamilan: '24 Minggu',
      jenis: 'ANC 4',
      hasil: 'Normal',
      catatan: 'TD Sedikit tinggi, observasi dan edukasi diet rendah garam',
      tekananDarah: '125/80 mmHg',
      beratBadan: '60 kg',
      tinggiFundus: '24 cm',
      djj: '140 x/menit',
      petugas: 'Bidan Siti, S.Tr.Keb'
    },
    {
      no: 5,
      tanggal: '12 Sep 2026',
      usiaKehamilan: '28 Minggu',
      jenis: 'ANC 5',
      hasil: 'Normal',
      catatan: 'Pertumbuhan janin baik, kepala janin sudah berada di bawah',
      tekananDarah: '110/70 mmHg',
      beratBadan: '62 kg',
      tinggiFundus: '26 cm',
      djj: '138 x/menit',
      petugas: 'Bidan Siti, S.Tr.Keb'
    }
  ];

  const handleDownload = (filename) => {
    if (onShowToast) {
      onShowToast(`Dokumen "${filename}" berhasil diunduh.`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Kesehatan Ibu / Pemeriksaan
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Pantau riwayat pemeriksaan kehamilan dan kondisi ibu secara menyeluruh
        </p>
      </div>

      {/* 2. Top Patient Card (Siti Aminah) */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4.5">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-pink-100 border-2 border-pink-200 shrink-0">
              <img 
                src="/images/siti-aminah-avatar.png" 
                alt="Siti Aminah" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Siti Aminah</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 mt-1 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400">Nama:</span> <span className="font-semibold text-slate-800">Siti Aminah</span>
                </div>
                <div>
                  <span className="text-slate-400">Usia Kehamilan:</span> <span className="font-semibold text-slate-800">28 Minggu 3 hari</span>
                </div>
                <div>
                  <span className="text-slate-400">NIK:</span> <span className="font-semibold text-slate-800">293920102029029</span>
                </div>
                <div>
                  <span className="text-slate-400">HPHT:</span> <span className="font-semibold text-slate-800">12 Februari 2026</span>
                </div>
                <div>
                  <span className="text-slate-400">No Rekam Medis:</span> <span className="font-semibold text-slate-800">293920102029029</span>
                </div>
                <div>
                  <span className="text-slate-400">Taksiran Persalinan:</span> <span className="font-semibold text-slate-800">20 Desember 2026</span>
                </div>
                <div>
                  <span className="text-slate-400">Usia:</span> <span className="font-semibold text-slate-800">27 Tahun</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onShowToast && onShowToast('Melihat detail profil Siti Aminah', 'info')}
            className="px-4 py-2 bg-[#F5F3FF] hover:bg-[#EDE9FE] text-[#6D28D9] rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors self-start lg:self-center cursor-pointer"
          >
            <span>Lihat Profil</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* 3. 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-rose-500 flex items-center justify-center shrink-0">
            <Calendar size={18} />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Jumlah Kunjungan</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">5 Kali</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-rose-500 flex items-center justify-center shrink-0">
            <UserCheck size={18} />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Kunjungan Terakhir</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">12 Sep 2026</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-rose-500 flex items-center justify-center shrink-0">
            <FastForward size={18} />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Kunjungan Berikutnya</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">10 Okt 2026</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-rose-500 flex items-center justify-center shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Status Pemeriksaan</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">Rutin</span>
          </div>
        </div>
      </div>

      {/* 4. Table Riwayat Pemeriksaan */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 sm:p-6 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Riwayat Pemeriksaan</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FFF1F2] text-slate-700 font-bold border-b border-pink-100">
                <th className="py-3 px-5 w-12">No</th>
                <th className="py-3 px-5">Tanggal</th>
                <th className="py-3 px-5">Usia Kehamilan</th>
                <th className="py-3 px-5">Jenis Pemeriksaan</th>
                <th className="py-3 px-5">Hasil</th>
                <th className="py-3 px-5">Catatan</th>
                <th className="py-3 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {riwayatList.map((item) => (
                <tr key={item.no} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-medium">{item.no}</td>
                  <td className="py-3.5 px-5 whitespace-nowrap font-medium text-slate-900">{item.tanggal}</td>
                  <td className="py-3.5 px-5 whitespace-nowrap text-slate-600">{item.usiaKehamilan}</td>
                  <td className="py-3.5 px-5 font-semibold text-slate-900">{item.jenis}</td>
                  <td className="py-3.5 px-5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {item.hasil}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-600 max-w-xs">{item.catatan}</td>
                  <td className="py-3.5 px-5 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedPemeriksaan(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Lihat Detail Pemeriksaan"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Bottom Two Columns: Catatan & Tindak Lanjut + Dokumen Pendukung */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Catatan & Tindak Lanjut */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Catatan & Tindak lanjut</h3>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <span>Lanjutkan konsumsi tablet Fe dan asam folat</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <span>Jaga pola makan bergizi dan istirahat cukup</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <span>Kontrol kembali pada 10 Oktober 2026</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <span>Segera ke fasilitas kesehatan jika ada keluhan</span>
            </li>
          </ul>
        </div>

        {/* Dokumen Pendukung */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Dokumen Pendukung</h3>
          <div className="space-y-3">
            {[
              'USH_12Sep2026.pdf',
              'Hasil laboratorium.pdf',
              'USH_10Jul2026.pdf'
            ].map((docName, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                    <FileText size={16} />
                  </div>
                  <span className="text-xs font-medium text-slate-800">{docName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDownload(docName)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                    title="Unduh Dokumen"
                  >
                    <Download size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onShowToast && onShowToast(`Membuka pratinjau "${docName}"`, 'info')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Pratinjau Dokumen"
                  >
                    <Eye size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Detail Pemeriksaan */}
      {selectedPemeriksaan && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-rose-500 flex items-center justify-center">
                  <Heart size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Detail Pemeriksaan {selectedPemeriksaan.jenis}
                  </h3>
                  <span className="text-xs text-slate-400">{selectedPemeriksaan.tanggal}</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedPemeriksaan(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5 mt-5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-normal text-[11px]">Usia Kehamilan</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{selectedPemeriksaan.usiaKehamilan}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-normal text-[11px]">Tekanan Darah</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{selectedPemeriksaan.tekananDarah}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-normal text-[11px]">Berat Badan</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{selectedPemeriksaan.beratBadan}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-normal text-[11px]">Detak Jantung Janin (DJJ)</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{selectedPemeriksaan.djj}</span>
              </div>
              <div className="col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-normal text-[11px]">Tinggi Fundus Uteri</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{selectedPemeriksaan.tinggiFundus}</span>
              </div>
              <div className="col-span-2 p-3 rounded-xl bg-rose-50/50 border border-rose-100">
                <span className="text-rose-500 block font-semibold text-[11px]">Catatan Bidan</span>
                <span className="font-medium text-slate-800 mt-0.5 block">{selectedPemeriksaan.catatan}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPemeriksaan(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
