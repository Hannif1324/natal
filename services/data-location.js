// =====================================================
// LOCATION DATA SERVICE
// =====================================================
// Data lokal untuk Informasi Lokasi dan Waktu
// Section ini satu-satunya yang menampilkan lokasi dan waktu!
// =====================================================

export const locationData = {
    // Venue information
    venue: {
        name: "SMK PGRI 1 Kediri",
        fullName: "Sekolah Menengah Kejuruan PGRI 1 Kediri",
        address: "Jl. Himalaya No.06, Sukorame, Bandar Lor, Kec. Mojoroto, Kota Kediri, Jawa Timur 64114",
        phone: "(0354) 682433",
        website: "https://smkpgri1kediri.sch.id"
    },

    // Event timing
    schedule: {
        date: "10 Januari 2026",
        day: "Sabtu",

        // Time breakdown
        openGate: "08:00 WIB",
        startTime: "09:00 WIB",
        endTime: "12:30 WIB",

        // Display format
        displayTime: "09:00 - 12:30 WIB"
    },

    // Google Maps integration
    maps: {
        // Embed URL for iframe (dengan marker bawaan)
        embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1972.5!2d111.9909758!3d-7.8134366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7856ddf8963d4d%3A0x5bbdb6c3fe7112c4!2sSMK%20PGRI%201%20Kediri!5e0!3m2!1sid!2sid!4v1702100000000!5m2!1sid!2sid",

        // Direct link for "Open in Maps"
        directUrl: "https://maps.app.goo.gl/RCzwb8tiKNdVwXA59",

        // Coordinates
        lat: -7.8134366,
        lng: 111.9909758
    },

    // Venue images
    images: {
        main: "/skapsa.webp",
        gallery: [
            "/skapsa.webp"
        ]
    },

    // Transportation hints
    directions: {
        fromStation: "15 menit dari Stasiun Kediri",
        fromTerminal: "10 menit dari Terminal Tamanan",
        parking: "Tersedia area parkir luas"
    },

    // Contact for questions
    contact: {
        whatsapp: "6285800753804",
        email: "natallgabungan@gmail.com"
    }
}

// Location section settings
export const locationSettings = {
    showMap: true,
    showDirections: true,
    showVenueImage: true,
    mapHeight: "400px"
}

export default locationData
