-- =====================================================
-- TICKET CONFIGURATION TABLE
-- =====================================================
-- Run this SQL in Supabase SQL Editor
-- Table untuk menyimpan konfigurasi tiket yang bisa diubah admin
-- =====================================================

-- Create table
CREATE TABLE IF NOT EXISTS ticket_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Payment Configuration
  price_amount INTEGER NOT NULL DEFAULT 30000,
  price_label TEXT DEFAULT 'Tiket Masuk',
  qris_image TEXT DEFAULT '/assets/QRIS/8745127845812471_QRIS 1.webp',
  
  -- Form Configuration  
  form_title TEXT DEFAULT 'Pendaftaran Peserta',
  form_subtitle TEXT DEFAULT 'Isi data diri Anda untuk mendaftar acara Natal Gabungan 2025',
  
  -- Success Message
  success_title TEXT DEFAULT 'Pendaftaran Berhasil!',
  success_subtitle TEXT DEFAULT 'Terima kasih telah mendaftar acara Natal Gabungan 2025',
  success_message TEXT DEFAULT 'Data pendaftaran Anda telah kami terima. Silakan tunggu konfirmasi melalui WhatsApp dan Email dalam waktu 1x24 jam.',
  
  -- Contact Info
  contact_whatsapp TEXT DEFAULT '6281234567890',
  contact_email TEXT DEFAULT 'natal@smkpgri1kediri.sch.id',
  
  -- Payment Instructions (JSON array of strings)
  payment_instructions JSONB DEFAULT '["Buka aplikasi e-wallet (Dana, GoPay, OVO, ShopeePay, dll)", "Pilih menu Scan/Bayar", "Scan QRIS di atas atau masukkan nominal pembayaran", "Masukkan jumlah pembayaran sesuai ketentuan", "Konfirmasi dan selesaikan pembayaran", "Screenshot bukti pembayaran", "Upload bukti pembayaran di form berikutnya"]'::jsonb,
  
  -- Success Instructions (JSON array of strings)
  success_instructions JSONB DEFAULT '["Cek email Anda secara berkala", "Simpan nomor panitia untuk komunikasi", "QR Code tiket akan dikirim setelah pembayaran diverifikasi", "Screenshot QR Code untuk check-in di hari H"]'::jsonb,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ticket_config_is_active ON ticket_config(is_active);

-- Enable RLS
ALTER TABLE ticket_config ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - Admin Only CRUD
-- =====================================================
-- Public bisa READ, tapi hanya authenticated users (admin) yang bisa INSERT/UPDATE/DELETE

-- Policy: Allow public read (untuk landing page)
DROP POLICY IF EXISTS "Allow public read ticket_config" ON ticket_config;
CREATE POLICY "Allow public read ticket_config" ON ticket_config
  FOR SELECT USING (true);

-- Policy: Only authenticated users can INSERT
DROP POLICY IF EXISTS "Allow authenticated insert ticket_config" ON ticket_config;
CREATE POLICY "Allow authenticated insert ticket_config" ON ticket_config
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can UPDATE
DROP POLICY IF EXISTS "Allow authenticated update ticket_config" ON ticket_config;
CREATE POLICY "Allow authenticated update ticket_config" ON ticket_config
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Only authenticated users can DELETE
DROP POLICY IF EXISTS "Allow authenticated delete ticket_config" ON ticket_config;
CREATE POLICY "Allow authenticated delete ticket_config" ON ticket_config
  FOR DELETE 
  TO authenticated
  USING (true);

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_ticket_config_updated_at ON ticket_config;
CREATE TRIGGER update_ticket_config_updated_at
  BEFORE UPDATE ON ticket_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default config
INSERT INTO ticket_config (
  price_amount,
  price_label,
  form_title,
  form_subtitle,
  is_active
) VALUES (
  30000,
  'Tiket Masuk',
  'Pendaftaran Peserta',
  'Isi data diri Anda untuk mendaftar acara Natal Gabungan 2025',
  true
) ON CONFLICT DO NOTHING;

-- =====================================================
-- STORAGE BUCKET: qris-images
-- =====================================================
-- CATATAN: Bucket dan policies harus dibuat manual di Dashboard
-- atau jalankan storage_qris_policies.sql SETELAH bucket dibuat

-- Langkah:
-- 1. Supabase Dashboard -> Storage -> New Bucket
-- 2. Name: qris-images, Public: No
-- 3. Jalankan file: database/storage_qris_policies.sql

-- Alternatif: Gunakan SQL berikut di SQL Editor setelah bucket dibuat:
/*
-- Allow public to view QRIS images
CREATE POLICY "Public can view qris images"
ON storage.objects FOR SELECT
USING (bucket_id = 'qris-images');

-- Only authenticated users can upload QRIS images
CREATE POLICY "Authenticated users can upload qris images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'qris-images');

-- Only authenticated users can update QRIS images
CREATE POLICY "Authenticated users can update qris images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'qris-images');

-- Only authenticated users can delete QRIS images
CREATE POLICY "Authenticated users can delete qris images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'qris-images');
*/
DO $$
BEGIN
  RAISE NOTICE '✅ Ticket config table created successfully!';
  RAISE NOTICE '📋 Default config inserted with price Rp 30.000';
END $$;
