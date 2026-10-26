import { getPesertaIdFromUser } from '../../models/pesertaModel';
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Baby, 
  Building2, 
  ChevronRight, 
  Users
} from 'lucide-react';
import { bukuKiaService } from '../../services/bukuKiaService';
import { pesertaService } from '../../services/pesertaService';
import { maskNik } from '../../utils/nikUtils';
import { formatTanggalIndo } from '../../utils/dateUtils';

export default function PersalinanView({ user, currentPath = '', onNavigate, onShowToast }) {
  const isIbuRole = (user?.role || '').toLowerCase().includes('ibu') || (user?.email || '').toLowerCase().includes('ibu');

  const extractPesertaId = () => {
    if (typeof window !== 'undefined' && window.location.search) {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get('peserta_id')) return sp.get('peserta_id');
      if (sp.get('id')) return sp.get('id');
    }
    if (currentPath && currentPath.includes('?')) {
      const sp = new URLSearchParams(currentPath.split('?')[1]);
      if (sp.get('peserta_id')) return sp.get('peserta_id');
      if (sp.get('id')) return sp.get('id');
    }
    return isIbuRole ? (getPesertaIdFromUser(user) || '55af67c9-6695-4435-b4ea-2720efd73c92') : null;
  };

  const [daftarIbu, setDaftarIbu] = useState([]);
  const [activePesertaId, setActivePesertaId] = useState(() => extractPesertaId() || '55af67c9-6695-4435-b4ea-2720efd73c92');
  const [peserta, setPeserta] = useState(null);
  const [kehamilan, setKehamilan] = useState(null);
  const [p4k, setP4k] = useState(null);

  useEffect(() => {
    const urlId = extractPesertaId();
    if (urlId && urlId !== activePesertaId) {
      setActivePesertaId(urlId);
    }
  }, [currentPath]);

  useEffect(() => {
    bukuKiaService.getDaftarIbuHamil().then(list => {
      if (list && list.length > 0) {
        setDaftarIbu(list);
        if (!activePesertaId) setActivePesertaId(list[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!activePesertaId) return;
    pesertaService.getPesertaById(activePesertaId).then(p => {
      if (p) setPeserta(p);
    });
    bukuKiaService.getKehamilanIbu(activePesertaId).then(k => {
      if (k) {
        setKehamilan(k);
        bukuKiaService.getRencanaPersalinan(k.id).then(res => {
          if (res) setP4k(res);
        });
      }
    });
  }, [activePesertaId]);

  const handleSwitchPasien = (newId) => {
    setActivePesertaId(newId);
    if (onNavigate) {
      onNavigate(`/kesehatan-ibu/persalinan?peserta_id=${newId}`);
    }
  };

  const persiapanList = [
    { label: 'Kartu Identitas', status: p4k ? (p4k.checklist_identitas ? 'Sudah' : 'Belum') : 'Sudah' },
    { label: 'Buku KIA', status: p4k ? (p4k.checklist_buku_kia ? 'Sudah' : 'Belum') : 'Sudah' },
    { label: 'BPJS / Kartu Jaminan Kesehatan', status: p4k ? (p4k.checklist_bpjs ? 'Sudah' : 'Belum') : 'Sudah' },
    { label: 'Pakaian Ibu dan Bayi', status: p4k ? (p4k.checklist_pakaian ? 'Sudah' : 'Belum') : 'Belum' },
    { label: 'Perlengkapan Ibu', status: p4k ? (p4k.checklist_perlengkapan ? 'Sudah' : 'Belum') : 'Belum' },
    { label: 'Dana Darurat', status: p4k ? (p4k.checklist_dana_darurat ? 'Sudah' : 'Belum') : 'Belum' },
    { label: 'Kontak Darurat', status: p4k ? (p4k.checklist_kontak_darurat ? 'Sudah' : 'Belum') : 'Belum' },
  ];

  const namaPasien = peserta?.nama || 'Siti Aminah';
  const nikPasien = peserta?.nik ? maskNik(peserta.nik) : '293920102029029';
  const usiaMinggu = kehamilan?.usia_kehamilan_minggu || 28;
  const usiaHari = kehamilan?.usia_kehamilan_hari ? `${kehamilan.usia_kehamilan_hari} Hari` : '3 Hari';
  const usiaKehamilanStr = `${usiaMinggu} Minggu ${usiaHari}`;
  const hplDate = kehamilan?.hpl || '20 Desember 2026';
  const hphtDate = kehamilan?.hpht || '12 Februari 2026';
  const formatHplSingkat = (input) => {
    if (!input) return '20 Des 2026';
    if (typeof input === 'string') {
      const trimmed = input.trim();
      if (trimmed.includes('Desember')) return trimmed.replace('Desember', 'Des');
      const d = new Date(trimmed);
      if (!isNaN(d.getTime())) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      }
      return trimmed;
    }
    return '20 Des 2026';
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Halaman & Patient Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kesehatan Ibu / Persalinan
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Pantau riwayat pemeriksaan kehamilan dan kondisi ibu secara menyeluruh
          </p>
        </div>

        {/* Dropdown Selector Ibu Hamil untuk Bidan/Kader */}
        {!isIbuRole && daftarIbu.length > 0 && (
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3 py-2 shadow-xs">
            <Users size={16} className="text-pink-600 shrink-0" />
            <div className="text-[11px]">
              <span className="text-slate-400 block font-medium">Pilih Pasien Ibu Hamil:</span>
              <select
                value={activePesertaId}
                onChange={(e) => handleSwitchPasien(e.target.value)}
                className="font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer text-xs pr-2"
              >
                {daftarIbu.map((ibu) => (
                  <option key={ibu.id} value={ibu.id}>
                    {ibu.nama} (NIK: {maskNik(ibu.nik)})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 2. Top Card: Profil Pasien Terisolasi */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 flex-1">
          {/* Avatar Pasien */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-200 border-2 border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
            <img 
              src="/images/siti-aminah-avatar.png" 
              alt={namaPasien} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          {/* Info Pasien */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs flex-1">
            <div className="space-y-1.5">
              <h2 className="text-base font-bold text-slate-900">{namaPasien}</h2>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-28 text-slate-400">Nama</span>
                <span className="font-medium text-slate-800">{namaPasien}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-28 text-slate-400">NIK</span>
                <span className="font-medium text-slate-800 font-mono">{nikPasien}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-28 text-slate-400">No Rekam Medis</span>
                <span className="font-medium text-slate-800 font-mono">{peserta?.no_rekam_medis || peserta?.nik || '293920102029029'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-28 text-slate-400">Usia</span>
                <span className="font-medium text-slate-800">{peserta?.usia ? `${peserta.usia} Tahun` : '27 Tahun'}</span>
              </div>
            </div>

            <div className="space-y-1.5 sm:pt-6">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-32 text-slate-400">Usia Kehamilan</span>
                <span className="font-medium text-slate-800">{usiaKehamilanStr}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-32 text-slate-400">HPHT</span>
                <span className="font-medium text-slate-800">{formatTanggalIndo(hphtDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span className="w-32 text-slate-400">Taksiran Persalinan</span>
                <span className="font-medium text-slate-800">{formatTanggalIndo(hplDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Lihat Profil */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate(`/data-peserta/detail/${activePesertaId}`)}
            className="px-4 py-2 bg-[#F1E8FB] hover:bg-[#E7D6FA] text-[#7E22CE] rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Lihat Profil</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* 3. 4 Kartu Metrik Persalinan */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="text-[#E11D48] shrink-0">
            <Baby size={22} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Status Persalinan</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight block mt-0.5">Belum Melahirkan</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="text-[#E11D48] shrink-0">
            <Calendar size={22} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Taksiran Persalinan</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight block mt-0.5">{formatHplSingkat(hplDate)}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="text-[#E11D48] shrink-0">
            <Baby size={22} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Usia Kehamilan</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight block mt-0.5">{usiaKehamilanStr}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="text-[#E11D48] shrink-0">
            <Building2 size={22} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block">Rencana Tempat Persalinan</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight block mt-0.5">
              {p4k?.tempat_persalinan || 'Puskesmas Manud Jaya'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Baris Tengah: Rencana Persalinan & Persiapan Persalinan */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Rencana Persalinan */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4">Rencana Persalinan</h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Jenis Persalinan</span>
                <span className="font-semibold text-slate-800">{p4k?.jenis_persalinan || 'Persalinan normal'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Tempat Persalinan</span>
                <span className="font-semibold text-slate-800">{p4k?.tempat_persalinan || 'Puskesmas Manud Jaya'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Penolong Persalinan</span>
                <span className="font-semibold text-slate-800">{p4k?.penolong_persalinan || 'Bidan Siti Nurhayati'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Pendamping</span>
                <span className="font-semibold text-slate-800">{p4k?.pendamping || 'Suami'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Transportasi</span>
                <span className="font-semibold text-slate-800">{p4k?.transportasi || 'Mobil Pribadi'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Rujukan jika diperlukan</span>
                <span className="font-semibold text-slate-800">{p4k?.rujukan || 'RSUD Begawan'}</span>
              </div>
            </div>
          </div>

          {/* Persiapan Persalinan */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4">Persiapan Persalinan</h3>
            <div className="space-y-3.5 text-xs">
              {persiapanList.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">{item.label}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === 'Sudah'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Tanda Bahaya Menjelang Persalinan & Catatan dan Tindak Lanjut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Kolom Kiri: Tanda Bahaya Menjelang Persalinan */}
        <div className="space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Tanda Bahaya Menjelang Persalinan
          </h3>
          <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-xs h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-slate-700">
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>Kontraksi teratur dan semakin sering</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>Ketuban pecah</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>Pendarahan dari jalan lahir</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>Gerakan janin berkurang</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>Nyeri perut hebat tidak bisa hilang</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>Demam tinggi</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>Pusing hebat</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Catatan dan Tindak Lanjut */}
        <div className="space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Catatan dan Tindak Lanjut
          </h3>
          <div className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-xs h-full">
            <ul className="space-y-3 text-xs font-semibold text-[#3B41B2]">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B41B2] mt-1.5 shrink-0" />
                <span className="leading-relaxed">Lanjutkan kontrol sesuai jadwal</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B41B2] mt-1.5 shrink-0" />
                <span className="leading-relaxed">Pastikan semua persiapan persalinan sudah lengkap</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B41B2] mt-1.5 shrink-0" />
                <span className="leading-relaxed">Segera ke puskesmas jika ada tanda bahaya</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B41B2] mt-1.5 shrink-0" />
                <span className="leading-relaxed">Jaga kondisi kesehatan ibu dan janin</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
