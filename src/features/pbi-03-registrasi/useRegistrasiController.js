import { useState, useMemo } from 'react';
import { registrasiService } from './registrasiService';
import { INITIAL_DUMMY_PESERTA } from '../../models/pesertaModel';

export function useRegistrasiController(currentUser, onSuccessRegistrasi) {
  // Mode: 'pencarian' | 'wizard'
  const [mode, setMode] = useState('pencarian');
  const [currentStep, setCurrentStep] = useState(1); // 1: Data Kunjungan, 2: Jenis Pelayanan, 3: Status Kehadiran, 4: Konfirmasi

  // Search & Filter State di Tahap Pencarian (PBI 03A)
  const [searchQuery, setSearchQuery] = useState('siti');
  const [jenisFilter, setJenisFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [wilayahFilter, setWilayahFilter] = useState('Semua');

  // Selected Peserta & Riwayat
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [riwayatList, setRiwayatList] = useState([]);

  // Form State Kunjungan (PBI 03B, 03C, 03D)
  const [kunjunganData, setKunjunganData] = useState({
    tanggal: '27 September 2026',
    jam: '08:30',
    posyandu: 'Posyandu Desa Manud Jaya',
    kaderPencatat: currentUser?.nama || 'Annisa Wati',
  });

  const [selectedPelayanan, setSelectedPelayanan] = useState([
    'Penimbangan',
    'Pengukuran Tinggi Badan',
    'Pemberian Vitamin'
  ]);

  const [statusKehadiran, setStatusKehadiran] = useState('Hadir');
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Filter daftar peserta di pencarian
  const filteredPeserta = useMemo(() => {
    return INITIAL_DUMMY_PESERTA.filter((item) => {
      const matchSearch =
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nik.includes(searchQuery);
      const matchJenis = jenisFilter === 'Semua' || item.jenis_peserta === jenisFilter;
      return matchSearch && matchJenis;
    });
  }, [searchQuery, jenisFilter]);

  // Aksi memilih peserta dari hasil pencarian
  const handleSelectPeserta = async (peserta) => {
    setSelectedPeserta(peserta);
    const riwayat = await registrasiService.getRiwayatKunjungan(peserta.id);
    setRiwayatList(riwayat);
    setMode('wizard');
    setCurrentStep(1);
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
        alert(suksesMsg);
        setMode('pencarian');
        setCurrentStep(1);
      }
    } catch (err) {
      alert('Gagal menyimpan registrasi: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    mode,
    setMode,
    currentStep,
    setCurrentStep,
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
