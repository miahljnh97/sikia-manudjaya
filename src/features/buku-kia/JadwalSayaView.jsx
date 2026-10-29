import { getPesertaIdFromUser } from '../../models/pesertaModel';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Stethoscope, 
  Syringe, 
  User, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  X,
  MessageCircle,
  RotateCcw
} from 'lucide-react';
import { bukuKiaService } from '../../services/bukuKiaService';
import { sendWhatsAppReminder, getReminderStatus, normalizePhoneForWhatsApp, generateWhatsAppReminderMessage } from '../../services/whatsappService';

// Helper resolusi status selaras antara kolom tanggal dan status
const resolveJadwalStatus = (item) => {
  if (!item) return 'Akan Datang';
  if (item.status === 'Selesai') return 'Selesai';
  const reminder = getReminderStatus(item.tanggal);
  if (reminder.selisihHari < 0) {
    return 'Selesai';
  }
  return item.status || 'Akan Datang';
};


export default function JadwalSayaView({ user, onNavigate, onShowToast }) {


  const userRole = (user?.role || '').toLowerCase().trim();
  const userEmail = (user?.user?.email || user?.email || '').toLowerCase().trim();
  const isIbuRole = userRole.includes('ibu') || userEmail.includes('ibu') || userEmail.includes('hamil') || userEmail.includes('balita');

  // Tombol Kirim WA hanya untuk Bidan, Kader, dan Super Admin. Akun Ibu di-hide.
  const canSendWa = !isIbuRole;
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 8, 1)); // September 2026
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedJadwal, setSelectedJadwal] = useState(null);
  const [isSendingWa, setIsSendingWa] = useState(false);
  const [blastWaJadwal, setBlastWaJadwal] = useState(null);
  const [blastTargetPhone, setBlastTargetPhone] = useState('081234567890');
  const [blastJenisPengingat, setBlastJenisPengingat] = useState('H-3');
  const [blastMetode, setBlastMetode] = useState('gateway');

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const defaultIbuHamilJadwal = [
    { no: 1, id: 'j-1', tanggal: '2026-09-05', displayTanggal: '05 Sep 2026', waktu: '09.00 - 10.00', jenis: 'Pemeriksaan Kehamilan (ANC)', lokasi: 'Puskesmas Manud Jaya', status: 'Selesai', petugas: 'Bidan Siti Nurhayati', keterangan: 'Pemeriksaan ANC Trimester 3 rutin dan USG dasar.' },
    { no: 2, id: 'j-2', tanggal: '2026-09-24', displayTanggal: '24 Sep 2026', waktu: '09.00 - 10.00', jenis: 'Konseling Gizi Ibu Hamil', lokasi: 'Puskesmas Manud Jaya', status: 'Selesai', petugas: 'Ahli Gizi Puskesmas', keterangan: 'Evaluasi pola makan, asupan zat besi, dan pencegahan anemia.' },
    { no: 3, id: 'j-3', tanggal: '2026-09-28', displayTanggal: '28 Sep 2026', waktu: '09.00 - 10.00', jenis: 'Pemeriksaan Kehamilan', lokasi: 'Puskesmas Manud Jaya', status: 'Selesai', petugas: 'dr. Haryono, Sp.OG', keterangan: 'Kontrol berkala pemantauan posisi janin dan DJJ.' },
    { no: 4, id: 'j-4', tanggal: '2026-10-10', displayTanggal: '10 Okt 2026', waktu: '09.00 - 10.00', jenis: 'Pemeriksaan Kehamilan (ANC)', lokasi: 'Puskesmas Manud Jaya', status: 'Akan Datang', petugas: 'Bidan Siti Nurhayati', keterangan: 'Pemeriksaan kehamilan lanjutan.' },
    { no: 5, id: 'j-5', tanggal: '2026-10-18', displayTanggal: '18 Okt 2026', waktu: '09.00 - 10.00', jenis: 'Kelas Ibu Hamil', lokasi: 'Puskesmas Manud Jaya', status: 'Akan Datang', petugas: 'Bidan Koordinator', keterangan: 'Edukasi persiapan persalinan.' },
    { no: 6, id: 'j-6', tanggal: '2026-10-25', displayTanggal: '25 Okt 2026', waktu: '09.00 - 10.00', jenis: 'Posyandu Balita & Imunisasi', lokasi: 'Posyandu Manud Jaya', status: 'Akan Datang', petugas: 'Kader & Bidan Desa', keterangan: 'Penimbangan dan imunisasi balita.' },
    { no: 7, id: 'j-7', tanggal: '2026-11-02', displayTanggal: '02 Nov 2026', waktu: '09.00 - 10.00', jenis: 'Kelas Ibu Hamil', lokasi: 'Puskesmas Manud Jaya', status: 'Akan Datang', petugas: 'Bidan Koordinator', keterangan: 'Senam hamil dan edukasi IMD.' },
  ];

  const [jadwalList, setJadwalList] = useState(defaultIbuHamilJadwal);

  useEffect(() => {
    const targetIbuId = user?.peserta_id || (user && getPesertaIdFromUser(user)) || user?.id || null;
    if (targetIbuId) {
      bukuKiaService.getJadwalPesertaList(targetIbuId).then((res) => {
        if (!res || res.length === 0) return;

        let candidateList = res;
        if (isIbuRole) {
          const userSpecific = res.filter(j => j.peserta_id === targetIbuId);
          if (userSpecific.length > 0) {
            candidateList = userSpecific;
          }
        }

        if (candidateList && candidateList.length > 0) {
          const mapped = candidateList.map((j, idx) => ({
            no: idx + 1,
            id: j.id,
            tanggal: j.tanggal,
            displayTanggal: j.tanggal,
            waktu: j.waktu || '09.00 - 10.00',
            jenis: j.jenis_kegiatan || 'Pemeriksaan Kesehatan',
            lokasi: j.lokasi || 'Puskesmas Manud Jaya',
            status: resolveJadwalStatus(j),
            petugas: j.petugas || 'Bidan Siti, S.Tr.Keb',
            keterangan: j.catatan || 'Pemeriksaan rutin posyandu.'
          }));
          setJadwalList(mapped);
        }
      }).catch(err => {
        console.warn('Gagal fetch jadwal dari Supabase:', err);
      });
    }
  }, [user, isIbuRole]);

  // Metrik terhitung dinamis dari jadwal aktif (PBI 01A AC 1)
  const countPemeriksaan = useMemo(() => {
    return jadwalList.filter(j => {
      const s = (j.jenis || '').toLowerCase();
      return s.includes('pemeriksaan') || s.includes('anc') || s.includes('usg');
    }).length;
  }, [jadwalList]);

  const countImunisasi = useMemo(() => {
    return jadwalList.filter(j => {
      const s = (j.jenis || '').toLowerCase();
      return s.includes('imunisasi') || s.includes('vaksin');
    }).length;
  }, [jadwalList]);

  const countKonseling = useMemo(() => {
    return jadwalList.filter(j => {
      const s = (j.jenis || '').toLowerCase();
      return s.includes('konseling') || s.includes('gizi');
    }).length;
  }, [jadwalList]);

  const countKelasIbu = useMemo(() => {
    return jadwalList.filter(j => {
      const s = (j.jenis || '').toLowerCase();
      return s.includes('kelas') || s.includes('senam') || s.includes('edukasi');
    }).length;
  }, [jadwalList]);

  // Ekstrak hari-hari yang memiliki jadwal di bulan & tahun aktif
  const eventDays = useMemo(() => {
    const days = new Set();
    jadwalList.forEach(item => {
      try {
        const d = new Date(item.tanggal);
        if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
          days.add(d.getDate());
        }
      } catch {
        // ignore
      }
    });
    return days;
  }, [jadwalList, currentYear, currentMonth]);

  // Filter daftar jadwal jika ada tanggal kalender yang diklik
  const filteredJadwalList = useMemo(() => {
    if (selectedDay) {
      return jadwalList.filter(item => {
        try {
          const d = new Date(item.tanggal);
          return d.getDate() === selectedDay && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        } catch {
          return false;
        }
      });
    }
    const monthFiltered = jadwalList.filter(item => {
      try {
        const d = new Date(item.tanggal);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      } catch {
        return false;
      }
    });
    return monthFiltered.length > 0 ? monthFiltered : jadwalList;
  }, [jadwalList, selectedDay, currentMonth, currentYear]);

  // Jadwal terdekat yang selaras dengan kalender (bulan/tanggal aktif)
  const displayJadwalTerdekat = useMemo(() => {
    let list = jadwalList.filter(item => {
      try {
        const d = new Date(item.tanggal);
        if (selectedDay) {
          return d.getDate() === selectedDay && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        }
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      } catch {
        return false;
      }
    });

    list.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

    if (list.length === 0 && !selectedDay) {
      const upcoming = jadwalList
        .filter(item => resolveJadwalStatus(item) === 'Akan Datang')
        .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
      return upcoming.slice(0, 3);
    }

    return list.slice(0, 4);
  }, [jadwalList, selectedDay, currentMonth, currentYear]);

  const handleKirimWhatsApp = async (item) => {
    setIsSendingWa(true);
    try {
      const savedPhone = typeof window !== 'undefined' ? localStorage.getItem('sikia_user_phone') : null;
      const res = await sendWhatsAppReminder({
        phone: savedPhone || '081234567890',
        jadwal: item,
        namaIbu: 'Siti Aminah'
      });

      if (res.success) {
        if (res.method === 'n8n') {
          onShowToast && onShowToast('Trigger pengingat jadwal berhasil dikirim ke n8n iPaaS!', 'success');
        } else if (res.method === 'fonnte') {
          onShowToast && onShowToast('Notifikasi pengingat WhatsApp berhasil dikirim via Fonnte Gateway!', 'success');
        } else {
          onShowToast && onShowToast('Membuka WhatsApp dengan pesan pengingat resmi yang telah diformat...', 'info');
          if (res.waUrl && typeof window !== 'undefined') {
            window.open(res.waUrl, '_blank');
          }
        }
      } else {
        onShowToast && onShowToast(res.message || 'Gagal mengirim pengingat WhatsApp, membuka WhatsApp...', 'warning');
        if (res.waUrl && typeof window !== 'undefined') {
          window.open(res.waUrl, '_blank');
        }
      }
    } catch (err) {
      console.error(err);
      onShowToast && onShowToast('Terjadi kesalahan saat memproses WhatsApp', 'error');
    } finally {
      setIsSendingWa(false);
    }
  };

  const calendarDays = useMemo(() => {
    // Khusus September 2026 persis sesuai layout Figma Sprint 2
    if (currentYear === 2026 && currentMonth === 8) {
      return [
        { day: 31, isPrev: true },
        { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 }, { day: 6 },
        { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12 }, { day: 13 },
        { day: 14 }, { day: 15 }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 }, { day: 20 },
        { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 }, { day: 26 }, { day: 27 },
        { day: 28 }, { day: 29 }, { day: 30 },
        { day: 1, isNext: true }, { day: 2, isNext: true }, { day: 3, isNext: true }, { day: 4, isNext: true }
      ];
    }

    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, isPrev: true });
    }
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({ day: i });
    }
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isNext: true });
    }
    return days;
  }, [currentYear, currentMonth]);

  const handleExecuteBlast = async () => {
    if (!blastWaJadwal) return;
    setIsSendingWa(true);
    try {
      if (blastMetode === 'manual') {
        const cleanPhone = normalizePhoneForWhatsApp(blastTargetPhone);
        const msg = generateWhatsAppReminderMessage(blastWaJadwal, user?.nama || 'Ibu');
        const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
        if (typeof window !== 'undefined') window.open(waUrl, '_blank');
        onShowToast && onShowToast('Membuka WhatsApp Web untuk pengiriman pesan pengingat...', 'info');
      } else {
        const res = await sendWhatsAppReminder({
          phone: blastTargetPhone,
          jadwal: blastWaJadwal,
          namaIbu: user?.nama || 'Siti Aminah'
        });
        onShowToast && onShowToast(
          `Pesan pengingat (${blastJenisPengingat}) berhasil diblast ke nomor ${blastTargetPhone} melalui WhatsApp Gateway Posyandu!`,
          'success'
        );
      }
      setBlastWaJadwal(null);
    } catch (err) {
      console.error(err);
      onShowToast && onShowToast('Gagal memproses blast WhatsApp: ' + err.message, 'error');
    } finally {
      setIsSendingWa(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Halaman */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Jadwal Saya
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Lihat dan kelola semua jadwal pemeriksaan, konseling, imunisasi dan kegiatan lainnya
        </p>
      </div>

      {/* 2. 4 Kartu Metrik Jadwal */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Pemeriksaan */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="text-[#7C3AED] shrink-0">
            <Stethoscope size={22} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Jadwal Pemeriksaan</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 leading-tight block mt-0.5">
              {countPemeriksaan}
            </span>
          </div>
        </div>

        {/* Metric 2: Imunisasi */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="text-[#7C3AED] shrink-0">
            <Syringe size={22} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Jadwal Imunisasi</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 leading-tight block mt-0.5">
              {countImunisasi}
            </span>
          </div>
        </div>

        {/* Metric 3: Konseling */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="text-[#7C3AED] shrink-0">
            <User size={22} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Jadwal Konseling</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 leading-tight block mt-0.5">
              {countKonseling}
            </span>
          </div>
        </div>

        {/* Metric 4: Kelas Ibu Hamil */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="text-[#7C3AED] shrink-0">
            <BookOpen size={22} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Kelas Ibu Hamil</span>
            <span className="text-base sm:text-lg font-bold text-slate-900 leading-tight block mt-0.5">
              {countKelasIbu}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Baris Tengah: Kalender Interaktif & Jadwal Terdekat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Kalender */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <button 
              type="button" 
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <h3 className="text-sm font-bold text-slate-900">{monthNames[currentMonth]} {currentYear}</h3>
              <p className="text-[10px] text-slate-400">Klik tanggal untuk menyaring tabel daftar jadwal</p>
            </div>
            <button 
              type="button" 
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
              title="Bulan Berikutnya"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Hari dalam seminggu */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-400 pb-1 border-b border-slate-50">
            <span>Min</span>
            <span>Sen</span>
            <span>Sel</span>
            <span>Rab</span>
            <span>Kam</span>
            <span>Jum</span>
            <span>Sab</span>
          </div>

          {/* Grid Tanggal */}
          <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-xs">
            {calendarDays.map((item, idx) => {
              const hasEvent = !item.isPrev && !item.isNext && eventDays.has(item.day);
              const isSelected = !item.isPrev && !item.isNext && item.day === selectedDay;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (!item.isPrev && !item.isNext) {
                      setSelectedDay(item.day === selectedDay ? null : item.day);
                    }
                  }}
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-all cursor-pointer font-medium relative ${
                    item.isPrev || item.isNext
                      ? 'text-slate-300'
                      : isSelected
                      ? 'bg-[#1E3A8A] text-white font-bold shadow-xs'
                      : hasEvent
                      ? 'text-slate-900 font-bold bg-pink-50 hover:bg-pink-100'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.day}</span>
                  {hasEvent && !isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute bottom-0.5"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Banner Filter Tanggal Aktif (Gambar 2 Sesuai Figma) */}
          {selectedDay && (
            <div className="pt-2 flex items-center justify-between text-xs bg-blue-50/70 border border-blue-100 px-3.5 py-2.5 rounded-xl text-blue-700 animate-in fade-in">
              <span className="font-medium">
                Menyaring jadwal tanggal <strong>{selectedDay} {monthNames[currentMonth]} {currentYear}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="inline-flex items-center gap-1 font-bold text-blue-800 hover:underline cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset Filter</span>
              </button>
            </div>
          )}
        </div>

        {/* Jadwal Terdekat */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Jadwal Terdekat</h3>
            <span className="text-[11px] text-slate-400 font-medium">
              {selectedDay ? `${selectedDay} ${monthNames[currentMonth]}` : `${monthNames[currentMonth]} ${currentYear}`}
            </span>
          </div>

          <div className="space-y-3">
            {displayJadwalTerdekat.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                Belum ada agenda jadwal kegiatan pada {selectedDay ? `tanggal ${selectedDay} ` : 'bulan '}{monthNames[currentMonth]} {currentYear}.
              </div>
            ) : displayJadwalTerdekat.map((item, idx) => {
              const reminder = getReminderStatus(item.tanggal);
              let dayStr = '12';
              let monthStr = 'Sep';
              try {
                const d = new Date(item.tanggal);
                dayStr = String(d.getDate()).padStart(2, '0');
                const mNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                monthStr = mNames[d.getMonth()] || 'Sep';
              } catch {
                // fallback
              }

              return (
                <div 
                  key={item.id || idx}
                  onClick={() => setSelectedJadwal(item)}
                  className="p-3.5 rounded-2xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/20 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#F1E8FB] flex flex-col items-center justify-center text-[#7E22CE] shrink-0 font-bold leading-tight">
                      <span className="text-sm font-extrabold">{dayStr}</span>
                      <span className="text-[10px] font-medium">{monthStr}</span>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#7E22CE] transition-colors">
                        {item.jenis}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.waktu} WIB</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.lokasi}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Tabel: Daftar Jadwal (Tersaring Berdasarkan Klik Kalender - PBI 01A AC 2) */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isIbuRole ? 'Daftar Jadwal' : 'Daftar Jadwal Kegiatan'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {selectedDay 
                ? `Menampilkan ${filteredJadwalList.length} kegiatan pada tanggal ${selectedDay} ${monthNames[currentMonth]} ${currentYear}`
                : `Menampilkan semua ${filteredJadwalList.length} jadwal kegiatan aktif`
              }
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FFE4EC]/70 text-slate-800 font-bold border-b border-pink-100">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4 w-32">Tanggal</th>
                <th className="py-3 px-4 w-32">Waktu</th>
                <th className="py-3 px-4">Jenis Kegiatan</th>
                <th className="py-3 px-4">Lokasi</th>
                <th className="py-3 px-4 w-32 text-center">Status</th>
                <th className="py-3 px-4 w-28 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredJadwalList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada jadwal kegiatan pada tanggal yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredJadwalList.map((row, idx) => {
                  const reminder = getReminderStatus(row.tanggal);
                  const resolvedStatus = resolveJadwalStatus(row);
                  return (
                    <tr key={row.no || idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 text-center font-medium">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div>{row.displayTanggal || row.tanggal}</div>
                        <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold border ${reminder.badgeColor}`}>
                          {reminder.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{row.waktu}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">{row.jenis}</td>
                      <td className="py-3.5 px-4 text-slate-600">{row.lokasi}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          resolvedStatus === 'Selesai'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-[#EDE9FE] text-[#6D28D9]'
                        }`}>
                          {resolvedStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {canSendWa && (
                            <button
                              type="button"
                              onClick={() => {
                                setBlastWaJadwal(row);
                                setBlastTargetPhone('081234567890');
                              }}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer"
                              title="Kirim Blast Pengingat WhatsApp Resmi"
                            >
                              <MessageCircle size={13} className="text-emerald-600" />
                              <span>Kirim WA</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedJadwal(row)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Lihat Detail Jadwal"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Blast Pengingat WhatsApp Resmi Posyandu (Item 24) */}
      {blastWaJadwal && canSendWa && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Sistem Blast WhatsApp Posyandu
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Kirim pesan broadcast pengingat jadwal otomatis ke peserta
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setBlastWaJadwal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Informasi Kegiatan */}
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Kegiatan:</span>
                <span className="font-bold text-slate-900">{blastWaJadwal.jenis}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Waktu & Tanggal:</span>
                <span className="font-bold text-slate-800">{blastWaJadwal.displayTanggal || blastWaJadwal.tanggal} ({blastWaJadwal.waktu} WIB)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Lokasi:</span>
                <span className="text-slate-700">{blastWaJadwal.lokasi}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Petugas:</span>
                <span className="text-slate-700">{blastWaJadwal.petugas}</span>
              </div>
            </div>

            {/* Form Input Penerima & Template */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Nomor WhatsApp Penerima / Sasaran</label>
                <input
                  type="text"
                  value={blastTargetPhone}
                  onChange={(e) => setBlastTargetPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Jenis Blast Pengingat</label>
                <div className="grid grid-cols-3 gap-2">
                  {['H-3', 'H-1', 'Hari-H'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setBlastJenisPengingat(opt)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                        blastJenisPengingat === opt
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Pengingat {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Chat WhatsApp */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Pratinjau Pesan Broadcast</label>
                <div className="p-3 bg-[#E7F8E8] border border-emerald-200/80 rounded-2xl text-[11px] text-slate-800 font-mono whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                  {generateWhatsAppReminderMessage(blastWaJadwal, user?.nama || 'Ibu')}
                </div>
              </div>

              {/* Metode Pengiriman */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Metode Pengiriman</label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="blast_method"
                      value="gateway"
                      checked={blastMetode === 'gateway'}
                      onChange={() => setBlastMetode('gateway')}
                      className="accent-emerald-600"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">Kirim Otomatis via WhatsApp Gateway / n8n iPaaS</span>
                      <span className="text-[10px] text-slate-400 block">Mengirim pesan blast di latar belakang langsung ke WhatsApp peserta</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="blast_method"
                      value="manual"
                      checked={blastMetode === 'manual'}
                      onChange={() => setBlastMetode('manual')}
                      className="accent-emerald-600"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">Kirim via WhatsApp Web / Aplikasi (Manual)</span>
                      <span className="text-[10px] text-slate-400 block">Membuka jendela chat WhatsApp dengan teks template yang sudah terisi</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setBlastWaJadwal(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteBlast}
                disabled={isSendingWa}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <MessageCircle size={15} />
                <span>{isSendingWa ? 'Mengirim Blast...' : 'Kirim Blast Sekarang'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Jadwal */}
      {selectedJadwal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Detail Jadwal Pelayanan</h4>
              <button 
                type="button" 
                onClick={() => setSelectedJadwal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                <span className="text-[10px] text-purple-600 font-semibold block uppercase">Kegiatan</span>
                <span className="text-sm font-bold text-purple-950">{selectedJadwal.jenis}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Tanggal</span>
                  <span className="font-semibold text-slate-800">{selectedJadwal.tanggal}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Waktu</span>
                  <span className="font-semibold text-slate-800">{selectedJadwal.waktu} WIB</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Lokasi Pelayanan</span>
                <span className="font-semibold text-slate-800">{selectedJadwal.lokasi}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Petugas Penanggung Jawab</span>
                <span className="font-semibold text-slate-800">{selectedJadwal.petugas}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Keterangan / Persiapan</span>
                <span className="text-slate-700">{selectedJadwal.keterangan}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedJadwal(null)}
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
