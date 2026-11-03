import { exportToCsvFile } from '../utils/exportUtils';
import { supabase, isSupabaseConfigured } from '../config/supabaseClient';

// Baseline fallback data agar UI tetap interaktif saat database baru diinisialisasi
const FALLBACK_STATS = {
  totalPosyandu: 26,
  totalPosyanduTarget: 28,
  posyanduTrend: '+4%',
  totalKunjungan: 1248,
  kunjunganTrend: '+12%',
  bayiDitimbang: 1036,
  bayiPersenSasaran: 83,
  bayiTrend: '+9%',
  balitaDitimbang: 892,
  balitaPersenSasaran: 72,
  balitaTrend: '+11%',
  ibuHamilDiperiksa: 168,
  ibuHamilPersenSasaran: 89,
  ibuHamilTrend: '+6%',
  ibuNifas: 72,
  ibuNifasPersenSasaran: 77,
  ibuNifasTrend: '+7%'
};

const FALLBACK_TREN = [
  { bulan: 'Jan', total: 280, balita: 180, ibuHamil: 60, ibuNifas: 40 },
  { bulan: 'Feb', total: 295, balita: 190, ibuHamil: 65, ibuNifas: 40 },
  { bulan: 'Mar', total: 310, balita: 200, ibuHamil: 70, ibuNifas: 40 },
  { bulan: 'Apr', total: 315, balita: 205, ibuHamil: 70, ibuNifas: 40 },
  { bulan: 'Mei', total: 325, balita: 210, ibuHamil: 72, ibuNifas: 43 },
  { bulan: 'Jun', total: 330, balita: 212, ibuHamil: 75, ibuNifas: 43 },
  { bulan: 'Jul', total: 335, balita: 215, ibuHamil: 75, ibuNifas: 45 },
  { bulan: 'Agu', total: 340, balita: 218, ibuHamil: 74, ibuNifas: 48 },
  { bulan: 'Sep', total: 345, balita: 215, ibuHamil: 73, ibuNifas: 57 },
  { bulan: 'Okt', total: 350, balita: 220, ibuHamil: 72, ibuNifas: 58 },
  { bulan: 'Nov', total: 355, balita: 222, ibuHamil: 75, ibuNifas: 58 },
  { bulan: 'Des', total: 360, balita: 225, ibuHamil: 76, ibuNifas: 59 }
];

