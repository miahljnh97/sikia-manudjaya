import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { INITIAL_DUMMY_PESERTA } from '../models/pesertaModel';
import { dataStoreService } from './dataStoreService';
import { normalizePeserta, resolveDusunId, resolveTipeId } from '../utils/pesertaAdapter';
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
                const s = (kunj.status_kehadiran || '').toLowerCase();
                if (s.includes('dilayani') || s.includes('selesai')) {
                  norm.status_kehadiran = 'Sudah dilayani';
                } else if (s.includes('tidak')) {
                  norm.status_kehadiran = 'Tidak Hadir';
                } else if (s.includes('tunggu')) {
                  norm.status_kehadiran = 'Menunggu';
                } else if (s.includes('hadir')) {
                  norm.status_kehadiran = 'Hadir';
                } else {
                  norm.status_kehadiran = 'Menunggu';
                }
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

    let statusDb = 'hadir';
    const s = (statusKehadiran || '').toLowerCase();
    if (s.includes('tidak')) {
      statusDb = 'tidak_hadir';
    } else if (s.includes('tunggu')) {
      statusDb = 'menunggu';
    } else {
      statusDb = 'hadir';
    }

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
        const cleanPayload = { ...updatedFields };
        if (cleanPayload.dusun_id) {
          cleanPayload.dusun_id = resolveDusunId(cleanPayload.dusun_id);
        }
        if (cleanPayload.jenis_peserta && !cleanPayload.tipe_id) {
          cleanPayload.tipe_id = resolveTipeId(cleanPayload.jenis_peserta);
        }
        if (cleanPayload.tipe_id) {
          cleanPayload.tipe_id = resolveTipeId(cleanPayload.tipe_id);
        }
        if (cleanPayload.tgl_lahir) {
          cleanPayload.tgl_lahir = toISODateString(cleanPayload.tgl_lahir);
        }
        // Buang properti virtual yang bukan kolom database
        delete cleanPayload.jenis_peserta;
        delete cleanPayload.dusun;
        delete cleanPayload.tipe_peserta;
        delete cleanPayload.usia;
        delete cleanPayload.status;
        delete cleanPayload.status_kehadiran;
        delete cleanPayload.waktu_hadir;
        delete cleanPayload.nik_lengkap;
        delete cleanPayload.telepon;
        delete cleanPayload.telepon_pj;
        delete cleanPayload.catatan_observasi;

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
          dusun_id: resolveDusunId(pesertaData.dusun_id),
          tipe_id: resolveTipeId(pesertaData.tipe_id || pesertaData.jenis_peserta),
          status_ibu: pesertaData.status_ibu || null,
          tgl_lahir: pesertaData.tgl_lahir ? toISODateString(pesertaData.tgl_lahir) : null,
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
