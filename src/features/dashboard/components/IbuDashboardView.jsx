import React from 'react';
import { Calendar, Bell, Heart, Smile, Activity, FileCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function IbuDashboardView({ user }) {
  const anak = {
    nama: 'Budi Santoso',
    usia: '8 bulan',
    statusGizi: 'Gizi Baik (Normal)',
    jadwalBerikutnya: '28 Oktober 2026',
    imunisasiTerakhir: 'DPT-HB-Hib 3 & Polio 4 (Sudah Lengkap)',
    imunisasiBerikutnya: 'Campak Rubella (Usia 9 Bulan)',
    beratBadan: '8.4 kg',
    tinggiBadan: '70.5 cm'
  };

  return (
    <div className="space-y-6">
      {/* Header Greeting Spesifik Ibu */}
      <div className="bg-gradient-to-r from-rose-50 via-white to-pink-50 border border-rose-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider">
            Portal Orang Tua Balita
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Selamat Datang, {user?.nama || 'Ibu Aminah'}! 🌸
          </h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Pantau jadwal pemeriksaan, tumbuh kembang, dan riwayat imunisasi ananda tercinta.
          </p>
        </div>

        <div className="bg-white border border-rose-200/60 shadow-xs px-4 py-3 rounded-2xl flex items-center gap-3 shrink-0">
          <Calendar size={22} className="text-rose-500" />
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Jadwal Posyandu Berikutnya</div>
            <div className="text-xs font-bold text-slate-900">{anak.jadwalBerikutnya}</div>
          </div>
        </div>
      </div>

      {/* Profil Tumbuh Kembang Anak */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Smile size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">{anak.nama}</div>
            <div className="text-xs text-slate-400 font-medium">Usia: {anak.usia}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">{anak.statusGizi}</div>
            <div className="text-xs text-slate-400 font-medium">Status Tumbuh Kembang</div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Activity size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">{anak.beratBadan} / {anak.tinggiBadan}</div>
            <div className="text-xs text-slate-400 font-medium">BB & Tinggi Badan Terkini</div>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Bell size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">Aktif via WhatsApp</div>
            <div className="text-xs text-slate-400 font-medium">Notifikasi Pengingat (PBI-01)</div>
          </div>
        </div>
      </div>

      {/* Kartu KIA Digital & Pengingat Imunisasi (PBI-01 & PBI-02 Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Riwayat Imunisasi */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck size={18} className="text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Buku KIA Digital - Riwayat Imunisasi</h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Tepat Waktu</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between">
              <div>
                <div className="font-bold text-slate-800">HB 0 (Hepatitis B)</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Diberikan saat lahir di Puskesmas Manud Jaya</div>
              </div>
              <span className="text-emerald-600 font-semibold text-[11px]">✓ Selesai</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between">
              <div>
                <div className="font-bold text-slate-800">BCG & Polio 1</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Diberikan usia 1 bulan di Posyandu</div>
              </div>
              <span className="text-emerald-600 font-semibold text-[11px]">✓ Selesai</span>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-100 flex items-start justify-between">
              <div>
                <div className="font-bold text-rose-900">{anak.imunisasiBerikutnya}</div>
                <div className="text-rose-600 text-[11px] mt-0.5">Jadwal perkiraan: Bulan depan (Oktober 2026)</div>
              </div>
              <span className="text-rose-700 font-bold text-[11px] bg-rose-100 px-2 py-0.5 rounded">Akan Datang</span>
            </div>
          </div>
        </div>

        {/* Edukasi Gizi & Kontak Bidan Desa */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Heart size={18} className="text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">Konsultasi Kesehatan & Bidan Desa</h3>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-amber-600" />
              <span>Pesan Kesehatan Minggu Ini</span>
            </div>
            <p className="text-[11px] text-amber-800/90 leading-relaxed">
              Pastikan variasi MPASI ananda mencakup sumber protein hewani (telur, ikan, atau ayam) untuk mencegah risiko stunting.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800">Bidan Siti, S.Tr.Keb</div>
              <div className="text-slate-500 text-[11px]">Bidan Desa Manud Jaya</div>
            </div>
            <button 
              onClick={() => alert('Fitur chat/konsultasi WhatsApp siap terhubung ke nomor Bidan Desa')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px] shadow-xs"
            >
              Hubungi via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
