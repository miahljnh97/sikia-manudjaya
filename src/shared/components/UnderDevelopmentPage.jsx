import React from 'react';
import { Hammer, ArrowLeft, Clock } from 'lucide-react';

export default function UnderDevelopmentPage({ featureName, onBackToDashboard }) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-10 sm:p-16 shadow-xs flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-12">
      {/* Icon Ilustrasi Hammer di lingkaran bulat dengan animasi goyang/bounce */}
      <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-5 shadow-xs">
        <Hammer size={30} className="text-blue-500 animate-bounce" />
      </div>

      {/* Badge Kuning Keemasan: 🕒 Diperbarui untuk Segera Berkarya */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-[11px] font-semibold mb-3">
        <Clock size={12} className="text-amber-600" />
        <span>Diperbarui untuk Segera Berkarya</span>
      </div>

      {/* Headline & Description */}
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
        Oops, Halaman Sedang Dalam Pengembangan!
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-md">
        Fitur “{featureName}” saat ini sedang disiapkan oleh tim pengembang SIKIA Desa Manud Jaya
      </p>

      {/* Back CTA Button */}
      <button
        onClick={onBackToDashboard}
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
      >
        <ArrowLeft size={14} />
        <span>Kembali ke Dashboard</span>
      </button>
    </div>
  );
}
