import React from 'react';
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, Heart, ShieldAlert } from 'lucide-react';

export default function DetailPeserta({ peserta, onBack }) {
  if (!peserta) return null;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header & Back Button */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5 mb-2 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Daftar Peserta</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Data Peserta</h1>
          <p className="text-xs text-slate-500 mt-0.5">Detail Data Peserta Posyandu</p>
        </div>
      </div>

      {/* Card Utama: Detail Pasien */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Detail Pasien
        </h3>

        <div className="space-y-4 text-xs">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1.5">Nama Lengkap Pasien</label>
            <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
              {peserta.nama || 'Siti Aminah'}
            </div>
          </div>

          {/* NIK */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1.5">NIK</label>
            <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
              {peserta.nik || '327502152664875'}
            </div>
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1.5">Tanggal Lahir</label>
            <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
              {peserta.tanggal_lahir || '19/11/1997'}
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1.5">Alamat</label>
            <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
              {peserta.alamat || 'Dusun 1'}
            </div>
          </div>

          {/* Nomor Telepon */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1.5">Nomor Telepon</label>
            <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
              {peserta.telepon || '081292836382'}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1.5">Email</label>
            <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
              {peserta.email || 'siti.aminah@example.com'}
            </div>
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1.5">Jenis Kelamin</label>
            <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
              {peserta.jenis_kelamin || 'Perempuan'}
            </div>
          </div>

          {/* Jenis Peserta */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1.5">Jenis Peserta</label>
            <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
              {peserta.jenis_peserta || 'Ibu Hamil'}
            </div>
          </div>

          {/* Nomor Telepon Penanggung Jawab */}
          <div>
            <label className="block text-slate-500 font-semibold mb-1.5">Nomor Telepon Penanggung Jawab</label>
            <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl font-medium text-slate-800">
              {peserta.telepon_pj || '081291281928'}
            </div>
          </div>
        </div>
      </div>

      {/* Card Catatan Tambahan / Observasi */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Catatan Tambahan / Observasi
        </h3>
        <div className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800">
          {peserta.catatan_observasi || 'Pasien perlu rujukan'}
        </div>
      </div>
    </div>
  );
}
