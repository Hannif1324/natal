'use client'

import Image from 'next/image'
import { MapPin, Calendar, DoorOpen, Clock, Map, Car, Phone, Globe, MessageCircle, Mail } from 'lucide-react'
import { locationData } from '@/services/data-location'
import { AnimateOnScroll } from '@/lib/animations'

export default function LocationSection() {
    const { venue, schedule, maps, images, directions, contact } = locationData

    return (
        <section id="location" className="py-20 sm:py-28 bg-gradient-to-b from-[#1A1A1A] to-[#0F0F0F] relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0">
                <div className="absolute top-20 right-10 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#4A0404]/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Header */}
                <AnimateOnScroll animation="fadeUp">
                    <div className="text-center mb-16">
                        <p className="text-[#C5A059] uppercase tracking-[0.2em] text-sm mb-4 font-medium">
                            Lokasi & Waktu
                        </p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-heading)]">
                            <span className="text-white">Temui Kami </span>
                            <span className="bg-gradient-to-r from-[#C5A059] to-[#D4B06A] bg-clip-text text-transparent">
                                di Sini
                            </span>
                        </h2>
                        <div className="flex items-center justify-center gap-3 mt-6">
                            <span className="w-16 h-0.5 bg-gradient-to-r from-transparent to-[#C5A059]" />
                            <span className="text-[#C5A059]">✦</span>
                            <span className="w-16 h-0.5 bg-gradient-to-l from-transparent to-[#C5A059]" />
                        </div>
                    </div>
                </AnimateOnScroll>

                <div className="grid lg:grid-cols-2 gap-8 lg:items-stretch">
                    {/* Venue Info Card */}
                    <AnimateOnScroll animation="fadeRight" delay={0.1} className="lg:h-full">
                        <div className="relative group h-full">
                            {/* Glow effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C5A059]/30 to-[#4A0404]/30 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity" />

                            <div className="relative bg-gradient-to-b from-[#252525] to-[#1A1A1A] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#C5A059]/20 h-full">
                                {/* Corner Ornaments */}
                                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#C5A059]/40 rounded-tl-3xl" />
                                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#C5A059]/40 rounded-br-3xl" />

                                {/* Venue Image */}
                                <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                                    <Image src={images.main} alt={venue.name} fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-xl font-bold text-white font-[family-name:var(--font-heading)]">{venue.name}</h3>
                                        <p className="text-[#C5A059] text-sm">{venue.fullName}</p>
                                    </div>
                                </div>

                                {/* Info Items */}
                                <div className="space-y-4">
                                    {/* Address */}
                                    <div className="flex gap-4 p-3 bg-[#1A1A1A]/50 rounded-xl">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#C5A059]/20 to-[#C5A059]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-[#C5A059]" />
                                        </div>
                                        <div>
                                            <p className="text-[#C5A059] text-sm font-medium">Alamat</p>
                                            <p className="text-gray-300 text-sm leading-relaxed">{venue.address}</p>
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div className="flex gap-4 p-3 bg-[#1A1A1A]/50 rounded-xl">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#C5A059]/20 to-[#C5A059]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Calendar className="w-5 h-5 text-[#C5A059]" />
                                        </div>
                                        <div>
                                            <p className="text-[#C5A059] text-sm font-medium">Tanggal</p>
                                            <p className="text-white font-semibold text-lg">{schedule.day}, {schedule.date}</p>
                                        </div>
                                    </div>

                                    {/* Time Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Gate Open */}
                                        <div className="flex gap-3 p-3 bg-[#4A0404]/30 rounded-xl border border-[#C5A059]/10">
                                            <div className="w-10 h-10 bg-[#C5A059]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <DoorOpen className="w-5 h-5 text-[#C5A059]" />
                                            </div>
                                            <div>
                                                <p className="text-[#C5A059] text-xs font-medium">Gate Open</p>
                                                <p className="text-white font-semibold">{schedule.openGate}</p>
                                            </div>
                                        </div>

                                        {/* Event Time */}
                                        <div className="flex gap-3 p-3 bg-[#1A3A1A]/30 rounded-xl border border-[#C5A059]/10">
                                            <div className="w-10 h-10 bg-[#C5A059]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Clock className="w-5 h-5 text-[#C5A059]" />
                                            </div>
                                            <div>
                                                <p className="text-[#C5A059] text-xs font-medium">Acara</p>
                                                <p className="text-white font-semibold">{schedule.displayTime}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Directions */}
                                    <div className="p-4 bg-[#0F0F0F] rounded-xl border border-[#C5A059]/10">
                                        <p className="text-[#C5A059] text-sm font-medium mb-3 flex items-center gap-2"><Car className="w-4 h-4" /> Petunjuk Arah</p>
                                        <div className="space-y-2">
                                            <p className="text-gray-400 text-sm flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
                                                {directions.fromStation}
                                            </p>
                                            <p className="text-gray-400 text-sm flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
                                                {directions.fromTerminal}
                                            </p>
                                            <p className="text-gray-400 text-sm flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
                                                {directions.parking}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Venue Contact Info */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Phone */}
                                        <a
                                            href={`tel:${venue.phone}`}
                                            className="flex gap-3 p-3 bg-[#1A1A1A]/50 rounded-xl border border-[#C5A059]/10 hover:border-[#C5A059]/30 transition-colors group"
                                        >
                                            <div className="w-10 h-10 bg-[#C5A059]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#C5A059]/20 transition-colors">
                                                <Phone className="w-4 h-4 text-[#C5A059]" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[#C5A059] text-xs font-medium">Telepon</p>
                                                <p className="text-white text-sm truncate">{venue.phone}</p>
                                            </div>
                                        </a>

                                        {/* Website */}
                                        <a
                                            href={venue.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex gap-3 p-3 bg-[#1A1A1A]/50 rounded-xl border border-[#C5A059]/10 hover:border-[#C5A059]/30 transition-colors group"
                                        >
                                            <div className="w-10 h-10 bg-[#C5A059]/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#C5A059]/20 transition-colors">
                                                <Globe className="w-4 h-4 text-[#C5A059]" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[#C5A059] text-xs font-medium">Website</p>
                                                <p className="text-white text-sm truncate">smkpgri1kediri.sch.id</p>
                                            </div>
                                        </a>
                                    </div>

                                    {/* Contact Buttons */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* WhatsApp */}
                                        <a
                                            href={`https://wa.me/${contact.whatsapp}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366]/20 text-[#25D366] font-medium rounded-xl border border-[#25D366]/30 hover:bg-[#25D366]/30 transition-colors"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            <span className="text-sm">WhatsApp</span>
                                        </a>

                                        {/* Email */}
                                        <a
                                            href={`mailto:${contact.email}`}
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#C5A059]/20 text-[#C5A059] font-medium rounded-xl border border-[#C5A059]/30 hover:bg-[#C5A059]/30 transition-colors"
                                        >
                                            <Mail className="w-4 h-4" />
                                            <span className="text-sm">Email</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimateOnScroll>

                    {/* Map Card */}
                    <AnimateOnScroll animation="fadeLeft" delay={0.2} className="lg:h-full">
                        <div className="relative group h-full">
                            {/* Glow effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4A0404]/30 to-[#C5A059]/30 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity" />

                            <div className="relative bg-gradient-to-b from-[#252525] to-[#1A1A1A] rounded-3xl p-6 border border-[#C5A059]/20 h-full flex flex-col">
                                {/* Corner Ornaments */}
                                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#C5A059]/40 rounded-tl-3xl" />
                                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#C5A059]/40 rounded-br-3xl" />

                                {/* Map Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#C5A059]/20 to-[#C5A059]/5 rounded-xl flex items-center justify-center">
                                        <Map className="w-5 h-5 text-[#C5A059]" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold">Peta Lokasi</h4>
                                        <p className="text-gray-400 text-sm">Klik untuk navigasi</p>
                                    </div>
                                </div>

                                {/* Map Embed */}
                                <div className="flex-1 bg-[#0F0F0F] rounded-2xl overflow-hidden border border-[#C5A059]/10 min-h-[300px]">
                                    <iframe
                                        src={maps.embedUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, minHeight: '300px' }}
                                        loading="lazy"
                                        allowFullScreen
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>

                                {/* CTA Button */}
                                <a
                                    href={maps.directUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 flex items-center justify-center gap-3 w-full px-6 py-4 bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-[#2C2C2C] font-bold rounded-xl hover:shadow-[0_4px_20px_rgba(197,160,89,0.4)] hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Buka di Google Maps
                                </a>
                            </div>
                        </div>
                    </AnimateOnScroll>
                </div>
            </div>
        </section>
    )
}
