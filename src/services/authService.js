import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { DUMMY_ACCOUNTS } from '../models/pesertaModel';

export const authService = {
  /**
   * Login user via Supabase atau Fallback Akun Evaluasi Dummy
   */
  async login(email, password) {
    const lowerEmail = (email || '').toLowerCase().trim();

    // Fast-path untuk Akun Ibu Hamil evaluasi (karena domain manudjaya.id tidak di-whitelist di Auth SMTP)
    if ((lowerEmail === DUMMY_ACCOUNTS.ibu_hamil?.email || lowerEmail === 'ibu.hamil@manudjaya.id') && password === 'Ibu123!') {
      return { 
        user: { email, id: '55af67c9-6695-4435-b4ea-2720efd73c92' }, 
        ...DUMMY_ACCOUNTS.ibu_hamil 
      };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data?.user) {
          let userRole = null;
          let userName = null;

          // 1. Coba ambil dari tabel kader (dengan relasi roles)
          try {
            const { data: kaderData } = await supabase
              .from('kader')
              .select('*, roles:role_id(id, kode, nama)')
              .or(`user_id.eq.${data.user.id},email.eq.${lowerEmail}`)
              .maybeSingle();

            if (kaderData) {
              userName = kaderData.nama;
              userRole = kaderData.roles?.nama || kaderData.peran;
            }
          } catch (err) {
            console.warn('Gagal cek tabel kader:', err);
          }

          // 2. Coba ambil dari tabel peserta jika role belum ketemu
          if (!userRole) {
            try {
              const { data: pesertaData } = await supabase
                .from('peserta')
                .select('*')
                .eq('user_id', data.user.id)
                .maybeSingle();

              if (pesertaData) {
                userName = pesertaData.nama;
                userRole = pesertaData.status_ibu === 'hamil' ? 'Ibu Hamil' : 'Ibu Balita';
              }
            } catch (err) {
              console.warn('Gagal cek tabel peserta:', err);
            }
          }

          // 3. Coba ambil dari user_metadata Supabase
          if (!userName && (data.user.user_metadata?.nama || data.user.user_metadata?.full_name || data.user.user_metadata?.name)) {
            userName = data.user.user_metadata?.nama || data.user.user_metadata?.full_name || data.user.user_metadata?.name;
          }
          if (!userRole && (data.user.user_metadata?.role || data.user.app_metadata?.role)) {
            userRole = data.user.user_metadata?.role || data.user.app_metadata?.role;
          }

          // 4. Fallback pencocokan email berdasarkan akun standar
          if (lowerEmail.includes('admin') || lowerEmail === DUMMY_ACCOUNTS.admin.email) {
            userRole = userRole || 'Super Admin';
            userName = userName || DUMMY_ACCOUNTS.admin.nama;
          } else if (lowerEmail.includes('bidan') || lowerEmail === DUMMY_ACCOUNTS.bidan.email) {
            userRole = userRole || 'Bidan Desa';
            userName = userName || DUMMY_ACCOUNTS.bidan.nama;
          } else if (lowerEmail.includes('hamil') || lowerEmail === DUMMY_ACCOUNTS.ibu_hamil?.email) {
            userRole = 'Ibu Hamil';
            userName = userName || DUMMY_ACCOUNTS.ibu_hamil?.nama || 'Siti Aminah';
          } else if (lowerEmail.includes('ibu') || lowerEmail === DUMMY_ACCOUNTS.ibu_balita?.email) {
            userRole = userRole || 'Ibu Balita';
            userName = userName || DUMMY_ACCOUNTS.ibu_balita?.nama || 'Ibu Ratna';
          } else if (lowerEmail.includes('kader') || lowerEmail === DUMMY_ACCOUNTS.kader.email) {
            userRole = userRole || 'Kader Posyandu';
            userName = userName || DUMMY_ACCOUNTS.kader.nama;
          }

          // Normalisasi role string
          const r = (userRole || 'kader').toLowerCase();
          let normalizedRole = 'Kader Posyandu';
          if (r.includes('admin') || r === 'superadmin' || r === 'super_admin') {
            normalizedRole = 'Super Admin';
          } else if (r.includes('bidan') || r === 'bidan_desa') {
            normalizedRole = 'Bidan Desa';
          } else if (r.includes('hamil') || lowerEmail.includes('hamil')) {
            normalizedRole = 'Ibu Hamil';
          } else if (r.includes('ibu') || r === 'ibu_balita') {
            normalizedRole = 'Ibu Balita';
          } else {
            normalizedRole = 'Kader Posyandu';
          }

          return {
            user: data.user,
            role: normalizedRole,
            nama: userName || data.user.email?.split('@')[0] || 'Pengguna',
          };
        }
      } catch (authErr) {
        console.warn('Supabase auth error, falling back to local accounts:', authErr);
      }
    }

    // Fallback mode evaluasi lokal (Offline / Akun Evaluasi)
    if (lowerEmail === DUMMY_ACCOUNTS.kader.email && password === 'Kader123!') {
      return { user: { email }, ...DUMMY_ACCOUNTS.kader };
    }
    if (lowerEmail === DUMMY_ACCOUNTS.bidan.email && password === 'Bidan123!') {
      return { user: { email }, ...DUMMY_ACCOUNTS.bidan };
    }
    if ((lowerEmail === DUMMY_ACCOUNTS.ibu_hamil?.email || lowerEmail === 'ibu.hamil@manudjaya.id') && password === 'Ibu123!') {
      return { user: { email, id: '55af67c9-6695-4435-b4ea-2720efd73c92' }, ...DUMMY_ACCOUNTS.ibu_hamil };
    }
    if ((lowerEmail === DUMMY_ACCOUNTS.ibu_balita?.email || lowerEmail === 'ibu.balita@manudjaya.id' || lowerEmail === DUMMY_ACCOUNTS.ibu?.email) && password === 'Ibu123!') {
      return { user: { email, id: 'd5eeb9a6-3509-44ec-8fce-e95f3edd1a73' }, ...DUMMY_ACCOUNTS.ibu_balita };
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
