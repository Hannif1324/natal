'use client'

import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { Check, X, AlertCircle, Info } from 'lucide-react'

// Toast Context
const ToastContext = createContext(null)

// Toast types with their styles
const toastStyles = {
    success: {
        bg: 'bg-gradient-to-r from-[#1A3A1A] to-[#0F2F0F]',
        border: 'border-green-500/30',
        icon: Check,
        iconBg: 'bg-green-500/20',
        iconColor: 'text-green-400'
    },
    error: {
        bg: 'bg-gradient-to-r from-[#3A1A1A] to-[#2F0F0F]',
        border: 'border-red-500/30',
        icon: X,
        iconBg: 'bg-red-500/20',
        iconColor: 'text-red-400'
    },
    warning: {
        bg: 'bg-gradient-to-r from-[#3A2A1A] to-[#2F1F0F]',
        border: 'border-yellow-500/30',
        icon: AlertCircle,
        iconBg: 'bg-yellow-500/20',
        iconColor: 'text-yellow-400'
    },
    info: {
        bg: 'bg-gradient-to-r from-[#252525] to-[#1A1A1A]',
        border: 'border-[#C5A059]/30',
        icon: Info,
        iconBg: 'bg-[#C5A059]/20',
        iconColor: 'text-[#C5A059]'
    }
}

// Single Toast Component
function ToastItem({ id, message, type = 'info', onClose }) {
    const [isVisible, setIsVisible] = useState(false)
    const [isLeaving, setIsLeaving] = useState(false)
    const style = toastStyles[type] || toastStyles.info
    const Icon = style.icon

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setIsVisible(true))

        // Auto dismiss after 3 seconds
        const timer = setTimeout(() => {
            setIsLeaving(true)
            setTimeout(() => onClose(id), 300)
        }, 3000)

        return () => clearTimeout(timer)
    }, [id, onClose])

    return (
        <div
            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm
                ${style.bg} ${style.border}
                transform transition-all duration-300 ease-out
                ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            `}
        >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${style.iconBg}`}>
                <Icon className={`w-4 h-4 ${style.iconColor}`} />
            </div>
            <p className="text-white text-sm font-medium">{message}</p>
            <button
                onClick={() => {
                    setIsLeaving(true)
                    setTimeout(() => onClose(id), 300)
                }}
                className="ml-2 text-gray-400 hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}

// Toast Container Component
export function ToastContainer({ children }) {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now() + Math.random()
        setToasts(prev => [...prev, { id, message, type }])
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    const toast = useCallback({
        success: (message) => addToast(message, 'success'),
        error: (message) => addToast(message, 'error'),
        warning: (message) => addToast(message, 'warning'),
        info: (message) => addToast(message, 'info'),
    }, [addToast])

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Toast Container - Fixed at bottom right */}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
                {toasts.map(t => (
                    <ToastItem
                        key={t.id}
                        id={t.id}
                        message={t.message}
                        type={t.type}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

// Hook to use toast
export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        // Return dummy functions if not in provider (for SSR safety)
        return {
            success: () => { },
            error: () => { },
            warning: () => { },
            info: () => { }
        }
    }
    return context
}

// Simple standalone toast (untuk penggunaan tanpa provider)
export function showToast(message, type = 'info') {
    // Create toast container if doesn't exist
    let container = document.getElementById('standalone-toast-container')
    if (!container) {
        container = document.createElement('div')
        container.id = 'standalone-toast-container'
        container.className = 'fixed bottom-4 right-4 z-[9999] flex flex-col gap-2'
        document.body.appendChild(container)
    }

    const style = toastStyles[type] || toastStyles.info

    // Create toast element
    const toast = document.createElement('div')
    toast.className = `
        flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm
        ${style.bg} ${style.border}
        transform transition-all duration-300 ease-out translate-x-full opacity-0
    `
    toast.innerHTML = `
        <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${style.iconBg}">
            <svg class="w-4 h-4 ${style.iconColor}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                ${type === 'success' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />' :
            type === 'error' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />' :
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />'}
            </svg>
        </div>
        <p class="text-white text-sm font-medium">${message}</p>
    `

    container.appendChild(toast)

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full', 'opacity-0')
        toast.classList.add('translate-x-0', 'opacity-100')
    })

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('translate-x-0', 'opacity-100')
        toast.classList.add('translate-x-full', 'opacity-0')
        setTimeout(() => toast.remove(), 300)
    }, 3000)
}

export default ToastContainer
