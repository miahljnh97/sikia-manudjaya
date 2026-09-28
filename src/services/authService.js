import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { DUMMY_ACCOUNTS } from '../models/pesertaModel';

export const authService = {
  /**
   * Login user via Supabase atau Fallback Akun Evaluasi Dummy
   */
  async login(email, password) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Ambil profile role jika ada di database
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return {
        user: data.user,
        role: profile?.role || 'kader',
        nama: profile?.nama || data.user.email?.split('@')[0],
      };
    }

    // Fallback mode evaluasi lokal (Offline / Tanpa koneksi Supabase)
    const lowerEmail = email.toLowerCase().trim();
    if (lowerEmail === DUMMY_ACCOUNTS.kader.email && password === 'Kader123!') {
      return { user: { email }, ...DUMMY_ACCOUNTS.kader };
    }
    if (lowerEmail === DUMMY_ACCOUNTS.bidan.email && password === 'Bidan123!') {
      return { user: { email }, ...DUMMY_ACCOUNTS.bidan };
    }
    if (lowerEmail === DUMMY_ACCOUNTS.ibu.email && password === 'Ibu123!') {
      return { user: { email }, ...DUMMY_ACCOUNTS.ibu };
    }

    throw new Error('Email atau password evaluasi salah.');
  },

  /**
   * Logout user
   */
  async logout() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    return true;
  }
};
