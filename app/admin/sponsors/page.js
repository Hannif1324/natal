'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, ExternalLink, AlertTriangle, Loader, Upload, X, Check, Eye, EyeOff, GripVertical } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

const TIER_COLORS = {
    platinum: 'bg-gray-300 text-gray-800',
    gold: 'bg-yellow-500 text-yellow-900',
    silver: 'bg-gray-400 text-gray-800',
    bronze: 'bg-amber-600 text-amber-100'
}

export default function SponsorsPage() {
    const [sponsors, setSponsors] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingSponsor, setEditingSponsor] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        name: '', logo: '', website: '', tier: 'bronze', is_active: true
    })
    const [logoFile, setLogoFile] = useState(null)
    const [logoPreview, setLogoPreview] = useState(null)

    useEffect(() => { fetchSponsors() }, [])

    const fetchSponsors = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('sponsors')
            .select('*')
            .order('tier', { ascending: true })
            .order('display_order', { ascending: true })
        setSponsors(data || [])
        setLoading(false)
    }

    const resetForm = () => {
        setFormData({ name: '', logo: '', website: '', tier: 'bronze', is_active: true })
        setLogoFile(null)
        setLogoPreview(null)
        setEditingSponsor(null)
        setShowForm(false)
    }

    const openEditForm = (sponsor) => {
        setEditingSponsor(sponsor)
        setFormData({
            name: sponsor.name,
            logo: sponsor.logo,
            website: sponsor.website || '',
            tier: sponsor.tier,
            is_active: sponsor.is_active
        })
        setLogoPreview(sponsor.logo)
        setShowForm(true)
    }

    const handleLogoChange = (e) => {
        const file = e.target.files[0]
        if (file && file.size <= 2 * 1024 * 1024) {
            setLogoFile(file)
            setLogoPreview(URL.createObjectURL(file))
        } else {
            alert('File terlalu besar (maks 2MB)')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.name.trim()) return alert('Nama sponsor wajib diisi')
        if (!logoPreview && !formData.logo) return alert('Logo sponsor wajib diupload')

        setSaving(true)
        try {
            let logoUrl = formData.logo

            // Upload logo if new file selected
            if (logoFile) {
                const fileName = `sponsor-${Date.now()}.${logoFile.name.split('.').pop()}`
                const { error: uploadError } = await supabase.storage
                    .from('sponsor-logos')
                    .upload(fileName, logoFile)

                if (uploadError) throw uploadError

                logoUrl = supabase.storage.from('sponsor-logos').getPublicUrl(fileName).data.publicUrl
            }

            const sponsorData = {
                name: formData.name.trim(),
                logo: logoUrl,
                website: formData.website.trim() || null,
                tier: formData.tier,
                is_active: formData.is_active,
                display_order: editingSponsor ? editingSponsor.display_order : sponsors.length
            }

            if (editingSponsor) {
                await supabase.from('sponsors').update(sponsorData).eq('id', editingSponsor.id)
            } else {
                await supabase.from('sponsors').insert(sponsorData)
            }

            resetForm()
            fetchSponsors()
        } catch (err) {
            console.error(err)
            alert('Gagal menyimpan: ' + err.message)
        } finally {
            setSaving(false)
        }
    }

    const toggleActive = async (sponsor) => {
        await supabase.from('sponsors').update({ is_active: !sponsor.is_active }).eq('id', sponsor.id)
        fetchSponsors()
    }

    const confirmDelete = async () => {
        if (!deleteConfirm) return
        setDeleting(true)

        try {
            // Delete logo from storage if exists
            if (deleteConfirm.logo && deleteConfirm.logo.includes('supabase')) {
                const fileName = deleteConfirm.logo.split('/').pop()
                await supabase.storage.from('sponsor-logos').remove([fileName])
            }

            await supabase.from('sponsors').delete().eq('id', deleteConfirm.id)
            setDeleteConfirm(null)
            fetchSponsors()
        } catch (err) {
            alert('Gagal menghapus: ' + err.message)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Kelola Sponsor</h1>
                    <p className="text-gray-400 text-sm">Total: <span className="text-[#C5A059] font-semibold">{sponsors.length}</span> sponsor</p>
                </div>
                <button onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#C5A059] text-[#2C2C2C] font-semibold rounded-lg hover:bg-[#D4B06A]">
                    <Plus className="w-5 h-5" /> Tambah Sponsor
                </button>
            </div>

            {/* Sponsor List */}
            {loading ? (
                <p className="text-gray-400">Loading...</p>
            ) : sponsors.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Belum ada sponsor</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sponsors.map(s => (
                        <div key={s.id} className={`bg-[#1A1A1A] rounded-xl border border-[#C5A059]/20 p-4 ${!s.is_active ? 'opacity-50' : ''}`}>
                            <div className="flex items-start gap-3">
                                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                    <img src={s.logo} alt={s.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-semibold truncate">{s.name}</h3>
                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${TIER_COLORS[s.tier]}`}>
                                        {s.tier.toUpperCase()}
                                    </span>
                                    {s.website && (
                                        <a href={s.website} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-[#C5A059] text-xs mt-1 hover:underline">
                                            <ExternalLink className="w-3 h-3" /> Website
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 pt-3 border-t border-[#C5A059]/10">
                                <button onClick={() => toggleActive(s)}
                                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded text-xs ${s.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                    {s.is_active ? <><Eye className="w-3.5 h-3.5" /> Active</> : <><EyeOff className="w-3.5 h-3.5" /> Inactive</>}
                                </button>
                                <button onClick={() => openEditForm(s)}
                                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded text-xs bg-[#C5A059]/20 text-[#C5A059]">
                                    <Edit className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button onClick={() => setDeleteConfirm(s)}
                                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded text-xs bg-red-500/20 text-red-400">
                                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => !saving && resetForm()}>
                    <div className="bg-[#1A1A1A] rounded-xl p-6 max-w-md w-full border border-[#C5A059]/30" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-white mb-4">
                            {editingSponsor ? 'Edit Sponsor' : 'Tambah Sponsor Baru'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Logo Upload */}
                            <div>
                                <label className="block text-[#C5A059] text-sm mb-2">Logo Sponsor *</label>
                                <div className="flex items-center gap-4">
                                    {logoPreview ? (
                                        <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                                            <img src={logoPreview} alt="Preview" className="w-full h-full object-contain" />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 bg-[#252525] border-2 border-dashed border-[#C5A059]/30 rounded-lg flex items-center justify-center">
                                            <Upload className="w-8 h-8 text-gray-500" />
                                        </div>
                                    )}
                                    <div>
                                        <input type="file" accept=".jpg,.jpeg,.png,.webp"
                                            onChange={handleLogoChange}
                                            className="hidden" id="logo-upload" />
                                        <label htmlFor="logo-upload"
                                            className="inline-block px-4 py-2 bg-[#252525] text-white rounded-lg cursor-pointer hover:bg-[#333]">
                                            Pilih File
                                        </label>
                                        <p className="text-gray-500 text-xs mt-1">JPG, PNG, WebP (maks 2MB)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-[#C5A059] text-sm mb-2">Nama Sponsor *</label>
                                <input type="text" value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#252525] border border-[#C5A059]/20 rounded-lg text-white"
                                    placeholder="Nama perusahaan/sponsor" />
                            </div>

                            {/* Website */}
                            <div>
                                <label className="block text-[#C5A059] text-sm mb-2">Website</label>
                                <input type="url" value={formData.website}
                                    onChange={e => setFormData({ ...formData, website: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#252525] border border-[#C5A059]/20 rounded-lg text-white"
                                    placeholder="https://example.com" />
                            </div>

                            {/* Tier */}
                            <div>
                                <label className="block text-[#C5A059] text-sm mb-2">Tier Sponsor</label>
                                <select value={formData.tier}
                                    onChange={e => setFormData({ ...formData, tier: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#252525] border border-[#C5A059]/20 rounded-lg text-white">
                                    <option value="platinum">Platinum</option>
                                    <option value="gold">Gold</option>
                                    <option value="silver">Silver</option>
                                    <option value="bronze">Bronze</option>
                                </select>
                            </div>

                            {/* Active Toggle */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={formData.is_active}
                                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-5 h-5 accent-[#C5A059]" />
                                <span className="text-white">Tampilkan di landing page</span>
                            </label>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={resetForm} disabled={saving}
                                    className="flex-1 py-3 border border-gray-600 text-gray-400 rounded-lg">
                                    Batal
                                </button>
                                <button type="submit" disabled={saving}
                                    className="flex-1 py-3 bg-[#C5A059] text-[#2C2C2C] font-bold rounded-lg flex items-center justify-center gap-2">
                                    {saving ? <><Loader className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><Check className="w-4 h-4" /> Simpan</>}
                                </button>
                            </div>
                        </form>
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
                        <h3 className="text-xl font-bold text-white text-center mb-2">Hapus Sponsor?</h3>
                        <p className="text-gray-400 text-center mb-4">
                            <span className="text-white font-semibold">{deleteConfirm.name}</span>
                        </p>
                        <p className="text-red-400 text-sm text-center mb-6">Data akan dihapus permanen.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} disabled={deleting}
                                className="flex-1 py-3 border border-gray-600 text-gray-400 rounded-lg">
                                Batal
                            </button>
                            <button onClick={confirmDelete} disabled={deleting}
                                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-lg flex items-center justify-center gap-2">
                                {deleting ? <><Loader className="w-4 h-4 animate-spin" /> Menghapus...</> : <><Trash2 className="w-4 h-4" /> Hapus</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
