import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function RegistrasiModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    jenis_peserta: 'Balita',
    usia: '',
    alamat: 'Manud Jaya',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.nik) {
      alert('Nama dan NIK wajib diisi!');
      return;
    }
    onSubmit(formData);
    setFormData({
      nama: '',
      nik: '',
      jenis_peserta: 'Balita',
      usia: '',
      alamat: 'Manud Jaya',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header Modal */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Registrasi Kunjungan Baru</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              placeholder="Contoh: Siti Aminah"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">NIK (Nomor Induk Kependudukan)</label>
            <input
              type="text"
              required
              placeholder="Contoh: 3275020101010001"
              value={formData.nik}
              onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
              <select
                value={formData.jenis_peserta}
                onChange={(e) => setFormData({ ...formData, jenis_peserta: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
              >
                <option value="Balita">Balita</option>
                <option value="Bayi">Bayi</option>
                <option value="Ibu Hamil">Ibu Hamil</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Usia</label>
              <input
                type="text"
                placeholder="Contoh: 2 tahun / 28 tahun"
                value={formData.usia}
                onChange={(e) => setFormData({ ...formData, usia: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Domisili</label>
            <input
              type="text"
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-xl shadow-xs"
            >
              Simpan Peserta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
