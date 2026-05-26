'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, User, FileText, Check, X, QrCode, Eye, Download, MessageCircle, GraduationCap, Trash2, AlertTriangle, Loader, FileSpreadsheet } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { generateQRCode, createQRPayload } from '@/lib/qr-utils'

export default function AttendeesPage() {
    const [attendees, setAttendees] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [selectedProof, setSelectedProof] = useState(null)
    const [selectedQR, setSelectedQR] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(null) // { attendee, deleting }
    const [deleting, setDeleting] = useState(false)

    useEffect(() => { fetchAttendees() }, [])

    const fetchAttendees = async () => {
        setLoading(true)
        const { data } = await supabase.from('attendees').select('*').order('created_at', { ascending: false })
        setAttendees(data || [])
        setLoading(false)
    }

    const updateStatus = async (id, status) => {
        await supabase.from('attendees').update({ payment_status: status }).eq('id', id)
        fetchAttendees()
    }

    const generateQR = async (attendee) => {
        try {
            const qrData = createQRPayload(attendee)
            const qrCode = await generateQRCode(qrData)

            // Convert base64 to blob for upload
            const base64Data = qrCode.split(',')[1]
            const byteCharacters = atob(base64Data)
            const byteNumbers = new Array(byteCharacters.length)
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i)
            }
            const byteArray = new Uint8Array(byteNumbers)
            const blob = new Blob([byteArray], { type: 'image/png' })

            // Upload to Supabase Storage
            const fileName = `QR-${attendee.unique_id}.png`
            const { error: uploadError } = await supabase.storage
                .from('qr-codes')
                .upload(fileName, blob, {
                    contentType: 'image/png',
                    upsert: true
                })

            if (uploadError) {
                console.error('Upload error:', uploadError)
                throw uploadError
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('qr-codes')
                .getPublicUrl(fileName)

            const qrPublicUrl = urlData.publicUrl

            // Save to database
            await supabase.from('attendees').update({
                qr_code: qrCode,
                qr_generated: true,
                qr_url: qrPublicUrl
            }).eq('id', attendee.id)

            fetchAttendees()
        } catch (err) {
            console.error('Generate QR failed:', err)
            alert('Gagal generate QR: ' + (err.message || JSON.stringify(err)))
        }
    }

    const openWhatsApp = (phone, name, uniqueId, qrUrl) => {
        let message = `Halo ${name}! 🎄\n\nTerima kasih sudah mendaftar Natal Gabungan di SMK PGRI 1 Kediri.\n\nID: ${uniqueId}`

        if (qrUrl) {
            message += `\n\n📱 QR Check-in:\n${qrUrl}`
        }

        message += `\n\nSimpan QR untuk check-in. Sampai jumpa di Acara Natal Gabungan! 🎉`

        window.open(`https://wa.me/${phone.replace(/^0/, '62')}?text=${encodeURIComponent(message)}`, '_blank')
    }

    const downloadQR = (qrCode, uniqueId) => {
        const link = document.createElement('a')
        link.href = qrCode
        link.download = `QR-${uniqueId}.png`
        link.click()
    }

    const confirmDelete = async () => {
        if (!deleteConfirm) return
        setDeleting(true)

        console.log('Attempting to delete:', deleteConfirm)

        try {
            // Try delete by id first
            let result = await supabase
                .from('attendees')
                .delete()
                .eq('id', deleteConfirm.id)

            console.log('Delete by id result:', result)

            // If error, try by unique_id
            if (result.error) {
                console.log('Trying delete by unique_id...')
                result = await supabase
                    .from('attendees')
                    .delete()
                    .eq('unique_id', deleteConfirm.unique_id)

                console.log('Delete by unique_id result:', result)
            }

            if (result.error) {
                throw result.error
            }

            console.log('Delete successful!')

            // Try to delete payment proof from storage (don't fail if this errors)
            if (deleteConfirm.payment_proof) {
                try {
                    const fileName = deleteConfirm.payment_proof.split('/').pop()
                    await supabase.storage.from('payment-proofs').remove([fileName])
                } catch (storageErr) {
                    console.log('Storage delete skipped:', storageErr)
                }
            }

            // Remove from local state immediately
            const deletedId = deleteConfirm.id
            setAttendees(prev => prev.filter(a => a.id !== deletedId))
            setDeleteConfirm(null)
            console.log('Removed from UI!')
        } catch (err) {
            console.error('Delete failed:', err)
            alert('Gagal menghapus: ' + (err.message || JSON.stringify(err)))
        } finally {
            setDeleting(false)
        }
    }

    const filtered = filter === 'all' ? attendees : attendees.filter(a => a.payment_status === filter)

    // Get verified attendees count
    const verifiedAttendees = attendees.filter(a => a.payment_status === 'verified')

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

    const exportVerifiedToCSV = () => {
        if (verifiedAttendees.length === 0) {
            alert('Tidak ada pendaftar terverifikasi')
            return
        }

        // CSV Headers
        const headers = ['No', 'ID', 'Nama', 'Email', 'WhatsApp', 'Status', 'Sekolah', 'Tanggal Daftar', 'QR Generated']

        // CSV Rows
        const rows = verifiedAttendees.map((a, index) => [
            index + 1,
            a.unique_id,
            a.name,
            a.email,
            a.phone,
            a.status === 'siswa' ? 'Siswa' : 'Umum/Alumni',
            a.school || '-',
            formatDateTime(a.created_at),
            a.qr_generated ? 'Ya' : 'Belum'
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
        link.download = `pendaftar-verified-natal-${new Date().toISOString().split('T')[0]}.csv`
        link.click()
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Daftar Pendaftar</h1>
                    <p className="text-gray-400 text-sm">Verified: <span className="text-green-400 font-semibold">{verifiedAttendees.length}</span> orang</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        onClick={exportVerifiedToCSV}
                        disabled={verifiedAttendees.length === 0}
                        className="p-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 disabled:opacity-50"
                        title="Export Verified ke CSV"
                    >
                        <FileSpreadsheet className="w-5 h-5" />
                    </button>
                    <select value={filter} onChange={e => setFilter(e.target.value)}
                        className="flex-1 sm:flex-none px-4 py-2 bg-[#1A1A1A] border border-[#C5A059]/20 rounded-lg text-white">
                        <option value="all">Semua ({attendees.length})</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <p className="text-gray-400">Loading...</p>
            ) : filtered.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Tidak ada data</p>
            ) : (
                <>
                    {/* Mobile Card View */}
                    <div className="lg:hidden space-y-4">
                        {filtered.map(a => (
                            <div key={a.id} className="bg-[#1A1A1A] rounded-xl border border-[#C5A059]/20 p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-white font-semibold">{a.name}</p>
                                        <p className="text-[#C5A059] font-mono text-xs">{a.unique_id}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs ${a.payment_status === 'verified' ? 'bg-green-500/20 text-green-400' :
                                        a.payment_status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                            'bg-yellow-500/20 text-yellow-400'
                                        }`}>{a.payment_status}</span>
                                </div>

                                <div className="text-xs text-gray-400 space-y-1.5 mb-3">
                                    <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {a.email}</p>
                                    <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {a.phone}</p>
                                    <p className="flex items-center gap-2"><GraduationCap className="w-3.5 h-3.5" /> {a.status === 'siswa' ? `Siswa - ${a.school}` : 'Umum/Alumni'}</p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {a.payment_proof && (
                                        <button onClick={() => setSelectedProof(a.payment_proof)}
                                            className="text-[#C5A059] text-xs bg-[#C5A059]/10 px-3 py-1.5 rounded flex items-center gap-1">
                                            <FileText className="w-3.5 h-3.5" /> Bukti
                                        </button>
                                    )}

                                    {a.payment_status === 'pending' && (
                                        <>
                                            <button onClick={() => updateStatus(a.id, 'verified')}
                                                className="text-green-400 text-xs bg-green-500/10 px-3 py-1.5 rounded flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Verify</button>
                                            <button onClick={() => updateStatus(a.id, 'rejected')}
                                                className="text-red-400 text-xs bg-red-500/10 px-3 py-1.5 rounded flex items-center gap-1"><X className="w-3.5 h-3.5" /> Reject</button>
                                        </>
                                    )}

                                    {a.payment_status === 'verified' && !a.qr_generated && (
                                        <button onClick={() => generateQR(a)} className="text-[#C5A059] text-xs bg-[#C5A059]/20 px-3 py-1.5 rounded flex items-center gap-1">
                                            <QrCode className="w-3.5 h-3.5" /> Generate QR
                                        </button>
                                    )}

                                    {a.qr_generated && (
                                        <>
                                            <button onClick={() => setSelectedQR({ qr: a.qr_code, name: a.name, id: a.unique_id })}
                                                className="text-[#C5A059] text-xs bg-[#C5A059]/10 px-3 py-1.5 rounded flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> QR</button>
                                            <button onClick={() => downloadQR(a.qr_code, a.unique_id)}
                                                className="text-blue-400 text-xs bg-blue-500/10 px-3 py-1.5 rounded flex items-center gap-1"><Download className="w-3.5 h-3.5" /> Download</button>
                                            <button onClick={() => openWhatsApp(a.phone, a.name, a.unique_id, a.qr_url)}
                                                className="text-green-400 text-xs bg-green-500/10 px-3 py-1.5 rounded flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> WA</button>
                                        </>
                                    )}

                                    {/* Delete Button */}
                                    <button onClick={() => setDeleteConfirm(a)}
                                        className="text-red-400 text-xs bg-red-500/10 px-3 py-1.5 rounded flex items-center gap-1 hover:bg-red-500/20">
                                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block bg-[#1A1A1A] rounded-xl border border-[#C5A059]/20 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[#252525]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-[#C5A059]">ID</th>
                                    <th className="px-4 py-3 text-left text-[#C5A059]">Nama</th>
                                    <th className="px-4 py-3 text-left text-[#C5A059]">Kontak</th>
                                    <th className="px-4 py-3 text-left text-[#C5A059]">Status</th>
                                    <th className="px-4 py-3 text-left text-[#C5A059]">Pembayaran</th>
                                    <th className="px-4 py-3 text-left text-[#C5A059]">QR</th>
                                    <th className="px-4 py-3 text-left text-[#C5A059]">Follow Up</th>
                                    <th className="px-4 py-3 text-left text-[#C5A059]">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(a => (
                                    <tr key={a.id} className="border-t border-[#C5A059]/10">
                                        <td className="px-4 py-3 text-gray-300 font-mono text-xs">{a.unique_id}</td>
                                        <td className="px-4 py-3 text-white">{a.name}</td>
                                        <td className="px-4 py-3">
                                            <p className="text-gray-400 text-xs">{a.email}</p>
                                            <p className="text-gray-400 text-xs">{a.phone}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs text-gray-400">{a.status === 'siswa' ? `Siswa - ${a.school}` : 'Umum'}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs ${a.payment_status === 'verified' ? 'bg-green-500/20 text-green-400' :
                                                a.payment_status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                                }`}>{a.payment_status}</span>
                                            {a.payment_proof && (
                                                <button onClick={() => setSelectedProof(a.payment_proof)} className="ml-2 text-[#C5A059] text-xs underline">
                                                    Lihat
                                                </button>
                                            )}
                                            {a.payment_status === 'pending' && (
                                                <div className="mt-2 space-x-2">
                                                    <button onClick={() => updateStatus(a.id, 'verified')} className="text-green-400 text-xs"><Check className="w-4 h-4" /></button>
                                                    <button onClick={() => updateStatus(a.id, 'rejected')} className="text-red-400 text-xs"><X className="w-4 h-4" /></button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {a.qr_generated && a.qr_code ? (
                                                <div className="space-y-1">
                                                    <button onClick={() => setSelectedQR({ qr: a.qr_code, name: a.name, id: a.unique_id })}
                                                        className="text-[#C5A059] text-xs underline block"><Eye className="w-4 h-4" /></button>
                                                    <button onClick={() => downloadQR(a.qr_code, a.unique_id)}
                                                        className="text-blue-400 text-xs underline block"><Download className="w-4 h-4" /></button>
                                                </div>
                                            ) : a.payment_status === 'verified' ? (
                                                <button onClick={() => generateQR(a)} className="text-[#C5A059] text-xs bg-[#C5A059]/20 px-2 py-1 rounded">
                                                    Generate
                                                </button>
                                            ) : (
                                                <span className="text-gray-500 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {a.qr_generated && (
                                                <button onClick={() => openWhatsApp(a.phone, a.name, a.unique_id, a.qr_url)}
                                                    className="text-green-400 text-xs flex items-center gap-1"><MessageCircle className="w-4 h-4" /> WA</button>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button onClick={() => setDeleteConfirm(a)}
                                                className="text-red-400 text-xs flex items-center gap-1 hover:text-red-300">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Proof Modal */}
            {selectedProof && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProof(null)}>
                    <div className="bg-[#1A1A1A] rounded-xl p-4 max-w-lg w-full">
                        <img src={selectedProof} alt="Bukti" className="max-h-[70vh] rounded-lg mx-auto" />
                        <button onClick={() => setSelectedProof(null)} className="mt-4 w-full py-2 bg-[#C5A059] text-[#2C2C2C] rounded-lg font-bold">
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* QR Modal */}
            {selectedQR && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedQR(null)}>
                    <div className="bg-[#1A1A1A] rounded-xl p-6 text-center max-w-sm w-full" onClick={e => e.stopPropagation()}>
                        <h3 className="text-[#C5A059] font-bold mb-1">{selectedQR.name}</h3>
                        <p className="text-gray-400 text-sm mb-4">{selectedQR.id}</p>
                        <img src={selectedQR.qr} alt="QR" className="w-48 h-48 mx-auto bg-white p-2 rounded-lg" />
                        <div className="mt-4 flex gap-2">
                            <button onClick={() => downloadQR(selectedQR.qr, selectedQR.id)}
                                className="flex-1 py-2 bg-[#C5A059] text-[#2C2C2C] rounded-lg font-bold text-sm">
                                <Download className="w-4 h-4 inline mr-1" /> Download
                            </button>
                            <button onClick={() => setSelectedQR(null)}
                                className="flex-1 py-2 border border-[#C5A059] text-[#C5A059] rounded-lg text-sm">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => !deleting && setDeleteConfirm(null)}>
                    <div className="bg-[#1A1A1A] rounded-xl p-6 max-w-sm w-full border border-red-500/30" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-red-400" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white text-center mb-2">Hapus Pendaftar?</h3>
                        <p className="text-gray-400 text-center mb-4">
                            <span className="text-white font-semibold">{deleteConfirm.name}</span>
                            <br />
                            <span className="text-[#C5A059] font-mono text-sm">{deleteConfirm.unique_id}</span>
                        </p>
                        <p className="text-red-400 text-sm text-center mb-6">Data akan dihapus permanen dan tidak dapat dikembalikan.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                disabled={deleting}
                                className="flex-1 py-3 border border-gray-600 text-gray-400 rounded-lg hover:bg-gray-800 disabled:opacity-50">
                                Batal
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2">
                                {deleting ? <><Loader className="w-4 h-4 animate-spin" /> Menghapus...</> : <><Trash2 className="w-4 h-4" /> Hapus</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
