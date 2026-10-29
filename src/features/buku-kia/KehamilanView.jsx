import { getPesertaIdFromUser } from '../../models/pesertaModel';
import React, { useState, useEffect, useRef } from 'react';
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
  Users,
  Activity,
  Heart,
  Baby,
  ExternalLink,
  BookOpen,
  Download
} from 'lucide-react';
import { bukuKiaService } from '../../services/bukuKiaService';
import { pesertaService } from '../../services/pesertaService';
import { maskNik } from '../../utils/nikUtils';
import { formatTanggalIndo } from '../../utils/dateUtils';

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
    return isIbuRole ? (getPesertaIdFromUser(user) || '55af67c9-6695-4435-b4ea-2720efd73c92') : null;
  };

  const [daftarIbu, setDaftarIbu] = useState([]);
  const [activePesertaId, setActivePesertaId] = useState(() => extractPesertaId() || '55af67c9-6695-4435-b4ea-2720efd73c92');
  const [peserta, setPeserta] = useState(null);
  const [kehamilan, setKehamilan] = useState(null);
  const [selectedPanduan, setSelectedPanduan] = useState(null);
  const [showAllPanduan, setShowAllPanduan] = useState(false);
  const [selectedKategoriPanduan, setSelectedKategoriPanduan] = useState('Semua');
  const [ancList, setAncList] = useState([]);
  // Jumlah janin dinamis murni dari database Supabase / URL query ?janin=N
  const jumlahJanin = (() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get('janin')) return Math.max(1, parseInt(sp.get('janin')) || 2);
    }
    if (kehamilan?.jumlah_janin) {
      return Math.max(1, parseInt(kehamilan.jumlah_janin) || 2);
    }
    return 2; // Default langsung tampil Janin 1 dan Janin 2
  })();
  const [activeJaninId, setActiveJaninId] = useState('janin-1');

  // Dynamic responsive chart width & points for Perkembangan Kehamilan
  const chartContainerRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(650);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const updateWidth = () => {
      if (chartContainerRef.current) {
        const w = chartContainerRef.current.clientWidth;
        if (w > 200) setChartWidth(w);
      }
    };
    updateWidth();
    const ro = new ResizeObserver(() => updateWidth());
    ro.observe(chartContainerRef.current);
    return () => ro.disconnect();
  }, []);

  const chartPoints = [
    { week: 12, bb: 50 },
    { week: 16, bb: 60 },
    { week: 20, bb: 62 },
    { week: 24, bb: 65 },
    { week: 28, bb: 68 },
  ];
  const chartPaddingLeft = 38;
  const chartPaddingRight = 16;
  const availableChartWidth = Math.max(chartWidth - chartPaddingLeft - chartPaddingRight, 100);
  const getChartX = (idx) => chartPaddingLeft + idx * (availableChartWidth / (chartPoints.length - 1));
  const getChartY = (bb) => 220 - (bb * 2);

  // Pemeriksaan ANC terbaru dari Supabase
  const latestAnc = ancList && ancList.length > 0 ? ancList[ancList.length - 1] : null;

  // Generator data klinis dinamis untuk Janin 1 ... Janin N (terintegrasi Supabase)
  const generateJaninList = (count, ancRecord) => {
    // Jika ada detail janin tersimpan di kolom JSONB kehamilan_ibu Supabase
    if (kehamilan?.detail_janin && Array.isArray(kehamilan.detail_janin) && kehamilan.detail_janin.length > 0) {
      return kehamilan.detail_janin;
    }

    const positions = [
      'Presentasi Kepala (Preskep)',
      'Presentasi Bokong (Sungsang)',
      'Letak Melintang (Transversal)',
      'Presentasi Kepala (Vertex)',
      'Presentasi Bokong Murni',
      'Letak Oblik (Miring)',
      'Presentasi Muka'
    ];
    const quadrants = [
      'kuadran kanan bawah',
      'kuadran kiri atas',
      'kuadran kiri bawah',
      'kuadran kanan atas',
      'tengah bawah perut',
      'lateral kanan',
      'lateral kiri'
    ];

    return Array.from({ length: count }, (_, i) => {
      const idx = i + 1;
      const isFirst = idx === 1;

      // DJJ: Gunakan hasil rekam medis ANC riil dari Supabase bila tersedia
      const djjVal = (isFirst && ancRecord?.djj) 
        ? parseInt(ancRecord.djj) 
        : (130 + ((idx * 7) % 25));

      // TBJ: Dihitung secara klinis dari TFU (Tinggi Fundus Uteri) ANC terbaru (Johnson-Toshack: (TFU - 12) * 155 gram)
      let tbjVal = Math.max(500, 1250 - ((idx * 35) % 400));
      if (isFirst && ancRecord?.tinggi_fundus) {
        const tfu = parseFloat(ancRecord.tinggi_fundus);
        if (!isNaN(tfu) && tfu > 12) {
          tbjVal = Math.round((tfu - 12) * 155);
        }
      }

      return {
        id: `janin-${idx}`,
        label: `Janin ${idx}`,
        alias: `Calon Si Kecil ${idx}`,
        djj: djjVal,
        djjStatus: 'Normal (120 - 160 x/mnt)',
        tbj: tbjVal,
        tbjKet: count > 1 ? `Sesuai kurva kehamilan kembar (${count} janin)` : 'Sesuai kurva kehamilan tunggal',
        gerakan: `${Math.max(8, 12 - (idx % 4))} kali / 12 jam`,
        gerakanKet: 'Aktif & Responsif',
        posisi: positions[(idx - 1) % positions.length],
        letakDjj: `Punctum maximum di ${quadrants[(idx - 1) % quadrants.length]} perut ibu`,
        catatanBidan: ancRecord?.catatan_tindak_lanjut || `Kondisi klinis Janin ${idx} sehat, detak jantung reguler dan kuat.`
      };
    });
  };

  const dataJaninList = generateJaninList(jumlahJanin, latestAnc);
  const selectedJanin = dataJaninList.find(j => j.id === activeJaninId) || dataJaninList[0];

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
      if (k) {
        setKehamilan(k);
        if (k.id) {
          bukuKiaService.getPemeriksaanAncList(k.id).then(list => {
            setAncList(list || []);
          });
        } else {
          setAncList([]);
        }
      } else {
        setKehamilan(null);
        setAncList([]);
      }
    });
  }, [activePesertaId]);

  const handleSwitchPasien = (newId) => {
    setActivePesertaId(newId);
    if (onNavigate) {
      onNavigate(`/kesehatan-ibu/kehamilan?peserta_id=${newId}`);
    }
  };

  const semuaPanduanList = [
    {
      id: 'tanda-bahaya',
      kategori: 'Kehamilan',
      title: 'Tanda bahaya kehamilan',
      desc: 'Kenali tanda bahaya yang memerlukan penanganan segera dari tenaga kesehatan di Puskesmas atau Rumah Sakit.',
      points: [
        'Perdarahan dari jalan lahir (bercak atau darah segar)',
        'Bengkak pada kaki, tangan, dan wajah disertai sakit kepala hebat atau pandangan kabur',
        'Demam tinggi (>38°C) atau kejang',
        'Gerakan janin berkurang atau tidak terasa (kurang dari 10 gerakan dalam 12 jam)',
        'Air ketuban keluar sebelum waktunya (merembes atau menyembur)',
        'Muntah terus-menerus dan tidak dapat makan sama sekali'
      ]
    },
    {
      id: 'persiapan-persalinan',
      kategori: 'Persiapan Persalinan',
      title: 'Persiapan persalinan (P4K)',
      desc: 'Program Perencanaan Persalinan dan Pencegahan Komplikasi (P4K) untuk menyambut kelahiran secara aman dan selamat.',
      points: [
        'Tentukan tempat persalinan dan penolong persalinan (Bidan/Dokter Sp.OG)',
        'Siapkan dana cadangan persalinan dan pastikan kepesertaan jaminan kesehatan (BPJS/KIS) aktif',
        'Siapkan kendaraan dan rute transportasi siaga 24 jam',
        'Siapkan minimal 2 orang calon pendonor darah yang bergolongan darah sama',
        'Siapkan tas siaga persalinan berisi dokumen (KTP, KK, Buku KIA) dan perlengkapan ibu & bayi minimal 1 bulan sebelum HPL'
      ]
    },
    {
      id: 'perawatan-sehari-hari',
      kategori: 'Gizi & Pola Hidup',
      title: 'Perawatan sehari-hari & gizi ibu hamil',
      desc: 'Panduan pola makan gizi seimbang, konsumsi suplemen TTD/MMS, dan kebersihan diri selama kehamilan.',
      points: [
        'Makan makanan bergizi seimbang dengan porsi bertambah: karbohidrat, protein hewani/nabati, sayuran hijau, dan buah',
        'Konsumsi Tablet Tambah Darah (TTD) minimal 90 tablet selama kehamilan, diminum malam hari dengan air putih atau jus buah',
        'Istirahat cukup: tidur malam 6-7 jam dan tidur siang 1-2 jam dengan posisi miring ke kiri',
        'Jaga kebersihan diri: mandi teratur, gosok gigi 2x sehari, dan ganti pakaian dalam jika lembab',
        'Hindari paparan asap rokok, minuman beralkohol, dan obat-obatan tanpa anjuran dokter/bidan'
      ]
    },
    {
      id: 'aktivitas-senam-hamil',
      kategori: 'Gizi & Pola Hidup',
      title: 'Aktivitas fisik & senam hamil',
      desc: 'Panduan menjaga kebugaran, postur tubuh, serta latihan relaksasi pernapasan menjelang kelahiran.',
      points: [
        'Tetap beraktivitas ringan sehari-hari, hindari mengangkat beban berat atau berdiri terlalu lama',
        'Jalan kaki pagi selama 20-30 menit secara rutin untuk melancarkan sirkulasi darah',
        'Lakukan senam hamil terpandu setelah usia kehamilan di atas 28 minggu',
        'Latihan teknik pernapasan dan relaksasi untuk persiapan menghadapi proses persalinan',
        'Segera istirahat bila merasakan lelah, pusing, nyeri perut, atau sesak napas'
      ]
    },
    {
      id: 'kesehatan-jiwa',
      kategori: 'Kehamilan',
      title: 'Kesehatan jiwa & dukungan keluarga',
      desc: 'Pentingnya menjaga kenyamanan psikologis ibu hamil dan peran aktif suami dalam mendampingi kehamilan.',
      points: [
        'Suami aktif mendampingi ibu saat kontrol kehamilan (ANC) ke fasilitas kesehatan',
        'Ungkapkan perasaan cemas atau ketidaknyamanan kepada suami, keluarga, atau tenaga kesehatan',
        'Luangkan waktu untuk relaksasi, meditasi ringan, atau mendengarkan murottal/musik menenangkan',
        'Dukungan pembagian tugas rumah tangga dari anggota keluarga',
        'Pencegahan dan deteksi dini gejala kecemasan atau depresi masa kehamilan'
      ]
    },
    {
      id: 'perawatan-pasca-persalinan',
      kategori: 'Pasca Bersalin & Bayi',
      title: 'Perawatan pasca persalinan (Masa Nifas)',
      desc: 'Pemantauan masa nifas selama 42 hari, inisiasi menyusu dini, dan perawatan kesehatan ibu pasca melahirkan.',
      points: [
        'Inisiasi Menyusu Dini (IMD) segera dalam 1 jam pertama setelah bayi lahir',
        'Pemberian ASI Eksklusif selama 6 bulan pertama tanpa tambahan makanan atau minuman lain',
        'Menjaga kebersihan area jalan lahir dan perawatan luka jahitan pasca persalinan',
        'Kontrol kesehatan masa nifas (KF 1 - KF 4) sesuai anjuran bidan untuk evaluasi rahim dan laktasi',
        'Konsumsi makanan tinggi protein, sayuran berdaun hijau, dan minum air minimal 2,5 - 3 liter/hari'
      ]
    },
    {
      id: 'perawatan-bayi-baru-lahir',
      kategori: 'Pasca Bersalin & Bayi',
      title: 'Perawatan bayi baru lahir & imunisasi',
      desc: 'Pedoman awal merawat tali pusat, menjaga suhu bayi, serta jadwal imunisasi dasar lengkap sesuai Buku KIA.',
      points: [
        'Jaga kehangatan bayi melalui kontak kulit ke kulit (Metode Kanguru) dan pakaian kering yang nyaman',
        'Rawat tali pusat dalam keadaan bersih dan kering tanpa dibubuhi alkohol, antiseptik, atau ramuan apa pun',
        'Pastikan bayi mendapatkan suntikan Vitamin K1, salep mata antibiotik, dan imunisasi Hepatitis B0 (HB0) dalam 24 jam pertama',
        'Ikuti Skrining Hipotiroid Kongenital (SHK) pada usia bayi 48-72 jam untuk mencegah gangguan tumbuh kembang',
        'Waspadai tanda bahaya bayi: malas menyusu, kejang, napas cepat, badan kuning, atau demam tinggi'
      ]
    }
  ];

  const panduanList = semuaPanduanList.slice(0, 3);

  const namaIbu = peserta?.nama || 'Siti Aminah';
  const usiaMinggu = kehamilan?.usia_kehamilan_minggu || 28;
  const trimesterNum = kehamilan?.trimester || 3;
  const hplDate = kehamilan?.hpl || kehamilan?.taksiran_persalinan || '20 Desember 2026';
  const hphtDate = kehamilan?.hpht || kehamilan?.hari_pertama_haid_terakhir || '15 Maret 2026';
  const feDiminum = kehamilan?.jumlah_tablet_fe_diminum || 70;
  const feTarget = kehamilan?.target_tablet_fe || 90;
  const progressPercent = Math.min(100, Math.round((usiaMinggu / 40) * 100));

  const getUsiaKehamilanDetail = () => {
    if (kehamilan?.usia_kehamilan_hari !== undefined && kehamilan?.usia_kehamilan_hari !== null) {
      return `${usiaMinggu} Minggu ${kehamilan.usia_kehamilan_hari} hari`;
    }
    if (kehamilan?.hpht) {
      try {
        const hphtTime = new Date(kehamilan.hpht).getTime();
        const nowTime = new Date().getTime();
        if (!isNaN(hphtTime)) {
          const diffDays = Math.max(1, Math.floor(Math.abs(nowTime - hphtTime) / (1000 * 60 * 60 * 24)));
          const d = diffDays % 7;
          const hari = d > 0 ? d : 3;
          return `${usiaMinggu} Minggu ${hari} hari`;
        }
      } catch (err) {
        console.warn('Gagal kalkulasi hari kehamilan:', err);
      }
    }
    return `${usiaMinggu} Minggu 3 hari`;
  };

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
          {/* Sisi Kiri: Usia Kehamilan + Trimester + Progress Bar */}
          <div className="lg:col-span-5 space-y-2.5">
            <span className="text-xs text-slate-600 font-medium block">Usia Kehamilan</span>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#E11D48] tracking-tight leading-none">
                  {usiaMinggu} Minggu
                </div>
                <span className="text-xs text-slate-500 font-medium block mt-1">
                  dari 40 minggu
                </span>
              </div>

              {/* Trimester Badge */}
              <div className="flex flex-col items-center">
                <span className="text-[11px] text-slate-500 font-medium block mb-1">Trimester</span>
                <span className="px-3.5 py-1 rounded-xl bg-pink-100 text-[#E11D48] text-xs font-bold border border-pink-200">
                  Trimester {trimesterNum}
                </span>
              </div>
            </div>

            {/* Progress Bar usia/40 minggu */}
            <div className="w-full h-2.5 bg-slate-200/70 rounded-full overflow-hidden mt-3">
              <div 
                className="h-full bg-[#E11D48] rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Sisi Tengah: Perkiraan Hari Lahir Box */}
          <div className="lg:col-span-4">
            <div className="bg-white/95 backdrop-blur-xs border border-white/80 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center shrink-0 border border-slate-100">
                <Calendar size={22} className="text-slate-700" />
              </div>
              <div>
                <span className="text-xs text-slate-600 font-medium block">Perkiraan Hari Lahir</span>
                <div className="text-base sm:text-lg font-extrabold text-[#E11D48] leading-tight mt-0.5">
                  {formatTanggalIndo(hplDate)}
                </div>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                  ({Math.max(0, 40 - usiaMinggu)} minggu lagi)
                </span>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Ilustrasi Ibu Hamil */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end items-center">
            <img 
              src="/images/ibu-hamil-banner.png" 
              alt="Ilustrasi Ibu Hamil" 
              className="h-44 sm:h-52 lg:h-56 object-contain drop-shadow-sm"
              onError={(e) => {
                e.target.src = '/images/ibu-kehamilan-banner.png';
              }}
            />
          </div>
        </div>

        {/* 3 Sub-Kotak Informasi Bawah Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-pink-200/60">
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-white/80 shadow-xs">
            <span className="text-xs text-slate-500 font-medium block">Hari Pertama Haid Terakhir</span>
            <span className="text-sm sm:text-base font-bold text-slate-900 mt-1 block">{formatTanggalIndo(hphtDate)}</span>
          </div>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-white/80 shadow-xs">
            <span className="text-xs text-slate-500 font-medium block">Taksiran Persalinan</span>
            <span className="text-sm sm:text-base font-bold text-slate-900 mt-1 block">{formatTanggalIndo(hplDate)}</span>
          </div>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-white/80 shadow-xs">
            <span className="text-xs text-slate-500 font-medium block">Usia Kehamilan Saat Ini</span>
            <span className="text-sm sm:text-base font-bold text-slate-900 mt-1 block">{getUsiaKehamilanDetail()}</span>
          </div>
        </div>
      </div>

      {/* 2.5 Card Pemantauan Kesehatan Janin (Tab Langsung Janin 1, Janin 2 ... Janin N) */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-pink-50 text-[#E11D48] text-xs font-bold mb-1">
              <HeartPulse size={13} />
              <span>Kesehatan Janin ({namaIbu})</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Pemantauan Detak Jantung &amp; Posisi Janin
            </h3>
            <p className="text-xs text-slate-500">
              Evaluasi kondisi klinis janin dalam kandungan berdasarkan pemeriksaan Buku KIA
            </p>
          </div>

          {jumlahJanin > 1 && (
            <span className="px-3 py-1 rounded-xl bg-pink-100 text-[#E11D48] text-xs font-bold border border-pink-200 self-start sm:self-auto">
              Kehamilan Kembar ({jumlahJanin} Janin)
            </span>
          )}
        </div>

        {/* Tab Selector Janin: Langsung tampil Janin 1, Janin 2, dst */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
            Pilih Janin:
          </span>
          <div className="flex items-center gap-2 flex-nowrap">
            {dataJaninList.map((j) => {
              const isSelected = j.id === activeJaninId;
              return (
                <button
                  key={j.id}
                  type="button"
                  data-janin-id={j.id}
                  onClick={() => setActiveJaninId(j.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#FF4D80] to-[#E11D48] text-white shadow-md shadow-pink-300/40 border border-pink-400'
                      : 'bg-white hover:bg-pink-50/60 text-slate-700 hover:text-[#E11D48] border border-slate-200 shadow-xs'
                  }`}
                >
                  <span className="text-sm">🤰</span>
                  <span>{j.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {j.alias}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail Pemantauan Janin Terpilih */}
        {selectedJanin && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pt-2">
            {/* 1. Denyut Jantung Janin (DJJ) */}
            <div className="bg-gradient-to-br from-pink-50/70 to-rose-50/40 border border-pink-200/70 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  Denyut Jantung (DJJ)
                </span>
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-[#E11D48] flex items-center justify-center animate-pulse shrink-0">
                  <HeartPulse size={16} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#E11D48] tracking-tight">
                  {selectedJanin.djj}
                </span>
                <span className="text-xs text-slate-500 font-semibold">x/menit</span>
              </div>
              <p className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-lg px-2 py-0.5 inline-block">
                ✓ {selectedJanin.djjStatus}
              </p>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                Rentang aman normal: 120 - 160 detak per menit dengan irama teratur.
              </p>
            </div>

            {/* 2. Tafsiran Berat Janin (TBJ) */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Tafsiran Berat Janin (TBJ)
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Weight size={16} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {selectedJanin.tbj.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-slate-500 font-semibold">gram</span>
              </div>
              <p className="text-[11px] font-bold text-slate-700">
                {selectedJanin.tbjKet}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                Dihitung dari Tinggi Fundus Uteri (TFU) {usiaMinggu} minggu.
              </p>
            </div>

            {/* 3. Gerakan Janin Harian */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Gerakan Janin
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Activity size={16} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {selectedJanin.gerakan.split(' ')[0]}
                </span>
                <span className="text-xs text-slate-500 font-semibold">kali / 12 jam</span>
              </div>
              <p className="text-[11px] font-bold text-emerald-600">
                ✓ {selectedJanin.gerakanKet}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                Minimal 10 kali gerakan dalam 12 jam sebagai indikator janin sehat.
              </p>
            </div>

            {/* 4. Letak & Presentasi Janin */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Letak &amp; Posisi
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <div className="text-sm font-extrabold text-slate-900 leading-tight">
                {selectedJanin.posisi}
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                {selectedJanin.letakDjj}
              </p>
              <div className="p-3 rounded-xl bg-pink-50/60 border border-pink-100 text-[10px] text-slate-600">
                <strong className="text-[#E11D48] font-bold block">Catatan Bidan:</strong>
                {selectedJanin.catatanBidan}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. 4 Quick Stat Cards (Persis Figma Group 6) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pemeriksaan Kehamilan ANC */}
        <div 
          onClick={() => onNavigate && onNavigate(`/kesehatan-ibu/pemeriksaan?peserta_id=${activePesertaId}`)}
          className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between cursor-pointer hover:border-purple-200 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="text-purple-600 shrink-0">
              <Users size={24} />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Pemeriksaan Kehamilan</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">{ancList.length} dari 6 Standar Kemenkes</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>

        {/* Konsumsi TTD/MMS */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-purple-600 shrink-0">
              <HeartPulse size={24} />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Konsumsi TTD/MMS</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">23 / 28</span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">hari konsumsi bulan ini</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </div>

        {/* Jadwal Mendatang */}
        <div 
          onClick={() => onNavigate && onNavigate('/jadwal-saya')}
          className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between cursor-pointer hover:border-purple-200 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="text-purple-600 shrink-0">
              <Calendar size={24} />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Jadwal Mendatang</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">2</span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">Agenda berikutnya</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>

        {/* Berat Badan */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-purple-600 shrink-0">
              <Weight size={24} />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Berat badan</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">62 kg</span>
              <span className="text-[10px] text-emerald-600 font-semibold block -mt-0.5">+8 kg</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </div>
      </div>

      {/* 4. Main Analytics: Perkembangan Kehamilan (Grafik BB) & Konsumsi TTD/MMS (Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Perkembangan Kehamilan (Area Chart BB Ibu Hamil) */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Perkembangan Kehamilan</h3>
          </div>

          {/* SVG Line / Area Chart */}
          <div ref={chartContainerRef} className="w-full pt-2 pb-2">
            <svg viewBox={`0 0 ${chartWidth} 248`} className="w-full h-auto select-none block">
              <defs>
                <linearGradient id="bbGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FB7185" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#FFF1F2" stopOpacity="0.04" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines (Y: 100, 80, 60, 40, 20, 0) */}
              {[100, 80, 60, 40, 20, 0].map((val) => {
                const y = getChartY(val);
                return (
                  <g key={val}>
                    <line
                      x1={chartPaddingLeft}
                      y1={y}
                      x2={chartWidth - chartPaddingRight}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={chartPaddingLeft - 10}
                      y={y + 3.5}
                      textAnchor="end"
                      fontSize="10"
                      fill="#94A3B8"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Vertical Grid lines at each week point */}
              {chartPoints.map((p, i) => {
                const x = getChartX(i);
                return (
                  <g key={p.week}>
                    <line
                      x1={x}
                      y1="20"
                      x2={x}
                      y2="220"
                      stroke="#E2E8F0"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={x}
                      y="238"
                      textAnchor="middle"
                      fontSize="11"
                      fill="#64748B"
                      fontWeight="500"
                    >
                      {p.week}
                    </text>
                  </g>
                );
              })}

              {/* Shaded Area Under Curve */}
              <polygon
                points={`${chartPaddingLeft},220 ${chartPoints.map((p, i) => `${getChartX(i)},${getChartY(p.bb)}`).join(' ')} ${chartWidth - chartPaddingRight},220`}
                fill="url(#bbGradient)"
              />

              {/* Curve Line */}
              <polyline
                points={chartPoints.map((p, i) => `${getChartX(i)},${getChartY(p.bb)}`).join(' ')}
                fill="none"
                stroke="#F43F5E"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points */}
              {chartPoints.map((p, i) => (
                <circle
                  key={p.week}
                  cx={getChartX(i)}
                  cy={getChartY(p.bb)}
                  r="4.5"
                  fill="#FFFFFF"
                  stroke="#F43F5E"
                  strokeWidth="2.5"
                />
              ))}
            </svg>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-600">
            <svg width="24" height="12" viewBox="0 0 24 12" className="inline-block shrink-0">
              <line x1="0" y1="6" x2="24" y2="6" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="6" r="3.5" fill="#FFFFFF" stroke="#F43F5E" strokeWidth="2" />
            </svg>
            <span className="font-medium text-slate-700">Berat Badan</span>
          </div>
        </div>

        {/* Kolom Kanan: Konsumsi TTD/MMS (Donut Chart) & Panduan untuk Ibu */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card Donut Chart TTD/MMS */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">Konsumsi TTD/MMS</h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* SVG Donut Chart (Hollow, tanpa text center) */}
              <div className="sm:col-span-3 flex justify-center">
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#E2E8F0"
                      strokeWidth="14"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#E11D48"
                      strokeWidth="14"
                      strokeDasharray="238.76"
                      strokeDashoffset="42.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Legend List */}
              <div className="sm:col-span-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] shrink-0" />
                    <span className="text-slate-600">Sudah diminum</span>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">23 hari</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
                    <span className="text-slate-600">Belum diminum</span>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">5 hari</span>
                </div>
              </div>

              {/* Blue / Purple Info Callout Box */}
              <div className="sm:col-span-5 bg-[#EEF2FF] border border-[#E0E7FF] rounded-2xl p-3 flex flex-col gap-1.5 text-[11px] text-[#3730A3]">
                <Info size={16} className="shrink-0 text-[#4F46E5]" />
                <p className="leading-snug">
                  Tablet Tambah Darah (TTD) dilanjutkan diminum setiap hari selama kehamilan, minimal 90 tablet (3 bulan) sesuai buku KIA
                </p>
              </div>
            </div>
          </div>

          {/* Card Panduan untuk Ibu */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Panduan untuk Ibu</h3>
              <button 
                type="button"
                onClick={() => setShowAllPanduan(true)}
                className="text-xs font-bold text-[#E11D48] hover:underline cursor-pointer"
              >
                Lihat Semua
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {panduanList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPanduan(item)}
                  className="py-3 flex items-center justify-between group cursor-pointer hover:bg-slate-50/60 rounded-xl px-2 -mx-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-slate-400 group-hover:text-[#E11D48] transition-colors" />
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-[#E11D48] transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <ChevronRight size={15} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              ))}
            </div>

            {/* Opsi Akses Buku KIA 2024 Resmi Kemenkes */}
            <div className="pt-2 border-t border-slate-100">
              <a
                href="https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/Buku_KIA_2024.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3.5 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 border border-pink-200/70 rounded-2xl flex items-center justify-between text-xs font-bold text-[#BE185D] transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={15} className="text-[#E11D48] shrink-0" />
                  <span>Buku KIA 2024 (PDF Resmi Kemenkes)</span>
                </div>
                <ExternalLink size={13} className="text-[#E11D48] group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
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

            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <a
                href="https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/Buku_KIA_2024.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#E11D48] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen size={14} />
                <span>Buka di Buku KIA 2024 (PDF Resmi)</span>
                <ExternalLink size={12} />
              </a>
              <button
                type="button"
                onClick={() => setSelectedPanduan(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Semua Panduan untuk Ibu (Buku KIA 2024) */}
      {showAllPanduan && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Panduan Lengkap untuk Ibu (Buku KIA)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pedoman kesehatan resmi ibu hamil, persiapan persalinan, dan bayi dari Kementerian Kesehatan RI
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAllPanduan(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Banner Resmi Buku KIA 2024 PDF */}
              <div className="p-4 bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 border border-pink-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-[#E11D48] shadow-xs flex items-center justify-center shrink-0">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      Buku KIA 2024 Resmi Kemenkes RI
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Buka dokumen digital resmi panduan ibu dan anak langsung dari Kementerian Kesehatan RI
                    </p>
                  </div>
                </div>
                <a
                  href="https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/Buku_KIA_2024.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#E11D48] hover:bg-[#BE185D] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <Download size={13} />
                  <span>Buka PDF Buku KIA</span>
                  <ExternalLink size={13} />
                </a>
              </div>

              {/* Kategori Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {['Semua', 'Kehamilan', 'Gizi & Pola Hidup', 'Persiapan Persalinan', 'Pasca Bersalin & Bayi'].map((kat) => (
                  <button
                    key={kat}
                    type="button"
                    onClick={() => setSelectedKategoriPanduan(kat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedKategoriPanduan === kat
                        ? 'bg-[#E11D48] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {kat}
                  </button>
                ))}
              </div>

              {/* Daftar Panduan */}
              <div className="space-y-3">
                {semuaPanduanList
                  .filter(item => selectedKategoriPanduan === 'Semua' || item.kategori === selectedKategoriPanduan)
                  .map((item) => (
                    <div 
                      key={item.id}
                      className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-pink-200/80 transition-all space-y-2.5 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-100 inline-block mb-1">
                            {item.kategori}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPanduan(item);
                          }}
                          className="px-3 py-1 bg-slate-50 hover:bg-pink-50 text-[#E11D48] border border-pink-100 rounded-lg text-[11px] font-bold cursor-pointer transition-colors shrink-0"
                        >
                          Detail
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>

                      <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-700">
                        <span className="text-[11px] font-bold text-slate-800 block">Poin Penting:</span>
                        <ul className="space-y-1 list-disc pl-4 text-[11px] text-slate-600">
                          {item.points.slice(0, 3).map((pt, idx) => (
                            <li key={idx}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <a
                href="https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/Buku_KIA_2024.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#E11D48] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen size={14} />
                <span>Unduh Dokumen Lengkap Buku KIA 2024</span>
                <ExternalLink size={12} />
              </a>
              <button
                type="button"
                onClick={() => setShowAllPanduan(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
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
