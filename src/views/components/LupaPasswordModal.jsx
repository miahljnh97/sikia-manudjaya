import React from 'react';

export default function LupaPasswordModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 text-center border border-white/80 space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Lupa Password
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-3 leading-relaxed max-w-xs mx-auto">
            Silakan hubungi Administrator Posyandu untuk melakukan reset password.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 px-4 bg-[#FF6384] hover:bg-[#F85175] active:bg-[#e43f63] text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-rose-500/20 transition-all cursor-pointer"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
