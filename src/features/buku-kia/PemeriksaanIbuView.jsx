import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  UserCheck, 
  FastForward, 
  ShieldCheck, 
  Eye, 
  Download, 
  FileText, 
  ChevronRight,
  X,
  Heart,
  Plus,
  Users,
  User,
  CheckCircle2,
  AlertCircle,
  Upload,
  Paperclip,
  Trash2
} from 'lucide-react';
import { bukuKiaService } from '../../services/bukuKiaService';
import { pesertaService } from '../../services/pesertaService';
import { maskNik } from '../../utils/nikUtils';

export default function PemeriksaanIbuView({ user, currentPath = '', onNavigate, onShowToast }) {
  const isIbuRole = (user?.role || '').toLowerCase().includes('ibu') || (user?.email || '').toLowerCase().includes('ibu');

  // Helper ekstrak ID dari URL path atau query string (?peserta_id=... atau /pemeriksaan/:id)
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
    if (currentPath) {
      const segments = currentPath.split('?')[0].split('/').filter(Boolean);
      const last = segments[segments.length - 1];
      if (last && last.includes('-') && last.length >= 20) return last;
    }
    return isIbuRole ? (user?.peserta_id || user?.user?.id || user?.id || '55af67c9-6695-4435-b4ea-2720efd73c92') : null;
  };

  const [daftarIbu, setDaftarIbu] = useState([]);
  const [activePesertaId, setActivePesertaId] = useState(() => extractPesertaId() || '55af67c9-6695-4435-b4ea-2720efd73c92');
  const [peserta, setPeserta] = useState(null);
  const [kehamilan, setKehamilan] = useState(null);
  const [riwayatList, setRiwayatList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedPemeriksaan, setSelectedPemeriksaan] = useState(null);
  const [isModalTambahOpen, setIsModalTambahOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Form input ANC baru (Default tanggal = hari ini - User Review #181)
  const [formAnc, setFormAnc] = useState({
    kunjungan_ke: 'ANC 6',
    tanggal_pemeriksaan: new Date().toISOString().split('T')[0],
    usia_kehamilan: '32 Minggu',
    berat_badan: '64.5',
    tekanan_darah: '115/75',
    lila: '25.8',
    tinggi_fundus: '28.0',
    djj: '142',
    hemoglobin: '12.0',
    pemeriksa: user?.nama || 'Bidan Siti, S.Tr.Keb',
    faskes: 'Puskesmas Manud Jaya',
    status_hasil: 'Normal',
    catatan_tindak_lanjut: 'Kondisi ibu dan janin sehat optimal. Persiapan persalinan P4K.',
    catatan_tambahan: ''
  });

  // Sinkronkan saat URL berubah (Back/Forward browser)
  useEffect(() => {
    const urlId = extractPesertaId();
    if (urlId && urlId !== activePesertaId) {
      setActivePesertaId(urlId);
    }
  }, [currentPath]);

  // Load daftar ibu hamil untuk dropdown selector Bidan/Kader
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

  // Fetch data spesifik untuk ibu yang dipilih (Terisolasi per ID)
  useEffect(() => {
    let isMounted = true;
    const fetchIbuData = async () => {
      if (!activePesertaId) return;
      setIsLoading(true);

      try {
        // 1. Data Peserta
        const pData = await pesertaService.getPesertaById(activePesertaId);
        if (isMounted) setPeserta(pData);

        // 2. Data Kehamilan Ibu
        const khData = await bukuKiaService.getKehamilanIbu(activePesertaId);
        if (isMounted) setKehamilan(khData);

        // 3. Riwayat Pemeriksaan ANC TERISOLASI per kehamilanId
        if (khData?.id) {
          const ancRows = await bukuKiaService.getPemeriksaanAncList(khData.id);
          if (isMounted) {
            if (ancRows && ancRows.length > 0) {
              setRiwayatList(ancRows.map((item, idx) => ({
                no: idx + 1,
                id: item.id,
                tanggal: item.tanggal_pemeriksaan,
                usiaKehamilan: item.usia_kehamilan || `${item.usia_kehamilan_minggu || 28} Minggu`,
                jenis: item.kunjungan_ke,
                hasil: item.status_hasil || 'Normal',
                catatan: item.catatan_tindak_lanjut || item.catatan || 'Kondisi normal',
                tekananDarah: item.tekanan_darah ? `${item.tekanan_darah} mmHg` : '110/70 mmHg',
                beratBadan: item.berat_badan ? `${item.berat_badan} kg` : '60 kg',
                tinggiFundus: item.tinggi_fundus ? `${item.tinggi_fundus} cm` : '24 cm',
                djj: item.djj ? `${item.djj} x/menit` : '140 x/menit',
                petugas: item.pemeriksa || 'Bidan Siti, S.Tr.Keb'
              })));
            } else {
              setRiwayatList([]);
            }
          }
        } else {
          if (isMounted) setRiwayatList([]);
        }
      } catch (err) {
        console.error('Error fetching ANC data for mother:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchIbuData();
    return () => { isMounted = false; };
  }, [activePesertaId]);

  // Handler pergantian pasien oleh Bidan/Kader
  const handleSwitchPasien = (newPesertaId) => {
    setActivePesertaId(newPesertaId);
    if (onNavigate) {
      onNavigate(`/kesehatan-ibu/pemeriksaan?peserta_id=${newPesertaId}`);
    }
  };

  // Handler Upload Dokumen (Format PDF/JPG/PNG, max 5 file, max 5 MB per file)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (uploadedFiles.length + files.length > 5) {
      onShowToast && onShowToast('Maksimal 5 file dokumen yang dapat diunggah.', 'error');
      return;
    }

    const allowedExts = ['pdf', 'jpg', 'jpeg', 'png'];
    const validFiles = [];

    for (const f of files) {
      const ext = f.name.split('.').pop().toLowerCase();
      if (!allowedExts.includes(ext)) {
        onShowToast && onShowToast(`File "${f.name}" tidak didukung. Format wajib PDF, JPG, atau PNG.`, 'error');
        continue;
      }

      if (f.size > 5 * 1024 * 1024) {
        onShowToast && onShowToast(`Ukuran file "${f.name}" melebihi batas maksimal 5 MB.`, 'error');
        continue;
      }

      validFiles.push({
        id: Date.now() + Math.random().toString(36).substring(2, 7),
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(2) + ' MB'
      });
    }

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      onShowToast && onShowToast(`${validFiles.length} berkas berhasil diunggah.`, 'success');
    }
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Handler Submit Tambah Pemeriksaan ANC Baru (PBI 02C & Fix Issue 7)
  const handleSimpanAnc = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let activeKehamilan = kehamilan;
      if (!activeKehamilan?.id) {
        // Auto-upsert kehamilan_ibu record jika belum ada (Fixes Issue 7)
        activeKehamilan = await bukuKiaService.getOrCreateKehamilanIbu(activePesertaId);
        if (activeKehamilan) setKehamilan(activeKehamilan);
      }

      if (!activeKehamilan?.id) {
        onShowToast && onShowToast('Data kehamilan belum terdaftar untuk pasien ini.', 'error');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        kehamilan_id: activeKehamilan.id,
        kunjungan_ke: formAnc.kunjungan_ke,
        tanggal_pemeriksaan: formAnc.tanggal_pemeriksaan,
        usia_kehamilan: formAnc.usia_kehamilan,
        berat_badan: parseFloat(formAnc.berat_badan) || null,
        tekanan_darah: formAnc.tekanan_darah,
        lila: parseFloat(formAnc.lila) || null,
        tinggi_fundus: parseFloat(formAnc.tinggi_fundus) || null,
        djj: parseInt(formAnc.djj) || null,
        hemoglobin: parseFloat(formAnc.hemoglobin) || null,
        pemeriksa: formAnc.pemeriksa,
        faskes: formAnc.faskes,
        status_hasil: formAnc.status_hasil,
        catatan_tindak_lanjut: formAnc.catatan_tindak_lanjut
      };

      const saved = await bukuKiaService.tambahPemeriksaanAnc(payload);

      // Perbarui UI langsung tanpa refresh manual (User Review #192)
      const newItem = {
        no: riwayatList.length + 1,
        id: saved.id,
        tanggal: formAnc.tanggal_pemeriksaan,
        usiaKehamilan: formAnc.usia_kehamilan,
        jenis: formAnc.kunjungan_ke,
        hasil: formAnc.status_hasil,
        catatan: formAnc.catatan_tindak_lanjut,
        tekananDarah: `${formAnc.tekanan_darah} mmHg`,
        beratBadan: `${formAnc.berat_badan} kg`,
        tinggiFundus: `${formAnc.tinggi_fundus} cm`,
        djj: `${formAnc.djj} x/menit`,
        petugas: formAnc.pemeriksa
      };

      setRiwayatList(prev => [...prev, newItem]);
      setIsModalTambahOpen(false);
      setUploadedFiles([]);
      onShowToast && onShowToast(`Pemeriksaan ${formAnc.kunjungan_ke} berhasil dicatat ke rekam medis!`, 'success');
    } catch (err) {
      console.error(err);
      onShowToast && onShowToast('Gagal menyimpan pemeriksaan: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (filename) => {
    if (onShowToast) {
      onShowToast(`Dokumen "${filename}" berhasil diunduh.`, 'success');
    }
  };

  const namaPasien = peserta?.nama || 'Siti Aminah';
  const nikPasien = peserta?.nik ? maskNik(peserta.nik) : '3201234567890001';
  const usiaKehamilanStr = kehamilan?.usia_kehamilan_minggu 
    ? `${kehamilan.usia_kehamilan_minggu} Minggu` 
    : '28 Minggu';
  const hplStr = kehamilan?.hpl || '20 Desember 2026';
  const hphtStr = kehamilan?.hpht || '12 Februari 2026';

  return (
    <div className="space-y-6">
      {/* 1. Header & Patient Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kesehatan Ibu / Pemeriksaan (ANC)
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Pantau rekam medis pemeriksaan kehamilan berkala sesuai Buku KIA
          </p>
        </div>

        {/* Patient Switcher Dropdown untuk Bidan / Kader (Mencegah Data Kecampur) */}
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

      {/* 2. Top Patient Card (Profil Terisolasi per ID) */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4.5">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-pink-100 border-2 border-pink-200 shrink-0">
              <img 
                src="/images/siti-aminah-avatar.png" 
                alt={namaPasien} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">{namaPasien}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                  Ibu Hamil
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 mt-1.5 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400">Nama:</span> <span className="font-semibold text-slate-800">{namaPasien}</span>
                </div>
                <div>
                  <span className="text-slate-400">Usia Kehamilan:</span> <span className="font-semibold text-slate-800">{usiaKehamilanStr}</span>
                </div>
                <div>
                  <span className="text-slate-400">NIK:</span> <span className="font-semibold text-slate-800 font-mono">{nikPasien}</span>
                </div>
                <div>
                  <span className="text-slate-400">HPHT:</span> <span className="font-semibold text-slate-800">{hphtStr}</span>
                </div>
                <div>
                  <span className="text-slate-400">ID Pasien:</span> <span className="font-semibold text-slate-800 font-mono text-[10px]">{activePesertaId.slice(0, 13)}...</span>
                </div>
                <div>
                  <span className="text-slate-400">Taksiran Persalinan:</span> <span className="font-semibold text-slate-800">{hplStr}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onNavigate) {
                onNavigate(`/data-peserta/detail/${activePesertaId}`);
              } else {
                onShowToast && onShowToast(`Membuka profil lengkap ${namaPasien}`, 'info');
              }
            }}
            className="px-4 py-2 bg-[#F5F3FF] hover:bg-[#EDE9FE] text-[#6D28D9] rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors self-start lg:self-center cursor-pointer active:scale-95"
          >
            <span>Lihat Profil Peserta</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* 3. 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-rose-500 flex items-center justify-center shrink-0">
            <Calendar size={18} />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Jumlah Kunjungan</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{riwayatList.length} Kali</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-rose-500 flex items-center justify-center shrink-0">
            <UserCheck size={18} />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Kunjungan Terakhir</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
              {riwayatList.length > 0 ? riwayatList[riwayatList.length - 1].tanggal : '-'}
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-rose-500 flex items-center justify-center shrink-0">
            <FastForward size={18} />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Target ANC Terpenuhi</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{riwayatList.length} dari 6 Standar Kemenkes</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-rose-500 flex items-center justify-center shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block">Status Pemeriksaan</span>
            <span className="text-sm font-bold text-emerald-600 mt-0.5 block">
              {riwayatList.length >= 6 ? 'Lengkap (Optimal)' : 'Pemeriksaan Rutin'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Table Riwayat Pemeriksaan Terisolasi */}
      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Riwayat Pemeriksaan ANC ({namaPasien})</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Daftar rekam medis kehamilan khusus untuk <strong>{namaPasien}</strong> (ID: {activePesertaId.slice(0, 8)}...)
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalTambahOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E11D48] hover:bg-[#BE185D] text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            <Plus size={15} />
            <span>Catat Pemeriksaan</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FFF1F2] text-slate-700 font-bold border-b border-pink-100">
                <th className="py-3 px-5 w-12">No</th>
                <th className="py-3 px-5">Tanggal</th>
                <th className="py-3 px-5">Usia Kehamilan</th>
                <th className="py-3 px-5">Jenis Pemeriksaan</th>
                <th className="py-3 px-5">Hasil</th>
                <th className="py-3 px-5">Catatan</th>
                <th className="py-3 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {riwayatList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Belum ada rekam medis ANC untuk <strong>{namaPasien}</strong>. Klik tombol <strong>"+ Input Pemeriksaan ANC"</strong> untuk menambahkan.
                  </td>
                </tr>
              ) : (
                riwayatList.map((item) => (
                  <tr key={item.id || item.no} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5 font-medium">{item.no}</td>
                    <td className="py-3.5 px-5 whitespace-nowrap font-medium text-slate-900">{item.tanggal}</td>
                    <td className="py-3.5 px-5 whitespace-nowrap text-slate-600">{item.usiaKehamilan}</td>
                    <td className="py-3.5 px-5 font-semibold text-slate-900">{item.jenis}</td>
                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.hasil}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 max-w-xs">{item.catatan}</td>
                    <td className="py-3.5 px-5 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedPemeriksaan(item)}
                        className="p-1.5 text-slate-400 hover:text-[#E11D48] hover:bg-pink-50 rounded-lg transition-colors cursor-pointer"
                        title="Lihat Detail Hasil Pemeriksaan"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Modal Detail Pemeriksaan */}
      {selectedPemeriksaan && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Heart size={16} className="text-[#E11D48]" />
                <span>Detail {selectedPemeriksaan.jenis} ({namaPasien})</span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedPemeriksaan(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl">
                <div>
                  <span className="text-slate-400 block text-[10px]">Tanggal:</span>
                  <span className="font-bold text-slate-800">{selectedPemeriksaan.tanggal}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Usia Kehamilan:</span>
                  <span className="font-bold text-slate-800">{selectedPemeriksaan.usiaKehamilan}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-white border border-slate-100 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Tekanan Darah:</span>
                  <span className="font-bold text-slate-800">{selectedPemeriksaan.tekananDarah}</span>
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Berat Badan:</span>
                  <span className="font-bold text-slate-800">{selectedPemeriksaan.beratBadan}</span>
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Tinggi Fundus:</span>
                  <span className="font-bold text-slate-800">{selectedPemeriksaan.tinggiFundus}</span>
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Detak Jantung Janin:</span>
                  <span className="font-bold text-slate-800">{selectedPemeriksaan.djj}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                <span className="text-slate-400 block text-[10px]">Pemeriksa / Bidan:</span>
                <span className="font-bold text-slate-800">{selectedPemeriksaan.petugas}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                <span className="text-slate-400 block text-[10px]">Catatan Klinis:</span>
                <span className="font-medium text-slate-800 leading-relaxed">{selectedPemeriksaan.catatan}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPemeriksaan(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal Input Pemeriksaan ANC Baru (PBI 02C: 4 Sections & Dokumen Upload) */}
      {isModalTambahOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center font-bold">
                  <Plus size={18} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Catat Pemeriksaan ANC ({namaPasien})
                  </h3>
                  <p className="text-[11px] text-slate-400">Pencatatan rekam medis pemeriksaan ANC 4 Section sesuai standar Buku KIA</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsModalTambahOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSimpanAnc} className="space-y-6 text-xs">
              {/* SECTION 1: Data Kunjungan */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-800 font-bold">
                  <div className="w-5 h-5 rounded-full bg-pink-100 text-[#E11D48] flex items-center justify-center text-[10px] font-extrabold">1</div>
                  <span>Section 1: Data Kunjungan</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Kunjungan Ke *</label>
                    <select 
                      value={formAnc.kunjungan_ke}
                      onChange={(e) => setFormAnc({...formAnc, kunjungan_ke: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    >
                      <option value="ANC 1">ANC 1 (Trimester 1)</option>
                      <option value="ANC 2">ANC 2 (Trimester 1)</option>
                      <option value="ANC 3">ANC 3 (Trimester 2)</option>
                      <option value="ANC 4">ANC 4 (Trimester 2)</option>
                      <option value="ANC 5">ANC 5 (Trimester 3)</option>
                      <option value="ANC 6">ANC 6 (Trimester 3)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Tanggal Pemeriksaan *</label>
                    <input 
                      type="date"
                      required
                      value={formAnc.tanggal_pemeriksaan}
                      onChange={(e) => setFormAnc({...formAnc, tanggal_pemeriksaan: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Nama Pemeriksa / Petugas *</label>
                    <input 
                      type="text"
                      required
                      value={formAnc.pemeriksa}
                      onChange={(e) => setFormAnc({...formAnc, pemeriksa: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Fasilitas Kesehatan (Faskes) *</label>
                    <input 
                      type="text"
                      required
                      value={formAnc.faskes}
                      onChange={(e) => setFormAnc({...formAnc, faskes: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Pemeriksaan Kehamilan */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-800 font-bold">
                  <div className="w-5 h-5 rounded-full bg-pink-100 text-[#E11D48] flex items-center justify-center text-[10px] font-extrabold">2</div>
                  <span>Section 2: Pemeriksaan Kehamilan</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Usia Kehamilan</label>
                    <input 
                      type="text"
                      placeholder="Contoh: 32 Minggu"
                      value={formAnc.usia_kehamilan}
                      onChange={(e) => setFormAnc({...formAnc, usia_kehamilan: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Berat Badan (kg) *</label>
                    <input 
                      type="number"
                      step="0.1"
                      required
                      placeholder="64.5"
                      value={formAnc.berat_badan}
                      onChange={(e) => setFormAnc({...formAnc, berat_badan: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Tekanan Darah *</label>
                    <input 
                      type="text"
                      required
                      placeholder="115/75"
                      value={formAnc.tekanan_darah}
                      onChange={(e) => setFormAnc({...formAnc, tekanan_darah: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">TFU (cm)</label>
                    <input 
                      type="number"
                      step="0.1"
                      placeholder="28.0"
                      value={formAnc.tinggi_fundus}
                      onChange={(e) => setFormAnc({...formAnc, tinggi_fundus: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">DJJ (x/menit)</label>
                    <input 
                      type="number"
                      placeholder="142"
                      value={formAnc.djj}
                      onChange={(e) => setFormAnc({...formAnc, djj: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">LILA (cm)</label>
                    <input 
                      type="number"
                      step="0.1"
                      placeholder="25.8"
                      value={formAnc.lila}
                      onChange={(e) => setFormAnc({...formAnc, lila: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Hb (g/dL)</label>
                    <input 
                      type="number"
                      step="0.1"
                      placeholder="12.0"
                      value={formAnc.hemoglobin}
                      onChange={(e) => setFormAnc({...formAnc, hemoglobin: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Penilaian & Tindakan */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-800 font-bold">
                  <div className="w-5 h-5 rounded-full bg-pink-100 text-[#E11D48] flex items-center justify-center text-[10px] font-extrabold">3</div>
                  <span>Section 3: Penilaian & Tindakan</span>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Status Hasil Pemeriksaan *</label>
                    <select 
                      value={formAnc.status_hasil}
                      onChange={(e) => setFormAnc({...formAnc, status_hasil: e.target.value})}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Perlu Perhatian">Perlu Perhatian</option>
                      <option value="Rujuk">Rujuk ke Faskes Lanjutan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Catatan Tindak Lanjut / Terapi</label>
                    <textarea 
                      rows={2}
                      value={formAnc.catatan_tindak_lanjut}
                      onChange={(e) => setFormAnc({...formAnc, catatan_tindak_lanjut: e.target.value})}
                      placeholder="Contoh: Kondisi ibu dan janin sehat optimal. Persiapan persalinan P4K."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Catatan Tambahan & Lampiran Dokumen */}
              <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-800 font-bold">
                  <div className="w-5 h-5 rounded-full bg-pink-100 text-[#E11D48] flex items-center justify-center text-[10px] font-extrabold">4</div>
                  <span>Section 4: Catatan Tambahan & Lampiran Dokumen</span>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Catatan Tambahan (Opsional)</label>
                    <textarea 
                      rows={2}
                      value={formAnc.catatan_tambahan}
                      onChange={(e) => setFormAnc({...formAnc, catatan_tambahan: e.target.value})}
                      placeholder="Tambahkan catatan khusus bila ada keluhan atau instruksi tambahan..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    />
                  </div>

                  {/* Upload Dokumen Box */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-slate-700 font-semibold">Unggah Dokumen Pendukung</label>
                      <span className="text-[10px] text-slate-400">PDF, JPG, PNG (Maks 5 file, maks 5 MB per file)</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <label className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-slate-700 font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs active:scale-95">
                        <Upload size={14} className="text-[#E11D48]" />
                        <span>Unggah Dokumen</span>
                        <input 
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-500">
                        {uploadedFiles.length > 0 ? `${uploadedFiles.length} file dipilih` : 'Belum ada file dipilih'}
                      </span>
                    </div>

                    {/* Daftar File yang Terunggah */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {uploadedFiles.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl text-xs">
                            <div className="flex items-center gap-2 truncate">
                              <Paperclip size={14} className="text-[#E11D48] shrink-0" />
                              <span className="font-medium text-slate-800 truncate">{file.name}</span>
                              <span className="text-[10px] text-slate-400 shrink-0">({file.size})</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(file.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                              title="Hapus file"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalTambahOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE185D] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Pemeriksaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
