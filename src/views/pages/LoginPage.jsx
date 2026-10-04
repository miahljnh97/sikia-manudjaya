import React, { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { DUMMY_ACCOUNTS } from '../../models/pesertaModel';

export default function LoginPage({ onLoginSuccess, onGoToLupaPassword }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showQuickFill, setShowQuickFill] = useState(false);

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
    } else if (type === 'admin') {
      setEmail(DUMMY_ACCOUNTS.admin.email);
      setPassword('Admin123!');
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
      {/* Main Login Card - Persis Figma media_1791133015258.jpg */}
      <div className="relative z-10 w-full max-w-[480px] sm:max-w-[500px] bg-white rounded-[28px] shadow-2xl p-8 sm:p-12 border border-white/60">
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
              className="w-full px-4 py-3 text-sm text-slate-800 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6782]/30 focus:border-[#FF6782] transition-all placeholder:text-slate-400"
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
              placeholder="************"
              className="w-full px-4 py-3 text-sm text-slate-800 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6782]/30 focus:border-[#FF6782] transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#FF6782] focus:ring-[#FF6782]"
              />
              <span>Ingat saya</span>
            </label>
            <button 
              type="button"
              onClick={onGoToLupaPassword}
              className="text-slate-600 hover:text-[#FF6782] transition-colors cursor-pointer bg-transparent border-none p-0 text-xs"
            >
              Lupa password?
            </button>
          </div>

          {/* Tombol Masuk - Pink / Coral Sesuai Figma */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#FF6782] hover:bg-[#ff5270] active:bg-[#e43f63] disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-500/20 transition-all active:scale-[0.99] cursor-pointer"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>

      {/* Floating Helper Penguji / Dosen (Di pojok kanan bawah, tidak merusak card figma) */}
      <div className="fixed bottom-3 right-3 z-30">
        {!showQuickFill ? (
          <button
            type="button"
            onClick={() => setShowQuickFill(true)}
            className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-medium rounded-full shadow-lg backdrop-blur-xs transition-all cursor-pointer opacity-80 hover:opacity-100"
          >
            ⚡ Pintasan Akun Evaluasi
          </button>
        ) : (
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3 shadow-2xl text-xs space-y-2 w-64 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[11px] text-slate-700">Pilih Akun Demo:</span>
              <button
                type="button"
                onClick={() => setShowQuickFill(false)}
                className="text-[10px] text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('kader')}
                className="py-1 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[11px] font-medium text-left truncate"
              >
                Kader Posyandu
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('bidan')}
                className="py-1 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[11px] font-medium text-left truncate"
              >
                Bidan Desa
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('ibu')}
                className="py-1 px-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded text-[11px] font-medium text-left truncate"
              >
                Ibu Balita
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="py-1 px-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded text-[11px] font-bold text-left truncate"
              >
                Super Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
