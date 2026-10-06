import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { INITIAL_DUMMY_PESERTA } from '../models/pesertaModel';
import { dataStoreService } from './dataStoreService';
import { 
  normalizePeserta, 
  resolveDusunId, 
  resolveTipeId, 
  formatPesertaDbPayload, 
  toDbStatusKehadiran, 
  fromDbStatusKehadiran 
} from '../utils/schemaMapper';
import { toISODateString, getTodayISODate } from '../utils/dateUtils';

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
          .eq('is_suspended', false)
          .order('id', { ascending: true });

        if (!error && data && data.length > 0) {
          // Ambil status kunjungan posyandu hari ini dari tabel kunjungan
          try {
            const todayLocal = getTodayISODate();
            const todayUTC = new Date().toISOString().split('T')[0];
            const targetDates = Array.from(new Set([todayLocal, todayUTC]));

            const { data: kunjunganHariIni } = await supabase
              .from('kunjungan')
              .select('peserta_id, status_kehadiran, jam_kedatangan, created_at')
              .in('tanggal', targetDates)
              .eq('is_suspended', false)
              .order('created_at', { ascending: false });

            const kunjunganMap = new Map();
            (kunjunganHariIni || []).forEach((k) => {
              if (k.peserta_id && !kunjunganMap.has(k.peserta_id)) {
                kunjunganMap.set(k.peserta_id, k);
              }
            });

            return data.map((row) => {
              const norm = normalizePeserta(row);
              const kunj = kunjunganMap.get(row.id);
              if (kunj) {
                norm.status_kehadiran = fromDbStatusKehadiran(kunj.status_kehadiran);
                norm.waktu_hadir = kunj.jam_kedatangan ? kunj.jam_kedatangan.slice(0, 5).replace(':', '.') : '08.45';
              } else {
                norm.status_kehadiran = 'Menunggu';
              }
              return norm;
            });
          } catch (e) {
            console.warn('Gagal ambil relasi kunjungan hari ini:', e);
            return data.map(normalizePeserta);
          }
        }
      } catch (err) {
        console.warn('Gagal fetch data peserta dari Supabase:', err);
      }
    }
    // Fallback: Mengembalikan data dari Central Store (LocalStorage + State)
    return dataStoreService.getPesertaList().map(normalizePeserta);
  },

  /**
   * Update status kehadiran peserta - Mendukung 4 status: Hadir, Menunggu, Sudah dilayani, Tidak Hadir
   */
  async updateStatusKehadiran(id, statusKehadiran) {
    const waktuSekarang = (statusKehadiran === 'Hadir' || statusKehadiran === 'Sudah Hadir' || statusKehadiran === 'Sudah dilayani')
      ? new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
      : null;
    const jamDb = waktuSekarang ? `${waktuSekarang}:00` : '08:30:00';
    const tglHariIni = getTodayISODate();
    const todayUTC = new Date().toISOString().split('T')[0];
    const targetDates = Array.from(new Set([tglHariIni, todayUTC]));
    const statusDb = toDbStatusKehadiran(statusKehadiran);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: existingKunjungan } = await supabase
          .from('kunjungan')
          .select('id')
          .eq('peserta_id', id)
          .in('tanggal', targetDates)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (existingKunjungan?.id) {
          await supabase
            .from('kunjungan')
            .update({
              tanggal: tglHariIni,
              status_kehadiran: statusDb,
              jam_kedatangan: jamDb
            })
            .eq('id', existingKunjungan.id);
        } else {
          await supabase
            .from('kunjungan')
            .insert([{
              peserta_id: id,
              tanggal: tglHariIni,
              jam_kedatangan: jamDb,
              status_kehadiran: statusDb,
              dicatat_oleh: '5c69e5ca-ba37-41b5-964e-5ef2525ef36d',
              is_suspended: false
            }]);
        }
      } catch (err) {
        console.warn('Gagal sinkron status kehadiran ke tabel kunjungan:', err);
      }
    }

    // Perbarui central dataStore lokal agar UI instan bereaksi
    dataStoreService.updatePeserta(id, {
      status_kehadiran: statusKehadiran,
      waktu_hadir: waktuSekarang
    });

    return { id, status_kehadiran: statusKehadiran, waktu_hadir: waktuSekarang };
  },

  /**
   * Update data profil peserta
   */
  async updatePeserta(id, updatedFields) {
    if (isSupabaseConfigured && supabase) {
      try {
        const cleanPayload = formatPesertaDbPayload(updatedFields);

        const { data, error } = await supabase
          .from('peserta')
          .update(cleanPayload)
          .eq('id', id)
          .select(`
            *,
            dusun:dusun_id (id, nama, kode),
            tipe_peserta:tipe_id (id, kode, nama)
          `)
          .single();

        if (!error && data) {
          const norm = normalizePeserta(data);
          dataStoreService.updatePeserta(id, norm);
          return norm;
        }
        if (error) console.error('Error update peserta Supabase:', error);
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
        const payload = formatPesertaDbPayload(pesertaData);

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
  },

  /**
   * Soft delete (suspend) peserta
   */
  async suspendPeserta(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('peserta')
          .update({ is_suspended: true, aktif: false })
          .eq('id', id);
      } catch (err) {
        console.warn('Gagal suspend peserta di Supabase:', err);
      }
    }
    return dataStoreService.suspendPeserta(id);
  }
};
