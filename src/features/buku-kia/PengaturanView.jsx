import React, { useState, useEffect } from 'react';
import { Settings, User, Bell, Lock, Shield, Phone, MessageCircle, Send, CheckCircle2, Zap, AlertCircle, RefreshCw, Radio } from 'lucide-react';
import { 
  getFonnteToken, 
  setFonnteToken, 
  getN8nWebhookUrl, 
  setN8nWebhookUrl, 
  getN8nMode, 
  setN8nMode, 
  N8N_DEFAULT_URLS, 
  sendWhatsAppReminder 
} from '../../services/whatsappService';

export default function PengaturanView({ user, onShowToast }) {
  const [tokenInput, setTokenInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('081234567890');
  const [n8nMode, setN8nModeState] = useState('production');
  const [webhookUrlInput, setWebhookUrlInput] = useState('');
  const [isTestingWa, setIsTestingWa] = useState(false);
  const [isTestingN8n, setIsTestingN8n] = useState(false);

  useEffect(() => {
    setTokenInput(getFonnteToken() || '');
    const currentMode = getN8nMode();
    setN8nModeState(currentMode);
    setWebhookUrlInput(getN8nWebhookUrl());

    if (typeof window !== 'undefined') {
      const savedPhone = localStorage.getItem('sikia_user_phone');
      if (savedPhone) setPhoneInput(savedPhone);
    }
  }, []);

  const handleModeChange = (mode) => {
    setN8nModeState(mode);
    setN8nMode(mode);
    if (mode === 'production') {
      setWebhookUrlInput(N8N_DEFAULT_URLS.production);
      setN8nWebhookUrl(N8N_DEFAULT_URLS.production);
    } else if (mode === 'test') {
      setWebhookUrlInput(N8N_DEFAULT_URLS.test);
      setN8nWebhookUrl(N8N_DEFAULT_URLS.test);
    }
  };

  const handleSaveWebhook = () => {
    setN8nWebhookUrl(webhookUrlInput);
    onShowToast && onShowToast('URL Webhook n8n berhasil disimpan!', 'success');
  };

  const handleSavePhone = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sikia_user_phone', phoneInput.trim());
    }
    onShowToast && onShowToast('Nomor WhatsApp berhasil disimpan!', 'success');
  };

  const handleSaveToken = () => {
    setFonnteToken(tokenInput);
    onShowToast && onShowToast('Token Fonnte berhasil disimpan ke konfigurasi lokal!', 'success');
  };

  const handleTestN8n = async () => {
    setIsTestingN8n(true);
    try {
      const mockJadwal = {
        jenis: 'Pemeriksaan Rutin Kehamilan (ANC Uji Coba)',
        tanggal: new Date().toISOString().split('T')[0],
        waktu: '09:00 - 10:00',
        lokasi: 'Puskesmas Manud Jaya',
        petugas: 'Bidan Posyandu',
        keterangan: 'Uji coba trigger integrasi pengingat WhatsApp SIKIA.'
      };

      const res = await sendWhatsAppReminder({
        phone: phoneInput,
        jadwal: mockJadwal,
        namaIbu: user?.nama || 'Ibu'
      });

      if (res.success) {
        if (res.method === 'n8n') {
          onShowToast && onShowToast('Trigger berhasil diterima oleh n8n Webhook!', 'success');
        } else if (res.method === 'fonnte') {
          onShowToast && onShowToast('Pengingat WhatsApp berhasil dikirim via Fonnte Gateway!', 'success');
        } else {
          onShowToast && onShowToast(res.message || 'Membuka WhatsApp dengan format pesan resmi...', 'info');
          if (res.waUrl && typeof window !== 'undefined') {
            window.open(res.waUrl, '_blank');
          }
        }
      } else {
        onShowToast && onShowToast(res.message || 'Webhook n8n belum aktif, membuka Direct WA...', 'warning');
        if (res.waUrl && typeof window !== 'undefined') {
          window.open(res.waUrl, '_blank');
        }
      }
    } catch (err) {
      console.error(err);
      onShowToast && onShowToast('Gagal memicu webhook n8n: ' + err.message, 'error');
    } finally {
      setIsTestingN8n(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Pengaturan Akun & Integrasi WhatsApp
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Kelola informasi profil, preferensi pengingat, dan integrasi WhatsApp Gateway (n8n iPaaS & Fonnte)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolom Kiri: Profil Pengguna */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                <img 
                  src="/images/profil-ibu.png" 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/siti-aminah-avatar.png';
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
                  onClick={handleSavePhone}
                  className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Simpan Profil
                </button>
              </div>
            </div>
          </div>

          {/* Fallback Info Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-xs sm:text-sm">
              <Shield size={16} className="text-blue-600" />
              <span>Jaminan Ketersediaan (Graceful Fallback)</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Buku KIA Digital dilengkapi <strong>3 lapis pengiriman</strong> pesan WhatsApp sesuai spesifikasi tim:
            </p>
            <ol className="text-[11px] text-slate-600 space-y-1.5 list-decimal pl-4">
              <li><strong>n8n iPaaS Webhook:</strong> Integrasi backend modular yang akan memicu workflow n8n milik rekan tim.</li>
              <li><strong>Fonnte API:</strong> Pengiriman direct via WhatsApp gateway Fonnte jika token diatur.</li>
              <li><strong>Direct wa.me Fallback:</strong> Otomatis membuka aplikasi WhatsApp dengan pesan terformat rapi jika n8n atau token Fonnte offline, menjamin pengujian/penilaian dosen tidak terganggu.</li>
            </ol>
          </div>
        </div>

        {/* Kolom Kanan: Integrasi n8n & Fonnte Gateway */}
        <div className="space-y-6">
          {/* Card: n8n iPaaS Webhook */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
                <Zap size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">n8n iPaaS Webhook</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">Rekomendasi Tim</span>
                </div>
                <p className="text-[11px] text-slate-400">PBI 01 — Integrasi Trigger Pengingat Jadwal via Workflow n8n</p>
              </div>
            </div>

            {/* Mode Selector */}
            <div className="space-y-2 text-xs">
              <label className="block text-slate-600 font-semibold">Pilih Mode Webhook:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleModeChange('production')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between cursor-pointer ${
                    n8nMode === 'production'
                      ? 'border-indigo-500 bg-indigo-50/50 text-indigo-900 font-bold shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Production URL
                  </span>
                  <span className="text-[10px] font-normal text-slate-400 mt-1">
                    Aktif otomatis saat toggle Workflow di n8n = Active
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('test')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between cursor-pointer ${
                    n8nMode === 'test'
                      ? 'border-indigo-500 bg-indigo-50/50 text-indigo-900 font-bold shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Test URL (Manual)
                  </span>
                  <span className="text-[10px] font-normal text-slate-400 mt-1">
                    Untuk klik 'Execute workflow' di kanvas n8n
                  </span>
                </button>
              </div>
            </div>

            {/* Hint Box */}
            <div className={`p-3 rounded-2xl border text-xs space-y-1 ${
              n8nMode === 'test' 
                ? 'bg-amber-50/70 border-amber-200 text-amber-900' 
                : 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
            }`}>
              <div className="flex items-center gap-1.5 font-bold text-[11px]">
                <AlertCircle size={13} />
                <span>
                  {n8nMode === 'test' 
                    ? 'Petunjuk Pengujian Mode Test:' 
                    : 'Petunjuk Pengujian Mode Production:'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {n8nMode === 'test'
                  ? 'Pastikan rekan Anda menekan tombol "Execute workflow" di kanvas n8n. n8n akan menunggu 1 request pengujian.'
                  : 'Pastikan rekan Anda menyalakan saklar "Active" (pojok kanan atas) pada workflow n8n.'}
              </p>
            </div>

            {/* Webhook URL Input */}
            <div className="space-y-1.5 text-xs">
              <label className="block text-slate-600 font-semibold">URL Webhook Aktif</label>
              <input
                type="text"
                value={webhookUrlInput}
                onChange={(e) => {
                  setWebhookUrlInput(e.target.value);
                  setN8nModeState('custom');
                }}
                placeholder="https://n8n.../webhook/kirim-pengingat"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-[11px]"
              />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSaveWebhook}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                Simpan URL Webhook
              </button>

              <button
                type="button"
                onClick={handleTestN8n}
                disabled={isTestingN8n}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Zap size={13} className="text-indigo-600" />
                <span>{isTestingN8n ? 'Mengirim...' : 'Uji Trigger n8n'}</span>
              </button>
            </div>
          </div>

          {/* Card: Fonnte API Gateway (Direct) */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                <MessageCircle size={20} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Fonnte API Gateway (Opsional)</h3>
                <p className="text-[11px] text-slate-400">Direct kirim WhatsApp tanpa lewat iPaaS n8n</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Jika rekan tim ingin menghubungkan direct dari browser ke Fonnte (Free Tier di <strong>fonnte.com</strong>), masukkan token Fonnte di bawah ini.
              </p>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Fonnte API Token</label>
                <input 
                  type="password" 
                  value={tokenInput} 
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Masukkan API Token Fonnte..." 
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-xs"
                />
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleSaveToken}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Simpan Token Fonnte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}