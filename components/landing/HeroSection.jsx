'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { heroData } from '@/services/data-hero'

export default function HeroSection() {
    const { title, verse, cta, images, event } = heroData

    // Breakpoint detection for responsive gunungan transform
    const [breakpoint, setBreakpoint] = useState('desktop')

    useEffect(() => {
        const checkBreakpoint = () => {
            const width = window.innerWidth
            if (width < 768) {
                setBreakpoint('mobile')
            } else if (width < 1024) {
                setBreakpoint('tablet')
            } else {
                setBreakpoint('desktop')
            }
        }

        checkBreakpoint()
        window.addEventListener('resize', checkBreakpoint)
        return () => window.removeEventListener('resize', checkBreakpoint)
    }, [])

    // ========================================
    // GUNUNGAN CONFIGURATION - Edit values here
    // ========================================
    const gununganConfig = {
        left: {
            // Rotation (dalam derajat) - positif = searah jarum jam
            rotate: {
                mobile: -1,      // Mobile: 0 derajat
                tablet: 0,      // Tablet (md): 0 derajat  
                desktop: -6,     // Desktop (lg+): 0 derajat
            },
            // Posisi X (dalam %) - negatif = geser ke kiri (overflow)
            offsetX: {
                mobile: -40,    // Mobile: -20% ke kiri
                tablet: -48,    // Tablet: -15% ke kiri
                desktop: -11.5,   // Desktop: -10% ke kiri
            },
            // Posisi Y (dalam %) - negatif = geser ke bawah
            offsetY: {
                mobile: 4,
                tablet: 6,
                desktop: 5,
            },
        },
        right: {
            // Rotation (dalam derajat) - negatif = berlawanan jarum jam
            rotate: {
                mobile: 0,
                tablet: 0,
                desktop: 6,
            },
            // Posisi X (dalam %) - positif = geser ke kanan (overflow)
            offsetX: {
                mobile: 40,     // Mobile: 20% ke kanan
                tablet: 48,     // Tablet: 15% ke kanan
                desktop: 11,    // Desktop: 10% ke kanan
            },
            // Posisi Y
            offsetY: {
                mobile: 4,
                tablet: 6,
                desktop: 5,
            },
        },
    }

    // ========================================
    // WAYANG CONFIGURATION - Edit values here
    // ========================================
    const wayangConfig = {
        left: {
            // Rotation (dalam derajat) - positif = searah jarum jam
            rotate: {
                mobile: -12,
                tablet: -12,
                desktop: -12,
            },
            // Posisi X (dalam %) - negatif = geser ke kiri
            offsetX: {
                mobile: 2,
                tablet: -5,
                desktop: 0,
            },
            // Posisi Y (dalam %) - negatif = geser ke atas
            offsetY: {
                mobile: -11.5,
                tablet: 0,
                desktop: -7,
            },
        },
        right: {
            // Rotation (dalam derajat) - negatif = berlawanan jarum jam
            rotate: {
                mobile: 0,
                tablet: 0,
                desktop: 0,
            },
            // Posisi X (dalam %) - positif = geser ke kanan
            offsetX: {
                mobile: 0,
                tablet: 0,
                desktop: 0,
            },
            // Posisi Y
            offsetY: {
                mobile: 0,
                tablet: 12,
                desktop: 0,
            },
        },
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0F0F0F]">
            {/* Animated Batik Pattern Background - using background-position for seamless loop */}
            <div
                className="absolute inset-0 opacity-10 animate-bg-scroll"
                style={{
                    backgroundImage: `url(${images.background})`,
                    backgroundSize: '400px',
                    backgroundRepeat: 'repeat',
                }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F] via-transparent to-[#0F0F0F]" />

            {/* Left Gunungan - Behind Wayang */}
            <div
                className="absolute left-0 bottom-0 w-[56%] sm:w-[56%] md:w-[50%] lg:w-[90%] xl:w-[90%] h-full z-[5] opacity-30 sm:opacity-40 lg:opacity-50"
            >
                <Image
                    src="/Opening_Gunungan/gunungan-full-left-front.webp"
                    alt="Gunungan Kiri"
                    fill
                    className="object-contain object-left-bottom"
                    style={{
                        transform: `rotate(${gununganConfig.left.rotate[breakpoint]}deg) translate(${gununganConfig.left.offsetX[breakpoint]}%, ${gununganConfig.left.offsetY[breakpoint]}%)`,
                    }}
                    priority
                />
            </div>

            {/* Right Gunungan - Behind Wayang */}
            <div
                className="absolute right-0 bottom-0 w-[56%] sm:w-[56%] md:w-[50%] lg:w-[90%] xl:w-[90%] h-full z-[5] opacity-30 sm:opacity-40 lg:opacity-50"
            >
                <Image
                    src="/Opening_Gunungan/gunungan-full-left-front.webp"
                    alt="Gunungan Kanan"
                    fill
                    className="object-contain object-right-bottom"
                    style={{
                        transform: `rotate(${gununganConfig.right.rotate[breakpoint]}deg) translate(${gununganConfig.right.offsetX[breakpoint]}%, ${gununganConfig.right.offsetY[breakpoint]}%)`,
                    }}
                    priority
                />
            </div>

            {/* Left Wayang - Biarawati */}
            <div className="absolute left-0 -bottom-12 w-[18rem] sm:w-[22rem] md:w-[22rem] lg:w-[34rem] xl:w-[40rem] h-auto z-10 animate-float-slow opacity-100 sm:opacity-100 lg:opacity-100">
                <Image
                    src={images.leftWayang}
                    alt="Wayang Biarawati"
                    width={1400}
                    height={2200}
                    className="object-contain drop-shadow-2xl"
                    style={{
                        transform: `rotate(${wayangConfig.left.rotate[breakpoint]}deg) translate(${wayangConfig.left.offsetX[breakpoint]}%, ${wayangConfig.left.offsetY[breakpoint]}%)`,
                    }}
                    priority
                />
            </div>

            {/* Right Wayang - Pastor */}
            <div className="absolute right-0 -bottom-8 w-[16rem] sm:w-[20rem] md:w-[20rem] lg:w-[30rem] xl:w-[36rem] h-auto z-10 animate-float-slow-reverse opacity-100 sm:opacity-100 lg:opacity-100">
                <Image
                    src={images.rightWayang}
                    alt="Wayang Pastor"
                    width={1400}
                    height={2200}
                    className="object-contain drop-shadow-2xl"
                    style={{
                        transform: `rotate(${wayangConfig.right.rotate[breakpoint]}deg) translate(${wayangConfig.right.offsetX[breakpoint]}%, ${wayangConfig.right.offsetY[breakpoint]}%)`,
                    }}
                    priority
                />
            </div>

            {/* Main Content */}
            <div className="relative z-20 text-center px-4 max-w-4xl mx-auto pt-16 sm:pt-20">
                {/* Event Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-full">
                    <span className="text-[#C5A059] text-sm">{event.name}</span>
                    <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
                    <span className="text-[#C5A059] text-sm">{event.year}</span>
                </div>

                {/* Main Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-[family-name:var(--font-heading)]">
                    <span className="bg-gradient-to-r from-[#C5A059] via-[#D4B06A] to-[#C5A059] bg-clip-text text-transparent">
                        {title}
                    </span>
                </h1>

                {/* Decorative Line */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-[#C5A059]" />
                    <span className="text-[#C5A059] text-2xl">✦</span>
                    <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-[#C5A059]" />
                </div>

                {/* Bible Verse */}
                <div className="max-w-2xl mx-auto mb-10">
                    <p className="text-lg sm:text-xl text-gray-300 italic mb-3 leading-relaxed">
                        "{verse.text}"
                    </p>
                    <p className="text-[#C5A059] font-medium">
                        {verse.reference}
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href={cta.primary.href}
                        className="group relative px-8 py-4 bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-[#2C2C2C] font-bold rounded-xl shadow-[0_4px_20px_rgba(197,160,89,0.3)] hover:shadow-[0_6px_30px_rgba(197,160,89,0.5)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {cta.primary.text}
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                    </Link>

                    <a
                        href={cta.secondary.href}
                        className="group px-8 py-4 text-[#C5A059] font-semibold border-2 border-[#C5A059]/50 rounded-xl hover:border-[#C5A059] hover:bg-[#C5A059]/10 transition-all duration-300 flex items-center gap-2"
                    >
                        {cta.secondary.text}
                        <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </a>
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
