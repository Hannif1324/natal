'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { navbarData } from '@/services/data-navbar'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const navbar = navbarData

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close sidebar when clicking outside
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isSidebarOpen])

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-[#0F0F0F]/95 backdrop-blur-md shadow-lg border-b border-[#C5A059]/20'
                : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">

                        {/* Logo & Brand */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-full border-2 border-[#C5A059]/50 group-hover:border-[#C5A059] transition-colors">
                                <Image
                                    src={navbar.brand.logo}
                                    alt="Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="hidden sm:block text-lg font-bold text-[#C5A059] group-hover:text-[#D4B06A] transition-colors">
                                {navbar.brand.text}
                            </span>
                        </Link>

                        {/* Desktop Navigation - Only show on lg screens */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navbar.links.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="relative text-gray-300 hover:text-[#C5A059] transition-colors duration-300 text-sm uppercase tracking-wider group"
                                >
                                    {link.text}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C5A059] transition-all duration-300 group-hover:w-full" />
                                </a>
                            ))}
                        </div>

                        {/* CTA Button - Desktop Only */}
                        <div className="hidden lg:block">
                            <Link
                                href={navbar.ctaButton.href}
                                className="px-6 py-2.5 bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-[#2C2C2C] font-semibold rounded-lg hover:shadow-[0_4px_20px_rgba(197,160,89,0.4)] hover:-translate-y-0.5 transition-all duration-300"
                            >
                                {navbar.ctaButton.text}
                            </Link>
                        </div>

                        {/* Mobile/Tablet Menu Button */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 text-[#C5A059]"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Sidebar Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-72 sm:w-80 bg-[#0F0F0F] border-l border-[#C5A059]/20 z-[70] transform transition-transform duration-300 ease-out lg:hidden ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#C5A059]/20">
                    <span className="text-lg font-bold text-[#C5A059]">{navbar.brand.text}</span>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-2 text-gray-400 hover:text-[#C5A059] transition-colors"
                        aria-label="Close menu"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Sidebar Links */}
                <div className="py-6 px-4 space-y-2">
                    {navbar.links.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-[#C5A059] hover:bg-[#C5A059]/10 rounded-xl transition-all duration-200"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/50" />
                            {link.text}
                        </a>
                    ))}
                </div>

                {/* Sidebar CTA */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#C5A059]/20">
                    <Link
                        href={navbar.ctaButton.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className="block w-full px-6 py-4 text-center bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-[#2C2C2C] font-bold rounded-xl hover:shadow-[0_4px_20px_rgba(197,160,89,0.4)] transition-all duration-300"
                    >
                        {navbar.ctaButton.text}
                    </Link>
                </div>
            </div>
        </>
    )
}

