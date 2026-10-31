-- ==============================================================================
-- SQL SEED & DATA FIX UNTUK MEMASTIKAN KESELARASAN DATA BUKU KIA & DASHBOARD
-- ==============================================================================
-- Script ini aman dijalankan berulang kali (Idempotent menggunakan ON CONFLICT)
-- Database: Supabase PostgreSQL
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PERBAIKAN STATUS IBU BALITA (Ibu Ratna - d5eeb9a6-3509-44ec-8fce-e95f3edd1a73)
-- Memastikan akun Ibu Balita tidak memiliki kehamilan berstatus 'Aktif'
-- ------------------------------------------------------------------------------
UPDATE kehamilan_ibu 
SET 
  status_kehamilan = 'Selesai',
  usia_kehamilan_minggu = NULL,
  trimester = NULL
WHERE peserta_id = 'd5eeb9a6-3509-44ec-8fce-e95f3edd1a73';

UPDATE peserta 
SET 
  status_ibu = 'menyusui' 
WHERE id = 'd5eeb9a6-3509-44ec-8fce-e95f3edd1a73';


-- ------------------------------------------------------------------------------
-- 2. PENAMBAHAN DATA JADWAL PESERTA (jadwal_peserta)
-- Memastikan halaman Dashboard & Jadwal Saya selaras di bulan Oktober & November 2026
-- ------------------------------------------------------------------------------

-- 2.1 Jadwal Ibu Hamil (Najwa Sihab - 214fbe12-2216-4e61-9b12-9fccca445e84)
INSERT INTO jadwal_peserta (id, peserta_id, tanggal, waktu, jenis_kegiatan, lokasi, status, catatan)
VALUES 
  (
    'a1000000-0000-0000-0000-000000000001',
    '214fbe12-2216-4e61-9b12-9fccca445e84',
    '2026-10-24',
    '09:00 - 10:30',
    'Pemeriksaan Rutin Trimester 3 (ANC 6)',
    'Puskesmas Manud Jaya',
    'Akan Datang',
    'Pemeriksaan ANC rutin, pengukuran denyut jantung janin (DJJ), dan evaluasi tensi ibu.'
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    '214fbe12-2216-4e61-9b12-9fccca445e84',
    '2026-10-30',
    '08:30 - 11:00',
    'Kelas Ibu Hamil & Senam Hamil',
    'Posyandu Anggrek',
    'Akan Datang',
    'Edukasi tanda bahaya persalinan, persiapan perlengkapan bayi, dan senam pernapasan.'
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    '214fbe12-2216-4e61-9b12-9fccca445e84',
    '2026-11-12',
    '09:00 - 10:30',
    'Konsultasi Persiapan Persalinan & Laktasi',
    'Puskesmas Manud Jaya',
    'Akan Datang',
    'Konsultasi bimbingan Inisiasi Menyusu Dini (IMD) dan persiapan ASI eksklusif bersama Bidan.'
  )
ON CONFLICT (id) DO UPDATE SET
  tanggal = EXCLUDED.tanggal,
  waktu = EXCLUDED.waktu,
  jenis_kegiatan = EXCLUDED.jenis_kegiatan,
  lokasi = EXCLUDED.lokasi,
  status = EXCLUDED.status,
  catatan = EXCLUDED.catatan;

-- 2.2 Jadwal Ibu Balita (Ibu Ratna - d5eeb9a6-3509-44ec-8fce-e95f3edd1a73)
INSERT INTO jadwal_peserta (id, peserta_id, tanggal, waktu, jenis_kegiatan, lokasi, status, catatan)
VALUES 
  (
    'a2000000-0000-0000-0000-000000000001',
    'd5eeb9a6-3509-44ec-8fce-e95f3edd1a73',
    '2026-10-25',
    '08:30 - 11:30',
    'Posyandu Balita & Pemantauan Tumbuh Kembang',
    'Posyandu Anggrek',
    'Akan Datang',
    'Penimbangan BB/TB dan skrining KPSP bulanan untuk balita Alea Shanum Almahira.'
  ),
  (
    'a2000000-0000-0000-0000-000000000002',
    'd5eeb9a6-3509-44ec-8fce-e95f3edd1a73',
    '2026-11-15',
    '08:30 - 11:00',
    'Posyandu Balita & Pemberian Vitamin A',
    'Posyandu Anggrek',
    'Akan Datang',
    'Pemberian vitamin A dan stimulasi motorik balita di Posyandu.'
  )
ON CONFLICT (id) DO UPDATE SET
  tanggal = EXCLUDED.tanggal,
  waktu = EXCLUDED.waktu,
  jenis_kegiatan = EXCLUDED.jenis_kegiatan,
  lokasi = EXCLUDED.lokasi,
  status = EXCLUDED.status,
  catatan = EXCLUDED.catatan;


