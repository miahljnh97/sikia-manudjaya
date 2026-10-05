import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { normalizePeserta } from '../utils/pesertaAdapter';
import { toISODateString } from '../utils/dateUtils';

export const kunjunganService = {
  /**
   * Mengambil riwayat kunjungan lengkap dari tabel Supabase: kunjungan, peserta, jenis_pelayanan, profiles
   */
  async getRiwayatKunjungan() {
    if (!isSupabaseConfigured || !supabase) {
      return [];
    }

    try {
      // 1. Ambil data kunjungan beserta relasi peserta dan posyandu
      const { data: kunjunganList, error: kunjError } = await supabase
        .from('kunjungan')
        .select(`
          *,
          peserta:peserta_id (
            *,
            dusun:dusun_id (id, nama, kode),
            tipe_peserta:tipe_id (id, kode, nama)
          ),
          posyandu:posyandu_id (id, nama)
        `)
        .eq('is_suspended', false)
        .order('created_at', { ascending: false });

      if (kunjError) {
        console.error('Error fetching kunjungan from Supabase:', kunjError);
        return [];
      }

      if (!kunjunganList || kunjunganList.length === 0) {
        return [];
      }

      // 2. Ambil data kunjungan_pelayanan beserta jenis_pelayanan
      const { data: pelayananRel, error: relError } = await supabase
        .from('kunjungan_pelayanan')
        .select(`
          kunjungan_id,
          jenis_pelayanan:jenis_pelayanan_id (*)
        `)
        .eq('is_suspended', false);

      // 3. Ambil data kader/bidan pemeriksa (profiles)
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, nama');

      const profileMap = new Map();
      (profiles || []).forEach((pr) => profileMap.set(pr.id, pr.nama));

      // Kelompokkan jenis pelayanan berdasarkan kunjungan_id
      const pelayananMap = new Map();
      (pelayananRel || []).forEach((rel) => {
        if (!pelayananMap.has(rel.kunjungan_id)) {
          pelayananMap.set(rel.kunjungan_id, []);
        }
        if (rel.jenis_pelayanan?.nama) {
          pelayananMap.get(rel.kunjungan_id).push(rel.jenis_pelayanan.nama);
        }
      });

      // 4. Map ke model Riwayat Kunjungan Front-end
      return kunjunganList.map((item, idx) => {
        const pesertaNorm = item.peserta ? normalizePeserta(item.peserta) : null;
        const listLayanan = pelayananMap.get(item.id) || [];
        const jenisLayananStr = listLayanan.length > 0 ? listLayanan.join(', ') : 'Pemeriksaan Rutin';
        const petugasNama = profileMap.get(item.dicatat_oleh) || 'Kader Posyandu';

        // Format waktu & tanggal
        const tanggalStr = item.tanggal || new Date().toISOString().split('T')[0];
        const [y, m, d] = tanggalStr.split('-');
        const bulanIndo = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const bulanIndoLong = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const tglSingkat = `${parseInt(d, 10)} ${bulanIndo[parseInt(m, 10) - 1]} ${y}`;
        const tglLengkap = `${parseInt(d, 10)} ${bulanIndoLong[parseInt(m, 10) - 1]} ${y}`;

        const jamClean = item.jam_kedatangan ? item.jam_kedatangan.slice(0, 5) : '08:30';

        const statusRaw = (item.status_kehadiran || '').toLowerCase();
        let displayStatus = 'Selesai';
        let displayStatusLengkap = 'Selesai Dilayani';
        let displayStatusKehadiran = 'Hadir';

        if (statusRaw.includes('tidak')) {
          displayStatus = 'Tidak Hadir';
          displayStatusLengkap = 'Tidak Hadir';
          displayStatusKehadiran = 'Tidak Hadir';
        } else if (statusRaw.includes('tunggu')) {
          displayStatus = 'Menunggu';
          displayStatusLengkap = 'Menunggu';
          displayStatusKehadiran = 'Menunggu';
        } else if (statusRaw.includes('dilayani') || statusRaw.includes('selesai')) {
          displayStatus = 'Sudah Dilayani';
          displayStatusLengkap = 'Selesai Dilayani';
          displayStatusKehadiran = 'Sudah dilayani';
        } else {
          displayStatus = 'Hadir';
          displayStatusLengkap = 'Hadir';
          displayStatusKehadiran = 'Hadir';
        }

        const isHadir = displayStatusKehadiran === 'Hadir' || displayStatusKehadiran === 'Sudah dilayani';
        const isTidakHadir = displayStatusKehadiran === 'Tidak Hadir';
        const namaPosyandu = item.posyandu?.nama || 'Posyandu Desa Manud Jaya';

        return {
          id: item.id,
          posyandu_id: item.posyandu_id || item.posyandu?.id || null,
          no_registrasi: `KJ-0924-${String(idx + 185).padStart(4, '0')}`,
          no_antrean: `A-${String(idx + 1).padStart(2, '0')}`,
          nama: pesertaNorm?.nama || 'Peserta Posyandu',
          nik: pesertaNorm?.nik || '327502*******',
          nik_lengkap: pesertaNorm?.nik_lengkap || pesertaNorm?.nik || '327502*******',
          jenis_peserta: pesertaNorm?.jenis_peserta || 'Ibu Hamil',
          tanggal_iso: tanggalStr,
          tanggal_kunjungan: tglSingkat,
          tanggal_kunjungan_lengkap: tglLengkap,
          waktu: `${jamClean} WIB`,
          tempat: namaPosyandu,
          posyandu: namaPosyandu,
          jenis_pelayanan: jenisLayananStr,
          hasil_catatan: item.catatan || (isTidakHadir ? 'Tidak hadir pada jadwal posyandu' : (isHadir ? 'Pemeriksaan rutin selesai' : 'Menunggu pemeriksaan')),
          status: displayStatus,
          status_lengkap: displayStatusLengkap,
          status_kehadiran: displayStatusKehadiran,
          status_peserta: pesertaNorm?.status || 'Aktif',
          dusun: pesertaNorm?.dusun || 'Dusun 1',
          petugas: petugasNama,
          hasil_pemeriksaan: {
            berat_badan: isTidakHadir ? '-' : '60 kg',
            tinggi_badan: isTidakHadir ? '-' : '156 cm',
            tekanan_darah: isTidakHadir ? '-' : '110/70 mmHg',
            lingkar_lengan: isTidakHadir ? '-' : '28 cm',
            usia_kehamilan: pesertaNorm?.jenis_peserta === 'Ibu Hamil' ? (isTidakHadir ? '-' : '24 minggu') : null
          },
          layanan_tambahan: {
            tablet_fe: pesertaNorm?.jenis_peserta === 'Ibu Hamil' ? (isTidakHadir ? '-' : 'Diberikan') : '-',
            konseling_gizi: isTidakHadir ? '-' : 'Pola makan seimbang',
            edukasi: isTidakHadir ? '-' : 'Edukasi kesehatan ibu & anak'
          },
          catatan_pemeriksaan: item.catatan || (isTidakHadir ? 'Peserta terkonfirmasi Tidak Hadir pada jadwal posyandu ini.' : 'Kondisi peserta tercatat dalam buku register digital Posyandu Desa Manud Jaya.')
        };
      });
    } catch (err) {
      console.error('Fatal getRiwayatKunjungan exception:', err);
      return [];
    }
  },

  /**
   * Simpan pendaftaran registrasi kunjungan baru ke Supabase
   */
  async simpanKunjungan({ peserta_id, posyandu_id, tanggal, jam, catatan, jenis_pelayanan_ids = [], dicatat_oleh, status_kehadiran = 'hadir' }) {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    try {
      let statusDb = 'hadir';
      const s = (status_kehadiran || '').toLowerCase();
      if (s.includes('tidak')) statusDb = 'tidak_hadir';
      else if (s.includes('tunggu')) statusDb = 'menunggu';
      else statusDb = 'hadir';

      const payloadKunjungan = {
        peserta_id,
        posyandu_id: posyandu_id || null,
        tanggal: toISODateString(tanggal),
        jam_kedatangan: jam ? `${jam}:00` : '08:30:00',
        status_kehadiran: statusDb,
        catatan: catatan || null,
        dicatat_oleh: dicatat_oleh || '5c69e5ca-ba37-41b5-964e-5ef2525ef36d',
        is_suspended: false
      };

      const { data: newKunjungan, error } = await supabase
        .from('kunjungan')
        .insert([payloadKunjungan])
        .select()
        .single();

      if (error) {
        console.error('Error insert kunjungan to Supabase:', error);
        return null;
      }

      // Insert ke relasi kunjungan_pelayanan jika ada pilihan pelayanan
      if (newKunjungan && jenis_pelayanan_ids.length > 0) {
        const payloadRel = jenis_pelayanan_ids.map((id) => ({
          kunjungan_id: newKunjungan.id,
          jenis_pelayanan_id: id,
          is_suspended: false
        }));

        await supabase
          .from('kunjungan_pelayanan')
          .insert(payloadRel);
      }

      return newKunjungan;
    } catch (err) {
      console.error('Exception simpanKunjungan:', err);
      return null;
    }
  }
};
