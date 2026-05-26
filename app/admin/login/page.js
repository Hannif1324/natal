'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight, AlertTriangle, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { LoadingButton } from '@/components/ui/LoadingUI'

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) throw error

            router.push('/admin')
            router.refresh()
        } catch (err) {
            setError(err.message === 'Invalid login credentials'
                ? 'Email atau password salah'
                : err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#C5A059]/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#C5A059]/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#C5A059] to-[#D4B06A] rounded-2xl mb-6 shadow-[0_10px_40px_rgba(197,160,89,0.3)]">
                        <span className="text-4xl">🎄</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
                    <p className="text-gray-400">Natal Gabungan 2025</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="bg-gradient-to-b from-[#1A1A1A] to-[#151515] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#C5A059]/20 shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-1 h-8 bg-gradient-to-b from-[#C5A059] to-transparent rounded-full" />
                        <h2 className="text-xl font-semibold text-[#C5A059]">Login Panitia</h2>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-[#252525] border border-[#C5A059]/20 rounded-xl text-white focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-[#252525] border border-[#C5A059]/20 rounded-xl text-white focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <LoadingButton
                            type="submit"
                            loading={loading}
                            size="lg"
                            className="w-full mt-4"
                        >
                            Masuk ke Dashboard <ArrowRight className="w-5 h-5 inline ml-2" />
                        </LoadingButton>
                    </div>
                </form>

                {/* Back Link */}
                <div className="text-center mt-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C5A059] text-sm transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Website
                    </Link>
                </div>
            </div>
        </div>
    )
}
