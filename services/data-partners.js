// =====================================================
// PARTNERS (SCHOOLS) DATA SERVICE
// =====================================================
// Data lokal untuk Partner Schools Carousel
// Auto-slide setiap 5 detik, bisa manual slide juga
// =====================================================



export const partnersData = [
    {
        id: 1,
        name: "SMK PGRI 2 Kediri",
        type: "SMK Swasta",
        logo: "/assets/Undangan_sekolah_lain/8975623785632563295_SMK_PGRI2_KEDIRI.webp",
        address: "Jl. PB. Sudirman No. 1, Kediri",
        quota: 11
    },
    {
        id: 2,
        name: "SMK PGRI 3 Kediri",
        type: "SMK Swasta",
        logo: "/assets/Undangan_sekolah_lain/81471247623756195197_pgri3.webp",
        address: "Jl. Letjen Suprapto, Kediri",
        quota: 3
    },
    {
        id: 3,
        name: "SMK PGRI 4 Kediri",
        type: "SMK Swasta",
        logo: "/assets/Undangan_sekolah_lain/6567125154515471_pgri4.webp",
        address: "Jl. Patimura, Kediri",
        quota: 7
    },
    {
        id: 4,
        name: "SMAN 8 Kediri",
        type: "SMA Negeri",
        logo: "/assets/Undangan_sekolah_lain/7b282783-fc12-4b82-8675-f434c0ee6214_SMAN8_KEDIRI.webp",
        address: "Jl. Pahlawan Kusuma Bangsa, Kediri",
        quota: 52
    },
    {
        id: 5,
        name: "SMKN 1 Ngasem",
        type: "SMK Negeri",
        logo: "/assets/Undangan_sekolah_lain/9785829358256725_SMKN1_NGASEM.webp",
        address: "Jl. Raya Ngasem, Kab. Kediri",
        quota: 30
    },
    {
        id: 6,
        name: "SMK Pawyatan Daha 1",
        type: "SMK Swasta",
        logo: "/assets/Undangan_sekolah_lain/756t2322547325378_SMK_DAHA1.webp",
        address: "Jl. Penanggungan, Kediri",
        quota: 27
    },
    {
        id: 7,
        name: "SMK Pawyatan Daha 2",
        type: "SMK Swasta",
        logo: "/assets/Undangan_sekolah_lain/4t532941249254026_SMK_DAHA2.webp",
        address: "Jl. Wachid Hasyim, Kediri",
        quota: 13
    },
    {
        id: 8,
        name: "SMKN 1 Plosoklaten",
        type: "SMK Negeri",
        logo: "/assets/Undangan_sekolah_lain/47816213987521357823_SMKN1_KEDIRI.webp",
        address: "Jl. Raya Plosoklaten, Kab. Kediri",
        quota: 25
    }
]

// Carousel settings for partners
export const partnerCarouselSettings = {
    autoSlide: true,
    autoSlideInterval: 5000, // 5 seconds as requested
    slidesPerView: {
        mobile: 1,
        tablet: 2,
        desktop: 4
    },
    showNavigation: true,    // Bisa manual slide
    showPagination: true
}

export default partnersData
