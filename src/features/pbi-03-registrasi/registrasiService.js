import { supabase, isSupabaseConfigured } from '../../config/supabaseClient';
import { INITIAL_DUMMY_PESERTA } from '../../models/pesertaModel';
import { dataStoreService } from '../../services/dataStoreService';

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
    // 1. Simpan ke DataStore Terpusat (Local State & LocalStorage)
    const savedEntry = dataStoreService.addRiwayatKunjungan(kunjunganData);

    // 2. Update status kehadiran di master data peserta jika ada id
    if (kunjunganData.peserta_id) {
      dataStoreService.updatePeserta(kunjunganData.peserta_id, {
        status_kehadiran: 'Sudah Hadir',
        waktu_hadir: kunjunganData.jam || '09.00'
      });
    }

    // 3. Sync ke Supabase jika terkonfigurasi
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('kunjungan')
          .insert([kunjunganData]);
      } catch (err) {
        console.warn('Supabase sync skipped/failed:', err);
      }
    }

    return savedEntry;
  }
};
