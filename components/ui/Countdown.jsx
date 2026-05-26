'use client'

import { useState, useEffect } from 'react'
import { calculateCountdown } from '@/lib/utils'

export default function Countdown({
    targetDate,
    labels = { days: 'Hari', hours: 'Jam', minutes: 'Menit', seconds: 'Detik' },
    variant = 'default',
    onExpired
}) {
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false })
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        const updateCountdown = () => {
            const result = calculateCountdown(targetDate)
            setCountdown(result)

            if (result.expired && onExpired) {
                onExpired()
            }
        }

        updateCountdown()
        const interval = setInterval(updateCountdown, 1000)

        return () => clearInterval(interval)
    }, [targetDate, onExpired])

    if (!mounted) {
        return (
            <div className="flex gap-4 justify-center">
                {['00', '00', '00', '00'].map((_, i) => (
                    <div key={i} className="w-14 sm:w-20 h-[4.5rem] sm:h-24 bg-[#252525] rounded-lg animate-pulse" />
                ))}
            </div>
        )
    }

    const timeUnits = [
        { value: countdown.days, label: labels.days },
        { value: countdown.hours, label: labels.hours },
        { value: countdown.minutes, label: labels.minutes },
        { value: countdown.seconds, label: labels.seconds }
    ]

    // Different style variants untuk variasi
    const variantStyles = {
        default: {
            container: "bg-gradient-to-b from-[#252525] to-[#1A1A1A] border border-[#C5A059]/30",
            number: "text-[#C5A059]",
            label: "text-gray-400"
        },
        urgent: {
            container: "bg-gradient-to-b from-[#4A0404] to-[#2C0202] border border-[#C5A059]/50",
            number: "text-[#D4B06A]",
            label: "text-[#C5A059]/80"
        },
        celebration: {
            container: "bg-gradient-to-b from-[#1A3A1A] to-[#0F1F0F] border border-[#C5A059]/40",
            number: "text-white",
            label: "text-[#C5A059]"
        }
    }

    const styles = variantStyles[variant] || variantStyles.default

    return (
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
            {timeUnits.map((unit, index) => (
                <div key={index} className="flex flex-col items-center">
                    {/* Number box */}
                    <div className={`w-14 sm:w-20 h-[4.5rem] sm:h-24 flex items-center justify-center rounded-xl ${styles.container} shadow-lg relative overflow-hidden`}>
                        {/* Decorative corner */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#C5A059]/50 rounded-tl-xl" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#C5A059]/50 rounded-br-xl" />

                        <span className={`text-2xl sm:text-4xl font-bold ${styles.number} font-[family-name:var(--font-heading)]`}>
                            {String(unit.value).padStart(2, '0')}
                        </span>
                    </div>

                    {/* Label */}
                    <span className={`mt-2 text-xs sm:text-sm uppercase tracking-wider ${styles.label}`}>
                        {unit.label}
                    </span>
                </div>
            ))}
        </div>
    )
}
