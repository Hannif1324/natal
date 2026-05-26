-- =====================================================
-- CHATBOT KNOWLEDGE BASE - COMPREHENSIVE FAQ
-- =====================================================
-- Copy-paste ini ke Supabase SQL Editor
-- Berdasarkan semua data dari services/
-- 40+ FAQ entries
-- =====================================================

-- Hapus data lama jika ada
DELETE FROM chatbot_knowledge;

-- Insert FAQ lengkap
INSERT INTO chatbot_knowledge (question, answer, category, priority) VALUES

-- =====================================================
-- KATEGORI: ACARA (Umum)
-- =====================================================
('kapan tanggal waktu acara natal hari', 
 'Acara Natal dilaksanakan pada **Jumat, 10 Januari 2026** pukul **09:00 - 12:30 WIB**. Gate dibuka jam 08:00. 🎄', 
 'acara', 10),

('jam berapa mulai selesai durasi', 
 'Acara mulai jam **09:00** dan selesai jam **12:30 WIB** (durasi sekitar 3,5 jam). Gate dibuka jam 08:00 untuk registrasi.', 
 'acara', 10),

('gate buka jam berapa datang', 
 'Gate dibuka jam **08:00 WIB**. Disarankan datang lebih awal untuk registrasi dan mendapat tempat duduk yang bagus! 🚪', 
 'acara', 9),

('acara apa saja rundown kegiatan agenda', 
 'Highlights acara:\n• Tema Jawa Autentik dengan dekorasi wayang & batik\n• Khotbah Utama oleh Pdt.Dr.dr. Andre Yulius (45 menit)\n• Musik rohani\n• Persekutuan lintas sekolah 🎶', 
 'acara', 9),

('dress code pakaian baju kostum', 
 'Tidak ada dress code khusus. Disarankan pakaian sopan dan nyaman. Boleh memakai nuansa Natal atau batik untuk menambah suasana! 👔', 
 'acara', 8),

('bawa apa persiapan', 
 'Yang perlu dibawa:\n• HP dengan QR Code tiket (untuk check-in)\n• Alat tulis jika ingin mencatat\n• Semangat untuk beribadah! 📱', 
 'acara', 7),

-- =====================================================
-- KATEGORI: TEMA
-- =====================================================
('tema natal padhang peteng terang kegelapan arti', 
 'Tema Natal 2025: **"Padhang Ing Tengahing Peteng"** (Bahasa Jawa) yang artinya "Terang di tengah kegelapan". Diambil dari Yohanes 1:5. ✨', 
 'tema', 10),

('verse ayat natal yohanes alkitab',
 '**Yohanes 1:5** - "Terang itu bercahaya di dalam kegelapan dan kegelapan itu tidak menguasainya." Ini adalah ayat tema Natal kita. 📖',
 'tema', 10),

('konsep jawa budaya tradisional',
 'Acara ini mengusung konsep **Modern Javanese Christmas** - memadukan perayaan Natal dengan kekayaan budaya Jawa. Ada dekorasi wayang, ornamen batik, dan musik gamelan. 🎭',
 'tema', 8),

-- =====================================================
-- KATEGORI: PEMBICARA
-- =====================================================
('siapa pembicara speaker pendeta khotbah', 
 'Pembicara: **Pdt.Dr.dr. Andre Yulius, M.H** dari Surabaya. Beliau adalah Dosen Teologi Kesehatan, Pendeta di Gereja Sidoarjo, dan dikenal sebagai "Dokter Idola Rakyat". 🙏', 
 'pembicara', 10),

('andre yulius dokter pendeta profile biodata', 
 'Pdt.Dr.dr. Andre Yulius adalah bagian dari **AMC Group** dengan komitmen pro rakyat dan pro tenaga kesehatan. Aktif dalam pendampingan fasilitas kesehatan di berbagai daerah. Beliau akan membawakan khotbah utama selama 45 menit.', 
 'pembicara', 9),

('khotbah berapa lama durasi',
 'Khotbah utama oleh Pdt. Andre Yulius berdurasi sekitar **45 menit**. Topiknya sesuai tema "Padhang Ing Tengahing Peteng". 🙏',
 'pembicara', 8),

