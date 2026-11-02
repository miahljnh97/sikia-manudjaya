-- ==============================================================================
-- MIGRATION: PENAMBAHAN ATRIBUT PEMERIKSAAN ANC KOMPREHENSIF OLEH BIDAN
-- ==============================================================================
-- Database: Supabase PostgreSQL
-- Tabel: pemeriksaan_anc
-- ==============================================================================

ALTER TABLE pemeriksaan_anc 
  -- Section 1: Data Kunjungan
  ADD COLUMN IF NOT EXISTS jenis_pelayanan VARCHAR(100) DEFAULT 'Pemeriksaan kehamilan (ANC)',
  ADD COLUMN IF NOT EXISTS keluhan_utama TEXT,
  
  -- Section 2: Pemeriksaan Kehamilan (oleh Bidan)
  ADD COLUMN IF NOT EXISTS status_kehamilan VARCHAR(50) DEFAULT 'Kehamilan tunggal',
  ADD COLUMN IF NOT EXISTS letak_janin VARCHAR(50) DEFAULT 'Kepala',
  ADD COLUMN IF NOT EXISTS presentasi_janin VARCHAR(50) DEFAULT 'Kepala',
  ADD COLUMN IF NOT EXISTS gerakan_janin VARCHAR(50) DEFAULT 'Aktif',
  ADD COLUMN IF NOT EXISTS kontraksi VARCHAR(50) DEFAULT 'Tidak ada',
  ADD COLUMN IF NOT EXISTS kontraksi_ket TEXT,
  ADD COLUMN IF NOT EXISTS edema VARCHAR(50) DEFAULT 'Tidak ada',
  ADD COLUMN IF NOT EXISTS varises VARCHAR(50) DEFAULT 'Tidak ada',
  ADD COLUMN IF NOT EXISTS tanda_bahaya VARCHAR(100) DEFAULT 'Tidak ada',
  ADD COLUMN IF NOT EXISTS hasil_usg TEXT,
  
  -- Section 3: Penilaian & Tindakan
  ADD COLUMN IF NOT EXISTS status_risiko VARCHAR(50) DEFAULT 'Tidak berisiko',
  ADD COLUMN IF NOT EXISTS diagnosa TEXT,
  ADD COLUMN IF NOT EXISTS tindakan_diberikan JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS edukasi_diberikan JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tanggal_kontrol_berikutnya DATE,
  ADD COLUMN IF NOT EXISTS kunjungan_berikutnya VARCHAR(50),
  
  -- Section 4: Catatan Tambahan (Opsional) & Lampiran Dokumen
  ADD COLUMN IF NOT EXISTS catatan_nakes TEXT,
  ADD COLUMN IF NOT EXISTS lampiran_dokumen JSONB DEFAULT '[]'::jsonb,
  
  -- Status Validasi Rekam Medis (Draft vs Final)
  ADD COLUMN IF NOT EXISTS status_pemeriksaan VARCHAR(20) DEFAULT 'final';