-- ------------------------------------------------------------------------------
-- 3. DATA RIWAYAT & JADWAL IMUNISASI ANAK (imunisasi_anak)
-- Menyinkronkan imunisasi anak Aisyah Putri Rahma & Alea Shanum
-- ------------------------------------------------------------------------------

-- 3.1 Imunisasi Anak Aisyah Putri Rahma (c2000000-0000-0000-0000-000000000001, lahir 10 Nov 2025)
INSERT INTO imunisasi_anak (id, anak_id, nama_vaksin, jadwal_usia, tanggal_diberikan, lokasi, petugas, no_batch_vaksin, status)
VALUES
  ('b1000000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001', 'Hepatitis B (HB0)', '0 - 24 Jam', '2025-11-10', 'Puskesmas Manud Jaya', 'Bidan Siti, S.Tr.Keb', 'HB-2025-11', 'Selesai'),
  ('b1000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000001', 'BCG', '1 Bulan', '2025-12-10', 'Posyandu Anggrek', 'Bidan Siti, S.Tr.Keb', 'BCG-2025-12', 'Selesai'),
  ('b1000000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000001', 'Polio Tetes 1 (bOPV 1)', '1 Bulan', '2025-12-10', 'Posyandu Anggrek', 'Bidan Siti, S.Tr.Keb', 'OPV-2025-12', 'Selesai'),
  ('b1000000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000001', 'DPT-HB-Hib 1', '2 Bulan', '2026-01-12', 'Puskesmas Manud Jaya', 'Bidan Siti, S.Tr.Keb', 'DPT-2026-01', 'Selesai'),
  ('b1000000-0000-0000-0000-000000000005', 'c2000000-0000-0000-0000-000000000001', 'Polio Tetes 2 (bOPV 2)', '2 Bulan', '2026-01-12', 'Puskesmas Manud Jaya', 'Bidan Siti, S.Tr.Keb', 'OPV-2026-01', 'Selesai'),
  ('b1000000-0000-0000-0000-000000000006', 'c2000000-0000-0000-0000-000000000001', 'DPT-HB-Hib 2', '3 Bulan', '2026-02-14', 'Posyandu Anggrek', 'Bidan Siti, S.Tr.Keb', 'DPT-2026-02', 'Selesai'),
  ('b1000000-0000-0000-0000-000000000007', 'c2000000-0000-0000-0000-000000000001', 'Polio Tetes 3 (bOPV 3)', '3 Bulan', '2026-02-14', 'Posyandu Anggrek', 'Bidan Siti, S.Tr.Keb', 'OPV-2026-02', 'Selesai'),
  ('b1000000-0000-0000-0000-000000000008', 'c2000000-0000-0000-0000-000000000001', 'DPT-HB-Hib 3', '4 Bulan', '2026-03-16', 'Puskesmas Manud Jaya', 'Bidan Siti, S.Tr.Keb', 'DPT-2026-03', 'Selesai'),
  ('b1000000-0000-0000-0000-000000000009', 'c2000000-0000-0000-0000-000000000001', 'Polio Tetes 4 (bOPV 4)', '4 Bulan', '2026-03-16', 'Puskesmas Manud Jaya', 'Bidan Siti, S.Tr.Keb', 'OPV-2026-03', 'Selesai'),
  ('b1000000-0000-0000-0000-000000000010', 'c2000000-0000-0000-0000-000000000001', 'Polio Suntik (IPV 1)', '4 Bulan', '2026-03-16', 'Puskesmas Manud Jaya', 'Bidan Siti, S.Tr.Keb', 'IPV-2026-03', 'Selesai'),
  ('b1000000-0000-0000-0000-000000000011', 'c2000000-0000-0000-0000-000000000001', 'Campak Rubella (MR)', '9 Bulan', '2026-08-15', 'Posyandu Anggrek', 'Bidan Siti, S.Tr.Keb', 'MR-2026-08', 'Selesai'),
  ('b1000000-0000-0000-0000-000000000012', 'c2000000-0000-0000-0000-000000000001', 'DPT-HB-Hib Lanjutan', '18 Bulan', NULL, 'Posyandu Anggrek', 'Bidan Siti, S.Tr.Keb', NULL, 'Akan Datang'),
  ('b1000000-0000-0000-0000-000000000013', 'c2000000-0000-0000-0000-000000000001', 'Campak Rubella (MR) Lanjutan', '18 Bulan', NULL, 'Posyandu Anggrek', 'Bidan Siti, S.Tr.Keb', NULL, 'Akan Datang')
ON CONFLICT (id) DO UPDATE SET
  nama_vaksin = EXCLUDED.nama_vaksin,
  jadwal_usia = EXCLUDED.jadwal_usia,
  tanggal_diberikan = EXCLUDED.tanggal_diberikan,
  status = EXCLUDED.status;

