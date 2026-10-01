import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { INITIAL_DUMMY_PESERTA } from '../models/pesertaModel';
import { dataStoreService } from './dataStoreService';

export const pesertaService = {
  /**
   * Mengambil semua daftar peserta
   */
  async getDaftarPeserta() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('peserta')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    }
    // Fallback: Mengembalikan data dari Central Store (LocalStorage + State)
    return dataStoreService.getPesertaList();
  },

  /**
   * Update status kehadiran peserta
   */
  async updateStatusKehadiran(id, statusKehadiran) {
    const waktuSekarang = statusKehadiran === 'Sudah Hadir' 
      ? new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
      : null;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('peserta')
        .update({
          status_kehadiran: statusKehadiran,
          waktu_hadir: waktuSekarang
        })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) return data;
    }

    return { id, status_kehadiran: statusKehadiran, waktu_hadir: waktuSekarang };
  },

  /**
   * Tambah peserta baru (Registrasi Kunjungan)
   */
  async tambahPeserta(pesertaData) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('peserta')
        .insert([pesertaData])
        .select()
        .single();

      if (!error && data) return data;
    }

    return {
      id: Date.now(),
      ...pesertaData,
      status_kehadiran: 'Belum Hadir',
      waktu_hadir: null
    };
  }
};
