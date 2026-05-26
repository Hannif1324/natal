'use client'

import { cn } from '@/lib/utils'

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    href,
    className,
    ...props
}) {
    const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-300 cursor-pointer"

    const variants = {
        primary: "bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-[#2C2C2C] hover:shadow-[0_6px_24px_rgba(197,160,89,0.4)] hover:-translate-y-0.5",
        secondary: "bg-transparent text-[#C5A059] border-2 border-[#C5A059] hover:bg-[#C5A059] hover:text-[#2C2C2C]",
        ghost: "bg-transparent text-[#C5A059] hover:bg-[#C5A059]/10",
        danger: "bg-red-600 text-white hover:bg-red-700"
    }

    const sizes = {
        sm: "px-4 py-2.5 text-sm rounded-lg min-h-[40px]",
        md: "px-6 py-3 text-base rounded-lg min-h-[44px]",
        lg: "px-8 py-4 text-lg rounded-xl min-h-[52px]"
    }

    const classes = cn(baseStyles, variants[variant], sizes[size], className)

    if (href) {
        return (
            <a href={href} className={classes} {...props}>
                {children}
            </a>
        )
    }

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    )
}
