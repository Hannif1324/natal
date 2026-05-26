'use client'

import { useState } from 'react'
import Image from 'next/image'
import { speakersData } from '@/services/data-speakers'
import Modal from '@/components/ui/Modal'
import { AnimateOnScroll } from '@/lib/animations'

export default function SpeakersSection() {
    const [selectedSpeaker, setSelectedSpeaker] = useState(null)
    const speaker = speakersData[0]

    return (
        <section id="speakers" className="py-20 sm:py-28 bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] relative overflow-hidden">
            <div className="absolute top-20 left-10 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#4A0404]/10 rounded-full blur-3xl" />

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <AnimateOnScroll animation="fadeUp">
                    <div className="text-center mb-16">
                        <p className="text-[#C5A059] uppercase tracking-[0.2em] text-sm mb-4 font-medium">Pembicara</p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-heading)]">
                            <span className="text-white">Bersama </span>
                            <span className="bg-gradient-to-r from-[#C5A059] to-[#D4B06A] bg-clip-text text-transparent">
                                Pembicara Inspiratif
                            </span>
                        </h2>
                        <div className="flex items-center justify-center gap-3 mt-6">
                            <span className="w-16 h-0.5 bg-gradient-to-r from-transparent to-[#C5A059]" />
                            <span className="text-[#C5A059]">✦</span>
                            <span className="w-16 h-0.5 bg-gradient-to-l from-transparent to-[#C5A059]" />
                        </div>
                    </div>
                </AnimateOnScroll>

                <AnimateOnScroll animation="scaleUp" delay={0.1}>
                    <div className="max-w-4xl mx-auto">
                        <div onClick={() => setSelectedSpeaker(speaker)}
                            className="group cursor-pointer relative bg-gradient-to-r from-[#4A0404] via-[#2C2C2C] to-[#4A0404] rounded-3xl p-1 hover:shadow-[0_20px_60px_rgba(197,160,89,0.2)] transition-all duration-500">
                            <div className="bg-gradient-to-b from-[#252525] to-[#1A1A1A] rounded-[20px] sm:rounded-[22px] p-5 sm:p-8 md:p-10">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-[#C5A059]/20 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
                                        <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-[#C5A059]/30 group-hover:border-[#C5A059]/60 transition-colors">
                                            <Image src={speaker.image} alt={speaker.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        {/* Corner ornaments - hidden on small mobile, smaller on tablet */}
                                        <div className="hidden sm:block absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 border-t-2 border-l-2 border-[#C5A059] rounded-tl-full" />
                                        <div className="hidden sm:block absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 border-b-2 border-r-2 border-[#C5A059] rounded-br-full" />
                                    </div>

                                    <div className="flex-1 text-center md:text-left">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#C5A059]/10 rounded-full mb-4">
                                            <svg className="w-4 h-4 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            <span className="text-[#C5A059] text-sm font-medium">{speaker.origin}</span>
                                        </div>

                                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-[family-name:var(--font-heading)] group-hover:text-[#D4B06A] transition-colors">
                                            {speaker.name}
                                        </h3>
                                        <p className="text-[#C5A059] font-medium mb-1">{speaker.title}</p>
                                        <p className="text-gray-400 text-sm mb-4">{speaker.church}</p>
                                        <p className="text-gray-300 mb-6 leading-relaxed">{speaker.shortDescription}</p>

                                        <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                                            {speaker.topics.map((topic, index) => (
                                                <span key={index} className="px-3 py-1 bg-[#1A1A1A] text-gray-400 text-xs rounded-full border border-[#C5A059]/20">
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="mt-6 flex items-center justify-center md:justify-start gap-2 text-[#C5A059] group-hover:gap-3 transition-all">
                                            <span className="text-sm font-medium">Lihat Profil Lengkap</span>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimateOnScroll>
            </div>

            <Modal isOpen={!!selectedSpeaker} onClose={() => setSelectedSpeaker(null)} title="Profil Pembicara">
                {selectedSpeaker && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#C5A059]/30">
                                <Image src={selectedSpeaker.image} alt={selectedSpeaker.name} fill className="object-cover" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-white">{selectedSpeaker.name}</h4>
                                {selectedSpeaker.subtitle && (
                                    <p className="text-[#D4B06A] text-sm italic">"{selectedSpeaker.subtitle}"</p>
                                )}
                                <p className="text-[#C5A059]">{selectedSpeaker.title}</p>
                                <p className="text-gray-400 text-sm">{selectedSpeaker.church}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-[#1A1A1A] rounded-xl border border-[#C5A059]/20">
                            <h5 className="text-[#C5A059] font-medium mb-2">Sesi yang Dibawakan</h5>
                            <p className="text-white text-lg font-semibold">"{selectedSpeaker.session.title}"</p>
                            {selectedSpeaker.session.subtitle && (
                                <p className="text-gray-300 text-sm mt-1">{selectedSpeaker.session.subtitle}</p>
                            )}
                            {selectedSpeaker.session.verse && (
                                <p className="text-[#C5A059] text-sm mt-2 italic">📖 {selectedSpeaker.session.verse}</p>
                            )}
                        </div>
                        <div className="space-y-4">
                            <h5 className="text-[#C5A059] font-medium">Tentang Pembicara</h5>
                            {selectedSpeaker.fullDescription.split('\n\n').map((para, index) => (
                                <p key={index} className="text-gray-300 leading-relaxed">{para}</p>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    )
}
