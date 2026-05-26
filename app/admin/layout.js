'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, Users, ScanLine, Globe, LogOut, Loader, Menu, X, UserCheck, Award, Ticket } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { PageLoader } from '@/components/ui/LoadingUI'

export default function AdminLayout({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [loggingOut, setLoggingOut] = useState(false)

    const isLoginPage = pathname === '/admin/login'

    useEffect(() => {
        if (isLoginPage) {
            setLoading(false)
            return
        }

        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/admin/login')
            } else {
                setUser(session.user)
            }
            setLoading(false)
        }

        checkAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                router.push('/admin/login')
            } else if (session) {
                setUser(session.user)
            }
        })

        return () => subscription.unsubscribe()
    }, [pathname, router, isLoginPage])

    useEffect(() => {
        setSidebarOpen(false)
    }, [pathname])

    if (isLoginPage) return children

    if (loading) {
        return <PageLoader message="Memeriksa autentikasi..." />
    }

    if (!user) return null

    const handleLogout = async () => {
        setLoggingOut(true)
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, description: 'Ringkasan data' },
        { href: '/admin/attendees', label: 'Pendaftar', icon: Users, description: 'Kelola pendaftar' },
        { href: '/admin/ticketing', label: 'Tiket & Harga', icon: Ticket, description: 'Kelola tiket' },
        { href: '/admin/sponsors', label: 'Sponsor', icon: Award, description: 'Kelola sponsor' },
        { href: '/admin/checkin', label: 'Check-in', icon: ScanLine, description: 'Scan QR Code' },
        { href: '/admin/checked-in', label: 'Sudah Hadir', icon: UserCheck, description: 'Daftar hadir' },
    ]

    return (
        <div className="min-h-screen bg-[#0F0F0F]">
            {/* Mobile Header */}
            <header className="lg:hidden bg-gradient-to-r from-[#1A1A1A] to-[#151515] border-b border-[#C5A059]/20 p-4 flex justify-between items-center sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">🎄</span>
                    <h1 className="text-lg font-bold text-[#C5A059]">Admin Panel</h1>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-[#C5A059] p-2 hover:bg-[#C5A059]/10 rounded-lg transition-colors"
                >
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`
                    fixed lg:sticky top-0 left-0 h-screen w-72 bg-gradient-to-b from-[#1A1A1A] to-[#151515] border-r border-[#C5A059]/20 flex flex-col z-50
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-[#C5A059]/10 hidden lg:block">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#C5A059] to-[#D4B06A] rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">🎄</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                                <p className="text-gray-500 text-xs">Natal Gabungan</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <p className="text-gray-500 text-xs uppercase tracking-wider px-3 mb-3">Menu</p>

                        {navItems.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${pathname === item.href
                                    ? 'bg-gradient-to-r from-[#C5A059]/20 to-transparent text-[#C5A059] border-l-4 border-[#C5A059]'
                                    : 'text-gray-300 hover:text-white hover:bg-[#C5A059]/10'
                                    }`}
                            >
                                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <div>
                                    <p className="font-medium">{item.label}</p>
                                    <p className="text-xs text-gray-500">{item.description}</p>
                                </div>
                            </Link>
                        ))}

                        <hr className="border-[#C5A059]/10 my-4" />

                        <p className="text-gray-500 text-xs uppercase tracking-wider px-3 mb-3">Lainnya</p>

                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-300 hover:bg-[#252525] rounded-xl transition-all"
                        >
                            <Globe className="w-5 h-5" />
                            <span>Lihat Website</span>
                        </Link>
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-[#C5A059]/10 bg-[#0F0F0F]/50">
                        <div className="flex items-center gap-3 mb-3 p-3 bg-[#252525] rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059]/30 to-[#C5A059]/10 flex items-center justify-center text-[#C5A059] font-bold">
                                {user?.email?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{user?.email?.split('@')[0]}</p>
                                <p className="text-gray-500 text-xs truncate">{user?.email}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium disabled:opacity-50"
                        >
                            {loggingOut ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Keluar...
                                </>
                            ) : (
                                <>
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </>
                            )}
                        </button>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen">
                    {children}
                </main>
            </div>
        </div>
    )
}
