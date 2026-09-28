import React from 'react';
import { User, Edit2, Calendar, Clock, MapPin, CheckCircle2, Check } from 'lucide-react';

export default function Step4Konfirmasi({
  peserta,
  kunjunganData,
  selectedPelayanan,
  statusKehadiran,
  catatan,
  onGoToStep,
  onBack,
  onSubmit,
  loading
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Konfirmasi Data Registrasi Kunjungan</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Pastikan semua informasi sudah sesuai. Anda masih dapat kembali untuk mengubah data.
        </p>
      </div>

      {/* 1. Ringkasan Data Peserta */}
      <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-800">Data Peserta</h4>
          <button
            onClick={() => onGoToStep(1)}
            className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            <Edit2 size={12} /> Ubah
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <User size={22} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-6 flex-1 text-xs">
            <div>
              <div className="font-bold text-slate-900 text-sm">{peserta?.nama || 'Siti Aminah'}</div>
              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                {peserta?.jenis_peserta || 'Ibu Hamil'}
              </span>
            </div>
            <div className="text-slate-500 space-y-0.5">
              <div>NIK: <strong className="text-slate-700">{peserta?.nik || '3273••••••••0041'}</strong></div>
              <div>Tanggal Lahir: <strong className="text-slate-700">12 Mei 1994 (32 tahun)</strong></div>
              <div>Alamat: <strong className="text-slate-700">Dusun 3, Desa Manud Jaya</strong></div>
            </div>
            <div className="text-slate-500 space-y-0.5">
              <div>No. KK: <strong className="text-slate-700">3273••••••••1099</strong></div>
              <div>No. HP: <strong className="text-slate-700">0812-3456-7890</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Ringkasan Kunjungan & Status Kehadiran Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Informasi Kunjungan */}
        <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-800">Informasi Kunjungan</h4>
            <button
              onClick={() => onGoToStep(1)}
              className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <Edit2 size={12} /> Ubah
            </button>
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-slate-400" />
              <span>Tanggal: <strong>{kunjunganData.tanggal}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-slate-400" />
              <span>Jam Kunjungan: <strong>{kunjunganData.jam} WIB</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-slate-400" />
              <span>Posyandu: <strong>{kunjunganData.posyandu}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <User size={14} className="text-slate-400" />
              <span>Kader Pencatat: <strong>{kunjunganData.kaderPencatat}</strong></span>
            </div>
          </div>
        </div>

        {/* Status Kehadiran */}
        <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-800">Status Kehadiran</h4>
            <button
              onClick={() => onGoToStep(3)}
              className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <Edit2 size={12} /> Ubah
            </button>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check size={16} strokeWidth={3} />
            </div>
            <div>
              <div className="font-bold text-xs text-emerald-900">{statusKehadiran}</div>
              <p className="text-[11px] text-emerald-700">Peserta datang ke Posyandu dan mendapatkan pelayanan.</p>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-500">
            Catatan: <span className="text-slate-700">{catatan || '-'}</span>
          </div>
        </div>
      </div>

      {/* 3. Ringkasan Jenis Pelayanan Terpilih */}
      <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-800">Jenis Pelayanan yang Dipilih</h4>
          <button
            onClick={() => onGoToStep(2)}
            className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            <Edit2 size={12} /> Ubah
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {selectedPelayanan.map((layanan, i) => (
            <div key={i} className="p-3 rounded-xl bg-white border border-slate-200/70 text-xs">
              <div className="font-bold text-slate-800">{layanan}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Telah dipilih untuk dicatat</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Button */}
      <div className="pt-4 flex items-center justify-between border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl"
        >
          ← Kembali ke Status Kehadiran
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={onSubmit}
          className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-md inline-flex items-center gap-2"
        >
          {loading ? 'Menyimpan...' : (
            <>
              <Check size={15} strokeWidth={3} />
              <span>Simpan Registrasi Kunjungan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
