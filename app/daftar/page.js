'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Clipboard, PartyPopper, Ticket } from 'lucide-react'
import { getTicketConfig, ticketingData, getRemainingTickets } from '@/services/data-ticketing'
import { supabase } from '@/lib/supabase'
import { generateUniqueId, isValidEmail, isValidPhone } from '@/lib/utils'
import { LoadingButton } from '@/components/ui/LoadingUI'
import { showToast } from '@/components/ui/Toast'

// Inner component that uses useSearchParams
function DaftarContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [fromLanding, setFromLanding] = useState(false) // Track if user came from landing page
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', school: '', status: 'siswa',
        paymentProof: null, paymentAmount: ''
    })
    const [errors, setErrors] = useState({})
    const [registrationId, setRegistrationId] = useState(null)

    // Fetch config from Supabase
    const [config, setConfig] = useState(ticketingData)
    const [configLoading, setConfigLoading] = useState(true)
    const [ticketInfo, setTicketInfo] = useState({ remaining: 150, sold: 0, quota: 150 })

    useEffect(() => {
        // Fetch config
        getTicketConfig().then(data => {
            setConfig(data)
            setConfigLoading(false)
        }).catch(() => {
            setConfigLoading(false)
        })
        // Fetch ticket availability
        getRemainingTickets().then(info => {
            setTicketInfo(info)
        })
    }, [])

    const { form, payment, success, steps } = config

    // Check for pre-filled data from landing page
    useEffect(() => {
        const stepParam = searchParams.get('step')
        const savedData = sessionStorage.getItem('registrationData')

        if (stepParam === '2' && savedData) {
            try {
                const parsedData = JSON.parse(savedData)
                setFormData(prev => ({ ...prev, ...parsedData }))
                setStep(2)
                setFromLanding(true) // Mark that user came from landing page
                // Clear sessionStorage after using it
                sessionStorage.removeItem('registrationData')
            } catch (e) {
                console.error('Failed to parse registration data:', e)
            }
        }
    }, [searchParams])

    // Handle back button - go to landing page if came from there
    const handleBack = () => {
        if (fromLanding) {
            router.push('/#daftar')
        } else {
            setStep(1)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file && file.size <= 5 * 1024 * 1024) {
            setFormData(prev => ({ ...prev, paymentProof: file }))
        } else {
            setErrors(prev => ({ ...prev, paymentProof: 'File terlalu besar (maks 5MB)' }))
        }
    }

    const validateStep1 = () => {
        const newErrors = {}
        if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi'
        if (!isValidEmail(formData.email)) newErrors.email = 'Email tidak valid'
        if (!isValidPhone(formData.phone)) newErrors.phone = 'Nomor WA tidak valid'
        if (formData.status === 'siswa' && !formData.school.trim()) newErrors.school = 'Asal sekolah wajib diisi'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateStep2 = () => {
        const newErrors = {}
        if (!formData.paymentProof) newErrors.paymentProof = 'Upload bukti pembayaran'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (step === 1 && validateStep1()) setStep(2)
    }

    const handleSubmit = async () => {
        if (!validateStep2()) return
        setLoading(true)

        try {
            const uniqueId = generateUniqueId()
            let proofUrl = null

            // Upload payment proof
            if (formData.paymentProof) {
                const fileExt = formData.paymentProof.name.split('.').pop()
                const fileName = `${uniqueId}.${fileExt}`
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('payment-proofs').upload(fileName, formData.paymentProof)
                if (!uploadError) {
                    proofUrl = supabase.storage.from('payment-proofs').getPublicUrl(fileName).data.publicUrl
                }
            }

            // Insert to database
            const { error } = await supabase.from('attendees').insert({
                unique_id: uniqueId,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                school: formData.status === 'siswa' ? formData.school : null,
                status: formData.status,
                payment_proof: proofUrl,
                payment_amount: payment.price.amount.toString(), // Fixed price from ticketingData
                payment_status: 'pending'
            })

            if (error) throw error
            setRegistrationId(uniqueId)
            setStep(3)
        } catch (err) {
            console.error(err)
            setErrors({ submit: 'Gagal mendaftar. Coba lagi.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0F0F0F] py-8 sm:py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center gap-2 text-[#C5A059] hover:text-[#D4B06A] mb-6 sm:mb-8">
                    <ArrowLeft className="w-4 h-4" /> Kembali
                </Link>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
                    {steps.map((s, i) => (
                        <div key={s.id} className="flex items-center">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${step >= s.id ? 'bg-[#C5A059] text-[#2C2C2C]' : 'bg-[#252525] text-gray-500'
                                }`}>
                                {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                            </div>
                            {i < steps.length - 1 && <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 ${step > s.id ? 'bg-[#C5A059]' : 'bg-[#252525]'}`} />}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="bg-[#1A1A1A] rounded-2xl p-5 sm:p-8 border border-[#C5A059]/20">
                    {step === 1 && (
                        <>
                            <h2 className="text-2xl font-bold text-white mb-2">{steps[0].title}</h2>
                            <p className="text-gray-400 mb-8">{steps[0].description}</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[#C5A059] text-sm mb-2">Nama Lengkap *</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#252525] border border-[#C5A059]/20 rounded-lg text-white focus:border-[#C5A059] outline-none"
                                        placeholder="Masukkan nama lengkap" />
                                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-[#C5A059] text-sm mb-2">Email *</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#252525] border border-[#C5A059]/20 rounded-lg text-white focus:border-[#C5A059] outline-none"
                                        placeholder="contoh@email.com" />
                                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-[#C5A059] text-sm mb-2">Nomor WhatsApp *</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#252525] border border-[#C5A059]/20 rounded-lg text-white focus:border-[#C5A059] outline-none"
                                        placeholder="08xxxxxxxxxx" />
                                    {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-[#C5A059] text-sm mb-2">Status *</label>
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        {['siswa', 'umum_alumni'].map(opt => (
                                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="status" value={opt} checked={formData.status === opt}
                                                    onChange={handleInputChange} className="w-5 h-5 accent-[#C5A059]" />
                                                <span className="text-white">{opt === 'siswa' ? 'Siswa' : 'Umum/Alumni'}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {formData.status === 'siswa' && (
                                    <div>
                                        <label className="block text-[#C5A059] text-sm mb-2">Asal Sekolah *</label>
                                        <input type="text" name="school" value={formData.school} onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-[#252525] border border-[#C5A059]/20 rounded-lg text-white focus:border-[#C5A059] outline-none"
                                            placeholder="Nama sekolah" />
                                        {errors.school && <p className="text-red-400 text-sm mt-1">{errors.school}</p>}
                                    </div>
                                )}

                                <LoadingButton onClick={handleNext} size="lg" className="w-full">
                                    Lanjut ke Pembayaran <ArrowRight className="w-4 h-4 inline ml-1" />
                                </LoadingButton>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className="text-2xl font-bold text-white mb-2">{steps[1].title}</h2>
                            <p className="text-gray-400 mb-4">{steps[1].description}</p>

                            {/* Remaining Tickets Badge */}
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${ticketInfo.remaining > 0
                                ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                <Ticket className="w-4 h-4" />
                                <span className="font-semibold">
                                    {ticketInfo.remaining > 0
                                        ? `Sisa Tiket: ${ticketInfo.remaining}`
                                        : 'Tiket Habis!'}
                                </span>
                            </div>

                            {ticketInfo.remaining <= 0 ? (
                                /* Sold Out Message */
                                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
                                    <div className="text-6xl mb-4">😢</div>
                                    <h3 className="text-2xl font-bold text-red-400 mb-2">Maaf, Tiket Habis!</h3>
                                    <p className="text-gray-400 mb-6">Pendaftaran sudah ditutup karena kuota tiket sudah penuh.</p>
                                    <Link href="/" className="inline-flex px-6 py-3 bg-[#C5A059] text-[#2C2C2C] font-semibold rounded-xl hover:bg-[#D4B06A] transition-colors">
                                        Kembali ke Beranda
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* QRIS */}
                                    <div className="bg-white rounded-xl p-4 text-center">
                                        <img
                                            src={payment.qrisImage}
                                            alt="QRIS"
                                            className="mx-auto max-w-[250px] max-h-[250px] object-contain"
                                        />
                                    </div>

                                    {/* Payment Instructions */}
                                    {payment.instructions && payment.instructions.length > 0 && (
                                        <div className="bg-[#252525] rounded-xl p-4">
                                            <p className="text-[#C5A059] font-medium mb-3 flex items-center gap-2">
                                                📋 Cara Pembayaran:
                                            </p>
                                            <ol className="space-y-2 text-gray-300 text-sm">
                                                {payment.instructions.map((instruction, index) => (
                                                    <li key={index} className="flex gap-3">
                                                        <span className="flex-shrink-0 w-6 h-6 bg-[#C5A059]/20 text-[#C5A059] rounded-full flex items-center justify-center text-xs font-bold">
                                                            {index + 1}
                                                        </span>
                                                        <span>{instruction}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    )}

                                    {/* Harga dengan tombol salin */}
                                    <div className="bg-[#252525] rounded-xl p-4">
                                        <p className="text-[#C5A059] font-medium mb-3">Nominal Pembayaran:</p>
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1A1A1A] rounded-lg p-3 sm:p-4">
                                            <span className="text-2xl font-bold text-white">{payment.price.formatted}</span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(payment.price.amount.toString())
                                                    showToast('Nominal berhasil disalin!', 'success')
                                                }}
                                                className="px-4 py-2 bg-[#C5A059] text-[#2C2C2C] font-semibold rounded-lg hover:bg-[#D4B06A] transition-colors flex items-center gap-2"
                                            >
                                                <Clipboard className="w-4 h-4" /> Salin
                                            </button>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-2">Klik tombol salin untuk menyalin nominal pembayaran</p>
                                    </div>

                                    <div>
                                        <label className="block text-[#C5A059] text-sm mb-2">Upload Bukti Pembayaran *</label>
                                        <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange}
                                            className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#C5A059] file:text-[#2C2C2C] file:font-semibold" />
                                        {errors.paymentProof && <p className="text-red-400 text-sm mt-1">{errors.paymentProof}</p>}
                                    </div>

                                    {errors.submit && <p className="text-red-400 text-center">{errors.submit}</p>}

                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        <LoadingButton onClick={handleBack} variant="secondary" size="lg" className="flex-1">
                                            <ArrowLeft className="w-4 h-4 inline mr-1" /> Kembali
                                        </LoadingButton>
                                        <LoadingButton onClick={handleSubmit} loading={loading} size="lg" className="flex-1">
                                            <Check className="w-4 h-4 inline mr-1" /> Kirim Pendaftaran
                                        </LoadingButton>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {step === 3 && (
                        <div className="text-center py-8">
                            <div className="flex justify-center mb-6">
                                <PartyPopper className="w-16 h-16 text-[#C5A059]" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">{success.title}</h2>
                            <p className="text-gray-400 mb-6">{success.message}</p>
                            <Link href="/" className="inline-block px-8 py-4 bg-[#C5A059] text-[#2C2C2C] font-bold rounded-xl">
                                Kembali ke Beranda
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Loading fallback for Suspense
function DaftarLoading() {
    return (
        <div className="min-h-screen bg-[#0F0F0F] py-8 sm:py-12 px-4 flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[#C5A059]">Memuat...</p>
            </div>
        </div>
    )
}

// Default export wrapped in Suspense for useSearchParams
export default function DaftarPage() {
    return (
        <Suspense fallback={<DaftarLoading />}>
            <DaftarContent />
        </Suspense>
    )
}