-- 3.2 Imunisasi Anak Alea Shanum Almahira (06b1c286-adb3-4c40-a6cf-51e7c0fa5a12, lahir 01 Jan 2025)
INSERT INTO imunisasi_anak (id, anak_id, nama_vaksin, jadwal_usia, tanggal_diberikan, lokasi, petugas, no_batch_vaksin, status)
VALUES
  ('b2000000-0000-0000-0000-000000000001', '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12', 'Hepatitis B (HB0)', '0 - 24 Jam', '2025-01-01', 'Puskesmas Manud Jaya', 'Bidan Siti, S.Tr.Keb', 'HB-2025-01', 'Selesai'),
  ('b2000000-0000-0000-0000-000000000002', '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12', 'BCG', '1 Bulan', '2025-02-05', 'Posyandu Anggrek', 'Bidan Siti, S.Tr.Keb', 'BCG-2025-02', 'Selesai'),
  ('b2000000-0000-0000-0000-000000000003', '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12', 'Polio Tetes 1 (bOPV 1)', '1 Bulan', '2025-02-05', 'Posyandu Anggrek', 'Bidan Siti, S.Tr.Keb', 'OPV-2025-02', 'Selesai'),
  ('b2000000-0000-0000-0000-000000000004', '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12', 'DPT-HB-Hib 1', '2 Bulan', '2025-03-08', 'Puskesmas Manud Jaya', 'Bidan Siti, S.Tr.Keb', 'DPT-2025-03', 'Selesai'),
  ('b2000000-0000-0000-0000-000000000005', '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12', 'Polio Tetes 2 (bOPV 2)', '2 Bulan', '2025-03-08', 'Puskesmas Manud Jaya', 'Bidan Siti, S.Tr.Keb', 'OPV-2025-03', 'Selesai'),
  ('b2000000-0000-0000-0000-000000000006', '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12', 'DPT-HB-Hib 2', '3 Bulan', '2025-04-10', 'Posyandu Anggrek', 'Bidan Siti, S.Tr.Keb', 'DPT-2025-04', 'Selesai'),
  ('b2000000-0000-0000-0000-000000000007', '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12', 'Polio Tetes 3 (bOPV 3)', '3 Bulan', '2025-04-10', 'Posyandu Anggrek', 'Bidan Siti, S.Tr.Keb', 'OPV-2025-04', 'Selesai'),
  ('b2000000-0000-0000-0000-000000000008', '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12', 'DPT-HB-Hib 3', '4 Bulan', '2025-05-12', 'Puskesmas Manud Jaya', 'Bidan Siti, S.Tr.Keb', 'DPT-2025-05', 'Selesai'),
  ('b2000000-0000-0000-0000-000000000009', '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12', 'Polio Tetes 4 (bOPV 4)', '4 Bulan', '2025-05-12', 'Puskesmas Manud Jaya', 'Bidan Siti, S.Tr.Keb', 'OPV-2025-05', 'Selesai'),
  ('b2000000-0000-0000-0000-000000000010', '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12', 'Polio Suntik (IPV 1)', '4 Bulan', '2025-05-12', 'Puskesmas Manud Jaya', 'Bidan Siti, S.Tr.Keb', 'IPV-2025-05', 'Selesai'),
  ('b2000000-0000-0000-0000-000000000011', '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12', 'Campak Rubella (MR)', '9 Bulan', '2025-10-15', 'Posyandu Anggrek', 'Bidan Siti, S.Tr.Keb', 'MR-2025-10', 'Selesai'),
  ('b2000000-0000-0000-0000-000000000012', '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12', 'DPT-HB-Hib Lanjutan', '18 Bulan', '2026-07-20', 'Posyandu Anggrek', 'Bidan Siti, S.Tr.Keb', 'DPT-2026-07', 'Selesai'),
  ('b2000000-0000-0000-0000-000000000013', '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12', 'Campak Rubella (MR) Lanjutan', '18 Bulan', '2026-07-20', 'Posyandu Anggrek', 'Bidan Siti, S.Tr.Keb', 'MR-2026-07', 'Selesai')
ON CONFLICT (id) DO UPDATE SET
  nama_vaksin = EXCLUDED.nama_vaksin,
  jadwal_usia = EXCLUDED.jadwal_usia,
  tanggal_diberikan = EXCLUDED.tanggal_diberikan,
  status = EXCLUDED.status;


-- ------------------------------------------------------------------------------
-- 4. DATA PERKEMBANGAN & MILESTONE ANAK (perkembangan_anak)
-- ------------------------------------------------------------------------------

