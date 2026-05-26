'use client'

import { useState, useCallback } from 'react'
import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import SponsorsCarousel from '@/components/landing/SponsorsCarousel'
import DescriptionSection from '@/components/landing/DescriptionSection'
import PartnersCarousel from '@/components/landing/PartnersCarousel'
import SpeakersSection from '@/components/landing/SpeakersSection'
import CountdownSection from '@/components/landing/CountdownSection'
import LocationSection from '@/components/landing/LocationSection'
import QuickRegisterSection from '@/components/landing/QuickRegisterSection'
import Footer from '@/components/landing/Footer'
import ScrollToTop from '@/components/ui/ScrollToTop'
import ChatWidget from '@/components/ui/ChatWidget'
import OpeningOverlay from '@/components/landing/OpeningOverlay'

export default function Home() {
  const [showOpening, setShowOpening] = useState(true)

  const handleOpeningComplete = useCallback(() => {
    // Fade out overlay first, then scroll smoothly
    setShowOpening(false)

    // Small delay to let overlay fade complete, then smooth scroll to hero
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }, 100)
  }, [])

  return (
    <>
      {/* Opening Animation Overlay */}
      {showOpening && <OpeningOverlay onComplete={handleOpeningComplete} />}

      <Navbar />
      <ScrollToTop />
      <ChatWidget />

      <main className="min-h-screen">
        {/* 1. Hero Section */}
        <div id="home">
          <HeroSection />
        </div>

        {/* 2. Sponsors Carousel - Right after Hero */}
        <SponsorsCarousel />

        {/* 3. Description Section */}
        <div id="info">
          <DescriptionSection />
        </div>

        {/* 4. Partner Schools Carousel */}
        <PartnersCarousel />

        {/* 5. Speakers Section */}
        <div id="speakers">
          <SpeakersSection />
        </div>

        {/* 6 & 7. Countdown Sections (Ticket & Event) */}
        <div id="countdown">
          <CountdownSection />
        </div>

        {/* 8. Location & Time Section */}
        <div id="location">
          <LocationSection />
        </div>

        {/* 9. Quick Registration Form */}
        <QuickRegisterSection />

        {/* Footer */}
        <Footer />
      </main>
    </>
  )
}
