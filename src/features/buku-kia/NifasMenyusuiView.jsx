import React from 'react';
import { Heart, Baby, Sparkles, CheckCircle2 } from 'lucide-react';

export default function NifasMenyusuiView({ onShowToast }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Kesehatan Ibu / Nifas & Menyusui
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Panduan masa nifas (42 hari pasca persalinan) dan keberhasilan pemberian ASI Eksklusif
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Jadwal Pelayanan Nifas (KF 1 - KF 4) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-rose-500 flex items-center justify-center shrink-0">
              <Heart size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Jadwal Kunjungan Nifas (KF)</h2>
              <p className="text-xs text-slate-400">Pemeriksaan pasca salin oleh tenaga kesehatan</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">KF 1 (6 jam - 2 hari)</span>
                <span className="text-slate-500 text-[11px]">Pencegahan perdarahan & inisiasi menyusui</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">Terencana</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">KF 2 (3 - 7 hari)</span>
                <span className="text-slate-500 text-[11px]">Pemeriksaan rahim, lokia, dan tanda infeksi</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">Terencana</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">KF 3 (8 - 28 hari)</span>
                <span className="text-slate-500 text-[11px]">Kesehatan ibu dan konseling KB pasca salin</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">Terencana</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">KF 4 (29 - 42 hari)</span>
                <span className="text-slate-500 text-[11px]">Evaluasi masa nifas dan pemakaian kontrasepsi</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">Terencana</span>
            </div>
          </div>
        </div>

        {/* Manajemen Laktasi & ASI Eksklusif */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-rose-500 flex items-center justify-center shrink-0">
              <Baby size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Panduan ASI Eksklusif</h2>
              <p className="text-xs text-slate-400">Kunci sukses pemberian ASI 0 - 6 bulan</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-pink-50/50 border border-pink-100">
              <span className="font-bold text-rose-900 block mb-1">Perlekatan Menyusui yang Benar:</span>
              <ul className="space-y-1 text-slate-600 list-disc list-inside text-[11px]">
                <li>Mulut bayi terbuka lebar</li>
                <li>Dagu bayi menempel pada payudara ibu</li>
                <li>Sebagian besar areola bawah masuk ke dalam mulut bayi</li>
                <li>Bibir bawah bayi terlipat keluar (dower)</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
              <span className="font-bold block mb-1">Pemberian Kapsul Vitamin A:</span>
              <p className="text-[11px] text-slate-600">
                Ibu nifas meminum 2 kapsul vitamin A merah (200.000 IU), 1 kapsul diminum segera setelah melahirkan dan 1 kapsul lagi 24 jam kemudian.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
