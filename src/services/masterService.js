import { supabase, isSupabaseConfigured } from '../config/supabaseClient';

export const masterService = {
  /**
   * Mengambil semua master Dusun
   */
  async getDusunList() {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('dusun')
        .select('*')
        .eq('is_suspended', false)
        .order('nama', { ascending: true });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Gagal fetch master dusun:', e);
    }
    return [];
  },

  /**
   * Mengambil semua master Posyandu (termasuk relasi ke dusun)
   */
  async getPosyanduList() {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('posyandu')
        .select(`
          *,
          dusun:dusun_id (id, nama)
        `)
        .eq('is_suspended', false)
        .order('nama', { ascending: true });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Gagal fetch master posyandu:', e);
    }
    return [];
  },

  /**
   * Mengambil semua master Roles (peran pengguna)
   */
  async getRolesList() {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('kode', { ascending: true });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Gagal fetch master roles:', e);
    }
    return [];
  },

  /**
   * Mengambil semua master Tipe Peserta (ibu, anak)
   */
  async getTipePesertaList() {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('tipe_peserta')
        .select('*')
        .order('kode', { ascending: true });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Gagal fetch master tipe_peserta:', e);
    }
    return [];
  },

  /**
   * Mengambil semua master Kategori Pelayanan dan Jenis Pelayanan
   */
  async getJenisPelayananList() {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('jenis_pelayanan')
        .select(`
          *,
          kategori:kategori_id (id, kode, nama)
        `)
        .eq('is_suspended', false)
        .order('urutan', { ascending: true });
      if (!error && data) return data;
    } catch (e) {
      console.warn('Gagal fetch master jenis_pelayanan:', e);
    }
    return [];
  }
};