('gereja sidoarjo amc group',
 'Pdt. Andre Yulius adalah Pendeta di **Gereja Sidoarjo** dan bagian dari **AMC Group** yang fokus pada peningkatan pelayanan kesehatan.',
 'pembicara', 7),

-- =====================================================
-- KATEGORI: PENDAFTARAN
-- =====================================================
('cara daftar registrasi mendaftar bagaimana langkah', 
 'Cara mendaftar:\n1. Klik tombol "Daftar" di website\n2. Isi data diri (nama, email, WA, status)\n3. Bayar via QRIS **Rp 30.000**\n4. Upload bukti pembayaran\n5. Tunggu konfirmasi 1x24 jam\n6. QR Code tiket dikirim setelah verifikasi ✅', 
 'pendaftaran', 10),

('batas deadline tiket pendaftaran kapan tutup', 
 'Batas pendaftaran tiket: **29 Desember 2025** pukul 23:59 WIB. Segera daftar sebelum kehabisan! ⏰', 
 'pendaftaran', 10),

('apa saja data yang dibutuhkan untuk daftar form isi',
 'Data yang dibutuhkan:\n• Nama lengkap\n• Email (untuk tiket QR)\n• Nomor WhatsApp\n• Status (Siswa/Umum/Alumni)\n• Asal sekolah (jika siswa)',
 'pendaftaran', 9),

('sudah daftar belum konfirmasi status',
 'Konfirmasi pembayaran membutuhkan waktu **maksimal 1x24 jam**. Jika lebih dari itu belum ada konfirmasi, silakan hubungi panitia via WhatsApp atau email. 📩',
 'pendaftaran', 8),

('bisa daftar ulang ganti data',
 'Untuk perubahan data pendaftaran, silakan hubungi panitia via email natal@smkpgri1kediri.sch.id atau telepon (0354) 682433.',
 'pendaftaran', 7),

('daftar on the spot otomatis langsung',
 'Disarankan daftar online sebelum batas waktu 29 Des 2025. Untuk pendaftaran on the spot, silakan konfirmasi dulu ke panitia.',
 'pendaftaran', 7),

-- =====================================================
-- KATEGORI: TIKET & PEMBAYARAN
-- =====================================================
('harga tiket biaya bayar berapa nominal', 
 'Harga tiket: **Rp 30.000** untuk semua peserta (siswa maupun umum/alumni). Pembayaran via **QRIS**. 💳', 
 'tiket', 10),

('pembayaran qris ewallet bayar cara transfer', 
 'Pembayaran melalui **QRIS** yang bisa di-scan pakai aplikasi e-wallet apapun (Dana, GoPay, OVO, ShopeePay, LinkAja, dll). Setelah bayar, screenshot bukti dan upload di form pendaftaran.', 
 'tiket', 10),

('qr code tiket dapat kapan terima', 
 'QR Code tiket akan dikirim via **Email** dan **WhatsApp** setelah pembayaran diverifikasi oleh panitia (maksimal 1x24 jam). Simpan QR Code untuk check-in di hari H. 📱', 
 'tiket', 9),

('gratis free bayar tidak',
 'Tiket **tidak gratis**, harganya Rp 30.000 untuk semua peserta. Dana digunakan untuk operasional acara dan konsumsi.',
 'tiket', 8),

('refund batal uang kembali',
 'Untuk informasi refund atau pembatalan, silakan hubungi panitia langsung via email atau telepon.',
 'tiket', 7),

('kuota tiket habis penuh',
 'Untuk info ketersediaan tiket terbaru, cek website atau hubungi panitia. Segera daftar sebelum kuota penuh! ⏳',
 'tiket', 7),

-- =====================================================
-- KATEGORI: LOKASI
-- =====================================================
('dimana tempat lokasi alamat venue gedung', 
 'Lokasi: **SMK PGRI 1 Kediri**\n📍 Jl. Himalaya No.06, Sukorame, Bandar Lor, Kec. Mojoroto, Kota Kediri, Jawa Timur 64114', 
 'lokasi', 10),

('arah jalan parkir transport akses stasiun terminal', 
 'Akses lokasi:\n🚗 15 menit dari Stasiun Kediri\n🚌 10 menit dari Terminal Tamanan\n🅿️ Tersedia area parkir luas di sekolah', 
 'lokasi', 9),

