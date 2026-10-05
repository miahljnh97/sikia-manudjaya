import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  X, 
  Filter,
  Trash2
} from 'lucide-react';
import { dataStoreService, getIsActive } from '../../services/dataStoreService';
import { kaderService } from '../../services/kaderService';
import { masterService } from '../../services/masterService';
import ConfirmModal from '../../views/components/ConfirmModal';

export default function KelolaKaderPage({ currentUser, onShowToast }) {
  const [kaderList, setKaderList] = useState(() => dataStoreService.getKaderList());
  const [loading, setLoading] = useState(false);
  const [kaderToDelete, setKaderToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dusunFilter, setDusunFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');

  // Master Data dari Database Supabase
  const [dusunList, setDusunList] = useState([]);
  const [posyanduList, setPosyanduList] = useState([]);
  const [rolesList, setRolesList] = useState([]);

  // Modal State Tambah Kader Baru
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    dusun_id: '',
    posyandu_id: '',
    role_id: '',
    telepon: '',
    email: '',
  });

  // Fetch data dari Supabase saat buka halaman
  const refreshList = async () => {
    try {
      const data = await kaderService.getKaderList();
      if (data && data.length > 0) {
        setKaderList(data);
      }
    } catch (e) {
      console.warn('Error refreshing kader:', e);
    }
  };

  useEffect(() => {
    refreshList();
    
    // Load master lists
    const loadMasters = async () => {
      try {
        const [dusunRes, posyanduRes, rolesRes] = await Promise.all([
          masterService.getDusunList(),
          masterService.getPosyanduList(),
          masterService.getRolesList(),
        ]);
        setDusunList(dusunRes);
        setPosyanduList(posyanduRes);
        setRolesList(rolesRes);

        // Inisialisasi default form jika kosong
        setFormData(prev => ({
          ...prev,
          dusun_id: prev.dusun_id || (dusunRes[0]?.id || ''),
          posyandu_id: prev.posyandu_id || (posyanduRes[0]?.id || ''),
          role_id: prev.role_id || (rolesRes.find(r => r.kode === 'kader')?.id || rolesRes[0]?.id || '')
        }));
      } catch (err) {
        console.warn('Error fetching master records:', err);
      }
    };
    loadMasters();

    const unsubscribe = dataStoreService.subscribe(() => {
      refreshList();
    });
    return () => unsubscribe();
  }, []);

  const handleToggleStatus = async (id, nama) => {
    const currentItem = kaderList.find((k) => String(k.id) === String(id));
    const currentActive = getIsActive(currentItem);
    await kaderService.toggleKaderActive(id, currentActive);
    await refreshList();
    if (onShowToast) {
      onShowToast(`Status operasional kader "${nama}" diubah menjadi: ${!currentActive ? 'Aktif' : 'Non-Aktif / Cuti'}.`, 'info');
    }
  };

  const handleHapusKader = (id, nama) => {
    setKaderToDelete({ id, nama });
  };

  const confirmHapusKader = async () => {
    if (!kaderToDelete) return;
    try {
      await kaderService.suspendKader(kaderToDelete.id);
      await refreshList();
      if (onShowToast) {
        onShowToast(`Kader "${kaderToDelete.nama}" berhasil dihapus (disuspend) dari sistem.`, 'success');
      }
    } catch (e) {
      console.error(e);
      if (onShowToast) {
        onShowToast('Gagal menghapus kader.', 'error');
      }
    } finally {
      setKaderToDelete(null);
    }
  };

  const handleSimpanKader = async (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.nik || !formData.telepon) {
      if (onShowToast) {
        onShowToast('Mohon lengkapi Nama, NIK, dan Nomor Telepon kader.', 'error');
      }
      return;
    }

    setLoading(true);
    try {
      await kaderService.tambahKader({
        nama: formData.nama,
        nik: formData.nik,
        dusun_id: formData.dusun_id || (dusunList[0]?.id || null),
        posyandu_id: formData.posyandu_id || (posyanduList[0]?.id || null),
        role_id: formData.role_id || (rolesList.find(r => r.kode === 'kader')?.id || null),
        telepon: formData.telepon,
        email: formData.email || `${formData.nama.toLowerCase().replace(/\s+/g, '.')}@manudjaya.id`
      });

      await refreshList();
      setIsModalOpen(false);
      setFormData({
        nama: '',
        nik: '',
        dusun_id: dusunList[0]?.id || '',
        posyandu_id: posyanduList[0]?.id || '',
        role_id: rolesList.find(r => r.kode === 'kader')?.id || '',
        telepon: '',
        email: '',
      });

      if (onShowToast) {
        onShowToast(`Kader baru "${formData.nama}" berhasil disimpan ke database!`, 'success');
      }
    } catch (err) {
      console.error(err);
      if (onShowToast) {
        onShowToast('Gagal menyimpan kader baru ke database.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredKader = kaderList.filter((k) => {
    const matchQuery = 
      k.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.nik.includes(searchQuery) ||
      k.telepon.includes(searchQuery);
    const matchDusun = dusunFilter === 'Semua' || k.dusun === dusunFilter;
    const matchStatus = statusFilter === 'Semua' || k.status === statusFilter;
    return matchQuery && matchDusun && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-bold mb-2">
            <ShieldCheck size={13} />
            <span>Hak Akses Super Administrator</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kelola Kader & Petugas Posyandu
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manajemen penugasan, registrasi kader baru, dan status operasional kader Desa Manud Jaya.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 inline-flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <UserPlus size={16} />
          <span>Tambah Kader Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, NIK, atau nomor telepon..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={dusunFilter}
            onChange={(e) => setDusunFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="Semua">Semua Wilayah</option>
            {dusunList.length > 0 ? (
              dusunList.map((d) => (
                <option key={d.id} value={d.nama}>{d.nama}</option>
              ))
            ) : (
              <>
                <option value="Dusun 1">Dusun 1</option>
                <option value="Dusun 2">Dusun 2</option>
                <option value="Dusun 3">Dusun 3</option>
              </>
            )}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="Semua">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Non-Aktif">Non-Aktif</option>
            <option value="Cuti">Cuti</option>
          </select>
        </div>
      </div>

      {/* Grid Kartu Kader */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredKader.map((kader) => {
          const isActive = getIsActive(kader);
          return (
            <div 
              key={kader.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {kader.nama.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{kader.nama}</h3>
                      <p className="text-[11px] text-blue-600 font-medium">{kader.peran}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {isActive ? 'Aktif' : 'Cuti / Non-Aktif'}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 w-16">NIK:</span>
                    <span className="font-mono text-slate-800 font-medium">{kader.nik}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-slate-400 shrink-0" />
                    <span>{kader.posyandu} ({kader.dusun})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-slate-400 shrink-0" />
                    <span>{kader.telepon}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{kader.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-400">Sejak: {kader.tanggal_bergabung}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(kader.id, kader.nama)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                      isActive 
                        ? 'text-amber-700 hover:bg-amber-50 border border-amber-200' 
                        : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                    }`}
                  >
                    {isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHapusKader(kader.id, kader.nama)}
                    title="Hapus Kader (Suspend)"
                    className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Tambah Kader Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserPlus size={18} />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Tambah Kader Posyandu Baru
                </h2>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSimpanKader} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Kader *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rina Anggraini"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">NIK (16 Digit) *</label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="Contoh: 3275025501980005"
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Wilayah / Dusun *</label>
                  <select
                    value={formData.dusun_id}
                    onChange={(e) => {
                      const newDusunId = e.target.value;
                      // Filter posyandu yang cocok jika ada
                      const matchingPosyandu = posyanduList.find(p => p.dusun_id === newDusunId);
                      setFormData({ 
                        ...formData, 
                        dusun_id: newDusunId,
                        posyandu_id: matchingPosyandu ? matchingPosyandu.id : formData.posyandu_id
                      });
                    }}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                  <label className="block font-bold text-slate-700 mb-1">Posyandu Penugasan *</label>
                  <select
                    value={formData.posyandu_id}
                    onChange={(e) => setFormData({ ...formData, posyandu_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {posyanduList.length > 0 ? (
                      posyanduList
                        .filter(p => !formData.dusun_id || !p.dusun_id || p.dusun_id === formData.dusun_id)
                        .map((p) => (
                          <option key={p.id} value={p.id}>{p.nama}</option>
                        ))
                    ) : (
                      <option value="">Pilih Posyandu...</option>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Peran / Jabatan Sistem</label>
                <select
                  value={formData.role_id}
                  onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {rolesList.length > 0 ? (
                    rolesList.map((r) => (
                      <option key={r.id} value={r.id}>{r.nama || r.kode}</option>
                    ))
                  ) : (
                    <option value="">Kader Posyandu</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. WhatsApp / HP *</label>
                  <input
                    type="text"
                    required
                    placeholder="08123456789"
                    value={formData.telepon}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Resmi (Opsional)</label>
                  <input
                    type="email"
                    placeholder="kader@manudjaya.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Simpan Data Kader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Kader (Tanpa Browser Popup) */}
      <ConfirmModal
        isOpen={Boolean(kaderToDelete)}
        title="Hapus Data Kader"
        message={`Apakah Anda yakin ingin menghapus kader "${kaderToDelete?.nama}"?\n\nCatatan: Data akan disuspend (soft delete) sehingga tidak muncul lagi di operasional aktif.`}
        confirmLabel="Hapus Kader"
        onConfirm={confirmHapusKader}
        onClose={() => setKaderToDelete(null)}
      />
    </div>
  );
}
