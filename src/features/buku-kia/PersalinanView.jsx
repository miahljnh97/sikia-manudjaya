import React from 'react';
import { Baby, Calendar, MapPin, User, CheckCircle2, HeartHandshake } from 'lucide-react';

export default function PersalinanView({ onShowToast }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Kesehatan Ibu / Persalinan
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Rencana persalinan dan catatan proses kelahiran buah hati sesuai standar Buku KIA
        </p>
      </div>

      {/* Rencana Persalinan (P4K) */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-rose-500 flex items-center justify-center shrink-0">
            <HeartHandshake size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Perencanaan Persalinan (P4K)</h2>
            <p className="text-xs text-slate-400">Program Perencanaan Persalinan dan Pencegahan Komplikasi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400">Penolong Persalinan Terpilih</span>
            <div className="text-sm font-bold text-slate-900">Bidan Siti, S.Tr.Keb & Dokter Obgyn</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400">Tempat Persalinan Rencana</span>
            <div className="text-sm font-bold text-slate-900">Puskesmas Manud Jaya (PONED)</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400">Pendamping Persalinan</span>
            <div className="text-sm font-bold text-slate-900">Suami (Ahmad Fauzi)</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400">Transportasi / Kendaraan Siaga</span>
            <div className="text-sm font-bold text-slate-900">Mobil Siaga Desa Manud Jaya (Ambulans Desa)</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 md:col-span-2">
            <span className="text-slate-400">Calon Pendonor Darah Siaga</span>
            <div className="text-sm font-bold text-slate-900">Keluarga (Golongan Darah O) - 2 Orang Siap</div>
          </div>
        </div>
      </div>

      {/* Tanda-tanda Awal Persalinan */}
      <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-rose-900 mb-3">Tanda-tanda Persalinan Sudah Dekat:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-rose-800">
          <div className="p-3.5 bg-white/80 rounded-2xl border border-rose-100">
            <span className="font-bold block mb-1">1. Mulas Teratur</span>
            <span>Rasa mulas yang semakin sering, kuat, dan teratur selang 5-10 menit.</span>
          </div>
          <div className="p-3.5 bg-white/80 rounded-2xl border border-rose-100">
            <span className="font-bold block mb-1">2. Keluar Lendir Darah</span>
            <span>Keluarnya lendir bercampur sedikit darah dari jalan lahir.</span>
          </div>
          <div className="p-3.5 bg-white/80 rounded-2xl border border-rose-100">
            <span className="font-bold block mb-1">3. Pecah Ketuban</span>
            <span>Keluarnya cairan ketuban jernih dari jalan lahir secara tiba-tiba.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
