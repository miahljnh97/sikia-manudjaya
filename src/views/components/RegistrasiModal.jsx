import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { masterService } from '../../services/masterService';
import { resolveTipeId } from '../../utils/pesertaAdapter';

export default function RegistrasiModal({ isOpen, onClose, onSubmit, onShowToast }) {
  const [dusunList, setDusunList] = useState([]);
  const [tipeList, setTipeList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    jenis_peserta: 'Balita',
    dusun_id: '',
    tipe_id: '',
    usia: '',
    alamat: 'Manud Jaya',
  });

  useEffect(() => {
    let isMounted = true;
    Promise.all([masterService.getDusunList(), masterService.getTipePesertaList()])
      .then(([dusuns, tipes]) => {
        if (isMounted) {
          if (dusuns && dusuns.length > 0) {
            setDusunList(dusuns);
            setFormData(prev => ({ ...prev, dusun_id: prev.dusun_id || dusuns[0].id }));
          }
          if (tipes && tipes.length > 0) {
            setTipeList(tipes);
          }
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.nik) {
      if (onShowToast) {
        onShowToast('Nama dan NIK wajib diisi!', 'error');
      }
      setErrorMsg('Nama dan NIK wajib diisi!');
      return;
    }
    setErrorMsg('');

    // Tentukan tipe_id dari master tipe_peserta relasi Supabase
    const jp = (formData.jenis_peserta || '').toLowerCase();
    const isIbu = jp.includes('ibu');
    const matchedTipe = tipeList.find(t => {
      const kode = (t.kode || '').toLowerCase();
      const nama = (t.nama || '').toLowerCase();
      if (jp.includes('ibu') && (kode.includes('ibu') || nama.includes('ibu'))) return true;
      if (jp === 'bayi' && (kode === 'bayi' || nama === 'bayi')) return true;
      if (jp === 'lansia' && (kode === 'lansia' || nama === 'lansia')) return true;
      if (jp === 'balita' && (kode === 'balita' || kode === 'anak' || nama === 'balita')) return true;
      return false;
    });

    const finalTipeId = matchedTipe ? matchedTipe.id : resolveTipeId(formData.jenis_peserta);

    onSubmit({
      ...formData,
      tipe_id: finalTipeId,
      status_ibu: isIbu ? 'hamil' : null,
    });
    setFormData({
      nama: '',
      nik: '',
      jenis_peserta: 'Balita',
      dusun_id: dusunList[0]?.id || '',
      tipe_id: '',
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
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between">
              <span>{errorMsg}</span>
              <button type="button" onClick={() => setErrorMsg('')} className="p-0.5 hover:bg-rose-100 rounded">
                <X size={13} />
              </button>
            </div>
          )}
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
                {tipeList.length > 0 ? (
                  tipeList.map((t) => (
                    <option key={t.id} value={t.nama}>{t.nama}</option>
                  ))
                ) : (
                  <>
                    <option value="Balita">Balita</option>
                    <option value="Bayi">Bayi</option>
                    <option value="Ibu Hamil">Ibu Hamil</option>
                    <option value="Lansia">Lansia</option>
                  </>
                )}
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Wilayah / Dusun</label>
              <select
                value={formData.dusun_id}
                onChange={(e) => {
                  const val = e.target.value;
                  const matched = dusunList.find(d => d.id === val);
                  setFormData({
                    ...formData,
                    dusun_id: val,
                    alamat: matched ? matched.nama : formData.alamat
                  });
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
              >
                {dusunList.length > 0 ? (
                  dusunList.map((d) => (
                    <option key={d.id} value={d.id}>{d.nama}</option>
                  ))
                ) : (
                  <option value="">Pilih Dusun...</option>
                )}
              </select>
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
