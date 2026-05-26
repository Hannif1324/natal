'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { partnersData, partnerCarouselSettings } from '@/services/data-partners'
import { AnimateOnScroll } from '@/lib/animations'

export default function PartnersCarousel() {
    const [currentPage, setCurrentPage] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [itemsPerPage, setItemsPerPage] = useState(4)

    // Touch/Swipe support
    const touchStartX = useRef(0)
    const touchEndX = useRef(0)
    const containerRef = useRef(null)

    // Responsive items per page
    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth < 640) {
                setItemsPerPage(1) // Mobile: 1 card
            } else if (window.innerWidth < 1024) {
                setItemsPerPage(2) // Tablet: 2 cards
            } else {
                setItemsPerPage(4) // Desktop: 4 cards
            }
        }

        updateItemsPerPage()
        window.addEventListener('resize', updateItemsPerPage)
        return () => window.removeEventListener('resize', updateItemsPerPage)
    }, [])

    // Calculate total pages based on current itemsPerPage
    const totalPages = Math.ceil(partnersData.length / itemsPerPage)

    // Reset page if current page exceeds total pages after resize
    useEffect(() => {
        if (currentPage >= totalPages) {
            setCurrentPage(0)
        }
    }, [totalPages, currentPage])

    // Auto-slide every 5 seconds
    useEffect(() => {
        if (isPaused) return

        const interval = setInterval(() => {
            setCurrentPage((prev) => (prev + 1) % totalPages)
        }, partnerCarouselSettings.autoSlideInterval)

        return () => clearInterval(interval)
    }, [isPaused, totalPages])

    const goToPage = (index) => {
        setCurrentPage(index)
    }

    const goToPrev = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
    }

    const goToNext = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages)
    }

    // Touch handlers for swipe support
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX
        setIsPaused(true)
    }

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX
    }

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current
        const threshold = 50 // minimum swipe distance

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                goToNext() // Swipe left = next
            } else {
                goToPrev() // Swipe right = prev
            }
        }

        // Resume auto-slide after a delay
        setTimeout(() => setIsPaused(false), 3000)
    }

    return (
        <section className="py-20 sm:py-28 bg-[#0F0F0F] relative overflow-hidden">
            {/* Batik pattern background */}
            <div
                className="absolute inset-0 opacity-10 animate-bg-scroll"
                style={{
                    backgroundImage: `url('/vecteezy_brown-ornament-batik-mega-mendung-cirebon-indonesia-with_24037227.webp')`,
                    backgroundSize: '300px',
                    backgroundRepeat: 'repeat',
                }}
            />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Section Header */}
                <AnimateOnScroll animation="fadeUp">
                    <div className="text-center mb-16">
                        <p className="text-[#C5A059] uppercase tracking-[0.2em] text-sm mb-4 font-medium">
                            Partnership
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-heading)]">
                            <span className="text-white">Sekolah yang </span>
                            <span className="bg-gradient-to-r from-[#C5A059] to-[#D4B06A] bg-clip-text text-transparent">
                                Berpartisipasi
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto">
                            Kolaborasi antar sekolah di Kediri untuk merayakan Natal bersama
                        </p>

                        {/* Decorative */}
                        <div className="flex items-center justify-center gap-3 mt-6">
                            <span className="w-16 h-0.5 bg-gradient-to-r from-transparent to-[#C5A059]" />
                            <span className="text-[#C5A059]">✦</span>
                            <span className="w-16 h-0.5 bg-gradient-to-l from-transparent to-[#C5A059]" />
                        </div>
                    </div>
                </AnimateOnScroll>

                {/* Carousel Container */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Navigation Arrows - Positioned outside on desktop, overlaid on mobile */}
                    <button
                        onClick={goToPrev}
                        className="absolute left-0 sm:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-[#1A1A1A]/90 hover:bg-[#C5A059] text-[#C5A059] hover:text-[#2C2C2C] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border border-[#C5A059]/30 hover:border-[#C5A059]"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    <button
                        onClick={goToNext}
                        className="absolute right-0 sm:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-[#1A1A1A]/90 hover:bg-[#C5A059] text-[#C5A059] hover:text-[#2C2C2C] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border border-[#C5A059]/30 hover:border-[#C5A059]"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    {/* Slide Container with touch support */}
                    <div
                        ref={containerRef}
                        className="overflow-hidden mx-14 sm:mx-16 lg:mx-20"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{
                                transform: `translateX(-${currentPage * 100}%)`
                            }}
                        >
                            {/* Render all pages */}
                            {Array.from({ length: totalPages }).map((_, pageIndex) => (
                                <div
                                    key={pageIndex}
                                    className={`w-full flex-shrink-0 grid gap-4 sm:gap-6 ${itemsPerPage === 1 ? 'grid-cols-1 px-2' :
                                        itemsPerPage === 2 ? 'grid-cols-2' : 'grid-cols-4'
                                        }`}
                                >
                                    {partnersData
                                        .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                                        .map((partner) => (
                                            <div
                                                key={partner.id}
                                                className="group bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] rounded-2xl p-5 sm:p-6 border border-[#C5A059]/10 hover:border-[#C5A059]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(197,160,89,0.15)]"
                                            >
                                                {/* Logo Container - Better sizing for mobile */}
                                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-xl overflow-hidden bg-[#252525] p-2 sm:p-3">
                                                    <Image
                                                        src={partner.logo}
                                                        alt={partner.name}
                                                        fill
                                                        className="object-contain"
                                                        unoptimized
                                                    />
                                                </div>

                                                {/* School Info - Better spacing */}
                                                <div className="text-center space-y-2">
                                                    <span className="inline-block px-3 py-1 text-xs bg-[#C5A059]/10 text-[#C5A059] rounded-full">
                                                        {partner.type}
                                                    </span>
                                                    <h3 className="text-white font-bold text-sm sm:text-base font-[family-name:var(--font-heading)] group-hover:text-[#C5A059] transition-colors line-clamp-2">
                                                        {partner.name}
                                                    </h3>
                                                    <p className="text-gray-500 text-xs line-clamp-1">
                                                        {partner.address}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Swipe hint for mobile */}
                    <p className="text-center text-gray-500 text-xs mt-4 sm:hidden">
                        ← Swipe untuk melihat lebih banyak →
                    </p>
                </div>

                {/* Page Dots */}
                <div className="flex justify-center gap-2 mt-6 sm:mt-8">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToPage(index)}
                            className={`h-2.5 sm:h-2 rounded-full transition-all duration-300 ${index === currentPage
                                ? 'w-8 bg-[#C5A059]'
                                : 'w-2.5 sm:w-2 bg-[#C5A059]/30 hover:bg-[#C5A059]/60'
                                }`}
                            aria-label={`Go to page ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
            {/* Custom Animations */}
            <style jsx>{`
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                @keyframes float-slow-reverse {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes bg-scroll {
                    from { background-position: 0 0; }
                    to { background-position: 400px 0; }
                }
                .animate-float-slow {
                    animation: float-slow 4s ease-in-out infinite;
                }
                .animate-float-slow-reverse {
                    animation: float-slow-reverse 5s ease-in-out infinite;
                    animation-delay: 0.5s;
                }
                .animate-bg-scroll {
                    animation: bg-scroll 30s linear infinite;
                }
            `}</style>
        </section>
    )
}

