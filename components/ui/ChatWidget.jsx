'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

// Simple markdown parser for chat messages
function formatMessage(text) {
    if (!text) return text

    // Split by newlines first
    const lines = text.split('\n')

    return lines.map((line, lineIdx) => {
        // Parse bold (**text** or __text__)
        const parts = []
        let remaining = line
        let key = 0

        // Match **bold** pattern
        const boldRegex = /\*\*(.+?)\*\*/g
        let lastIndex = 0
        let match

        while ((match = boldRegex.exec(line)) !== null) {
            // Add text before the match
            if (match.index > lastIndex) {
                parts.push(line.slice(lastIndex, match.index))
            }
            // Add bold text
            parts.push(<strong key={`b-${lineIdx}-${key++}`} className="font-bold">{match[1]}</strong>)
            lastIndex = match.index + match[0].length
        }

        // Add remaining text
        if (lastIndex < line.length) {
            parts.push(line.slice(lastIndex))
        }

        // If no parts, just return the line
        if (parts.length === 0) {
            parts.push(line)
        }

        // Add line break if not last line
        if (lineIdx < lines.length - 1) {
            parts.push(<br key={`br-${lineIdx}`} />)
        }

        return parts
    }).flat()
}

// ==========================================
// AVATAR CONFIG - Edit values here untuk atur posisi dan ukuran
// ==========================================
const AVATAR_CONFIG = {
    // Ukuran avatar (dalam pixel) - Mbah Darjo style = besar setengah badan
    size: 235,          // Tinggi & lebar avatar 

    // Posisi X (dari kiri) - negatif = ke kiri
    offsetX: -58,

    // Posisi Y (dari atas header) - POSITIF = kaki masuk ke dalam chat
    offsetY: -100,       // Kepala di atas header, kaki masuk ke chat

    // Margin left untuk text (agar tidak tertutup avatar)
    textMarginLeft: 130
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            role: 'bot',
            content: 'Halo! 👋 Saya Ajirasa, saya asisten Natal Gabungan 2025. Tanyakan apa saja seputar acara Natal, pendaftaran, atau informasi website ini!'
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus()
        }
    }, [isOpen])

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return

        const userMessage = inputValue.trim()
        setInputValue('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setIsLoading(true)

        try {
            // n8n Webhook URL - ganti dengan URL webhook kamu
            const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'https://auto.apps.kediritechnopark.com/webhook/natal-chatbot'

            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    sessionId: 'web-chat-' + Date.now() // untuk memory n8n
                })
            })

            const data = await response.json()

            // n8n bisa return { output: "..." } atau { reply: "..." } atau { text: "..." }
            const botReply = data.output || data.reply || data.text || data.message

            if (botReply) {
                setMessages(prev => [...prev, { role: 'bot', content: botReply }])
            } else {
                setMessages(prev => [...prev, {
                    role: 'bot',
                    content: 'Maaf, terjadi kesalahan. Silakan coba lagi.'
                }])
            }
        } catch (error) {
            console.error('Chat error:', error)
            setMessages(prev => [...prev, {
                role: 'bot',
                content: 'Maaf, tidak dapat terhubung ke server. Silakan coba lagi nanti.'
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isOpen
                    ? 'bg-[#252525] text-gray-400 rotate-0'
                    : 'bg-gradient-to-br from-[#C5A059] to-[#D4B06A] text-[#2C2C2C] animate-pulse-gold'
                    }`}
                aria-label={isOpen ? 'Tutup chat' : 'Buka chat'}
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <MessageCircle className="w-6 h-6" />
                )}
            </button>

            {/* Chat Panel */}
            <div
                className={`fixed bottom-24 right-6 z-50 w-[320px] max-w-[calc(100vw-3rem)] transition-all duration-300 ${isOpen
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
            >
                <div className="glass rounded-2xl shadow-2xl border border-[#C5A059]/30">
                    {/* Header with large avatar */}
                    <div className="bg-gradient-to-r from-[#C5A059] to-[#D4B06A] px-4 py-3 flex items-center gap-3 relative z-0 rounded-t-2xl overflow-visible">
                        {/* Large Avatar - BEHIND chat panel (z-0) */}
                        <div
                            className="absolute"
                            style={{
                                width: AVATAR_CONFIG.size,
                                height: AVATAR_CONFIG.size,
                                left: AVATAR_CONFIG.offsetX,
                                top: AVATAR_CONFIG.offsetY,
                                zIndex: 0
                            }}
                        >
                            <img src="/Opening_Gunungan/Santa.webp" alt="Ajirasa" className="w-full h-full object-contain drop-shadow-lg" />
                        </div>
                        {/* Text - offset to account for avatar */}
                        <div style={{ marginLeft: AVATAR_CONFIG.textMarginLeft }} className="pd-l-50 relative z-10">
                            <h3 className="font-bold text-[#2C2C2C] text-sm">AJIRASA</h3>
                            <p className="text-[#2C2C2C]/70 text-xs">Asisten Natal Gabungan</p>
                        </div>
                    </div>

                    {/* Messages Container - IN FRONT of avatar (z-10) */}
                    <div className="h-80 overflow-y-auto p-4 space-y-4 bg-[#0F0F0F]/100 relative z-10">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-[#C5A059] to-[#D4B06A]'
                                    : 'bg-[#252525] border border-[#C5A059]/30'
                                    }`}>
                                    {msg.role === 'user'
                                        ? <User className="w-4 h-4 text-[#2C2C2C]" />
                                        : <Bot className="w-4 h-4 text-[#C5A059]" />
                                    }
                                </div>

                                {/* Message Bubble */}
                                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-[#C5A059] to-[#D4B06A] text-[#2C2C2C] rounded-tr-sm'
                                    : 'bg-[#252525] text-gray-200 border border-[#C5A059]/20 rounded-tl-sm'
                                    }`}>
                                    {formatMessage(msg.content)}
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isLoading && (
                            <div className="flex gap-2">
                                <div className="w-8 h-8 bg-[#252525] border border-[#C5A059]/30 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-[#C5A059]" />
                                </div>
                                <div className="bg-[#252525] border border-[#C5A059]/20 rounded-2xl rounded-tl-sm px-4 py-3">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-[#C5A059] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-[#C5A059] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-[#C5A059] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-[#1A1A1A] rounded-b-2xl border-t border-[#C5A059]/20">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ketik pesan..."
                                className="flex-1 px-4 py-2.5 bg-[#252525] border border-[#C5A059]/20 rounded-xl text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#C5A059] transition-colors"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim() || isLoading}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#D4B06A] text-[#2C2C2C] flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Kirim pesan"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
