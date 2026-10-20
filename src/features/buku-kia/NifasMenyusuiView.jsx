import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  Milk, 
  BookOpen, 
  FileText, 
  ChevronRight,
  X
} from 'lucide-react';

export default function NifasMenyusuiView({ onNavigate, onShowToast }) {
  const [selectedDoc, setSelectedDoc] = useState(null);

  const riwayatKF = [
    { no: 1, kunjungan: 'KF 1', waktu: '6 Jam - 3 hari setelah persalinan', fokus: 'Kondisi umum ibu, perdarahan, tanda vital, ASI awal', status: 'Belum' },
    { no: 2, kunjungan: 'KF 2', waktu: '4 - 7 hari setelah persalinan', fokus: 'Pemulihan ibu, luka, involusi uterus, menyusui', status: 'Belum' },
    { no: 3, kunjungan: 'KF 3', waktu: '8 - 28 hari setelah persalinan', fokus: 'Kondisi ibu & bayi, menyusui, KB pasca persalinan', status: 'Belum' },
    { no: 4, kunjungan: 'KF 4', waktu: '29 - 42 hari setelah persalinan', fokus: 'Evaluasi akhir masa nifas & KB', status: 'Belum' },
  ];

  const edukasiASI = [
    { title: 'Manfaat ASI Ekslusif', content: 'ASI eksklusif melindungi bayi dari infeksi, mendukung perkembangan kecerdasan otak, mempererat ikatan batin ibu-bayi, serta mempercepat proses pemulihan rahim pasca melahirkan.' },
    { title: 'Nutrisi untuk ibu menyusui', content: 'Ibu menyusui memerlukan asupan cairan minimal 2,5 - 3 liter/hari, protein berkualitas (ikan, telur, tahu-tempe), sayuran hijau kaya zat besi dan asam folat, serta kalsium.' },
    { title: 'Teknik Menyusui yang Benar', content: 'Pastikan seluruh areola bawah masuk ke mulut bayi, dagu bayi menempel pada payudara ibu, perut bayi menempel perut ibu, dan telinga serta bahu bayi berada pada satu garis lurus.' },
    { title: 'Masalah menyusui yang sering terjadi', content: 'Puting lecet diatasi dengan memperbaiki perlekatan. Payudara bengkak diatasi dengan kompres hangat sebelum menyusui dan kompres dingin setelahnya.' },
    { title: 'Cara Menyimpan ASI Perah', content: 'Suhu ruang (19-26°C): tahan 4 jam. Kulkas bawah (4°C): tahan 4-5 hari. Freezer kulkas 2 pintu (-18°C): tahan 3-6 bulan. Hangatkan di mangkuk air hangat, jangan direbus.' },
    { title: 'Waktu pemberian ASI', content: 'Berikan ASI sesuai kebutuhan bayi (on demand), minimal 8-12 kali dalam 24 jam dengan durasi 15-20 menit per payudara.' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Halaman */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Kesehatan Ibu / Nifas & Menyusui
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Informasi, persiapan dan pemantauan masa nifas serta pemberian ASI
        </p>
      </div>

      {/* 2. 4 Kartu Metrik Nifas & Menyusui */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
            <Heart size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Status Nifas</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Belum</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
            <Calendar size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Perkiraan Mulai Nifas</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Setelah Persalinan</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
            <Milk size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Rencana Menyusui</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">IMD & Asi Ekslusif</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
            <BookOpen size={18} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Status Edukasi</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Sudah Diberikan</span>
          </div>
        </div>
      </div>

      {/* 3. Baris Tengah: Tentang Masa Nifas & Informasi Tentang ASI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Tentang Masa Nifas dan Menyusui */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Tentang Masa Nifas dan Menyusui</h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-3">
              Masa nifas adalah periode pemulihan setelah persalinan, berlangsung selama 6 minggu. Pada masa ini, ibu perlu mendapatkan pemantauan kesehatan dan dukungan dalam pemberian asi untuk pertumbuhan optimal bayi
            </p>
          </div>
        </div>

        {/* Informasi Tentang ASI */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Informasi Tentang ASI</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {edukasiASI.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedDoc(item)}
                className="p-3 rounded-xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText size={15} className="text-slate-400 group-hover:text-[#E11D48] shrink-0" />
                  <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 truncate">
                    {item.title}
                  </span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Tabel: Riwayat Pemeriksaan */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-50">
          <h3 className="text-sm font-bold text-slate-900">Riwayat Pemeriksaan</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FFE4EC]/70 text-slate-800 font-bold border-b border-pink-100">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-28">Kunjungan</th>
                <th className="py-3 px-4 w-52">Waktu</th>
                <th className="py-3 px-4">Fokus Pemantauan</th>
                <th className="py-3 px-4 w-28 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {riwayatKF.map((row) => (
                <tr key={row.no} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 text-center font-medium">{row.no}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{row.kunjungan}</td>
                  <td className="py-3.5 px-4 text-slate-600">{row.waktu}</td>
                  <td className="py-3.5 px-4 text-slate-600 leading-relaxed">{row.fokus}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Baris Bawah: Tanda Bahaya Masa Nifas & Catatan Tindak Lanjut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Tanda Bahaya Masa Nifas */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Tanda Bahaya Masa Nifas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-slate-700">
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Perdarahan banyak atau terus menerus</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Demam &gt; 38</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Nyeri perut hebat</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Keluar cairan berbau tidak sedap</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Payudara bengkak, merah, dan nyeri</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>Merasa sangat sedih, cemas, atau tidak mampu merawat bayi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Catatan dan Tindak Lanjut */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Catatan dan Tindak Lanjut</h3>
          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <span>Siapkan rencana persalinan dan dukungan keluarga</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <span>Lanjutkan kontrol kehamilan sesuai jadwal</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <span>Diskusikan rencana menyusui pada kontrol berikutnya</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <span>Pastikan akses ke layanan konseling laktasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edukasi ASI */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-pink-50 text-[#E11D48]">
                  <FileText size={18} />
                </div>
                <h4 className="text-sm font-bold text-slate-900">{selectedDoc.title}</h4>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedDoc.content}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
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
