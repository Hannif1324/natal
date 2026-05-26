-- =====================================================
-- CHATBOT INFO TABLE (Knowledge Base Style)
-- =====================================================
-- Tanpa kolom 'question', hanya 'information'
-- Untuk semantic search berbasis konten
-- =====================================================

-- Create table
CREATE TABLE IF NOT EXISTS chatbot_info (
  id SERIAL PRIMARY KEY,
  information TEXT NOT NULL,                     -- Konten informasi (bukan Q&A)
  category TEXT NOT NULL CHECK (category IN ('acara', 'pendaftaran', 'tiket', 'lokasi', 'pembicara', 'tema', 'kontak', 'lainnya')),
  keywords TEXT[],                               -- Array of keywords untuk fallback search
  priority INTEGER DEFAULT 0,                    -- Higher priority = checked first
  is_active BOOLEAN DEFAULT TRUE,
  embedding vector(768),                         -- Vector embedding untuk semantic search
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_info_category ON chatbot_info(category);
CREATE INDEX IF NOT EXISTS idx_chatbot_info_active ON chatbot_info(is_active);
CREATE INDEX IF NOT EXISTS idx_chatbot_info_keywords ON chatbot_info USING GIN(keywords);

-- Create HNSW index for fast vector similarity search
CREATE INDEX IF NOT EXISTS idx_chatbot_info_embedding ON chatbot_info 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_chatbot_info_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_chatbot_info ON chatbot_info;
CREATE TRIGGER trigger_update_chatbot_info
  BEFORE UPDATE ON chatbot_info
  FOR EACH ROW
  EXECUTE FUNCTION update_chatbot_info_timestamp();

-- =====================================================
-- MATCH FUNCTION FOR VECTOR SEARCH
-- =====================================================
CREATE OR REPLACE FUNCTION match_info(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 3
)
RETURNS TABLE (
  id int,
  information text,
  category text,
  keywords text[],
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ci.id,
    ci.information,
    ci.category,
    ci.keywords,
    1 - (ci.embedding <=> query_embedding) AS similarity
  FROM chatbot_info ci
  WHERE ci.is_active = TRUE
    AND ci.embedding IS NOT NULL
    AND 1 - (ci.embedding <=> query_embedding) > match_threshold
  ORDER BY ci.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Grant permissions
GRANT SELECT ON chatbot_info TO anon;
GRANT SELECT ON chatbot_info TO authenticated;
GRANT EXECUTE ON FUNCTION match_info(vector(768), float, int) TO anon;
GRANT EXECUTE ON FUNCTION match_info(vector(768), float, int) TO authenticated;

-- Enable RLS
ALTER TABLE chatbot_info ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public read
CREATE POLICY "Allow public read chatbot_info" ON chatbot_info
  FOR SELECT USING (is_active = TRUE);

-- =====================================================
-- SAMPLE DATA
-- =====================================================
INSERT INTO chatbot_info (information, category, keywords) VALUES
-- Informasi Acara
('Nama acara adalah **Natal Gabungan** dengan tema "Padhang Ing Tengahing Peteng" yang berarti menjadi terang di tengah kegelapan.', 'acara', ARRAY['nama', 'acara', 'natal', 'tema']),
('Acara Natal Gabungan dilaksanakan pada **Jumat, 10 Januari 2026**.', 'acara', ARRAY['tanggal', 'kapan', 'hari', 'waktu']),
('Acara dimulai jam **09:00 WIB** dan selesai sekitar jam **12:30 WIB** (durasi sekitar 3,5 jam). Gate dibuka jam **08:00 WIB** untuk registrasi.', 'acara', ARRAY['jam', 'mulai', 'selesai', 'durasi', 'waktu']),
('Acara dilaksanakan di **SMK PGRI 1 Kediri**, Jl. Himalaya No.06, Sukorame, Bandar Lor, Kec. Mojoroto, Kota Kediri, Jawa Timur 64114.', 'lokasi', ARRAY['lokasi', 'tempat', 'alamat', 'dimana']),
('Tema acara adalah "**Padhang Ing Tengahing Peteng**" dari Yohanes 1:5, yang berarti terang bercahaya di dalam kegelapan.', 'tema', ARRAY['tema', 'makna', 'arti']),

-- Informasi Pendaftaran
('Untuk mendaftar, klik tombol **Daftar** di website atau buka halaman /daftar. Isi data diri (nama, email, WhatsApp, status, asal sekolah jika siswa).', 'pendaftaran', ARRAY['daftar', 'registrasi', 'cara', 'gimana']),
('Harga tiket **Rp 30.000** untuk semua peserta (siswa maupun umum).', 'tiket', ARRAY['harga', 'tiket', 'biaya', 'bayar', 'berapa']),
('Pembayaran dilakukan melalui **QRIS**. Setelah bayar, upload bukti pembayaran dan tunggu konfirmasi maksimal 1x24 jam.', 'tiket', ARRAY['bayar', 'qris', 'pembayaran', 'transfer']),
('Setelah pembayaran diverifikasi, QR Code tiket akan dikirim ke email dan WhatsApp yang didaftarkan.', 'tiket', ARRAY['qr', 'tiket', 'konfirmasi']),
('Pendaftaran dibuka sampai **29 Desember 2025** atau sampai kuota terpenuhi.', 'pendaftaran', ARRAY['deadline', 'batas', 'sampai', 'kuota']),

-- Informasi Pembicara
('Pembicara acara adalah **Pdt.Didr. Andre Yulius, M.Pd** dari Surabaya. Beliau adalah pendeta dan doktor di bidang pendidikan.', 'pembicara', ARRAY['pembicara', 'speaker', 'siapa', 'pendeta']),
('Khotbah berlangsung sekitar **1-1,5 jam** dan membahas tema "Padhang Ing Tengahing Peteng".', 'pembicara', ARRAY['khotbah', 'durasi', 'lama']),

-- Informasi Kontak
('Untuk pertanyaan lebih lanjut, hubungi panitia via WhatsApp di **+62 858-0075-3804** atau email ke **natallgabungan@gmail.com**.', 'kontak', ARRAY['kontak', 'hubungi', 'whatsapp', 'email', 'tanya']),
('Follow Instagram resmi acara di **@smkpgri1kediri** untuk update terbaru.', 'kontak', ARRAY['instagram', 'ig', 'sosmed', 'social']),

-- Informasi Lainnya
('Tidak ada dress code khusus. Disarankan berpakaian rapi dan sopan.', 'lainnya', ARRAY['dress', 'code', 'pakaian', 'baju']),
('Ya, tersedia area parkir luas di SMK PGRI 1 Kediri untuk motor dan mobil secara gratis.', 'lokasi', ARRAY['parkir', 'motor', 'mobil']),
('Tiket tidak gratis, harganya Rp 30.000 untuk semua peserta.', 'tiket', ARRAY['gratis', 'free', 'bayar']),
('Jika ada masalah teknis dengan website, coba refresh halaman atau buka di browser lain. Jika tetap bermasalah, hubungi panitia.', 'lainnya', ARRAY['error', 'website', 'masalah', 'problem']);

-- =====================================================
-- NOTES
-- =====================================================
-- Setelah insert data, jalankan seed-embeddings API untuk generate embeddings
-- POST /api/seed-embeddings-info
