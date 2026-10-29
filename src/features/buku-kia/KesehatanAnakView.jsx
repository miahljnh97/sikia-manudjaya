import React, { useState, useEffect, useRef } from 'react';
import { 
  Weight,
  ShoppingBasket,
  Scale, 
  Ruler, 
  Smile, 
  ShoppingBag, 
  Calendar, 
  BarChart3, 
  History, 
  Target, 
  ChevronRight, 
  CheckCircle2, 
  Zap, 
  BookOpen, 
  Footprints, 
  Boxes,
  Syringe,
  Activity,
  X,
  Users,
  Plus,
  Heart,
  User,
  ShieldCheck,
  FileText,
  Baby,
  AlertCircle,
  ExternalLink,
  Download,
  Clock,
  AlertTriangle,
  Check,
  ClipboardCheck,
  BarChart2,
  Puzzle
} from 'lucide-react';

function HeightMeasureIcon({ size = 20, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M6 4h12" />
      <path d="M6 20h12" />
      <path d="M12 4v16" />
      <path d="M9 12h6" />
    </svg>
  );
}

function WalkingIcon({ size = 20, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7z"/>
    </svg>
  );
}

function BalokLegoIcon({ size = 20, className = '' }) {
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
      <path d="M2.5 13.5L12 8l9.5 5.5-9.5 5.5z" />
      <path d="M2.5 13.5v4L12 23v-4" />
      <path d="M21.5 13.5v4L12 23" />
      <ellipse cx="8" cy="11" rx="2" ry="1.2" />
      <ellipse cx="12" cy="13" rx="2" ry="1.2" />
      <ellipse cx="16" cy="15" rx="2" ry="1.2" />
    </svg>
  );
}
import { bukuKiaService } from '../../services/bukuKiaService';
import { pesertaService } from '../../services/pesertaService';
import { maskNik } from '../../utils/nikUtils';
import { hitungUsiaString } from '../../utils/dateUtils';
import { getPesertaIdFromUser } from '../../models/pesertaModel';

