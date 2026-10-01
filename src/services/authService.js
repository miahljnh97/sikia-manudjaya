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

      // Normalisasi role dari database Supabase
      let userRole = profile?.role || 'kader';
      if (userRole.toLowerCase() === 'superadmin' || userRole.toLowerCase() === 'admin') {
        userRole = 'Super Admin';
      } else if (userRole.toLowerCase() === 'kader') {
        userRole = 'Kader Posyandu';
      } else if (userRole.toLowerCase() === 'bidan') {
        userRole = 'Bidan Desa';
      } else if (userRole.toLowerCase() === 'ibu') {
        userRole = 'Ibu Balita';
      }

      return {
        user: data.user,
        role: userRole,
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
    if (lowerEmail === DUMMY_ACCOUNTS.admin.email && password === 'Admin123!') {
      return { user: { email }, ...DUMMY_ACCOUNTS.admin };
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
