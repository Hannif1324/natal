'use client'

import { Drama, Mic, Music, Users } from 'lucide-react'
import { contentData } from '@/services/data-content'
import { AnimateOnScroll, StaggerChildren } from '@/lib/animations'

// Icon mapping for highlights
const iconMap = {
    Drama: Drama,
    Mic: Mic,
    Music: Music,
    Users: Users,
}

export default function DescriptionSection() {
    const { description } = contentData

    return (
        <section id="info" className="relative py-20 sm:py-28 bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] overflow-hidden">
            {/* Decorative Pattern - Subtle */}
            <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
                <svg viewBox="0 0 200 200" className="w-full h-full text-[#C5A059]">
                    <pattern id="batik-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="8" fill="currentColor" />
                        <circle cx="0" cy="0" r="4" fill="currentColor" />
                        <circle cx="40" cy="0" r="4" fill="currentColor" />
                        <circle cx="0" cy="40" r="4" fill="currentColor" />
                        <circle cx="40" cy="40" r="4" fill="currentColor" />
                    </pattern>
                    <rect width="200" height="200" fill="url(#batik-pattern)" />
                </svg>
            </div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                {/* Section Header */}
                <AnimateOnScroll animation="fadeUp">
                    <div className="text-center mb-16">
                        <p className="text-[#C5A059] uppercase tracking-[0.2em] text-sm mb-4 font-medium">
                            Tentang Acara
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-heading)]">
                            <span className="text-white">{description.title.split(' ')[0]} </span>
                            <span className="bg-gradient-to-r from-[#C5A059] to-[#D4B06A] bg-clip-text text-transparent">
                                {description.title.split(' ').slice(1).join(' ')}
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto">
                            {description.subtitle}
                        </p>

                        {/* Decorative Line */}
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <span className="w-8 h-px bg-[#C5A059]/50" />
                            <span className="w-2 h-2 bg-[#C5A059] rotate-45" />
                            <span className="w-8 h-px bg-[#C5A059]/50" />
                        </div>
                    </div>
                </AnimateOnScroll>

                {/* Main Content - Two Column Layout */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                    {/* Text Content */}
                    <AnimateOnScroll animation="fadeRight" delay={0.1}>
                        <div className="space-y-6">
                            {description.paragraphs.map((paragraph, index) => (
                                <p
                                    key={index}
                                    className="text-gray-300 leading-relaxed text-base sm:text-lg"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </AnimateOnScroll>

                    {/* Decorative Quote Box */}
                    <AnimateOnScroll animation="fadeLeft" delay={0.2}>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-[#C5A059]/20 to-transparent rounded-2xl blur-xl" />
                            <div className="relative bg-gradient-to-br from-[#252525] to-[#1A1A1A] p-5 sm:p-8 rounded-xl sm:rounded-2xl border border-[#C5A059]/20">
                                {/* Quote Icon */}
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#C5A059] rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-[#2C2C2C]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>
                                </div>

                                <blockquote className="text-xl sm:text-2xl font-[family-name:var(--font-heading)] text-white leading-relaxed mb-4 pt-4">
                                    "Menjadi terang di tengah kegelapan, itulah panggilan kita."
                                </blockquote>

                                <p className="text-[#C5A059] font-medium">
                                    — Tema Natal 2025
                                </p>

                                {/* Corner Decorations */}
                                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#C5A059]/30 rounded-tr-2xl" />
                                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#C5A059]/30 rounded-bl-2xl" />
                            </div>
                        </div>
                    </AnimateOnScroll>
                </div>

                {/* Highlights Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {description.highlights.map((highlight, index) => (
                        <AnimateOnScroll key={index} animation="scaleUp" delay={index * 0.1}>
                            <div className="group p-6 bg-gradient-to-b from-[#252525]/80 to-[#1A1A1A] rounded-xl border border-[#C5A059]/10 hover:border-[#C5A059]/40 transition-all duration-300 hover:-translate-y-1">
                                {/* Icon */}
                                <div className="w-12 h-12 bg-gradient-to-br from-[#C5A059]/20 to-[#C5A059]/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {(() => {
                                        const IconComponent = iconMap[highlight.icon]
                                        return IconComponent ? <IconComponent className="w-6 h-6 text-[#C5A059]" /> : null
                                    })()}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-heading)]">
                                    {highlight.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {highlight.description}
                                </p>
                            </div>
                        </AnimateOnScroll>
                    ))}
                </div>
            </div>
        </section>
    )
}
