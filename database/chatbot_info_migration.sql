-- =====================================================
-- MIGRASI FAQ DATA KE CHATBOT_INFO
-- =====================================================
-- Jalankan di Supabase SQL Editor
-- =====================================================

-- Hapus data lama
DELETE FROM chatbot_info;

-- Insert semua FAQ dengan format baru (information + keywords)
INSERT INTO chatbot_info (information, category, keywords) VALUES

-- =====================================================
-- KATEGORI: ACARA
-- =====================================================
('Acara Natal dilaksanakan pada **Jumat, 10 Januari 2026** pukul **09:00 - 12:30 WIB**. Gate dibuka jam 08:00.', 'acara', ARRAY['kapan', 'tanggal', 'waktu', 'hari', 'natal', 'januari']),
('Acara mulai jam **09:00** dan selesai jam **12:30 WIB** (durasi sekitar 3,5 jam). Gate dibuka jam 08:00 untuk registrasi.', 'acara', ARRAY['jam', 'mulai', 'selesai', 'durasi', 'waktu']),
('Gate dibuka jam **08:00 WIB**. Disarankan datang lebih awal untuk registrasi dan mendapat tempat duduk yang bagus!', 'acara', ARRAY['gate', 'buka', 'datang', 'awal']),
('Highlights acara: Tema Jawa Autentik dengan dekorasi wayang & batik, Khotbah Utama oleh Pdt.Dr.dr. Andre Yulius (45 menit), Musik rohani, Persekutuan lintas sekolah.', 'acara', ARRAY['acara', 'rundown', 'kegiatan', 'agenda', 'apa']),
('Tidak ada dress code khusus. Disarankan pakaian sopan dan nyaman. Boleh memakai nuansa Natal atau batik!', 'acara', ARRAY['dress', 'code', 'pakaian', 'baju', 'kostum']),
('Yang perlu dibawa: HP dengan QR Code tiket (untuk check-in), Alat tulis jika ingin mencatat, Semangat beribadah!', 'acara', ARRAY['bawa', 'persiapan', 'apa']),

-- =====================================================
-- KATEGORI: TEMA
-- =====================================================
('Tema Natal 2025: **"Padhang Ing Tengahing Peteng"** (Bahasa Jawa) yang artinya "Terang di tengah kegelapan". Diambil dari Yohanes 1:5.', 'tema', ARRAY['tema', 'natal', 'padhang', 'peteng', 'terang', 'kegelapan', 'arti']),
('**Yohanes 1:5** - "Terang itu bercahaya di dalam kegelapan dan kegelapan itu tidak menguasainya." Ini adalah ayat tema Natal kita.', 'tema', ARRAY['verse', 'ayat', 'yohanes', 'alkitab']),
('Acara ini mengusung konsep **Modern Javanese Christmas** - memadukan perayaan Natal dengan kekayaan budaya Jawa. Ada dekorasi wayang, ornamen batik, dan musik gamelan.', 'tema', ARRAY['konsep', 'jawa', 'budaya', 'tradisional', 'wayang', 'batik']),

-- =====================================================
-- KATEGORI: PEMBICARA
-- =====================================================
('Pembicara: **Pdt.Dr.dr. Andre Yulius, M.H** dari Surabaya. Beliau adalah Dosen Teologi Kesehatan, Pendeta di Gereja Sidoarjo, dan dikenal sebagai "Dokter Idola Rakyat".', 'pembicara', ARRAY['siapa', 'pembicara', 'speaker', 'pendeta', 'khotbah']),
('Pdt.Dr.dr. Andre Yulius adalah bagian dari **AMC Group** dengan komitmen pro rakyat dan pro tenaga kesehatan. Aktif dalam pendampingan fasilitas kesehatan di berbagai daerah.', 'pembicara', ARRAY['andre', 'yulius', 'dokter', 'profile', 'biodata']),
('Khotbah utama oleh Pdt. Andre Yulius berdurasi sekitar **45 menit**. Topiknya sesuai tema "Padhang Ing Tengahing Peteng".', 'pembicara', ARRAY['khotbah', 'lama', 'durasi']),
('Pdt. Andre Yulius adalah Pendeta di **Gereja Sidoarjo** dan bagian dari **AMC Group** yang fokus pada peningkatan pelayanan kesehatan.', 'pembicara', ARRAY['gereja', 'sidoarjo', 'amc', 'group']),