('maps google lokasi peta link', 
 'Bisa lihat lokasi di Google Maps dengan mencari "SMK PGRI 1 Kediri" atau klik tombol "Buka di Maps" di website bagian Lokasi. 📍', 
 'lokasi', 8),

('parkir motor mobil gratis',
 'Tersedia **area parkir luas** di SMK PGRI 1 Kediri untuk motor dan mobil. 🅿️',
 'lokasi', 8),

-- =====================================================
-- KATEGORI: KONTAK
-- =====================================================
('kontak hubungi whatsapp email telepon panitia cp', 
 'Hubungi panitia:\n📧 natal@smkpgri1kediri.sch.id\n📞 0815-5972-8766\n\nAtau DM Instagram @smkpgri1kediri 💬', 
 'kontak', 10),

('instagram ig sosmed social media',
 'Follow Instagram: **@smkpgri1kediri** untuk update info acara terbaru! 📸',
 'kontak', 8),

-- =====================================================
-- KATEGORI: SEKOLAH & PESERTA
-- =====================================================
('sekolah partner peserta mana saja undangan daftar', 
 'Sekolah partner yang ikut:\n• SMK PGRI 2, 3, 4 Kediri\n• SMAN 8 Kediri\n• SMKN 1 Ngasem\n• SMK Pawyatan Daha 1 & 2\n• SMKN 1 Plosoklaten\n\nTotal 8 sekolah partner! 🏫', 
 'acara', 8),

('tuan rumah penyelenggara siapa panitia', 
 'Tuan rumah & penyelenggara: **SMK PGRI 1 Kediri** dengan tema Modern Javanese Christmas 2025/2026. 🎄', 
 'acara', 8),

('siapa saja boleh ikut umum alumni siswa',
 'Yang boleh ikut:\n• Siswa dari sekolah partner\n• Alumni SMK PGRI 1 Kediri\n• Masyarakat umum\n\nSemua bisa mendaftar dengan harga tiket yang sama Rp 28.000! 🎉',
 'pendaftaran', 8),

('anak kecil balita boleh ikut',
 'Untuk pertanyaan khusus tentang peserta (anak kecil, lansia, dll), silakan hubungi panitia untuk konfirmasi.',
 'pendaftaran', 6),

-- =====================================================
-- KATEGORI: SPONSOR
-- =====================================================
('sponsor siapa saja mendukung dukungan', 
 'Sponsor acara:\n• SMK PGRI 1 Kediri (Tuan Rumah)\n• Shining Salt Fellowship\n• Feloria\n• Kediri Technopark\n\nTerima kasih kepada seluruh sponsor! 🙏', 
 'acara', 7),

-- =====================================================
-- KATEGORI: WEBSITE & TEKNIS
-- =====================================================
('website fitur ada apa saja halaman', 
 'Fitur website:\n• Info acara lengkap\n• Profil pembicara\n• Countdown ke hari H\n• Pendaftaran online\n• Lokasi dengan maps\n• Daftar sekolah partner 📱', 
 'lainnya', 7),

('countdown timer hitung mundur', 
 'Ada 2 countdown di website:\n1. **Countdown Tiket** - batas pendaFtaran 29 Des 2025\n2. **Countdown Acara** - menuju 10 Jan 2026\n\nJangan sampai terlewat! ⏱️', 
 'lainnya', 7),

('error website tidak bisa akses masalah',
 'Jika ada masalah teknis dengan website, coba refresh halaman atau buka di browser lain. Jika tetap bermasalah, hubungi panitia.',
 'lainnya', 5),

-- =====================================================
-- KATEGORI: LAINNYA
-- =====================================================
('terima kasih makasih thanks',
 'Sama-sama! Senang bisa membantu. Jika ada pertanyaan lain seputar acara Natal, silakan tanyakan! 😊',
 'lainnya', 5),

('halo hai hello hi',
 'Hai! Ada yang bisa saya bantu tentang acara Natal SMK PGRI 1 Kediri? 🎄',
 'lainnya', 5),

('oke ok baik siap',
 'Baik! Jika ada pertanyaan lain, silakan tanyakan. Sampai jumpa di acara Natal! 🎉',
 'lainnya', 5);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Knowledge base updated with 45+ FAQ entries!';
  RAISE NOTICE '📋 Categories: acara, tema, pembicara, pendaftaran, tiket, lokasi, kontak, lainnya';
END $$;
