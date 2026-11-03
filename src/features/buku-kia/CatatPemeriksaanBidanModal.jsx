import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Calendar, 
  Stethoscope, 
  ClipboardCheck, 
  FileText, 
  Upload, 
  Trash2, 
  Check, 
  User,
  AlertCircle
} from 'lucide-react';
import { formatTanggalIndo } from '../../utils/dateUtils';
import { maskNik } from '../../utils/nikUtils';
import { bukuKiaService } from '../../services/bukuKiaService';
import { storageService } from '../../services/storageService';

export default function CatatPemeriksaanBidanModal({
  isOpen,
  onClose,
  pasien,
  currentUser,
  onSuccess,
  onShowToast
}) {
  if (!isOpen || !pasien) return null;

  const [loadingKehamilan, setLoadingKehamilan] = useState(false);
  const [kehamilan, setKehamilan] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    // Section 1: Data Kunjungan
    tanggal_kunjungan: new Date().toISOString().split('T')[0],
    jenis_pelayanan: pasien.jenis_peserta === 'Ibu Hamil' ? 'Pemeriksaan kehamilan (ANC)' : 'Pemeriksaan Kesehatan Balita',
    kunjungan_ke: 'ANC 4',
    tempat_pelayanan: 'Puskesmas Manud Jaya',
    keluhan_utama: 'Kontrol rutin, sering merasa pegal di punggung',

    // Section 2: Pemeriksaan Kehamilan
    status_kehamilan: 'Kehamilan tunggal',
    usia_kehamilan: '28 minggu 3 hari',
    tinggi_fundus: '26',
    djj: '140',
    letak_janin: 'Kepala',
    presentasi_janin: 'Kepala',
    gerakan_janin: 'Aktif',
    kontraksi: 'Tidak ada',
    kontraksi_ket: '',
    edema: 'Tidak ada',
    varises: 'Tidak ada',
    tanda_bahaya: 'Tidak ada',
    hasil_usg: '',

    // Section 3: Penilaian & Tindakan
    status_risiko: 'Tidak berisiko',
    diagnosa: 'Kehamilan normal, janin dalam kondisi baik.',
    tindakan_diberikan: ['Pemeriksaan ANC rutin', 'Konseling'],
    tindakan_lainnya: '',
    edukasi_diberikan: [
      'Nutrisi kehamilan',
      'Tanda bahaya kehamilan',
      'Aktivitas fisik yang aman',
      'Persiapan persalinan'
    ],
    tanggal_kontrol_berikutnya: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 28);
      return d.toISOString().split('T')[0];
    })(),
    kunjungan_berikutnya: 'ANC 5',

    // Section 4: Catatan Tambahan & Lampiran
    catatan_nakes: '',
    lampiran_dokumen: []
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // Fetch data kehamilan jika pasien adalah Ibu Hamil
  useEffect(() => {
    let isMounted = true;
    if (pasien.jenis_peserta === 'Ibu Hamil' || pasien.status_ibu === 'hamil') {
      setLoadingKehamilan(true);
      bukuKiaService.getKehamilanIbu(pasien.id).then((kh) => {
        if (isMounted && kh) {
          setKehamilan(kh);
          if (kh.usia_kehamilan_minggu) {
            setForm((prev) => ({
              ...prev,
              usia_kehamilan: `${kh.usia_kehamilan_minggu} minggu 3 hari`
            }));
          }
        }
        if (isMounted) setLoadingKehamilan(false);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [pasien]);

  // Handler toggle checkbox tindakan
  const handleToggleTindakan = (tindakan) => {
    setForm((prev) => {
      const exists = prev.tindakan_diberikan.includes(tindakan);
      return {
        ...prev,
        tindakan_diberikan: exists
          ? prev.tindakan_diberikan.filter((t) => t !== tindakan)
          : [...prev.tindakan_diberikan, tindakan]
      };
    });
  };

  // Handler add & remove edukasi tags
  const handleRemoveEdukasi = (tagToRemove) => {
    setForm((prev) => ({
      ...prev,
      edukasi_diberikan: prev.edukasi_diberikan.filter((tag) => tag !== tagToRemove)
    }));
  };

  const handleAddEdukasi = (e) => {
    const val = e.target.value;
    if (val && !form.edukasi_diberikan.includes(val)) {
      setForm((prev) => ({
        ...prev,
        edukasi_diberikan: [...prev.edukasi_diberikan, val]
      }));
    }
    setTagInput('');
  };

  // Handler file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (uploadedFiles.length + files.length > 5) {
      if (onShowToast) onShowToast('Maksimal 5 file lampiran dokumen.', 'error');
      return;
    }

    const newFiles = files.map((file) => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type,
      file
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Submit Handler (Draft vs Final)
  const handleSubmit = async (isDraft = false) => {
    setSubmitting(true);
    try {
      const tindakanFinal = [...form.tindakan_diberikan];
      if (form.tindakan_lainnya.trim()) {
        tindakanFinal.push(`Lainnya: ${form.tindakan_lainnya.trim()}`);
      }

      // Upload berkas fisik ke Supabase Storage jika ada
      const formattedDocs = [];
      for (let i = 0; i < (uploadedFiles || []).length; i++) {
        const f = uploadedFiles[i];
        let finalUrl = f.url;

        if (f.file) {
          try {
            const uploaded = await storageService.uploadDokumen(f.file, 'anc');
            if (uploaded?.url) {
              finalUrl = uploaded.url;
            }
          } catch (uploadErr) {
            console.warn('Gagal upload ke Supabase Storage, menggunakan link fallback:', uploadErr);
          }
        }

        formattedDocs.push({
          id: `doc-${Date.now()}-${i}`,
          name: f.name,
          size: f.size,
          type: f.type || 'Dokumen Tambahan',
          url: finalUrl || 'https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/Buku_KIA_2024.pdf',
          tanggal: formatTanggalIndo(form.tanggal_pemeriksaan),
          keterangan: form.catatan_tindak_lanjut || form.catatan_nakes || 'Lampiran pemeriksaan bidan'
        });
      }

      const payload = {
        ...form,
        tindakan_diberikan: tindakanFinal,
        lampiran_dokumen: formattedDocs,
        pemeriksa: currentUser?.nama || 'Bidan Khansa Fatin, S.Tr.Keb'
      };

      await bukuKiaService.simpanPemeriksaanAncBidan({
        kehamilanId: kehamilan?.id || null,
        pesertaId: pasien.id,
        isDraft,
        formData: payload,
        petugasId: currentUser?.petugas_id || currentUser?.id || null
      });

      const msg = isDraft
        ? `Draft pemeriksaan ${pasien.nama} berhasil disimpan!`
        : `Pemeriksaan ${pasien.nama} berhasil dicatat & jadwal kontrol tersinkronisasi!`;

      if (onShowToast) onShowToast(msg, 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Gagal simpan pemeriksaan bidan:', err);
      if (onShowToast) onShowToast('Gagal menyimpan pemeriksaan: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const isIbu = pasien.jenis_peserta === 'Ibu Hamil' || pasien.status_ibu === 'hamil';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-4xl my-auto max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-[#E11D48] flex items-center justify-center font-bold">
              <Stethoscope size={18} />
            </div>
            <h2 className="text-base font-bold text-slate-900">Catat Pemeriksaan (Bidan)</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs custom-scrollbar">

          {/* Banner Informasi Pasien (Latar Merah Muda Sesuai Gambar 3 & 4) */}
          <div className="bg-[#FFF1F2] border border-[#FFE4E6] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">{pasien.nama}</h3>
              <p className="text-slate-500 font-medium">NIK {pasien.nik || '3275021213456789'}</p>
              <p className="text-slate-500 font-medium">
                {pasien.usia || '27 tahun'} | <span className="font-semibold text-rose-700">{pasien.jenis_peserta || 'Ibu Hamil'}</span>
              </p>
            </div>

            {/* Kolom Informasi Klinis Kehamilan (Hanya jika Ibu Hamil - Sesuai Gambar 4) */}
            {isIbu && (
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-pink-200/60 md:pl-6 text-left">
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Usia Kehamilan</span>
                  <span className="block text-xs font-bold text-slate-900 mt-0.5">
                    {kehamilan?.usia_kehamilan_minggu ? `${kehamilan.usia_kehamilan_minggu} minggu 3 hari` : '28 minggu 3 hari'}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">HPHT</span>
                  <span className="block text-xs font-bold text-slate-900 mt-0.5">
                    {kehamilan?.hpht ? formatTanggalIndo(kehamilan.hpht) : '12 Februari 2026'}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Taksiran Persalinan</span>
                  <span className="block text-xs font-bold text-slate-900 mt-0.5">
                    {kehamilan?.hpl ? formatTanggalIndo(kehamilan.hpl) : '20 Desember 2026'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* =============================================================== */}
          {/* SECTION 1: Data Kunjungan */}
          {/* =============================================================== */}
          <div className="bg-[#FFF1F2]/40 border border-pink-100 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs pb-1 border-b border-pink-200/50">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-[#E11D48] flex items-center justify-center text-[10px]">1</span>
              <span>1. Data Kunjungan</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div>
                <label className="block text-[11px] text-slate-600 font-semibold mb-1">Tanggal Kunjungan *</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={form.tanggal_kunjungan}
                    onChange={(e) => setForm({ ...form, tanggal_kunjungan: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-semibold mb-1">Jenis Pelayanan *</label>
                <select
                  value={form.jenis_pelayanan}
                  onChange={(e) => setForm({ ...form, jenis_pelayanan: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                >
                  <option value="Pemeriksaan kehamilan (ANC)">Pemeriksaan kehamilan (ANC)</option>
                  <option value="Pemeriksaan Nifas & Menyusui">Pemeriksaan Nifas & Menyusui</option>
                  <option value="Penimbangan & Pertumbuhan Balita (KMS)">Penimbangan & Pertumbuhan Balita (KMS)</option>
                  <option value="Imunisasi Balita">Imunisasi Balita</option>
                  <option value="Pemeriksaan Kesehatan Anak">Pemeriksaan Kesehatan Anak</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-semibold mb-1">Kunjungan ke *</label>
                <select
                  value={form.kunjungan_ke}
                  onChange={(e) => setForm({ ...form, kunjungan_ke: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                >
                  <option value="ANC 1">ANC 1</option>
                  <option value="ANC 2">ANC 2</option>
                  <option value="ANC 3">ANC 3</option>
                  <option value="ANC 4">ANC 4</option>
                  <option value="ANC 5">ANC 5</option>
                  <option value="ANC 6">ANC 6</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-semibold mb-1">Tempat Pelayanan *</label>
                <select
                  value={form.tempat_pelayanan}
                  onChange={(e) => setForm({ ...form, tempat_pelayanan: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                >
                  <option value="Puskesmas Manud Jaya">Puskesmas Manud Jaya</option>
                  <option value="Posyandu Dusun 1">Posyandu Dusun 1</option>
                  <option value="Posyandu Dusun 2">Posyandu Dusun 2</option>
                  <option value="Posyandu Dusun 3">Posyandu Dusun 3</option>
                  <option value="Polindes / Poskesdes">Polindes / Poskesdes</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] text-slate-600 font-semibold">Keluhan Utama / Alasan Kunjungan</label>
                <span className="text-[10px] text-slate-400">{form.keluhan_utama.length}/200</span>
              </div>
              <textarea
                maxLength={200}
                rows={2}
                value={form.keluhan_utama}
                onChange={(e) => setForm({ ...form, keluhan_utama: e.target.value })}
                placeholder="Kontrol rutin, sering merasa pegal di punggung..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
              />
            </div>
          </div>

          {/* =============================================================== */}
          {/* SECTION 2: Pemeriksaan Kehamilan (oleh Bidan) */}
          {/* =============================================================== */}
          <div className="bg-[#FFF1F2]/40 border border-pink-100 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs pb-1 border-b border-pink-200/50">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-[#E11D48] flex items-center justify-center text-[10px]">2</span>
              <span>2. Pemeriksaan Kehamilan (oleh Bidan)</span>
            </div>

            {/* Status Kehamilan Radio */}
            <div>
              <span className="block text-[11px] text-slate-700 font-semibold mb-2">Status Kehamilan</span>
              <div className="flex items-center gap-5 text-xs">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status_kehamilan"
                    value="Kehamilan tunggal"
                    checked={form.status_kehamilan === 'Kehamilan tunggal'}
                    onChange={(e) => setForm({ ...form, status_kehamilan: e.target.value })}
                    className="text-[#E11D48] focus:ring-rose-500 cursor-pointer"
                  />
                  <span>Kehamilan tunggal</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status_kehamilan"
                    value="Kehamilan ganda"
                    checked={form.status_kehamilan === 'Kehamilan ganda'}
                    onChange={(e) => setForm({ ...form, status_kehamilan: e.target.value })}
                    className="text-[#E11D48] focus:ring-rose-500 cursor-pointer"
                  />
                  <span>Kehamilan ganda</span>
                </label>
              </div>
            </div>

            {/* Grid 3 Kolom Sesuai Figma */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              
              {/* Kolom 1: Usia Hamil, TFU, DJJ */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-600 font-semibold mb-1">Usia Kehamilan (minggu)</label>
                  <input
                    type="text"
                    value={form.usia_kehamilan}
                    onChange={(e) => setForm({ ...form, usia_kehamilan: e.target.value })}
                    placeholder="28 minggu 3 hari"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 font-semibold mb-1">Tinggi Fundus Uteri (cm)</label>
                  <input
                    type="number"
                    value={form.tinggi_fundus}
                    onChange={(e) => setForm({ ...form, tinggi_fundus: e.target.value })}
                    placeholder="26"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 font-semibold mb-1">Denyut Jantung Janin (x/menit)</label>
                  <input
                    type="number"
                    value={form.djj}
                    onChange={(e) => setForm({ ...form, djj: e.target.value })}
                    placeholder="140"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  />
                </div>
              </div>

              {/* Kolom 2: Letak Janin, Presentasi, Gerakan, Kontraksi */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-600 font-semibold mb-1">Letak Janin</label>
                  <select
                    value={form.letak_janin}
                    onChange={(e) => setForm({ ...form, letak_janin: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  >
                    <option value="Kepala">Kepala</option>
                    <option value="Sungsang">Sungsang</option>
                    <option value="Melintang">Melintang</option>
                    <option value="Oblik">Oblik</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 font-semibold mb-1">Presentasi Janin</label>
                  <select
                    value={form.presentasi_janin}
                    onChange={(e) => setForm({ ...form, presentasi_janin: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  >
                    <option value="Kepala">Kepala</option>
                    <option value="Bokong">Bokong</option>
                    <option value="Kaki">Kaki</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 font-semibold mb-1">Gerakan Janin</label>
                  <div className="flex items-center gap-3 pt-1">
                    {['Aktif', 'Kurang', 'Tidak terasa'].map((g) => (
                      <label key={g} className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="gerakan_janin"
                          value={g}
                          checked={form.gerakan_janin === g}
                          onChange={(e) => setForm({ ...form, gerakan_janin: e.target.value })}
                          className="text-[#E11D48] focus:ring-rose-500 cursor-pointer"
                        />
                        <span className="text-[11px]">{g}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 font-semibold mb-1">Kontraksi</label>
                  <div className="flex items-center gap-3 pt-1">
                    {['Tidak ada', 'Ada', 'Lainnya'].map((k) => (
                      <label key={k} className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="kontraksi"
                          value={k}
                          checked={form.kontraksi === k}
                          onChange={(e) => setForm({ ...form, kontraksi: e.target.value })}
                          className="text-[#E11D48] focus:ring-rose-500 cursor-pointer"
                        />
                        <span className="text-[11px]">{k}</span>
                      </label>
                    ))}
                  </div>
                  {form.kontraksi !== 'Tidak ada' && (
                    <input
                      type="text"
                      value={form.kontraksi_ket}
                      onChange={(e) => setForm({ ...form, kontraksi_ket: e.target.value })}
                      placeholder="Frekuensi / keterangan"
                      className="w-full mt-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                    />
                  )}
                </div>
              </div>

              {/* Kolom 3: Edema, Varises, Tanda Bahaya, USG */}
              <div className="space-y-3">
                <div>
                  <span className="block text-[11px] text-slate-700 font-semibold mb-1">Pemeriksaan Lainnya</span>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="block text-[10px] text-slate-500">Edema</span>
                      <select
                        value={form.edema}
                        onChange={(e) => setForm({ ...form, edema: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                      >
                        <option value="Tidak ada">Tidak ada</option>
                        <option value="Tungkai">Tungkai</option>
                        <option value="Wajah / Tangan">Wajah / Tangan</option>
                        <option value="Generalisata">Generalisata</option>
                      </select>
                    </div>

                    <div>
                      <span className="block text-[10px] text-slate-500">Varises</span>
                      <select
                        value={form.varises}
                        onChange={(e) => setForm({ ...form, varises: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                      >
                        <option value="Tidak ada">Tidak ada</option>
                        <option value="Ada">Ada</option>
                      </select>
                    </div>

                    <div>
                      <span className="block text-[10px] text-slate-500">Tanda Bahaya</span>
                      <select
                        value={form.tanda_bahaya}
                        onChange={(e) => setForm({ ...form, tanda_bahaya: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                      >
                        <option value="Tidak ada">Tidak ada</option>
                        <option value="Perdarahan">Perdarahan</option>
                        <option value="Demam Tinggi">Demam Tinggi</option>
                        <option value="Sakit Kepala Berat">Sakit Kepala Berat</option>
                        <option value="Ketuban Pecah Dini">Ketuban Pecah Dini</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] text-slate-600 font-semibold">Hasil Pemeriksaan USG (jika ada)</label>
                    <span className="text-[10px] text-slate-400">{form.hasil_usg.length}/200</span>
                  </div>
                  <textarea
                    maxLength={200}
                    rows={2}
                    value={form.hasil_usg}
                    onChange={(e) => setForm({ ...form, hasil_usg: e.target.value })}
                    placeholder="Contoh: pertumbuhan janin sesuai usia kehamilan, plasenta normal, air ketuban cukup."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* =============================================================== */}
          {/* SECTION 3: Penilaian & Tindakan */}
          {/* =============================================================== */}
          <div className="bg-[#FFF1F2]/40 border border-pink-100 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs pb-1 border-b border-pink-200/50">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-[#E11D48] flex items-center justify-center text-[10px]">3</span>
              <span>3. Penilaian & Tindakan</span>
            </div>

            {/* Status Risiko Kehamilan */}
            <div className="max-w-xs">
              <label className="block text-[11px] text-slate-600 font-semibold mb-1">Status Risiko Kehamilan</label>
              <select
                value={form.status_risiko}
                onChange={(e) => setForm({ ...form, status_risiko: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
              >
                <option value="Tidak berisiko">Tidak berisiko</option>
                <option value="Risiko Tinggi (KSPR)">Risiko Tinggi (KSPR)</option>
                <option value="Risiko Sangat Tinggi">Risiko Sangat Tinggi</option>
              </select>
            </div>

            {/* Grid 3 Kolom: Diagnosa, Tindakan, Edukasi + Kontrol */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              
              {/* Kolom 1: Diagnosa / Kesimpulan */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] text-slate-600 font-semibold">Diagnosa / Kesimpulan</label>
                  <span className="text-[10px] text-slate-400">{form.diagnosa.length}/200</span>
                </div>
                <textarea
                  maxLength={200}
                  rows={4}
                  value={form.diagnosa}
                  onChange={(e) => setForm({ ...form, diagnosa: e.target.value })}
                  placeholder="Kehamilan normal, janin dalam kondisi baik."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                />
              </div>

              {/* Kolom 2: Tindakan yang Diberikan */}
              <div>
                <label className="block text-[11px] text-slate-600 font-semibold mb-2">Tindakan yang Diberikan</label>
                <div className="space-y-2">
                  {[
                    'Pemeriksaan ANC rutin',
                    'Konseling',
                    'Pemberian tablet Fe',
                    'Rujukan'
                  ].map((tindakan) => (
                    <label key={tindakan} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.tindakan_diberikan.includes(tindakan)}
                        onChange={() => handleToggleTindakan(tindakan)}
                        className="rounded border-slate-300 text-[#E11D48] focus:ring-rose-500 cursor-pointer"
                      />
                      <span className="text-slate-700">{tindakan}</span>
                    </label>
                  ))}

                  <div className="pt-1">
                    <label className="flex items-center gap-2 cursor-pointer mb-1">
                      <input
                        type="checkbox"
                        checked={Boolean(form.tindakan_lainnya)}
                        onChange={(e) => setForm({ ...form, tindakan_lainnya: e.target.checked ? 'Pemeriksaan Lab' : '' })}
                        className="rounded border-slate-300 text-[#E11D48] focus:ring-rose-500 cursor-pointer"
                      />
                      <span className="text-slate-700">Lainnya</span>
                    </label>
                    <input
                      type="text"
                      value={form.tindakan_lainnya}
                      onChange={(e) => setForm({ ...form, tindakan_lainnya: e.target.value })}
                      placeholder="Contoh: pemeriksaan lab"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Kolom 3: Edukasi yang Diberikan & Rencana Kontrol */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] text-slate-600 font-semibold mb-1.5">Edukasi yang Diberikan</label>
                  
                  {/* Pills Edukasi Sesuai Figma */}
                  <div className="flex flex-wrap gap-1.5 p-2 bg-white border border-slate-200 rounded-xl min-h-[50px]">
                    {form.edukasi_diberikan.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFF1F2] text-[#991B1B] text-[10px] font-semibold border border-[#FECDD3]"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveEdukasi(tag)}
                          className="hover:text-rose-900 cursor-pointer p-0.5"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Dropdown tambah edukasi */}
                  <div className="mt-1.5">
                    <select
                      value={tagInput}
                      onChange={handleAddEdukasi}
                      className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-600 outline-none"
                    >
                      <option value="">+ Tambah Edukasi...</option>
                      <option value="Nutrisi kehamilan">Nutrisi kehamilan</option>
                      <option value="Tanda bahaya kehamilan">Tanda bahaya kehamilan</option>
                      <option value="Aktivitas fisik yang aman">Aktivitas fisik yang aman</option>
                      <option value="Persiapan persalinan">Persiapan persalinan</option>
                      <option value="Inisiasi Menyusu Dini (IMD)">Inisiasi Menyusu Dini (IMD)</option>
                      <option value="Pola istirahat & tidur">Pola istirahat & tidur</option>
                      <option value="Kesehatan gigi & mulut ibu">Kesehatan gigi & mulut ibu</option>
                      <option value="KB Pasca Persalinan">KB Pasca Persalinan</option>
                    </select>
                  </div>
                </div>

                {/* Rencana Kunjungan Berikutnya */}
                <div className="pt-1">
                  <span className="block text-[11px] text-slate-700 font-semibold mb-1">Rencana Kunjungan Berikutnya</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="block text-[10px] text-slate-500 mb-0.5">Tanggal Kontrol</span>
                      <input
                        type="date"
                        value={form.tanggal_kontrol_berikutnya}
                        onChange={(e) => setForm({ ...form, tanggal_kontrol_berikutnya: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-medium outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 mb-0.5">Jenis Kunjungan</span>
                      <select
                        value={form.kunjungan_berikutnya}
                        onChange={(e) => setForm({ ...form, kunjungan_berikutnya: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-medium outline-none focus:border-rose-500"
                      >
                        <option value="ANC 1">ANC 1</option>
                        <option value="ANC 2">ANC 2</option>
                        <option value="ANC 3">ANC 3</option>
                        <option value="ANC 4">ANC 4</option>
                        <option value="ANC 5">ANC 5</option>
                        <option value="ANC 6">ANC 6</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* =============================================================== */}
          {/* SECTION 4: Catatan Tambahan (Opsional) */}
          {/* =============================================================== */}
          <div className="bg-[#FFF1F2]/40 border border-pink-100 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs pb-1 border-b border-pink-200/50">
              <span className="w-5 h-5 rounded-full bg-rose-100 text-[#E11D48] flex items-center justify-center text-[10px]">4</span>
              <span>4. Catatan Tambahan (Opsional)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] text-slate-600 font-semibold">Catatan untuk Tenaga Kesehatan Lain</label>
                  <span className="text-[10px] text-slate-400">{form.catatan_nakes.length}/200</span>
                </div>
                <textarea
                  maxLength={200}
                  rows={3}
                  value={form.catatan_nakes}
                  onChange={(e) => setForm({ ...form, catatan_nakes: e.target.value })}
                  placeholder="Contoh: rencana pemeriksaan lab, rujukan, atau hal yang perlu dipantau."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-semibold mb-1">Lampiran (Opsional)</label>
                
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#FDA4AF] hover:bg-rose-50 text-[#E11D48] rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs">
                  <Plus size={14} />
                  <span>+ Unggah Dokumen</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-1.5">Maks. 5 file (PDF/JPG/PNG), ukuran maks. 5 MB</p>

                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {uploadedFiles.map((f, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px]">
                        <span className="truncate max-w-[200px] text-slate-700">{f.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">{f.size}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50/50 shrink-0">
          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Batal
          </button>
          
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit(true)}
            className="px-4 py-2 border border-[#E11D48] text-[#E11D48] hover:bg-rose-50 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
          >
            {submitting ? 'Menyimpan...' : 'Simpan Draft'}
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit(false)}
            className="px-5 py-2 bg-[#E11D48] hover:bg-[#BE185D] active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            {submitting ? 'Menyimpan...' : 'Simpan Pemeriksaan'}
          </button>
        </div>

      </div>
    </div>
  );
}
