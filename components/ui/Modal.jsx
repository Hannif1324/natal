'use client'

import { useEffect, useRef } from 'react'

export default function Modal({ isOpen, onClose, children, title }) {
    const modalRef = useRef(null)

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    const handleBackdropClick = (e) => {
        if (e.target === modalRef.current) {
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div
            ref={modalRef}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        >
            <div className="relative w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#252525] to-[#1A1A1A] rounded-xl sm:rounded-2xl border border-[#C5A059]/30 shadow-2xl animate-scale-in mx-2 sm:mx-0">
                {/* Decorative corners - only show on larger screens, sticky to modal frame */}
                <div className="hidden sm:block pointer-events-none">
                    <div className="fixed top-0 left-0 w-6 sm:w-8 h-6 sm:h-8 border-t-2 border-l-2 border-[#C5A059]/60 rounded-tl-2xl" style={{ position: 'absolute' }} />
                    <div className="fixed top-0 right-0 w-6 sm:w-8 h-6 sm:h-8 border-t-2 border-r-2 border-[#C5A059]/60 rounded-tr-2xl" style={{ position: 'absolute' }} />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#C5A059]/20">
                    {title && (
                        <h3 className="text-xl font-bold text-[#C5A059] font-[family-name:var(--font-heading)]">
                            {title}
                        </h3>
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#C5A059]/10 rounded-full transition-colors ml-auto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                    {children}
                </div>
            </div>

            <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
        </div>
    )
}
