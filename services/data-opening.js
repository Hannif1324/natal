// =====================================================
// OPENING ANIMATION DATA SERVICE
// =====================================================
// Data untuk animasi pembukaan website dengan visual Gunungan Jawa
// Layer 1: Gunungan animation
// Layer 2: Welcome text sequential
// =====================================================

export const openingData = {
    // Layer 1 - Gunungan Images (4 assets for flexible animation)
    gunungan: {
        left: {
            front: "/Opening_Gunungan/gunungan-full-left-front.webp",
            back: "/Opening_Gunungan/gunungan-full-left-back.webp"
        },
        right: {
            front: "/Opening_Gunungan/gunungan-full-right-front.webp",
            back: "/Opening_Gunungan/gunungan-full-right-back.webp"
        }
    },

    // Layer 2 - Welcome Text (muncul sequential)
    welcomeTexts: [
        {
            id: 1,
            text: "Sugeng Rawuh",
            type: "javanese",
            delay: 0, // seconds after layer 2 starts
        },
        {
            id: 2,
            text: "Selamat Datang di Perayaan Natal 2025",
            type: "subtitle",
            delay: 0.6,
        },
        {
            id: 3,
            text: "Padhang Ing Tengahing Peteng",
            type: "theme",
            delay: 1.2,
        },
        {
            id: 4,
            text: "Terang itu bercahaya di dalam kegelapan",
            type: "verse",
            delay: 1.8,
        },
    ],

    // Animation Timing Configuration (in seconds)
    timing: {
        // Layer 1 - Gunungan (4 assets animation)
        layer1: {
            initialDelay: 0.5,         // Black screen dulu 0.5 detik
            slideInDuration: 0.5,// Waktu gunungan masuk dari samping
            meetCenterPause: 1.0,  // Jeda 2 detik saat di tengah
            slideOutDuration: 0.5,    // Waktu gunungan membuka keluar
            fadeOutDuration: 0.5,      // Fade out duration
            total: 3.0          // Total durasi layer 1
        },
        // Layer 2 - Welcome Text
        layer2: {
            startDelay: 0,             // Delay sebelum text pertama muncul
            textFadeDuration: 0.5,     // Durasi fade-in setiap text
            afterAllTextsPause: 0.5,   // Jeda setelah semua text muncul
            total: 3.0,                // Total durasi layer 2
        },
        // Total animation duration before scroll
        totalDuration: 5.0,           // layer1 + layer2 total
    },

    // SEO metadata
    seo: {
        title: "Perayaan Natal 2024 - Padhang Ing Tengahing Peteng",
        description: "Selamat datang di perayaan Natal 2024 dengan tema Padhang Ing Tengahing Peteng. Terang itu bercahaya di dalam kegelapan.",
    }
}

export default openingData
