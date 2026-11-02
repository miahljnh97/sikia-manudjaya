/**
 * Service Layer untuk Buku KIA Digital (Sprint 2 & 3)
 * Menghubungkan modul Kesehatan Ibu, Kesehatan Anak, dan Jadwal ke Supabase
 * Dilengkapi Scoping ID ketat agar data tiap pasien terisolasi sempurna.
 */
import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { normalizePeserta, tentukanJenisPeserta } from '../utils/pesertaAdapter';
import { pesertaService } from './pesertaService';

export const bukuKiaService = {
  // ==========================================
  // MASTER & RESOLVER PASIEN
  // ==========================================

  /**
   * Mengambil daftar seluruh peserta Ibu Hamil untuk selector Bidan/Kader
   */
  async getDaftarIbuHamil() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('peserta')
          .select(`
            *,
            dusun:dusun_id (id, nama, kode),
            tipe_peserta:tipe_id (id, kode, nama)
          `)
          .order('nama', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped = data.map(normalizePeserta).filter(Boolean);
          const filtered = mapped.filter(p => 
            !p.is_suspended && 
            !p.is_suspend && 
            p.status !== 'Tidak Aktif' && 
            (
              p.status_ibu === 'hamil' || 
              (p.jenis_peserta && p.jenis_peserta.toLowerCase().includes('ibu')) ||
              (p.tipe_peserta?.nama && p.tipe_peserta.nama.toLowerCase().includes('ibu'))
            )
          );
          if (filtered.length > 0) return filtered;
        }
      } catch (e) {
        console.warn('Gagal fetch daftar ibu hamil:', e);
      }
    }
    return [];
  },

  /**
   * Mengambil daftar anak (Balita / Bayi)
   * Untuk Bidan/Kader: Menampilkan seluruh anak di database
   * Untuk Ibu: Menampilkan anak miliknya
   * @param {string|null} ibuId Opsional, jika ingin filter anak milik ibu tertentu
   */
  async getDaftarAnak(ibuId = null) {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('peserta')
          .select(`
            *,
            dusun:dusun_id (id, nama, kode),
            tipe_peserta:tipe_id (id, kode, nama)
          `);

        if (ibuId) {
          query = query.eq('ibu_id', ibuId);
          const { data, error } = await query.order('nama', { ascending: true });
          if (!error && data && data.length > 0) {
            return data.map(normalizePeserta).filter(Boolean);
          }
          // Jika query berhasil namun data kosong
          if (!error && data && data.length === 0) {
            return [];
          }
        } else {
          // Untuk Bidan / Kader: Ambil semua data anak di database Supabase
          const { data, error } = await query.order('nama', { ascending: true });
          if (!error && data && data.length > 0) {
            const mapped = data.map(normalizePeserta).filter(Boolean);
            const filtered = mapped.filter(p => {
              if (p.is_suspended || p.is_suspend || p.status === 'Tidak Aktif') return false;
              const jenis = (p.jenis_peserta || tentukanJenisPeserta(p) || '').toLowerCase();
              return (
                jenis.includes('balita') || 
                jenis.includes('bayi') || 
                jenis.includes('anak') || 
                Boolean(p.ibu_id) ||
                (p.tipe && String(p.tipe).toLowerCase().includes('anak'))
              );
            });



            if (filtered.length > 0) return filtered;
          }
        }
      } catch (e) {
        console.warn('Gagal fetch daftar anak dari Supabase:', e);
      }
    }

    // Fallback: Mengambil semua anak dari Central Store / pesertaService
    try {
      const fallbackPeserta = await pesertaService.getDaftarPeserta();
      if (fallbackPeserta && fallbackPeserta.length > 0) {
        if (ibuId) {
          const filtered = fallbackPeserta.filter(p => {
            if (p.is_suspended || p.is_suspend || p.status === 'Tidak Aktif') return false;
            return String(p.ibu_id) === String(ibuId);
          });
          if (filtered.length > 0) return filtered;
          

          return [];
        }

        const filtered = fallbackPeserta.filter(p => {
          if (p.is_suspended || p.is_suspend || p.status === 'Tidak Aktif') return false;
          const jenis = (p.jenis_peserta || tentukanJenisPeserta(p) || '').toLowerCase();
          return (
            jenis.includes('balita') || 
            jenis.includes('bayi') || 
            jenis.includes('anak') || 
            Boolean(p.ibu_id) ||
            (p.tipe && String(p.tipe).toLowerCase().includes('anak'))
          );
        });
        if (filtered.length > 0) return filtered;
      }
    } catch (err) {
      console.warn('Gagal ambil fallback anak via pesertaService:', err);
    }

    return [];
  },

  // ==========================================
  // KESEHATAN IBU
  // ==========================================
  
  /**
   * Mengambil data kehamilan aktif untuk peserta tertentu
   */
  async getKehamilanIbu(pesertaId) {
    if (!pesertaId) return null;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('kehamilan_ibu')
          .select('*')
          .eq('peserta_id', pesertaId)
          .maybeSingle();

        if (data && data.status_kehamilan === 'Aktif' && data.usia_kehamilan_minggu) {
          return data;
        }
      } catch (e) {
        console.warn('Gagal fetch kehamilan_ibu dari Supabase:', e);
      }
    }

    return null;
  },

  async getOrCreateKehamilanIbu(pesertaId) {
    if (!pesertaId) return null;
    const existing = await this.getKehamilanIbu(pesertaId);
    if (existing && existing.id) return existing;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('kehamilan_ibu')
          .insert([{
            peserta_id: pesertaId,
            gravida: 1,
            usia_kehamilan_minggu: 28,
            trimester: 3,
            status_kehamilan: 'Aktif'
          }])
          .select()
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.warn('Auto create kehamilan_ibu error:', err);
      }
    }

    return null;
  },

  /**
   * Mengambil riwayat pemeriksaan ANC TERISOLASI untuk kehamilan tertentu
   */
  async getPemeriksaanAncList(kehamilanId) {
    if (!kehamilanId) return [];

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('pemeriksaan_anc')
          .select('*')
          .eq('kehamilan_id', kehamilanId)
          .order('tanggal_pemeriksaan', { ascending: true });

        if (!error && data) return data;
      } catch (e) {
        console.warn('Gagal fetch pemeriksaan_anc dari Supabase:', e);
      }
    }
    return [];
  },

  /**
   * Tambah pemeriksaan ANC baru (Input oleh Bidan / Kader - PBI 02C)
   */
  async tambahPemeriksaanAnc(ancData) {
    if (!ancData.kehamilan_id) {
      throw new Error('kehamilan_id wajib diisi untuk menyimpan pemeriksaan ANC');
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('pemeriksaan_anc')
          .insert([ancData])
          .select()
          .single();

        if (!error && data) return data;
        if (error) console.error('Insert pemeriksaan_anc error:', error);
      } catch (e) {
        console.warn('Exception tambahPemeriksaanAnc:', e);
      }
    }
    return {
      id: Date.now().toString(),
      ...ancData,
      created_at: new Date().toISOString()
    };
  },

  /**
   * Simpan Rekam Medis ANC Bidan Komprehensif (Draft atau Final)
   * Menyimpan ke pemeriksaan_anc dan otomatis sinkronisasi ke kehamilan_ibu, jadwal_peserta, dan kunjungan
   */
  async simpanPemeriksaanAncBidan({
    kehamilanId,
    pesertaId,
    isDraft = false,
    formData,
    petugasId = null
  }) {
    let activeKehamilanId = kehamilanId;
    if (!activeKehamilanId && pesertaId) {
      const kh = await this.getKehamilanIbu(pesertaId);
      if (kh?.id) activeKehamilanId = kh.id;
    }

    const payload = {
      kehamilan_id: activeKehamilanId,
      kunjungan_ke: formData.kunjungan_ke || 'ANC 1',
      tanggal_pemeriksaan: formData.tanggal_pemeriksaan || new Date().toISOString().split('T')[0],
      usia_kehamilan: formData.usia_kehamilan || '28 Minggu',
      berat_badan: formData.berat_badan ? parseFloat(formData.berat_badan) : null,
      tekanan_darah: formData.tekanan_darah || null,
      lila: formData.lila ? parseFloat(formData.lila) : null,
      tinggi_fundus: formData.tinggi_fundus ? parseFloat(formData.tinggi_fundus) : null,
      djj: formData.djj ? parseInt(formData.djj, 10) : null,
      hemoglobin: formData.hemoglobin ? parseFloat(formData.hemoglobin) : null,
      pemeriksa: formData.pemeriksa || 'Bidan Khansa Fatin, S.Tr.Keb',
      faskes: formData.faskes || formData.tempat_pelayanan || 'Puskesmas Manud Jaya',
      status_hasil: formData.status_risiko || 'Normal',
      catatan_tindak_lanjut: formData.diagnosa || formData.catatan_tindak_lanjut || 'Kondisi ibu dan janin normal',
      // Atribut baru
      jenis_pelayanan: formData.jenis_pelayanan || 'Pemeriksaan kehamilan (ANC)',
      keluhan_utama: formData.keluhan_utama || null,
      status_kehamilan: formData.status_kehamilan || 'Kehamilan tunggal',
      letak_janin: formData.letak_janin || 'Kepala',
      presentasi_janin: formData.presentasi_janin || 'Kepala',
      gerakan_janin: formData.gerakan_janin || 'Aktif',
      kontraksi: formData.kontraksi || 'Tidak ada',
      kontraksi_ket: formData.kontraksi_ket || null,
      edema: formData.edema || 'Tidak ada',
      varises: formData.varises || 'Tidak ada',
      tanda_bahaya: formData.tanda_bahaya || 'Tidak ada',
      hasil_usg: formData.hasil_usg || null,
      status_risiko: formData.status_risiko || 'Tidak berisiko',
      diagnosa: formData.diagnosa || null,
      tindakan_diberikan: Array.isArray(formData.tindakan_diberikan) ? formData.tindakan_diberikan : [],
      edukasi_diberikan: Array.isArray(formData.edukasi_diberikan) ? formData.edukasi_diberikan : [],
      tanggal_kontrol_berikutnya: formData.tanggal_kontrol_berikutnya || null,
      kunjungan_berikutnya: formData.kunjungan_berikutnya || null,
      catatan_nakes: formData.catatan_nakes || null,
      lampiran_dokumen: Array.isArray(formData.lampiran_dokumen) ? formData.lampiran_dokumen : [],
      status_pemeriksaan: isDraft ? 'draft' : 'final'
    };

    let saved = null;
    if (isSupabaseConfigured && supabase && activeKehamilanId) {
      try {
        const { data, error } = await supabase
          .from('pemeriksaan_anc')
          .insert([payload])
          .select()
          .single();

        if (!error && data) {
          saved = data;
        } else if (error) {
          console.warn('Insert pemeriksaan_anc dengan extended column error, mencoba fallback dasar:', error.message);
          // Fallback ke kolom standar jika skema SQL belum dijalankan di Supabase dashboard
          const basicPayload = {
            kehamilan_id: activeKehamilanId,
            kunjungan_ke: payload.kunjungan_ke,
            tanggal_pemeriksaan: payload.tanggal_pemeriksaan,
            usia_kehamilan: payload.usia_kehamilan,
            tinggi_fundus: payload.tinggi_fundus,
            djj: payload.djj,
            pemeriksa: payload.pemeriksa,
            faskes: payload.faskes,
            status_hasil: payload.status_risiko || 'Normal',
            catatan_tindak_lanjut: [
              payload.diagnosa,
              payload.keluhan_utama ? `Keluhan: ${payload.keluhan_utama}` : null,
              payload.catatan_nakes ? `Catatan: ${payload.catatan_nakes}` : null
            ].filter(Boolean).join(' | ') || 'Kondisi baik'
          };
          const { data: bData, error: bErr } = await supabase
            .from('pemeriksaan_anc')
            .insert([basicPayload])
            .select()
            .single();
          if (!bErr && bData) saved = bData;
        }
      } catch (err) {
        console.warn('Gagal simpan ke Supabase pemeriksaan_anc:', err);
      }
    }

    if (!saved) {
      saved = {
        id: `anc-${Date.now()}`,
        ...payload,
        created_at: new Date().toISOString()
      };
    }

    // Auto-sync jika bukan draft
    if (!isDraft) {
      // 1. Sync ke kehamilan_ibu
      if (activeKehamilanId && (payload.tinggi_fundus || payload.djj)) {
        try {
          const updateKh = {};
          if (payload.tinggi_fundus) updateKh.tinggi_fundus = payload.tinggi_fundus;
          if (payload.djj) updateKh.djj = payload.djj;
          if (supabase) {
            await supabase.from('kehamilan_ibu').update(updateKh).eq('id', activeKehamilanId);
          }
        } catch (eKh) {
          console.warn('Gagal auto-sync kehamilan_ibu:', eKh);
        }
      }

      // 2. Sync ke jadwal_peserta
      if (pesertaId && payload.tanggal_kontrol_berikutnya && supabase) {
        try {
          await supabase.from('jadwal_peserta').insert([{
            peserta_id: pesertaId,
            tanggal: payload.tanggal_kontrol_berikutnya,
            waktu: '09:00 - 11:00',
            jenis_kegiatan: payload.kunjungan_berikutnya 
              ? `Pemeriksaan Rutin ANC (${payload.kunjungan_berikutnya})`
              : 'Pemeriksaan Rutin ANC',
            lokasi: payload.faskes || 'Puskesmas Manud Jaya',
            status: 'Akan Datang',
            catatan: payload.diagnosa || payload.keluhan_utama || 'Kontrol rutin kehamilan'
          }]);
        } catch (eJd) {
          console.warn('Gagal auto-sync jadwal_peserta:', eJd);
        }
      }

      // 3. Sync ke kunjungan
      if (pesertaId && supabase) {
        try {
          await supabase.from('kunjungan').insert([{
            peserta_id: pesertaId,
            tanggal: payload.tanggal_pemeriksaan,
            jam_kedatangan: '09:00',
            status_kehadiran: 'Hadir',
            catatan: payload.keluhan_utama || payload.diagnosa || 'Pemeriksaan kehamilan (ANC)',
            dicatat_oleh: petugasId || null
          }]);
        } catch (eKj) {
          console.warn('Gagal auto-sync kunjungan:', eKj);
        }
      }
    }

    return saved;
  },

  /**
   * Mengambil rencana persalinan P4K untuk kehamilan tertentu
   */
  async getRencanaPersalinan(kehamilanId) {
    if (!kehamilanId) return null;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('rencana_persalinan_p4k')
          .select('*')
          .eq('kehamilan_id', kehamilanId)
          .maybeSingle();

        if (!error && data) return data;
      } catch (e) {
        console.warn('Gagal fetch rencana_persalinan_p4k dari Supabase:', e);
      }
    }
    return null;
  },

  /**
   * Mengambil riwayat nifas KF 1 - KF 4 terisolasi per ibu
   */
  async getPemeriksaanNifasList(pesertaId) {
    if (!pesertaId) return [];

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('pemeriksaan_nifas')
          .select('*')
          .eq('peserta_id', pesertaId)
          .order('kunjungan', { ascending: true });

        if (!error && data) return data;
      } catch (e) {
        console.warn('Gagal fetch pemeriksaan_nifas dari Supabase:', e);
      }
    }
    return [];
  },

  // ==========================================
  // KESEHATAN ANAK
  // ==========================================

  /**
   * Mengambil riwayat pertumbuhan KMS anak TERISOLASI per anak_id
   */
  async getPertumbuhanAnakList(anakId) {
    if (!anakId) return [];

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('pertumbuhan_anak')
          .select('*')
          .eq('anak_id', anakId)
          .order('tanggal_ukur', { ascending: true });

        if (!error && data) return data;
      } catch (e) {
        console.warn('Gagal fetch pertumbuhan_anak dari Supabase:', e);
      }
    }
    return [];
  },

  /**
   * Catat data pertumbuhan KMS baru (Input oleh Bidan / Kader - PBI 02C)
   */
  async tambahPertumbuhanAnak(kmsData) {
    if (!kmsData.anak_id) {
      throw new Error('anak_id wajib diisi untuk mencatat pertumbuhan anak');
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('pertumbuhan_anak')
          .insert([kmsData])
          .select()
          .single();

        if (!error && data) return data;
        if (error) console.error('Insert pertumbuhan_anak error:', error);
      } catch (e) {
        console.warn('Exception tambahPertumbuhanAnak:', e);
      }
    }
    return {
      id: Date.now().toString(),
      ...kmsData,
      created_at: new Date().toISOString()
    };
  },

  /**
   * Mengambil milestone perkembangan KPSP anak terisolasi per anak_id
   */
  async getPerkembanganAnakList(anakId) {
    if (!anakId) return [];

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('perkembangan_anak')
          .select('*')
          .eq('anak_id', anakId)
          .order('created_at', { ascending: true });

        if (!error && data) return data;
      } catch (e) {
        console.warn('Gagal fetch perkembangan_anak dari Supabase:', e);
      }
    }
    return [];
  },

  /**
   * Mengambil riwayat imunisasi anak terisolasi per anak_id
   */
  async getImunisasiAnakList(anakId) {
    if (!anakId) return [];

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('imunisasi_anak')
          .select('*')
          .eq('anak_id', anakId)
          .order('created_at', { ascending: true });

        if (!error && data) return data;
      } catch (e) {
        console.warn('Gagal fetch imunisasi_anak dari Supabase:', e);
      }
    }
    return [];
  },

  // ==========================================
  // JADWAL & AGENDA
  // ==========================================

  /**
   * Mengambil daftar jadwal peserta terisolasi per peserta_id
   */
  async getJadwalPesertaList(pesertaId = null) {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('jadwal_peserta')
          .select('*')
          .order('tanggal', { ascending: true });

        if (pesertaId) {
          const { data, error } = await query.eq('peserta_id', pesertaId);
          if (!error && data) return data;
          return [];
        } else {
          const { data, error } = await query;
          if (!error && data) return data;
        }
      } catch (e) {
        console.warn('Gagal fetch jadwal_peserta dari Supabase:', e);
      }
    }
    return [];
  }
};
