// =====================================================
// HERO SECTION DATA SERVICE
// =====================================================
// Data lokal untuk Hero Section landing page
// =====================================================
import image2 from "../public/image 2.webp"
import rightPastur from "../public/right_pastur_2462786472364732325-removebg-preview 1.webp"

export const heroData = {
    // Main title - Javanese theme
    title: "Padhang Ing Tengahing Peteng",
    titleEnglish: "Light in the Midst of Darkness",

    // Bible verse
    verse: {
        text: "Terang itu bercahaya di dalam kegelapan dan kegelapan itu tidak menguasainya.",
        reference: "Yohanes 1:5"
    },

    // Call to action buttons
    cta: {
        primary: {
            text: "Daftar Sekarang",
            href: "/daftar"
        },
        secondary: {
            text: "Lihat Info Acara",
            href: "#info"
        }
    },

    // Background and decorative images
    images: {
        // Batik pattern background
        background: "/vecteezy_brown-ornament-batik-mega-mendung-cirebon-indonesia-with_24037227.webp",

        // Wayang ornaments
        leftWayang: image2,
        rightWayang: rightPastur,

        // Optional: Fellowship logo
        logo: "/Logo fellowship.webp"
    },

    // Event branding
    event: {
        name: "Natal Gabungan",
        year: "2025/2026",
        theme: "Modern Javanese Christmas"
    }
}

export default heroData