export default function KesehatanAnakView({ subFeature = 'Pertumbuhan', user, currentPath = '', onNavigate, onShowToast }) {
  const roleStr = (user?.role || '').toLowerCase().trim();
  const emailStr = (user?.email || user?.user?.email || '').toLowerCase().trim();
  const isPetugas = roleStr.includes('kader') || roleStr.includes('bidan') || roleStr.includes('admin') || emailStr.includes('kader') || emailStr.includes('bidan') || emailStr.includes('admin');
  const isIbuRole = !isPetugas;

  const formatTanggalIndo = (dateStr) => {
    if (!dateStr) return '-';
    if (typeof dateStr === 'string' && /[a-zA-Z]/.test(dateStr) && dateStr.includes(' ')) {
      return dateStr;
    }
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const bulanList = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      return `${d.getDate()} ${bulanList[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  // Helper ekstrak anak_id dari URL query string (?anak_id=... atau path segment)
  const extractAnakId = () => {
    if (typeof window !== 'undefined' && window.location.search) {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get('anak_id')) return sp.get('anak_id');
      if (sp.get('id')) return sp.get('id');
    }
    if (currentPath && currentPath.includes('?')) {
      const sp = new URLSearchParams(currentPath.split('?')[1]);
      if (sp.get('anak_id')) return sp.get('anak_id');
      if (sp.get('id')) return sp.get('id');
    }
    if (currentPath) {
      const segments = currentPath.split('?')[0].split('/').filter(Boolean);
      const last = segments[segments.length - 1];
      if (last && last.includes('-') && last.length >= 20) return last;
    }
    return null; // dynamic default from list
  };

  // Helper standar faskes/posyandu untuk bayi baru lahir yang belum dinamai (By. Ny. [Nama Ibu] 1 / 2)
  const formatNamaAnak = (anakObj, index = 0) => {
    if (anakObj?.nama && anakObj.nama.trim()) {
      const lower = anakObj.nama.toLowerCase().trim();
      if (!lower.startsWith('anak ') && lower !== 'anak') {
        return anakObj.nama;
      }
    }
    const ibuNama = user?.nama ? user.nama.split(',')[0].trim() : 'Ibu';
    return `By. Ny. ${ibuNama} ${index + 1}`;
  };

  const [activeSub, setActiveSub] = useState(subFeature);
  const [activeChartTab, setActiveChartTab] = useState('Berat Badan');
  const [selectedStimulasi, setSelectedStimulasi] = useState(null);
  const [daftarAnak, setDaftarAnak] = useState([]);
  const [activeAnakId, setActiveAnakId] = useState(extractAnakId);
  const [activeAnak, setActiveAnak] = useState(null);

  // Dynamic responsive chart width & points for Grafik Pertumbuhan
  const chartContainerRef1 = useRef(null);
  const chartContainerRef2 = useRef(null);
  const [chartWidth, setChartWidth] = useState(650);

  useEffect(() => {
    const updateWidth = () => {
      const el = chartContainerRef1.current || chartContainerRef2.current;
      if (el && el.clientWidth > 200) {
        setChartWidth(el.clientWidth);
      }
    };
    updateWidth();
    const ro = new ResizeObserver(() => updateWidth());
    if (chartContainerRef1.current) ro.observe(chartContainerRef1.current);
    if (chartContainerRef2.current) ro.observe(chartContainerRef2.current);
    return () => ro.disconnect();
  }, [activeSub]);

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

  useEffect(() => {
    if (subFeature) {
      setActiveSub(subFeature);
    }
  }, [subFeature]);

  // Sinkronkan saat URL berubah (Back/Forward browser)
  useEffect(() => {
    const urlId = extractAnakId();
    if (urlId && urlId !== activeAnakId) {
      setActiveAnakId(urlId);
    }
  }, [currentPath]);

  // Load daftar anak untuk dropdown selector Bidan/Kader atau anak milik ibu login
  useEffect(() => {
    const email = (user?.user?.email || user?.email || '').toLowerCase().trim();
    const nama = (user?.nama || '').toLowerCase().trim();
    const userRole = (user?.role || '').toLowerCase().trim();
    const isIbuBalitaOnly = userRole === 'ibu balita' || email === 'ibu.balita@manudjaya.id' || (email.includes('balita') && !email.includes('hamil'));
    const isIbuHamilOnly = userRole === 'ibu hamil' || email === 'ibu.hamil@manudjaya.id' || (email.includes('hamil') && !email.includes('anak') && !email.includes('balita'));
    const isIbuHamilBalita = userRole === 'ibu hamil & balita' || email === 'ibu.hamil.anak@manudjaya.id' || email.includes('hamil.anak') || (!isIbuBalitaOnly && !isIbuHamilOnly);

    // Jika akun Ibu Hamil Saja (Najwa Sihab), belum memiliki anak terdaftar di sistem
    if (isIbuRole && isIbuHamilOnly) {
      setDaftarAnak([]);
      setActiveAnak(null);
      setActiveAnakId(null);
      return;
    }

    const targetIbuId = isIbuRole ? (getPesertaIdFromUser(user) || (isIbuBalitaOnly ? 'd5eeb9a6-3509-44ec-8fce-e95f3edd1a73' : '55af67c9-6695-4435-b4ea-2720efd73c92')) : null;

    bukuKiaService.getDaftarAnak(targetIbuId).then(list => {
      if (list && list.length > 0) {
        let myChildren = list;
        if (isIbuRole) {
          myChildren = list.filter(c => !c.ibu_id || String(c.ibu_id) === String(targetIbuId));
        }
        const effectiveList = (isIbuRole && myChildren.length > 0) ? myChildren : (isIbuRole ? [] : list);
        if (effectiveList.length > 0) {
          setDaftarAnak(effectiveList);
          const urlId = extractAnakId();
          const cur = (urlId ? effectiveList.find(a => String(a.id) === String(urlId)) : null) || effectiveList[0];
          setActiveAnak(cur);
          setActiveAnakId(cur.id);
        } else {
          setDaftarAnak([]);
          setActiveAnak(null);
          setActiveAnakId(null);
        }
      } else {
        setDaftarAnak([]);
        setActiveAnak(null);
        setActiveAnakId(null);
      }
    });
  }, [user]);

  // Handler pergantian anak (Membawa anak_id unik dan reset state async seketika)
  const handleSwitchAnak = (newId) => {
    if (!newId || newId === activeAnakId) return;
    
    // 1. Reset state data async anak sebelumnya agar tidak terjadi UI leak
    setRiwayatPertumbuhan([]);
    setDaftarImunisasi([]);
    setPencapaianMilestones([]);
    
    // 2. Set ID dan objek anak aktif
    setActiveAnakId(newId);
    const found = daftarAnak.find(a => String(a.id) === String(newId));
    if (found) setActiveAnak(found);
    
    // 3. Update URL dengan parameter ?anak_id=<id>
    if (onNavigate) {
      const subMap = {
        'Profil Anak': 'profil',
        'Pertumbuhan': 'pertumbuhan',
        'Perkembangan': 'perkembangan',
        'Imunisasi': 'imunisasi',
        'Pemeriksaan Anak': 'pemeriksaan'
      };
      const seg = subMap[activeSub] || 'profil';
      onNavigate(`/kesehatan-anak/${seg}?anak_id=${newId}`);
    }
  };

  const defaultMilestones = [
    { title: 'Duduk tanpa Bantuan', usia: 'Usia 6 Bulan', tanggal: '20 Feb 2026' },
    { title: 'Merangkak', usia: 'Usia 6 Bulan', tanggal: '20 Feb 2026' },
    { title: 'Berdiri dengan berpegangan', usia: 'Usia 6 Bulan', tanggal: '20 Feb 2026' },
    { title: 'Berjalan beberapa langkah', usia: 'Usia 12 Bulan', tanggal: '20 Feb 2026' }
  ];

  // Data Pencapaian Perkembangan dinamis dari Supabase
  const [pencapaianMilestones, setPencapaianMilestones] = useState(defaultMilestones);

  useEffect(() => {
    if (!activeAnakId) {
      setPencapaianMilestones(defaultMilestones);
      return;
    }
    bukuKiaService.getPerkembanganAnakList(activeAnakId).then((res) => {
      if (res && res.length > 0) {
        setPencapaianMilestones(res.map(m => ({
          title: m.judul_milestone || m.tahap_perkembangan,
          usia: m.usia_pencapaian || m.tahap_perkembangan || 'Sesuai Usia',
          tanggal: m.tanggal_tercapai || '20 Feb 2026',
          status: m.status_perkembangan || m.status || 'Sesuai Usia'
        })));
      } else {
        setPencapaianMilestones(defaultMilestones);
      }
    });
  }, [activeAnakId]);

  // Data Aktivitas Stimulasi Rekomendasi (Image 1)
  const aktivitasStimulasi = [
    {
      title: 'Latihan Berjalan',
      desc: 'Ajak anak berjalan dengan bantuan di lingkungan aman.',
      icon: WalkingIcon,
      detail: 'Pegang kedua tangan anak dari depan secara perlahan, biarkan ia melangkah di atas lantai datar tanpa alas kaki untuk melatih keseimbangan dan kekuatan otot kaki.'
    },
    {
      title: 'Membaca Buku Bergambar',
      desc: 'Meningkatkan kemampuan bahasa dan komunikasi',
      icon: BookOpen,
      detail: 'Tunjukkan gambar-gambar hewan atau benda sehari-hari dengan warna kontras, sebutkan namanya dengan intonasi jelas dan ajak anak menirukan bunyi atau suaranya.'
    },
    {
      title: 'Bermain Balok',
      desc: 'Melatih motorik halus dan koordinasi tangan mata',
      icon: BalokLegoIcon,
      detail: 'Sediakan balok susun berukuran aman (tidak tertelan). Ajarkan cara menumpuk 2-3 balok ke atas dan biarkan anak merubuhkannya dengan gembira.'
    }
  ];

  // State & Data Riwayat Pertumbuhan (PBI 02C & AC 1)
  const [isModalKmsOpen, setIsModalKmsOpen] = useState(false);
  const [isSubmittingKms, setIsSubmittingKms] = useState(false);

  // States untuk Modal Jadwal Imunisasi Lengkap & Tips KIPI Buku KIA
  const [showAllPencapaian, setShowAllPencapaian] = useState(false);
  const [filterKpspKategori, setFilterKpspKategori] = useState('Semua');
  const [showAllJadwalImunisasi, setShowAllJadwalImunisasi] = useState(false);
  const [showAllTipsImunisasi, setShowAllTipsImunisasi] = useState(false);
  const [filterStatusJadwal, setFilterStatusJadwal] = useState('Semua');
  const [filterKategoriTips, setFilterKategoriTips] = useState('Semua');
  const [selectedVaksinDetail, setSelectedVaksinDetail] = useState(null);

  const tipsKipiList = [
    {
      id: 'tip-1',
      kategori: 'Perawatan di Rumah',
      title: 'Berikan ASI Lebih Sering (On Demand)',
      ringkasan: 'Membantu menenangkan anak dan mencegah dehidrasi.',
      detail: 'Berikan ASI atau cairan lebih sering sesuka bayi. ASI mengandung zat anti-infeksi dan memberikan rasa aman terbaik yang efektif menenangkan bayi saat merasa nyeri atau gelisah pasca vaksinasi.',
      urgensi: 'Sangat Dianjurkan'
    },
    {
      id: 'tip-2',
      kategori: 'Perawatan di Rumah',
      title: 'Kompres Dingin Pada Area Bekas Suntikan',
      ringkasan: 'Meredakan bengkak, kemerahan, dan rasa nyeri lokal.',
      detail: 'Jika area suntikan di paha atau lengan tampak merah, hangat, atau bengkak, kompreslah dengan kain bersih yang dibasahi air dingin atau air biasa selama 10-15 menit. PENTING: Jangan memijat, mengurut, atau mengoleskan ramuan tradisional pada bekas suntikan.',
      urgensi: 'Dianjurkan'
    },
    {
      id: 'tip-3',
      kategori: 'Perawatan di Rumah',
      title: 'Kompres Air Hangat Bila Anak Demam',
      ringkasan: 'Membantu menurunkan suhu tubuh secara bertahap.',
      detail: 'Bila anak mengalami demam (suhu > 37,5°C), kompres dahi, leher, ketiak, atau lipatan paha anak dengan kain bersih yang dibasahi air hangat (bukan air dingin atau alkohol). Kompres hangat membantu pembuluh darah melebar sehingga panas tubuh keluar lebih cepat.',
      urgensi: 'Dianjurkan'
    },
    {
      id: 'tip-4',
      kategori: 'Perawatan di Rumah',
      title: 'Gunakan Pakaian Tipis dan Longgar',
      ringkasan: 'Mencegah terperangkapnya panas di dalam tubuh anak.',
      detail: 'Pakaikan pakaian berbahan katun yang longgar, tipis, dan menyerap keringat. Jangan membungkus anak dengan selimut atau jaket tebal saat demam karena dapat memicu kenaikan suhu tubuh mendadak.',
      urgensi: 'Dianjurkan'
    },
    {
      id: 'tip-5',
      kategori: 'Perawatan di Rumah',
      title: 'Berikan Obat Penurun Panas Sesuai Dosis',
      ringkasan: 'Gunakan parasetamol drop/sirup sesuai resep tenaga kesehatan.',
      detail: 'Bila suhu anak mencapai > 38°C atau anak sangat rewel dan tidak nyaman, berikan parasetamol sesuai dosis yang telah dianjurkan oleh bidan atau dokter saat imunisasi. Jangan melebihi dosis anjuran dan perhatikan jarak pemberian minimal 4-6 jam.',
      urgensi: 'Bila Diperlukan'
    },
    {
      id: 'tip-6',
      kategori: 'Reaksi Normal',
      title: 'Demam Ringan (Sumer-sumer) 1-2 Hari',
      ringkasan: 'Tanda alami sistem kekebalan tubuh sedang aktif membentuk antibodi.',
      detail: 'Demam ringan pasca imunisasi (terutama setelah DPT atau Campak) adalah reaksi normal yang menandakan tubuh anak sedang merespons vaksin untuk membentuk kekebalan jangka panjang. Umumnya berlangsung 24 hingga 48 jam.',
      urgensi: 'Reaksi Normal'
    },
    {
      id: 'tip-7',
      kategori: 'Reaksi Normal',
      title: 'Kemerahan dan Benjolan Kecil di Tempat Suntik',
      ringkasan: 'Reaksi jaringan lokal yang akan hilang dengan sendirinya.',
      detail: 'Bercak kemerahan atau benjolan kecil teraba keras di tempat suntik adalah reaksi lokal yang sering terjadi. Biasanya akan mengecil dan hilang dengan sendirinya dalam waktu 1-2 minggu tanpa pengobatan khusus.',
      urgensi: 'Reaksi Normal'
    },
    {
      id: 'tip-8',
      kategori: 'Tanda Bahaya KIPI',
      title: 'Demam Tinggi Di Atas 39°C',
      ringkasan: 'Demam tinggi yang tidak kunjung turun setelah diberi obat.',
      detail: 'Jika suhu tubuh anak melebihi 39°C dan tidak turun meskipun sudah diberikan parasetamol dan kompres, segera bawa anak ke Puskesmas Manud Jaya atau fasilitas kesehatan terdekat.',
      urgensi: 'BAHAYA / SEGERA KE FASKES'
    },
    {
      id: 'tip-9',
      kategori: 'Tanda Bahaya KIPI',
      title: 'Menangis Melengking Tanpa Henti (> 3 Jam)',
      ringkasan: 'Persistent crying yang tidak dapat ditenangkan sama sekali.',
      detail: 'Anak menangis terus-menerus dengan nada melengking tinggi (inconsolable crying) lebih dari 3 jam berturut-turut meskipun sudah digendong, disusui, dan diberi pereda nyeri.',
      urgensi: 'BAHAYA / SEGERA KE FASKES'
    },
    {
      id: 'tip-10',
      kategori: 'Tanda Bahaya KIPI',
      title: 'Kejang, Anak Lemas Terkulai, atau Sesak Napas',
      ringkasan: 'Tanda kegawatdaruratan alergi berat (anafilaktik) atau neurologis.',
      detail: 'Terjadi kejang demam, anak terkulai lemas dan tidak merespon saat dipanggil, bibir/kelopak mata membengkak hebat, atau tampak sesak napas. SEGERA bawa ke IGD rumah sakit terdekat!',
      urgensi: 'DARURAT / IGD 24 JAM'
    }
  ];

  const getChecklistKpspLengkap = () => {
    const masterKpsp = [
      {
        id: 'kpsp-mk-1',
        title: 'Duduk Tanpa Bantuan',
        kategori: 'Motorik Kasar',
        usia: 'Usia 6 Bulan',
        tanggal: '20 Jan 2026',
        status: 'Tercapai',
        deskripsi: 'Bayi dapat duduk tegak sendiri di lantai tanpa disangga bantal atau dipegangi selama minimal 60 detik.'
      },
      {
        id: 'kpsp-mh-1',
        title: 'Meraih & Memegang Benda dengan Seluruh Jari',
        kategori: 'Motorik Halus',
        usia: 'Usia 6 Bulan',
        tanggal: '18 Jan 2026',
        status: 'Tercapai',
        deskripsi: 'Bayi aktif mengulurkan tangan meraih mainan atau benda yang didekatkan dan menggenggamnya erat.'
      },
      {
        id: 'kpsp-bb-1',
        title: 'Mengoceh Mengulang Suku Kata (Ba-ba, Da-da, Ma-ma)',
        kategori: 'Bicara & Bahasa',
        usia: 'Usia 6 Bulan',
        tanggal: '25 Jan 2026',
        status: 'Tercapai',
        deskripsi: 'Bayi mampu mengeluarkan suara bersuara konsonan dan vokal berulang saat diajak berkomunikasi.'
      },
      {
        id: 'kpsp-sm-1',
        title: 'Tersenyum Spontan & Bermain Cilukba',
        kategori: 'Sosialisasi & Kemandirian',
        usia: 'Usia 6 Bulan',
        tanggal: '10 Feb 2026',
        status: 'Tercapai',
        deskripsi: 'Bayi gembira dan tersenyum spontan melihat wajah orang tua atau saat diajak bermain cilukba.'
      },
      {
        id: 'kpsp-mk-2',
        title: 'Merangkak Menjelajah Ruangan',
        kategori: 'Motorik Kasar',
        usia: 'Usia 8 Bulan',
        tanggal: '15 Mar 2026',
        status: 'Tercapai',
        deskripsi: 'Bayi merangkak maju dengan bertumpu pada kedua tangan dan lutut untuk bergerak mengambil mainan.'
      },
      {
        id: 'kpsp-mh-2',
        title: 'Menjepit Benda Kecil dengan Ibu Jari dan Telunjuk (Pincer Grasp)',
        kategori: 'Motorik Halus',
        usia: 'Usia 9 Bulan',
        tanggal: '12 Apr 2026',
        status: 'Tercapai',
        deskripsi: 'Bayi mampu memungut kismis atau remah biskuit menggunakan ujung ibu jari dan telunjuk secara presisi.'
      },
      {
        id: 'kpsp-bb-2',
        title: 'Menoleh dan Menanggapi Saat Namanya Dipanggil',
        kategori: 'Bicara & Bahasa',
        usia: 'Usia 9 Bulan',
        tanggal: '20 Apr 2026',
        status: 'Tercapai',
        deskripsi: 'Bayi langsung menolehkan kepala ke arah suara saat namanya dipanggil lembut dari sisi samping/belakang.'
      },
      {
        id: 'kpsp-sm-2',
        title: 'Melambaikan Tangan (Dadah / Bye-bye)',
        kategori: 'Sosialisasi & Kemandirian',
        usia: 'Usia 9 Bulan',
        tanggal: '02 Mei 2026',
        status: 'Tercapai',
        deskripsi: 'Bayi mampu menirukan gerakan melambaikan tangan saat seseorang berpamitan.'
      },
      {
        id: 'kpsp-mk-3',
        title: 'Berdiri Berpegangan pada Perabotan (Cruising)',
        kategori: 'Motorik Kasar',
        usia: 'Usia 10 Bulan',
        tanggal: '10 Mei 2026',
        status: 'Tercapai',
        deskripsi: 'Bayi dapat menarik tubuhnya ke posisi berdiri dengan berpegangan pada kursi, meja, atau tempat tidur.'
      },
      {
        id: 'kpsp-mk-4',
        title: 'Berjalan Beberapa Langkah Tanpa Bantuan',
        kategori: 'Motorik Kasar',
        usia: 'Usia 12 Bulan',
        tanggal: '22 Jul 2026',
        status: 'Tercapai',
        deskripsi: 'Anak mampu melangkah 2 hingga 5 langkah sendiri di lantai seimbang tanpa terjatuh.'
      },
      {
        id: 'kpsp-mh-3',
        title: 'Menumpuk 2 Balok Mainan',
        kategori: 'Motorik Halus',
        usia: 'Usia 12 Bulan',
        tanggal: '05 Agu 2026',
        status: 'Tercapai',
        deskripsi: 'Anak dapat menaruh satu balok mainan di atas balok lain tanpa menjatuhkannya.'
      },
      {
        id: 'kpsp-bb-3',
        title: 'Mengucapkan 1-2 Kata Bermakna (Selain Mama/Papa)',
        kategori: 'Bicara & Bahasa',
        usia: 'Usia 12 Bulan',
        tanggal: '14 Jul 2026',
        status: 'Tercapai',
        deskripsi: 'Anak dapat mengucapkan kata bermakna seperti "mimi", "mau", atau "bol" untuk merujuk objek tertentu.'
      },
      {
        id: 'kpsp-sm-3',
        title: 'Menunjukkan Keinginan dengan Menunjuk Jari & Minum dari Cangkir',
        kategori: 'Sosialisasi & Kemandirian',
        usia: 'Usia 12 Bulan',
        tanggal: '18 Jul 2026',
        status: 'Tercapai',
        deskripsi: 'Anak mengarahkan jari telunjuknya ke arah mainan/makanan yang diinginkan dan dapat memegang cangkir minum sendiri.'
      },
      {
        id: 'kpsp-mk-5',
        title: 'Membungkuk Mengambil Mainan Lalu Berdiri Tegak Kembali',
        kategori: 'Motorik Kasar',
        usia: 'Usia 15 Bulan',
        tanggal: 'Terjadwal Skrining Berikutnya',
        status: 'Dalam Pemantauan',
        deskripsi: 'Anak membungkuk memungut benda di lantai tanpa berpegangan dan kembali berdiri tegak dengan seimbang.'
      },
      {
        id: 'kpsp-mh-4',
        title: 'Memasukkan Benda Kecil ke Dalam Lubang / Botol',
        kategori: 'Motorik Halus',
        usia: 'Usia 15 Bulan',
        tanggal: 'Terjadwal Skrining Berikutnya',
        status: 'Dalam Pemantauan',
        deskripsi: 'Anak mampu memasukkan koin mainan atau bola kecil ke dalam wadah atau celengan dengan sengaja.'
      },
      {
        id: 'kpsp-bb-4',
        title: 'Memahami Perintah Sederhana Tanpa Isyarat Tubuh',
        kategori: 'Bicara & Bahasa',
        usia: 'Usia 15 Bulan',
        tanggal: 'Terjadwal Skrining Berikutnya',
        status: 'Dalam Pemantauan',
        deskripsi: 'Anak mengerti dan menjalankan instruksi pendek seperti "Bawa bolanya ke sini" atau "Ambil sepatumu".'
      }
    ];

    if (pencapaianMilestones && pencapaianMilestones.length > 0) {
      return masterKpsp.map(item => {
        const matched = pencapaianMilestones.find(p => 
          (p.title && item.title.toLowerCase().includes(p.title.toLowerCase())) ||
          (p.title && p.title.toLowerCase().includes(item.title.toLowerCase()))
        );
        if (matched) {
          return {
            ...item,
            status: 'Tercapai',
            tanggal: formatTanggalIndo(matched.tanggal) || item.tanggal
          };
        }
        return item;
      });
    }

    return masterKpsp;
  };

  const getJadwalLengkapImunisasi = () => {
    const defaultMasterVaksin = [
      {
        id: 'vax-hb0',
        nama_vaksin: 'Hepatitis B (HB0)',
        jadwal_usia: '0 - 24 Jam',
        usia_rekomendasi: 'Bayi baru lahir (0 hari)',
        tanggal_diberikan: '15 Jul 2025',
        status: 'Selesai',
        lokasi: 'Puskesmas Manud Jaya',
        petugas: 'Bidan Siti, S.Tr.Keb',
        no_batch_vaksin: 'HB-2025-01',
        keterangan: 'Mencegah penularan virus Hepatitis B dari ibu ke bayi baru lahir yang dapat menyebabkan kerusakan hati kronis.'
      },
      {
        id: 'vax-bcg',
        nama_vaksin: 'BCG',
        jadwal_usia: '1 Bulan',
        usia_rekomendasi: 'Usia 1 bulan',
        tanggal_diberikan: '14 Agu 2025',
        status: 'Selesai',
        lokasi: 'Puskesmas Manud Jaya',
        petugas: 'Bidan Siti, S.Tr.Keb',
        no_batch_vaksin: 'BCG-2025-08',
        keterangan: 'Mencegah penularan kuman Tuberkulosis (TBC) berat seperti TBC milier dan TBC selaput otak (meningitis).'
      },
      {
        id: 'vax-opv1',
        nama_vaksin: 'Polio Tetes 1 (bOPV 1)',
        jadwal_usia: '1 Bulan',
        usia_rekomendasi: 'Usia 1 bulan',
        tanggal_diberikan: '14 Agu 2025',
        status: 'Selesai',
        lokasi: 'Puskesmas Manud Jaya',
        petugas: 'Bidan Siti, S.Tr.Keb',
        no_batch_vaksin: 'OPV-2025-04',
        keterangan: 'Memberikan kekebalan mukosa usus terhadap virus polio tipe 1 dan tipe 3 untuk mencegah kelumpuhan layu akut.'
      },
      {
        id: 'vax-dpt1',
        nama_vaksin: 'DPT-HB-Hib 1 (Pentavalent 1)',
        jadwal_usia: '2 Bulan',
        usia_rekomendasi: 'Usia 2 bulan',
        tanggal_diberikan: '18 Sep 2025',
        status: 'Selesai',
        lokasi: 'Puskesmas Manud Jaya',
        petugas: 'Bidan Siti, S.Tr.Keb',
        no_batch_vaksin: 'DPT-2025-11',
        keterangan: 'Perlindungan kombinasi 5 penyakit: Difteri, Pertusis (batuk rejan), Tetanus, Hepatitis B, dan infeksi bakteri Hib.'
      },
      {
        id: 'vax-opv2',
        nama_vaksin: 'Polio Tetes 2 (bOPV 2)',
        jadwal_usia: '2 Bulan',
        usia_rekomendasi: 'Usia 2 bulan',
        tanggal_diberikan: '18 Sep 2025',
        status: 'Selesai',
        lokasi: 'Puskesmas Manud Jaya',
        petugas: 'Bidan Siti, S.Tr.Keb',
        no_batch_vaksin: 'OPV-2025-09',
        keterangan: 'Dosis penguat kedua untuk antibodi saluran pencernaan terhadap virus polio.'
      },
      {
        id: 'vax-pcv1',
        nama_vaksin: 'PCV 1 (Pneumokokus Konyugasi)',
        jadwal_usia: '2 Bulan',
        usia_rekomendasi: 'Usia 2 bulan',
        tanggal_diberikan: '18 Sep 2025',
        status: 'Selesai',
        lokasi: 'Puskesmas Manud Jaya',
        petugas: 'Bidan Siti, S.Tr.Keb',
        no_batch_vaksin: 'PCV-2025-02',
        keterangan: 'Mencegah radang paru-paru (pneumonia berat) dan infeksi telinga tengah akibat bakteri pneumokokus.'
      },
      {
        id: 'vax-rv1',
        nama_vaksin: 'Rotavirus 1 (RV 1)',
        jadwal_usia: '2 Bulan',
        usia_rekomendasi: 'Usia 2 bulan',
        tanggal_diberikan: '18 Sep 2025',
        status: 'Selesai',
        lokasi: 'Puskesmas Manud Jaya',
        petugas: 'Bidan Siti, S.Tr.Keb',
        no_batch_vaksin: 'RV-2025-03',
        keterangan: 'Vaksin tetes oral untuk mencegah diare dehidrasi berat yang mematikan pada bayi akibat infeksi rotavirus.'
      },
      {
        id: 'vax-dpt2',
        nama_vaksin: 'DPT-HB-Hib 2 & Polio Tetes 3',
        jadwal_usia: '3 Bulan',
        usia_rekomendasi: 'Usia 3 bulan',
        tanggal_diberikan: '20 Okt 2025',
        status: 'Selesai',
        lokasi: 'Puskesmas Manud Jaya',
        petugas: 'Bidan Siti, S.Tr.Keb',
        no_batch_vaksin: 'DPT-2025-18',
        keterangan: 'Lanjutan dosis imunisasi pentavalen untuk mempertahankan titer antibodi difteri dan pertusis.'
      },
      {
        id: 'vax-dpt3',
        nama_vaksin: 'DPT-HB-Hib 3 & Polio Suntik (IPV 1)',
        jadwal_usia: '4 Bulan',
        usia_rekomendasi: 'Usia 4 bulan',
        tanggal_diberikan: '22 Nov 2025',
        status: 'Selesai',
        lokasi: 'Puskesmas Manud Jaya',
        petugas: 'Bidan Siti, S.Tr.Keb',
        no_batch_vaksin: 'IPV-2025-05',
        keterangan: 'Kombinasi pentavalen dosis ke-3 dan vaksin polio suntik inaktif untuk kekebalan serum darah menyeluruh.'
      },
      {
        id: 'vax-mr',
        nama_vaksin: 'Campak Rubella (MR 1)',
        jadwal_usia: '9 Bulan',
        usia_rekomendasi: 'Usia 9 bulan',
        tanggal_diberikan: null,
        tanggal_rencana: '20 Desember 2026',
        status: 'Akan Datang',
        lokasi: 'Puskesmas Manud Jaya',
        petugas: 'Bidan Koordinator Puskesmas',
        no_batch_vaksin: '-',
        keterangan: 'Melindungi anak dari penyakit campak dengan komplikasi diare, pneumonia, radang otak, serta mencegah sindrom rubella kongenital.'
      },
      {
        id: 'vax-booster',
        nama_vaksin: 'DPT-HB-Hib 4 & MR 2 (Booster Lanjutan)',
        jadwal_usia: '18 Bulan',
        usia_rekomendasi: 'Usia 18 bulan',
        tanggal_diberikan: null,
        tanggal_rencana: '15 Mei 2027',
        status: 'Akan Datang',
        lokasi: 'Posyandu Manud Jaya',
        petugas: 'Bidan Desa & Kader Posyandu',
        no_batch_vaksin: '-',
        keterangan: 'Imunisasi penguat (booster) untuk memastikan perlindungan optimal jangka panjang sebelum memasuki usia prasekolah.'
      }
    ];

    if (daftarImunisasi && daftarImunisasi.length > 0) {
      return defaultMasterVaksin.map(mv => {
        const found = daftarImunisasi.find(di => 
          (di.nama_vaksin || '').toLowerCase().includes(mv.nama_vaksin.toLowerCase().slice(0, 4))
        );
        if (found) {
          return {
            ...mv,
            status: found.status || mv.status,
            tanggal_diberikan: found.tanggal_diberikan || mv.tanggal_diberikan,
            lokasi: found.lokasi || mv.lokasi,
            petugas: found.petugas || mv.petugas,
            no_batch_vaksin: found.no_batch_vaksin || mv.no_batch_vaksin
          };
        }
        return mv;
      });
    }

    return defaultMasterVaksin;
  };

  const [formKms, setFormKms] = useState({
    tanggal_ukur: new Date().toISOString().split('T')[0],
    usia_bulan: 14,
    berat_badan: '9.8',
    tinggi_badan: '75.0',
    lingkar_kepala: '46.0',
    status_gizi: 'Gizi Baik (Normal)',
    faskes_posyandu: 'Posyandu Anggrek',
    catatan: 'Pertumbuhan anak normal dan aktif.'
  });

  const [daftarImunisasi, setDaftarImunisasi] = useState([]);

  useEffect(() => {
    if (!activeAnakId) return;
    bukuKiaService.getImunisasiAnakList(activeAnakId).then((res) => {
      if (res && res.length > 0) {
        setDaftarImunisasi(res);
      } else {
        setDaftarImunisasi([]);
      }
    });
  }, [activeAnakId]);

  const [riwayatPertumbuhan, setRiwayatPertumbuhan] = useState([]);

  const latestKms = riwayatPertumbuhan && riwayatPertumbuhan.length > 0 
    ? riwayatPertumbuhan[riwayatPertumbuhan.length - 1] 
    : { bb: '9,8 Kg', tb: '75 Cm', lk: '46 Cm', status: 'Normal' };

  useEffect(() => {
    if (!activeAnakId) return;
    bukuKiaService.getPertumbuhanAnakList(activeAnakId).then((res) => {
      if (res && res.length > 0) {
        const formatted = res.map((r, idx) => ({
          no: idx + 1,
          id: r.id,
          tanggal: r.tanggal_ukur || '12 Sep 2026',
          usia: (r.usia_bulan || 14) + ' Bulan',
          bb: (r.berat_badan || '9.8').toString().replace('.', ',') + ' Kg',
          tb: (r.tinggi_badan || '75').toString().replace('.', ',') + ' Cm',
          lk: (r.lingkar_kepala || '46').toString().replace('.', ',') + ' Cm',
          status: r.status_gizi || 'Normal'
        }));
        setRiwayatPertumbuhan(formatted);
      } else {
        setRiwayatPertumbuhan([]);
      }
    });
  }, [activeAnakId]);

  const handleSimpanKms = async (e) => {
    e.preventDefault();
    setIsSubmittingKms(true);
    try {
      const payload = {
        anak_id: activeAnakId,
        tanggal_ukur: formKms.tanggal_ukur,
        usia_bulan: parseInt(formKms.usia_bulan) || 14,
        berat_badan: parseFloat(formKms.berat_badan) || 9.8,
        tinggi_badan: parseFloat(formKms.tinggi_badan) || 75.0,
        lingkar_kepala: parseFloat(formKms.lingkar_kepala) || 46.0,
        status_gizi: formKms.status_gizi,
        faskes_posyandu: formKms.faskes_posyandu,
        catatan: formKms.catatan
      };

      await bukuKiaService.tambahPertumbuhanAnak(payload);

      const newItem = {
        no: riwayatPertumbuhan.length + 1,
        tanggal: formKms.tanggal_ukur,
        usia: formKms.usia_bulan + ' Bulan',
        bb: formKms.berat_badan.toString().replace('.', ',') + ' Kg',
        tb: formKms.tinggi_badan.toString().replace('.', ',') + ' Cm',
        lk: formKms.lingkar_kepala.toString().replace('.', ',') + ' Cm',
        status: formKms.status_gizi.includes('Normal') ? 'Normal' : formKms.status_gizi
      };

      setRiwayatPertumbuhan(prev => [...prev, newItem]);
      setIsModalKmsOpen(false);
      onShowToast && onShowToast(`Hasil penimbangan KMS untuk ${activeAnak?.nama || 'anak'} berhasil disimpan!`, 'success');
    } catch (err) {
      console.error(err);
      onShowToast && onShowToast('Gagal menyimpan penimbangan anak', 'error');
    } finally {
      setIsSubmittingKms(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Halaman & Patient Child Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kesehatan Anak / {activeSub}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {activeSub === 'Perkembangan'
              ? 'Pantau tumbuh kembang anak sesuai tahap usianya dengan panduan buku KIA'
              : activeSub === 'Imunisasi'
              ? 'Pantau jadwal, riwayat, dan status imunisasi anak sesuai dengan panduan Buku KIA'
              : 'Pantau pertumbuhan dan perkembangan anak sesuai panduan buku KIA'}
          </p>
        </div>

        {/* Patient Child Switcher untuk Bidan / Kader */}
        {!isIbuRole && daftarAnak.length > 0 && (
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3 py-2 shadow-xs">
            <Users size={16} className="text-pink-600 shrink-0" />
            <div className="text-[11px]">
              <span className="text-slate-400 block font-medium">Pilih Pasien Anak:</span>
              <select
                value={activeAnakId || ''}
                onChange={(e) => handleSwitchAnak(e.target.value)}
                className="font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer text-xs pr-2"
              >
                {daftarAnak.map((anak) => (
                  <option key={anak.id} value={anak.id}>
                    {anak.nama} ({anak.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Multiple Child Tab Selector: Dinamis sesuai anak milik ibu dari Supabase */}
      {daftarAnak.length > 1 && (
        <div className="bg-white/80 backdrop-blur-xs p-2 rounded-2xl border border-pink-100 shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 shrink-0">
            {isIbuRole ? 'Pilih Anak Anda:' : 'Pilih Anak:'}
          </span>
          <div className="flex items-center gap-2">
            {daftarAnak.map((anak, idx) => {
              const isSelected = anak.id === activeAnakId;
              const usiaStr = hitungUsiaString(anak.tgl_lahir);
              const isBoy = anak.jenis_kelamin === 'L';
              const displayName = formatNamaAnak(anak, idx);
              
              return (
                <button
                  key={anak.id}
                  type="button"
                  data-anak-id={anak.id}
                  onClick={() => handleSwitchAnak(anak.id)}
                  className={`group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none active:scale-95 shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#FF4D80] to-[#E11D48] text-white shadow-md shadow-pink-300/40 border border-pink-400'
                      : 'bg-white hover:bg-pink-50/60 text-slate-700 hover:text-[#E11D48] border border-slate-200/80 shadow-xs'
                  }`}
                >
                  <span className="text-sm">
                    {isBoy ? '👦' : '👧'}
                  </span>
                  <span className="truncate max-w-[150px] sm:max-w-[200px]">
                    {displayName}
                  </span>
                  {usiaStr && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isSelected
                          ? 'bg-white/25 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-pink-100 group-hover:text-pink-700'
                      }`}
                    >
                      {usiaStr}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tampilan edukatif jika Ibu Hamil Saja belum memiliki anak terdaftar */}
      {isIbuRole && !activeAnak && (
        <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center max-w-lg mx-auto shadow-xs space-y-4 my-8">
          <div className="w-16 h-16 rounded-full bg-pink-50 text-[#E11D48] flex items-center justify-center mx-auto">
            <Baby size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Belum Ada Data Anak Terdaftar</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Anda saat ini terdaftar dalam program pemantauan kehamilan. Rekam medis anak, grafik pertumbuhan KMS, dan jadwal imunisasi akan otomatis aktif setelah proses kelahiran dicatat oleh Bidan Desa / Kader Posyandu.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/kesehatan-ibu/kehamilan')}
            className="px-5 py-2.5 bg-[#FF4D80] hover:bg-[#F43F5E] text-white rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-pink-200"
          >
            <span>Buka Buku KIA Kehamilan</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Konten Sub-Halaman Buku KIA Anak (hanya tampil jika anak tersedia atau peran tenaga kesehatan) */}
      {(activeAnak || !isIbuRole) && (
      <>
      {/* =====================================================================
          SUB-PAGE 0: PROFIL ANAK (PBI 02B)
      ====================================================================== */}
      {activeSub === 'Profil Anak' && (
        <div className="space-y-6">
          {/* 1. Header Banner Profil Anak */}
          <div className="bg-gradient-to-r from-[#FFF0F4] via-[#FFE4EC] to-[#FFD6E4] border border-pink-200/70 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 min-h-[160px]">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 border-white shadow-md overflow-hidden shrink-0 bg-white flex items-center justify-center">
                <img 
                  src="/images/farhan-avatar.png" 
                  alt={activeAnak?.nama || 'Anak'} 
                  className="w-full h-full object-cover"
                  onError={(e) => { 
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<span class=\"text-2xl font-bold text-[#E11D48]\">👶</span>';
                  }}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {activeAnak?.nama || 'Anak'}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]">
                    Status: Aktif
                  </span>
                </div>
                <p className="text-xs font-bold text-[#E11D48]">
                  {hitungUsiaString(activeAnak?.tgl_lahir)}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  NIK: <strong className="text-slate-800 font-bold">{activeAnak?.nik || '3201234567890004'}</strong> · {activeAnak?.jenis_kelamin === 'P' ? 'Perempuan' : 'Laki–Laki'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/90 rounded-2xl p-4 border border-pink-200/60 text-right">
                <span className="text-[10px] text-slate-400 font-medium block">Nomor Buku KIA Anak</span>
                <span className="text-sm font-extrabold text-[#E11D48] block mt-0.5">KIA-2024-0012</span>
              </div>
            </div>
          </div>

          {/* 2. 4 Kartu Detail Identitas Anak */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Data Kelahiran */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-50">
                <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center font-bold">
                  <Calendar size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Data Kelahiran</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Tanggal Lahir</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{activeAnak?.tgl_lahir || '20 Desember 2024'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Waktu Kelahiran</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">08:45 WIB</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Tempat Persalinan</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">Puskesmas Manud Jaya</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Penolong Persalinan</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">Bidan Siti, S.Tr.Keb</span>
                </div>
              </div>
            </div>

            {/* Card 2: Antropometri Saat Lahir */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-50">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Scale size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Ukuran Saat Lahir</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Berat Badan Lahir (BBL)</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">3.200 gram (3,2 kg)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Panjang Badan Lahir (PBL)</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">49,0 cm</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Lingkar Kepala Lahir</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">34,0 cm</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Golongan Darah</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">O (Rhesus +)</span>
                </div>
              </div>
            </div>

            {/* Card 3: Data Orang Tua & Domisili */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-50">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <User size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Data Orang Tua & Domisili</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Nama Ibu Kandung</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">Siti Aminah</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Nama Ayah</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">Ahmad Fauzi</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">No. Telepon / WhatsApp</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">081234567890</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Wilayah Posyandu</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">Posyandu Anggrek (Dusun 1)</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 font-medium block">Alamat Domisili</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">RT 02 / RW 01, Dusun Karang Anyar, Desa Manud Jaya</span>
                </div>
              </div>
            </div>

            {/* Card 4: Ringkasan Rekam Medis Anak */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-50">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <ShieldCheck size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Status Kesehatan Terkini</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                  <div>
                    <span className="text-[10px] text-emerald-700 font-bold block uppercase">Status Gizi (KMS)</span>
                    <span className="font-extrabold text-slate-900 mt-0.5 block">Gizi Baik (Normal)</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-emerald-700 border border-emerald-200">
                    BB {(latestKms.bb || '9,8 Kg').replace(' Kg', ' kg')} · TB {(latestKms.tb || '75 Cm').replace(' Cm', ' cm')}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/60 border border-blue-100">
                  <div>
                    <span className="text-[10px] text-blue-700 font-bold block uppercase">Cakupan Imunisasi</span>
                    <span className="font-extrabold text-slate-900 mt-0.5 block">7 dari 9 Vaksin Selesai</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-blue-700 border border-blue-200">
                    Sesuai Jadwal
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-pink-50/60 border border-pink-100">
                  <div>
                    <span className="text-[10px] text-[#E11D48] font-bold block uppercase">Skrining Perkembangan (KPSP)</span>
                    <span className="font-extrabold text-slate-900 mt-0.5 block">Perkembangan Sesuai Usia</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-[#E11D48] border border-pink-200">
                    Skor 10/10
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-PAGE 1: PERTUMBUHAN (Image 4)
      ====================================================================== */}
      {activeSub === 'Pertumbuhan' && (
        <div className="space-y-6">
          {/* Top Banner Profil Anak (Sesuai Expected Result Figma QA) */}
          <div className="bg-[#FFF0F4] border border-pink-100 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            {/* Sisi Kiri: Usia Anak */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 block">Usia Anak</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E11D48] tracking-tight">
                {activeAnak?.usia || '1 Tahun 2 Bulan'}
              </h2>
              <span className="text-xs text-slate-400 font-medium block">150 Hari</span>
            </div>

            {/* Sisi Tengah: Tanggal Lahir & Jenis Kelamin Cards */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
              {/* Tanggal Lahir */}
              <div className="bg-white rounded-2xl px-4 py-3 border border-slate-100 shadow-xs flex items-center gap-3 min-w-[170px]">
                <div className="text-slate-700 shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Tanggal lahir</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5">
                    {formatTanggalIndo(activeAnak?.tgl_lahir) || '20 Desember 2026'}
                  </span>
                </div>
              </div>

              {/* Jenis Kelamin */}
              <div className="bg-white rounded-2xl px-4 py-3 border border-slate-100 shadow-xs flex items-center gap-3 min-w-[170px]">
                <div className="text-slate-700 shrink-0">
                  <User size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Jenis Kelamin</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block mt-0.5">
                    {activeAnak?.jenis_kelamin === 'P' ? 'Perempuan' : 'Laki-Laki'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sisi Kanan: Ilustrasi Anak Kartun Melambaikan Tangan */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 self-center md:self-auto flex items-center justify-center">
              <img 
                src="/images/anak-pertumbuhan.png" 
                alt="Ilustrasi Anak" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = '/images/farhan-avatar.png';
                }}
              />
            </div>
          </div>

          {/* 4 Kartu Metrik Pertumbuhan Terakhir (Design Penyesuaian Figma) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. BB Terakhir */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
              <div className="text-[#8B5CF6] shrink-0">
                <Weight size={20} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Berat Badan Terakhir</span>
                <span className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  {latestKms.bb || '9,8 Kg'}
                </span>
              </div>
            </div>

            {/* 2. TB Terakhir */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
              <div className="text-[#8B5CF6] shrink-0">
                <HeightMeasureIcon size={20} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Tinggi Badan Terakhir</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    {(latestKms.tb || '50 cm').toLowerCase()}
                  </span>
                  <span className="text-[10px] text-slate-400">Naik 2cm</span>
                </div>
              </div>
            </div>

            {/* 3. LK Terakhir */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
              <div className="text-[#8B5CF6] shrink-0">
                <Baby size={20} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Lingkar Kepala Terakhir</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm sm:text-base font-bold text-slate-900 leading-tight">46 cm</span>
                  <span className="text-[10px] text-slate-400">Naik 1 cm</span>
                </div>
              </div>
            </div>

            {/* 4. Status Gizi */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
              <div className="text-[#8B5CF6] shrink-0">
                <ShoppingBasket size={20} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Status Gizi</span>
                <span className="text-sm sm:text-base font-bold text-emerald-600 leading-tight">Normal</span>
              </div>
            </div>
          </div>

          {/* Baris Tengah: Grafik Pertumbuhan & Informasi Penting */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Grafik Pertumbuhan */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Grafik Pertumbuhan</h3>

              {/* Tabs Metrik Grafik */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {['Berat Badan', 'Tinggi Badan', 'Lingkar Kepala', 'IMT (BB / TB)'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveChartTab(tab)}
                    className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                      activeChartTab === tab
                        ? 'bg-[#FF4D80] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Line Chart SVG (Lebar Responsif Sesuai Desain Figma) */}
              <div ref={chartContainerRef1} className="w-full pt-2 pb-2">
                <svg viewBox={`0 0 ${chartWidth} 248`} className="w-full h-auto select-none block">
                  <defs>
                    <linearGradient id="pertumbuhanGrad" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#pertumbuhanGrad)"
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
                <span className="font-medium text-slate-700">{activeChartTab}</span>
              </div>
            </div>

            {/* Informasi Penting */}
            <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Informasi Penting</h3>
                <button 
                  type="button"
                  onClick={() => onShowToast && onShowToast('Membuka seluruh materi edukasi anak...', 'info')}
                  className="text-xs font-semibold text-[#FF4D80] hover:text-[#E11D48] cursor-pointer"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="space-y-3">
                {/* Info 1 */}
                <div 
                  onClick={() => onShowToast && onShowToast('Simulasi Perkembangan: Lakukan stimulasi 15 menit/hari', 'info')}
                  className="p-3.5 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 transition-all flex items-start justify-between cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full border border-pink-300 text-[#FF4D80] flex items-center justify-center shrink-0 mt-0.5">
                      <Zap size={13} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#FF4D80] transition-colors">
                        Simulasi Perkembangan Anak
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Panduan stimulasi sesuai usia untuk mendukung tumbuh kembang optimal
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-slate-400 group-hover:text-slate-600 shrink-0 mt-1" />
                </div>

                {/* Info 2 */}
                <div 
                  onClick={() => onShowToast && onShowToast('Pola Makan: Berikan MPASI gizi seimbang dengan prohe cukup', 'info')}
                  className="p-3.5 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 transition-all flex items-start justify-between cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full border border-pink-300 text-[#FF4D80] flex items-center justify-center shrink-0 mt-0.5">
                      <Zap size={13} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#FF4D80] transition-colors">
                        Pola Makan Sehat
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Rekomendasi pemberian makan sesuai usia anak
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-slate-400 group-hover:text-slate-600 shrink-0 mt-1" />
                </div>

                {/* Info 3 */}
                <div 
                  onClick={() => onShowToast && onShowToast('Tanda Bahaya: Demam tinggi, kejang, atau sesak segera ke Puskesmas', 'info')}
                  className="p-3.5 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/20 transition-all flex items-start justify-between cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full border border-pink-300 text-[#FF4D80] flex items-center justify-center shrink-0 mt-0.5">
                      <Zap size={13} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#FF4D80] transition-colors">
                        Tanda Bahaya pada Anak
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Kenali tanda bahaya dan segera ke fasilitas kesehatan
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-slate-400 group-hover:text-slate-600 shrink-0 mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabel: Riwayat Pertumbuhan */}
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-5 sm:p-6 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Riwayat Pertumbuhan</h3>
              </div>
              {!isIbuRole && (
                <button
                  type="button"
                  onClick={() => setIsModalKmsOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E11D48] hover:bg-[#BE185D] text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Catat Penimbangan KMS</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FFE4EC]/70 text-slate-800 font-bold border-b border-pink-100">
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4 w-32">Tanggal</th>
                    <th className="py-3 px-4 w-28">Usia</th>
                    <th className="py-3 px-4 w-32">Berat Badan</th>
                    <th className="py-3 px-4 w-32">Tinggi Badan</th>
                    <th className="py-3 px-4 w-36">Lingkar Kepala</th>
                    <th className="py-3 px-4 w-28 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {riwayatPertumbuhan.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Belum ada data penimbangan KMS untuk anak ini.{!isIbuRole ? ' Klik tombol "+ Catat Penimbangan KMS" untuk menambahkan.' : ''}
                      </td>
                    </tr>
                  ) : (
                    riwayatPertumbuhan.map((row) => (
                      <tr key={row.id || row.no} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4 text-center font-medium">{row.no}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">{row.tanggal}</td>
                        <td className="py-3.5 px-4 text-slate-600">{row.usia}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{row.bb}</td>
                        <td className="py-3.5 px-4 text-slate-600">{row.tb}</td>
                        <td className="py-3.5 px-4 text-slate-600">{row.lk}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D]">
                            {row.status === 'Gizi Baik (Normal)' ? 'Normal' : row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-PAGE 2: PERKEMBANGAN (Image 1)
      ====================================================================== */}
      {activeSub === 'Perkembangan' && (
        <div className="space-y-6">
          {/* Top Card: Profil Anak (Sesuai Expected Result Figma QA) */}
          <div className="bg-[#FFF0F4] border border-pink-100 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-6 sm:gap-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-pink-200 overflow-hidden shrink-0 bg-white p-0.5 shadow-2xs">
                <img 
                  src="/images/farhan-avatar.png" 
                  alt={activeAnak?.nama || 'Farhan'} 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/images/anak-pertumbuhan.png'; }}
                />
              </div>

              <div className="space-y-0.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {activeAnak?.nama || 'Farhan'}
                </h2>
                <p className="text-xs font-bold text-[#E11D48] mt-0.5">
                  1 Tahun 2 bulan
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  {activeAnak?.jenis_kelamin === 'P' ? 'Perempuan' : 'Laki – Laki'} &nbsp;{formatTanggalIndo(activeAnak?.tgl_lahir) || '20 Desember 2026'}
                </p>
              </div>
            </div>

            {/* 2 Quick Cards di Kanan */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Card 1: Tahap Perkembangan */}
              <div className="bg-white rounded-2xl px-4 py-3 border border-slate-100 shadow-xs flex items-center gap-3 min-w-[160px]">
                <Calendar size={18} className="text-[#FF4D80] shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Tahap Perkembangan</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">12 - 18 Bulan</span>
                </div>
              </div>

              {/* Card 2: Status Perkembangan */}
              <div className="bg-white rounded-2xl px-4 py-3 border border-slate-100 shadow-xs flex items-center gap-3 min-w-[160px]">
                <BarChart2 size={18} className="text-[#FF4D80] shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Status Perkembangan</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5 block">Sesuai Usia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Baris Kedua: 3 Kartu Status Perkembangan */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Card 1: Status Banner */}
            <div className="md:col-span-6 bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-center space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-emerald-600">Sesuai Usia</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Perkembangan {activeAnak?.nama || 'Farhan'} sesuai dengan tahapan usianya. Terus berikan stimulasi secara rutin
              </p>
            </div>

            {/* Card 2: Riwayat Skrining */}
            <div className="md:col-span-3 bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-xs flex items-center gap-3.5">
              <History size={22} className="text-[#8B5CF6] shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Riwayat Skrining</span>
                <div className="mt-0.5">
                  <span className="text-xl font-extrabold text-slate-900 block leading-tight">3</span>
                  <span className="text-[11px] text-slate-500 font-medium block">kali discreening</span>
                </div>
              </div>
            </div>

            {/* Card 3: Stimulasi Hari Ini */}
            <div 
              onClick={() => onShowToast && onShowToast(`${activeAnak?.nama || 'Anak'} memiliki 3 aktivitas stimulasi yang disarankan hari ini.`, 'info')}
              className="md:col-span-3 bg-white border border-slate-100 hover:border-pink-200 rounded-3xl p-5 sm:p-6 shadow-xs flex items-center justify-between cursor-pointer group transition-all"
            >
              <div className="flex items-center gap-3.5">
                <Puzzle size={22} className="text-[#8B5CF6] shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Stimulasi Hari Ini</span>
                  <div className="mt-0.5">
                    <span className="text-xl font-extrabold text-slate-900 block leading-tight">3</span>
                    <span className="text-[11px] text-slate-500 font-medium block">aktivitas yang disarankan</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
            </div>
          </div>

          {/* Baris Ketiga: Pencapaian Perkembangan & Grafik Pertumbuhan */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Pencapaian Perkembangan */}
            <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Pencapaian Perkembangan</h3>
                <button 
                  type="button"
                  onClick={() => setShowAllPencapaian(true)}
                  className="text-xs font-semibold text-[#FF4D80] hover:text-[#E11D48] cursor-pointer"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="space-y-3.5">
                {pencapaianMilestones.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <Check size={12} className="stroke-[3]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                        <span className="text-[10px] text-slate-400 font-medium block">{item.usia}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{item.tanggal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grafik Pertumbuhan */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Grafik Pertumbuhan</h3>

              {/* Tabs Metrik Grafik */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {['Berat Badan', 'Tinggi Badan', 'Lingkar Kepala', 'IMT (BB / TB)'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveChartTab(tab)}
                    className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                      activeChartTab === tab
                        ? 'bg-[#FF4D80] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Line Chart SVG (Lebar Responsif Sesuai Desain Figma) */}
              <div ref={chartContainerRef2} className="w-full pt-2 pb-2">
                <svg viewBox={`0 0 ${chartWidth} 248`} className="w-full h-auto select-none block">
                  <defs>
                    <linearGradient id="perkembanganGrad" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#perkembanganGrad)"
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
                <span className="font-medium text-slate-700">{activeChartTab}</span>
              </div>
            </div>
          </div>

          {/* Baris Bawah: Aktivitas Stimulasi Rekomendasi */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Aktivitas Stimulasi Rekomendasi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {aktivitasStimulasi.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={idx}
                    onClick={() => setSelectedStimulasi(item)}
                    className="bg-white border border-slate-100 hover:border-pink-200 rounded-3xl p-5 shadow-xs flex items-center justify-between cursor-pointer group transition-all"
                  >
                    <div className="flex items-start gap-3.5">
                      <IconComponent size={20} className="text-[#FF168B] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#FF168B] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 shrink-0 ml-2" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SUB-PAGE 3: IMUNISASI (Image 3 - Sesuai Figma QA)
      ====================================================================== */}
      {activeSub === 'Imunisasi' && (() => {
        const displayJadwalRingkas = daftarImunisasi.slice(0, 4).map(i => ({
          nama_vaksin: i.nama_vaksin ? i.nama_vaksin.replace(/\s*\(.*?\)/g, '') : 'Vaksin',
          jadwal_usia: i.jadwal_usia ? (i.jadwal_usia.toLowerCase().startsWith('usia') ? i.jadwal_usia : 'Usia ' + i.jadwal_usia) : 'Sesuai Jadwal',
          tanggal_diberikan: i.status === 'Selesai' && i.tanggal_diberikan ? (formatTanggalIndo(i.tanggal_diberikan) || i.tanggal_diberikan) : (i.status || 'Akan Datang'),
          status: i.status || 'Selesai'
        }));

        const riwayatSelesai = daftarImunisasi.filter(i => i.status === 'Selesai' || i.tanggal_diberikan);
        const displayRiwayatImunisasi = riwayatSelesai.map((vax, idx) => ({
          no: idx + 1,
          tanggal: formatTanggalIndo(vax.tanggal_diberikan) || vax.tanggal_diberikan || '-',
          usia: vax.jadwal_usia || '-',
          jenis: vax.nama_vaksin || '-',
          lokasi: vax.lokasi || 'Posyandu Anggrek',
          petugas: vax.petugas || 'Bidan Siti, S.Tr.Keb'
        }));

        return (
          <div className="space-y-6">
            {/* Top Card: Profil Anak (Sesuai Expected Result Figma QA) */}
            <div className="bg-[#FFF0F4] border border-pink-100 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4.5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-pink-200 overflow-hidden shrink-0 bg-white p-0.5 shadow-2xs">
                  <img 
                    src="/images/farhan-avatar.png" 
                    alt={activeAnak?.nama || 'Farhan'} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/images/anak-pertumbuhan.png'; }}
                  />
                </div>

                <div className="space-y-0.5">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {activeAnak?.nama || 'Farhan'}
                  </h2>
                  <p className="text-xs font-bold text-[#E11D48] mt-0.5">
                    1 Tahun 2 bulan
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    {activeAnak?.jenis_kelamin === 'P' ? 'Perempuan' : 'Laki – Laki'} &nbsp;{formatTanggalIndo(activeAnak?.tgl_lahir) || '20 Desember 2026'}
                  </p>
                </div>
              </div>

              {/* 2 Quick Cards di Kanan */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Card 1: Imunisasi Selesai */}
                <div className="bg-white rounded-2xl p-4 border border-pink-100/80 shadow-xs flex items-center gap-3.5 flex-1 sm:flex-none min-w-[150px]">
                  <Syringe size={22} className="text-[#FF168B] shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">Imunisasi Selesai</span>
                    <span className="text-base sm:text-lg font-extrabold text-slate-900 block leading-tight">
                      {daftarImunisasi.length > 0 ? `${daftarImunisasi.filter(i => i.status === 'Selesai').length} / ${daftarImunisasi.length}` : '0 / 0'}
                    </span>
                  </div>
                </div>

                {/* Card 2: Status Imunisasi */}
                <div className="bg-white rounded-2xl p-4 border border-pink-100/80 shadow-xs flex items-center gap-3.5 flex-1 sm:flex-none min-w-[160px]">
                  <ClipboardCheck size={22} className="text-[#FF168B] shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">Status Imunisasi</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-600 block leading-tight">
                      Sesuai Jadwal
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Baris Tengah: Jadwal Imunisasi Sesuai Usia & Tips Imunisasi */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Kolom Kiri: Jadwal Imunisasi Sesuai Usia */}
              <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Jadwal Imunisasi Sesuai Usia</h3>
                  <button 
                    type="button"
                    onClick={() => setShowAllJadwalImunisasi(true)}
                    className="text-xs font-semibold text-[#FF168B] hover:text-[#E11D48] cursor-pointer"
                  >
                    Lihat Semua
                  </button>
                </div>

                <div className="space-y-3.5">
                  {displayJadwalRingkas.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setShowAllJadwalImunisasi(true)}
                      className="flex items-center justify-between py-1 group cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#FF168B] transition-colors">{item.nama_vaksin}</h4>
                          <span className="text-[10px] text-slate-400 font-medium block">{item.jadwal_usia}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D]">
                          {item.status || 'Selesai'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{item.tanggal_diberikan || '20 Feb 2026'}</span>
                        <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kolom Kanan: Detail Campak Rubella & Tips Setelah Imunisasi */}
              <div className="lg:col-span-7 space-y-4">
                {/* 2 Kartu Atas: Jadwal Vaksin Berikutnya & Manfaat */}
                {(() => {
                  const nextVaksin = daftarImunisasi.find(i => i.status === 'Akan Datang' || !i.tanggal_diberikan) || (daftarImunisasi.length > 0 ? daftarImunisasi[daftarImunisasi.length - 1] : null);
                  const nextTitle = nextVaksin?.nama_vaksin || 'Campak Rubella (MR)';
                  const nextDate = nextVaksin?.tanggal_diberikan ? (formatTanggalIndo(nextVaksin.tanggal_diberikan) || nextVaksin.tanggal_diberikan) : (nextVaksin?.jadwal_usia ? `Usia ${nextVaksin.jadwal_usia}` : 'Sesuai Jadwal');

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-start gap-3.5">
                        <Calendar size={22} className="text-[#8B5CF6] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{nextTitle}</span>
                          <span className="text-sm font-bold text-[#FF168B] leading-tight block mt-0.5">
                            {nextDate}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-start gap-3.5">
                        <Heart size={22} className="text-[#8B5CF6] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Manfaat</span>
                          <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                            Melindungi anak dari penyakit menular berbahaya dan komplikasi serius melalui imunisasi lengkap.
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Tips Setelah Imunisasi */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Tips Setelah Imunisasi</h3>
                    <button 
                      type="button"
                      onClick={() => setShowAllTipsImunisasi(true)}
                      className="text-xs font-semibold text-[#FF168B] hover:text-[#E11D48] cursor-pointer"
                    >
                      Lihat Semua
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-1">
                    {/* Tip 1 */}
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="text-[#FF168B] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Berikan ASI lebih sering</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Membantu menenangkan anak.</p>
                      </div>
                    </div>

                    {/* Tip 2 */}
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="text-[#FF168B] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Segera ke Faskes</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Jika demam tinggi, kejang atau reaksi berat lainnya</p>
                      </div>
                    </div>

                    {/* Tip 3 */}
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="text-[#FF168B] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Kompres hangat jika demam</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Rekomendasi pemberian makan sesuai usia anak</p>
                      </div>
                    </div>

                    {/* Tip 4 */}
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="text-[#FF168B] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Pantau Suhu tubuh Anak</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Demam ringan adalah hal yang umum setelah imunisasi</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabel: Riwayat Imunisasi */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Riwayat Imunisasi</h3>
              <div className="bg-white border border-pink-100/60 rounded-3xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FFE8EF] text-slate-900 font-bold border-b border-pink-100">
                        <th className="py-3 px-4 w-12 text-center">No</th>
                        <th className="py-3 px-4 w-32">Tanggal</th>
                        <th className="py-3 px-4 w-28">Usia</th>
                        <th className="py-3 px-4">Jenis Imunisasi</th>
                        <th className="py-3 px-4">Lokasi</th>
                        <th className="py-3 px-4">Petugas</th>
                        <th className="py-3 px-4 w-20 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {displayRiwayatImunisasi.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400">
                            Belum ada riwayat imunisasi yang tercatat untuk anak ini.
                          </td>
                        </tr>
                      ) : displayRiwayatImunisasi.map((row, idx) => (
                        <tr key={idx} className="hover:bg-pink-50/20 transition-colors">
                          <td className="py-3.5 px-4 text-center font-medium text-slate-700">{row.no || idx + 1}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{row.tanggal}</td>
                          <td className="py-3.5 px-4 text-slate-600">{row.usia}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">{row.jenis}</td>
                          <td className="py-3.5 px-4 text-slate-600">{row.lokasi}</td>
                          <td className="py-3.5 px-4 text-slate-600">{row.petugas}</td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => onShowToast && onShowToast(`Detail vaksin: ${row.jenis} tanggal ${row.tanggal} di ${row.lokasi} oleh ${row.petugas}.`, 'info')}
                              className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      {/* =====================================================================
          SUB-PAGE 4: PEMERIKSAAN ANAK
      ====================================================================== */}
      {(activeSub === 'Pemeriksaan' || activeSub === 'Pemeriksaan Anak') && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Riwayat Pemeriksaan Rutin Anak</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FFE4EC]/70 text-slate-800 font-bold border-b border-pink-100">
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4">Layanan</th>
                    <th className="py-3 px-4">Usia</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Faskes / Posyandu</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 text-center font-medium">1</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">Vitamin A (Kapsul Biru)</td>
                    <td className="py-3.5 px-4 text-slate-600">6 Bulan</td>
                    <td className="py-3.5 px-4 text-slate-600">20 Jun 2027</td>
                    <td className="py-3.5 px-4 text-slate-600">Posyandu Mawar</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D]">
                        Sudah
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Stimulasi */}
      {selectedStimulasi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">{selectedStimulasi.title}</h4>
              <button 
                type="button" 
                onClick={() => setSelectedStimulasi(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedStimulasi.detail}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStimulasi(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    
      {/* Modal Checklist Lengkap Pencapaian Perkembangan KPSP Buku KIA */}
      {showAllPencapaian && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <ClipboardCheck size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Pencapaian Perkembangan ({activeAnak?.nama || 'Farhan'})
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Checklist Lengkap Kuesioner Pra Skrining Perkembangan (KPSP) Buku KIA Kemenkes RI
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAllPencapaian(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Child Info Badge & Filter Tabs */}
            <div className="space-y-3 shrink-0">
              <div className="p-3 bg-pink-50/50 rounded-2xl border border-pink-100/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Nama Anak:</span>
                    <span className="font-bold text-slate-800">{activeAnak?.nama || 'Farhan'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Usia Saat Ini:</span>
                    <span className="font-bold text-[#E11D48]">{activeAnak?.usia || '1 Tahun 2 bulan'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Tahap Perkembangan:</span>
                    <span className="font-medium text-slate-700">12 - 18 Bulan</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-pink-100 shadow-2xs">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span className="text-[11px] font-bold text-emerald-700">
                    {getChecklistKpspLengkap().filter(m => m.status === 'Tercapai').length} dari {getChecklistKpspLengkap().length} Indikator Tercapai
                  </span>
                </div>
              </div>

              {/* Kategori Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {['Semua', 'Motorik Kasar', 'Motorik Halus', 'Bicara & Bahasa', 'Sosialisasi & Kemandirian'].map((kat) => (
                  <button
                    key={kat}
                    type="button"
                    onClick={() => setFilterKpspKategori(kat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      filterKpspKategori === kat
                        ? 'bg-[#E11D48] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {kat === 'Semua' 
                      ? `Semua (${getChecklistKpspLengkap().length})`
                      : `${kat} (${getChecklistKpspLengkap().filter(m => m.kategori === kat).length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* List KPSP Milestones */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {getChecklistKpspLengkap()
                .filter(m => filterKpspKategori === 'Semua' || m.kategori === filterKpspKategori)
                .map((milestone) => (
                  <div 
                    key={milestone.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-pink-200 transition-all shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          milestone.status === 'Tercapai' 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'bg-amber-50 text-amber-600'
                        }`}>
                          {milestone.status === 'Tercapai' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900">{milestone.title}</h4>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-50 text-[#E11D48] border border-pink-100">
                              {milestone.kategori}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {milestone.deskripsi}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 whitespace-nowrap ${
                        milestone.status === 'Tercapai' 
                          ? 'bg-[#DCFCE7] text-[#15803D]' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {milestone.status}
                      </span>
                    </div>

                    {/* Metadata Detail */}
                    <div className="p-2.5 bg-slate-50/70 rounded-xl flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Rekomendasi Usia:</span>
                        <span className="font-bold text-slate-800">{milestone.usia}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Pencapaian:</span>
                        <span className="font-semibold text-slate-800">{milestone.tanggal}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <a
                href="https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/Buku_KIA_2024.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#E11D48] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen size={14} />
                <span>Panduan KPSP Buku KIA 2024</span>
                <ExternalLink size={12} />
              </a>
              <button
                type="button"
                onClick={() => setShowAllPencapaian(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer active:scale-95 transition-transform"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    
      {/* Modal Jadwal Imunisasi Lengkap Sesuai Usia */}
      {showAllJadwalImunisasi && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Jadwal Imunisasi Lengkap ({activeAnak?.nama || 'Anak'})
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Program Imunisasi Nasional (PIN) Kemenkes RI & Rekam Medis Posyandu
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAllJadwalImunisasi(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Child Info Badge & Filter Tabs */}
            <div className="space-y-3 shrink-0">
              <div className="p-3 bg-pink-50/50 rounded-2xl border border-pink-100/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Nama Anak:</span>
                    <span className="font-bold text-slate-800">{activeAnak?.nama || 'Anak'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Usia Saat Ini:</span>
                    <span className="font-bold text-[#E11D48]">{activeAnak?.usia || '1 Tahun 2 bulan'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Tanggal Lahir:</span>
                    <span className="font-medium text-slate-700">{formatTanggalIndo(activeAnak?.tgl_lahir || '2024-10-15')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-pink-100 shadow-2xs">
                  <Syringe size={14} className="text-[#E11D48]" />
                  <span className="text-[11px] font-bold text-slate-700">
                    {getJadwalLengkapImunisasi().filter(v => v.status === 'Selesai').length} dari {getJadwalLengkapImunisasi().length} Imunisasi Selesai
                  </span>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {['Semua', 'Selesai', 'Akan Datang'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilterStatusJadwal(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      filterStatusJadwal === st
                        ? 'bg-[#E11D48] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'Semua' ? `Semua (${getJadwalLengkapImunisasi().length})` :
                     st === 'Selesai' ? `Sudah Diberikan (${getJadwalLengkapImunisasi().filter(v => v.status === 'Selesai').length})` :
                     `Akan Datang (${getJadwalLengkapImunisasi().filter(v => v.status === 'Akan Datang').length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* List Jadwal Vaksin */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {getJadwalLengkapImunisasi()
                .filter(v => filterStatusJadwal === 'Semua' || v.status === filterStatusJadwal)
                .map((vaksin) => (
                  <div 
                    key={vaksin.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-pink-200 transition-all shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {vaksin.status === 'Selesai' ? (
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 size={18} />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Clock size={18} />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900">{vaksin.nama_vaksin}</h4>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-50 text-[#E11D48] border border-pink-100">
                              {vaksin.jadwal_usia}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                            {vaksin.keterangan}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 whitespace-nowrap ${
                        vaksin.status === 'Selesai' 
                          ? 'bg-[#DCFCE7] text-[#15803D]' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {vaksin.status}
                      </span>
                    </div>

                    {/* Metadata Detail Row */}
                    <div className="p-3 bg-slate-50/70 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Tanggal:</span>
                        <span className="font-semibold text-slate-800">
                          {vaksin.status === 'Selesai' 
                            ? (vaksin.tanggal_diberikan || '15 Jul 2025')
                            : (vaksin.tanggal_rencana || 'Sesuai Jadwal Posyandu')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Lokasi Faskes:</span>
                        <span className="font-semibold text-slate-800">{vaksin.lokasi}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Petugas / Batch:</span>
                        <span className="font-semibold text-slate-800">
                          {vaksin.petugas} {vaksin.no_batch_vaksin !== '-' ? `(${vaksin.no_batch_vaksin})` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <a
                href="https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/Buku_KIA_2024.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#E11D48] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen size={14} />
                <span>Lihat Jadwal Resmi Buku KIA 2024</span>
                <ExternalLink size={12} />
              </a>
              <button
                type="button"
                onClick={() => setShowAllJadwalImunisasi(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Panduan & Tips Setelah Imunisasi (KIPI) Buku KIA 2024 */}
      {showAllTipsImunisasi && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Panduan & Tips Perawatan Setelah Imunisasi (KIPI)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Rangkuman Resmi Buku KIA Kemenkes RI 2024 & Panduan Komnas PP-KIPI
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAllTipsImunisasi(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Banner PDF Buku KIA */}
            <div className="p-3.5 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 rounded-2xl border border-pink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <BookOpen size={18} className="text-[#E11D48] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Dokumen Resmi Buku KIA 2024</span>
                  <span className="text-[11px] text-slate-500">Materi lengkap Kejadian Ikutan Pasca Imunisasi (KIPI) dari Kementerian Kesehatan RI</span>
                </div>
              </div>
              <a
                href="https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/Buku_KIA_2024.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#E11D48] hover:bg-[#BE185D] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
              >
                <Download size={13} />
                <span>Buka PDF Buku KIA</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Filter Kategori Tips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none shrink-0">
              {['Semua', 'Perawatan di Rumah', 'Reaksi Normal', 'Tanda Bahaya KIPI'].map((kat) => (
                <button
                  key={kat}
                  type="button"
                  onClick={() => setFilterKategoriTips(kat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    filterKategoriTips === kat
                      ? 'bg-[#E11D48] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {kat === 'Semua' ? `Semua Tips (${tipsKipiList.length})` :
                   kat === 'Perawatan di Rumah' ? `Perawatan di Rumah (${tipsKipiList.filter(t => t.kategori === 'Perawatan di Rumah').length})` :
                   kat === 'Reaksi Normal' ? `Reaksi Normal (${tipsKipiList.filter(t => t.kategori === 'Reaksi Normal').length})` :
                   `Tanda Bahaya (${tipsKipiList.filter(t => t.kategori === 'Tanda Bahaya KIPI').length})`}
                </button>
              ))}
            </div>

            {/* List Tips & Panduan */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {tipsKipiList
                .filter(t => filterKategoriTips === 'Semua' || t.kategori === filterKategoriTips)
                .map((tip) => (
                  <div 
                    key={tip.id}
                    className={`p-4 rounded-2xl border transition-all space-y-2 ${
                      tip.kategori === 'Tanda Bahaya KIPI'
                        ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                        : 'bg-white border-slate-100 hover:border-pink-200 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          tip.kategori === 'Tanda Bahaya KIPI'
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : tip.kategori === 'Reaksi Normal'
                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                            : 'bg-pink-50 text-[#E11D48] border-pink-100'
                        }`}>
                          {tip.kategori}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{tip.title}</h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                        tip.urgensi.includes('BAHAYA') || tip.urgensi.includes('DARURAT')
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tip.urgensi}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {tip.ringkasan}
                    </p>

                    <div className="p-3 bg-slate-50/80 rounded-xl text-xs text-slate-700 leading-relaxed">
                      {tip.detail}
                    </div>
                  </div>
                ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <div className="text-[11px] text-slate-500">
                Puskesmas Manud Jaya: Hotline KIPI 24 Jam siap siaga
              </div>
              <button
                type="button"
                onClick={() => setShowAllTipsImunisasi(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Input Penimbangan KMS Baru (PBI 02C) */}
      {isModalKmsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center font-bold">
                  <Scale size={18} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">Catat Penimbangan KMS Anak ({activeAnak?.nama || 'Anak'})</h3>
                  <p className="text-[11px] text-slate-400">Pencatatan hasil penimbangan berat & tinggi badan balita {activeAnak?.nama || 'Anak'}</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsModalKmsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSimpanKms} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tanggal Pengukuran *</label>
                  <input 
                    type="date"
                    required
                    value={formKms.tanggal_ukur}
                    onChange={(e) => setFormKms({...formKms, tanggal_ukur: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Usia Anak (Bulan) *</label>
                  <input 
                    type="number"
                    required
                    placeholder="14"
                    value={formKms.usia_bulan}
                    onChange={(e) => setFormKms({...formKms, usia_bulan: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Berat Badan (kg) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    placeholder="9.8"
                    value={formKms.berat_badan}
                    onChange={(e) => setFormKms({...formKms, berat_badan: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tinggi Badan (cm) *</label>
                  <input 
                    type="number"
                    step="0.1"
                    required
                    placeholder="75.0"
                    value={formKms.tinggi_badan}
                    onChange={(e) => setFormKms({...formKms, tinggi_badan: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Lingkar Kepala (cm) *</label>
                  <input 
                    type="number"
                    step="0.1"
                    required
                    placeholder="46.0"
                    value={formKms.lingkar_kepala}
                    onChange={(e) => setFormKms({...formKms, lingkar_kepala: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status Gizi (KMS)</label>
                  <select 
                    value={formKms.status_gizi}
                    onChange={(e) => setFormKms({...formKms, status_gizi: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  >
                    <option value="Gizi Baik (Normal)">Gizi Baik (Normal)</option>
                    <option value="Gizi Kurang">Gizi Kurang</option>
                    <option value="Risiko Gizi Lebih">Risiko Gizi Lebih</option>
                    <option value="Stunting">Indikasi Stunting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Lokasi Posyandu / Faskes</label>
                  <input 
                    type="text"
                    value={formKms.faskes_posyandu}
                    onChange={(e) => setFormKms({...formKms, faskes_posyandu: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Catatan Tambahan Kader</label>
                <textarea 
                  rows={2}
                  value={formKms.catatan}
                  onChange={(e) => setFormKms({...formKms, catatan: e.target.value})}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalKmsOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingKms}
                  className="px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE185D] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isSubmittingKms ? 'Menyimpan...' : 'Simpan Penimbangan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}
