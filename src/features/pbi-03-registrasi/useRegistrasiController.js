import { useState, useMemo, useEffect } from 'react';
import { registrasiService } from './registrasiService';
import { pesertaService } from '../../services/pesertaService';
import { dataStoreService } from '../../services/dataStoreService';
import { getTanggalFormatStandar, getJamMenitSekarang, getTodayISODate } from '../../utils/dateUtils';

// Helper untuk parsing path registrasi kunjungan (misal /registrasi-kunjungan/:uuid/data-kunjungan)
export const parseRegistrasiPath = (path = '') => {
  let step = 1;
  let pesertaId = null;

  if (path.includes('/data-kunjungan')) step = 1;
  else if (path.includes('/jenis-pelayanan')) step = 2;
  else if (path.includes('/status-kehadiran')) step = 3;
  else if (path.includes('/konfirmasi')) step = 4;

  if (path.includes('?')) {
    const sp = new URLSearchParams(path.split('?')[1]);
    if (sp.get('id')) pesertaId = sp.get('id');
    if (sp.get('peserta_id')) pesertaId = sp.get('peserta_id');
  }

  const clean = path.split('?')[0];
  const segments = clean.split('/').filter(Boolean);
  const stepKeywords = ['registrasi-kunjungan', 'data-kunjungan', 'jenis-pelayanan', 'status-kehadiran', 'konfirmasi'];
  for (const seg of segments) {
    if (!stepKeywords.includes(seg)) {
      pesertaId = seg;
      break;
    }
  }

  const isWizard = (clean.startsWith('/registrasi-kunjungan/') && clean !== '/registrasi-kunjungan/') || !!pesertaId;
  return { isWizard, step, pesertaId };
};

