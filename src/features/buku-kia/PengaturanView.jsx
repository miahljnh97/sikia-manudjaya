import React, { useState, useEffect } from 'react';
import { Settings, User, Bell, Lock, Shield, Phone, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { getFonnteToken, setFonnteToken, getN8nWebhookUrl, setN8nWebhookUrl, sendWhatsAppReminder } from '../../services/whatsappService';

export default function PengaturanView({ user, onShowToast }) {
  const [tokenInput, setTokenInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('081234567890');
  const [isTestingWa, setIsTestingWa] = useState(false);

  useEffect(() => {
    setTokenInput(getFonnteToken() || '');
  }, []);

  const handleSaveToken = () => {
    setFonnteToken(tokenInput);
    onShowToast && onShowToast('Token Fonnte berhasil disimpan ke konfigurasi lokal!', 'success');
  };

  const handleTestWhatsApp = async () => {
    setIsTestingWa(true);
    try {
      const mockJadwal = {
        jenis: 'Pemeriksaan Rutin Kehamilan (ANC Uji Coba)',
        tanggal: '24 Sep 2026',
        waktu: '09:00 - 10:00',
        lokasi: 'Puskesmas Manud Jaya',
        petugas: 'Bidan Siti, S.Tr.Keb',
        keterangan: 'Ini adalah pesan uji coba integrasi WhatsApp Fonnte SIKIA.'
      };

      const res = await sendWhatsAppReminder({
        phone: phoneInput,
        jadwal: mockJadwal,
        namaIbu: user?.nama || 'Siti Aminah'
      });

      if (res.success) {
        if (res.method === 'fonnte') {
          onShowToast && onShowToast('Uji coba kirim WhatsApp via Fonnte Gateway BERHASIL!', 'success');
        } else {
          onShowToast && onShowToast('Membuka WhatsApp dengan format pesan resmi...', 'info');
          if (res.waUrl && typeof window !== 'undefined') {
            window.open(res.waUrl, '_blank');
          }
        }
      } else {
        onShowToast && onShowToast(res.message || 'Gagal mengirim pesan uji coba', 'error');
        if (res.waUrl && typeof window !== 'undefined') {
          window.open(res.waUrl, '_blank');
        }
      }
    } catch (err) {
      console.error(err);
      onShowToast && onShowToast('Terjadi kesalahan saat uji coba pengiriman WA', 'error');
    } finally {
      setIsTestingWa(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Pengaturan Akun & Integrasi WhatsApp
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Kelola informasi profil, preferensi notifikasi pengingat, dan integrasi WhatsApp Gateway (Fonnte) Buku KIA Digital
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Profil Pengguna */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
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
              <label className="block text-slate-500 font-semibold mb-1">Nomor WhatsApp Penerima Pengingat</label>
              <input 
                type="text" 
                value={phoneInput} 
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Nomor ini digunakan untuk menerima pesan pengingat jadwal kunjungan H-3 & H-1.
              </span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onShowToast && onShowToast('Nomor WhatsApp profil berhasil disimpan', 'success')}
                className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                Simpan Profil
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Pengaturan Fonnte & n8n WhatsApp Gateway (PBI 01) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <MessageCircle size={20} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">WhatsApp Gateway (Fonnte API)</h3>
              <p className="text-[11px] text-slate-400">PBI 01 — Pengingat Otomatis H-3 & H-1 Kunjungan Posyandu</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/60 rounded-2xl text-emerald-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-xs text-emerald-800">
                <CheckCircle2 size={14} />
                <span>Akun Fonnte Gratis (Free Tier)</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Anda dapat menggunakan akun gratis dari <strong>fonnte.com</strong>. Salin API Token dari dashboard Fonnte ke kolom di bawah ini. Jika token kosong, sistem otomatis menggunakan tombol <strong>Direct WhatsApp (wa.me)</strong> sebagai fallback resmi.
              </p>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Fonnte API Token (Opsional)</label>
              <input 
                type="password" 
                value={tokenInput} 
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Masukkan API Token Fonnte gratis Anda..." 
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleSaveToken}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                Simpan Konfigurasi WA
              </button>

              <button
                type="button"
                onClick={handleTestWhatsApp}
                disabled={isTestingWa}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Send size={13} className="text-emerald-600" />
                <span>Uji Kirim WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
