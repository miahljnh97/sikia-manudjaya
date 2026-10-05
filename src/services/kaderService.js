import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { dataStoreService } from './dataStoreService';

export const kaderService = {
  /**
   * Mengambil daftar kader dari Supabase dengan relasi dusun, posyandu, dan roles
   */
  async getKaderList() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('kader')
          .select(`
            *,
            dusun:dusun_id (id, nama, kode),
            posyandu:posyandu_id (id, nama),
            roles:role_id (id, kode, nama)
          `)
          .eq('is_suspended', false)
          .order('id', { ascending: true });

        if (!error && data && data.length > 0) {
          // Format respons Supabase agar selaras dengan UI
          return data.map((item) => {
            const roleNama = item.roles?.nama || item.peran || 'Kader Posyandu';
            const dusunNama = item.dusun?.nama || item.dusun || 'Dusun 1';
            const posyanduNama = item.posyandu?.nama || item.posyandu || 'Posyandu Desa Manud Jaya';

            return {
              id: item.id,
              dusun_id: item.dusun_id || item.dusun?.id || null,
              posyandu_id: item.posyandu_id || item.posyandu?.id || null,
              role_id: item.role_id || item.roles?.id || null,
              nama: item.nama,
              nik: item.nik,
              peran: roleNama,
              dusun: dusunNama,
              posyandu: posyanduNama,
              telepon: item.telepon || '-',
              email: item.email || `${(item.nama || 'kader').toLowerCase().replace(/\s+/g, '.')}@manudjaya.id`,
              status: item.is_active ? 'Aktif' : 'Non-Aktif',
              is_active: item.is_active ?? true,
              is_suspended: item.is_suspended ?? false,
              tanggal_bergabung: item.created_at 
                ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Baru'
            };
          });
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
          dusun_id: kaderData.dusun_id || null,
          posyandu_id: kaderData.posyandu_id || null,
          role_id: kaderData.role_id || null,
          telepon: kaderData.telepon || null,
          email: kaderData.email || null,
          status: 'Aktif',
          is_active: true,
          is_suspended: false,
        };

        // Buang key undefined
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        const { data, error } = await supabase
          .from('kader')
          .insert([payload])
          .select(`
            *,
            dusun:dusun_id (id, nama, kode),
            posyandu:posyandu_id (id, nama),
            roles:role_id (id, kode, nama)
          `)
          .single();

        if (!error && data) {
          const roleNama = data.roles?.nama || data.peran || 'Kader Posyandu';
          const dusunNama = data.dusun?.nama || data.dusun || 'Dusun 1';
          const posyanduNama = data.posyandu?.nama || data.posyandu || 'Posyandu Desa Manud Jaya';

          insertedSupabase = {
            id: data.id,
            dusun_id: data.dusun_id || data.dusun?.id || null,
            posyandu_id: data.posyandu_id || data.posyandu?.id || null,
            role_id: data.role_id || data.roles?.id || null,
            nama: data.nama,
            nik: data.nik,
            peran: roleNama,
            dusun: dusunNama,
            posyandu: posyanduNama,
            telepon: data.telepon || '-',
            email: data.email || `${(data.nama || 'kader').toLowerCase().replace(/\s+/g, '.')}@manudjaya.id`,
            status: data.is_active ? 'Aktif' : 'Non-Aktif',
            is_active: data.is_active ?? true,
            is_suspended: data.is_suspended ?? false,
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
