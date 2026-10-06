import React, { useState, useEffect } from 'react';
import { User, Edit2, Calendar, Clock, Check, ChevronDown, Accessibility } from 'lucide-react';
import { masterService } from '../../../services/masterService';
import { getTodayISODate } from '../../../utils/dateUtils';

export default function Step1DataKunjungan({
  peserta,
  kunjunganData,
  onChangeData,
  onUbahPeserta,
  onNext,
  onBatal
}) {
  const [posyanduList, setPosyanduList] = useState([]);

  useEffect(() => {
    let isMounted = true;
    masterService.getPosyanduList().then((list) => {
      if (isMounted && list && list.length > 0) {
        setPosyanduList(list);
        if (!kunjunganData.posyandu_id) {
          onChangeData('posyandu_id', list[0].id);
          onChangeData('posyandu', list[0].nama);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const isIbuHamil = (peserta?.jenis_peserta || 'Ibu Hamil') === 'Ibu Hamil';
  const isBalita = peserta?.jenis_peserta === 'Balita';
  const isBayi = peserta?.jenis_peserta === 'Bayi';
  const isLansia = peserta?.jenis_peserta === 'Lansia';

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* 1. Header Identitas Peserta Terpilih */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">Data Peserta</h3>
        <button
          type="button"
          onClick={onUbahPeserta}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
        >
          <Edit2 size={13} />
          <span>Ubah Peserta</span>
        </button>
      </div>

      {/* Identitas Card Box Sesuai Figma / Mockup Gambar 2 */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFC] border border-slate-100 grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
        {/* Sisi Kiri: Avatar + Info Utama (Nama, NIK, Tanggal Lahir, Alamat) */}
        <div className="xl:col-span-7 flex items-center gap-4.5 min-w-0">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
            isIbuHamil 
              ? 'bg-[#FFF1F2] text-[#E11D48]' 
              : isBalita 
              ? 'bg-[#DCFCE7] text-[#166534]' 
              : isBayi 
              ? 'bg-[#DBEAFE] text-[#1D4ED8]' 
              : isLansia 
              ? 'bg-purple-100 text-purple-700' 
              : 'bg-[#DCFCE7] text-[#166534]'
          }`}>
            <Accessibility size={28} />
          </div>

          <div className="space-y-2 flex-1 min-w-0">
            {/* Nama & Badge */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <h4 className="text-base font-bold text-slate-900 tracking-tight">
                {peserta?.nama || '-'}
              </h4>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                isIbuHamil 
                  ? 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECDD3]' 
                  : isBalita
                  ? 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]'
                  : isBayi 
                  ? 'bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE]' 
                  : isLansia 
                  ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                  : 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]'
              }`}>
                {peserta?.jenis_peserta || '-'}
              </span>
            </div>

            {/* 3 Kolom: NIK, Tanggal Lahir, Alamat */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-5 text-xs">
              <div className="min-w-0">
                <span className="text-slate-400 block font-normal">NIK</span>
                <span className="font-bold text-slate-900 mt-0.5 block truncate" title={peserta?.nik || '-'}>
                  {peserta?.nik || '-'}
                </span>
              </div>
              <div className="min-w-0">
                <span className="text-slate-400 block font-normal">Tanggal Lahir</span>
                <span className="font-bold text-slate-900 mt-0.5 block whitespace-nowrap">
                  {peserta?.tanggal_lahir ? `${peserta.tanggal_lahir}${peserta?.usia && peserta?.usia !== '-' ? ` (${peserta.usia})` : ''}` : '-'}
                </span>
              </div>
              <div className="min-w-0">
                <span className="text-slate-400 block font-normal">Alamat</span>
                <span className="font-bold text-slate-900 mt-0.5 block truncate" title={peserta?.alamat || '-'}>
                  {peserta?.alamat || '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider & Sisi Kanan: Nama Suami, No. KK, No. HP */}
        <div className="xl:col-span-5 border-t xl:border-t-0 xl:border-l border-slate-200/80 pt-4 xl:pt-0 xl:pl-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
            <div>
              <span className="text-slate-400 block font-normal">Nama Suami</span>
              <span className="font-bold text-slate-900 mt-0.5 block truncate">
                {peserta?.nama_suami || '-'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-normal">No. KK</span>
              <span className="font-bold text-slate-900 mt-0.5 block truncate">
                {peserta?.no_kk || '-'}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block font-normal">No. HP</span>
              <span className="font-bold text-slate-900 mt-0.5 block">
                {peserta?.telepon && peserta.telepon !== '-' ? peserta.telepon : (peserta?.no_wa || '-')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Informasi Kunjungan Form Sesuai Gambar 1 */}
      <div>
        <h4 className="text-sm font-bold text-slate-900">Informasi Kunjungan</h4>
        <p className="text-xs text-slate-400 mt-0.5">Tanggal kunjungan dan petugas yang mencatat.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Tanggal Kunjungan Sesuai Gambar 1 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tanggal Kunjungan <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-800 flex items-center justify-between">
                <span>{kunjunganData.tanggal || '27 September 2026'}</span>
                <Calendar size={15} className="text-slate-400 shrink-0" />
              </div>
              <input
                type="date"
                value={kunjunganData.tanggalValue || getTodayISODate()}
                onChange={(e) => {
                  const val = e.target.value;
                  onChangeData('tanggalValue', val);
                  if (val) {
                    const [y, m, d] = val.split('-');
                    const bulanIndo = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                    const dateFormatted = `${parseInt(d, 10)} ${bulanIndo[parseInt(m, 10) - 1]} ${y}`;
                    onChangeData('tanggal', dateFormatted);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Jam Kedatangan Sesuai Gambar 1 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jam Kedatangan <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-800 flex items-center justify-between">
                <span>{kunjunganData.jam || '08:30'}</span>
                <Clock size={15} className="text-slate-400 shrink-0" />
              </div>
              <input
                type="time"
                value={kunjunganData.jam || '08:30'}
                onChange={(e) => onChangeData('jam', e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Posyandu resmi dari Database */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Posyandu <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={kunjunganData.posyandu_id || kunjunganData.posyandu || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const selectedObj = posyanduList.find(p => p.id === val || p.nama === val);
                  onChangeData('posyandu_id', selectedObj ? selectedObj.id : val);
                  onChangeData('posyandu', selectedObj ? selectedObj.nama : val);
                }}
                className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-white border border-slate-200 rounded-xl font-medium text-slate-800 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {posyanduList.length > 0 ? (
                  posyanduList.map((p) => (
                    <option key={p.id} value={p.id}>{p.nama}</option>
                  ))
                ) : (
                  <option value="Posyandu Desa Manud Jaya">Posyandu Desa Manud Jaya</option>
                )}
              </select>
              <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Kader Pencatat */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kader Pencatat
            </label>
            <input
              type="text"
              readOnly
              value={kunjunganData.kaderPencatat || 'Annisa Wati'}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Success alert pill */}
      <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl flex items-center gap-2.5 text-xs text-[#065F46]">
        <div className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
          <Check size={12} strokeWidth={3} />
        </div>
        <span className="font-medium">Data peserta ditemukan. Silakan lanjutkan ke tahap berikutnya untuk memilih jenis pelayanan.</span>
      </div>

      {/* Bottom Action Buttons */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
        <button
          type="button"
          onClick={onBatal}
          className="px-5 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer"
        >
          Batal
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>Lanjut ke Jenis Pelayanan</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
