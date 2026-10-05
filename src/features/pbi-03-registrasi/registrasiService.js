import { supabase, isSupabaseConfigured } from '../../config/supabaseClient';
import { dataStoreService } from '../../services/dataStoreService';
import { kunjunganService } from '../../services/kunjunganService';

export const registrasiService = {
  /**
   * Mengambil riwayat kunjungan peserta
   */
  async getRiwayatKunjungan(pesertaId) {
    const allRiwayat = dataStoreService.getRiwayatList();
    const filtered = allRiwayat.filter((r) => String(r.peserta_id) === String(pesertaId));
    if (filtered.length > 0) return filtered;

    return [
      { tanggal: '26 Sep 2026', jenis: 'Pemeriksaan Kehamilan', petugas: 'Kader Siti', status: 'Hadir' },
      { tanggal: '26 Agu 2026', jenis: 'Pemeriksaan Kehamilan', petugas: 'Kader Ani', status: 'Hadir' },
      { tanggal: '26 Jul 2026', jenis: 'Pemeriksaan Kehamilan', petugas: 'Kader Ani', status: 'Hadir' },
    ];
  },

  /**
   * Simpan pendaftaran kunjungan baru ke Supabase dan DataStore Lokal
   */
  async simpanRegistrasi(kunjunganData) {
    // 1. Simpan langsung ke database Supabase
    try {
      await kunjunganService.simpanKunjungan({
        peserta_id: kunjunganData.peserta_id,
        posyandu_id: kunjunganData.posyandu_id,
        posyandu: kunjunganData.posyandu,
        tanggal: kunjunganData.tanggalValue || kunjunganData.tanggal,
        jam: kunjunganData.jam,
        catatan: kunjunganData.catatan,
        jenis_pelayanan_ids: kunjunganData.jenis_pelayanan_ids || [],
        jenis_pelayanan: kunjunganData.jenis_pelayanan || [],
        dicatat_oleh: kunjunganData.petugas_id,
        status_kehadiran: kunjunganData.status_kehadiran || 'hadir'
      });
    } catch (err) {
      console.warn('Gagal simpan kunjungan ke Supabase:', err);
    }

    // 2. Simpan ke local DataStore sebagai reaktivitas UI instan
    const savedEntry = dataStoreService.addRiwayatKunjungan(kunjunganData);

    if (kunjunganData.peserta_id) {
      dataStoreService.updatePeserta(kunjunganData.peserta_id, {
        status_kehadiran: kunjunganData.status_kehadiran || 'Hadir',
        waktu_hadir: kunjunganData.jam || '08.30'
      });
    }

    return savedEntry;
  }
};
