import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3500 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const config = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />,
    },
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: <AlertCircle size={18} className="text-rose-600 shrink-0" />,
    },
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: <Info size={18} className="text-blue-600 shrink-0" />,
    },
  }[type] || {
    bg: 'bg-slate-50 border-slate-200 text-slate-800',
    icon: <Info size={18} className="text-slate-600 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm w-full">
      <div className={`p-4 rounded-2xl border shadow-lg flex items-center justify-between gap-3 ${config.bg}`}>
        <div className="flex items-center gap-3">
          {config.icon}
          <p className="text-xs font-semibold leading-snug">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 text-current opacity-70 hover:opacity-100 transition-opacity"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
