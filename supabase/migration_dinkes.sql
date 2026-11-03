-- ==============================================================================
-- SKEMA & SEED DATA DINAS KESEHATAN (KABUPATEN ADMINISTRASI)
-- ==============================================================================
-- Database: Supabase PostgreSQL
-- Idempotent: Aman dijalankan berulang kali di Supabase SQL Editor
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABEL RINGKASAN DASHBOARD KABUPATEN
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dinkes_dashboard_summary (
  id text PRIMARY KEY,
  periode text NOT NULL,
  kecamatan text DEFAULT 'Semua Kecamatan',
  total_posyandu int DEFAULT 26,
  total_posyandu_target int DEFAULT 28,
  posyandu_trend text DEFAULT '+4%',
  total_kunjungan int DEFAULT 1248,
  kunjungan_trend text DEFAULT '+12%',
  bayi_ditimbang int DEFAULT 1036,
  bayi_persen_sasaran int DEFAULT 83,
  bayi_trend text DEFAULT '+9%',
  balita_ditimbang int DEFAULT 892,
  balita_persen_sasaran int DEFAULT 72,
  balita_trend text DEFAULT '+11%',
  ibu_hamil_diperiksa int DEFAULT 168,
  ibu_hamil_persen_sasaran int DEFAULT 89,
  ibu_hamil_trend text DEFAULT '+6%',
  ibu_nifas int DEFAULT 72,
  ibu_nifas_persen_sasaran int DEFAULT 77,
  ibu_nifas_trend text DEFAULT '+7%',
  imunisasi_lengkap_balita int DEFAULT 638,
  imunisasi_belum_lengkap_balita int DEFAULT 254,
  stunting_perlu_tindak_lanjut int DEFAULT 2,
  stunting_sudah_ditindaklanjuti int DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 2. TABEL TREN KUNJUNGAN BULANAN (12 BULAN)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dinkes_tren_bulanan (
  id text PRIMARY KEY,
  tahun int NOT NULL DEFAULT 2024,
  urutan int NOT NULL,
  bulan text NOT NULL,
  total int NOT NULL DEFAULT 0,
  balita int NOT NULL DEFAULT 0,
  ibu_hamil int NOT NULL DEFAULT 0,
  ibu_nifas int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 3. TABEL REKAPITULASI KUNJUNGAN PER POSYANDU
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dinkes_rekapitulasi_posyandu (
  id text PRIMARY KEY,
  no int NOT NULL,
  nama text NOT NULL,
  desa text NOT NULL,
  total_kunjungan int NOT NULL DEFAULT 0,
  total_pasien int NOT NULL DEFAULT 0,
  total_bayi int NOT NULL DEFAULT 0,
  total_balita int NOT NULL DEFAULT 0,
  total_ibu_hamil int NOT NULL DEFAULT 0,
  total_ibu_nifas int NOT NULL DEFAULT 0,
  trend text DEFAULT '↑ 10%',
  terakhir_diperbarui text DEFAULT '30/10/2026 21:50',
  created_at timestamptz DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 4. TABEL REKAPITULASI KUNJUNGAN PER DESA & PERSEBARAN WILAYAH
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dinkes_rekapitulasi_desa (
  id text PRIMARY KEY,
  no int NOT NULL,
  desa text NOT NULL,
  jumlah_posyandu int NOT NULL DEFAULT 0,
  total_pasien int NOT NULL DEFAULT 0,
  total_bayi int NOT NULL DEFAULT 0,
  total_balita int NOT NULL DEFAULT 0,
  total_ibu_hamil int NOT NULL DEFAULT 0,
  total_ibu_nifas int NOT NULL DEFAULT 0,
  trend text DEFAULT '↑ 10%',
  terakhir_diperbarui text DEFAULT '30/10/2026 21:50',
  kasus_stunting int NOT NULL DEFAULT 0,
  ibu_risiko int NOT NULL DEFAULT 0,
  cakupan_imunisasi_rendah int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 5. TABEL IBU HAMIL BERISIKO TINGGI
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dinkes_ibu_hamil_risiko (
  id text PRIMARY KEY,
  no int NOT NULL,
  nama_ibu text NOT NULL,
  nik text NOT NULL,
  usia_kehamilan text NOT NULL,
  hasil_pemeriksaan text NOT NULL,
  posyandu text NOT NULL,
  desa text NOT NULL,
  tanggal_periksa text NOT NULL,
  status_tindak_lanjut text NOT NULL DEFAULT 'Perlu Tindak Lanjut',
  catatan_medis text,
  rekomendasi_dinkes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 6. TABEL BALITA INDIKASI STUNTING
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dinkes_balita_stunting (
  id text PRIMARY KEY,
  no int NOT NULL,
  nama_anak text NOT NULL,
  nik text NOT NULL,
  usia text NOT NULL,
  jenis_kelamin text NOT NULL,
  hasil_ukur text NOT NULL,
  bb_ukur text,
  posyandu text NOT NULL,
  desa text NOT NULL,
  tanggal_ukur text NOT NULL,
  status_tindak_lanjut text NOT NULL DEFAULT 'Perlu Tindak Lanjut',
  status_gizi text DEFAULT 'Pendek (Stunted)',
  intervensi_pmt text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- AKTIFKAN ROW LEVEL SECURITY (RLS) & POLICY AKSES
-- ------------------------------------------------------------------------------
ALTER TABLE public.dinkes_dashboard_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dinkes_tren_bulanan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dinkes_rekapitulasi_posyandu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dinkes_rekapitulasi_desa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dinkes_ibu_hamil_risiko ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dinkes_balita_stunting ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- summary
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read dinkes_dashboard_summary') THEN
    CREATE POLICY "Public read dinkes_dashboard_summary" ON public.dinkes_dashboard_summary FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public write dinkes_dashboard_summary') THEN
    CREATE POLICY "Public write dinkes_dashboard_summary" ON public.dinkes_dashboard_summary FOR ALL USING (true);
  END IF;

  -- tren
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read dinkes_tren_bulanan') THEN
    CREATE POLICY "Public read dinkes_tren_bulanan" ON public.dinkes_tren_bulanan FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public write dinkes_tren_bulanan') THEN
    CREATE POLICY "Public write dinkes_tren_bulanan" ON public.dinkes_tren_bulanan FOR ALL USING (true);
  END IF;

  -- rekap posyandu
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read dinkes_rekapitulasi_posyandu') THEN
    CREATE POLICY "Public read dinkes_rekapitulasi_posyandu" ON public.dinkes_rekapitulasi_posyandu FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public write dinkes_rekapitulasi_posyandu') THEN
    CREATE POLICY "Public write dinkes_rekapitulasi_posyandu" ON public.dinkes_rekapitulasi_posyandu FOR ALL USING (true);
  END IF;

  -- rekap desa
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read dinkes_rekapitulasi_desa') THEN
    CREATE POLICY "Public read dinkes_rekapitulasi_desa" ON public.dinkes_rekapitulasi_desa FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public write dinkes_rekapitulasi_desa') THEN
    CREATE POLICY "Public write dinkes_rekapitulasi_desa" ON public.dinkes_rekapitulasi_desa FOR ALL USING (true);
  END IF;

  -- ibu hamil risiko
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read dinkes_ibu_hamil_risiko') THEN
    CREATE POLICY "Public read dinkes_ibu_hamil_risiko" ON public.dinkes_ibu_hamil_risiko FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public write dinkes_ibu_hamil_risiko') THEN
    CREATE POLICY "Public write dinkes_ibu_hamil_risiko" ON public.dinkes_ibu_hamil_risiko FOR ALL USING (true);
  END IF;

  -- balita stunting
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read dinkes_balita_stunting') THEN
    CREATE POLICY "Public read dinkes_balita_stunting" ON public.dinkes_balita_stunting FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public write dinkes_balita_stunting') THEN
    CREATE POLICY "Public write dinkes_balita_stunting" ON public.dinkes_balita_stunting FOR ALL USING (true);
  END IF;
END $$;


-- ==============================================================================
-- SEED DATA AWAL (SESUAI DESAIN FIGMA RESMI DINAS KESEHATAN)
-- ==============================================================================

-- 1. SEED DASHBOARD SUMMARY
INSERT INTO public.dinkes_dashboard_summary (
  id, periode, kecamatan,
  total_posyandu, total_posyandu_target, posyandu_trend,
  total_kunjungan, kunjungan_trend,
  bayi_ditimbang, bayi_persen_sasaran, bayi_trend,
  balita_ditimbang, balita_persen_sasaran, balita_trend,
  ibu_hamil_diperiksa, ibu_hamil_persen_sasaran, ibu_hamil_trend,
  ibu_nifas, ibu_nifas_persen_sasaran, ibu_nifas_trend,
  imunisasi_lengkap_balita, imunisasi_belum_lengkap_balita,
  stunting_perlu_tindak_lanjut, stunting_sudah_ditindaklanjuti
)
VALUES (
  'summary-default', 'Oktober 2024', 'Semua Kecamatan',
  26, 28, '+4%',
  1248, '+12%',
  1036, 83, '+9%',
  892, 72, '+11%',
  168, 89, '+6%',
  72, 77, '+7%',
  638, 254,
  2, 1
)
ON CONFLICT (id) DO UPDATE SET
  total_posyandu = EXCLUDED.total_posyandu,
  total_posyandu_target = EXCLUDED.total_posyandu_target,
  total_kunjungan = EXCLUDED.total_kunjungan,
  bayi_ditimbang = EXCLUDED.bayi_ditimbang,
  balita_ditimbang = EXCLUDED.balita_ditimbang,
  ibu_hamil_diperiksa = EXCLUDED.ibu_hamil_diperiksa,
  ibu_nifas = EXCLUDED.ibu_nifas;

-- 2. SEED TREN BULANAN
INSERT INTO public.dinkes_tren_bulanan (id, tahun, urutan, bulan, total, balita, ibu_hamil, ibu_nifas) VALUES
  ('tren-01', 2024, 1, 'Jan', 280, 180, 60, 40),
  ('tren-02', 2024, 2, 'Feb', 295, 190, 65, 40),
  ('tren-03', 2024, 3, 'Mar', 310, 200, 70, 40),
  ('tren-04', 2024, 4, 'Apr', 315, 205, 70, 40),
  ('tren-05', 2024, 5, 'Mei', 325, 210, 72, 43),
  ('tren-06', 2024, 6, 'Jun', 330, 212, 75, 43),
  ('tren-07', 2024, 7, 'Jul', 335, 215, 75, 45),
  ('tren-08', 2024, 8, 'Agu', 340, 218, 74, 48),
  ('tren-09', 2024, 9, 'Sep', 345, 215, 73, 57),
  ('tren-10', 2024, 10, 'Okt', 350, 220, 72, 58),
  ('tren-11', 2024, 11, 'Nov', 355, 222, 75, 58),
  ('tren-12', 2024, 12, 'Des', 360, 225, 76, 59)
ON CONFLICT (id) DO UPDATE SET
  total = EXCLUDED.total,
  balita = EXCLUDED.balita,
  ibu_hamil = EXCLUDED.ibu_hamil,
  ibu_nifas = EXCLUDED.ibu_nifas;

-- 3. SEED REKAPITULASI POSYANDU (20 POSYANDU)
INSERT INTO public.dinkes_rekapitulasi_posyandu (id, no, nama, desa, total_kunjungan, total_pasien, total_bayi, total_balita, total_ibu_hamil, total_ibu_nifas, trend, terakhir_diperbarui) VALUES
  ('pos-01', 1, 'Manud Jaya', 'Manud Jaya', 156, 156, 156, 156, 156, 156, '↑ 12%', '30/10/2026 21:50'),
  ('pos-02', 2, 'Mawar 2', 'Sungai Raya', 124, 124, 124, 124, 124, 124, '↑ 8%', '30/10/2026 21:50'),
  ('pos-03', 3, 'Anggrek 4', 'Harapan', 144, 144, 144, 144, 144, 144, '↑ 10%', '30/10/2026 21:50'),
  ('pos-04', 4, 'Dahlia 3', 'Tanjung Sari', 137, 137, 137, 137, 137, 137, '↑ 9%', '30/10/2026 21:50'),
  ('pos-05', 5, 'Cempaka 2', 'Mulia', 130, 130, 130, 130, 130, 130, '↑ 11%', '30/10/2026 21:50'),
  ('pos-06', 6, 'Melati 1', 'Mandiri Jaya', 122, 122, 122, 122, 122, 122, '↑ 7%', '30/10/2026 21:50'),
  ('pos-07', 7, 'Kenanga 5', 'Soreang Baru', 118, 118, 118, 118, 118, 118, '↑ 6%', '30/10/2026 21:50'),
  ('pos-08', 8, 'Flamboyan 3', 'Purnama', 115, 115, 115, 115, 115, 115, '↑ 8%', '30/10/2026 21:50'),
  ('pos-09', 9, 'Kamboja 2', 'Melati', 110, 110, 110, 110, 110, 110, '↑ 5%', '30/10/2026 21:50'),
  ('pos-10', 10, 'Teratai 4', 'Sumber Makmur', 108, 108, 108, 108, 108, 108, '↑ 7%', '30/10/2026 21:50'),
  ('pos-11', 11, 'Bougenville 1', 'Manud Jaya', 98, 98, 98, 98, 98, 98, '↑ 6%', '30/10/2026 21:50'),
  ('pos-12', 12, 'Mawar 3', 'Sungai Raya', 95, 95, 95, 95, 95, 95, '↑ 4%', '30/10/2026 21:50'),
  ('pos-13', 13, 'Anggrek 2', 'Harapan', 92, 92, 92, 92, 92, 92, '↑ 8%', '30/10/2026 21:50'),
  ('pos-14', 14, 'Dahlia 1', 'Tanjung Sari', 88, 88, 88, 88, 88, 88, '↑ 5%', '30/10/2026 21:50'),
  ('pos-15', 15, 'Cempaka 1', 'Mulia', 85, 85, 85, 85, 85, 85, '↑ 7%', '30/10/2026 21:50'),
  ('pos-16', 16, 'Melati 3', 'Mandiri Jaya', 82, 82, 82, 82, 82, 82, '↑ 4%', '30/10/2026 21:50'),
  ('pos-17', 17, 'Kenanga 2', 'Soreang Baru', 78, 78, 78, 78, 78, 78, '↑ 3%', '30/10/2026 21:50'),
  ('pos-18', 18, 'Flamboyan 1', 'Purnama', 75, 75, 75, 75, 75, 75, '↑ 6%', '30/10/2026 21:50'),
  ('pos-19', 19, 'Kamboja 1', 'Melati', 72, 72, 72, 72, 72, 72, '↑ 5%', '30/10/2026 21:50'),
  ('pos-20', 20, 'Teratai 1', 'Sumber Makmur', 70, 70, 70, 70, 70, 70, '↑ 4%', '30/10/2026 21:50')
ON CONFLICT (id) DO UPDATE SET
  total_kunjungan = EXCLUDED.total_kunjungan,
  total_pasien = EXCLUDED.total_pasien,
  total_bayi = EXCLUDED.total_bayi,
  total_balita = EXCLUDED.total_balita,
  total_ibu_hamil = EXCLUDED.total_ibu_hamil,
  total_ibu_nifas = EXCLUDED.total_ibu_nifas;

-- 4. SEED REKAPITULASI DESA (10 DESA)
INSERT INTO public.dinkes_rekapitulasi_desa (id, no, desa, jumlah_posyandu, total_pasien, total_bayi, total_balita, total_ibu_hamil, total_ibu_nifas, trend, terakhir_diperbarui, kasus_stunting, ibu_risiko, cakupan_imunisasi_rendah) VALUES
  ('des-01', 1, 'Manud Jaya', 72, 156, 156, 156, 156, 156, '↑ 12%', '30/10/2026 21:50', 32, 6, 18),
  ('des-02', 2, 'Sungai Raya', 68, 124, 124, 124, 124, 124, '↑ 8%', '30/10/2026 21:50', 22, 4, 12),
  ('des-03', 3, 'Tanjung Sari', 56, 144, 144, 144, 144, 144, '↑ 10%', '30/10/2026 21:50', 16, 3, 10),
  ('des-04', 4, 'Melati', 51, 137, 137, 137, 137, 137, '↑ 9%', '30/10/2026 21:50', 6, 1, 4),
  ('des-05', 5, 'Mulia', 130, 130, 130, 130, 130, 130, '↑ 11%', '30/10/2026 21:50', 14, 2, 8),
  ('des-06', 6, 'Mandiri Jaya', 45, 122, 122, 122, 122, 122, '↑ 7%', '30/10/2026 21:50', 8, 2, 5),
  ('des-07', 7, 'Soreang Baru', 42, 118, 118, 118, 118, 118, '↑ 6%', '30/10/2026 21:50', 18, 3, 9),
  ('des-08', 8, 'Purnama', 38, 115, 115, 115, 115, 115, '↑ 8%', '30/10/2026 21:50', 5, 1, 3),
  ('des-09', 9, 'Harapan', 35, 110, 110, 110, 110, 110, '↑ 5%', '30/10/2026 21:50', 12, 2, 7),
  ('des-10', 10, 'Sumber Makmur', 30, 108, 108, 108, 108, 108, '↑ 7%', '30/10/2026 21:50', 9, 1, 4)
ON CONFLICT (id) DO UPDATE SET
  jumlah_posyandu = EXCLUDED.jumlah_posyandu,
  total_pasien = EXCLUDED.total_pasien,
  kasus_stunting = EXCLUDED.kasus_stunting,
  ibu_risiko = EXCLUDED.ibu_risiko;

-- 5. SEED IBU HAMIL BERISIKO TINGGI (18 DATA LENGKAP SESUAI FIGMA)
INSERT INTO public.dinkes_ibu_hamil_risiko (id, no, nama_ibu, nik, usia_kehamilan, hasil_pemeriksaan, posyandu, desa, tanggal_periksa, status_tindak_lanjut, catatan_medis, rekomendasi_dinkes) VALUES
  ('ih-01', 1, 'Siti Rahayu', '3275014405940001', '32 minggu', 'TD: 140/90 mmHg', 'Mandiri Jaya', 'Mandiri Jaya', '23 Okt 2026', 'Sudah Ditindaklanjuti', 'Hipertensi gestasional trimester 3', 'Pemberian antihipertensi profilaksis dan jadwal evaluasi mingguan.'),
  ('ih-02', 2, 'Nur Khasanah', '3275015507960002', '28 minggu', 'LILA: 21 cm', 'Terang Sari', 'Sungai Raya', '22 Okt 2026', 'Perlu Tindak Lanjut', 'Kurang Energi Kronis (KEK)', 'Penyaluran biskuit PMT Ibu Hamil dan pendampingan kader gizi.'),
  ('ih-03', 3, 'Rina Lestari', '3275016609980003', '24 minggu', 'Hb: 10,5 g/dL', 'Sungai Raya', 'Sungai Raya', '20 Okt 2026', 'Sudah Ditindaklanjuti', 'Anemia ringan dalam kehamilan', 'Edukasi konsumsi TTD dan makanan tinggi zat besi.'),
  ('ih-04', 4, 'Dewi Anggraini', '3275017701020004', '26 minggu', 'Usia: 17 tahun', 'Harapan', 'Harapan', '23 Okt 2026', 'Perlu Tindak Lanjut', 'Kehamilan usia remaja <20 tahun', 'KIE psikososial, nutrisi remaja, dan persiapan rujukan bersalin.'),
  ('ih-05', 5, 'Putri Amelia', '3275018803970005', '30 minggu', 'Riwayat preeklamsia sebelumnya', 'Mulia', 'Mulia', '24 Okt 2026', 'Rujuk', 'Riwayat obstetri buruk / Preeklamsia rekuren', 'Rujukan terencana ke Sp.OG RSUD Kabupaten.'),
  ('ih-06', 6, 'Siti Aminah', '3200000000000003', '28 minggu', 'TD: 135/85 mmHg, Anemia Ringan', 'Manud Jaya', 'Manud Jaya', '23 Okt 2026', 'Sudah Ditindaklanjuti', 'Borderline prehipertensi dengan anemia', 'Pemantauan tensi 2x seminggu di Posyandu.'),
  ('ih-07', 7, 'Megawati Sukma', '3275019904930007', '34 minggu', 'LILA: 22 cm, BB turun', 'Dahlia 3', 'Tanjung Sari', '21 Okt 2026', 'Perlu Tindak Lanjut', 'KEK dengan kenaikan BB tidak adekuat', 'Intervensi nutrisi protein tinggi dan kontrol USG.'),
  ('ih-08', 8, 'Hesti Wulandari', '3275011105950008', '36 minggu', 'Letak sungsang / Bokong', 'Mawar 2', 'Sungai Raya', '22 Okt 2026', 'Rujuk', 'Malpresentasi janin trimester 3 akhir', 'Rujukan ke RSUD untuk skrining versi luar / rencana SC.'),
  ('ih-09', 9, 'Tari Safitri', '3275012206920009', '18 minggu', 'GDA: 195 mg/dL', 'Cempaka 2', 'Mulia', '19 Okt 2026', 'Perlu Tindak Lanjut', 'Kecurigaan Diabetes Melitus Gestasional (DMG)', 'Pemeriksaan TTGO lanjutan di Lab Puskesmas.'),
  ('ih-10', 10, 'Ayu Kartika', '3275013307990010', '31 minggu', 'TD: 150/95 mmHg, Proteinuria +1', 'Kenanga 5', 'Soreang Baru', '24 Okt 2026', 'Rujuk', 'Preeklamsia Ringan (PER)', 'Rujukan segera ke Faskes Rujukan Tingkat Lanjut (FKRTL).'),
  ('ih-11', 11, 'Yuliana Saputri', '3275014408910011', '22 minggu', 'LILA: 20,5 cm', 'Melati 1', 'Mandiri Jaya', '20 Okt 2026', 'Perlu Tindak Lanjut', 'KEK Berat', 'Intervensi paket PMT Pemulihan 90 hari.'),
  ('ih-12', 12, 'Laila Fitriani', '3275015509930012', '27 minggu', 'Hb: 8,9 g/dL', 'Anggrek 4', 'Harapan', '22 Okt 2026', 'Rujuk', 'Anemia Sedang-Berat', 'Rujukan ke Puskesmas untuk evaluasi terapi besi parenteral.'),
  ('ih-13', 13, 'Novita Sari', '3275016610940013', '33 minggu', 'Edema tungkai bawah bilateral', 'Flamboyan 3', 'Purnama', '23 Okt 2026', 'Sudah Ditindaklanjuti', 'Retensi cairan fisiologis tanpa proteinuria', 'Edukasi elevasi kaki dan diet rendah garam.'),
  ('ih-14', 14, 'Endah Retno', '3275017711900014', '35 minggu', 'Grande Multiparitas (Hamil ke-5)', 'Kamboja 2', 'Melati', '24 Okt 2026', 'Perlu Tindak Lanjut', 'Risiko tinggi atonia uteri pasca persalinan', 'Konseling KB pasca salin dan persiapan donor darah pendamping.'),
  ('ih-15', 15, 'Dian Kusuma', '3275018812980015', '29 minggu', 'DJJ Takikardia >160x/menit', 'Teratai 4', 'Sumber Makmur', '23 Okt 2026', 'Rujuk', 'Gawat janin relatif / takikardia janin', 'Observasi ketat CTG di Puskesmas PONED.'),
  ('ih-16', 16, 'Ratna Juwita', '3275019901960016', '20 minggu', 'Riwayat Abortus Berulang 2x', 'Manud Jaya', 'Manud Jaya', '21 Okt 2026', 'Sudah Ditindaklanjuti', 'Inkompetensi serviks teratasi', 'Pemantauan istirahat tirah baring dan kontrol berkala.'),
  ('ih-17', 17, 'Kartika Dewi', '3275011102920017', '38 minggu', 'KPD (Ketuban Pecah Dini)', 'Mawar 2', 'Sungai Raya', '25 Okt 2026', 'Rujuk', 'Emergensi obstetri KPD aterm', 'Evakuasi cepat ke VK Bersalin RSUD.'),
  ('ih-18', 18, 'Indah Permata', '3275012203970018', '25 minggu', 'Pertambahan BB minim (<0.5kg/bln)', 'Bougenville 1', 'Manud Jaya', '24 Okt 2026', 'Sudah Ditindaklanjuti', 'Hambatan asupan nutrisi karena mual', 'Konsultasi diet gizi seimbang oleh Nutrisionis Puskesmas.')
ON CONFLICT (id) DO UPDATE SET
  nama_ibu = EXCLUDED.nama_ibu,
  usia_kehamilan = EXCLUDED.usia_kehamilan,
  hasil_pemeriksaan = EXCLUDED.hasil_pemeriksaan,
  status_tindak_lanjut = EXCLUDED.status_tindak_lanjut;

-- 6. SEED BALITA INDIKASI STUNTING (32 DATA LENGKAP SESUAI FIGMA)
INSERT INTO public.dinkes_balita_stunting (id, no, nama_anak, nik, usia, jenis_kelamin, hasil_ukur, bb_ukur, posyandu, desa, tanggal_ukur, status_tindak_lanjut, status_gizi, intervensi_pmt) VALUES
  ('st-01', 1, 'Ardi Pratama', '3275021102240001', '18 bulan', 'Laki-laki', 'TB: 68 cm', 'BB: 7,8 kg', 'Tanjung Sari', 'Tanjung Sari', '24 Okt 2026', 'Perlu Tindak Lanjut', 'Sangat Pendek (Severely Stunted)', 'Pemberian makanan tambahan lokal kaya protein hewani telur & ikan.'),
  ('st-02', 2, 'Aisyah Azzahra', '3275022204240002', '24 bulan', 'Perempuan', 'TB: 80 cm', 'BB: 9,1 kg', 'Sungai Raya', 'Sungai Raya', '20 Okt 2026', 'Sudah Ditindaklanjuti', 'Pendek (Stunted)', 'Monitoring kenaikan TB/U bulanan dan asupan susu formula khusus.'),
  ('st-03', 3, 'Rizki Maulana', '3275023306230003', '36 bulan', 'Laki-laki', 'TB: 85 cm', 'BB: 10,8 kg', 'Mandiri Jaya', 'Mandiri Jaya', '22 Okt 2026', 'Perlu Tindak Lanjut', 'Pendek (Stunted)', 'Skrining infeksi kronis (TBC anak) di Puskesmas.'),
  ('st-04', 4, 'Nayla Putri', '3275024408240004', '20 bulan', 'Perempuan', 'TB: 70 cm', 'BB: 7,5 kg', 'Harapan', 'Harapan', '24 Okt 2026', 'Rujuk', 'Sangat Pendek & Gizi Kurang', 'Rujukan ke Dokter Spesialis Anak (Sp.A) RSUD Kabupaten.'),
  ('st-05', 5, 'Zidan Maulana', '3275025510230005', '30 bulan', 'Laki-laki', 'TB: 84 cm', 'BB: 10,2 kg', 'Mulia', 'Mulia', '21 Okt 2026', 'Sudah Ditindaklanjuti', 'Pendek (Stunted)', 'Pendampingan kader posyandu untuk konsumsi gizi seimbang.'),
  ('st-06', 6, 'Kenzo Alfarizi', '3275026612240006', '14 bulan', 'Laki-laki', 'TB: 69 cm', 'BB: 7,6 kg', 'Manud Jaya', 'Manud Jaya', '23 Okt 2026', 'Perlu Tindak Lanjut', 'Pendek (Stunted)', 'Intervensi PMT Pemulihan biskuit balita gizi.'),
  ('st-07', 7, 'Bilqis Khumaira', '3275027702240007', '19 bulan', 'Perempuan', 'TB: 71 cm', 'BB: 7,9 kg', 'Soreang Baru', 'Soreang Baru', '22 Okt 2026', 'Perlu Tindak Lanjut', 'Pendek (Stunted)', 'Edukasi pola asuh dan sanitasi air minum keluarga.'),
  ('st-08', 8, 'Fathir Ahmad', '3275028804230008', '34 bulan', 'Laki-laki', 'TB: 83 cm', 'BB: 10,1 kg', 'Purnama', 'Purnama', '20 Okt 2026', 'Sudah Ditindaklanjuti', 'Pendek (Stunted)', 'Evaluasi grafik KMS bulanan menunjukkan kenaikan positif.'),
  ('st-09', 9, 'Mikayla Anindita', '3275029906240009', '16 bulan', 'Perempuan', 'TB: 68 cm', 'BB: 7,3 kg', 'Melati', 'Melati', '24 Okt 2026', 'Rujuk', 'Sangat Pendek (Severely Stunted)', 'Rujukan tata laksana stunting dengan red flags faskes sekunder.'),
  ('st-10', 10, 'Alvino Rayyan', '3275021108230010', '28 bulan', 'Laki-laki', 'TB: 81 cm', 'BB: 9,7 kg', 'Sumber Makmur', 'Sumber Makmur', '23 Okt 2026', 'Perlu Tindak Lanjut', 'Pendek (Stunted)', 'Suplementasi mikronutrien taburia zat besi dan seng.'),
  ('st-11', 11, 'Zahra Humaira', '3275022210240011', '12 bulan', 'Perempuan', 'TB: 65 cm', 'BB: 6,8 kg', 'Manud Jaya', 'Manud Jaya', '25 Okt 2026', 'Perlu Tindak Lanjut', 'Sangat Pendek (Severely Stunted)', 'Edukasi MP-ASI berkualitas kaya asam amino esensial.'),
  ('st-12', 12, 'Raffasya Malik', '3275023312230012', '22 bulan', 'Laki-laki', 'TB: 76 cm', 'BB: 8,8 kg', 'Sungai Raya', 'Sungai Raya', '21 Okt 2026', 'Sudah Ditindaklanjuti', 'Pendek (Stunted)', 'Terjadi kenaikan tinggi badan 1,2 cm pasca intervensi.'),
  ('st-13', 13, 'Naura Salsabila', '3275024401240013', '21 bulan', 'Perempuan', 'TB: 74 cm', 'BB: 8,3 kg', 'Harapan', 'Harapan', '22 Okt 2026', 'Perlu Tindak Lanjut', 'Pendek (Stunted)', 'Pemberian suplemen vitamin A dan obat cacing rutin.'),
  ('st-14', 14, 'Dhafin Raditya', '3275025503230014', '35 bulan', 'Laki-laki', 'TB: 84 cm', 'BB: 10,4 kg', 'Tanjung Sari', 'Tanjung Sari', '20 Okt 2026', 'Sudah Ditindaklanjuti', 'Pendek (Stunted)', 'Kondisi stabil, nafsu makan meningkat.'),
  ('st-15', 15, 'Syakila Azkadina', '3275026605240015', '17 bulan', 'Perempuan', 'TB: 69 cm', 'BB: 7,4 kg', 'Mulia', 'Mulia', '23 Okt 2026', 'Rujuk', 'Sangat Pendek & Anemia', 'Rujukan pemeriksaan Hb dan evaluasi malabsorpsi usus.'),
  ('st-16', 16, 'Hafiz Ibnu', '3275027707230016', '31 bulan', 'Laki-laki', 'TB: 82 cm', 'BB: 9,9 kg', 'Mandiri Jaya', 'Mandiri Jaya', '24 Okt 2026', 'Perlu Tindak Lanjut', 'Pendek (Stunted)', 'Pemberian paket pangan hewani bergizi kerja sama desa.'),
  ('st-17', 17, 'Alula Farzana', '3275028809240017', '15 bulan', 'Perempuan', 'TB: 67 cm', 'BB: 7,1 kg', 'Soreang Baru', 'Soreang Baru', '22 Okt 2026', 'Perlu Tindak Lanjut', 'Sangat Pendek (Severely Stunted)', 'Kunjungan rumah (home visit) kader posyandu tiap pekan.'),
  ('st-18', 18, 'Kenzie Danendra', '3275029911230018', '26 bulan', 'Laki-laki', 'TB: 79 cm', 'BB: 9,3 kg', 'Purnama', 'Purnama', '21 Okt 2026', 'Sudah Ditindaklanjuti', 'Pendek (Stunted)', 'Ibu aktif mengikuti kelas gizi balita.'),
  ('st-19', 19, 'Aqila Nadhifa', '3275021101240019', '23 bulan', 'Perempuan', 'TB: 75 cm', 'BB: 8,6 kg', 'Melati', 'Melati', '20 Okt 2026', 'Perlu Tindak Lanjut', 'Pendek (Stunted)', 'Pendampingan sanitasi jamban sehat keluarga.'),
  ('st-20', 20, 'Bima Sakti', '3275022203230020', '33 bulan', 'Laki-laki', 'TB: 83 cm', 'BB: 10,0 kg', 'Sumber Makmur', 'Sumber Makmur', '24 Okt 2026', 'Perlu Tindak Lanjut', 'Pendek (Stunted)', 'Pemberian susu tinggi energi sesuai panduan gizi puskesmas.'),
  ('st-21', 21, 'Chelsea Olivia', '3275023305240021', '19 bulan', 'Perempuan', 'TB: 72 cm', 'BB: 8,0 kg', 'Manud Jaya', 'Manud Jaya', '22 Okt 2026', 'Sudah Ditindaklanjuti', 'Pendek (Stunted)', 'Pertumbuhan mulai mendekati kurva normal hijau.'),
  ('st-22', 22, 'Gibran Rakabuming', '3275024407230022', '29 bulan', 'Laki-laki', 'TB: 81 cm', 'BB: 9,8 kg', 'Sungai Raya', 'Sungai Raya', '23 Okt 2026', 'Perlu Tindak Lanjut', 'Pendek (Stunted)', 'Pemberian makanan olahan ikan gabus dan daun kelor.'),
  ('st-23', 23, 'Khadijah Maryam', '3275025509240023', '13 bulan', 'Perempuan', 'TB: 66 cm', 'BB: 6,9 kg', 'Harapan', 'Harapan', '25 Okt 2026', 'Rujuk', 'Sangat Pendek (Severely Stunted)', 'Rujukan lanjutan curiga kelainan genetik/skeletal.'),
  ('st-24', 24, 'Faris Althaf', '3275026611230024', '25 bulan', 'Laki-laki', 'TB: 78 cm', 'BB: 9,2 kg', 'Tanjung Sari', 'Tanjung Sari', '21 Okt 2026', 'Sudah Ditindaklanjuti', 'Pendek (Stunted)', 'Monitoring berat dan tinggi badan mingguan di poskesdes.'),
  ('st-25', 25, 'Safiyya Almahyra', '3275027701240025', '21 bulan', 'Perempuan', 'TB: 74 cm', 'BB: 8,4 kg', 'Mulia', 'Mulia', '24 Okt 2026', 'Perlu Tindak Lanjut', 'Pendek (Stunted)', 'Pemberian suplemen zink 10mg selama 14 hari.'),
  ('st-26', 26, 'Reyhan Alvaro', '3275028803230026', '35 bulan', 'Laki-laki', 'TB: 84 cm', 'BB: 10,5 kg', 'Mandiri Jaya', 'Mandiri Jaya', '22 Okt 2026', 'Sudah Ditindaklanjuti', 'Pendek (Stunted)', 'Tinggi badan naik konsisten dalam 2 bulan.'),
  ('st-27', 27, 'Shanita Rahma', '3275029905240027', '18 bulan', 'Perempuan', 'TB: 70 cm', 'BB: 7,7 kg', 'Soreang Baru', 'Soreang Baru', '20 Okt 2026', 'Perlu Tindak Lanjut', 'Pendek (Stunted)', 'Edukasi pentingnya protein hewani harian untuk balita.'),
  ('st-28', 28, 'Yusuf Habibi', '3275021107230028', '27 bulan', 'Laki-laki', 'TB: 80 cm', 'BB: 9,6 kg', 'Purnama', 'Purnama', '23 Okt 2026', 'Sudah Ditindaklanjuti', 'Pendek (Stunted)', 'Intervensi nutrisi keluarga berhasil diterapkan.'),
  ('st-29', 29, 'Zivanna Letisha', '3275022209240029', '14 bulan', 'Perempuan', 'TB: 67 cm', 'BB: 7,0 kg', 'Melati', 'Melati', '24 Okt 2026', 'Perlu Tindak Lanjut', 'Sangat Pendek (Severely Stunted)', 'Intervensi formula F-75/F-100 pemulihan gizi.'),
  ('st-30', 30, 'Aditya Pratama', '3275023311230030', '32 bulan', 'Laki-laki', 'TB: 83 cm', 'BB: 10,2 kg', 'Sumber Makmur', 'Sumber Makmur', '21 Okt 2026', 'Sudah Ditindaklanjuti', 'Pendek (Stunted)', 'Keluarga menerima bantuan sembako gizi desa.'),
  ('st-31', 31, 'Talita Humaira', '3275024401240031', '22 bulan', 'Perempuan', 'TB: 75 cm', 'BB: 8,7 kg', 'Manud Jaya', 'Manud Jaya', '22 Okt 2026', 'Perlu Tindak Lanjut', 'Pendek (Stunted)', 'Pemantauan konsumsi garam beryodium dan air bersih.'),
  ('st-32', 32, 'Ibrahim Pasha', '3275025503230032', '36 bulan', 'Laki-laki', 'TB: 85 cm', 'BB: 10,9 kg', 'Sungai Raya', 'Sungai Raya', '25 Okt 2026', 'Sudah Ditindaklanjuti', 'Pendek (Stunted)', 'Perbaikan status gizi mendekati batas median.')
ON CONFLICT (id) DO UPDATE SET
  nama_anak = EXCLUDED.nama_anak,
  hasil_ukur = EXCLUDED.hasil_ukur,
  status_tindak_lanjut = EXCLUDED.status_tindak_lanjut;

-- Selesai
