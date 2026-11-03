-- =====================================================================
-- Migration: Supabase Storage Bucket untuk Dokumen Pendukung KIA
-- Bucket: dokumen-kia
-- Digunakan untuk: Upload berkas riil USG, Laboratorium, dan Dokumen Medis
-- =====================================================================

-- 1. Buat bucket baru bernama 'dokumen-kia' yang bersifat Public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dokumen-kia', 
  'dokumen-kia', 
  true, 
  10485760, -- Maksimal 10 MB per file
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Kebijakan akses (RLS Policy): Siapa saja boleh melihat/mengunduh (SELECT)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Read Dokumen KIA'
  ) THEN
    CREATE POLICY "Public Read Dokumen KIA" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'dokumen-kia');
  END IF;
END $$;

-- 3. Kebijakan upload: Pengguna terautentikasi (Bidan/Kader/Staff) boleh mengunggah (INSERT)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated Upload Dokumen KIA'
  ) THEN
    CREATE POLICY "Authenticated Upload Dokumen KIA" 
    ON storage.objects FOR INSERT 
    WITH CHECK (
      bucket_id = 'dokumen-kia' 
      AND auth.role() = 'authenticated'
    );
  END IF;
END $$;