-- =====================================================
-- KATEGORI: PENDAFTARAN
-- =====================================================
('Cara mendaftar:\n1. Klik tombol "Daftar" di website\n2. Isi data diri (nama, email, WA, status)\n3. Bayar via QRIS **Rp 30.000**\n4. Upload bukti pembayaran\n5. Tunggu konfirmasi 1x24 jam\n6. QR Code tiket dikirim setelah verifikasi', 'pendaftaran', ARRAY['cara', 'daftar', 'registrasi', 'mendaftar', 'bagaimana', 'langkah']),
('Batas pendaftaran tiket: **29 Desember 2025** pukul 23:59 WIB. Segera daftar sebelum kehabisan!', 'pendaftaran', ARRAY['batas', 'deadline', 'tiket', 'kapan', 'tutup']),
('Data yang dibutuhkan: Nama lengkap, Email (untuk tiket QR), Nomor WhatsApp, Status (Siswa/Umum/Alumni), Asal sekolah (jika siswa).', 'pendaftaran', ARRAY['data', 'dibutuhkan', 'form', 'isi', 'apa']),
('Konfirmasi pembayaran membutuhkan waktu **maksimal 1x24 jam**. Jika lebih dari itu belum ada konfirmasi, silakan hubungi panitia via WhatsApp atau email.', 'pendaftaran', ARRAY['konfirmasi', 'status', 'sudah', 'daftar']),
('Untuk perubahan data pendaftaran, silakan hubungi panitia via email natal@smkpgri1kediri.sch.id atau telepon (0354) 682433.', 'pendaftaran', ARRAY['daftar', 'ulang', 'ganti', 'data']),
('Disarankan daftar online sebelum batas waktu 29 Des 2025. Untuk pendaftaran on the spot, silakan konfirmasi dulu ke panitia.', 'pendaftaran', ARRAY['on', 'the', 'spot', 'otomatis', 'langsung']),

-- =====================================================
-- KATEGORI: TIKET & PEMBAYARAN
-- =====================================================
('Harga tiket: **Rp 30.000** untuk semua peserta (siswa maupun umum/alumni). Pembayaran via **QRIS**.', 'tiket', ARRAY['harga', 'tiket', 'biaya', 'bayar', 'berapa', 'nominal']),
('Pembayaran melalui **QRIS** yang bisa di-scan pakai aplikasi e-wallet apapun (Dana, GoPay, OVO, ShopeePay, LinkAja, dll). Setelah bayar, screenshot bukti dan upload di form pendaftaran.', 'tiket', ARRAY['pembayaran', 'qris', 'ewallet', 'bayar', 'cara', 'transfer']),
('QR Code tiket akan dikirim via **Email** dan **WhatsApp** setelah pembayaran diverifikasi oleh panitia (maksimal 1x24 jam). Simpan QR Code untuk check-in di hari H.', 'tiket', ARRAY['qr', 'code', 'tiket', 'dapat', 'kapan', 'terima']),
('Tiket **tidak gratis**, harganya Rp 30.000 untuk semua peserta. Dana digunakan untuk operasional acara dan konsumsi.', 'tiket', ARRAY['gratis', 'free', 'bayar', 'tidak']),
('Untuk informasi refund atau pembatalan, silakan hubungi panitia langsung via email atau telepon.', 'tiket', ARRAY['refund', 'batal', 'uang', 'kembali']),
('Untuk info ketersediaan tiket terbaru, cek website atau hubungi panitia. Segera daftar sebelum kuota penuh!', 'tiket', ARRAY['kuota', 'tiket', 'habis', 'penuh']),

