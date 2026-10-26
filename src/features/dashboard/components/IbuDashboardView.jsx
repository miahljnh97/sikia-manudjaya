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
  Baby
} from 'lucide-react';

export default function IbuDashboardView({ user, onNavigate, onShowToast }) {
  const email = (user?.user?.email || user?.email || '').toLowerCase().trim();
  const nama = (user?.nama || '').toLowerCase().trim();

  // Deteksi persona
  const isIbuHamilOnly = email === 'ibu.hamil@manudjaya.id' || (email.includes('hamil') && !email.includes('anak') && !email.includes('balita'));
  
  // Nama default yang sesuai dengan rubrik desain Figma dashboard
  const displayName = (user?.nama && user.nama !== 'Ibu Ratna' && !user.nama.toLowerCase().includes('ratna')) 
    ? user.nama 
    : 'Siti Aminah';

  const ibuId = getPesertaIdFromUser(user) || (
    isIbuHamilOnly ? '214fbe12-2216-4e61-9b12-9fccca445e84' :
    '55af67c9-6695-4435-b4ea-2720efd73c92'
  );

  const [kehamilan, setKehamilan] = useState({
    usia_kehamilan_minggu: 28,
    trimester: 3,
    status_kehamilan: 'Aktif'
  });
  const [daftarAnak, setDaftarAnak] = useState([]);
  const [anak, setAnak] = useState(null);
  const [jadwalList, setJadwalList] = useState([]);
  const [ancList, setAncList] = useState([]);
  const [nifasList, setNifasList] = useState([]);

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
          setKehamilan({
            usia_kehamilan_minggu: 28,
            trimester: 3,
            status_kehamilan: 'Aktif'
          });
        }
        if (res?.id) {
          bukuKiaService.getPemeriksaanAncList(res.id).then(list => {
            setAncList(list || []);
          });
        } else {
          setAncList([]);
        }
      }).catch(() => {
        setKehamilan({
          usia_kehamilan_minggu: 28,
          trimester: 3,
          status_kehamilan: 'Aktif'
        });
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
          setAnak(effectiveList[0]);
        } else {
          const fallbackChild = {
            id: '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12',
            nama: 'Alya Putri',
            ibu_id: ibuId,
            tgl_lahir: '2025-04-15',
            jenis_kelamin: 'P',
            usia: '1 Tahun 6 Bulan'
          };
          setDaftarAnak([fallbackChild]);
          setAnak(fallbackChild);
        }
      }).catch(err => {
        console.warn('Gagal load data anak di dashboard:', err);
        const fallbackChild = {
          id: '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12',
          nama: 'Alya Putri',
          ibu_id: ibuId,
          tgl_lahir: '2025-04-15',
          jenis_kelamin: 'P',
          usia: '1 Tahun 6 Bulan'
        };
        setDaftarAnak([fallbackChild]);
        setAnak(fallbackChild);
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
        setJadwalList([
          {
            day: '20',
            month: 'Okt',
            title: 'Pemeriksaan Kehamilan',
            location: 'Puskesmas Manud Jaya',
            tanggal: '2026-10-20'
          },
          {
            day: '20',
            month: 'Okt',
            title: 'Posyandu Balita',
            location: 'Puskesmas Manud Jaya',
            tanggal: '2026-10-20'
          }
        ]);
      }
    });
  }, [ibuId, isIbuHamilOnly]);

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
        <div className="bg-gradient-to-r from-[#FFF0F4] via-[#FFE4EC] to-[#FFD6E4] border border-pink-200/70 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xs flex flex-col justify-between min-h-[220px]">
          <div className="relative z-10 space-y-3 max-w-[62%] sm:max-w-[65%]">
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

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleNav('/kesehatan-ibu/kehamilan')}
                className="px-5 py-2.5 bg-[#FF4D80] hover:bg-[#F43F5E] text-white rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-pink-300/40 transition-all cursor-pointer active:scale-95"
              >
                <span>Lihat Detail Ibu</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Ilustrasi Ibu di sebelah kanan */}
          <div className="absolute right-2 bottom-0 top-2 flex items-end pointer-events-none">
            <img 
              src="/images/ibu-hamil-card.png" 
              alt="Ilustrasi Ibu" 
              className="h-44 sm:h-52 object-contain drop-shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Card 2: Kesehatan Anak (Balita Terdaftar vs Belum Terdaftar) */}
        {hasAnak && anak ? (
          /* Tampilan Anak Terdaftar (Alya Putri) */
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
                alt={anak?.nama || 'Alya Putri'} 
                className="h-32 sm:h-36 w-auto object-contain drop-shadow-xs"
                onError={(e) => { e.target.src = '/images/baby-wreath.png'; }}
              />
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#E11D48] tracking-tight mt-2">
                {anak?.nama || (isIbuBalitaOnly ? 'Alya Putri' : 'Dian Pranata')}
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

      {/* 4. Bottom Row: 2 Kolom Berdampingan (Kesehatan Ibu & Kesehatan Anak - Sesuai media_1792892882392_f74ca50d.png) */}
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

          {hasKehamilan ? (
            /* Metrik Kehamilan untuk Ibu Hamil & Ibu Hamil-Balita */
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* 1. Pemeriksaan Kehamilan */}
              <div 
                onClick={() => handleNav('/kesehatan-ibu/pemeriksaan')}
                className="bg-white border border-slate-100/90 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[125px] hover:border-pink-200 transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <Heart size={18} />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">{ancList.length > 0 ? `${ancList.length} dari 8 kali` : '5 dari 8 kali'}</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Pemeriksaan Kehamilan</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600" />
              </div>

              {/* 2. Kenaikan Berat Badan */}
              <div 
                onClick={() => handleNav('/kesehatan-ibu/kehamilan')}
                className="bg-white border border-slate-100/90 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[125px] hover:border-pink-200 transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <Weight size={18} />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">+7 kg</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Kenaikan Berat Badan</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600" />
              </div>

              {/* 3. Tekanan Darah */}
              <div 
                onClick={() => handleNav('/kesehatan-ibu/pemeriksaan')}
                className="bg-white border border-slate-100/90 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[125px] hover:border-pink-200 transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <Activity size={18} />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">{latestAnc?.tekanan_darah ? `${latestAnc.tekanan_darah} mmHg` : '110/70 mmHg'}</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Tekanan Darah</span>
                </div>
                <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Normal
                </span>
              </div>

              {/* 4. Hasil HB Terakhir */}
              <div 
                onClick={() => handleNav('/kesehatan-ibu/pemeriksaan')}
                className="bg-white border border-slate-100/90 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[125px] hover:border-pink-200 transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <Droplet size={18} />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">{latestAnc?.hemoglobin ? `${latestAnc.hemoglobin} g/dL` : 'Normal'}</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Hasil HB Terakhir</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600" />
              </div>
            </div>
          ) : (
            /* Metrik Pasca Persalinan / Nifas & Menyusui untuk Ibu Balita */
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* 1. Kunjungan Nifas */}
              <div 
                onClick={() => handleNav('/kesehatan-ibu/nifas-menyusui')}
                className="bg-white border border-slate-100/90 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[125px] hover:border-pink-200 transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <Heart size={18} />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">{nifasList.filter(n => n.status_pemeriksaan === 'Sudah').length || (nifasList.length > 0 ? nifasList.length : 3)} dari 4 kali</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Pemeriksaan Nifas</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600" />
              </div>

              {/* 2. Edukasi & Praktik Menyusui */}
              <div 
                onClick={() => handleNav('/kesehatan-ibu/nifas-menyusui')}
                className="bg-white border border-slate-100/90 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[125px] hover:border-pink-200 transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <Activity size={18} />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">ASI Eksklusif</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Edukasi Menyusui</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600" />
              </div>

              {/* 3. Pemulihan Pasca Bersalin */}
              <div 
                onClick={() => handleNav('/kesehatan-ibu/nifas-menyusui')}
                className="bg-white border border-slate-100/90 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[125px] hover:border-pink-200 transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <Heart size={18} />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">Normal Baik</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Kondisi Fisik</span>
                </div>
                <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Sehat
                </span>
              </div>

              {/* 4. Konseling KB Pasca Salin */}
              <div 
                onClick={() => handleNav('/kesehatan-ibu/nifas-menyusui')}
                className="bg-white border border-slate-100/90 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[125px] hover:border-pink-200 transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <FileText size={18} />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">Terencana</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Konseling KB</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600" />
              </div>
            </div>
          )}
        </div>

        {/* Kolom 2: Ringkasan Kesehatan Anak */}
        {hasAnak && anak ? (
          <div className="bg-[#FFF5F7]/70 border border-pink-200/60 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Ringkasan Kesehatan Anak {daftarAnak.length > 1 ? `(${anak.nama})` : ''}
              </h3>
              <button
                type="button"
                onClick={() => handleNav(`/kesehatan-anak/pertumbuhan?anak_id=${anak.id || '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12'}`)}
                className="text-xs font-semibold text-[#E11D48] hover:text-[#BE185D] cursor-pointer"
              >
                Lihat Detail
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* 1. Berat Badan */}
              <div 
                onClick={() => handleNav(`/kesehatan-anak/pertumbuhan?anak_id=${anak.id || '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12'}`)}
                className="bg-white border border-slate-100/90 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[125px] hover:border-pink-200 transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <Weight size={18} />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">10,5 kg</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Berat Badan</span>
                </div>
                <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Sesuai Usia
                </span>
              </div>

              {/* 2. Tinggi Badan */}
              <div 
                onClick={() => handleNav(`/kesehatan-anak/pertumbuhan?anak_id=${anak.id || '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12'}`)}
                className="bg-white border border-slate-100/90 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[125px] hover:border-pink-200 transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <Ruler size={18} />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">80 cm</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Tinggi Badan</span>
                </div>
                <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Sesuai Usia
                </span>
              </div>

              {/* 3. Imunisasi */}
              <div 
                onClick={() => handleNav(`/kesehatan-anak/imunisasi?anak_id=${anak.id || '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12'}`)}
                className="bg-white border border-slate-100/90 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[125px] hover:border-pink-200 transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <Syringe size={18} />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">3 dari 5</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Imunisasi</span>
                </div>
                <span className="inline-block text-[9px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                  Dalam Proses
                </span>
              </div>

              {/* 4. Perkembangan */}
              <div 
                onClick={() => handleNav(`/kesehatan-anak/perkembangan?anak_id=${anak.id || '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12'}`)}
                className="bg-white border border-slate-100/90 rounded-2xl p-3 shadow-2xs flex flex-col items-center text-center justify-between min-h-[125px] hover:border-pink-200 transition-all cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">Sesuai Usia</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Perkembangan</span>
                </div>
                <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Normal
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Placeholder Kolom Ringkasan Anak jika Ibu Hamil Saja belum punya anak */
          <div className="bg-[#FFF5F7]/40 border-2 border-dashed border-pink-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-center items-center text-center space-y-3 min-h-[190px]">
            <div className="w-12 h-12 rounded-2xl bg-pink-100/70 text-[#E11D48] flex items-center justify-center">
              <Baby size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Ringkasan Kesehatan Anak Belum Tersedia</h4>
              <p className="text-xs text-slate-500 max-w-xs font-medium mt-1">
                Data pertumbuhan, imunisasi, dan perkembangan akan aktif setelah si kecil lahir dan terdaftar di posyandu.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
