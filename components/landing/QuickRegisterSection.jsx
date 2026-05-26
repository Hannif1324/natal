'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Smartphone, GraduationCap, Backpack, Briefcase, School, ArrowRight, AlertTriangle } from 'lucide-react'
import { getTicketConfig, ticketingData } from '@/services/data-ticketing'
import { isValidEmail, isValidPhone } from '@/lib/utils'
import { LoadingButton } from '@/components/ui/LoadingUI'
import { AnimateOnScroll } from '@/lib/animations'

export default function QuickRegisterSection() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', school: '', status: 'siswa'
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    // Fetch config from Supabase
    const [config, setConfig] = useState(ticketingData)
    const [configLoading, setConfigLoading] = useState(true)

    useEffect(() => {
        getTicketConfig().then(data => {
            setConfig(data)
            setConfigLoading(false)
        }).catch(() => {
            setConfigLoading(false)
        })
    }, [])

    const { form, payment } = config

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.name.trim()) newErrors.name = 'Nama wajib diisi'
        if (!isValidEmail(formData.email)) newErrors.email = 'Email tidak valid'
        if (!isValidPhone(formData.phone)) newErrors.phone = 'Nomor WA tidak valid'
        if (formData.status === 'siswa' && !formData.school.trim()) newErrors.school = 'Asal sekolah wajib diisi'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsSubmitting(true)

        // Store form data in sessionStorage to be used on /daftar page
        sessionStorage.setItem('registrationData', JSON.stringify(formData))

        // Navigate to payment step
        router.push('/daftar?step=2')
    }

    return (
        <section id="daftar" className="py-20 sm:py-28 bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <AnimateOnScroll animation="fadeUp">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <p className="text-[#C5A059] uppercase tracking-[0.2em] text-sm mb-4 font-medium">
                            Pendaftaran
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-heading)]">
                            <span className="text-white">Daftar </span>
                            <span className="bg-gradient-to-r from-[#C5A059] to-[#D4B06A] bg-clip-text text-transparent">
                                Sekarang
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto">
                            Isi data diri Anda untuk mengikuti perayaan Natal bersama
                        </p>

                        {/* Decorative */}
                        <div className="flex items-center justify-center gap-3 mt-6">
                            <span className="w-16 h-0.5 bg-gradient-to-r from-transparent to-[#C5A059]" />
                            <span className="text-[#C5A059]">✦</span>
                            <span className="w-16 h-0.5 bg-gradient-to-l from-transparent to-[#C5A059]" />
                        </div>
                    </div>
                </AnimateOnScroll>

                {/* Registration Form Card */}
                <AnimateOnScroll animation="fadeUp" delay={0.2}>
                    <div className="bg-gradient-to-b from-[#252525] to-[#1A1A1A] rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-[#C5A059]/20 shadow-2xl">
                        {/* Price Badge
                        <div className="flex items-center justify-center mb-8">
                            <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-full">
                                <span className="text-2xl">🎫</span>
                                <div>
                                    <p className="text-gray-400 text-xs">Harga Tiket</p>
                                    <p className="text-[#C5A059] font-bold text-xl">{payment.price.formatted}</p>
                                </div>
                            </div>
                        </div> */}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-[#C5A059] text-sm font-medium mb-2">
                                    <span className="flex items-center gap-2"><User className="w-4 h-4" /> Nama Lengkap *</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-4 bg-[#1A1A1A] border border-[#C5A059]/20 rounded-xl text-white focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none transition-all"
                                    placeholder="Masukkan nama lengkap Anda"
                                />
                                {errors.name && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> {errors.name}</p>}
                            </div>

                            {/* Email & Phone - 2 columns on desktop */}
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[#C5A059] text-sm font-medium mb-2">
                                        <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email *</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-4 bg-[#1A1A1A] border border-[#C5A059]/20 rounded-xl text-white focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none transition-all"
                                        placeholder="contoh@email.com"
                                    />
                                    {errors.email && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> {errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-[#C5A059] text-sm font-medium mb-2">
                                        <span className="flex items-center gap-2"><Smartphone className="w-4 h-4" /> Nomor WhatsApp *</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-4 bg-[#1A1A1A] border border-[#C5A059]/20 rounded-xl text-white focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none transition-all"
                                        placeholder="08xxxxxxxxxx"
                                    />
                                    {errors.phone && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> {errors.phone}</p>}
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-[#C5A059] text-sm font-medium mb-3">
                                    <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Status *</span>
                                </label>
                                <div className="flex flex-wrap gap-4">
                                    {['siswa', 'umum_alumni'].map(opt => (
                                        <label
                                            key={opt}
                                            className={`flex items-center gap-3 px-5 py-3 rounded-xl cursor-pointer border transition-all ${formData.status === opt
                                                ? 'bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059]'
                                                : 'bg-[#1A1A1A] border-[#C5A059]/20 text-gray-300 hover:border-[#C5A059]/50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="status"
                                                value={opt}
                                                checked={formData.status === opt}
                                                onChange={handleInputChange}
                                                className="hidden"
                                            />
                                            {opt === 'siswa' ? <Backpack className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                                            <span className="font-medium">{opt === 'siswa' ? 'Siswa' : 'Umum/Alumni'}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* School - Only show for siswa */}
                            {formData.status === 'siswa' && (
                                <div className="animate-fadeIn">
                                    <label className="block text-[#C5A059] text-sm font-medium mb-2">
                                        <span className="flex items-center gap-2"><School className="w-4 h-4" /> Asal Sekolah *</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="school"
                                        value={formData.school}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-4 bg-[#1A1A1A] border border-[#C5A059]/20 rounded-xl text-white focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none transition-all"
                                        placeholder="Nama sekolah Anda"
                                    />
                                    {errors.school && <p className="text-red-400 text-sm mt-2 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> {errors.school}</p>}
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-4">
                                <LoadingButton
                                    type="submit"
                                    loading={isSubmitting}
                                    size="lg"
                                    className="w-full text-lg"
                                >
                                    Lanjut ke Pembayaran
                                </LoadingButton>
                            </div>

                            {/* Info */}
                            <p className="text-center text-gray-500 text-sm">
                                Dengan mendaftar, Anda menyetujui syarat dan ketentuan yang berlaku
                            </p>
                        </form>
                    </div>
                </AnimateOnScroll>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </section>
    )
}
