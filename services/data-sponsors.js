// =====================================================
// SPONSORS DATA SERVICE
// =====================================================
// Data untuk Sponsors Carousel
// Menggunakan Supabase sebagai sumber data
// =====================================================

import { supabase } from '@/lib/supabase'

// Fetch sponsors from Supabase
export async function getSponsors() {
    try {
        if (!supabase) {
            console.warn('Supabase client not available')
            return []
        }

        const { data, error } = await supabase
            .from('sponsors')
            .select('*')
            .eq('is_active', true)
            .order('tier', { ascending: true })
            .order('display_order', { ascending: true })

        if (error) {
            console.error('Supabase error details:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            })
            throw error
        }

        // If no data in Supabase, return empty array
        if (!data || data.length === 0) {
            return []
        }

        // Map Supabase data to match component expectations
        return data.map(s => ({
            id: s.id,
            name: s.name,
            logo: s.logo,
            url: s.website || '#',
            tier: s.tier
        }))
    } catch (err) {
        console.error('Failed to fetch sponsors:', err)
        return []
    }
}

// Carousel settings
export const sponsorCarouselSettings = {
    autoSlide: true,
    autoSlideInterval: 2000,
    slidesPerView: {
        mobile: 2,
        tablet: 4,
        desktop: 5
    },
    grayscaleDefault: true,
    colorOnHover: true
}

