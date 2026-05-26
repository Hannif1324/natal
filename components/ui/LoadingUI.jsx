'use client'

// Reusable Loading Button with spinner animation
export function LoadingButton({
    children,
    loading = false,
    disabled = false,
    variant = 'primary', // primary, secondary, danger
    size = 'md', // sm, md, lg
    className = '',
    ...props
}) {
    const baseStyles = "relative font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed"

    const variants = {
        primary: "bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-[#2C2C2C] hover:shadow-[0_4px_20px_rgba(197,160,89,0.4)] hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0",
        secondary: "bg-[#252525] text-[#C5A059] border border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#C5A059]/10 disabled:opacity-50",
        danger: "bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-[0_4px_20px_rgba(239,68,68,0.3)] hover:-translate-y-0.5 disabled:opacity-60",
        ghost: "bg-transparent text-gray-400 hover:text-[#C5A059] hover:bg-[#C5A059]/10 disabled:opacity-50"
    }

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    }

    return (
        <button
            disabled={loading || disabled}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            )}
            <span className={loading ? 'opacity-0' : ''}>{children}</span>
            {loading && <span className="absolute inset-0 flex items-center justify-center">Memproses...</span>}
        </button>
    )
}

// Loading Spinner component
export function LoadingSpinner({ size = 'md', className = '' }) {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12'
    }

    return (
        <svg className={`animate-spin ${sizes[size]} ${className}`} viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    )
}

// Full page loading state
export function PageLoader({ message = 'Memuat...' }) {
    return (
        <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center gap-4">
            <LoadingSpinner size="xl" className="text-[#C5A059]" />
            <p className="text-[#C5A059] animate-pulse">{message}</p>
        </div>
    )
}

// Skeleton loading for cards
export function CardSkeleton({ count = 1 }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#C5A059]/10 animate-pulse">
                    <div className="h-10 w-10 bg-[#252525] rounded-lg mb-4" />
                    <div className="h-4 w-24 bg-[#252525] rounded mb-2" />
                    <div className="h-8 w-16 bg-[#252525] rounded" />
                </div>
            ))}
        </>
    )
}
