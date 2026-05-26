'use client'

import { useState, useEffect } from 'react'
import { Users, Clock, CheckCircle, MapPin, Camera, ClipboardList, RefreshCw, Inbox, Loader, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { CardSkeleton } from '@/components/ui/LoadingUI'

export default function AdminDashboard() {
    const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0, checkedIn: 0 })
    const [loading, setLoading] = useState(true)
    const [recentAttendees, setRecentAttendees] = useState([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)

        // Fetch stats
        const { data } = await supabase.from('attendees').select('*').order('created_at', { ascending: false })

        if (data) {
            setStats({
                total: data.length,
                pending: data.filter(d => d.payment_status === 'pending').length,
                verified: data.filter(d => d.payment_status === 'verified').length,
                checkedIn: data.filter(d => d.checked_in).length
            })
            setRecentAttendees(data.slice(0, 5))
        }

        setLoading(false)
    }

    const statCards = [
        {
            label: 'Total Pendaftar',
            value: stats.total,
            icon: Users,
            gradient: 'from-blue-600/20 via-blue-500/10 to-transparent',
            border: 'border-blue-500/30',
            href: '/admin/attendees'
        },
        {
            label: 'Menunggu Verifikasi',
            value: stats.pending,
            icon: Clock,
            gradient: 'from-amber-600/20 via-amber-500/10 to-transparent',
            border: 'border-amber-500/30',
            href: '/admin/attendees?status=pending'
        },
        {
            label: 'Terverifikasi',
            value: stats.verified,
            icon: CheckCircle,
            gradient: 'from-emerald-600/20 via-emerald-500/10 to-transparent',
            border: 'border-emerald-500/30',
            href: '/admin/attendees?status=verified'
        },
        {
            label: 'Sudah Check-in',
            value: stats.checkedIn,
            icon: MapPin,
            gradient: 'from-purple-600/20 via-purple-500/10 to-transparent',
            border: 'border-purple-500/30',
            href: '/admin/checkin'
        }
    ]

    const quickActions = [
        { label: 'Scan QR Code', icon: Camera, href: '/admin/checkin', color: 'from-[#C5A059] to-[#D4B06A]' },
        { label: 'Lihat Pendaftar', icon: ClipboardList, href: '/admin/attendees', color: 'from-blue-500 to-blue-600' },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-gray-400">Selamat datang di Admin Panel Natal Gabungan</p>
                </div>
                <button
                    onClick={fetchData}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#252525] text-gray-300 rounded-xl hover:text-[#C5A059] hover:bg-[#C5A059]/10 transition-all border border-[#C5A059]/20"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    <CardSkeleton count={4} />
                ) : (
                    statCards.map((card, i) => (
                        <Link
                            key={i}
                            href={card.href}
                            className={`group bg-gradient-to-br ${card.gradient} rounded-2xl p-6 border ${card.border} hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <card.icon className="w-8 h-8 group-hover:scale-110 transition-transform text-white/80" />
                                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#C5A059] transition-colors" />
                                <span className="text-gray-500 group-hover:text-[#C5A059] transition-colors">→</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-1">{card.label}</p>
                            <p className="text-4xl font-bold text-white">{card.value}</p>
                        </Link>
                    ))
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-4">
                {quickActions.map((action, i) => (
                    <Link
                        key={i}
                        href={action.href}
                        className={`group bg-gradient-to-r ${action.color} rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg hover:scale-[1.01] transition-all duration-300`}
                    >
                        <action.icon className="w-8 h-8 group-hover:scale-110 transition-transform text-white" />
                        <div>
                            <p className="text-lg font-bold text-white">{action.label}</p>
                            <p className="text-white/70 text-sm">Klik untuk membuka</p>
                        </div>
                        <span className="ml-auto text-white/50 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                ))}
            </div>

            {/* Recent Attendees */}
            <div className="bg-gradient-to-b from-[#1A1A1A] to-[#151515] rounded-2xl border border-[#C5A059]/20 overflow-hidden">
                <div className="p-6 border-b border-[#C5A059]/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ClipboardList className="w-6 h-6 text-[#C5A059]" />
                        <h2 className="text-xl font-semibold text-white">Pendaftar Terbaru</h2>
                    </div>
                    <Link href="/admin/attendees" className="text-[#C5A059] text-sm hover:underline">
                        Lihat Semua →
                    </Link>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        <Loader className="w-6 h-6 animate-spin inline-block mb-2" />
                        <p>Memuat data...</p>
                    </div>
                ) : recentAttendees.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Inbox className="w-10 h-10 mx-auto mb-2" />
                        <p>Belum ada pendaftar</p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#C5A059]/10">
                        {recentAttendees.map((attendee, i) => (
                            <div key={i} className="p-4 flex items-center gap-4 hover:bg-[#C5A059]/5 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059]/30 to-[#C5A059]/10 flex items-center justify-center text-[#C5A059] font-bold">
                                    {attendee.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">{attendee.name}</p>
                                    <p className="text-gray-500 text-sm truncate">{attendee.email}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${attendee.payment_status === 'verified'
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : attendee.payment_status === 'rejected'
                                                ? 'bg-red-500/20 text-red-400'
                                                : 'bg-amber-500/20 text-amber-400'
                                        }`}>
                                        {attendee.payment_status === 'verified'
                                            ? '✓ Verified'
                                            : attendee.payment_status === 'rejected'
                                                ? '✗ Rejected'
                                                : '⏳ Pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
