/**
 * Service Layer untuk Buku KIA Digital (Sprint 2 & 3)
 * Menghubungkan modul Kesehatan Ibu, Kesehatan Anak, dan Jadwal ke Supabase
 */
import { supabase, isSupabaseConfigured } from '../config/supabaseClient';

export const bukuKiaService = {
  // ==========================================
  // KESEHATAN IBU
  // ==========================================
  
  /**
   * Mengambil data kehamilan ibu aktif
   */
  async getKehamilanIbu(pesertaId = '55af67c9-6695-4435-b4ea-2720efd73c92') {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('kehamilan_ibu')
          .select('*')
          .eq('peserta_id', pesertaId)
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Gagal fetch kehamilan_ibu dari Supabase:', e);
      }
    }
    // Fallback Mock
    return {
      id: 'c3333333-3333-3333-3333-333333333333',
      peserta_id: pesertaId,
      hpht: '2026-02-12',
      hpl: '2026-12-20',
      usia_kehamilan_minggu: 28,
      trimester: 3,
      jumlah_tablet_fe_diminum: 70,
      target_tablet_fe: 80,
      status_kehamilan: 'Aktif'
    };
  },

  /**
   * Mengambil riwayat pemeriksaan ANC ibu
   */
  async getPemeriksaanAncList(kehamilanId = 'c3333333-3333-3333-3333-333333333333') {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('pemeriksaan_anc')
          .select('*')
          .order('tanggal_pemeriksaan', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Gagal fetch pemeriksaan_anc dari Supabase:', e);
      }
    }
    return [];
  },

  /**
   * Tambah pemeriksaan ANC baru (Input oleh Bidan / Kader - PBI 02C)
   */
  async tambahPemeriksaanAnc(ancData) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('pemeriksaan_anc')
          .insert([ancData])
          .select()
          .single();
        if (!error && data) return data;
        if (error) console.error('Insert pemeriksaan_anc error:', error);
      } catch (e) {
        console.warn('Exception tambahPemeriksaanAnc:', e);
      }
    }
    return {
      id: Date.now().toString(),
      ...ancData,
      created_at: new Date().toISOString()
    };
  },

  /**
   * Mengambil rencana persalinan P4K
   */
  async getRencanaPersalinan(kehamilanId = 'c3333333-3333-3333-3333-333333333333') {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('rencana_persalinan_p4k')
          .select('*')
          .limit(1)
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Gagal fetch rencana_persalinan_p4k dari Supabase:', e);
      }
    }
    return null;
  },

  /**
   * Mengambil riwayat nifas KF 1 - KF 4
   */
  async getPemeriksaanNifasList(pesertaId = '55af67c9-6695-4435-b4ea-2720efd73c92') {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('pemeriksaan_nifas')
          .select('*')
          .order('kunjungan', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Gagal fetch pemeriksaan_nifas dari Supabase:', e);
      }
    }
    return [];
  },

  // ==========================================
  // KESEHATAN ANAK
  // ==========================================

  /**
   * Mengambil riwayat pertumbuhan KMS anak
   */
  async getPertumbuhanAnakList(anakId = 'b2222222-2222-2222-2222-222222222222') {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('pertumbuhan_anak')
          .select('*')
          .order('tanggal_ukur', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Gagal fetch pertumbuhan_anak dari Supabase:', e);
      }
    }
    return [];
  },

  /**
   * Catat data pertumbuhan KMS baru (Input oleh Bidan / Kader - PBI 02C)
   */
  async tambahPertumbuhanAnak(kmsData) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('pertumbuhan_anak')
          .insert([kmsData])
          .select()
          .single();
        if (!error && data) return data;
        if (error) console.error('Insert pertumbuhan_anak error:', error);
      } catch (e) {
        console.warn('Exception tambahPertumbuhanAnak:', e);
      }
    }
    return {
      id: Date.now().toString(),
      ...kmsData,
      created_at: new Date().toISOString()
    };
  },

  /**
   * Mengambil milestone perkembangan KPSP anak
   */
  async getPerkembanganAnakList(anakId = 'b2222222-2222-2222-2222-222222222222') {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('perkembangan_anak')
          .select('*')
          .order('created_at', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Gagal fetch perkembangan_anak dari Supabase:', e);
      }
    }
    return [];
  },

  /**
   * Mengambil riwayat imunisasi anak
   */
  async getImunisasiAnakList(anakId = 'b2222222-2222-2222-2222-222222222222') {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('imunisasi_anak')
          .select('*')
          .order('created_at', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Gagal fetch imunisasi_anak dari Supabase:', e);
      }
    }
    return [];
  },

  // ==========================================
  // JADWAL & AGENDA
  // ==========================================

  /**
   * Mengambil daftar jadwal peserta
   */
  async getJadwalPesertaList(pesertaId = '55af67c9-6695-4435-b4ea-2720efd73c92') {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('jadwal_peserta')
          .select('*')
          .order('tanggal', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Gagal fetch jadwal_peserta dari Supabase:', e);
      }
    }
    return [];
  }
};
