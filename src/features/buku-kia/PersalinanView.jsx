import { getPesertaIdFromUser } from '../../models/pesertaModel';
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Baby, 
  Building2, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  FileText,
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
    { label: 'Kartu Identitas (KTP / KK)', status: p4k ? (p4k.checklist_identitas ? 'Sudah' : 'Belum') : 'Sudah' },
    { label: 'Buku KIA', status: p4k ? (p4k.checklist_buku_kia ? 'Sudah' : 'Belum') : 'Sudah' },
    { label: 'BPJS / Kartu Jaminan Kesehatan', status: p4k ? (p4k.checklist_bpjs ? 'Sudah' : 'Belum') : 'Sudah' },
    { label: 'Pakaian Ibu dan Bayi', status: p4k ? (p4k.checklist_pakaian ? 'Sudah' : 'Belum') : 'Belum' },
    { label: 'Perlengkapan Ibu Menyusui', status: p4k ? (p4k.checklist_perlengkapan ? 'Sudah' : 'Belum') : 'Belum' },
    { label: 'Dana Cadangan Persalinan', status: p4k ? (p4k.checklist_dana_darurat ? 'Sudah' : 'Belum') : 'Belum' },
    { label: 'Kontak Donor Darah & Kendaraan Siaga', status: p4k ? (p4k.checklist_kontak_darurat ? 'Sudah' : 'Belum') : 'Belum' },
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
                <span className="w-28 text-slate-400">No WA</span>
                <span className="font-medium text-slate-800">{peserta?.no_wa || '081234567890'}</span>
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

      {/* 4. Baris Tengah: Rencana Persalinan P4K & Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Rencana Persalinan P4K */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Rencana Persalinan (P4K)</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
              Tercatat
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Penolong Persalinan:</span>
              <span className="font-bold text-slate-800">{p4k?.penolong_persalinan || 'Bidan Siti, S.Tr.Keb'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Tempat Persalinan:</span>
              <span className="font-bold text-slate-800">{p4k?.tempat_persalinan || 'Puskesmas Manud Jaya'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Pendamping Persalinan:</span>
              <span className="font-bold text-slate-800">{p4k?.pendamping || p4k?.pendamping_persalinan || 'Suami'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Transportasi Siaga:</span>
              <span className="font-bold text-slate-800">{p4k?.transportasi || 'Mobil Pribadi'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
              <span className="text-slate-500 font-medium">Calon Pendonor Darah:</span>
              <span className="font-bold text-slate-800">{p4k?.calon_donor_darah || 'Budi Santoso (Gol. O)'}</span>
            </div>
          </div>
        </div>

        {/* Persiapan Perlengkapan & Dokumen */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Checklist Persiapan Persalinan</h3>
            <span className="text-[11px] font-bold text-emerald-600">{persiapanList.filter(p => p.status === 'Sudah').length} dari {persiapanList.length} Siap</span>
          </div>

          <div className="space-y-2 text-xs">
            {persiapanList.map((item, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={15} className={item.status === 'Sudah' ? 'text-emerald-500' : 'text-slate-300'} />
                  <span className="font-medium text-slate-800">{item.label}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  item.status === 'Sudah' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
