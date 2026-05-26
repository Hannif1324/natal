// =====================================================
// COUNTDOWN DATA SERVICE
// =====================================================
// Data lokal untuk Countdown Sections
// 1. Countdown Tiket (27 December 2024)
// 2. Countdown Acara (10 January 2025)
// =====================================================

export const countdownData = {
    // Countdown untuk deadline tiket
    ticket: {
        // Target date - 27 December 2024 at 23:59:59 WIB
        targetDate: "2025-12-29T23:59:59+07:00",

        title: "Batas Pendaftaran Tiket",
        subtitle: "Segera daftar sebelum kehabisan!",
        description: "Dapatkan tiket sekarang dan jangan lewatkan momen bersejarah Natal tema Jawa pertama di SMK PGRI 1 Kediri.",

        // CTA button
        cta: {
            text: "Daftar Sekarang",
            href: "/daftar"
        },

        // Labels for countdown units
        labels: {
            days: "Hari",
            hours: "Jam",
            minutes: "Menit",
            seconds: "Detik"
        },

        // Image for this section
        image: "/images-artguru.png",

        // Style variant
        variant: "urgent" // urgent = more prominent styling
    },

    // Countdown untuk hari H acara
    event: {
        // Target date - 10 January 2025 at 08:00:00 WIB
        targetDate: "2026-01-10T08:00:00+07:00",

        title: "Menuju Puncak Acara",
        subtitle: "Natal Gabungan 2025",
        description: "Bersiaplah untuk merayakan Natal dengan nuansa budaya Jawa yang unik dan penuh makna.",

        // CTA button
        cta: {
            text: "Lihat Lokasi",
            href: "#location"
        },

        // Labels for countdown units
        labels: {
            days: "Hari",
            hours: "Jam",
            minutes: "Menit",
            seconds: "Detik"
        },

        // Style variant
        variant: "celebration" // celebration = festive styling
    }
}

// Countdown display settings
export const countdownSettings = {
    showSeconds: true,
    animateNumbers: true,       // Flip animation for numbers
    showExpiredMessage: true,   // Show message when countdown ends
    expiredMessages: {
        ticket: "Pendaftaran telah ditutup",
        event: "Selamat Natal! 🎄"
    }
}

export default countdownData
