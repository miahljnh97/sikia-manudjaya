import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { INITIAL_DUMMY_PESERTA } from '../models/pesertaModel';
import { dataStoreService } from './dataStoreService';
import { normalizePeserta } from '../utils/pesertaAdapter';

export const pesertaService = {
  /**
   * Mengambil semua daftar peserta beserta relasi dusun dan tipe_peserta
   */
  async getDaftarPeserta() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('peserta')
          .select(`
            *,
            dusun:dusun_id (id, nama, kode),
            tipe_peserta:tipe_id (id, kode, nama)
          `)
          .order('id', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map(normalizePeserta);
        }
      } catch (err) {
        console.warn('Gagal fetch data peserta dari Supabase:', err);
      }
    }
    // Fallback: Mengembalikan data dari Central Store (LocalStorage + State)
    return dataStoreService.getPesertaList().map(normalizePeserta);
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
   * Update data profil peserta
   */
  async updatePeserta(id, updatedFields) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('peserta')
          .update(updatedFields)
          .eq('id', id)
          .select(`
            *,
            dusun:dusun_id (id, nama, kode),
            tipe_peserta:tipe_id (id, kode, nama)
          `)
          .single();

        if (!error && data) return normalizePeserta(data);
      } catch (err) {
        console.warn('Gagal update data peserta di Supabase:', err);
      }
    }

    return dataStoreService.updatePeserta(id, updatedFields);
  },

  /**
   * Tambah peserta baru (Registrasi Kunjungan)
   */
  async tambahPeserta(pesertaData) {
    if (isSupabaseConfigured && supabase) {
      try {
        // Mapping payload untuk Supabase sesuai foreign keys
        const payload = {
          nama: pesertaData.nama,
          nik: pesertaData.nik,
          no_kk: pesertaData.no_kk || null,
          alamat: pesertaData.alamat || null,
          dusun_id: pesertaData.dusun_id || null,
          tipe_id: pesertaData.tipe_id || null,
          status_ibu: pesertaData.status_ibu || null,
          tgl_lahir: pesertaData.tgl_lahir || null,
          no_wa: pesertaData.telepon || pesertaData.no_wa || null,
          jenis_kelamin: pesertaData.jenis_kelamin || null,
          nama_suami: pesertaData.nama_suami || null,
          aktif: true,
          is_suspended: false,
        };

        // Buang key yang bernilai undefined
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        const { data, error } = await supabase
          .from('peserta')
          .insert([payload])
          .select(`
            *,
            dusun:dusun_id (id, nama, kode),
            tipe_peserta:tipe_id (id, kode, nama)
          `)
          .single();

        if (!error && data) {
          const normalized = normalizePeserta(data);
          dataStoreService.addPeserta(normalized);
          return normalized;
        } else if (error) {
          console.error('Error insert peserta ke Supabase:', error);
        }
      } catch (err) {
        console.warn('Exception tambahPeserta Supabase:', err);
      }
    }

    const fallback = {
      id: Date.now(),
      ...pesertaData,
      status_kehadiran: 'Belum Hadir',
      waktu_hadir: null
    };
    dataStoreService.addPeserta(fallback);
    return fallback;
  }
};
