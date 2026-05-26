'use client'

import Image from 'next/image'
import Link from 'next/link'
import Countdown from '@/components/ui/Countdown'
import { countdownData, countdownSettings } from '@/services/data-countdown'
import { AnimateOnScroll } from '@/lib/animations'

export default function CountdownSection() {
    const { ticket, event } = countdownData

    return (
        <section id="countdown" className="py-20 sm:py-28 bg-[#0F0F0F] relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4A0404]/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-[128px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Section Header */}
                <AnimateOnScroll animation="fadeUp">
                    <div className="text-center mb-16">
                        <p className="text-[#C5A059] uppercase tracking-[0.2em] text-sm mb-4 font-medium">
                            Waktu Terus Berjalan
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-heading)]">
                            <span className="text-white">Jangan </span>
                            <span className="bg-gradient-to-r from-[#C5A059] to-[#D4B06A] bg-clip-text text-transparent">
                                Lewatkan!
                            </span>
                        </h2>

                        <div className="flex items-center justify-center gap-3 mt-6">
                            <span className="w-16 h-0.5 bg-gradient-to-r from-transparent to-[#C5A059]" />
                            <span className="text-[#C5A059]">✦</span>
                            <span className="w-16 h-0.5 bg-gradient-to-l from-transparent to-[#C5A059]" />
                        </div>
                    </div>
                </AnimateOnScroll>

                {/* Countdown Cards Grid */}
                <div className="grid lg:grid-cols-2 gap-8">

                    {/* Ticket Countdown Card - Mahogany Theme (Urgent) */}
                    <AnimateOnScroll animation="fadeRight" delay={0.1}>
                        <div className="relative group h-full">
                            {/* Glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#4A0404] to-[#6B1010] rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity" />

                            <div className="relative bg-gradient-to-br from-[#4A0404] to-[#2C0202] rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#C5A059]/20 overflow-hidden h-full">
                                {/* Corner Ornaments */}
                                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#C5A059]/40 rounded-tl-3xl" />
                                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#C5A059]/40 rounded-br-3xl" />

                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#C5A059]/20 rounded-full mb-6">
                                    <span className="w-2 h-2 bg-[#C5A059] rounded-full animate-pulse" />
                                    <span className="text-[#C5A059] text-sm font-medium">Segera Ditutup</span>
                                </div>

                                {/* Date */}
                                <p className="text-[#D4B06A] text-lg font-medium mb-2">29 Desember 2025</p>

                                {/* Title */}
                                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
                                    {ticket.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-300 mb-8 leading-relaxed">
                                    {ticket.description}
                                </p>

                                {/* Countdown */}
                                <div className="mb-8">
                                    <Countdown
                                        targetDate={ticket.targetDate}
                                        labels={ticket.labels}
                                        variant="urgent"
                                    />
                                </div>

                                {/* CTA Button */}
                                <Link
                                    href={ticket.cta.href}
                                    className="inline-flex items-center gap-2 w-full sm:w-auto justify-center px-8 py-4 bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-[#2C2C2C] font-bold rounded-xl hover:shadow-[0_4px_20px_rgba(197,160,89,0.4)] hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    {ticket.cta.text}
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </AnimateOnScroll>

                    {/* Event Countdown Card - Forest Theme (Celebration) */}
                    <AnimateOnScroll animation="fadeLeft" delay={0.2}>
                        <div className="relative group h-full">
                            {/* Glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#1A3A1A] to-[#0F2F0F] rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity" />

                            <div className="relative bg-gradient-to-br from-[#1A3A1A] to-[#0F1F0F] rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#C5A059]/20 overflow-hidden h-full">
                                {/* Corner Ornaments */}
                                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#C5A059]/40 rounded-tl-3xl" />
                                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#C5A059]/40 rounded-br-3xl" />

                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#C5A059]/20 rounded-full mb-6">
                                    <span className="text-[#C5A059] text-lg">🎄</span>
                                    <span className="text-[#C5A059] text-sm font-medium">Hari H</span>
                                </div>

                                {/* Date */}
                                <p className="text-[#D4B06A] text-lg font-medium mb-2">10 Januari 2026</p>

                                {/* Title */}
                                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
                                    {event.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-300 mb-8 leading-relaxed">
                                    {event.description}
                                </p>

                                {/* Countdown */}
                                <div className="mb-8">
                                    <Countdown
                                        targetDate={event.targetDate}
                                        labels={event.labels}
                                        variant="celebration"
                                    />
                                </div>

                                {/* CTA Button - Secondary style */}
                                <a
                                    href={event.cta.href}
                                    className="inline-flex items-center gap-2 w-full sm:w-auto justify-center px-8 py-4 text-[#C5A059] font-semibold border-2 border-[#C5A059]/50 rounded-xl hover:border-[#C5A059] hover:bg-[#C5A059]/10 transition-all duration-300"
                                >
                                    {event.cta.text}
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </AnimateOnScroll>
                </div>
            </div>
        </section>
    )
}
