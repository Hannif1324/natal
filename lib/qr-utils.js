// =====================================================
// QR CODE UTILITIES
// =====================================================
// Utilities untuk generate dan handle QR Code
// =====================================================

/**
 * Generate QR Code data URL
 * Uses qrcode library
 */
export async function generateQRCode(data, options = {}) {
    // Dynamic import for client-side only
    if (typeof window === 'undefined') {
        return null
    }

    try {
        const QRCode = (await import('qrcode')).default

        const defaultOptions = {
            width: 256,
            margin: 2,
            color: {
                dark: '#2C2C2C',  // Javanese dark charcoal
                light: '#FFFFFF'
            },
            ...options
        }

        const qrDataUrl = await QRCode.toDataURL(data, defaultOptions)
        return qrDataUrl
    } catch (error) {
        console.error('Error generating QR code:', error)
        return null
    }
}

/**
 * Generate QR Code as canvas element
 */
export async function generateQRCodeCanvas(data, canvas, options = {}) {
    if (typeof window === 'undefined') {
        return null
    }

    try {
        const QRCode = (await import('qrcode')).default

        const defaultOptions = {
            width: 256,
            margin: 2,
            color: {
                dark: '#2C2C2C',
                light: '#FFFFFF'
            },
            ...options
        }

        await QRCode.toCanvas(canvas, data, defaultOptions)
        return true
    } catch (error) {
        console.error('Error generating QR canvas:', error)
        return false
    }
}

/**
 * Create QR data payload for attendee
 * Contains unique ID and verification hash
 */
export function createQRPayload(attendee) {
    const payload = {
        id: attendee.unique_id,
        name: attendee.name,
        email: attendee.email,
        timestamp: Date.now()
    }

    // Return as JSON string for QR encoding
    return JSON.stringify(payload)
}

/**
 * Parse QR data payload
 */
export function parseQRPayload(qrData) {
    try {
        const payload = JSON.parse(qrData)
        return {
            success: true,
            data: payload
        }
    } catch (error) {
        return {
            success: false,
            error: 'Invalid QR code data'
        }
    }
}

/**
 * Validate QR code against attendee record
 */
export function validateQRCode(qrPayload, attendeeRecord) {
    if (!qrPayload || !attendeeRecord) {
        return { valid: false, message: 'Data tidak lengkap' }
    }

    if (qrPayload.id !== attendeeRecord.unique_id) {
        return { valid: false, message: 'ID tidak cocok' }
    }

    if (attendeeRecord.checked_in) {
        return { valid: false, message: 'Tiket sudah digunakan (check-in)' }
    }

    if (attendeeRecord.payment_status !== 'verified') {
        return { valid: false, message: 'Pembayaran belum terverifikasi' }
    }

    return { valid: true, message: 'Tiket valid' }
}

/**
 * Download QR code as image
 */
export function downloadQRCode(dataUrl, filename = 'tiket-natal') {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${filename}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
