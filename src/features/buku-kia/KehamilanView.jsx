import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  HeartPulse, 
  Stethoscope, 
  Weight, 
  ChevronRight, 
  Info, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  X,
  Users
} from 'lucide-react';
import { bukuKiaService } from '../../services/bukuKiaService';
import { pesertaService } from '../../services/pesertaService';
import { maskNik } from '../../utils/nikUtils';

export default function KehamilanView({ user, currentPath = '', onNavigate, onShowToast }) {
  const isIbuRole = (user?.role || '').toLowerCase().includes('ibu') || (user?.email || '').toLowerCase().includes('ibu');

  // Helper ekstrak ID dari URL
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
    return isIbuRole ? '55af67c9-6695-4435-b4ea-2720efd73c92' : null;
  };

  const [daftarIbu, setDaftarIbu] = useState([]);
  const [activePesertaId, setActivePesertaId] = useState(() => extractPesertaId() || '55af67c9-6695-4435-b4ea-2720efd73c92');
  const [peserta, setPeserta] = useState(null);
  const [kehamilan, setKehamilan] = useState(null);
  const [selectedPanduan, setSelectedPanduan] = useState(null);

  // Sinkronkan saat URL berubah
  useEffect(() => {
    const urlId = extractPesertaId();
    if (urlId && urlId !== activePesertaId) {
      setActivePesertaId(urlId);
    }
  }, [currentPath]);

  // Load daftar ibu hamil untuk dropdown Bidan/Kader
  useEffect(() => {
    bukuKiaService.getDaftarIbuHamil().then(list => {
      if (list && list.length > 0) {
        setDaftarIbu(list);
        if (!activePesertaId) {
          setActivePesertaId(list[0].id);
        }
      }
    });
  }, []);

  // Fetch kehamilan untuk ibu yang dipilih
  useEffect(() => {
    if (!activePesertaId) return;
    pesertaService.getPesertaById(activePesertaId).then(p => {
      if (p) setPeserta(p);
    });
    bukuKiaService.getKehamilanIbu(activePesertaId).then(k => {
      if (k) setKehamilan(k);
    });
  }, [activePesertaId]);

  const handleSwitchPasien = (newId) => {
    setActivePesertaId(newId);
    if (onNavigate) {
      onNavigate(`/kesehatan-ibu/kehamilan?peserta_id=${newId}`);
    }
  };

  const panduanList = [
    {
      id: 'tanda-bahaya',
      title: 'Tanda bahaya kehamilan',
      desc: 'Kenali tanda bahaya seperti perdarahan, sakit kepala hebat, bengkak pada wajah dan kaki, serta gerakan janin berkurang.',
      points: [
        'Perdarahan dari jalan lahir',
        'Bengkak pada kaki, tangan, dan wajah disertai sakit kepala hebat',
        'Demam tinggi atau kejang',
        'Gerakan janin berkurang atau tidak terasa',
        'Air ketuban keluar sebelum waktunya'
      ]
    },
    {
      id: 'persiapan-persalinan',
      title: 'Persiapan persalinan',
      desc: 'Panduan persiapan P4K (Program Perencanaan Persalinan dan Pencegahan Komplikasi) menyambut kelahiran sang buah hati.',
      points: [
        'Tentukan tempat persalinan dan penolong persalinan (Bidan/Dokter)',
        'Siapkan dana persalinan dan jaminan kesehatan (BPJS/KIS)',
        'Siapkan kendaraan/transportasi siaga',
        'Siapkan calon pendonor darah jika diperlukan',
        'Siapkan perlengkapan ibu dan bayi baru lahir minimal 1 bulan sebelum HPL'
      ]
    },
    {
      id: 'perawatan-pasca-persalinan',
      title: 'Perawatan pasca persalinan',
      desc: 'Langkah awal perawatan masa nifas, inisiasi menyusu dini (IMD), dan perawatan tali pusat bayi baru lahir.',
      points: [
        'Inisiasi Menyusu Dini (IMD) segera dalam 1 jam pertama setelah lahir',
        'Pemberian ASI Eksklusif selama 6 bulan pertama',
        'Menjaga kebersihan area intim dan luka jahitan pasca bersalin',
        'Istirahat yang cukup saat bayi sedang tidur',
        'Kontrol nifas (KF 1 - KF 4) sesuai anjuran bidan'
      ]
    }
  ];

  const namaIbu = peserta?.nama || 'Siti Aminah';
  const usiaMinggu = kehamilan?.usia_kehamilan_minggu || 28;
  const trimesterNum = kehamilan?.trimester || 3;
  const hplDate = kehamilan?.hpl || '20 Desember 2026';
  const hphtDate = kehamilan?.hpht || '12 Februari 2026';
  const feDiminum = kehamilan?.jumlah_tablet_fe_diminum || 70;
  const feTarget = kehamilan?.target_tablet_fe || 90;
  const progressPercent = Math.min(100, Math.round((usiaMinggu / 40) * 100));

  return (
    <div className="space-y-6">
      {/* 1. Header Breadcrumb & Patient Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kesehatan Ibu / Kehamilan
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Pantau perkembangan kehamilan {namaIbu} sesuai Buku KIA
          </p>
        </div>

        {/* Dropdown Selector Ibu Hamil untuk Bidan/Kader */}
        {!isIbuRole && daftarIbu.length > 0 && (
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3 py-2 shadow-xs">
            <Users size={16} className="text-pink-600 shrink-0" />
            <div className="text-[11px]">
              <span className="text-slate-400 block font-medium">Pilih Pasien Ibu Hamil:</span>
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

      {/* 2. Top Banner Card */}
      <div className="bg-gradient-to-r from-[#FFF0F4] via-[#FFE4EC] to-[#FFD6E4] border border-pink-200/80 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Sisi Kiri: Usia Kehamilan + Progress Bar */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs text-slate-600 font-medium block">Usia Kehamilan ({namaIbu})</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#E11D48] tracking-tight">
                {usiaMinggu} Minggu
              </span>
              <span className="text-xs text-slate-500 font-medium">dari 40 minggu</span>
            </div>

            {/* Progress Bar usia/40 minggu */}
            <div className="w-full max-w-xs h-2.5 bg-pink-200/80 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#E11D48] rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Trimester Badge */}
            <div className="pt-2 flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Trimester</span>
              <span className="px-3 py-1 rounded-xl bg-pink-100 text-[#BE185D] text-xs font-bold border border-pink-200">
                Trimester {trimesterNum}
              </span>
            </div>
          </div>

          {/* Sisi Tengah: Perkiraan Hari Lahir Box */}
          <div className="lg:col-span-4">
            <div className="bg-white/90 backdrop-blur-xs border border-white/80 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-pink-50 text-slate-800 flex items-center justify-center shrink-0 border border-pink-100">
                <Calendar size={22} className="text-slate-800" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Perkiraan Hari Lahir (HPL)</span>
                <div className="text-base sm:text-lg font-extrabold text-[#E11D48] leading-tight mt-0.5">
                  {hplDate}
                </div>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                  ({Math.max(0, 40 - usiaMinggu)} minggu lagi)
                </span>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Ilustrasi Ibu Hamil */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end">
            <img 
              src="/images/ibu-kehamilan-banner.png" 
              alt="Ilustrasi Ibu Hamil" 
              className="h-44 sm:h-52 object-contain drop-shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* 3 Sub-Kotak Informasi Bawah Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-pink-200/60">
          <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3.5 border border-white/80">
            <span className="text-[11px] text-slate-500 font-medium block">Hari Pertama Haid Terakhir (HPHT)</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 mt-1 block">{hphtDate}</span>
          </div>

          <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3.5 border border-white/80">
            <span className="text-[11px] text-slate-500 font-medium block">Taksiran Persalinan</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 mt-1 block">{hplDate}</span>
          </div>

          <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3.5 border border-white/80">
            <span className="text-[11px] text-slate-500 font-medium block">Usia Kehamilan Saat Ini</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 mt-1 block">{usiaMinggu} Minggu</span>
          </div>
        </div>
      </div>

      {/* 3. 4 Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pemeriksaan Kehamilan ANC */}
        <div 
          onClick={() => onNavigate && onNavigate(`/kesehatan-ibu/pemeriksaan?peserta_id=${activePesertaId}`)}
          className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between cursor-pointer hover:border-pink-200 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Stethoscope size={20} />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Pemeriksaan Kehamilan</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">Buka Rekam ANC</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </div>

        {/* Konsumsi TTD/MMS */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <HeartPulse size={20} />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Konsumsi Tablet Tambah Darah</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">{feDiminum} / {feTarget}</span>
              <span className="text-[10px] text-slate-400">tablet telah diminum</span>
            </div>
          </div>
        </div>

        {/* Jadwal Mendatang */}
        <div 
          onClick={() => onNavigate && onNavigate('/jadwal-saya')}
          className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between cursor-pointer hover:border-blue-200 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Jadwal Posyandu</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">Jadwal Saya</span>
              <span className="text-[10px] text-slate-400">Pengingat WhatsApp H-3</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </div>

        {/* Status Kesehatan */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Weight size={20} />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Status Kehamilan</span>
              <span className="text-sm font-bold text-emerald-600 mt-0.5 block">
                {kehamilan?.status_kehamilan || 'Aktif'}
              </span>
              <span className="text-[10px] text-slate-400">Kondisi Optimal</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Section Panduan Kehamilan */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Panduan Kehamilan</h3>
          <p className="text-xs text-slate-400">Informasi penting seputar perawatan dan kesehatan selama masa kehamilan</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {panduanList.map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedPanduan(item)}
              className="bg-white border border-slate-100 hover:border-pink-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between cursor-pointer group transition-all"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#E11D48] flex items-center justify-center font-bold">
                  <FileText size={18} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#E11D48] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-bold text-[#E11D48]">
                <span>Baca Selengkapnya</span>
                <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Detail Panduan */}
      {selectedPanduan && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">{selectedPanduan.title}</h3>
              <button 
                type="button" 
                onClick={() => setSelectedPanduan(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p className="font-medium text-slate-700">{selectedPanduan.desc}</p>
              <div className="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-2">
                <span className="font-bold text-[#E11D48] block">Poin-poin penting:</span>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-700">
                  {selectedPanduan.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPanduan(null)}
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
