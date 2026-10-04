import React from 'react';
import { Users, Check, Clock, Heart, Smile } from 'lucide-react';

export default function StatCards({ stats }) {
  const cards = [
    {
      title: 'Total Peserta Terdaftar',
      isTwoLine: true,
      line1: 'Total Peserta',
      line2: 'Terdaftar',
      value: stats.total,
      icon: Users,
      iconColor: 'text-[#3B82F6]',
      bgColor: 'bg-[#EFF6FF]',
    },
    {
      title: 'Sudah Hadir',
      isTwoLine: false,
      value: stats.sudahHadir,
      icon: Check,
      iconColor: 'text-[#10B981]',
      bgColor: 'bg-[#ECFDF5]',
    },
    {
      title: 'Belum Hadir',
      isTwoLine: false,
      value: stats.belumHadir,
      icon: Clock,
      iconColor: 'text-[#F59E0B]',
      bgColor: 'bg-[#FFFBEB]',
    },
    {
      title: 'Ibu Hamil',
      isTwoLine: false,
      value: stats.ibuHamil,
      icon: Heart,
      iconColor: 'text-[#F43F5E]',
      bgColor: 'bg-[#FFF1F2]',
    },
    {
      title: 'Bayi (0-11 bln)',
      isTwoLine: true,
      line1: 'Bayi (0-11 bln)',
      value: stats.bayi,
      icon: Smile,
      iconColor: 'text-[#6366F1]',
      bgColor: 'bg-[#EEF2FF]',
    },
    {
      title: 'Balita (1-5 thn)',
      isTwoLine: true,
      line1: 'Balita (1-5 thn)',
      value: stats.balita,
      icon: Smile,
      iconColor: 'text-[#10B981]',
      bgColor: 'bg-[#ECFDF5]',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {cards.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3.5 hover:shadow-sm transition-shadow"
          >
            <div className={`w-11 h-11 rounded-2xl ${item.bgColor} flex items-center justify-center shrink-0`}>
              <Icon size={22} strokeWidth={2.5} className={item.iconColor} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 leading-none">
                {item.value}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium leading-tight">
                {item.line1 ? (
                  <>
                    <span>{item.line1}</span>
                    {item.line2 && <span className="block">{item.line2}</span>}
                  </>
                ) : (
                  <span>{item.title}</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
