import { getPesertaIdFromUser } from '../../models/pesertaModel';
import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Calendar, 
  Milk, 
  BookOpen, 
  FileText, 
  ChevronRight,
  X,
  Users
} from 'lucide-react';
import { bukuKiaService } from '../../services/bukuKiaService';
import { pesertaService } from '../../services/pesertaService';
import { maskNik } from '../../utils/nikUtils';

export default function NifasMenyusuiView({ user, currentPath = '', onNavigate, onShowToast }) {
  const isIbuRole = (user?.role || '').toLowerCase().includes('ibu') || (user?.email || '').toLowerCase().includes('ibu');
  const userRole = (user?.role || '').toLowerCase().trim();
  const userEmail = (user?.user?.email || user?.email || '').toLowerCase().trim();
  const isIbuBalitaOnly = userRole === 'ibu balita' || userEmail === 'ibu.balita@manudjaya.id' || (userEmail.includes('balita') && !userEmail.includes('hamil'));

  const extractPesertaId = () => {
    if (typeof window !== 'undefined' && window.location.search) {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get('peserta_id')) return sp.get('peserta_id');
      if (sp.get('id')) return sp.get('id');
    }
    if (currentPath && currentPath.includes('?')) {
      const sp = new URLSearchParams(currentPath.split('?')[1]);
      if (sp.get('peserta_id')) return sp.get('peserta_id');
      if (sp.get('id')) return sp.get('id');
    }
    return isIbuRole ? (getPesertaIdFromUser(user) || '55af67c9-6695-4435-b4ea-2720efd73c92') : null;
  };

  const [daftarIbu, setDaftarIbu] = useState([]);
  const [activePesertaId, setActivePesertaId] = useState(() => extractPesertaId() || '55af67c9-6695-4435-b4ea-2720efd73c92');
  const [peserta, setPeserta] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [riwayatKF, setRiwayatKF] = useState([]);

  useEffect(() => {
    const urlId = extractPesertaId();
    if (urlId && urlId !== activePesertaId) {
      setActivePesertaId(urlId);
    }
  }, [currentPath]);

  useEffect(() => {
    bukuKiaService.getDaftarIbuHamil().then(list => {
      if (list && list.length > 0) {
        setDaftarIbu(list);
        if (!activePesertaId) setActivePesertaId(list[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!activePesertaId) return;
    pesertaService.getPesertaById(activePesertaId).then(p => {
      if (p) setPeserta(p);
    });
    bukuKiaService.getPemeriksaanNifasList(activePesertaId).then(rows => {
      if (rows && rows.length > 0) {
        setRiwayatKF(rows.map((r, i) => ({
          no: i + 1,
          kunjungan: r.kunjungan || `KF ${i + 1}`,
          waktu: r.tanggal || 'Sesuai Jadwal',
          fokus: r.catatan || 'Pemantauan masa nifas & laktasi',
          status: 'Selesai'
        })));
      }
    });
  }, [activePesertaId]);

  const handleSwitchPasien = (newId) => {
    setActivePesertaId(newId);
    if (onNavigate) {
      onNavigate(`/kesehatan-ibu/nifas-menyusui?peserta_id=${newId}`);
    }
  };

  const edukasiASI = [
    { title: 'Manfaat ASI Ekslusif', content: 'ASI eksklusif melindungi bayi dari infeksi, mendukung perkembangan kecerdasan otak, mempererat ikatan batin ibu-bayi, serta mempercepat proses pemulihan rahim pasca melahirkan.' },
    { title: 'Nutrisi untuk ibu menyusui', content: 'Ibu menyusui memerlukan asupan cairan minimal 2,5 - 3 liter/hari, protein berkualitas (ikan, telur, tahu-tempe), sayuran hijau kaya zat besi dan asam folat, serta kalsium.' },
    { title: 'Teknik Menyusui yang Benar', content: 'Pastikan seluruh areola bawah masuk ke mulut bayi, dagu bayi menempel pada payudara ibu, perut bayi menempel perut ibu, dan telinga serta bahu bayi berada pada satu garis lurus.' },
    { title: 'Masalah menyusui yang sering terjadi', content: 'Puting lecet diatasi dengan memperbaiki perlekatan. Payudara bengkak diatasi dengan kompres hangat sebelum menyusui dan kompres dingin setelahnya.' },
    { title: 'Cara Menyimpan ASI Perah', content: 'Suhu ruang (19-26°C): tahan 4 jam. Kulkas bawah (4°C): tahan 4-5 hari. Freezer kulkas 2 pintu (-18°C): tahan 3-6 bulan. Hangatkan di mangkuk air hangat, jangan direbus.' },
    { title: 'Waktu pemberian ASI', content: 'Berikan ASI sesuai kebutuhan bayi (on demand), minimal 8-12 kali dalam 24 jam dengan durasi 15-20 menit per payudara.' },
  ];

  const namaPasien = peserta?.nama || 'Siti Aminah';

  return (
    <div className="space-y-6">
      {/* 1. Header Halaman & Patient Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kesehatan Ibu / Nifas & Menyusui
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Informasi, persiapan dan pemantauan masa nifas serta pemberian ASI
          </p>
        </div>

        {/* Dropdown Selector Ibu Hamil/Nifas untuk Bidan/Kader */}
        {!isIbuRole && daftarIbu.length > 0 && (
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3 py-2 shadow-xs">
            <Users size={16} className="text-pink-600 shrink-0" />
            <div className="text-[11px]">
              <span className="text-slate-400 block font-medium">Pilih Pasien:</span>
              <select
                value={activePesertaId}
                onChange={(e) => handleSwitchPasien(e.target.value)}
                className="font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer text-xs pr-2"
              >
                {daftarIbu.map((ibu) => (
                  <option key={ibu.id} value={ibu.id}>
                    {ibu.nama} (NIK: {maskNik(ibu.nik)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Banner info khusus Ibu Balita */}
      {isIbuBalitaOnly && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 font-bold">
            ✓
          </div>
          <div>
            <p className="font-bold">Masa Nifas Selesai</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Masa nifas 42 hari pasca melahirkan telah selesai. Pemantauan dilanjutkan pada pemberian makanan bergizi seimbang dan tumbuh kembang balita Anda.
            </p>
          </div>
        </div>
      )}

      {/* 2. 4 Kartu Metrik Nifas & Menyusui */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="text-[#E11D48] shrink-0">
            <Heart size={22} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Status Nifas</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight block mt-0.5">
              {isIbuBalitaOnly ? 'Selesai' : 'Belum'}
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="text-[#E11D48] shrink-0">
            <Calendar size={22} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">
              {isIbuBalitaOnly ? 'Masa Nifas' : 'Perkiraan Mulai Nifas'}
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight block mt-0.5">
              {isIbuBalitaOnly ? 'Telah Selesai (42 Hari)' : 'Setelah Persalinan'}
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="text-[#E11D48] shrink-0">
            <Milk size={22} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">
              {isIbuBalitaOnly ? 'Fase Nutrisi' : 'Rencana Menyusui'}
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight block mt-0.5">
              {isIbuBalitaOnly ? 'ASI & MP-ASI Lanjutan' : 'IMD & ASI Eksklusif'}
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="text-[#E11D48] shrink-0">
            <BookOpen size={22} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Status Edukasi</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight block mt-0.5">Sudah Diberikan</span>
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
              Masa nifas adalah periode pemulihan setelah persalinan, berlangsung selama 6 minggu. Pada masa ini, ibu perlu mendapatkan pemantauan kesehatan dan dukungan dalam pemberian ASI untuk pertumbuhan optimal bayi.
            </p>
          </div>
        </div>

        {/* Informasi Tentang ASI */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Informasi Tentang ASI</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5">
            {edukasiASI.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedDoc(item)}
                className="flex items-center justify-between py-1 cursor-pointer group hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <FileText size={18} className="text-slate-800 shrink-0" />
                  <span className="text-xs font-medium text-slate-800 leading-snug">
                    {item.title}
                  </span>
                </div>
                <ChevronRight size={15} className="text-slate-700 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Tabel: Riwayat Pemeriksaan Nifas KF 1 - KF 4 */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Riwayat Pemeriksaan</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FFE4EC]/70 text-slate-800 font-bold border-b border-pink-100">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-28">Kunjungan</th>
                <th className="py-3 px-4 w-52">Waktu Pemantauan</th>
                <th className="py-3 px-4">Fokus Pemantauan</th>
                <th className="py-3 px-4 w-28 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {riwayatKF.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Belum ada catatan riwayat pemeriksaan nifas untuk ibu ini.
                  </td>
                </tr>
              ) : riwayatKF.map((row) => (
                <tr key={row.no} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 text-center font-medium">{row.no}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{row.kunjungan}</td>
                  <td className="py-3.5 px-4 text-slate-600">{row.waktu}</td>
                  <td className="py-3.5 px-4 text-slate-600 leading-relaxed">{row.fokus}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-semibold ${
                      row.status === 'Selesai' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Tanda Bahaya Masa Nifas & Catatan dan Tindak Lanjut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Kolom Kiri: Tanda Bahaya Masa Nifas */}
        <div className="space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Tanda Bahaya Masa Nifas
          </h3>
          <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-xs h-full">
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
        </div>

        {/* Kolom Kanan: Catatan dan Tindak Lanjut */}
        <div className="space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Catatan dan Tindak Lanjut
          </h3>
          <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-xs h-full">
            <ul className="space-y-3 text-xs font-semibold text-[#3B41B2]">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B41B2] mt-1.5 shrink-0" />
                <span className="leading-relaxed">Siapkan rencana persalinan dan dukungan keluarga</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B41B2] mt-1.5 shrink-0" />
                <span className="leading-relaxed">Lanjutkan kontrol kehamilan sesuai jadwal</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B41B2] mt-1.5 shrink-0" />
                <span className="leading-relaxed">Diskusikan rencana menyusui pada kontrol berikutnya</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B41B2] mt-1.5 shrink-0" />
                <span className="leading-relaxed">Pastikan akses ke layanan konseling laktasi</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal Edukasi ASI */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">{selectedDoc.title}</h3>
              <button 
                type="button" 
                onClick={() => setSelectedDoc(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p className="font-medium text-slate-700 leading-relaxed">{selectedDoc.content}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
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
