import React, { useState, useEffect } from 'react';
import { bukuKiaService } from '../../../services/bukuKiaService';
import { hitungUsiaString } from '../../../utils/dateUtils';
import { getPesertaIdFromUser } from '../../../models/pesertaModel';
import { 
  Calendar, 
  Bell, 
  Heart, 
  Star, 
  MapPin, 
  Pill, 
  ChevronRight, 
  Weight, 
  Activity, 
  Droplet, 
  ArrowRight,
  ClipboardPlus,
  Syringe,
  Ruler,
  TrendingUp,
  Baby,
  FileText,
  HeartPulse,
  BarChart2
} from 'lucide-react';

function ScaleBabyIcon({ size = 26, className = "" }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="4" />
      <path d="M8 6a4 4 0 0 1 8 0" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <circle cx="12" cy="15" r="1.2" />
    </svg>
  );
}

export default function IbuDashboardView({ user, onNavigate, onShowToast }) {
  const email = (user?.user?.email || user?.email || '').toLowerCase().trim();
  const nama = (user?.nama || '').toLowerCase().trim();

    // Deteksi persona murni dari role dan email (tanpa hardcode nama)
  const userRole = (user?.role || '').toLowerCase().trim();
  const isIbuBalitaOnly = userRole === 'ibu balita' || email === 'ibu.balita@manudjaya.id' || (email.includes('balita') && !email.includes('hamil'));
  const isIbuHamilOnly = userRole === 'ibu hamil' || email === 'ibu.hamil@manudjaya.id' || (email.includes('hamil') && !email.includes('anak') && !email.includes('balita'));
  const isIbuHamilBalita = userRole === 'ibu hamil & balita' || email === 'ibu.hamil.anak@manudjaya.id' || email.includes('hamil.anak') || (!isIbuBalitaOnly && !isIbuHamilOnly);

  // Tampilkan nama akun asli pengguna secara dinamis dari profil (bukan hardcoded)
  const displayName = user?.nama || user?.user_metadata?.nama || (email ? email.split('@')[0] : 'Ibu');

  const ibuId = getPesertaIdFromUser(user) || (
    isIbuBalitaOnly ? 'd5eeb9a6-3509-44ec-8fce-e95f3edd1a73' :
    isIbuHamilOnly ? '214fbe12-2216-4e61-9b12-9fccca445e84' :
    '55af67c9-6695-4435-b4ea-2720efd73c92'
  );

  const [kehamilan, setKehamilan] = useState(null);
  const [daftarAnak, setDaftarAnak] = useState([]);
  const [anak, setAnak] = useState(null);
  const [jadwalList, setJadwalList] = useState([]);
  const [ancList, setAncList] = useState([]);
  const [nifasList, setNifasList] = useState([]);
  const [riwayatPertumbuhan, setRiwayatPertumbuhan] = useState([]);
  const [daftarImunisasiAnak, setDaftarImunisasiAnak] = useState([]);

  // Pemeriksaan ANC terbaru dari Supabase
  const latestAnc = ancList && ancList.length > 0 ? ancList[ancList.length - 1] : null;

  useEffect(() => {
    if (!ibuId) return;

    // 1. Ambil data kehamilan ibu (aktif jika hamil / fallback untuk persona evaluasi)
    if (isIbuBalitaOnly) {
      setKehamilan(null);
      setAncList([]);
      bukuKiaService.getPemeriksaanNifasList(ibuId).then(list => {
        setNifasList(list || []);
      });
    } else {
      bukuKiaService.getKehamilanIbu(ibuId).then(res => {
        if (res && res.usia_kehamilan_minggu) {
          setKehamilan(res);
        } else {
          setKehamilan(null);
        }
        if (res?.id) {
          bukuKiaService.getPemeriksaanAncList(res.id).then(list => {
            setAncList(list || []);
          });
        } else {
          setAncList([]);
        }
      }).catch(() => {
        setKehamilan(null);
      });
      bukuKiaService.getPemeriksaanNifasList(ibuId).then(list => {
        setNifasList(list || []);
      });
    }

    // 2. Ambil data anak milik ibu ini
    if (isIbuHamilOnly) {
      setDaftarAnak([]);
      setAnak(null);
    } else {
      bukuKiaService.getDaftarAnak(ibuId).then(list => {
        if (list && list.length > 0) {
          const myChildren = list.filter(c => !c.ibu_id || String(c.ibu_id) === String(ibuId));
          const effectiveList = myChildren.length > 0 ? myChildren : list;
          setDaftarAnak(effectiveList);
          setAnak(effectiveList[0] || null);
        } else {
          setDaftarAnak([]);
          setAnak(null);
        }
      }).catch(err => {
        console.warn('Gagal load data anak di dashboard:', err);
        setDaftarAnak([]);
        setAnak(null);
      });
    }

    // 3. Ambil jadwal terdekat
    bukuKiaService.getJadwalPesertaList(ibuId).then(res => {
      if (res && res.length > 0) {
        const formatted = res.slice(0, 2).map((item, idx) => {
          try {
            const d = new Date(item.tanggal);
            const day = String(d.getDate()).padStart(2, '0');
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            const month = months[d.getMonth()] || 'Okt';
            const defaultTitle = idx === 0 ? 'Pemeriksaan Kehamilan' : 'Posyandu Balita';
            return {
              day,
              month,
              title: item.jenis_kegiatan ? item.jenis_kegiatan.replace(' (ANC)', '') : defaultTitle,
              location: item.lokasi || 'Puskesmas Manud Jaya',
              tanggal: item.tanggal
            };
          } catch {
            return {
              day: '20',
              month: 'Okt',
              title: idx === 0 ? 'Pemeriksaan Kehamilan' : 'Posyandu Balita',
              location: item.lokasi || 'Puskesmas Manud Jaya',
              tanggal: item.tanggal
            };
          }
        });
        if (formatted.length > 0) {
          setJadwalList(formatted);
        }
      } else {
        setJadwalList([]);
      }
    });
  }, [ibuId, isIbuHamilOnly, isIbuBalitaOnly]);

  // Ambil riwayat pertumbuhan dan imunisasi anak aktif untuk sinkronisasi data ringkasan dengan detail
  useEffect(() => {
    if (!anak?.id) return;
    bukuKiaService.getPertumbuhanAnakList(anak.id).then(res => {
      if (res && res.length > 0) {
        setRiwayatPertumbuhan(res);
      } else {
        setRiwayatPertumbuhan([]);
      }
    }).catch(() => setRiwayatPertumbuhan([]));

    bukuKiaService.getImunisasiAnakList(anak.id).then(res => {
      if (res && res.length > 0) {
        setDaftarImunisasiAnak(res);
      } else {
        setDaftarImunisasiAnak([]);
      }
    }).catch(() => setDaftarImunisasiAnak([]));
  }, [anak?.id]);

  const latestPertumbuhan = riwayatPertumbuhan && riwayatPertumbuhan.length > 0 
    ? riwayatPertumbuhan[riwayatPertumbuhan.length - 1] 
    : null;

  // Nilai berat dan tinggi badan disinkronkan langsung dengan halaman detail anak (fallback: 9,8 kg & 75 cm)
  const displayBb = latestPertumbuhan?.berat_badan 
    ? `${String(latestPertumbuhan.berat_badan).replace('.', ',')} kg` 
    : '9,8 kg';

  const displayTb = latestPertumbuhan?.tinggi_badan 
    ? `${latestPertumbuhan.tinggi_badan} cm` 
    : '75 cm';

  const statusGizi = latestPertumbuhan?.status_gizi 
    ? (latestPertumbuhan.status_gizi.includes('Normal') || latestPertumbuhan.status_gizi.includes('Baik') ? 'Sesuai Usia' : latestPertumbuhan.status_gizi)
    : 'Sesuai Usia';

  const imunisasiRatio = daftarImunisasiAnak && daftarImunisasiAnak.length > 0
    ? `${daftarImunisasiAnak.filter(i => i.status === 'Selesai' || i.tanggal_diberikan).length} dari ${daftarImunisasiAnak.length}`
    : '3 dari 5';

  const hasKehamilan = !isIbuBalitaOnly || Boolean(kehamilan);
  const hasAnak = !isIbuHamilOnly && Boolean(anak && daftarAnak.length > 0);

  // Helper standar faskes/posyandu untuk bayi baru lahir yang belum dinamai
  const formatNamaAnak = (anakObj, index = 0) => {
    if (anakObj?.nama && anakObj.nama.trim()) {
      const lower = anakObj.nama.toLowerCase().trim();
      if (!lower.startsWith('anak ') && lower !== 'anak') {
        return anakObj.nama;
      }
    }
    const ibuNama = displayName ? displayName.split(',')[0].trim() : 'Ibu';
    return `By. Ny. ${ibuNama} ${index + 1}`;
  };

  const handleNav = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Ringkasan Kesehatan Ibu dan Anak
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Pantau kesehatan Anda dan si kecil dalam satu halaman.
        </p>
      </div>

      {/* 2. Top Row: 2 Big Cards (Kesehatan Ibu & Kesehatan Anak) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Card 1: Kesehatan Ibu */}
        <div className="bg-gradient-to-r from-[#FFF0F4] via-[#FFE4EC] to-[#FFD6E4] border border-pink-200/70 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xs flex flex-col justify-between min-h-[240px]">
          {/* Bagian Atas: Label & Nama Ibu */}
          <div className="relative z-10 space-y-2.5 max-w-[62%] sm:max-w-[65%]">
            <div className="inline-flex items-center gap-2 text-xs font-bold">
              <ClipboardPlus size={18} className="text-[#FF168B]" />
              <span className="text-[#0B0C32]">Kesehatan Ibu</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E11D48] tracking-tight">
                {displayName}
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Usia Kehamilan: <strong className="text-slate-900 font-bold">{kehamilan?.usia_kehamilan_minggu || 28} Minggu</strong> · Trimester {kehamilan?.trimester || 3}
              </p>
            </div>
          </div>

          {/* Bagian Bawah: Tombol Lihat Detail Ibu (Diposisikan di Bawah Sesuai Gambar 2) */}
          <div className="relative z-10 mt-auto pt-10 sm:pt-14 max-w-[62%] sm:max-w-[65%]">
            <button
              type="button"
              onClick={() => handleNav('/kesehatan-ibu/kehamilan')}
              className="px-6 py-2.5 bg-[#FF4D80] hover:bg-[#F43F5E] text-white rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-pink-300/40 transition-all cursor-pointer active:scale-95"
            >
              <span>Lihat Detail Ibu</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Ilustrasi Ibu di sebelah kanan */}
          <div className="absolute right-2 bottom-0 top-2 flex items-end pointer-events-none">
            <img 
              src="/images/ibu-hamil-card.png" 
              alt="Ilustrasi Ibu" 
              className="h-48 sm:h-56 object-contain drop-shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Card 2: Kesehatan Anak (Balita Terdaftar vs Belum Terdaftar) */}
        {hasAnak && anak ? (
          /* Tampilan Anak Terdaftar */
          <div className="bg-gradient-to-r from-[#FFF5F7] via-[#FFEBF1] to-[#FFE0EA] border border-pink-200/70 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xs flex flex-col justify-between items-center text-center min-h-[220px]">
            <div className="w-full flex items-center justify-between gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 text-xs font-bold">
                <Star size={18} className="text-[#FF168B]" />
                <span className="text-[#0B0C32]">Kesehatan Anak</span>
              </div>

              {/* Multiple Children Tab Selector HANYA jika ibu ini memiliki > 1 anak */}
              {daftarAnak.length > 1 && (
                <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xs p-1 rounded-xl border border-pink-200/60 shadow-2xs">
                  {daftarAnak.map((a, idx) => {
                    const isSelected = a.id === anak?.id;
                    const isBoy = a.jenis_kelamin === 'L';
                    return (
                      <button
                        key={a.id}
                        type="button"
                        data-anak-id={a.id}
                        onClick={() => setAnak(a)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#E11D48] text-white shadow-xs'
                            : 'text-slate-600 hover:text-[#E11D48] hover:bg-white/60'
                        }`}
                      >
                        <span>{isBoy ? '👦' : '👧'}</span>
                        <span>{formatNamaAnak(a, idx).split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="my-2 flex flex-col items-center max-w-sm">
              <img 
                src="/images/anak-pertumbuhan.png" 
                alt={anak?.nama || 'Buah Hati'} 
                className="h-32 sm:h-36 w-auto object-contain drop-shadow-xs"
                onError={(e) => { e.target.src = '/images/baby-wreath.png'; }}
              />
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#E11D48] tracking-tight mt-2">
                {anak?.nama || 'Buah Hati'}
              </h3>
              <p className="text-base sm:text-lg font-bold text-slate-800 mt-0.5">
                {anak?.usia || hitungUsiaString(anak?.tgl_lahir) || (isIbuBalitaOnly ? '1 Tahun 6 Bulan' : '1 Tahun 2 Bulan')}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleNav(`/kesehatan-anak/profil?anak_id=${anak?.id || '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12'}`)}
                className="px-6 py-2.5 bg-[#FF4D80] hover:bg-[#F43F5E] text-white rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-pink-300/40 transition-all cursor-pointer active:scale-95"
              >
                <span>Lihat Detail Anak</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          /* Tampilan Ibu Hamil Saja: Si kecil belum terdaftar */
          <div className="bg-[#FAF5FF]/50 border-2 border-dashed border-pink-200/90 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xs flex flex-col justify-between items-center text-center min-h-[220px]">
            <div className="w-full flex items-center justify-start">
              <div className="inline-flex items-center gap-2 text-xs font-bold">
                <Star size={18} className="text-[#FF168B]" />
                <span className="text-[#0B0C32]">Kesehatan Anak</span>
              </div>
            </div>

            <div className="my-1 flex flex-col items-center max-w-sm">
              <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                <img 
                  src="/images/baby-wreath.png" 
                  alt="Si kecil belum terdaftar" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-1.5">
                Si kecil belum terdaftar di SIKIA
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-snug">
                Tambahkan data anak untuk melihat ringkasan kesehatan, pertumbuhan, dan jadwal imunisasi.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onShowToast && onShowToast('Silakan hubungi Bidan Desa atau Kader Posyandu untuk pendaftaran anak baru.', 'info')}
                className="px-6 py-2.5 bg-[#FF4D80] hover:bg-[#F43F5E] text-white rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-pink-300/40 transition-all cursor-pointer active:scale-95"
              >
                <span>Hubungi Petugas Untuk Perbaruan Data</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Middle Row: Jadwal Terdekat & Pengingat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Card Jadwal Terdekat (PBI 01A) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <Calendar size={18} className="text-[#E11D48]" />
            <h3 className="text-sm font-bold text-slate-900">Jadwal Terdekat</h3>
          </div>

          <div className="space-y-3">
            {jadwalList.map((item, idx) => {
              return (
                <div 
                  key={idx}
                  onClick={() => handleNav('/jadwal-saya')}
                  className="p-3.5 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100 flex flex-col items-center justify-center text-[#E11D48] shrink-0 font-bold leading-tight">
                      <span className="text-base font-extrabold">{item.day}</span>
                      <span className="text-[10px] uppercase font-semibold">{item.month}</span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#E11D48] transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <MapPin size={12} className="text-slate-400" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Card Pengingat */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <Bell size={18} className="text-[#E11D48]" />
            <h3 className="text-sm font-bold text-slate-900">Pengingat</h3>
          </div>

          <div className="space-y-3">
            {/* Item 1: Konsumsi TTD */}
            <div 
              onClick={() => handleNav('/kesehatan-ibu/kehamilan')}
              className="p-3.5 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0 border border-pink-100">
                  <Pill size={18} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#E11D48] transition-colors">
                    Konsumsi Tablet Tambah Darah
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Setiap hari
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>

            {/* Item 2: Imunisasi Campak Rubella */}
            <div 
              onClick={() => handleNav(hasAnak && anak ? `/kesehatan-anak/imunisasi?anak_id=${anak?.id}` : '/jadwal-saya')}
              className="p-3.5 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                  <Syringe size={18} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#E11D48] transition-colors">
                    Imunisasi Campak Rubella
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    20 Oktober 2026
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: 2 Kolom Berdampingan (Kesehatan Ibu & Kesehatan Anak - Sesuai Figma QA Gambar 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Kolom 1: Ringkasan Kesehatan Ibu */}
        <div className="bg-[#FFF5F7]/70 border border-pink-100/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">Ringkasan Kesehatan Ibu</h3>
            <button
              type="button"
              onClick={() => handleNav('/kesehatan-ibu/kehamilan')}
              className="text-xs font-semibold text-[#E11D48] hover:text-[#BE185D] cursor-pointer"
            >
              Lihat Detail
            </button>
          </div>

          {/* Metrik Kehamilan Sesuai Desain Figma (Gambar 1 Expected) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* 1. Pemeriksaan Kehamilan */}
            <div 
              onClick={() => handleNav('/kesehatan-ibu/pemeriksaan')}
              className="bg-white border border-pink-100/60 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[140px] hover:border-pink-200 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="text-[#E11D48] pt-1">
                <Heart size={26} strokeWidth={2} />
              </div>
              <div className="my-auto">
                <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                  {ancList && ancList.length > 0 ? `${ancList.length} dari 8 kali` : '5 dari 8 kali'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium block mt-1 leading-snug">
                  Pemeriksaan<br />Kehamilan
                </span>
              </div>
              <div className="w-full flex justify-end pt-1">
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </div>

            {/* 2. Kenaikan Berat Badan */}
            <div 
              onClick={() => handleNav('/kesehatan-ibu/kehamilan')}
              className="bg-white border border-pink-100/60 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[140px] hover:border-pink-200 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="text-[#E11D48] pt-1">
                <Weight size={26} strokeWidth={2} />
              </div>
              <div className="my-auto">
                <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                  +7 kg
                </span>
                <span className="text-[10px] text-slate-400 font-medium block mt-1 leading-snug">
                  Kenaikan Berat<br />Badan
                </span>
              </div>
              <div className="w-full flex justify-end pt-1">
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </div>

            {/* 3. Tekanan Darah */}
            <div 
              onClick={() => handleNav('/kesehatan-ibu/pemeriksaan')}
              className="bg-white border border-pink-100/60 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[140px] hover:border-pink-200 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="text-[#E11D48] pt-1">
                <HeartPulse size={26} strokeWidth={2} />
              </div>
              <div className="my-auto">
                <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                  {latestAnc?.tekanan_darah ? `${latestAnc.tekanan_darah} mmHg` : '110/70 mmHg'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium block mt-1 leading-snug">
                  Tekanan Darah
                </span>
              </div>
              <div className="w-full flex items-center justify-center gap-1 pt-1">
                <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Normal
                </span>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
              </div>
            </div>

            {/* 4. Hasil HB Terakhir */}
            <div 
              onClick={() => handleNav('/kesehatan-ibu/pemeriksaan')}
              className="bg-white border border-pink-100/60 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[140px] hover:border-pink-200 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="text-[#E11D48] pt-1">
                <Droplet size={26} strokeWidth={2} />
              </div>
              <div className="my-auto">
                <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                  {latestAnc?.hemoglobin ? `${latestAnc.hemoglobin} g/dL` : 'Normal'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium block mt-1 leading-snug">
                  Hasil HB Terakhir
                </span>
              </div>
              <div className="w-full flex justify-end pt-1">
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Kolom 2: Ringkasan Kesehatan Anak */}
        <div className="bg-[#FFF5F7]/70 border border-pink-100/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Ringkasan Kesehatan Anak
            </h3>
            <button
              type="button"
              onClick={() => handleNav(`/kesehatan-anak/pertumbuhan?anak_id=${anak?.id || '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12'}`)}
              className="text-xs font-semibold text-[#E11D48] hover:text-[#BE185D] cursor-pointer"
            >
              Lihat Detail
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* 1. Berat Badan */}
            <div 
              onClick={() => handleNav(`/kesehatan-anak/pertumbuhan?anak_id=${anak?.id || '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12'}`)}
              className="bg-white border border-pink-100/60 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[140px] hover:border-pink-200 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="text-[#E11D48] pt-1">
                <ScaleBabyIcon size={26} strokeWidth={2} />
              </div>
              <div className="my-auto">
                <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                  {displayBb}
                </span>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">
                  Berat Badan
                </span>
              </div>
              <div className="w-full flex items-center justify-center gap-1 pt-1">
                <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  {statusGizi}
                </span>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
              </div>
            </div>

            {/* 2. Tinggi Badan */}
            <div 
              onClick={() => handleNav(`/kesehatan-anak/pertumbuhan?anak_id=${anak?.id || '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12'}`)}
              className="bg-white border border-pink-100/60 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[140px] hover:border-pink-200 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="text-[#E11D48] pt-1">
                <Ruler size={26} strokeWidth={2} />
              </div>
              <div className="my-auto">
                <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                  {displayTb}
                </span>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">
                  Tinggi Badan
                </span>
              </div>
              <div className="w-full flex items-center justify-center gap-1 pt-1">
                <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Sesuai Usia
                </span>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
              </div>
            </div>

            {/* 3. Imunisasi */}
            <div 
              onClick={() => handleNav(`/kesehatan-anak/imunisasi?anak_id=${anak?.id || '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12'}`)}
              className="bg-white border border-pink-100/60 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[140px] hover:border-pink-200 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="text-[#E11D48] pt-1">
                <Syringe size={26} strokeWidth={2} />
              </div>
              <div className="my-auto">
                <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                  {imunisasiRatio}
                </span>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">
                  Imunisasi
                </span>
              </div>
              <div className="w-full flex items-center justify-center gap-1 pt-1">
                <span className="inline-block text-[9px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                  Dalam Proses
                </span>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
              </div>
            </div>

            {/* 4. Perkembangan */}
            <div 
              onClick={() => handleNav(`/kesehatan-anak/perkembangan?anak_id=${anak?.id || '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12'}`)}
              className="bg-white border border-pink-100/60 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[140px] hover:border-pink-200 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="text-[#E11D48] pt-1">
                <BarChart2 size={26} strokeWidth={2} />
              </div>
              <div className="my-auto">
                <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                  Sesuai Usia
                </span>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">
                  Perkembangan
                </span>
              </div>
              <div className="w-full flex items-center justify-center gap-1 pt-1">
                <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Normal
                </span>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