-- =====================================================
-- KATEGORI: LOKASI
-- =====================================================
('Lokasi: **SMK PGRI 1 Kediri**, Jl. Himalaya No.06, Sukorame, Bandar Lor, Kec. Mojoroto, Kota Kediri, Jawa Timur 64114', 'lokasi', ARRAY['dimana', 'tempat', 'lokasi', 'alamat', 'venue', 'gedung']),
('Akses lokasi: 15 menit dari Stasiun Kediri, 10 menit dari Terminal Tamanan, Tersedia area parkir luas di sekolah.', 'lokasi', ARRAY['arah', 'jalan', 'parkir', 'transport', 'akses', 'stasiun', 'terminal']),
('Bisa lihat lokasi di Google Maps dengan mencari "SMK PGRI 1 Kediri" atau klik tombol "Buka di Maps" di website bagian Lokasi.', 'lokasi', ARRAY['maps', 'google', 'lokasi', 'peta', 'link']),
('Tersedia **area parkir luas** di SMK PGRI 1 Kediri untuk motor dan mobil.', 'lokasi', ARRAY['parkir', 'motor', 'mobil', 'gratis']),

-- =====================================================
-- KATEGORI: KONTAK
-- =====================================================
('Hubungi panitia:\n📧 natal@smkpgri1kediri.sch.id\n📞 0815-5972-8766\n\nAtau DM Instagram @smkpgri1kediri', 'kontak', ARRAY['kontak', 'hubungi', 'whatsapp', 'email', 'telepon', 'panitia', 'cp']),
('Follow Instagram: **@smkpgri1kediri** untuk update info acara terbaru!', 'kontak', ARRAY['instagram', 'ig', 'sosmed', 'social', 'media']),

-- =====================================================
-- KATEGORI: SEKOLAH & PESERTA
-- =====================================================
('Sekolah partner yang ikut: SMK PGRI 2, 3, 4 Kediri, SMAN 8 Kediri, SMKN 1 Ngasem, SMK Pawyatan Daha 1 & 2, SMKN 1 Plosoklaten. Total 8 sekolah partner!', 'acara', ARRAY['sekolah', 'partner', 'peserta', 'undangan', 'daftar']),
('Tuan rumah & penyelenggara: **SMK PGRI 1 Kediri** dengan tema Modern Javanese Christmas 2025/2026.', 'acara', ARRAY['tuan', 'rumah', 'penyelenggara', 'siapa', 'panitia']),
('Yang boleh ikut: Siswa dari sekolah partner, Alumni SMK PGRI 1 Kediri, Masyarakat umum. Semua bisa mendaftar dengan harga tiket Rp 30.000!', 'pendaftaran', ARRAY['siapa', 'boleh', 'ikut', 'umum', 'alumni', 'siswa']),
('Untuk pertanyaan khusus tentang peserta (anak kecil, lansia, dll), silakan hubungi panitia untuk konfirmasi.', 'pendaftaran', ARRAY['anak', 'kecil', 'balita', 'boleh', 'ikut']),

-- =====================================================
-- KATEGORI: SPONSOR
-- =====================================================
('Sponsor acara: SMK PGRI 1 Kediri (Tuan Rumah), Shining Salt Fellowship, Feloria, Kediri Technopark. Terima kasih kepada seluruh sponsor!', 'acara', ARRAY['sponsor', 'siapa', 'mendukung', 'dukungan']),

-- =====================================================
-- KATEGORI: WEBSITE & TEKNIS
-- =====================================================
('Fitur website: Info acara lengkap, Profil pembicara, Countdown ke hari H, Pendaftaran online, Lokasi dengan maps, Daftar sekolah partner.', 'lainnya', ARRAY['website', 'fitur', 'ada', 'apa', 'halaman']),
('Ada 2 countdown di website: 1. Countdown Tiket - batas pendaftaran 29 Des 2025, 2. Countdown Acara - menuju 10 Jan 2026. Jangan sampai terlewat!', 'lainnya', ARRAY['countdown', 'timer', 'hitung', 'mundur']),
('Jika ada masalah teknis dengan website, coba refresh halaman atau buka di browser lain. Jika tetap bermasalah, hubungi panitia.', 'lainnya', ARRAY['error', 'website', 'tidak', 'bisa', 'akses', 'masalah']);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Berhasil migrasi 40+ FAQ ke chatbot_info!';
  RAISE NOTICE '📋 Categories: acara, tema, pembicara, pendaftaran, tiket, lokasi, kontak, lainnya';
  RAISE NOTICE '⚡ Selanjutnya jalankan: curl -X POST localhost:3000/api/seed-embeddings-info';
END $$;
