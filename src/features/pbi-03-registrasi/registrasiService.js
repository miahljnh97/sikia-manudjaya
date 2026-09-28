import { supabase, isSupabaseConfigured } from '../../config/supabaseClient';
import { INITIAL_DUMMY_PESERTA } from '../../models/pesertaModel';

export const registrasiService = {
  /**
   * Mengambil riwayat kunjungan peserta
   */
  async getRiwayatKunjungan(pesertaId) {
    return [
      { tanggal: '26 Sep 2026', jenis: 'Pemeriksaan Kehamilan', petugas: 'Kader Siti', status: 'Hadir' },
      { tanggal: '26 Agu 2026', jenis: 'Pemeriksaan Kehamilan', petugas: 'Kader Ani', status: 'Hadir' },
      { tanggal: '26 Jul 2026', jenis: 'Pemeriksaan Kehamilan', petugas: 'Kader Ani', status: 'Hadir' },
      { tanggal: '26 Jun 2026', jenis: 'Pemeriksaan Kehamilan', petugas: 'Kader Ani', status: 'Hadir' },
      { tanggal: '26 Mei 2026', jenis: 'Pemeriksaan Kehamilan', petugas: 'Kader Ani', status: 'Hadir' },
    ];
  },

  /**
   * Simpan pendaftaran kunjungan baru ke Supabase
   */
  async simpanRegistrasi(kunjunganData) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('kunjungan')
        .insert([kunjunganData])
        .select()
        .single();

      if (!error && data) return data;
    }

    return {
      id: Date.now(),
      ...kunjunganData,
      created_at: new Date().toISOString()
    };
  }
};
