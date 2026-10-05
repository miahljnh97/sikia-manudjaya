import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit3, Save, X, User, Phone, Mail, MapPin, Calendar, Heart, Trash2, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { maskNik } from '../../../utils/nikUtils';
import { masterService } from '../../../services/masterService';

export default function DetailPeserta({ peserta, onBack, onSave, onDelete, isKaderOrBidan = true }) {
  if (!peserta) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [showNik, setShowNik] = useState(true);
  const [dusunList, setDusunList] = useState([]);
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
    telepon_pj: peserta.telepon_pj || '',
    catatan_observasi: peserta.catatan_observasi || '',
  });

  useEffect(() => {
    let isMounted = true;
    masterService.getDusunList().then((res) => {
      if (isMounted && res) setDusunList(res);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({ ...peserta, ...formData });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      nama: peserta.nama || '',
      nik: peserta.nik || '',
      tanggal_lahir: peserta.tanggal_lahir || '',
      alamat: peserta.alamat || '',
      telepon: peserta.telepon || '',
      email: peserta.email || '',
      jenis_kelamin: peserta.jenis_kelamin || 'Perempuan',
      jenis_peserta: peserta.jenis_peserta || 'Ibu Hamil',
      telepon_pj: peserta.telepon_pj || '',
      catatan_observasi: peserta.catatan_observasi || '',
    });
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-5xl">
      {/* Header & Back Button + Action Edit */}
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Peserta</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEditing ? 'Perbarui Data Peserta Posyandu' : 'Detail Data Peserta Posyandu'}
          </p>
        </div>

        {/* Tombol Aksi Edit (Hanya untuk Kader / Bidan) */}
        {isKaderOrBidan && (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  <X size={14} />
                  <span>Batal</span>
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <Save size={14} />
                  <span>Simpan Perubahan</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(peserta)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Hapus Peserta</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <Edit3 size={14} />
                  <span>Edit Data Peserta</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Utama: Detail Pasien */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">
            Detail Pasien
          </h3>
          {isEditing && (
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              Mode Edit Aktif
            </span>
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
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
                {formData.nama}
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
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-mono font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
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
                placeholder="DD/MM/YYYY"
                value={formData.tanggal_lahir}
                onChange={(e) => handleChange('tanggal_lahir', e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
                {formData.tanggal_lahir}
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
                      <option value="Dusun 1">Dusun 1</option>
                      <option value="Dusun 2">Dusun 2</option>
                      <option value="Dusun 3">Dusun 3</option>
                      <option value="Manud Jaya">Manud Jaya</option>
                    </>
                  )}
                </select>
                <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
                {formData.alamat || formData.dusun}
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
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
                {formData.telepon}
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
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
                {formData.email}
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
                {formData.jenis_kelamin}
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
                  <option value="Ibu Hamil">Ibu Hamil</option>
                  <option value="Balita">Balita</option>
                  <option value="Bayi">Bayi</option>
                </select>
                <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
                {formData.jenis_peserta}
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
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
                {formData.telepon_pj}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Catatan Tambahan / Observasi */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Catatan Tambahan / Observasi Petugas
        </h3>
        {isEditing ? (
          <textarea
            rows={3}
            value={formData.catatan_observasi}
            onChange={(e) => handleChange('catatan_observasi', e.target.value)}
            placeholder="Catatan kesehatan atau arahan rujukan..."
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
          />
        ) : (
          <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800">
            {formData.catatan_observasi || 'Tidak ada catatan observasi'}
          </div>
        )}
      </div>
    </form>
  );
}
