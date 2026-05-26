// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Generate unique ID untuk pendaftar
 * Format: NATAL-XXXX (4 digit random)
 */
export function generateUniqueId() {
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    return `NATAL-${randomNum}`
}

/**
 * Format tanggal ke format Indonesia
 */
export function formatDate(dateString, options = {}) {
    const date = new Date(dateString)
    const defaultOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
    }
    return date.toLocaleDateString('id-ID', defaultOptions)
}

/**
 * Format waktu ke format WIB
 */
export function formatTime(dateString) {
    const date = new Date(dateString)
    return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
    }) + ' WIB'
}

/**
 * Format currency ke Rupiah
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount)
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validate phone number (Indonesian format)
 * Lebih fleksibel: 10-13 digit setelah kode negara
 */
export function isValidPhone(phone) {
    // Hapus spasi dan strip
    const cleaned = phone.replace(/[\s\-\(\)]/g, '')
    // Minimal 10 digit, maksimal 15 digit (termasuk kode negara)
    // Format: 08xxx, +628xxx, 628xxx
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/
    return phoneRegex.test(cleaned)
}

/**
 * Normalize phone number to 62xxx format
 */
export function normalizePhone(phone) {
    let cleaned = phone.replace(/[\s-]/g, '')
    if (cleaned.startsWith('+62')) {
        cleaned = cleaned.slice(1)
    } else if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.slice(1)
    }
    return cleaned
}

/**
 * Calculate countdown values
 */
export function calculateCountdown(targetDate) {
    const now = new Date().getTime()
    const target = new Date(targetDate).getTime()
    const difference = target - now

    if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
    }

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        expired: false
    }
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + '...'
}

/**
 * Convert file to base64
 */
export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}

/**
 * Scroll to element with smooth behavior
 */
export function scrollToElement(elementId) {
    const element = document.getElementById(elementId)
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
}

/**
 * Debounce function
 */
export function debounce(func, wait = 300) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element) {
    const rect = element.getBoundingClientRect()
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
}

/**
 * Class name utility (like clsx)
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(' ')
}
