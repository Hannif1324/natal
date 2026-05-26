-- =====================================================
-- CHATBOT KNOWLEDGE BASE - SAFE MIGRATION
-- =====================================================
-- File ini AMAN dijalankan - tidak akan menghapus tabel lain
-- Hanya membuat tabel chatbot_knowledge baru
-- =====================================================

-- Cek dan buat tabel jika belum ada
CREATE TABLE IF NOT EXISTS chatbot_knowledge (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,                        -- Kata kunci / pertanyaan (untuk matching)
  answer TEXT NOT NULL,                          -- Jawaban yang sudah disiapkan
  category TEXT NOT NULL CHECK (category IN ('acara', 'pendaftaran', 'tiket', 'lokasi', 'pembicara', 'tema', 'kontak', 'lainnya')),
  priority INTEGER DEFAULT 0,                    -- Higher priority = checked first
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk pencarian cepat (IF NOT EXISTS tidak ada di PostgreSQL, jadi pakai DO block)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_chatbot_knowledge_category') THEN
    CREATE INDEX idx_chatbot_knowledge_category ON chatbot_knowledge(category);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_chatbot_knowledge_active') THEN
    CREATE INDEX idx_chatbot_knowledge_active ON chatbot_knowledge(is_active);
  END IF;
END $$;

-- Trigger untuk auto-update updated_at (gunakan fungsi yang sudah ada)
DROP TRIGGER IF EXISTS update_chatbot_knowledge_updated_at ON chatbot_knowledge;
CREATE TRIGGER update_chatbot_knowledge_updated_at
  BEFORE UPDATE ON chatbot_knowledge
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE chatbot_knowledge ENABLE ROW LEVEL SECURITY;

-- Drop existing policies jika ada (untuk re-run yang aman)
DROP POLICY IF EXISTS "Allow anonymous select chatbot_knowledge" ON chatbot_knowledge;
DROP POLICY IF EXISTS "Allow authenticated manage chatbot_knowledge" ON chatbot_knowledge;

-- Policy: Allow anonymous select (untuk chatbot baca data)
CREATE POLICY "Allow anonymous select chatbot_knowledge" ON chatbot_knowledge
  FOR SELECT USING (is_active = TRUE);

-- Policy: Allow authenticated insert/update/delete (admin only)  
CREATE POLICY "Allow authenticated manage chatbot_knowledge" ON chatbot_knowledge
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- SAMPLE DATA (hanya insert jika tabel kosong)
-- =====================================================
INSERT INTO chatbot_knowledge (question, answer, category, priority)
SELECT * FROM (VALUES
  ('kapan tanggal waktu acara natal', 
   'Acara Natal SMK PGRI 1 Kediri akan dilaksanakan pada **Jumat, 10 Januari 2026** pukul **09:00 - 12:30 WIB**. Gate dibuka jam 08:00. 🎄', 
   'acara', 10),

  ('cara daftar registrasi mendaftar', 
   E'Cara mendaftar:\n1. Klik tombol "Daftar" di website\n2. Isi data diri (nama, email, WA, status)\n3. Lakukan pembayaran via QRIS Rp 28.000\n4. Upload bukti pembayaran\n5. Tunggu konfirmasi via WA/Email 1x24 jam\n6. QR Code tiket akan dikirim setelah pembayaran diverifikasi ✅', 
   'pendaftaran', 10),

  ('harga tiket biaya bayar pembayaran qris', 
   E'Harga tiket: **Rp 28.000** untuk semua peserta (siswa maupun umum/alumni).\n\nPembayaran via **QRIS** - bisa pakai Dana, GoPay, OVO, ShopeePay, dll. 💳', 
   'tiket', 10),

  ('dimana tempat lokasi alamat venue', 
   E'Lokasi: **SMK PGRI 1 Kediri**\n📍 Jl. Himalaya No.06, Sukorame, Bandar Lor, Kec. Mojoroto, Kota Kediri, Jawa Timur 64114\n\n🚗 15 menit dari Stasiun Kediri\n🚌 10 menit dari Terminal Tamanan\n🅿️ Tersedia area parkir luas', 
   'lokasi', 10),

  ('siapa pembicara speaker pendeta', 
   'Pembicara: **Pendeta senior dari Surabaya** yang akan menyampaikan khotbah bermakna tentang tema "Padhang Ing Tengahing Peteng" - bagaimana kita bisa menjadi terang di tengah kegelapan. 🙏', 
   'pembicara', 10),

  ('tema padhang peteng terang kegelapan', 
   E'Tema Natal 2025: **"Padhang Ing Tengahing Peteng"** (Bahasa Jawa)\n\nArtinya: Menjadi terang di tengah kegelapan ✨\n\nAcara ini memadukan perayaan Natal dengan kekayaan budaya Jawa - ornamen wayang, musik gamelan, dan dekorasi batik.', 
   'tema', 10),

  ('kontak hubungi whatsapp email telepon', 
   E'Ada pertanyaan? Hubungi kami:\n📧 Email: natal@smkpgri1kediri.sch.id\n📞 Telepon: (0354) 682433\n\nAtau langsung DM Instagram @smkpgri1kediri 💬', 
   'kontak', 10)
) AS v(question, answer, category, priority)
WHERE NOT EXISTS (SELECT 1 FROM chatbot_knowledge LIMIT 1);

-- =====================================================
-- SUCCESS
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ chatbot_knowledge table created/updated safely!';
  RAISE NOTICE '🔐 RLS policies configured';
  RAISE NOTICE '🤖 Sample FAQ data inserted (if table was empty)';
END $$;
