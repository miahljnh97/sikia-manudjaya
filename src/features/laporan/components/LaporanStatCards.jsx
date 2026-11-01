import React from 'react';
import { Users, Smile, Syringe, Activity, TrendingUp, TrendingDown } from 'lucide-react';

export default function LaporanStatCards({ stats }) {
  const cards = [
    {
      title: 'Total Kunjungan',
      value: stats?.totalKunjungan?.value ?? 0,
      trend: stats?.totalKunjungan?.trend ?? 0,
      trendLabel: 'dari bulan sebelum',
      icon: Users,
      iconColor: 'text-[#E11D48]',
      iconBg: 'bg-rose-50 border border-rose-100',
    },
    {
      title: 'Balita Ditimbang',
      value: stats?.balitaDitimbang?.value ?? 0,
      trend: stats?.balitaDitimbang?.trend ?? 0,
      trendLabel: 'dari bulan sebelum',
      icon: Smile,
      iconColor: 'text-[#0284C7]',
      iconBg: 'bg-sky-50 border border-sky-100',
    },
    {
      title: 'Imunisasi Diberi',
      value: stats?.imunisasiDiberi?.value ?? 0,
      trend: stats?.imunisasiDiberi?.trend ?? 0,
      trendLabel: 'dari bulan sebelum',
      icon: Syringe,
      iconColor: 'text-[#7C3AED]',
      iconBg: 'bg-purple-50 border border-purple-100',
    },
    {
      title: 'Pemeriksaan Ibu',
      value: stats?.pemeriksaanIbu?.value ?? 0,
      trend: stats?.pemeriksaanIbu?.trend ?? 0,
      trendLabel: 'dari bulan sebelum',
      icon: Activity,
      iconColor: 'text-[#059669]',
      iconBg: 'bg-emerald-50 border border-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        const isPositive = card.trend >= 0;

        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs flex items-center justify-between transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${card.iconBg}`}>
                <IconComponent className={card.iconColor} size={24} />
              </div>

              <div>
                <span className="text-xs font-medium text-slate-500 block">
                  {card.title}
                </span>
                <span className="text-2xl font-bold text-slate-900 block tracking-tight mt-0.5">
                  {card.value}
                </span>
                <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-slate-500">
                  <span className={`inline-flex items-center gap-0.5 font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {isPositive ? `+${card.trend}%` : `${card.trend}%`}
                  </span>
                  <span className="text-slate-400 truncate max-w-[110px]">
                    {card.trendLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
