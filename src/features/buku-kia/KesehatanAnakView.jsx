import React, { useState } from 'react';
import { 
  Baby, 
  Weight, 
  Ruler, 
  Syringe, 
  Activity, 
  CheckCircle2, 
  Calendar, 
  AlertCircle,
  FileCheck
} from 'lucide-react';

export default function KesehatanAnakView({ subFeature = 'Pertumbuhan', onShowToast }) {
  const [activeTab, setActiveTab] = useState(subFeature);

  const tabs = ['Pertumbuhan', 'Perkembangan', 'Imunisasi', 'Pemeriksaan'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Kesehatan Anak / {activeTab}
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Pantau pertumbuhan, milestone perkembangan, dan jadwal imunisasi ananda Alya Putri
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Profil Anak Ringkas */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-pink-50 border-2 border-pink-100 flex items-center justify-center shrink-0">
            <img 
              src="/images/baby-card.png" 
              alt="Alya Putri" 
              className="w-10 h-10 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Alya Putri</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Usia: 1 Tahun 6 Bulan (18 Bulan) · Jenis Kelamin: Perempuan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            Status: Gizi Baik (Normal)
          </div>
        </div>
      </div>

      {/* Konten Berdasarkan Tab */}
      {activeTab === 'Pertumbuhan' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-rose-500 flex items-center justify-center">
                  <Weight size={18} />
                </div>
                <span className="text-xs text-slate-400 font-medium">Berat Badan</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900">10,5 kg</div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                Sesuai Usia (+0.4 kg dari bln lalu)
              </span>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-rose-500 flex items-center justify-center">
                  <Ruler size={18} />
                </div>
                <span className="text-xs text-slate-400 font-medium">Tinggi Badan</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900">80 cm</div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                Sesuai Usia
              </span>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-rose-500 flex items-center justify-center">
                  <Activity size={18} />
                </div>
                <span className="text-xs text-slate-400 font-medium">Lingkar Kepala</span>
              </div>
              <div className="text-xl font-extrabold text-slate-900">46,5 cm</div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                Normal (Jalur Hijau)
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Kurva Pertumbuhan KMS (Kartu Menuju Sehat)</h3>
            <p className="text-xs text-slate-500">
              Garis pertumbuhan anak berada di dalam pita hijau, menunjukkan kenaikan berat badan adekuat (N - Naik).
            </p>
          </div>
        </div>
      )}

      {activeTab === 'Perkembangan' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Milestone Perkembangan KPSP (18 Bulan)</h3>
          <div className="space-y-3 text-xs">
            {[
              'Berdiri sendiri tanpa berpegangan',
              'Berjalan mengeksplorasi ruangan tanpa terjatuh',
              'Menyebut minimal 3-6 kata bermakna (mama, papa, mau)',
              'Bisa menumpuk 2-3 balok mainan',
              'Bisa menunjukkan bagian tubuh saat ditanya'
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-slate-800 font-medium">{item}</span>
                <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">✓ Tercapai</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Imunisasi' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Status Imunisasi Dasar & Lanjutan</h3>
            <span className="text-xs font-bold text-rose-600">3 dari 5 Imunisasi Lanjutan</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">DPT-HB-Hib Lanjutan (18 Bulan)</span>
                <span className="text-slate-500 text-[11px]">Diberikan di Posyandu Melati</span>
              </div>
              <span className="text-emerald-600 font-semibold text-[11px]">✓ Selesai</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-rose-900 block">Campak Rubella Lanjutan (18 Bulan)</span>
                <span className="text-rose-600 text-[11px]">Jadwal: 20 Oktober 2026</span>
              </div>
              <span className="text-rose-700 font-bold text-[11px] bg-rose-100 px-2 py-0.5 rounded">Akan Datang</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Pemeriksaan' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Riwayat Kunjungan Posyandu Anak</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900">Posyandu Balita - 18 September 2026</span>
                <span className="text-slate-400 text-[11px]">Puskesmas Manud Jaya</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                BB: 10.1 kg · TB: 79 cm · Vitamin A Merah telah diberikan · Perkembangan motorik baik
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
