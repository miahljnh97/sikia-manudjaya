import { useState, useMemo, useEffect } from 'react';
import { registrasiService } from './registrasiService';
import { pesertaService } from '../../services/pesertaService';
import { dataStoreService } from '../../services/dataStoreService';
import { getTanggalFormatStandar, getJamMenitSekarang, getTodayISODate } from '../../utils/dateUtils';

export function useRegistrasiController(currentUser, onSuccessRegistrasi, currentPath = '/registrasi-kunjungan', onNavigate) {
  // Mode: 'pencarian' | 'wizard'
  const [mode, setMode] = useState(() => {
    return currentPath.includes('/registrasi-kunjungan/') ? 'wizard' : 'pencarian';
  });

  const getStepFromPath = (path) => {
    if (path.includes('/data-kunjungan')) return 1;
    if (path.includes('/jenis-pelayanan')) return 2;
    if (path.includes('/status-kehadiran')) return 3;
    if (path.includes('/konfirmasi')) return 4;
    return 1;
  };

  const [currentStep, setCurrentStep] = useState(() => getStepFromPath(currentPath));
  const [rawPesertaList, setRawPesertaList] = useState([]);

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

  // Selected Peserta & Riwayat
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [riwayatList, setRiwayatList] = useState([]);

  // Fallback selectedPeserta jika user me-refresh di halaman wizard
  useEffect(() => {
    if (mode === 'wizard' && !selectedPeserta && rawPesertaList.length > 0) {
      setSelectedPeserta(rawPesertaList[0]);
    }
  }, [mode, selectedPeserta, rawPesertaList]);

  // Sinkronisasi mode & step saat URL browser berganti (misal browser back/forward atau klik menu sidebar)
  useEffect(() => {
    if (!currentPath.startsWith('/registrasi-kunjungan')) return;

    if (currentPath === '/registrasi-kunjungan' || currentPath === '/registrasi-kunjungan/') {
      setMode('pencarian');
    } else {
      setMode('wizard');
      const step = getStepFromPath(currentPath);
      setCurrentStep(step);
    }
  }, [currentPath]);

  // Form State Kunjungan (PBI 03B, 03C, 03D)
  const [kunjunganData, setKunjunganData] = useState({
    tanggalValue: getTodayISODate(),
    tanggal: getTanggalFormatStandar(),
    jam: getJamMenitSekarang(),
    posyandu: 'Posyandu Desa Manud Jaya',
    kaderPencatat: currentUser?.nama || 'Annisa Wati',
  });

  const [selectedPelayanan, setSelectedPelayanan] = useState([]);
  const [statusKehadiran, setStatusKehadiran] = useState('Hadir');
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Filter daftar peserta di pencarian
  const filteredPeserta = useMemo(() => {
    return rawPesertaList.filter((item) => {
      const matchSearch =
        (item.nama || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.nik || '').includes(searchQuery) ||
        (item.no_kk || '').includes(searchQuery);
      const matchJenis = jenisFilter === 'Semua' || item.jenis_peserta === jenisFilter;
      const matchStatus = statusFilter === 'Semua' || (item.status_kehadiran || 'Menunggu').toLowerCase().includes(statusFilter.toLowerCase());
      const matchWilayah = wilayahFilter === 'Semua' || item.dusun === wilayahFilter || item.alamat?.includes(wilayahFilter);
      return matchSearch && matchJenis && matchStatus && matchWilayah;
    });
  }, [rawPesertaList, searchQuery, jenisFilter, statusFilter, wilayahFilter]);

  const stepPaths = {
    1: '/registrasi-kunjungan/data-kunjungan',
    2: '/registrasi-kunjungan/jenis-pelayanan',
    3: '/registrasi-kunjungan/status-kehadiran',
    4: '/registrasi-kunjungan/konfirmasi',
  };

  const goToStep = (stepNum) => {
    setCurrentStep(stepNum);
    setMode('wizard');
    if (onNavigate && stepPaths[stepNum]) {
      onNavigate(stepPaths[stepNum]);
    }
  };

  const goToPencarian = () => {
    setMode('pencarian');
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
    goToStep(1);
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
