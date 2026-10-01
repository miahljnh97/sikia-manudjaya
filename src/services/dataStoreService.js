import { INITIAL_DUMMY_PESERTA } from '../models/pesertaModel';
import { DUMMY_DATA_PESERTA } from '../features/data-peserta/DataPesertaPage';
import { DUMMY_RIWAYAT_KUNJUNGAN } from '../features/riwayat-kunjungan/riwayatKunjunganModel';

const STORAGE_KEYS = {
  PESERTA: 'sikia_master_peserta',
  RIWAYAT: 'sikia_riwayat_kunjungan',
  KADER: 'sikia_master_kader',
  NOTIFIKASI: 'sikia_notifikasi_list'
};

// Helper Adaptor Fleksibel: Menangani berbagai format penamaan BE (is_active, IsActive, Is_Active, is_suspend, IsSuspend, Is_Suspend)
export const getIsActive = (item) => {
  if (!item) return true;
  if (item.is_active !== undefined) return Boolean(item.is_active);
  if (item.IsActive !== undefined) return Boolean(item.IsActive);
  if (item.Is_Active !== undefined) return Boolean(item.Is_Active);
  if (item.status !== undefined) return item.status === 'Aktif';
  return true;
};

export const getIsSuspend = (item) => {
  if (!item) return false;
  if (item.is_suspend !== undefined) return Boolean(item.is_suspend);
  if (item.IsSuspend !== undefined) return Boolean(item.IsSuspend);
  if (item.Is_Suspend !== undefined) return Boolean(item.Is_Suspend);
  if (item.status === 'Suspended') return true;
  return false;
};

const INITIAL_KADER_LIST = [
  {
    id: 1,
    nama: 'Annisa Wati',
    nik: '3275025409890001',
    peran: 'Kader Posyandu',
    dusun: 'Dusun 1',
    posyandu: 'Posyandu Mawar 1',
    telepon: '081234567890',
    email: 'kader.posyandu@manudjaya.id',
    is_active: true,
    IsActive: true,
    is_suspend: false,
    IsSuspend: false,
    status: 'Aktif',
    tanggal_bergabung: '15 Jan 2024'
  },
  {
    id: 2,
    nama: 'Siti Rahmawati',
    nik: '3275026210920002',
    peran: 'Kader Posyandu',
    dusun: 'Dusun 2',
    posyandu: 'Posyandu Melati 2',
    telepon: '081234567891',
    email: 'siti.rahma@manudjaya.id',
    is_active: true,
    IsActive: true,
    is_suspend: false,
    IsSuspend: false,
    status: 'Aktif',
    tanggal_bergabung: '01 Mar 2024'
  },
  {
    id: 3,
    nama: 'Nurul Hidayah',
    nik: '3275024803950003',
    peran: 'Kader Posyandu',
    dusun: 'Dusun 3',
    posyandu: 'Posyandu Anggrek 3',
    telepon: '081234567892',
    email: 'nurul.h@manudjaya.id',
    is_active: true,
    IsActive: true,
    is_suspend: false,
    IsSuspend: false,
    status: 'Aktif',
    tanggal_bergabung: '10 Mei 2024'
  },
  {
    id: 4,
    nama: 'Dewi Sartika',
    nik: '3275027108900004',
    peran: 'Kader Posyandu',
    dusun: 'Dusun 1',
    posyandu: 'Posyandu Mawar 1',
    telepon: '081234567893',
    email: 'dewi.sartika@manudjaya.id',
    is_active: false,
    IsActive: false,
    is_suspend: false,
    IsSuspend: false,
    status: 'Cuti',
    tanggal_bergabung: '20 Feb 2024'
  }
];

// Helper aman membaca LocalStorage
const loadFromStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`Gagal memuat key ${key} dari localStorage:`, err);
    return fallback;
  }
};

