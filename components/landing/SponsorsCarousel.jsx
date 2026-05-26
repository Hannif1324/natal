'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getSponsors } from '@/services/data-sponsors'

export default function SponsorsCarousel() {
    const [isPaused, setIsPaused] = useState(false)
    const [sponsors, setSponsors] = useState([]) // Start empty, fetch from Supabase
    const [isLoading, setIsLoading] = useState(true)

    // Fetch sponsors from Supabase on mount
    useEffect(() => {
        getSponsors()
            .then(data => setSponsors(data))
            .finally(() => setIsLoading(false))
    }, [])

    // Double the sponsors for seamless infinite loop
    const doubleSponsors = [...sponsors, ...sponsors]

    // Don't render section if still loading or no sponsors available
    if (isLoading || sponsors.length === 0) {
        return null
    }

    return (
        <section className="py-12 sm:py-16 bg-[#1A1A1A] border-y border-[#C5A059]/10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Label */}
                <div className="text-center mb-8">
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-2">Didukung Oleh</p>
                    <div className="flex items-center justify-center gap-4">
                        <span className="w-16 h-px bg-gradient-to-r from-transparent to-[#C5A059]/50" />
                        <span className="text-[#C5A059]">✦</span>
                        <span className="w-16 h-px bg-gradient-to-l from-transparent to-[#C5A059]/50" />
                    </div>
                </div>
            </div>

            {/* Infinite Marquee - Seamless CSS Animation */}
            <div
                className="relative"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Gradient Fade Edges - smaller fade */}
                <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#1A1A1A] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#1A1A1A] to-transparent z-10 pointer-events-none" />

                {/* Scrolling Container */}
                <div className="flex overflow-hidden">
                    {/* First Track */}
                    <div
                        className="flex gap-8 sm:gap-12 shrink-0 animate-scroll"
                        style={{
                            animationPlayState: isPaused ? 'paused' : 'running'
                        }}
                    >
                        {doubleSponsors.map((sponsor, index) => (
                            <a
                                key={`a-${sponsor.id}-${index}`}
                                href={sponsor.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 group"
                            >
                                <div className="relative w-48 h-20 p-2 flex items-center justify-center transition-all duration-300 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-110">
                                    <Image
                                        src={sponsor.logo}
                                        alt={sponsor.name}
                                        width={160}
                                        height={64}
                                        className="object-contain max-h-16"
                                        unoptimized
                                    />
                                </div>
                            </a>
                        ))}
                    </div>
                    {/* Second Track (duplicate for seamless loop) */}
                    <div
                        className="flex gap-8 sm:gap-12 shrink-0 animate-scroll"
                        style={{
                            animationPlayState: isPaused ? 'paused' : 'running'
                        }}
                    >
                        {doubleSponsors.map((sponsor, index) => (
                            <a
                                key={`b-${sponsor.id}-${index}`}
                                href={sponsor.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 group"
                            >
                                <div className="relative w-48 h-20 p-2 flex items-center justify-center transition-all duration-300 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-110">
                                    <Image
                                        src={sponsor.logo}
                                        alt={sponsor.name}
                                        width={160}
                                        height={64}
                                        className="object-contain max-h-16"
                                        unoptimized
                                    />
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scroll {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(-100%);
                    }
                }
                .animate-scroll {
                    animation: scroll 15s linear infinite;
                }
            `}</style>
        </section>
    )
}
