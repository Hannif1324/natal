// =====================================================
// TICKETING DATA SERVICE
// =====================================================
// Data untuk Form Pendaftaran/Ticketing
// Menggunakan Supabase sebagai sumber data utama
// Fallback ke data lokal jika Supabase tidak tersedia
// =====================================================

import { supabase } from '@/lib/supabase'

// =====================================================
// SUPABASE CRUD FUNCTIONS
// =====================================================

/**
 * Fetch ticket config dari Supabase
 * @returns {Promise<Object>} - Ticket config data atau default fallback
 */
export async function getTicketConfig() {
    try {
        if (!supabase) {
            console.warn('Supabase client not available, using default config')
            return ticketingData
        }

        const { data, error } = await supabase
            .from('ticket_config')
            .select('*')
            .eq('is_active', true)
            .single()

        if (error || !data) {
            console.warn('Failed to fetch ticket config, using default:', error?.message)
            return ticketingData
        }

        // Map Supabase data ke format ticketingData
        return mapConfigToTicketingData(data)
    } catch (err) {
        console.error('Error fetching ticket config:', err)
        return ticketingData
    }
}

/**
 * Fetch raw ticket config dari Supabase (untuk admin)
 * @returns {Promise<Object>} - Raw config data dari database
 */
export async function getTicketConfigRaw() {
    try {
        if (!supabase) return null

        const { data, error } = await supabase
            .from('ticket_config')
            .select('*')
            .eq('is_active', true)
            .maybeSingle()

        if (error) {
            console.error('Error fetching raw ticket config:', error)
            return null
        }
        return data
    } catch (err) {
        console.error('Error fetching raw ticket config:', err)
        return null
    }
}

/**
 * Get remaining tickets (quota - verified count)
 * @returns {Promise<{quota: number, sold: number, remaining: number}>}
 */
export async function getRemainingTickets() {
    try {
        if (!supabase) {
            return { quota: 150, sold: 0, remaining: 150 }
        }

        // Get quota from config
        const configData = await getTicketConfigRaw()
        const quota = configData?.ticket_quota || 150

        // Count verified attendees
        const { count, error } = await supabase
            .from('attendees')
            .select('*', { count: 'exact', head: true })
            .eq('payment_status', 'verified')

        if (error) {
            console.error('Error counting verified attendees:', error)
            return { quota, sold: 0, remaining: quota }
        }

        const sold = count || 0
        return {
            quota,
            sold,
            remaining: Math.max(0, quota - sold)
        }
    } catch (err) {
        console.error('Error getting remaining tickets:', err)
        return { quota: 150, sold: 0, remaining: 150 }
    }
}

/**
 * Update ticket config (admin only)
 * Jika tidak ada data, akan insert baru. Jika ada, akan update.
 * @param {Object} configData - Data konfigurasi yang akan diupdate
 * @returns {Promise<{data: Object, error: Error}>}
 */
export async function updateTicketConfig(configData) {
    try {
        if (!supabase) {
            return { data: null, error: new Error('Supabase not available') }
        }

        // Cek apakah sudah ada data
        const { data: existingData } = await supabase
            .from('ticket_config')
            .select('id')
            .eq('is_active', true)
            .maybeSingle()

        if (existingData) {
            // Update existing row
            const { data, error } = await supabase
                .from('ticket_config')
                .update({
                    ...configData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingData.id)
                .select()
                .single()

            return { data, error }
        } else {
            // Insert new row
            const { data, error } = await supabase
                .from('ticket_config')
                .insert({
                    ...configData,
                    is_active: true
                })
                .select()
                .single()

            return { data, error }
        }
    } catch (err) {
        return { data: null, error: err }
    }
}

/**
 * Upload QRIS image ke Supabase Storage
 * @param {File} file - File gambar QRIS
 * @returns {Promise<{url: string, error: Error}>}
 */
export async function uploadQrisImage(file) {
    try {
        if (!supabase) {
            return { url: null, error: new Error('Supabase not available') }
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `qris-${Date.now()}.${fileExt}`

        const { data, error } = await supabase.storage
            .from('qris-images')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true
            })

        if (error) throw error

        const { data: urlData } = supabase.storage
            .from('qris-images')
            .getPublicUrl(fileName)

        return { url: urlData.publicUrl, error: null }
    } catch (err) {
        console.error('Error uploading QRIS image:', err)
        return { url: null, error: err }
    }
}

/**
 * Map Supabase config ke format ticketingData
 */
