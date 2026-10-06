import React from 'react';

export default function LupaPasswordPage({ onBack }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      {/* Background Image Layer with Opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 pointer-events-none"
        style={{
          backgroundImage: "url('/background.png')",
        }}
      />

      {/* Kartu Lupa Password - Persis Gambar Figma media_1791133015318.jpg */}
      <div className="relative z-10 w-full max-w-[480px] bg-white rounded-[28px] shadow-2xl p-8 sm:p-12 text-center border border-white/80">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          Lupa Password
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-8 leading-relaxed max-w-xs mx-auto">
          Silakan hubungi Administrator Posyandu untuk melakukan reset password.
        </p>

        <button
          type="button"
          onClick={onBack}
          className="w-full py-3.5 px-4 bg-[#FF7893] hover:bg-[#ff6180] active:bg-[#f15072] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#FF7893]/25 transition-all active:scale-[0.99] cursor-pointer"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
