import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit3, Save, X, User, Phone, Mail, MapPin, Calendar, Heart, Trash2, Eye, EyeOff, ChevronDown, Check } from 'lucide-react';
import { maskNik } from '../../../utils/nikUtils';
import { masterService } from '../../../services/masterService';
import { resolveTipeId } from '../../../utils/pesertaAdapter';

export default function DetailPeserta({ peserta, onBack, onSave, onDelete, isKaderOrBidan = true }) {
  if (!peserta) return null;

  // Default mode adalah VIEW (isEditing: false)
  const [isEditing, setIsEditing] = useState(false);
  const [showNik, setShowNik] = useState(false);
  const [dusunList, setDusunList] = useState([]);
  const [tipeList, setTipeList] = useState([]);
  const [formData, setFormData] = useState({
    nama: peserta.nama || '',
    nik: peserta.nik || '',
    tanggal_lahir: peserta.tanggal_lahir || '',
    alamat: peserta.alamat || '',
    dusun_id: peserta.dusun_id || '',
    dusun: peserta.dusun || '',
    telepon: peserta.telepon || '',
    email: peserta.email || '',
    jenis_kelamin: peserta.jenis_kelamin || 'Perempuan',
    jenis_peserta: peserta.jenis_peserta || 'Ibu Hamil',
    tipe_id: peserta.tipe_id || resolveTipeId(peserta.jenis_peserta),
    telepon_pj: peserta.telepon_pj || '',
    catatan_observasi: peserta.catatan_observasi || '',
  });

  useEffect(() => {
    if (peserta) {
      setFormData({
        nama: peserta.nama || '',
        nik: peserta.nik || '',
        tanggal_lahir: peserta.tanggal_lahir || '',
        alamat: peserta.alamat || '',
        dusun_id: peserta.dusun_id || '',
        dusun: peserta.dusun || '',
        telepon: peserta.telepon || '',
        email: peserta.email || '',
        jenis_kelamin: peserta.jenis_kelamin || 'Perempuan',
        jenis_peserta: peserta.jenis_peserta || 'Ibu Hamil',
        tipe_id: peserta.tipe_id || resolveTipeId(peserta.jenis_peserta),
        telepon_pj: peserta.telepon_pj || '',
        catatan_observasi: peserta.catatan_observasi || '',
      });
      setIsEditing(false);
    }
  }, [peserta]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([masterService.getDusunList(), masterService.getTipePesertaList()]).then(([dusuns, tipes]) => {
      if (isMounted) {
        if (dusuns) setDusunList(dusuns);
        if (tipes) setTipeList(tipes);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      [field]: val,
      ...(field === 'jenis_peserta' ? { tipe_id: resolveTipeId(val) } : {})
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...peserta,
        ...formData,
        tipe_id: resolveTipeId(formData.jenis_peserta) || formData.tipe_id || peserta.tipe_id
      });
    }
  };

  const handleCancelEdit = () => {
    // Reset formData ke data awal sebelum edit
    setFormData({
      nama: peserta.nama || '',
      nik: peserta.nik || '',
      tanggal_lahir: peserta.tanggal_lahir || '',
      alamat: peserta.alamat || '',
      dusun_id: peserta.dusun_id || '',
      dusun: peserta.dusun || '',
      telepon: peserta.telepon || '',
      email: peserta.email || '',
      jenis_kelamin: peserta.jenis_kelamin || 'Perempuan',
      jenis_peserta: peserta.jenis_peserta || 'Ibu Hamil',
      tipe_id: peserta.tipe_id || resolveTipeId(peserta.jenis_peserta),
      telepon_pj: peserta.telepon_pj || '',
      catatan_observasi: peserta.catatan_observasi || '',
    });
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-5xl">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Daftar Peserta</span>
            </button>
          )}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Peserta</h1>
            {isEditing && (
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                Mode Edit
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEditing 
              ? 'Silakan perbarui formulir data peserta di bawah ini, lalu klik Simpan Data Peserta.' 
              : 'Detail Data Peserta Posyandu'}
          </p>
        </div>

        {/* Tombol Ubah di Header Kanan Atas saat View Mode */}
        {!isEditing && isKaderOrBidan && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <Edit3 size={15} />
            <span>Ubah Data Peserta</span>
          </button>
        )}
      </div>

      {/* Card Utama: Detail Pasien */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-bold text-slate-900">
              {isEditing ? 'Formulir Ubah Data Pasien' : 'Detail Pasien'}
            </h3>
            <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md ${
              isEditing ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600'
            }`}>
              {isEditing ? 'Editing' : 'Mode Lihat'}
            </span>
          </div>

          {/* Tombol Ubah / Batal di Pojok Card */}
          {isKaderOrBidan && (
            isEditing ? (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <X size={14} />
                <span>Batal Edit</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Edit3 size={13} />
                <span>Ubah Data</span>
              </button>
            )
          )}
        </div>

        <div className="space-y-4 text-xs">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1.5">
              Nama Lengkap Pasien <span className="text-rose-500">*</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                required
                value={formData.nama}
                onChange={(e) => handleChange('nama', e.target.value)}
                placeholder="Masukkan nama lengkap pasien"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-bold text-slate-900">
                {formData.nama || '-'}
              </div>
            )}
          </div>

          {/* NIK */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-500 font-semibold">
                NIK <span className="text-rose-500">*</span>
              </label>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setShowNik(!showNik)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {showNik ? (
                    <>
                      <EyeOff size={13} />
                      <span>Sembunyikan NIK</span>
                    </>
                  ) : (
                    <>
                      <Eye size={13} />
                      <span>Lihat NIK Lengkap</span>
                    </>
                  )}
                </button>
              )}
            </div>
            {isEditing ? (
              <input
                type="text"
                required
                maxLength={16}
                value={formData.nik}
                onChange={(e) => handleChange('nik', e.target.value)}
                placeholder="16 digit NIK"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-mono font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-mono font-medium text-slate-800 flex items-center justify-between">
                <span>{showNik ? formData.nik : maskNik(formData.nik)}</span>
                <span className="text-[10px] text-slate-400 font-sans font-normal">
                  {showNik ? '16 Digit Lengkap' : 'Masked (Privasi)'}
                </span>
              </div>
            )}
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1.5">Tanggal Lahir</label>
            {isEditing ? (
              <input
                type="text"
                placeholder="DD/MM/YYYY atau DD Month YYYY"
                value={formData.tanggal_lahir}
                onChange={(e) => handleChange('tanggal_lahir', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
                {formData.tanggal_lahir || '-'}
              </div>
            )}
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1.5">Alamat / Wilayah</label>
            {isEditing ? (
              <div className="relative">
                <select
                  value={formData.dusun_id || formData.alamat}
                  onChange={(e) => {
                    const val = e.target.value;
                    const matchedDusun = dusunList.find(d => d.id === val || d.nama === val);
                    handleChange('dusun_id', matchedDusun ? matchedDusun.id : val);
                    handleChange('alamat', matchedDusun ? matchedDusun.nama : val);
                    handleChange('dusun', matchedDusun ? matchedDusun.nama : val);
                  }}
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer"
                >
                  {dusunList.length > 0 ? (
                    dusunList.map((d) => (
                      <option key={d.id} value={d.id}>{d.nama}</option>
                    ))
                  ) : (
                    <>
                      <option value="fbe91bbd-c11a-4a19-90ba-ca78f929d791">Dusun 1</option>
                      <option value="200a7c92-6671-4b31-a39f-0a03e1fb4a9f">Dusun 2</option>
                      <option value="3250c081-51e4-44af-b2b6-5535c73f2c41">Dusun 3</option>
                    </>
                  )}
                </select>
                <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
                {formData.alamat || formData.dusun || '-'}
              </div>
            )}
          </div>

          {/* Nomor Telepon */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1.5">Nomor Telepon / WhatsApp</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.telepon}
                onChange={(e) => handleChange('telepon', e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
                {formData.telepon || '-'}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1.5">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Contoh: nama@email.com"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
                {formData.email || '-'}
              </div>
            )}
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1.5">Jenis Kelamin</label>
            {isEditing ? (
              <div className="relative">
                <select
                  value={formData.jenis_kelamin}
                  onChange={(e) => handleChange('jenis_kelamin', e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer"
                >
                  <option value="Perempuan">Perempuan</option>
                  <option value="Laki-laki">Laki-laki</option>
                </select>
                <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
                {formData.jenis_kelamin || '-'}
              </div>
            )}
          </div>

          {/* Jenis Peserta */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1.5">Jenis Peserta</label>
            {isEditing ? (
              <div className="relative">
                <select
                  value={formData.jenis_peserta}
                  onChange={(e) => handleChange('jenis_peserta', e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer"
                >
                  {tipeList.length > 0 ? (
                    tipeList.map((t) => (
                      <option key={t.id} value={t.nama}>{t.nama}</option>
                    ))
                  ) : (
                    <>
                      <option value="Ibu Hamil">Ibu Hamil</option>
                      <option value="Balita">Balita</option>
                      <option value="Bayi">Bayi</option>
                      <option value="Lansia">Lansia</option>
                    </>
                  )}
                </select>
                <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
                {formData.jenis_peserta || '-'}
              </div>
            )}
          </div>

          {/* Nomor Telepon Penanggung Jawab */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1.5">Nomor Telepon Penanggung Jawab</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.telepon_pj}
                onChange={(e) => handleChange('telepon_pj', e.target.value)}
                placeholder="Nomor kontak darurat / suami / keluarga"
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
                {formData.telepon_pj || '-'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Catatan Tambahan / Observasi */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Catatan Tambahan / Observasi
        </h3>
        {isEditing ? (
          <textarea
            rows={3}
            value={formData.catatan_observasi}
            onChange={(e) => handleChange('catatan_observasi', e.target.value)}
            placeholder="Pasien perlu rujukan, alergi, atau riwayat catatan lainnya..."
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          />
        ) : (
          <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800">
            {formData.catatan_observasi || 'Tidak ada catatan observasi'}
          </div>
        )}
      </div>

      {/* Tombol Aksi di Bawah Form */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {/* Tombol Hapus (selalu ada untuk kader/bidan) */}
        {onDelete && isKaderOrBidan && (
          <button
            type="button"
            onClick={() => onDelete(peserta)}
            className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Hapus Peserta</span>
          </button>
        )}

        {/* JIKA MODE EDIT: Tampilkan Batal Edit & Simpan Data Peserta */}
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Save size={15} />
              <span>Simpan Data Peserta</span>
            </button>
          </>
        ) : (
          /* JIKA MODE VIEW: Tampilkan Kembali & Ubah Data Peserta */
          <>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Kembali ke Daftar Peserta
              </button>
            )}
            {isKaderOrBidan && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold shadow-xs inline-flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Edit3 size={15} />
                <span>Ubah Data Peserta</span>
              </button>
            )}
          </>
        )}
      </div>
    </form>
  );
}