export const dinkesService = {
  // Master Filter Options
  getFilterOptions() {
    return {
      periode: ['Oktober 2024', 'September 2024', 'Agustus 2024', 'Juli 2024'],
      kecamatan: ['Semua Kecamatan', 'Kecamatan Manud Jaya', 'Kecamatan Sumberrejo', 'Kecamatan Melati Jaya'],
      desa: [
        'Semua Desa',
        'Desa Manud Jaya',
        'Desa Sungai Raya',
        'Desa Tanjung Sari',
        'Desa Harapan',
        'Desa Mulia',
        'Desa Mandiri Jaya',
        'Desa Soreang Baru',
        'Desa Purnama',
        'Desa Melati',
        'Desa Sumber Makmur'
      ],
      posyandu: [
        'Semua Posyandu',
        'Manud Jaya',
        'Mawar 2',
        'Anggrek 4',
        'Dahlia 3',
        'Cempaka 2',
        'Melati 1',
        'Kenanga 5',
        'Flamboyan 3',
        'Kamboja 2',
        'Teratai 4'
      ]
    };
  },

  // 1. Dashboard 6 Stat Cards
  async getDashboardStats() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('dinkes_dashboard_summary')
          .select('*')
          .limit(1)
          .single();

        if (!error && data) {
          return {
            totalPosyandu: data.total_posyandu ?? 26,
            totalPosyanduTarget: data.total_posyandu_target ?? 28,
            posyanduTrend: data.posyandu_trend ?? '+4%',
            totalKunjungan: data.total_kunjungan ?? 1248,
            kunjunganTrend: data.kunjungan_trend ?? '+12%',
            bayiDitimbang: data.bayi_ditimbang ?? 1036,
            bayiPersenSasaran: data.bayi_persen_sasaran ?? 83,
            bayiTrend: data.bayi_trend ?? '+9%',
            balitaDitimbang: data.balita_ditimbang ?? 892,
            balitaPersenSasaran: data.balita_persen_sasaran ?? 72,
            balitaTrend: data.balita_trend ?? '+11%',
            ibuHamilDiperiksa: data.ibu_hamil_diperiksa ?? 168,
            ibuHamilPersenSasaran: data.ibu_hamil_persen_sasaran ?? 89,
            ibuHamilTrend: data.ibu_hamil_trend ?? '+6%',
            ibuNifas: data.ibu_nifas ?? 72,
            ibuNifasPersenSasaran: data.ibu_nifas_persen_sasaran ?? 77,
            ibuNifasTrend: data.ibu_nifas_trend ?? '+7%'
          };
        }
      } catch (e) {
        console.warn('Fallback ke stats default dinkes:', e);
      }
    }

    return FALLBACK_STATS;
  },

  // 2. Line Chart Tren Kunjungan Posyandu
  async getTrenKunjungan() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('dinkes_tren_bulanan')
          .select('*')
          .order('urutan', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((d) => ({
            bulan: d.bulan,
            total: d.total,
            balita: d.balita,
            ibuHamil: d.ibu_hamil,
            ibuNifas: d.ibu_nifas
          }));
        }
      } catch (e) {
        console.warn('Fallback ke tren kunjungan default:', e);
      }
    }

    return FALLBACK_TREN;
  },

  // 3. Top 5 Posyandu Kunjungan Tertinggi
  async getTopPosyandu() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('dinkes_rekapitulasi_posyandu')
          .select('*')
          .order('total_kunjungan', { ascending: false })
          .limit(5);

        if (!error && data && data.length > 0) {
          return data.map((item, idx) => ({
            no: idx + 1,
            nama: item.nama,
            desa: item.desa,
            totalKunjungan: item.total_kunjungan,
            totalPasien: item.total_pasien,
            totalBayi: item.total_bayi,
            totalBalita: item.total_balita,
            totalIbuHamil: item.total_ibu_hamil,
            totalIbuNifas: item.total_ibu_nifas,
            trend: item.trend,
            terakhirDiperbarui: item.terakhir_diperbarui
          }));
        }
      } catch (e) {
        console.warn('Fallback ke top posyandu default:', e);
      }
    }

    // Default fallback
    return [
      { no: 1, nama: 'Manud Jaya', desa: 'Manud Jaya', totalKunjungan: 156, totalPasien: 156, totalBayi: 156, totalBalita: 156, totalIbuHamil: 156, totalIbuNifas: 156, trend: '↑ 12%', terakhirDiperbarui: '30/10/2026 21:50' },
      { no: 2, nama: 'Mawar 2', desa: 'Sungai Raya', totalKunjungan: 124, totalPasien: 124, totalBayi: 124, totalBalita: 124, totalIbuHamil: 124, totalIbuNifas: 124, trend: '↑ 8%', terakhirDiperbarui: '30/10/2026 21:50' },
      { no: 3, nama: 'Anggrek 4', desa: 'Harapan', totalKunjungan: 144, totalPasien: 144, totalBayi: 144, totalBalita: 144, totalIbuHamil: 144, totalIbuNifas: 144, trend: '↑ 10%', terakhirDiperbarui: '30/10/2026 21:50' },
      { no: 4, nama: 'Dahlia 3', desa: 'Tanjung Sari', totalKunjungan: 137, totalPasien: 137, totalBayi: 137, totalBalita: 137, totalIbuHamil: 137, totalIbuNifas: 137, trend: '↑ 9%', terakhirDiperbarui: '30/10/2026 21:50' },
      { no: 5, nama: 'Cempaka 2', desa: 'Mulia', totalKunjungan: 130, totalPasien: 130, totalBayi: 130, totalBalita: 130, totalIbuHamil: 130, totalIbuNifas: 130, trend: '↑ 11%', terakhirDiperbarui: '30/10/2026 21:50' }
    ];
  },

  // 4. Daftar Ibu Hamil Berisiko Tinggi
  async getIbuHamilRisiko() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('dinkes_ibu_hamil_risiko')
          .select('*')
          .order('no', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((item) => ({
            id: item.id,
            no: item.no,
            namaIbu: item.nama_ibu,
            nik: item.nik,
            usiaKehamilan: item.usia_kehamilan,
            hasilPemeriksaan: item.hasil_pemeriksaan,
            posyandu: item.posyandu,
            desa: item.desa,
            tanggalPeriksa: item.tanggal_periksa,
            statusTindakLanjut: item.status_tindak_lanjut,
            catatanMedis: item.catatan_medis,
            rekomendasiDinkes: item.rekomendasi_dinkes
          }));
        }
      } catch (e) {
        console.warn('Fallback ke ibu hamil risiko default:', e);
      }
    }

    return [
      { id: 'ih-1', no: 1, namaIbu: 'Siti Rahayu', nik: '3275014405940001', usiaKehamilan: '32 minggu', hasilPemeriksaan: 'TD: 140/90 mmHg', posyandu: 'Mandiri Jaya', tanggalPeriksa: '23 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti' },
      { id: 'ih-2', no: 2, namaIbu: 'Nur Khasanah', nik: '3275015507960002', usiaKehamilan: '28 minggu', hasilPemeriksaan: 'LILA: 21 cm', posyandu: 'Terang Sari', tanggalPeriksa: '22 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut' },
      { id: 'ih-3', no: 3, namaIbu: 'Rina Lestari', nik: '3275016609980003', usiaKehamilan: '24 minggu', hasilPemeriksaan: 'Hb: 10,5 g/dL', posyandu: 'Sungai Raya', tanggalPeriksa: '20 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti' },
      { id: 'ih-4', no: 4, namaIbu: 'Dewi Anggraini', nik: '3275017701020004', usiaKehamilan: '26 minggu', hasilPemeriksaan: 'Usia: 17 tahun', posyandu: 'Harapan', tanggalPeriksa: '23 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut' },
      { id: 'ih-5', no: 5, namaIbu: 'Putri Amelia', nik: '3275018803970005', usiaKehamilan: '30 minggu', hasilPemeriksaan: 'Riwayat preeklamsia sebelumnya', posyandu: 'Mulia', tanggalPeriksa: '24 Okt 2026', statusTindakLanjut: 'Rujuk' },
      { id: 'ih-6', no: 6, namaIbu: 'Siti Aminah', nik: '3200000000000003', usiaKehamilan: '28 minggu', hasilPemeriksaan: 'TD: 135/85 mmHg, Anemia Ringan', posyandu: 'Manud Jaya', tanggalPeriksa: '23 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti' }
    ];
  },

  // 5. Daftar Balita dengan Indikasi Stunting
  async getBalitaStunting() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('dinkes_balita_stunting')
          .select('*')
          .order('no', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((item) => ({
            id: item.id,
            no: item.no,
            namaAnak: item.nama_anak,
            nik: item.nik,
            usia: item.usia,
            jenisKelamin: item.jenis_kelamin,
            hasilUkur: item.hasil_ukur,
            bbUkur: item.bb_ukur,
            posyandu: item.posyandu,
            desa: item.desa,
            tanggalUkur: item.tanggal_ukur,
            statusTindakLanjut: item.status_tindak_lanjut,
            statusGizi: item.status_gizi,
            intervensiPmt: item.intervensi_pmt
          }));
        }
      } catch (e) {
        console.warn('Fallback ke balita stunting default:', e);
      }
    }

    return [
      { id: 'st-1', no: 1, namaAnak: 'Ardi Pratama', nik: '3275021102240001', usia: '18 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 68 cm', posyandu: 'Tanjung Sari', tanggalUkur: '24 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut' },
      { id: 'st-2', no: 2, namaAnak: 'Aisyah Azzahra', nik: '3275022204240002', usia: '24 bulan', jenisKelamin: 'Perempuan', hasilUkur: 'TB: 80 cm', posyandu: 'Sungai Raya', tanggalUkur: '20 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti' },
      { id: 'st-3', no: 3, namaAnak: 'Rizki Maulana', nik: '3275023306230003', usia: '36 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 85 cm', posyandu: 'Mandiri Jaya', tanggalUkur: '22 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut' },
      { id: 'st-4', no: 4, namaAnak: 'Nayla Putri', nik: '3275024408240004', usia: '20 bulan', jenisKelamin: 'Perempuan', hasilUkur: 'TB: 70 cm', posyandu: 'Harapan', tanggalUkur: '24 Okt 2026', statusTindakLanjut: 'Rujuk' },
      { id: 'st-5', no: 5, namaAnak: 'Zidan Maulana', nik: '3275025510230005', usia: '30 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 84 cm', posyandu: 'Mulia', tanggalUkur: '21 Okt 2026', statusTindakLanjut: 'Sudah Ditindaklanjuti' },
      { id: 'st-6', no: 6, namaAnak: 'Kenzo Alfarizi', nik: '3275026612240006', usia: '14 bulan', jenisKelamin: 'Laki-laki', hasilUkur: 'TB: 69 cm', posyandu: 'Manud Jaya', tanggalUkur: '23 Okt 2026', statusTindakLanjut: 'Perlu Tindak Lanjut' }
    ];
  },

  // 6. Rekapitulasi Berdasarkan Posyandu
  async getRekapitulasiByPosyandu() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('dinkes_rekapitulasi_posyandu')
          .select('*')
          .order('no', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((item) => ({
            id: item.id,
            no: item.no,
            nama: item.nama,
            desa: item.desa,
            totalKunjungan: item.total_kunjungan,
            totalPasien: item.total_pasien,
            totalBayi: item.total_bayi,
            totalBalita: item.total_balita,
            totalIbuHamil: item.total_ibu_hamil,
            totalIbuNifas: item.total_ibu_nifas,
            trend: item.trend,
            terakhirDiperbarui: item.terakhir_diperbarui
          }));
        }
      } catch (e) {
        console.warn('Fallback ke rekap posyandu default:', e);
      }
    }

    return [
      { no: 1, nama: 'Manud Jaya', desa: 'Manud Jaya', totalKunjungan: 156, totalPasien: 156, totalBayi: 156, totalBalita: 156, totalIbuHamil: 156, totalIbuNifas: 156, trend: '↑ 12%', terakhirDiperbarui: '30/10/2026 21:50' },
      { no: 2, nama: 'Mawar 2', desa: 'Sungai Raya', totalKunjungan: 124, totalPasien: 124, totalBayi: 124, totalBalita: 124, totalIbuHamil: 124, totalIbuNifas: 124, trend: '↑ 8%', terakhirDiperbarui: '30/10/2026 21:50' },
      { no: 3, nama: 'Anggrek 4', desa: 'Harapan', totalKunjungan: 144, totalPasien: 144, totalBayi: 144, totalBalita: 144, totalIbuHamil: 144, totalIbuNifas: 144, trend: '↑ 10%', terakhirDiperbarui: '30/10/2026 21:50' },
      { no: 4, nama: 'Dahlia 3', desa: 'Tanjung Sari', totalKunjungan: 137, totalPasien: 137, totalBayi: 137, totalBalita: 137, totalIbuHamil: 137, totalIbuNifas: 137, trend: '↑ 9%', terakhirDiperbarui: '30/10/2026 21:50' },
      { no: 5, nama: 'Cempaka 2', desa: 'Mulia', totalKunjungan: 130, totalPasien: 130, totalBayi: 130, totalBalita: 130, totalIbuHamil: 130, totalIbuNifas: 130, trend: '↑ 11%', terakhirDiperbarui: '30/10/2026 21:50' }
    ];
  },

  // 7. Rekapitulasi Berdasarkan Desa
  async getRekapitulasiByDesa() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('dinkes_rekapitulasi_desa')
          .select('*')
          .order('no', { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((item) => ({
            id: item.id,
            no: item.no,
            desa: item.desa,
            jumlahPosyandu: item.jumlah_posyandu,
            totalPasien: item.total_pasien,
            totalBayi: item.total_bayi,
            totalBalita: item.total_balita,
            totalIbuHamil: item.total_ibu_hamil,
            totalIbuNifas: item.total_ibu_nifas,
            trend: item.trend,
            terakhirDiperbarui: item.terakhir_diperbarui,
            kasusStunting: item.kasus_stunting,
            ibuRisiko: item.ibu_risiko,
            imunisasiRendah: item.cakupan_imunisasi_rendah
          }));
        }
      } catch (e) {
        console.warn('Fallback ke rekap desa default:', e);
      }
    }

    return [
      { no: 1, desa: 'Manud Jaya', jumlahPosyandu: 72, totalPasien: 156, totalBayi: 156, totalBalita: 156, totalIbuHamil: 156, totalIbuNifas: 156, trend: '↑ 12%', terakhirDiperbarui: '30/10/2026 21:50', kasusStunting: 32, ibuRisiko: 6 },
      { no: 2, desa: 'Sungai Raya', jumlahPosyandu: 68, totalPasien: 124, totalBayi: 124, totalBalita: 124, totalIbuHamil: 124, totalIbuNifas: 124, trend: '↑ 8%', terakhirDiperbarui: '30/10/2026 21:50', kasusStunting: 22, ibuRisiko: 4 },
      { no: 3, desa: 'Tanjung Sari', jumlahPosyandu: 56, totalPasien: 144, totalBayi: 144, totalBalita: 144, totalIbuHamil: 144, totalIbuNifas: 144, trend: '↑ 10%', terakhirDiperbarui: '30/10/2026 21:50', kasusStunting: 16, ibuRisiko: 3 },
      { no: 4, desa: 'Melati', jumlahPosyandu: 51, totalPasien: 137, totalBayi: 137, totalBalita: 137, totalIbuHamil: 137, totalIbuNifas: 137, trend: '↑ 9%', terakhirDiperbarui: '30/10/2026 21:50', kasusStunting: 6, ibuRisiko: 1 },
      { no: 5, desa: 'Mulia', jumlahPosyandu: 130, totalPasien: 130, totalBayi: 130, totalBalita: 130, totalIbuHamil: 130, totalIbuNifas: 130, trend: '↑ 11%', terakhirDiperbarui: '30/10/2026 21:50', kasusStunting: 14, ibuRisiko: 2 }
    ];
  },

  // 8. Update Status Tindak Lanjut
  async updateStatusTindakLanjut(tipe, id, statusBaru) {
    if (isSupabaseConfigured && supabase) {
      try {
        const table = tipe === 'ibu' ? 'dinkes_ibu_hamil_risiko' : 'dinkes_balita_stunting';
        const { error } = await supabase
          .from(table)
          .update({ status_tindak_lanjut: statusBaru, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (!error) return { success: true };
      } catch (e) {
        console.warn('Gagal update status di Supabase:', e);
      }
    }
    return { success: true, localOnly: true };
  },

  // 9. Export Data ke CSV (Mendukung fleksibel arguments)
  exportToCsv(arg1, arg2, arg3) {
    // Format A: exportToCsv(filename, headers, rows)
    if (typeof arg1 === 'string' && Array.isArray(arg2) && Array.isArray(arg3)) {
      return exportToCsvFile({ filename: arg1, headers: arg2, rows: arg3 });
    }
    // Format B: exportToCsv(rowsOrObjects, filename, customHeaders)
    if (Array.isArray(arg1) && typeof arg2 === 'string') {
      const data = arg1;
      const filename = arg2;
      if (data.length === 0) {
        return exportToCsvFile({ filename, headers: ['Data Kosong'], rows: [] });
      }
      if (Array.isArray(data[0])) {
        return exportToCsvFile({ filename, headers: arg3 || [], rows: data });
      }
      const headers = arg3 || Object.keys(data[0]);
      const rows = data.map((item) => headers.map((h) => item[h] ?? ''));
      return exportToCsvFile({ filename, headers, rows });
    }
    // Format C: exportToCsv({ filename, headers, rows })
    if (arg1 && typeof arg1 === 'object') {
      return exportToCsvFile(arg1);
    }
  }
};