-- 4.1 Perkembangan Alea Shanum Almahira (06b1c286-adb3-4c40-a6cf-51e7c0fa5a12)
INSERT INTO perkembangan_anak (id, anak_id, tahap_perkembangan, judul_milestone, usia_pencapaian, tanggal_tercapai, status, status_perkembangan, skrining_ke)
VALUES
  ('c4000000-0000-0000-0000-000000000001', '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12', '18 - 24 Bulan', 'Duduk tanpa Bantuan', 'Usia 6 Bulan', '2025-07-10', 'Tercapai', 'Sesuai Usia', 4),
  ('c4000000-0000-0000-0000-000000000002', '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12', '18 - 24 Bulan', 'Merangkak dan Menjelajah', 'Usia 8 Bulan', '2025-09-12', 'Tercapai', 'Sesuai Usia', 4),
  ('c4000000-0000-0000-0000-000000000003', '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12', '18 - 24 Bulan', 'Berdiri Sendiri Tanpa Bantuan', 'Usia 11 Bulan', '2025-12-05', 'Tercapai', 'Sesuai Usia', 4),
  ('c4000000-0000-0000-0000-000000000004', '06b1c286-adb3-4c40-a6cf-51e7c0fa5a12', '18 - 24 Bulan', 'Berjalan Lancar dan Menumpuk Balok', 'Usia 14 Bulan', '2026-03-15', 'Tercapai', 'Sesuai Usia', 4)
ON CONFLICT (id) DO UPDATE SET
  judul_milestone = EXCLUDED.judul_milestone,
  tanggal_tercapai = EXCLUDED.tanggal_tercapai,
  status = EXCLUDED.status;

-- 4.2 Perkembangan Aisyah Putri Rahma (c2000000-0000-0000-0000-000000000001)
INSERT INTO perkembangan_anak (id, anak_id, tahap_perkembangan, judul_milestone, usia_pencapaian, tanggal_tercapai, status, status_perkembangan, skrining_ke)
VALUES
  ('c5000000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001', '9 - 12 Bulan', 'Duduk tanpa Bantuan', 'Usia 6 Bulan', '2026-05-10', 'Tercapai', 'Sesuai Usia', 2),
  ('c5000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000001', '9 - 12 Bulan', 'Merangkak Mengambil Mainan', 'Usia 8 Bulan', '2026-07-15', 'Tercapai', 'Sesuai Usia', 2),
  ('c5000000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000001', '9 - 12 Bulan', 'Berdiri dengan Berpegangan', 'Usia 10 Bulan', '2026-09-20', 'Tercapai', 'Sesuai Usia', 2)
ON CONFLICT (id) DO UPDATE SET
  judul_milestone = EXCLUDED.judul_milestone,
  tanggal_tercapai = EXCLUDED.tanggal_tercapai,
  status = EXCLUDED.status;


-- ------------------------------------------------------------------------------
-- 5. RIWAYAT PEMERIKSAAN NIFAS (pemeriksaan_nifas)
-- Memastikan Ibu Balita memiliki riwayat KF yang sudah Selesai (bukan Belum)
-- ------------------------------------------------------------------------------
INSERT INTO pemeriksaan_nifas (id, peserta_id, kunjungan, rentang_waktu, fokus_pemantauan, status_pemeriksaan, rencana_menyusui, status_edukasi)
VALUES
  ('d2000000-0000-0000-0000-000000000001', 'd5eeb9a6-3509-44ec-8fce-e95f3edd1a73', 'KF 1', '6 Jam - 3 hari', 'Pendarahan, involusi rahim, perlekatan ASI awal', 'Selesai', 'ASI Eksklusif', 'Sudah Diberikan'),
  ('d2000000-0000-0000-0000-000000000002', 'd5eeb9a6-3509-44ec-8fce-e95f3edd1a73', 'KF 2', '4 - 7 hari', 'Penyembuhan luka & fisik ibu, produksi ASI', 'Selesai', 'ASI Eksklusif', 'Sudah Diberikan'),
  ('d2000000-0000-0000-0000-000000000003', 'd5eeb9a6-3509-44ec-8fce-e95f3edd1a73', 'KF 3', '8 - 28 hari', 'Kesehatan umum ibu dan kecukupan nutrisi bayi', 'Selesai', 'ASI Eksklusif', 'Sudah Diberikan'),
  ('d2000000-0000-0000-0000-000000000004', 'd5eeb9a6-3509-44ec-8fce-e95f3edd1a73', 'KF 4', '29 - 42 hari', 'Konseling KB pasca salin, pemulihan organ reproduksi total', 'Selesai', 'ASI Eksklusif', 'Sudah Diberikan')
ON CONFLICT (id) DO UPDATE SET
  status_pemeriksaan = EXCLUDED.status_pemeriksaan,
  rencana_menyusui = EXCLUDED.rencana_menyusui;
