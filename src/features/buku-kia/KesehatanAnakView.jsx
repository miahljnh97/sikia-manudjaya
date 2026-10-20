import React, { useState, useEffect } from 'react';
import { 
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
  X
} from 'lucide-react';

export default function KesehatanAnakView({ subFeature = 'Pertumbuhan', onNavigate, onShowToast }) {
  const [activeSub, setActiveSub] = useState(subFeature);
  const [activeChartTab, setActiveChartTab] = useState('Berat Badan');
  const [selectedStimulasi, setSelectedStimulasi] = useState(null);

  useEffect(() => {
    if (subFeature) {
      setActiveSub(subFeature);
    }
  }, [subFeature]);

  // Data Pencapaian Perkembangan (Image 1)
  const pencapaianMilestones = [
    { title: 'Duduk tanpa Bantuan', usia: 'Usia 6 Bulan', tanggal: '20 Feb 2026' },
    { title: 'Merangkak', usia: 'Usia 6 Bulan', tanggal: '20 Feb 2026' },
    { title: 'Berdiri dengan berpegagngan', usia: 'Usia 6 Bulan', tanggal: '20 Feb 2026' },
    { title: 'Berjalan beberapa langkah', usia: 'Usia 12 Bulan', tanggal: '20 Feb 2026' },
  ];

  // Data Aktivitas Stimulasi Rekomendasi (Image 1)
  const aktivitasStimulasi = [
    {
      title: 'Latihan Berjalan',
      desc: 'Ajak anak berjalan dengan bantuan di lingkungan aman.',
      icon: Footprints,
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
      icon: Boxes,
      detail: 'Sediakan balok susun berukuran aman (tidak tertelan). Ajarkan cara menumpuk 2-3 balok ke atas dan biarkan anak merubuhkannya dengan gembira.'
    }
  ];

  // State & Data Riwayat Pertumbuhan (PBI 02C & AC 1)
  const [isModalKmsOpen, setIsModalKmsOpen] = useState(false);
  const [isSubmittingKms, setIsSubmittingKms] = useState(false);

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

  const [riwayatPertumbuhan, setRiwayatPertumbuhan] = useState([
    { no: 1, tanggal: '12 Sep 2026', usia: '14 Bulan', bb: '9,8 Kg', tb: '75 Cm', lk: '46 Cm', status: 'Normal' },
    { no: 2, tanggal: '15 Agu 2026', usia: '13 Bulan', bb: '9,4 Kg', tb: '73 Cm', lk: '45,5 Cm', status: 'Normal' },
  ]);

  useEffect(() => {
    bukuKiaService.getPertumbuhanAnakList().then((res) => {
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
      }
    });
  }, []);

  const handleSimpanKms = async (e) => {
    e.preventDefault();
    setIsSubmittingKms(true);
    try {
      const payload = {
        anak_id: 'b2222222-2222-2222-2222-222222222222',
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
      onShowToast && onShowToast('Hasil penimbangan KMS anak berhasil disimpan ke database!', 'success');
    } catch (err) {
      console.error(err);
      onShowToast && onShowToast('Gagal menyimpan penimbangan anak', 'error');
    } finally {
      setIsSubmittingKms(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Halaman */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Kesehatan Anak / {activeSub}
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          {activeSub === 'Perkembangan'
            ? 'Pantau tumbuh kembang anak sesuai tahap usianya dengan panduan buku KIA'
            : 'Pantau pertumbuhan dan perkembangan anak sesuai panduan buku KIA'}
        </p>
      </div>

      {/* =====================================================================
          SUB-PAGE 1: PERTUMBUHAN (Image 4)
      ====================================================================== */}
      {activeSub === 'Pertumbuhan' && (
        <div className="space-y-6">
          {/* Top Banner Profil Anak */}
          <div className="bg-gradient-to-r from-[#FFF0F4] via-[#FFE4EC] to-[#FFD6E4] border border-pink-200/70 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 min-h-[160px]">
            <div className="space-y-4 max-w-xl">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Usia Anak</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#E11D48] tracking-tight">
                    1 Tahun 2 Bulan
                  </h2>
                  <span className="text-xs font-semibold text-slate-500">150 Hari</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-2 bg-white/80 px-3.5 py-2 rounded-2xl border border-pink-200/60">
                  <Calendar size={16} className="text-[#E11D48]" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Tanggal lahir</span>
                    <span className="font-bold text-slate-900">20 Desember 2026</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white/80 px-3.5 py-2 rounded-2xl border border-pink-200/60">
                  <Smile size={16} className="text-[#E11D48]" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Jenis Kelamin</span>
                    <span className="font-bold text-[#E11D48]">Laki–Laki</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ilustrasi Anak di Kanan */}
            <div className="hidden sm:flex items-end self-end pointer-events-none -mr-2 -mb-2">
              <img 
                src="/images/anak-pertumbuhan.png" 
                alt="Ilustrasi Anak Pertumbuhan" 
                className="h-36 sm:h-40 object-contain drop-shadow-sm"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </div>

          {/* 4 Kartu Metrik Pertumbuhan Terakhir */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. BB Terakhir */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                <Scale size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Berat Badan Terakhir</span>
                <span className="text-sm sm:text-base font-bold text-slate-900 leading-tight">9,8 Kg</span>
              </div>
            </div>

            {/* 2. TB Terakhir */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                <Ruler size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Tinggi Badan Terakhir</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm sm:text-base font-bold text-slate-900 leading-tight">50 cm</span>
                  <span className="text-[10px] text-slate-400">Naik 2cm</span>
                </div>
              </div>
            </div>

            {/* 3. LK Terakhir */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                <Smile size={18} />
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
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                <ShoppingBag size={18} />
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
              <h3 className="text-sm font-bold text-slate-900">Grafik Pertumbuhan</h3>

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

              {/* Line Chart SVG */}
              <div className="relative pt-4">
                <svg viewBox="0 0 500 200" className="w-full h-44 overflow-visible">
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="40" y1="60" x2="480" y2="60" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="40" y1="100" x2="480" y2="100" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="40" y1="140" x2="480" y2="140" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="40" y1="180" x2="480" y2="180" stroke="#E2E8F0" />

                  <text x="30" y="25" fontSize="10" fill="#94A3B8" textAnchor="end">100</text>
                  <text x="30" y="65" fontSize="10" fill="#94A3B8" textAnchor="end">80</text>
                  <text x="30" y="105" fontSize="10" fill="#94A3B8" textAnchor="end">60</text>
                  <text x="30" y="145" fontSize="10" fill="#94A3B8" textAnchor="end">40</text>
                  <text x="30" y="183" fontSize="10" fill="#94A3B8" textAnchor="end">0</text>

                  <text x="60" y="195" fontSize="10" fill="#64748B" textAnchor="middle">12</text>
                  <text x="160" y="195" fontSize="10" fill="#64748B" textAnchor="middle">16</text>
                  <text x="260" y="195" fontSize="10" fill="#64748B" textAnchor="middle">20</text>
                  <text x="360" y="195" fontSize="10" fill="#64748B" textAnchor="middle">24</text>
                  <text x="460" y="195" fontSize="10" fill="#64748B" textAnchor="middle">28</text>

                  {/* Gradient Area under line */}
                  <defs>
                    <linearGradient id="pertumbuhanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF4D80" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#FF4D80" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <path 
                    d="M 60 120 L 160 100 L 260 96 L 360 88 L 460 82 L 460 180 L 60 180 Z" 
                    fill="url(#pertumbuhanGrad)" 
                  />

                  <path 
                    d="M 60 120 L 160 100 L 260 96 L 360 88 L 460 82" 
                    fill="none" 
                    stroke="#FF4D80" 
                    strokeWidth="2.5" 
                  />

                  {[[60, 120], [160, 100], [260, 96], [360, 88], [460, 82]].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="4" fill="#FFFFFF" stroke="#FF4D80" strokeWidth="2" />
                  ))}
                </svg>

                <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-slate-500 font-medium">
                  <span className="w-3 h-0.5 bg-[#FF4D80]" />
                  <span>{activeChartTab}</span>
                </div>
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
                    <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#FF4D80] flex items-center justify-center shrink-0 mt-0.5">
                      <Zap size={16} />
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
                    <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#FF4D80] flex items-center justify-center shrink-0 mt-0.5">
                      <Zap size={16} />
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
                    <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#FF4D80] flex items-center justify-center shrink-0 mt-0.5">
                      <Zap size={16} />
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
                <h3 className="text-sm font-bold text-slate-900">Riwayat Pertumbuhan</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Pencatatan penimbangan berat, tinggi badan & lingkar kepala (KMS Digital)</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalKmsOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E11D48] hover:bg-[#BE185D] text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <Plus size={15} />
                <span>Catat Penimbangan KMS</span>
              </button>
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
                  {riwayatPertumbuhan.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 text-center font-medium">{row.no}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{row.tanggal}</td>
                      <td className="py-3.5 px-4 text-slate-600">{row.usia}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{row.bb}</td>
                      <td className="py-3.5 px-4 text-slate-600">{row.tb}</td>
                      <td className="py-3.5 px-4 text-slate-600">{row.lk}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D]">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
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
          {/* Top Card: Profil Anak Farhan */}
          <div className="bg-gradient-to-r from-[#FFF0F4] via-[#FFE4EC] to-[#FFD6E4] border border-pink-200/70 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white shadow-xs overflow-hidden shrink-0">
                <img 
                  src="/images/farhan-avatar.png" 
                  alt="Farhan" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Farhan
                </h2>
                <p className="text-xs font-bold text-[#E11D48] mt-0.5">
                  1 Tahun 2 bulan
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  Laki – Laki &nbsp;20 Desember 2026
                </p>
              </div>
            </div>

            {/* 2 Quick Cards di Kanan */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Card 1 */}
              <div className="bg-white/90 rounded-2xl p-3.5 px-4 border border-pink-100 flex items-center gap-3 flex-1 sm:flex-none">
                <Calendar size={18} className="text-[#E11D48]" />
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Tahap Perkembangan</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">12 - 18 Bulan</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white/90 rounded-2xl p-3.5 px-4 border border-pink-100 flex items-center gap-3 flex-1 sm:flex-none">
                <BarChart3 size={18} className="text-[#E11D48]" />
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Status Perkembangan</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-600">Sesuai Usia</span>
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
                Perkembangan Farhan sesuai dengan tahapan usianya. Terus berikan stimulasi secara rutin
              </p>
            </div>

            {/* Card 2: Riwayat Skrining */}
            <div className="md:col-span-3 bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <History size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Riwayat Skrining</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-extrabold text-slate-900">3</span>
                  <span className="text-xs text-slate-500 font-medium">kali discreening</span>
                </div>
              </div>
            </div>

            {/* Card 3: Stimulasi Hari Ini */}
            <div 
              onClick={() => onShowToast && onShowToast('Farhan memiliki 3 aktivitas stimulasi yang disarankan hari ini.', 'info')}
              className="md:col-span-3 bg-white border border-slate-100 hover:border-pink-200 rounded-3xl p-5 shadow-xs flex items-center justify-between cursor-pointer group transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <Target size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Stimulasi Hari Ini</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl font-extrabold text-slate-900">3</span>
                    <span className="text-xs text-slate-500 font-medium">aktivitas disarankan</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
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
                  onClick={() => onShowToast && onShowToast('Membuka checklist lengkap KPSP Buku KIA...', 'info')}
                  className="text-xs font-semibold text-[#FF4D80] hover:text-[#E11D48] cursor-pointer"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="space-y-3">
                {pencapaianMilestones.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-100 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">{item.usia}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{item.tanggal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grafik Pertumbuhan */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Grafik Pertumbuhan</h3>

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

              {/* Line Chart SVG */}
              <div className="relative pt-4">
                <svg viewBox="0 0 500 200" className="w-full h-44 overflow-visible">
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="40" y1="60" x2="480" y2="60" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="40" y1="100" x2="480" y2="100" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="40" y1="140" x2="480" y2="140" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="40" y1="180" x2="480" y2="180" stroke="#E2E8F0" />

                  <text x="30" y="25" fontSize="10" fill="#94A3B8" textAnchor="end">100</text>
                  <text x="30" y="65" fontSize="10" fill="#94A3B8" textAnchor="end">80</text>
                  <text x="30" y="105" fontSize="10" fill="#94A3B8" textAnchor="end">60</text>
                  <text x="30" y="145" fontSize="10" fill="#94A3B8" textAnchor="end">40</text>
                  <text x="30" y="183" fontSize="10" fill="#94A3B8" textAnchor="end">0</text>

                  <text x="60" y="195" fontSize="10" fill="#64748B" textAnchor="middle">12</text>
                  <text x="160" y="195" fontSize="10" fill="#64748B" textAnchor="middle">16</text>
                  <text x="260" y="195" fontSize="10" fill="#64748B" textAnchor="middle">20</text>
                  <text x="360" y="195" fontSize="10" fill="#64748B" textAnchor="middle">24</text>
                  <text x="460" y="195" fontSize="10" fill="#64748B" textAnchor="middle">28</text>

                  {/* Gradient Area under line */}
                  <defs>
                    <linearGradient id="perkembanganGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF4D80" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#FF4D80" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <path 
                    d="M 60 120 L 160 100 L 260 96 L 360 88 L 460 82 L 460 180 L 60 180 Z" 
                    fill="url(#perkembanganGrad)" 
                  />

                  <path 
                    d="M 60 120 L 160 100 L 260 96 L 360 88 L 460 82" 
                    fill="none" 
                    stroke="#FF4D80" 
                    strokeWidth="2.5" 
                  />

                  {[[60, 120], [160, 100], [260, 96], [360, 88], [460, 82]].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="4" fill="#FFFFFF" stroke="#FF4D80" strokeWidth="2" />
                  ))}
                </svg>

                <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-slate-500 font-medium">
                  <span className="w-3 h-0.5 bg-[#FF4D80]" />
                  <span>{activeChartTab}</span>
                </div>
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
                      <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[#FF4D80] flex items-center justify-center shrink-0">
                        <IconComponent size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#FF4D80] transition-colors">
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
          SUB-PAGE 3: IMUNISASI (Image 3)
      ====================================================================== */}
      {activeSub === 'Imunisasi' && (
        <div className="space-y-6">
          {/* Top Card: Profil Anak Farhan */}
          <div className="bg-gradient-to-r from-[#FFF0F4] via-[#FFE4EC] to-[#FFD6E4] border border-pink-200/70 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white shadow-xs overflow-hidden shrink-0">
                <img 
                  src="/images/farhan-avatar.png" 
                  alt="Farhan" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Farhan
                </h2>
                <p className="text-xs font-bold text-[#E11D48] mt-0.5">
                  1 Tahun 2 bulan
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  Laki – Laki &nbsp;20 Desember 2026
                </p>
              </div>
            </div>

            {/* 2 Quick Cards di Kanan */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Card 1: Imunisasi Selesai */}
              <div className="bg-white/90 rounded-2xl p-3.5 px-4 border border-pink-100 flex items-center gap-3 flex-1 sm:flex-none">
                <Syringe size={18} className="text-[#E11D48]" />
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Imunisasi Selesai</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">7 / 9</span>
                </div>
              </div>

              {/* Card 2: Status Imunisasi */}
              <div className="bg-white/90 rounded-2xl p-3.5 px-4 border border-pink-100 flex items-center gap-3 flex-1 sm:flex-none">
                <CheckCircle2 size={18} className="text-emerald-500" />
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Status Imunisasi</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-600">Sesuai Jadwal</span>
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
                  onClick={() => onShowToast && onShowToast('Membuka jadwal imunisasi lengkap...', 'info')}
                  className="text-xs font-semibold text-[#FF4D80] hover:text-[#E11D48] cursor-pointer"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { title: 'Hepatitis B', usia: 'Usia 0–7 Hari', tanggal: '20 Feb 2026' },
                  { title: 'BCG', usia: 'Usia 1 Bulan', tanggal: '20 Feb 2026' },
                  { title: 'Polio 1', usia: 'Usia 0–7 Hari', tanggal: '20 Feb 2026' },
                  { title: 'Polio 2', usia: 'Usia 0–7 Hari', tanggal: '20 Feb 2026' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100 group hover:border-pink-200 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-100 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#E11D48] transition-colors">{item.title}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">{item.usia}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D]">
                        Selesai
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{item.tanggal}</span>
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kolom Kanan: Detail Campak Rubella & Tips Setelah Imunisasi */}
            <div className="lg:col-span-7 space-y-4">
              {/* 2 Kartu Atas: Jadwal Campak & Manfaat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Campak Rubella</span>
                    <span className="text-xs sm:text-sm font-bold text-[#E11D48] leading-tight block mt-0.5">
                      20 Desember 2026
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Heart size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Manfaat</span>
                    <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                      Melindungi anak dari penyakit campak dan rubella yang dapat menyebabkan komplikasi serius
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips Setelah Imunisasi */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Tips Setelah Imunisasi</h3>
                  <button 
                    type="button"
                    onClick={() => onShowToast && onShowToast('Membuka panduan KIPI Buku KIA...', 'info')}
                    className="text-xs font-semibold text-[#FF4D80] hover:text-[#E11D48] cursor-pointer"
                  >
                    Lihat Semua
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tip 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#FF4D80] flex items-center justify-center shrink-0 mt-0.5">
                      <Zap size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Berikan ASI lebih sering</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Membantu menenangkan anak.</p>
                    </div>
                  </div>

                  {/* Tip 2 */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#FF4D80] flex items-center justify-center shrink-0 mt-0.5">
                      <Zap size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Segera ke Faskes</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Jika demam tinggi, kejang atau reaksi berat lainnya</p>
                    </div>
                  </div>

                  {/* Tip 3 */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#FF4D80] flex items-center justify-center shrink-0 mt-0.5">
                      <Zap size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Kompres hangat jika demam</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Rekomendasi pemberian makan sesuai usia anak</p>
                    </div>
                  </div>

                  {/* Tip 4 */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#FF4D80] flex items-center justify-center shrink-0 mt-0.5">
                      <Zap size={14} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Pantau Suhu tubuh Anak</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Demam ringan adalah hal yang umum setelah imunisasi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel: Riwayat Imunisasi */}
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-6 border-b border-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Riwayat Imunisasi</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FFE4EC]/70 text-slate-800 font-bold border-b border-pink-100">
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
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 text-center font-medium">1</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">12 Sep 2026</td>
                    <td className="py-3.5 px-4 text-slate-600">14 Bulan</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">DPT-HB-Hb 3</td>
                    <td className="py-3.5 px-4 text-slate-600">Puskesmas Maju Jaya</td>
                    <td className="py-3.5 px-4 text-slate-600">Bidan Sari</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onShowToast && onShowToast('Detail vaksin: DPT-HB-Hib 3 No. Batch V-9821, kondisi anak sehat pasca vaksinasi.', 'info')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 text-center font-medium">1</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">12 Sep 2026</td>
                    <td className="py-3.5 px-4 text-slate-600">14 Bulan</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">DPT-HB-Hb 3</td>
                    <td className="py-3.5 px-4 text-slate-600">Puskesmas Maju Jaya</td>
                    <td className="py-3.5 px-4 text-slate-600">Bidan Sari</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onShowToast && onShowToast('Detail vaksin: DPT-HB-Hib 3 No. Batch V-9821, kondisi anak sehat pasca vaksinasi.', 'info')}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

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
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">Catat Penimbangan KMS Anak</h3>
                  <p className="text-[11px] text-slate-400">Pencatatan hasil penimbangan berat & tinggi badan balita Farhan</p>
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
    </div>
  );
}