export function useRegistrasiController(currentUser, onSuccessRegistrasi, currentPath = '/registrasi-kunjungan', onNavigate) {
  const initialParsed = parseRegistrasiPath(currentPath);

  // Mode: 'pencarian' | 'wizard'
  const [mode, setMode] = useState(() => initialParsed.isWizard ? 'wizard' : 'pencarian');
  const [currentStep, setCurrentStep] = useState(() => initialParsed.step);
  const [rawPesertaList, setRawPesertaList] = useState([]);

  // Selected Peserta & Riwayat
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [riwayatList, setRiwayatList] = useState([]);

  // Load peserta dari pesertaService (Supabase / local fallback)
  useEffect(() => {
    let isMounted = true;
    const fetchPeserta = async () => {
      const data = await pesertaService.getDaftarPeserta();
      if (isMounted && data) {
        setRawPesertaList(data);
      }
    };
    fetchPeserta();

    const unsubscribe = dataStoreService.subscribe(() => {
      fetchPeserta();
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Search & Filter State di Tahap Pencarian (PBI 03A)
  const [searchQuery, setSearchQuery] = useState('');
  const [jenisFilter, setJenisFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [wilayahFilter, setWilayahFilter] = useState('Semua');

  // Sinkronisasi mode, step, dan peserta saat URL browser berganti atau pesertaList terisi
  useEffect(() => {
    if (!currentPath.startsWith('/registrasi-kunjungan')) return;

    const parsed = parseRegistrasiPath(currentPath);
    if (!parsed.isWizard) {
      setMode('pencarian');
      setSelectedPeserta(null);
      setRiwayatList([]);
    } else {
      setMode('wizard');
      setCurrentStep(parsed.step);

      if (parsed.pesertaId && rawPesertaList.length > 0) {
        const found = rawPesertaList.find(
          (p) => String(p.id) === String(parsed.pesertaId) || String(p.nik) === String(parsed.pesertaId)
        );
        if (found && (!selectedPeserta || selectedPeserta.id !== found.id)) {
          setSelectedPeserta(found);
          if (found.status_kehadiran) {
            setStatusKehadiran(found.status_kehadiran);
          }
          registrasiService.getRiwayatKunjungan(found.id).then((res) => {
            if (res) setRiwayatList(res);
          });
        }
      } else if (!parsed.pesertaId && !selectedPeserta && rawPesertaList.length > 0) {
        setSelectedPeserta(rawPesertaList[0]);
      }
    }
  }, [currentPath, rawPesertaList, selectedPeserta]);

  // Helper membuat path dengan ID peserta
  const getStepPath = (stepNum, targetId) => {
    const stepNames = {
      1: 'data-kunjungan',
      2: 'jenis-pelayanan',
      3: 'status-kehadiran',
      4: 'konfirmasi',
    };
    const stepName = stepNames[stepNum] || 'data-kunjungan';
    const id = targetId || selectedPeserta?.id || initialParsed.pesertaId;
    return id ? `/registrasi-kunjungan/${id}/${stepName}` : `/registrasi-kunjungan/${stepName}`;
  };

  const goToStep = (stepNum, targetId) => {
    setCurrentStep(stepNum);
    setMode('wizard');
    const path = getStepPath(stepNum, targetId);
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const goToPencarian = () => {
    setMode('pencarian');
    setSelectedPeserta(null);
    setRiwayatList([]);
    if (onNavigate) {
      onNavigate('/registrasi-kunjungan');
    }
  };

  // Aksi memilih peserta dari hasil pencarian
  const handleSelectPeserta = async (peserta) => {
    setSelectedPeserta(peserta);
    if (peserta.status_kehadiran) {
      setStatusKehadiran(peserta.status_kehadiran);
    }
    const riwayat = await registrasiService.getRiwayatKunjungan(peserta.id);
    setRiwayatList(riwayat);
    goToStep(1, peserta.id);
  };

  const handleResetFilter = () => {
    setSearchQuery('');
    setJenisFilter('Semua');
    setStatusFilter('Semua');
    setWilayahFilter('Semua');
  };

  const handleChangeKunjungan = (key, val) => {
    setKunjunganData((prev) => ({ ...prev, [key]: val }));
  };

  const handleTogglePelayanan = (layananId) => {
    setSelectedPelayanan((prev) =>
      prev.includes(layananId)
        ? prev.filter((id) => id !== layananId)
        : [...prev, layananId]
    );
  };

  const handleSubmitRegistrasi = async () => {
    setSubmitting(true);
    try {
      await registrasiService.simpanRegistrasi({
        peserta_id: selectedPeserta?.id,
        nama_peserta: selectedPeserta?.nama,
        tanggal: kunjunganData.tanggal,
        tanggalValue: kunjunganData.tanggalValue || getTodayISODate(),
        jam: kunjunganData.jam,
        posyandu: kunjunganData.posyandu,
        kader_pencatat: kunjunganData.kaderPencatat,
        jenis_pelayanan: selectedPelayanan,
        status_kehadiran: statusKehadiran,
        catatan: catatan
      });

      const suksesMsg = `Registrasi Kunjungan untuk "${selectedPeserta?.nama}" Berhasil Disimpan!`;
      if (onSuccessRegistrasi) {
        onSuccessRegistrasi(suksesMsg);
      } else {
        goToPencarian();
      }
    } catch (err) {
      if (onSuccessRegistrasi) {
        onSuccessRegistrasi('Gagal menyimpan registrasi: ' + err.message, 'error');
      } else {
        console.error('Gagal menyimpan registrasi:', err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    mode,
    setMode,
    currentStep,
    setCurrentStep,
    goToStep,
    goToPencarian,
    searchQuery,
    setSearchQuery,
    jenisFilter,
    setJenisFilter,
    statusFilter,
    setStatusFilter,
    wilayahFilter,
    setWilayahFilter,
    handleResetFilter,
    pesertaList: filteredPeserta,
    selectedPeserta,
    riwayatList,
    handleSelectPeserta,
    kunjunganData,
    handleChangeKunjungan,
    selectedPelayanan,
    handleTogglePelayanan,
    statusKehadiran,
    setStatusKehadiran,
    catatan,
    setCatatan,
    submitting,
    handleSubmitRegistrasi
  };
}
