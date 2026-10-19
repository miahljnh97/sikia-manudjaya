import React from 'react';
import { Settings, User, Bell, Lock, Shield, Phone } from 'lucide-react';

export default function PengaturanView({ user, onShowToast }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Pengaturan Akun
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Kelola informasi profil, preferensi notifikasi pengingat, dan keamanan akun Buku KIA Digital
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6 max-w-2xl">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-pink-50 border-2 border-pink-100 flex items-center justify-center shrink-0">
            <img 
              src="/images/siti-aminah-avatar.png" 
              alt="Avatar" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{user?.nama || 'Siti Aminah'}</h3>
            <p className="text-xs text-slate-400">Pengguna Buku KIA Digital (Ibu Hamil & Balita)</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              disabled 
              value={user?.nama || 'Siti Aminah'} 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Nomor WhatsApp Pengingat</label>
            <input 
              type="text" 
              defaultValue="0812-3456-7890" 
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Nomor ini digunakan untuk menerima pesan pengingat jadwal posyandu dan minum tablet TTD.
            </span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onShowToast && onShowToast('Pengaturan profil berhasil disimpan', 'success')}
              className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
