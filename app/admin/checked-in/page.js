'use client'

import { useState, useEffect } from 'react'
import { Users, Clock, School, RefreshCw, Search, UserCheck, Loader, FileSpreadsheet } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function CheckedInPage() {
    const [checkedIn, setCheckedIn] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [lastRefresh, setLastRefresh] = useState(null)

    const fetchCheckedIn = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('attendees')
            .select('*')
            .eq('checked_in', true)
            .order('checked_in_at', { ascending: false })

        setCheckedIn(data || [])
        setLastRefresh(new Date())
        setLoading(false)
    }

    useEffect(() => {
        fetchCheckedIn()

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchCheckedIn, 30000)
        return () => clearInterval(interval)
    }, [])

    // Real-time subscription for live updates
    useEffect(() => {
        const channel = supabase
            .channel('checked-in-changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'attendees' },
                () => fetchCheckedIn()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    // Filter by search
    const filtered = checkedIn.filter(a =>
        a.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.unique_id?.toLowerCase().includes(search.toLowerCase()) ||
        a.school?.toLowerCase().includes(search.toLowerCase())
    )

    const formatTime = (dateStr) => {
        if (!dateStr) return '-'
        return new Date(dateStr).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '-'
        return new Date(dateStr).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const exportToCSV = () => {
        if (checkedIn.length === 0) return

        // CSV Headers
        const headers = ['No', 'ID', 'Nama', 'Email', 'WhatsApp', 'Status', 'Sekolah', 'Waktu Check-in']

        // CSV Rows
        const rows = checkedIn.map((a, index) => [
            index + 1,
            a.unique_id,
            a.name,
            a.email,
            a.phone,
            a.status === 'siswa' ? 'Siswa' : 'Umum/Alumni',
            a.school || '-',
            formatDateTime(a.checked_in_at)
        ])

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `daftar-hadir-natal-${new Date().toISOString().split('T')[0]}.csv`
        link.click()
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                        <UserCheck className="w-8 h-8 text-green-400" />
                        Sudah Check-in
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {lastRefresh && `Update: ${lastRefresh.toLocaleTimeString('id-ID')}`}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-green-400">{checkedIn.length}</span>
                    <span className="text-gray-400">orang</span>
                    <button
                        onClick={exportToCSV}
                        disabled={checkedIn.length === 0}
                        className="p-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 disabled:opacity-50"
                        title="Export ke Excel/CSV"
                    >
                        <FileSpreadsheet className="w-5 h-5" />
                    </button>
                    <button
                        onClick={fetchCheckedIn}
                        disabled={loading}
                        className="p-2 bg-[#1A1A1A] border border-[#C5A059]/20 rounded-lg text-[#C5A059] hover:bg-[#C5A059]/10 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama, ID, atau sekolah..."
                    className="w-full pl-12 pr-4 py-3 bg-[#1A1A1A] border border-[#C5A059]/20 rounded-xl text-white focus:border-[#C5A059] outline-none"
                />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#C5A059]/20">
                    <p className="text-gray-400 text-xs mb-1">Total Check-in</p>
                    <p className="text-2xl font-bold text-green-400">{checkedIn.length}</p>
                </div>
                <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#C5A059]/20">
                    <p className="text-gray-400 text-xs mb-1">Siswa</p>
                    <p className="text-2xl font-bold text-[#C5A059]">
                        {checkedIn.filter(a => a.status === 'siswa').length}
                    </p>
                </div>
                <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#C5A059]/20">
                    <p className="text-gray-400 text-xs mb-1">Umum/Alumni</p>
                    <p className="text-2xl font-bold text-blue-400">
                        {checkedIn.filter(a => a.status !== 'siswa').length}
                    </p>
                </div>
                <div className="bg-[#1A1A1A] rounded-xl p-4 border border-[#C5A059]/20">
                    <p className="text-gray-400 text-xs mb-1">Terakhir</p>
                    <p className="text-lg font-bold text-white">
                        {checkedIn[0] ? formatTime(checkedIn[0].checked_in_at) : '-'}
                    </p>
                </div>
            </div>

            {/* Loading State */}
            {loading && checkedIn.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                    <Loader className="w-8 h-8 text-[#C5A059] animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    {search ? 'Tidak ditemukan' : 'Belum ada yang check-in'}
                </div>
            ) : (
                <>
                    {/* Mobile Card View */}
                    <div className="lg:hidden space-y-3">
                        {filtered.map((a, index) => (
                            <div
                                key={a.id}
                                className="bg-[#1A1A1A] rounded-xl border border-green-500/20 p-4 flex items-center gap-4"
                            >
                                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold truncate">{a.name}</p>
                                    <p className="text-[#C5A059] text-xs font-mono">{a.unique_id}</p>
                                    {a.school && (
                                        <p className="text-gray-500 text-xs truncate flex items-center gap-1">
                                            <School className="w-3 h-3" /> {a.school}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-green-400 text-sm font-medium flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatTime(a.checked_in_at)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block bg-[#1A1A1A] rounded-xl border border-[#C5A059]/20 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-[#252525]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-[#C5A059] w-12">#</th>
                                    <th className="px-4 py-3 text-left text-[#C5A059]">ID</th>
                                    <th className="px-4 py-3 text-left text-[#C5A059]">Nama</th>
                                    <th className="px-4 py-3 text-left text-[#C5A059]">Status</th>
                                    <th className="px-4 py-3 text-left text-[#C5A059]">Sekolah</th>
                                    <th className="px-4 py-3 text-left text-[#C5A059]">Waktu Check-in</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((a, index) => (
                                    <tr key={a.id} className="border-t border-[#C5A059]/10 hover:bg-[#252525]/50">
                                        <td className="px-4 py-3 text-green-400 font-bold">{index + 1}</td>
                                        <td className="px-4 py-3 text-[#C5A059] font-mono text-xs">{a.unique_id}</td>
                                        <td className="px-4 py-3 text-white font-medium">{a.name}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs ${a.status === 'siswa'
                                                ? 'bg-blue-500/20 text-blue-400'
                                                : 'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {a.status === 'siswa' ? 'Siswa' : 'Umum'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-400">{a.school || '-'}</td>
                                        <td className="px-4 py-3 text-green-400 font-medium">
                                            {formatTime(a.checked_in_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    )
}
