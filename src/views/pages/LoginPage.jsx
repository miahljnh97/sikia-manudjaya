import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { DUMMY_ACCOUNTS } from '../../models/pesertaModel';

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleQuickFill = (type) => {
    if (type === 'kader') {
      setEmail(DUMMY_ACCOUNTS.kader.email);
      setPassword('Kader123!');
    } else if (type === 'bidan') {
      setEmail(DUMMY_ACCOUNTS.bidan.email);
      setPassword('Bidan123!');
    } else if (type === 'ibu') {
      setEmail(DUMMY_ACCOUNTS.ibu.email);
      setPassword('Ibu123!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await onLoginSuccess(email, password);
    } catch (err) {
      setErrorMsg(err.message || 'Login gagal, periksa email & password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/background.svg'), linear-gradient(135deg, #e0f2fe 0%, #fef3c7 50%, #fce7f3 100%)",
      }}
    >
      {/* Overlay tipis agar form lebih pop-up dan kontras */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] pointer-events-none" />

      {/* Main Login Card - Sesuai Figma */}
      <div className="relative z-10 w-full max-w-[480px] bg-white rounded-[32px] shadow-2xl p-8 sm:p-12 border border-white/60">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Masuk ke Akun Anda
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2.5 leading-relaxed max-w-xs mx-auto">
            Akses informasi medis, hasil pemeriksaan, dan layanan kesehatan anda dengan aman
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-4 py-3 text-sm text-slate-800 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 text-sm text-slate-800 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Ingat saya</span>
            </label>
            <a 
              href="#lupa" 
              onClick={(e) => { e.preventDefault(); alert('Silakan hubungi Bidan Desa atau Admin Puskesmas untuk reset kata sandi.'); }}
              className="text-slate-600 hover:text-blue-600 transition-colors"
            >
              Lupa password?
            </a>
          </div>

          {/* Tombol Masuk */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.99] cursor-pointer"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>

          {/* Belum punya akun */}
          <div className="text-center text-xs text-slate-600 pt-2">
            Belum punya akun?{' '}
            <a 
              href="#daftar" 
              onClick={(e) => { e.preventDefault(); handleQuickFill('kader'); }}
              className="font-semibold text-[#2563EB] hover:underline"
            >
              Daftar di sini
            </a>
          </div>
        </form>

        {/* Quick Fill untuk Evaluasi Dosen / Kelas (Sesuai Product Brief) */}
        <div className="mt-8 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
            Pintasan Akun Evaluasi (Sprint 1):
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('kader')}
              className="py-1.5 px-2 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700 hover:text-blue-700 transition-all text-center"
            >
              Kader
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('bidan')}
              className="py-1.5 px-2 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700 hover:text-blue-700 transition-all text-center"
            >
              Bidan
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('ibu')}
              className="py-1.5 px-2 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700 hover:text-blue-700 transition-all text-center"
            >
              Ibu Balita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