function mapConfigToTicketingData(config) {
    return {
        form: {
            title: config.form_title || ticketingData.form.title,
            subtitle: config.form_subtitle || ticketingData.form.subtitle,
            fields: ticketingData.form.fields // Keep default fields
        },
        payment: {
            title: "Pembayaran",
            subtitle: "Silakan lakukan pembayaran melalui QRIS",
            qrisImage: config.qris_image || ticketingData.payment.qrisImage,
            instructions: config.payment_instructions || ticketingData.payment.instructions,
            price: {
                amount: config.price_amount || ticketingData.payment.price.amount,
                formatted: formatCurrency(config.price_amount || ticketingData.payment.price.amount),
                label: config.price_label || ticketingData.payment.price.label
            },
            proofUpload: ticketingData.payment.proofUpload
        },
        success: {
            title: config.success_title || ticketingData.success.title,
            subtitle: config.success_subtitle || ticketingData.success.subtitle,
            message: config.success_message || ticketingData.success.message,
            instructions: config.success_instructions || ticketingData.success.instructions,
            contact: {
                text: "Ada pertanyaan? Hubungi kami:",
                whatsapp: config.contact_whatsapp || ticketingData.success.contact.whatsapp,
                email: config.contact_email || ticketingData.success.contact.email
            }
        },
        steps: ticketingData.steps
    }
}

/**
 * Helper to format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount)
}

// =====================================================
// DEFAULT DATA (Fallback)
// =====================================================

export const ticketingData = {
    // Form configuration
    form: {
        title: "Pendaftaran Peserta",
        subtitle: "Isi data diri Anda untuk mendaftar acara Natal Gabungan 2025",

        // Form fields
        fields: {
            name: {
                label: "Nama Lengkap",
                placeholder: "Masukkan nama lengkap Anda",
                required: true,
                type: "text"
            },
            email: {
                label: "Alamat Email",
                placeholder: "contoh@email.com",
                required: true,
                type: "email",
                helperText: "Email untuk menerima tiket dan QR Code"
            },
            phone: {
                label: "Nomor WhatsApp",
                placeholder: "08xxxxxxxxxx",
                required: true,
                type: "tel",
                helperText: "Untuk konfirmasi dan follow up"
            },
            status: {
                label: "Status",
                required: true,
                type: "radio",
                options: [
                    { value: "siswa", label: "Siswa" },
                    { value: "umum_alumni", label: "Umum/Alumni" }
                ]
            },
            school: {
                label: "Asal Sekolah",
                placeholder: "Nama sekolah Anda",
                required: false, // Required only if status = siswa
                type: "text",
                helperText: "Wajib diisi untuk siswa",
                conditionalOn: "status",
                conditionalValue: "siswa"
            }
        }
    },

    // Payment configuration
    payment: {
        title: "Pembayaran",
        subtitle: "Silakan lakukan pembayaran melalui QRIS",

        // QRIS image path - from Bahan/assets/QRIS
        qrisImage: "/assets/QRIS/8745127845812471_QRIS 1.webp",

        // Payment instructions
        instructions: [
            "Buka aplikasi e-wallet (Dana, GoPay, OVO, ShopeePay, dll)",
            "Pilih menu Scan/Bayar",
            "Scan QRIS di atas atau masukkan nominal pembayaran",
            "Masukkan jumlah pembayaran sesuai ketentuan",
            "Konfirmasi dan selesaikan pembayaran",
            "Screenshot bukti pembayaran",
            "Upload bukti pembayaran di form berikutnya"
        ],

        // Price info - HARGA SAMA UNTUK SEMUA
        price: {
            amount: 30000,
            formatted: "Rp 30.000",
            label: "Tiket Masuk"
        },

        // Payment proof upload
        proofUpload: {
            label: "Upload Bukti Pembayaran",
            helperText: "Format: JPG, PNG, atau PDF (maks. 5MB)",
            accept: ".jpg,.jpeg,.png,.pdf",
            maxSize: 5 * 1024 * 1024 // 5MB
        }
    },

    // Success page configuration
    success: {
        title: "Pendaftaran Berhasil!",
        subtitle: "Terima kasih telah mendaftar acara Natal Gabungan 2025",

        message: "Data pendaftaran Anda telah kami terima. Silakan tunggu konfirmasi melalui WhatsApp dan Email dalam waktu 1x24 jam.",

        instructions: [
            "Cek email Anda secara berkala",
            "Simpan nomor panitia untuk komunikasi",
            "QR Code tiket akan dikirim setelah pembayaran diverifikasi",
            "Screenshot QR Code untuk check-in di hari H"
        ],

        contact: {
            text: "Ada pertanyaan? Hubungi kami:",
            whatsapp: "6281234567890",
            email: "natal@smkpgri1kediri.sch.id"
        }
    },

    // Steps configuration for multi-step form
    steps: [
        {
            id: 1,
            title: "Data Diri",
            description: "Isi informasi pribadi Anda"
        },
        {
            id: 2,
            title: "Pembayaran",
            description: "Scan QRIS dan upload bukti"
        },
        {
            id: 3,
            title: "Selesai",
            description: "Konfirmasi pendaftaran"
        }
    ]
}

// Form validation messages
export const validationMessages = {
    required: "Field ini wajib diisi",
    email: "Format email tidak valid",
    phone: "Format nomor telepon tidak valid",
    fileSize: "Ukuran file terlalu besar (maks. 5MB)",
    fileType: "Format file tidak didukung"
}

export default ticketingData
