import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { DUMMY_ACCOUNTS } from '../models/pesertaModel';

export const authService = {
  /**
   * Login user via Supabase atau Fallback Akun Evaluasi Dummy
   */
  async login(email, password) {
    const lowerEmail = (email || '').toLowerCase().trim();

    // Fast-path untuk Akun Ibu demo evaluasi
    if ((lowerEmail === DUMMY_ACCOUNTS.ibu_hamil?.email || lowerEmail === 'ibu.hamil@manudjaya.id') && password === 'Ibu123!') {
      return { 
        user: { email, id: DUMMY_ACCOUNTS.ibu_hamil.peserta_id }, 
        ...DUMMY_ACCOUNTS.ibu_hamil 
      };
    }
    if ((lowerEmail === DUMMY_ACCOUNTS.ibu_balita?.email || lowerEmail === 'ibu.balita@manudjaya.id') && password === 'Ibu123!') {
      return { 
        user: { email, id: DUMMY_ACCOUNTS.ibu_balita.peserta_id }, 
        ...DUMMY_ACCOUNTS.ibu_balita, nama: 'Siti Aminah' 
      };
    }
    if ((lowerEmail === DUMMY_ACCOUNTS.ibu_hamil_anak?.email || lowerEmail === 'ibu.hamil.anak@manudjaya.id' || lowerEmail === 'siti.aminah@manudjaya.id') && password === 'Ibu123!') {
      return { 
        user: { email, id: DUMMY_ACCOUNTS.ibu_hamil_anak.peserta_id }, 
        ...DUMMY_ACCOUNTS.ibu_hamil_anak 
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
          let pesertaData = null;
          let kaderData = null;

          // 1. Coba ambil dari tabel kader (dengan relasi roles)
          try {
            const { data: kData } = await supabase
              .from('kader')
              .select('*, roles:role_id(id, kode, nama)')
              .or(`user_id.eq.${data.user.id},email.eq.${lowerEmail}`)
              .maybeSingle();

            if (kData) {
              kaderData = kData;
              userName = kData.nama;
              userRole = kData.roles?.nama || kData.peran;
            }
          } catch (err) {
            console.warn('Gagal cek tabel kader:', err);
          }

          // 2. Coba ambil dari tabel peserta jika role belum ketemu
          if (!userRole) {
            try {
              const { data: pData } = await supabase
                .from('peserta')
                .select('*')
                .eq('user_id', data.user.id)
                .maybeSingle();

              if (pData) {
                pesertaData = pData;
                userName = pData.nama;
                userRole = pData.status_ibu === 'hamil' ? 'Ibu Hamil' : 'Ibu Balita';
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
          } else if (lowerEmail.includes('kader') || lowerEmail === DUMMY_ACCOUNTS.kader.email) {
            userRole = userRole || 'Kader Posyandu';
            userName = userName || DUMMY_ACCOUNTS.kader.nama;
          } else if (lowerEmail.includes('hamil.anak') || lowerEmail.includes('siti.aminah') || lowerEmail === DUMMY_ACCOUNTS.ibu_hamil_anak?.email) {
            userRole = 'Ibu';
            userName = userName || DUMMY_ACCOUNTS.ibu_hamil_anak?.nama || 'Siti Aminah';
          } else if (lowerEmail.includes('hamil') || lowerEmail === DUMMY_ACCOUNTS.ibu_hamil?.email) {
            userRole = 'Ibu';
            userName = userName || DUMMY_ACCOUNTS.ibu_hamil?.nama || 'Najwa Sihab';
          } else if (lowerEmail.includes('ibu') || lowerEmail.includes('balita') || lowerEmail === DUMMY_ACCOUNTS.ibu_balita?.email) {
            userRole = 'Ibu';
            userName = userName || DUMMY_ACCOUNTS.ibu_balita?.nama || 'Ibu Ratna';
          }

          // Normalisasi role string (default ke 'Ibu' demi privasi kecuali terbukti staff)
          const r = (userRole || '').toLowerCase();
          let normalizedRole = 'Ibu';
          if (r.includes('admin') || r === 'superadmin' || r === 'super_admin' || lowerEmail.includes('admin')) {
            normalizedRole = 'Super Admin';
          } else if (r.includes('bidan') || r === 'bidan_desa' || lowerEmail.includes('bidan')) {
            normalizedRole = 'Bidan Desa';
          } else if (r.includes('kader') || lowerEmail.includes('kader') || Boolean(kaderData)) {
            normalizedRole = 'Kader Posyandu';
          } else {
            normalizedRole = 'Ibu';
          }

          let pesertaId = pesertaData?.id;
          if (!pesertaId) {
            if (lowerEmail === 'ibu.balita@manudjaya.id' || (lowerEmail.includes('balita') && !lowerEmail.includes('hamil'))) {
              pesertaId = 'd5eeb9a6-3509-44ec-8fce-e95f3edd1a73';
            } else if (lowerEmail === 'ibu.hamil.anak@manudjaya.id' || lowerEmail === 'siti.aminah@manudjaya.id' || lowerEmail.includes('hamil.anak')) {
              pesertaId = '55af67c9-6695-4435-b4ea-2720efd73c92';
            } else if (lowerEmail === 'ibu.hamil@manudjaya.id' || lowerEmail.includes('hamil')) {
              pesertaId = '214fbe12-2216-4e61-9b12-9fccca445e84';
            }
          }
          pesertaId = pesertaId || data.user.id;

          return {
            user: data.user,
            id: data.user.id,
            petugas_id: data.user.id,
            role: normalizedRole,
            nama: userName || data.user.email?.split('@')[0] || 'Pengguna',
            peserta_id: pesertaId || data.user.id
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
      return { user: { email, id: DUMMY_ACCOUNTS.ibu_hamil.peserta_id }, ...DUMMY_ACCOUNTS.ibu_hamil };
    }
    if ((lowerEmail === DUMMY_ACCOUNTS.ibu_balita?.email || lowerEmail === 'ibu.balita@manudjaya.id') && password === 'Ibu123!') {
      return { user: { email, id: DUMMY_ACCOUNTS.ibu_balita.peserta_id }, ...DUMMY_ACCOUNTS.ibu_balita };
    }
    if ((lowerEmail === DUMMY_ACCOUNTS.ibu_hamil_anak?.email || lowerEmail === 'ibu.hamil.anak@manudjaya.id' || lowerEmail === 'siti.aminah@manudjaya.id') && password === 'Ibu123!') {
      return { user: { email, id: DUMMY_ACCOUNTS.ibu_hamil_anak.peserta_id }, ...DUMMY_ACCOUNTS.ibu_hamil_anak };
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
