import React from 'react';
import { Users, CheckCircle2, Clock, Heart, Smile, Activity } from 'lucide-react';

export default function StatCards({ stats }) {
  const cards = [
    {
      title: 'Total Peserta',
      subtitle: 'Terdaftar',
      value: stats.total,
      icon: Users,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Sudah Hadir',
      subtitle: '',
      value: stats.sudahHadir,
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Belum Hadir',
      subtitle: '',
      value: stats.belumHadir,
      icon: Clock,
      iconColor: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Ibu Hamil',
      subtitle: '',
      value: stats.ibuHamil,
      icon: Heart,
      iconColor: 'text-rose-500',
      bgColor: 'bg-rose-50',
    },
    {
      title: 'Bayi',
      subtitle: '(0-11 bln)',
      value: stats.bayi,
      icon: Smile,
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Balita',
      subtitle: '(1-5 thn)',
      value: stats.balita,
      icon: Activity,
      iconColor: 'text-teal-500',
      bgColor: 'bg-teal-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {cards.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:shadow-md transition-shadow"
          >
            <div className={`w-11 h-11 rounded-xl ${item.bgColor} flex items-center justify-center shrink-0`}>
              <Icon size={22} className={item.iconColor} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 leading-none">
                {item.value}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium leading-tight">
                {item.title}
                {item.subtitle && (
                  <span className="block text-[11px] text-slate-400 font-normal">
                    {item.subtitle}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
