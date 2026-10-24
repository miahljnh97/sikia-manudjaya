import React, { useState, useEffect } from 'react';
import { bukuKiaService } from '../../../services/bukuKiaService';
import { getReminderStatus } from '../../../services/whatsappService';
import { hitungUsiaString } from '../../../utils/dateUtils';
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
  ClipboardList,
  Syringe,
  Ruler,
  TrendingUp,
  Baby
} from 'lucide-react';

export default function IbuDashboardView({ user, onNavigate, onShowToast }) {
  const ibuId = user?.peserta_id || user?.user?.id || user?.id || (
    (user?.nama || '').toLowerCase().includes('ratna') ? 'd5eeb9a6-3509-44ec-8fce-e95f3edd1a73' :
    (user?.nama || '').toLowerCase().includes('najwa') ? '214fbe12-2216-4e61-9b12-9fccca445e84' :
    '55af67c9-6695-4435-b4ea-2720efd73c92'
  );

  const [kehamilan, setKehamilan] = useState(null);
  const [daftarAnak, setDaftarAnak] = useState([]);
  const [anak, setAnak] = useState(null);
  const [jadwalList, setJadwalList] = useState([
    {
      day: '20',
      month: 'Okt',
      title: 'Pemeriksaan Rutin Posyandu',
      location: 'Puskesmas Manud Jaya',
      tanggal: '2026-10-20'
    }
  ]);

  useEffect(() => {
    if (!ibuId) return;

    // 1. Ambil data kehamilan ibu (aktif jika hamil)
    bukuKiaService.getKehamilanIbu(ibuId).then(res => {
      setKehamilan(res);
    });

    // 2. Ambil data anak milik ibu ini
    bukuKiaService.getDaftarAnak(ibuId).then(list => {
      if (list && list.length > 0) {
        setDaftarAnak(list);
        setAnak(list[0]);
      } else {
        setDaftarAnak([]);
        setAnak(null);
      }
    }).catch(err => {
      console.warn('Gagal load data anak di dashboard:', err);
      setDaftarAnak([]);
      setAnak(null);
    });

    // 3. Ambil jadwal terdekat
    bukuKiaService.getJadwalPesertaList(ibuId).then(res => {
      if (res && res.length > 0) {
        const formatted = res.slice(0, 2).map(item => {
          try {
            const d = new Date(item.tanggal);
            const day = String(d.getDate()).padStart(2, '0');
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            const month = months[d.getMonth()] || 'Okt';
            return {
              day,
              month,
              title: item.jenis_kegiatan || 'Pemeriksaan Rutin',
              location: item.lokasi || 'Puskesmas Manud Jaya',
              tanggal: item.tanggal
            };
          } catch {
            return {
              day: '20',
              month: 'Okt',
              title: item.jenis_kegiatan || 'Pemeriksaan Rutin',
              location: item.lokasi || 'Puskesmas Manud Jaya',
              tanggal: item.tanggal
            };
          }
        });
        if (formatted.length > 0) {
          setJadwalList(formatted);
        }
      }
    });
  }, [ibuId]);

  const hasKehamilan = Boolean(kehamilan && (kehamilan.status_kehamilan === 'Aktif' || kehamilan.usia_kehamilan_minggu));
  const hasAnak = Boolean(anak);

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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 border border-pink-200 text-[#E11D48] text-xs font-bold">
              <ClipboardList size={13} />
              <span>Kesehatan Ibu</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E11D48] tracking-tight">
                {user?.nama || (hasKehamilan ? 'Siti Aminah' : 'Ibu Ratna')}
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {hasKehamilan ? (
                  <>Usia Kehamilan: <strong className="text-slate-900 font-bold">{kehamilan?.usia_kehamilan_minggu || 28} Minggu</strong> · Trimester {kehamilan?.trimester || 3}</>
                ) : (
                  <>Status: <strong className="text-slate-900 font-bold">Pasca Persalinan (Menyusui)</strong> · Kondisi Sehat</>
                )}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleNav(hasKehamilan ? '/kesehatan-ibu/kehamilan' : '/kesehatan-ibu/nifas-menyusui')}
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
        {hasAnak ? (
          /* Tampilan Anak Terdaftar */
          <div className="bg-gradient-to-r from-[#FFF5F7] via-[#FFEBF1] to-[#FFE0EA] border border-pink-200/70 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xs flex flex-col justify-between items-center text-center min-h-[220px]">
            <div className="w-full flex items-center justify-between gap-2 flex-wrap">
              <div className="inline-flex items-center gap-1.5 text-pink-600 text-xs font-bold">
                <Star size={14} className="fill-pink-500 text-pink-500" />
                <span>Kesehatan Anak</span>
              </div>

              {/* Multiple Children Tab Selector jika punya > 1 anak */}
              {daftarAnak.length > 1 && (
                <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xs p-1 rounded-xl border border-pink-200/60 shadow-2xs">
                  {daftarAnak.map((a) => {
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
                        <span>{a.nama.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="my-1 flex flex-col items-center max-w-sm">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-pink-100/80 border-2 border-pink-200 p-1 flex items-center justify-center">
                <img 
                  src="/images/baby-wreath.png" 
                  alt={anak?.nama || 'Si Kecil'} 
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#E11D48] tracking-tight mt-2">
                {anak?.nama || 'Si Kecil'}
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {hitungUsiaString(anak?.tgl_lahir)}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleNav(`/kesehatan-anak/profil?anak_id=${anak?.id}`)}
                className="px-6 py-2.5 bg-[#FF4D80] hover:bg-[#F43F5E] text-white rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-pink-300/40 transition-all cursor-pointer active:scale-95"
              >
                <span>Lihat Detail Anak</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          /* Tampilan Ibu Hamil: Si kecil belum terdaftar (Persis Dashboard (1).png) */
          <div className="bg-[#FAF5FF]/50 border-2 border-dashed border-pink-200/90 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xs flex flex-col justify-between items-center text-center min-h-[220px]">
            <div className="w-full flex items-center justify-start">
              <div className="inline-flex items-center gap-1.5 text-pink-600 text-xs font-bold">
                <Star size={14} className="fill-pink-500 text-pink-500" />
                <span>Kesehatan Anak</span>
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

      {/* 3. Middle Row: Jadwal Terdekat & Pengingat (Persis Figma Dashboard.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Card Jadwal Terdekat (PBI 01A) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <Calendar size={18} className="text-[#E11D48]" />
            <h3 className="text-sm font-bold text-slate-900">Jadwal Terdekat</h3>
          </div>

          <div className="space-y-3">
            {jadwalList.map((item, idx) => {
              const reminder = getReminderStatus(item.tanggal);
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
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#E11D48] transition-colors">
                          {item.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${reminder.badgeColor}`}>
                          {reminder.label}
                        </span>
                      </div>
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
                <div className="w-11 h-11 rounded-2xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0 border border-pink-100">
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
              onClick={() => handleNav('/kesehatan-anak/imunisasi')}
              className="p-3.5 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
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

      {/* 4. Bottom Row: Ringkasan Kesehatan Ibu & Anak (Persis Dashboard.png) */}
      <div className="space-y-6">
        {/* Ringkasan Kesehatan Ibu */}
        <div className="bg-white/70 border border-pink-100/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Ringkasan Kesehatan Ibu</h3>
            <button
              type="button"
              onClick={() => handleNav('/kesehatan-ibu/kehamilan')}
              className="text-xs font-semibold text-[#E11D48] hover:text-[#BE185D] cursor-pointer"
            >
              Lihat Detail
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Pemeriksaan Kehamilan */}
            <div 
              onClick={() => handleNav('/kesehatan-ibu/pemeriksaan')}
              className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-200 transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <Heart size={18} />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block leading-tight">5 dari 8 kali</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Pemeriksaan Kehamilan</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600" />
            </div>

            {/* 2. Kenaikan Berat Badan */}
            <div 
              onClick={() => handleNav('/kesehatan-ibu/kehamilan')}
              className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-200 transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <Weight size={18} />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block leading-tight">+7 kg</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Kenaikan Berat Badan</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600" />
            </div>

            {/* 3. Tekanan Darah */}
            <div 
              onClick={() => handleNav('/kesehatan-ibu/pemeriksaan')}
              className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-200 transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <Activity size={18} />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block leading-tight">110/70 mmHg</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Tekanan Darah</span>
                  <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-0.5">
                    Normal
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600" />
            </div>

            {/* 4. Hasil HB Terakhir */}
            <div 
              onClick={() => handleNav('/kesehatan-ibu/pemeriksaan')}
              className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-200 transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <Droplet size={18} />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block leading-tight">Normal</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Hasil HB Terakhir</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600" />
            </div>
          </div>
        </div>

        {/* Ringkasan Kesehatan Anak (Jika Ibu Balita atau anak terdaftar) */}
        {hasAnak && (
          <div className="bg-white/70 border border-pink-100/80 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900">
                  Ringkasan Kesehatan Anak ({anak?.nama || 'Si Kecil'})
                </h3>
                {daftarAnak.length > 1 && (
                  <div className="flex items-center gap-1 bg-pink-50 p-1 rounded-xl border border-pink-200">
                    <span className="text-[10px] font-bold text-slate-400 px-1 uppercase tracking-wider">Pilih:</span>
                    {daftarAnak.map((a) => {
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
                              : 'text-slate-600 hover:text-[#E11D48] hover:bg-white/70'
                          }`}
                        >
                          <span>{isBoy ? '👦' : '👧'}</span>
                          <span>{a.nama.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleNav(`/kesehatan-anak/pertumbuhan?anak_id=${anak?.id}`)}
                className="text-xs font-semibold text-[#E11D48] hover:text-[#BE185D] cursor-pointer"
              >
                Lihat Detail
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Berat Badan */}
              <div 
                onClick={() => handleNav(`/kesehatan-anak/pertumbuhan?anak_id=${anak?.id}`)}
                className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-200 transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                    <Weight size={18} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block leading-tight">10,5 kg</span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Berat Badan</span>
                    <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-0.5">
                      Sesuai Usia
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600" />
              </div>

              {/* Tinggi Badan */}
              <div 
                onClick={() => handleNav(`/kesehatan-anak/pertumbuhan?anak_id=${anak?.id}`)}
                className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-200 transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                    <Ruler size={18} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block leading-tight">80 cm</span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Tinggi Badan</span>
                    <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-0.5">
                      Sesuai Usia
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600" />
              </div>

              {/* Imunisasi */}
              <div 
                onClick={() => handleNav(`/kesehatan-anak/imunisasi?anak_id=${anak?.id}`)}
                className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-200 transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                    <Syringe size={18} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block leading-tight">3 dari 5</span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Imunisasi</span>
                    <span className="inline-block text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded mt-0.5">
                      Dalam Proses
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600" />
              </div>

              {/* Perkembangan */}
              <div 
                onClick={() => handleNav(`/kesehatan-anak/perkembangan?anak_id=${anak?.id}`)}
                className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-200 transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block leading-tight">Sesuai Usia</span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Perkembangan</span>
                    <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-0.5">
                      Normal
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
