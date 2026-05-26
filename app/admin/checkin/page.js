'use client'

import { useState, useRef } from 'react'
import { Keyboard, Camera, Video, Square, Check, XCircle, AlertTriangle, CreditCard, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function CheckinPage() {
    const [manualId, setManualId] = useState('')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showScanner, setShowScanner] = useState(false)
    const [scanning, setScanning] = useState(false)
    const scannerRef = useRef(null)

    const startScanner = async () => {
        try {
            // Wait for DOM to be ready
            await new Promise(resolve => setTimeout(resolve, 100))

            // Check if element exists
            const qrElement = document.getElementById('qr-reader')
            if (!qrElement) {
                console.error('QR Reader element not found')
                alert('Element scanner tidak ditemukan. Coba refresh halaman.')
                return
            }

            const { Html5Qrcode } = await import('html5-qrcode')

            // Stop existing scanner if any
            if (scannerRef.current) {
                try {
                    await scannerRef.current.stop()
                    scannerRef.current = null
                } catch (e) {
                    console.log('Stop existing scanner:', e)
                }
            }

            // Scanner config - larger scan area for better detection
            const scanConfig = {
                fps: 15,  // Higher FPS for smoother scanning
                qrbox: { width: 280, height: 280 },  // Larger scan box
                aspectRatio: 1.0,  // Square aspect ratio
                disableFlip: false,  // Allow scanning from any orientation
                experimentalFeatures: {
                    useBarCodeDetectorIfSupported: true  // Use native API if available
                }
            }

            scannerRef.current = new Html5Qrcode('qr-reader')

            // Try back camera first (environment)
            try {
                await scannerRef.current.start(
                    { facingMode: 'environment' },
                    scanConfig,
                    (text) => onScanSuccess(text),
                    () => { }
                )
                setScanning(true)
                console.log('Camera started successfully (environment)')
                return
            } catch (envErr) {
                console.log('Environment camera failed, trying user camera:', envErr)
            }

            // Fallback to front camera (user)
            try {
                scannerRef.current = new Html5Qrcode('qr-reader')
                await scannerRef.current.start(
                    { facingMode: 'user' },
                    scanConfig,
                    (text) => onScanSuccess(text),
                    () => { }
                )
                setScanning(true)
                console.log('Camera started successfully (user)')
                return
            } catch (userErr) {
                console.error('User camera also failed:', userErr)
            }

            // If both fail, try with any available camera
            try {
                const devices = await Html5Qrcode.getCameras()
                console.log('Available cameras:', devices)

                if (devices && devices.length > 0) {
                    scannerRef.current = new Html5Qrcode('qr-reader')
                    await scannerRef.current.start(
                        devices[0].id,
                        scanConfig,
                        (text) => onScanSuccess(text),
                        () => { }
                    )
                    setScanning(true)
                    console.log('Camera started with device ID:', devices[0].id)
                    return
                } else {
                    alert('Tidak ada kamera yang tersedia di perangkat ini')
                }
            } catch (deviceErr) {
                console.error('Device enumeration failed:', deviceErr)
                alert('Gagal akses kamera. Pastikan izin kamera sudah diberikan dan coba refresh halaman.')
            }

        } catch (err) {
            console.error('Scanner start error:', err)
            alert('Gagal memulai scanner: ' + err.message)
        }
    }

    const stopScanner = async () => {
        try {
            if (scannerRef.current) {
                await scannerRef.current.stop()
                scannerRef.current = null
            }
        } catch { }
        setScanning(false)
    }

    const onScanSuccess = async (text) => {
        if (loading) return
        await stopScanner()

        let id = text
        try { id = JSON.parse(text).id || text } catch { }
        await processCheckin(id)
    }

    const handleManualCheckin = async () => {
        if (!manualId.trim()) return
        await processCheckin(manualId.toUpperCase().trim())
    }

    const processCheckin = async (uniqueId) => {
        setLoading(true)
        setResult(null)

        try {
            const { data: attendee } = await supabase.from('attendees')
                .select('*').eq('unique_id', uniqueId.toUpperCase()).single()

            if (!attendee) {
                setResult({ success: false, message: 'ID tidak ditemukan', icon: 'error' })
            } else if (attendee.checked_in) {
                setResult({
                    success: false,
                    message: 'Sudah check-in!',
                    icon: 'warning',
                    attendee,
                    checkedAt: new Date(attendee.checked_in_at).toLocaleString('id-ID')
                })
            } else if (attendee.payment_status !== 'verified') {
                setResult({ success: false, message: 'Pembayaran belum verified', icon: 'payment', attendee })
            } else {
                await supabase.from('attendees').update({
                    checked_in: true,
                    checked_in_at: new Date().toISOString()
                }).eq('id', attendee.id)

                setResult({ success: true, message: 'Check-in Berhasil!', icon: 'success', attendee })
            }
        } catch (err) {
            setResult({ success: false, message: 'Error: ' + err.message, icon: 'error' })
        }

        setLoading(false)
        setManualId('')
    }

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">Check-in Peserta</h1>
            <p className="text-gray-400 text-center text-sm sm:text-base mb-6 sm:mb-8">Ketik ID atau scan QR peserta</p>

            {/* Manual Input - Primary */}
            <div className="bg-[#1A1A1A] rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#C5A059]/20 mb-4">
                <label className="block text-[#C5A059] text-sm font-medium mb-3 flex items-center gap-2"><Keyboard className="w-4 h-4" /> Ketik ID Tiket</label>
                <input
                    type="text" value={manualId}
                    onChange={e => setManualId(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && handleManualCheckin()}
                    placeholder="NATAL-XXXX"
                    className="w-full px-5 py-4 bg-[#252525] border-2 border-[#C5A059]/30 rounded-xl text-white text-xl text-center uppercase tracking-widest focus:border-[#C5A059] outline-none font-mono"
                    autoFocus
                />
                <button onClick={handleManualCheckin} disabled={loading || !manualId.trim()}
                    className="w-full mt-4 py-4 bg-[#C5A059] text-[#2C2C2C] font-bold text-lg rounded-xl disabled:opacity-50">
                    {loading ? 'Memproses...' : <><Check className="w-5 h-5 inline mr-2" />Check-in</>}
                </button>
            </div>

            {/* Scanner Toggle */}
            <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#C5A059]/20 mb-6">
                <button onClick={() => setShowScanner(!showScanner)}
                    className="w-full text-[#C5A059] text-sm flex items-center justify-center gap-2">
                    <Camera className="w-4 h-4" /> {showScanner ? 'Sembunyikan' : 'Tampilkan'} Kamera Scanner
                </button>

                {showScanner && (
                    <div className="mt-4">
                        {/* QR Reader Container - always visible when showScanner is true */}
                        <div
                            id="qr-reader"
                            className="rounded-lg overflow-hidden bg-black mb-3"
                            style={{ minHeight: scanning ? '350px' : '0px' }}
                        />

                        {!scanning ? (
                            <button onClick={startScanner}
                                className="w-full py-3 bg-[#252525] text-[#C5A059] rounded-lg border border-[#C5A059]/30">
                                <Video className="w-4 h-4 inline mr-2" /> Mulai Scan
                            </button>
                        ) : (
                            <button onClick={stopScanner}
                                className="w-full py-3 bg-red-500/20 text-red-400 rounded-lg">
                                <Square className="w-4 h-4 inline mr-2" /> Stop
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Result */}
            {result && (
                <div className={`rounded-2xl p-8 text-center ${result.success ? 'bg-green-500/20 border-2 border-green-500/50' : 'bg-red-500/20 border-2 border-red-500/50'}`}>
                    <div className="flex justify-center mb-4">
                        {result.icon === 'success' && <CheckCircle className="w-16 h-16 text-green-400" />}
                        {result.icon === 'error' && <XCircle className="w-16 h-16 text-red-400" />}
                        {result.icon === 'warning' && <AlertTriangle className="w-16 h-16 text-yellow-400" />}
                        {result.icon === 'payment' && <CreditCard className="w-16 h-16 text-yellow-400" />}
                    </div>
                    <p className={`text-2xl font-bold ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                        {result.message}
                    </p>

                    {result.attendee && (
                        <div className="mt-4 text-left bg-[#1A1A1A] rounded-xl p-4 text-sm">
                            <p className="flex justify-between py-1"><span className="text-gray-400">Nama:</span><span className="text-white font-semibold">{result.attendee.name}</span></p>
                            <p className="flex justify-between py-1"><span className="text-gray-400">ID:</span><span className="text-white font-mono">{result.attendee.unique_id}</span></p>
                            <p className="flex justify-between py-1"><span className="text-gray-400">Status:</span><span className="text-white">{result.attendee.status === 'siswa' ? 'Siswa' : 'Umum/Alumni'}</span></p>
                            {result.attendee.school && <p className="flex justify-between py-1"><span className="text-gray-400">Sekolah:</span><span className="text-white">{result.attendee.school}</span></p>}
                            {result.checkedAt && <p className="flex justify-between py-1 border-t border-gray-700 mt-2 pt-2"><span className="text-gray-400">Waktu:</span><span className="text-yellow-400">{result.checkedAt}</span></p>}
                        </div>
                    )}
                    <button onClick={() => setResult(null)} className="mt-6 px-8 py-3 bg-[#C5A059] text-[#2C2C2C] font-bold rounded-xl">
                        Berikutnya
                    </button>
                </div>
            )}
        </div>
    )
}
