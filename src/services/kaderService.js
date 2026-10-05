import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { dataStoreService } from './dataStoreService';

export const kaderService = {
  /**
   * Mengambil daftar kader dari Supabase (dengan fallback ke LocalStore)
   */
  async getKaderList() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('kader')
          .select('*')
          .eq('is_suspended', false)
          .order('id', { ascending: true });

        if (!error && data && data.length > 0) {
          // Format respons Supabase agar selaras dengan UI
          return data.map((item) => ({
            id: item.id,
            nama: item.nama,
            nik: item.nik,
            peran: item.peran || 'Kader Posyandu',
            dusun: item.dusun || 'Dusun 1',
            posyandu: item.posyandu || 'Posyandu Desa Manud Jaya',
            telepon: item.telepon || '-',
            email: item.email || `${(item.nama || 'kader').toLowerCase().replace(/\s+/g, '.')}@manudjaya.id`,
            status: item.is_active ? 'Aktif' : 'Non-Aktif',
            is_active: item.is_active ?? true,
            is_suspended: item.is_suspended ?? false,
            tanggal_bergabung: item.created_at 
              ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'Baru'
          }));
        }
      } catch (err) {
        console.warn('Gagal fetch kader dari Supabase:', err);
      }
    }

    return dataStoreService.getKaderList();
  },

  /**
   * Tambah kader baru langsung ke Supabase (dan backup ke dataStore)
   */
  async tambahKader(kaderData) {
    let insertedSupabase = null;

    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          nama: kaderData.nama,
          nik: kaderData.nik,
          peran: kaderData.peran || 'Kader Posyandu',
          dusun: kaderData.dusun || null,
          posyandu: kaderData.posyandu || null,
          telepon: kaderData.telepon || null,
          email: kaderData.email || null,
          status: 'Aktif',
          is_active: true,
          is_suspended: false,
        };

        const { data, error } = await supabase
          .from('kader')
          .insert([payload])
          .select()
          .single();

        if (!error && data) {
          insertedSupabase = {
            ...data,
            tanggal_bergabung: new Date(data.created_at || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
          };
        } else if (error) {
          console.error('Error insert kader ke Supabase:', error);
        }
      } catch (err) {
        console.error('Supabase tambahKader exception:', err);
      }
    }

    // Selalu simpan juga ke local data store sebagai backup & reactive update
    const fallbackEntry = dataStoreService.addKader(insertedSupabase || kaderData);
    return insertedSupabase || fallbackEntry;
  },

  /**
   * Toggle status aktif kader di Supabase & localStore
   */
  async toggleKaderActive(id, currentStatus) {
    const nextStatus = !currentStatus;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('kader')
          .update({ 
            is_active: nextStatus,
            status: nextStatus ? 'Aktif' : 'Non-Aktif' 
          })
          .eq('id', id);
      } catch (err) {
        console.warn('Gagal update status kader di Supabase:', err);
      }
    }

    return dataStoreService.toggleKaderActive(id);
  },

  /**
   * Soft-delete (suspend) kader di Supabase & localStore
   */
  async suspendKader(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('kader')
          .update({ 
            is_suspended: true,
            is_active: false,
            status: 'Suspended'
          })
          .eq('id', id);
      } catch (err) {
        console.warn('Gagal suspend kader di Supabase:', err);
      }
    }

    return dataStoreService.suspendKader(id);
  }
};
