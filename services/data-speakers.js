// =====================================================
// SPEAKERS DATA SERVICE
// =====================================================
// Data lokal untuk Pembicara/Speaker Section
// 1 pembicara utama dari Surabaya dengan card interaktif
// =====================================================

export const speakersData = [
    {
        id: 1,
        name: "Pdt.Dr.dr. Andre Yulius, M.H",
        title: "Dosen Teologi Kesehatan & Pendeta",
        subtitle: "Dokter Idola Rakyat",
        origin: "Surabaya",
        church: "Gereja Sidoarjo | AMC Group",

        // Short description for card
        shortDescription: "Tokoh kesehatan yang dikenal luas sebagai 'Dokter Idola Rakyat'. Dosen Teologi Kesehatan, Pendeta di Gereja Sidoarjo, dan bagian dari AMC Group dengan komitmen pro rakyat serta pro tenaga kesehatan.",

        // Full description for modal/expanded view
        fullDescription: `Dr.dr. Andre Yulius, M.HH adalah tokoh kesehatan yang dikenal luas sebagai "Dokter Idola Rakyat". Beliau merupakan bagian dari AMC Group dengan komitmen nyata dalam meningkatkan mutu pelayanan kesehatan.

Selain aktif di bidang kesehatan, beliau juga merupakan Dosen Teologi Kesehatan dan Pendeta di gereja Sidoarjo, serta membuka usaha sebagai dokter praktik.

Beliau aktif dalam program pendampingan berkelanjutan untuk membantu fasilitas kesehatan di berbagai daerah agar lebih siap memenuhi standar lingkungan, keamanan, dan operasional yang ditetapkan pemerintah.

Dengan semangat pro rakyat dan pro tenaga kesehatan, Dr. Andre Yulius akan membawakan pesan inspiratif sesuai tema Natal kita: "Padhang Ing Tengahing Peteng" - Terang itu bercahaya di dalam kegelapan dan kegelapan itu tidak menguasainya (Yohanes 1:5).`,

        // Speaker image
        image: "/assets/Pembicara/pembicara_speacker-1.webp",

        // Social media links
        social: {
            instagram: "https://instagram.com",
            youtube: "https://youtube.com",
            facebook: "https://facebook.com"
        },

        // Topics/tags
        topics: ["Natal", "Kesehatan", "Motivasi", "Pelayanan"],

        // Session info
        session: {
            title: "Padhang Ing Tengahing Peteng",
            subtitle: "Terang itu bercahaya di dalam kegelapan",
            verse: "Yohanes 1:5",
            duration: "45 menit",
            type: "Khotbah Utama"
        }
    }
]

// Speaker section settings
export const speakerSectionSettings = {
    showInteractiveCard: true,  // Card dengan efek hover
    showSocialLinks: true,
    showTopics: true,
    expandOnClick: true         // Modal muncul saat click
}

export default speakersData