const saveToStorage = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Gagal menyimpan key ${key} ke localStorage:`, err);
  }
};

class DataStoreService {
  constructor() {
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error('Error notifying data store listener:', e);
      }
    });
  }

  // ================= PESERTA MASTER =================
  getPesertaList() {
    const list = loadFromStorage(STORAGE_KEYS.PESERTA, DUMMY_DATA_PESERTA);
    return list.filter((p) => !getIsSuspend(p));
  }

  getPesertaById(id) {
    const list = this.getPesertaList();
    return list.find((p) => String(p.id) === String(id)) || null;
  }

  updatePeserta(id, updatedFields) {
    const list = this.getPesertaList();
    const index = list.findIndex((p) => String(p.id) === String(id));
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      saveToStorage(STORAGE_KEYS.PESERTA, list);
      this.notify();
      return list[index];
    }
    return null;
  }

  addPeserta(newPeserta) {
    const list = this.getPesertaList();
    const entry = {
      id: Date.now(),
      status: 'Aktif',
      ...newPeserta
    };
    const updated = [entry, ...list];
    saveToStorage(STORAGE_KEYS.PESERTA, updated);
    this.notify();
    return entry;
  }

  // ================= RIWAYAT KUNJUNGAN =================
  getRiwayatList() {
    return loadFromStorage(STORAGE_KEYS.RIWAYAT, DUMMY_RIWAYAT_KUNJUNGAN);
  }

  addRiwayatKunjungan(kunjunganData) {
    const list = this.getRiwayatList();
    const nextId = Date.now();
    const countToday = list.length + 1;
    const antreanNum = `A-${String(countToday).padStart(2, '0')}`;
    const noReg = `KJ-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(countToday).padStart(4, '0')}`;

    const newEntry = {
      id: nextId,
      no_registrasi: noReg,
      no_antrean: antreanNum,
      nama: kunjunganData.nama_peserta || 'Peserta Posyandu',
      nik: kunjunganData.nik || '327502*******',
      nik_lengkap: kunjunganData.nik_lengkap || kunjunganData.nik || '3275021234560001',
      jenis_peserta: kunjunganData.jenis_peserta || 'Ibu Hamil',
      tanggal_kunjungan: kunjunganData.tanggal || 'Hari Ini',
      tanggal_kunjungan_lengkap: `${kunjunganData.tanggal} ${kunjunganData.jam || ''}`,
      waktu: `${kunjunganData.jam || '09:00'} WIB`,
      tempat: kunjunganData.posyandu || 'Posyandu Desa Manud Jaya',
      jenis_pelayanan: Array.isArray(kunjunganData.jenis_pelayanan) 
        ? kunjunganData.jenis_pelayanan.join(', ') 
        : (kunjunganData.jenis_pelayanan || 'Pemeriksaan Rutin'),
      hasil_catatan: kunjunganData.catatan || 'Registrasi kunjungan baru',
      status: 'Selesai',
      status_lengkap: 'Selesai Dilayani',
      status_kehadiran: kunjunganData.status_kehadiran || 'Hadir',
      status_peserta: 'Aktif',
      dusun: kunjunganData.dusun || 'Dusun 1',
      petugas: kunjunganData.kader_pencatat || 'Annisa Wati (Kader)',
      hasil_pemeriksaan: {
        berat_badan: kunjunganData.berat_badan || '60 kg',
        tinggi_badan: kunjunganData.tinggi_badan || '156 cm',
        tekanan_darah: '110/70 mmHg'
      },
      layanan_tambahan: {
        tablet_fe: 'Diberikan',
        konseling_gizi: 'Pola makan seimbang',
        edukasi: 'Edukasi kesehatan harian'
      },
      catatan_pemeriksaan: kunjunganData.catatan || 'Registrasi kunjungan harian berhasil dicatat di buku register digital.'
    };

    const updated = [newEntry, ...list];
    saveToStorage(STORAGE_KEYS.RIWAYAT, updated);
    this.notify();
    return newEntry;
  }

  // ================= KADER MANAGEMENT (SUPER ADMIN) =================
  getKaderList() {
    const list = loadFromStorage(STORAGE_KEYS.KADER, INITIAL_KADER_LIST);
    // Yang tersuspend (soft-deleted) tidak ditampilkan ke pengguna
    return list.filter((k) => !getIsSuspend(k));
  }

  addKader(newKader) {
    const list = loadFromStorage(STORAGE_KEYS.KADER, INITIAL_KADER_LIST);
    const entry = {
      id: Date.now(),
      status: 'Aktif',
      is_active: true,
      IsActive: true,
      Is_Active: true,
      is_suspend: false,
      IsSuspend: false,
      Is_Suspend: false,
      tanggal_bergabung: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      ...newKader
    };
    const updated = [entry, ...list];
    saveToStorage(STORAGE_KEYS.KADER, updated);
    this.notify();
    return entry;
  }

  toggleKaderActive(id) {
    const list = loadFromStorage(STORAGE_KEYS.KADER, INITIAL_KADER_LIST);
    const index = list.findIndex((k) => String(k.id) === String(id));
    if (index !== -1) {
      const currentActive = getIsActive(list[index]);
      const nextActive = !currentActive;
      
      list[index] = {
        ...list[index],
        is_active: nextActive,
        IsActive: nextActive,
        Is_Active: nextActive,
        status: nextActive ? 'Aktif' : 'Non-Aktif'
      };

      saveToStorage(STORAGE_KEYS.KADER, list);
      this.notify();
      return list[index];
    }
    return null;
  }

  suspendKader(id) {
    const list = loadFromStorage(STORAGE_KEYS.KADER, INITIAL_KADER_LIST);
    const index = list.findIndex((k) => String(k.id) === String(id));
    if (index !== -1) {
      list[index] = {
        ...list[index],
        is_suspend: true,
        IsSuspend: true,
        Is_Suspend: true,
        status: 'Suspended'
      };
      saveToStorage(STORAGE_KEYS.KADER, list);
      this.notify();
      return true;
    }
    return false;
  }

  // Soft delete peserta
  suspendPeserta(id) {
    const list = this.getPesertaList();
    const index = list.findIndex((p) => String(p.id) === String(id));
    if (index !== -1) {
      list[index] = {
        ...list[index],
        is_suspend: true,
        IsSuspend: true,
        Is_Suspend: true,
        status: 'Suspended'
      };
      saveToStorage(STORAGE_KEYS.PESERTA, list);
      this.notify();
      return true;
    }
    return false;
  }
}

export const dataStoreService = new DataStoreService();
