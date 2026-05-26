'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { openingData } from '@/services/data-opening'

export default function OpeningOverlay({ onComplete }) {
    const [phase, setPhase] = useState('loading') // loading, blackscreen, layer1, layer1-fadeout, layer2, fadeout, complete
    const [visibleTexts, setVisibleTexts] = useState([])
    const [animationStarted, setAnimationStarted] = useState(false)
    const [imagesLoaded, setImagesLoaded] = useState(false)

    const { gunungan, welcomeTexts, timing } = openingData

    // Preload all 4 gunungan images before starting animation
    useEffect(() => {
        const imageUrls = [
            gunungan.left.front,
            gunungan.left.back,
            gunungan.right.front,
            gunungan.right.back
        ]
        let loadedCount = 0

        const preloadImages = () => {
            imageUrls.forEach((url) => {
                const img = new window.Image()
                img.onload = () => {
                    loadedCount++
                    if (loadedCount === imageUrls.length) {
                        setImagesLoaded(true)
                    }
                }
                img.onerror = () => {
                    loadedCount++
                    if (loadedCount === imageUrls.length) {
                        setImagesLoaded(true) // Continue even if error
                    }
                }
                img.src = url
            })
        }

        preloadImages()
    }, [gunungan.left.front, gunungan.left.back, gunungan.right.front, gunungan.right.back])

    // Start animation sequence after images are loaded
    useEffect(() => {
        if (!imagesLoaded) return

        // Transition from loading to blackscreen
        setPhase('blackscreen')

        const { initialDelay, slideInDuration, meetCenterPause, slideOutDuration } = timing.layer1

        // Phase 2: Start Layer 1 gunungan animation after initial delay
        const layer1Timer = setTimeout(() => {
            setPhase('layer1')
            setAnimationStarted(true)
        }, initialDelay * 1000)

        // Phase 3: Fade out Layer 1 AFTER slide out animation completes
        const layer1FadeTimer = setTimeout(() => {
            setPhase('layer1-fadeout')
        }, (initialDelay + slideInDuration + meetCenterPause + slideOutDuration) * 1000)

        // Phase 4: Start Layer 2 after fade out completes (0.5s after fade starts)
        const layer2Timer = setTimeout(() => {
            setPhase('layer2')
        }, (initialDelay + slideInDuration + meetCenterPause + slideOutDuration + 0.5) * 1000)

        return () => {
            clearTimeout(layer1Timer)
            clearTimeout(layer1FadeTimer)
            clearTimeout(layer2Timer)
        }
    }, [imagesLoaded, timing.layer1])

    // Layer 2: Show texts sequentially
    useEffect(() => {
        if (phase !== 'layer2') return

        const textTimers = welcomeTexts.map((item) => {
            return setTimeout(() => {
                setVisibleTexts(prev => [...prev, item.id])
            }, item.delay * 1000)
        })

        // After all texts shown + pause, start fade out
        const fadeOutTimer = setTimeout(() => {
            setPhase('fadeout')
        }, (timing.layer2.total - 0.5) * 1000)

        // Complete after fade out
        const completeTimer = setTimeout(() => {
            setPhase('complete')
            if (onComplete) onComplete()
        }, timing.layer2.total * 1000)

        return () => {
            textTimers.forEach(timer => clearTimeout(timer))
            clearTimeout(fadeOutTimer)
            clearTimeout(completeTimer)
        }
    }, [phase, welcomeTexts, timing.layer2, onComplete])

    // Hide overlay when complete
    if (phase === 'complete') return null

    return (
        <div
            className={`fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-500
                ${phase === 'fadeout' ? 'opacity-0 pointer-events-none' : 'opacity-100'}
            `}
        >
            {/* Black Screen - Always visible as base */}
            <div className="absolute inset-0 bg-[#0F0F0F]" />

            {/* Loading State - Show spinner while images load */}
            {phase === 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin mb-4" />
                    <p className="text-[#C5A059]/60 text-sm">Memuat...</p>
                </div>
            )}

            {/* Layer 1: 4-Asset Gunungan Animation - 4 separate elements */}
            {(phase === 'blackscreen' || phase === 'layer1' || phase === 'layer1-fadeout') && (
                <div
                    className={`absolute inset-0 transition-opacity duration-500
                        ${phase === 'layer1-fadeout' ? 'opacity-0' : 'opacity-100'}
                    `}
                >
                    {/* Left Gunungan Container - Back and Front stacked */}
                    <div
                        className="absolute top-0 left-0 h-full w-[65%] sm:w-[55%] md:w-[50%]"
                        style={{
                            visibility: animationStarted ? 'visible' : 'hidden',
                            animation: animationStarted
                                ? `slideInFromLeft ${timing.layer1.slideInDuration}s ease-out forwards, 
                                   slideOutToLeft ${timing.layer1.slideOutDuration}s ease-in ${timing.layer1.slideInDuration + timing.layer1.meetCenterPause}s forwards`
                                : 'none',
                        }}
                    >
                        <div className="relative w-full h-full flex items-center justify-end">
                            {/* Back layer */}
                            <Image
                                src={gunungan.left.back}
                                alt="Gunungan Kiri Back"
                                width={1000}
                                height={1500}
                                className="absolute h-full w-auto max-w-none object-contain object-right"
                                style={{ zIndex: 1 }}
                                priority
                            />
                            {/* Front layer */}
                            <Image
                                src={gunungan.left.front}
                                alt="Gunungan Kiri Front"
                                width={1000}
                                height={1500}
                                className="absolute h-full w-auto max-w-none object-contain object-right"
                                style={{ zIndex: 2 }}
                                priority
                            />
                        </div>
                    </div>

                    {/* Right Gunungan Container - Back and Front stacked */}
                    <div
                        className="absolute top-0 right-0 h-full w-[65%] sm:w-[55%] md:w-[50%]"
                        style={{
                            visibility: animationStarted ? 'visible' : 'hidden',
                            animation: animationStarted
                                ? `slideInFromRight ${timing.layer1.slideInDuration}s ease-out forwards, 
                                   slideOutToRight ${timing.layer1.slideOutDuration}s ease-in ${timing.layer1.slideInDuration + timing.layer1.meetCenterPause}s forwards`
                                : 'none',
                        }}
                    >
                        <div className="relative w-full h-full flex items-center justify-start">
                            {/* Back layer */}
                            <Image
                                src={gunungan.right.back}
                                alt="Gunungan Kanan Back"
                                width={1000}
                                height={1500}
                                className="absolute h-full w-auto max-w-none object-contain object-left"
                                style={{ zIndex: 1 }}
                                priority
                            />
                            {/* Front layer */}
                            <Image
                                src={gunungan.right.front}
                                alt="Gunungan Kanan Front"
                                width={1000}
                                height={1500}
                                className="h-full w-auto max-w-none object-contain object-left"
                                priority
                            />
                        </div>
                    </div>

                </div>
            )}

            {/* Layer 2: Welcome Text Animation */}
            {(phase === 'layer2' || phase === 'fadeout') && (
                <div
                    className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] flex flex-col items-center justify-center px-4"
                    style={{
                        animation: 'fadeIn 0.5s ease-out forwards'
                    }}
                >
                    {/* Decorative top ornament */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-50">
                        <span className="w-16 h-0.5 bg-gradient-to-r from-transparent to-[#C5A059]" />
                        <span className="text-[#C5A059]">✦</span>
                        <span className="w-16 h-0.5 bg-gradient-to-l from-transparent to-[#C5A059]" />
                    </div>

                    {/* Welcome Texts */}
                    <div className="text-center space-y-6 sm:space-y-8 px-4">
                        {welcomeTexts.map((item) => (
                            <div
                                key={item.id}
                                className={`transition-all duration-700 ease-out
                                    ${visibleTexts.includes(item.id)
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-8'}
                                `}
                            >
                                {item.type === 'javanese' && (
                                    <p className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#C5A059] via-[#D4B06A] to-[#C5A059] bg-clip-text text-transparent font-[family-name:var(--font-heading)] leading-relaxed py-2">
                                        {item.text}
                                    </p>
                                )}
                                {item.type === 'subtitle' && (
                                    <p className="text-lg sm:text-xl md:text-2xl text-gray-300">
                                        {item.text}
                                    </p>
                                )}
                                {item.type === 'theme' && (
                                    <p className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#C5A059] font-[family-name:var(--font-heading)] mt-4 leading-relaxed py-1">
                                        "{item.text}"
                                    </p>
                                )}
                                {item.type === 'verse' && (
                                    <p className="text-base sm:text-lg md:text-xl text-gray-400 italic">
                                        {item.text}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Decorative bottom ornament */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-50">
                        <span className="w-16 h-0.5 bg-gradient-to-r from-transparent to-[#C5A059]" />
                        <span className="text-[#C5A059]">✦</span>
                        <span className="w-16 h-0.5 bg-gradient-to-l from-transparent to-[#C5A059]" />
                    </div>

                    {/* Subtle ambient glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
                </div>
            )}

            {/* CSS Keyframes */}
            <style jsx>{`
                @keyframes slideInFromLeft {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(0); }
                }
                @keyframes slideOutToLeft {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes slideInFromRight {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(0); }
                }
                @keyframes slideOutToRight {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(100%); }
                }
                @keyframes fadeInOut {
                    0% { opacity: 0; }
                    30% { opacity: 1; }
                    70% { opacity: 1; }
                    100% { opacity: 0; }
                }
                @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    )
}
