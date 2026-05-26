'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Upload, RefreshCw, Loader, Check, AlertTriangle, Image as ImageIcon, DollarSign, FileText, MessageSquare, Phone, Ticket } from 'lucide-react'
import { getTicketConfigRaw, updateTicketConfig, uploadQrisImage, getRemainingTickets } from '@/services/data-ticketing'
import { CardSkeleton } from '@/components/ui/LoadingUI'

export default function AdminTicketingPage() {
    const [config, setConfig] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [ticketInfo, setTicketInfo] = useState({ quota: 150, sold: 0, remaining: 150 })
    const fileInputRef = useRef(null)

    useEffect(() => {
        fetchConfig()
    }, [])

    const fetchConfig = async () => {
        setLoading(true)
        const data = await getTicketConfigRaw()
        if (data) {
            setConfig(data)
        } else {
            // Set default if no config in database
            setConfig({
                price_amount: 30000,
                price_label: 'Tiket Masuk',
                qris_image: '/assets/QRIS/8745127845812471_QRIS 1.webp',
                form_title: 'Pendaftaran Peserta',
                form_subtitle: 'Isi data diri Anda untuk mendaftar acara Natal Gabungan 2025',
                success_title: 'Pendaftaran Berhasil!',
                success_subtitle: 'Terima kasih telah mendaftar acara Natal Gabungan 2025',
                success_message: 'Data pendaftaran Anda telah kami terima. Silakan tunggu konfirmasi melalui WhatsApp dan Email dalam waktu 1x24 jam.',
                contact_whatsapp: '6281234567890',
                contact_email: 'natal@smkpgri1kediri.sch.id',
                ticket_quota: 150,
                payment_instructions: [
                    "Buka aplikasi e-wallet (Dana, GoPay, OVO, ShopeePay, dll)",
                    "Pilih menu Scan/Bayar",
                    "Scan QRIS di atas atau masukkan nominal pembayaran",
                    "Masukkan jumlah pembayaran sesuai ketentuan",
                    "Konfirmasi dan selesaikan pembayaran",
                    "Screenshot bukti pembayaran",
                    "Upload bukti pembayaran di form berikutnya"
                ]
            })
        }
        // Fetch ticket info
        const info = await getRemainingTickets()
        setTicketInfo(info)
        setLoading(false)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setConfig(prev => ({
            ...prev,
            [name]: (name === 'price_amount' || name === 'ticket_quota') ? parseInt(value) || 0 : value
        }))
    }

    const handleQrisUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Validate file
        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'File harus berupa gambar' })
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Ukuran file maksimal 5MB' })
            return
        }

        setUploading(true)
        setMessage({ type: '', text: '' })

        const { url, error } = await uploadQrisImage(file)

        if (error) {
            setMessage({ type: 'error', text: 'Gagal upload gambar: ' + error.message })
        } else if (url) {
            setConfig(prev => ({ ...prev, qris_image: url }))
            setMessage({ type: 'success', text: 'Gambar QRIS berhasil diupload' })
        }

        setUploading(false)
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage({ type: '', text: '' })

        const { data, error } = await updateTicketConfig({
            price_amount: config.price_amount,
            price_label: config.price_label,
            qris_image: config.qris_image,
            form_title: config.form_title,
            form_subtitle: config.form_subtitle,
            success_title: config.success_title,
            success_subtitle: config.success_subtitle,
            success_message: config.success_message,
            contact_whatsapp: config.contact_whatsapp,
            contact_email: config.contact_email,
            ticket_quota: config.ticket_quota,
            payment_instructions: config.payment_instructions
        })

        if (error) {
            setMessage({ type: 'error', text: 'Gagal menyimpan: ' + error.message })
        } else {
            setMessage({ type: 'success', text: 'Konfigurasi berhasil disimpan!' })
        }

        setSaving(false)
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Konfigurasi Tiket</h1>
                    <p className="text-gray-400">Kelola harga, QRIS, dan pengaturan pendaftaran</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchConfig}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#252525] text-gray-300 rounded-xl hover:text-[#C5A059] hover:bg-[#C5A059]/10 transition-all border border-[#C5A059]/20"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-[#2C2C2C] font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Simpan
                    </button>
                </div>
            </div>

            {/* Message Alert */}
            {message.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                    {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            {loading ? (
                <CardSkeleton count={3} />
            ) : config && (
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Price Configuration */}
                    <div className="bg-gradient-to-b from-[#1A1A1A] to-[#151515] rounded-2xl p-6 border border-[#C5A059]/20">
                        <div className="flex items-center gap-3 mb-6">
                            <DollarSign className="w-6 h-6 text-[#C5A059]" />
                            <h2 className="text-xl font-semibold text-white">Harga Tiket</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Harga (Rupiah)</label>
                                <input
                                    type="number"
                                    name="price_amount"
                                    value={config.price_amount}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-[#252525] border border-[#C5A059]/20 rounded-xl text-white focus:border-[#C5A059] outline-none"
                                />
                                <p className="text-[#C5A059] text-sm mt-2">
                                    Preview: {formatCurrency(config.price_amount)}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Label Harga</label>
                                <input
                                    type="text"
                                    name="price_label"
                                    value={config.price_label}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-[#252525] border border-[#C5A059]/20 rounded-xl text-white focus:border-[#C5A059] outline-none"
                                    placeholder="Tiket Masuk"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ticket Quota Configuration */}
                    <div className="bg-gradient-to-b from-[#1A1A1A] to-[#151515] rounded-2xl p-6 border border-[#C5A059]/20">
                        <div className="flex items-center gap-3 mb-6">
                            <Ticket className="w-6 h-6 text-[#C5A059]" />
                            <h2 className="text-xl font-semibold text-white">Kuota Tiket</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Total Kuota</label>
                                <input
                                    type="number"
                                    name="ticket_quota"
                                    value={config.ticket_quota || 150}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-[#252525] border border-[#C5A059]/20 rounded-xl text-white focus:border-[#C5A059] outline-none"
                                />
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#252525] rounded-xl p-4 text-center">
                                    <p className="text-gray-400 text-xs mb-1">Terjual</p>
                                    <p className="text-2xl font-bold text-green-400">{ticketInfo.sold}</p>
                                </div>
                                <div className="bg-[#252525] rounded-xl p-4 text-center">
                                    <p className="text-gray-400 text-xs mb-1">Tersisa</p>
                                    <p className={`text-2xl font-bold ${ticketInfo.remaining > 0 ? 'text-[#C5A059]' : 'text-red-400'}`}>
                                        {ticketInfo.remaining}
                                    </p>
                                </div>
                            </div>

                            {ticketInfo.remaining <= 0 && (
                                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-center">
                                    <p className="text-red-400 text-sm font-medium">⚠️ Tiket Habis!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* QRIS Configuration */}
                    <div className="bg-gradient-to-b from-[#1A1A1A] to-[#151515] rounded-2xl p-6 border border-[#C5A059]/20">
                        <div className="flex items-center gap-3 mb-6">
                            <ImageIcon className="w-6 h-6 text-[#C5A059]" />
                            <h2 className="text-xl font-semibold text-white">Gambar QRIS</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Preview */}
                            <div className="bg-white rounded-xl p-4 flex items-center justify-center">
                                <img
                                    src={config.qris_image}
                                    alt="QRIS Preview"
                                    className="max-w-full max-h-48 object-contain"
                                />
                            </div>

                            {/* Upload Button */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleQrisUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="w-full px-4 py-3 bg-[#252525] border border-[#C5A059]/20 text-gray-300 rounded-xl hover:border-[#C5A059] transition-all flex items-center justify-center gap-2"
                            >
                                {uploading ? (
                                    <><Loader className="w-4 h-4 animate-spin" /> Mengupload...</>
                                ) : (
                                    <><Upload className="w-4 h-4" /> Upload Gambar Baru</>
                                )}
                            </button>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">URL Gambar (atau upload di atas)</label>
                                <input
                                    type="text"
                                    name="qris_image"
                                    value={config.qris_image}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-[#252525] border border-[#C5A059]/20 rounded-xl text-white focus:border-[#C5A059] outline-none text-sm"
                                    placeholder="/assets/QRIS/..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Configuration */}
                    <div className="bg-gradient-to-b from-[#1A1A1A] to-[#151515] rounded-2xl p-6 border border-[#C5A059]/20">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText className="w-6 h-6 text-[#C5A059]" />
                            <h2 className="text-xl font-semibold text-white">Form Pendaftaran</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Judul Form</label>
                                <input
                                    type="text"
                                    name="form_title"
                                    value={config.form_title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-[#252525] border border-[#C5A059]/20 rounded-xl text-white focus:border-[#C5A059] outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Subjudul Form</label>
                                <textarea
                                    name="form_subtitle"
                                    value={config.form_subtitle}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-4 py-3 bg-[#252525] border border-[#C5A059]/20 rounded-xl text-white focus:border-[#C5A059] outline-none resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Success Message Configuration */}
                    <div className="bg-gradient-to-b from-[#1A1A1A] to-[#151515] rounded-2xl p-6 border border-[#C5A059]/20">
                        <div className="flex items-center gap-3 mb-6">
                            <MessageSquare className="w-6 h-6 text-[#C5A059]" />
                            <h2 className="text-xl font-semibold text-white">Pesan Sukses</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Judul Sukses</label>
                                <input
                                    type="text"
                                    name="success_title"
                                    value={config.success_title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-[#252525] border border-[#C5A059]/20 rounded-xl text-white focus:border-[#C5A059] outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Pesan Sukses</label>
                                <textarea
                                    name="success_message"
                                    value={config.success_message}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-[#252525] border border-[#C5A059]/20 rounded-xl text-white focus:border-[#C5A059] outline-none resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Configuration */}
                    <div className="bg-gradient-to-b from-[#1A1A1A] to-[#151515] rounded-2xl p-6 border border-[#C5A059]/20 lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <Phone className="w-6 h-6 text-[#C5A059]" />
                            <h2 className="text-xl font-semibold text-white">Kontak</h2>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Nomor WhatsApp</label>
                                <input
                                    type="text"
                                    name="contact_whatsapp"
                                    value={config.contact_whatsapp}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-[#252525] border border-[#C5A059]/20 rounded-xl text-white focus:border-[#C5A059] outline-none"
                                    placeholder="6281234567890"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="contact_email"
                                    value={config.contact_email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-[#252525] border border-[#C5A059]/20 rounded-xl text-white focus:border-[#C5A059] outline-none"
                                    placeholder="natal@smkpgri1kediri.sch.id"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
