import React, { useMemo, useState, useCallback } from 'react'
import { useToast } from '../context/ToastContext'
import { required, positiveNumber } from '../utils/validators'
import { UploadCloud } from 'lucide-react'
import LocationAutocomplete from '../components/common/LocationAutocomplete'
import GoogleMapPicker from '../components/common/GoogleMapPicker'
import { bookService } from '../services/bookService'
import { CONDITION_LABELS } from '../utils/constants'

const initialState = {
  title: '', author: '', price: '', condition: 'GOOD',
  description: '', location: '', latitude: null, longitude: null, images: []
}

export default function SellBookPage() {
  const [form, setForm] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [showMap, setShowMap] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const { pushToast } = useToast()

  const previews = useMemo(() => {
    if (!form.images?.length) return []
    return Array.from(form.images).map(file => URL.createObjectURL(file))
  }, [form.images])

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleLocationSelect = useCallback((place) => {
    setForm(prev => ({ ...prev, location: place.location, latitude: place.latitude, longitude: place.longitude }))
  }, [])

  const handleMarkerChange = useCallback((coords) => {
    setForm(prev => ({ ...prev, latitude: coords.latitude, longitude: coords.longitude }))
  }, [])

  const validate = () => {
    const next = {
      title: required(form.title),
      author: required(form.author),
      price: positiveNumber(form.price),
      description: required(form.description),
      location: required(form.location),
      images: (!form.images?.length) ? 'At least one image required' : null
    }
    setErrors(next)
    return !Object.values(next).some(Boolean)
  }

  const submit = async (e) => {
    if (e) e.preventDefault()
    if (!validate()) return

    setIsUploading(true)
    // Scroll to top so user sees the overlay immediately
    window.scrollTo({ top: 0, behavior: 'smooth' })

    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('author', form.author)
      formData.append('description', form.description)
      formData.append('price', Number(form.price))
      formData.append('condition', form.condition)
      formData.append('location', form.location)
      if (form.latitude !== null) formData.append('latitude', Number(form.latitude))
      if (form.longitude !== null) formData.append('longitude', Number(form.longitude))
      form.images.forEach(file => formData.append('images', file))

      await bookService.create(formData)
      pushToast('success', 'Book listed successfully!')
      setForm(initialState)
    } catch (error) {
      pushToast('error', error || 'Something went wrong')
    }
    setIsUploading(false)
  }

  const conditionOptions = ['NEW', 'LIKE_NEW', 'EXCELLENT', 'VERY_GOOD', 'GOOD', 'ACCEPTABLE']

  return (
    <div className="container animate-slide-up" style={{ paddingTop: 32, paddingBottom: 64, maxWidth: 1100 }}>

      {/* Upload Overlay — fixed to viewport top */}
      {isUploading && (
        <div className="upload-overlay">
          <div className="upload-spinner" />
          <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: '1.1rem' }}>Uploading images & publishing...</div>
          <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>This may take a moment</div>
        </div>
      )}

      <div style={{ marginBottom: 36 }}>
        <h1 className="heading" style={{ fontSize: '1.8rem', margin: '0 0 4px' }}>List a Book for Sale</h1>
        <p className="muted" style={{ margin: 0 }}>Provide accurate details to help buyers find your book.</p>
      </div>

      <div className="sell-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40 }}>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Photos */}
          <section className="form-section">
            <h3 className="form-section-title">Book Photos</h3>
            <div className="form-section-content">
              <div className="dropzone" style={{ position: 'relative', minHeight: 140, display: 'grid', placeItems: 'center' }}>
                <input type="file" multiple accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files)
                    setForm(prev => ({ ...prev, images: [...(prev.images || []), ...files].slice(-3) }))
                  }}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, pointerEvents: 'none' }}>
                  <UploadCloud size={32} color="var(--accent)" />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                    Upload book images
                    <br /><span className="muted" style={{ fontWeight: 400, fontSize: '0.75rem' }}>PNG, JPG or WEBP — Max 3 images</span>
                  </div>
                </div>
              </div>

              {previews.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  {previews.map((src, i) => (
                    <img key={i} src={src} alt="" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} />
                  ))}
                </div>
              )}
              {errors.images && <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 8 }}>{errors.images}</div>}
            </div>
          </section>

          {/* Details */}
          <section className="form-section">
            <h3 className="form-section-title">Book Details</h3>
            <div className="form-section-content" style={{ display: 'grid', gap: 18 }}>
              <div className="grid-2">
                <div>
                  <label className="label">Title</label>
                  <input className="input" placeholder="Book Title" value={form.title} onChange={e => update('title', e.target.value)} />
                  {errors.title && <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 4 }}>{errors.title}</div>}
                </div>
                <div>
                  <label className="label">Author</label>
                  <input className="input" placeholder="Author Name" value={form.author} onChange={e => update('author', e.target.value)} />
                  {errors.author && <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 4 }}>{errors.author}</div>}
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="label">Price (₹)</label>
                  <input type="number" className="input" placeholder="0" value={form.price} onChange={e => update('price', e.target.value)} />
                  {errors.price && <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 4 }}>{errors.price}</div>}
                </div>
                <div>
                  <label className="label">Condition</label>
                  <select className="select" value={form.condition} onChange={e => update('condition', e.target.value)}>
                    {conditionOptions.map(c => <option key={c} value={c}>{CONDITION_LABELS[c]}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Location</label>
                <LocationAutocomplete value={form.location} onChange={(val) => update('location', val)} onSelect={handleLocationSelect} />
                {errors.location && <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 4 }}>{errors.location}</div>}
              </div>

              <button type="button" className="btn-outline" style={{ borderRadius: 10, padding: '10px 16px', fontSize: '0.85rem' }} onClick={() => setShowMap(!showMap)}>
                📍 {showMap ? 'Hide Map' : 'Pick Exact Location on Map'}
              </button>

              {showMap && <GoogleMapPicker latitude={form.latitude} longitude={form.longitude} onChange={handleMarkerChange} />}

              <div>
                <label className="label">Description</label>
                <textarea className="input" style={{ height: 120, resize: 'vertical' }} placeholder="Describe your book..."
                  value={form.description} onChange={e => update('description', e.target.value)} />
                {errors.description && <div style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: 4 }}>{errors.description}</div>}
              </div>
            </div>
          </section>
        </form>

        {/* Preview Sidebar */}
        <aside className="sell-preview" style={{ position: 'sticky', top: 88, alignSelf: 'start' }}>
          <div className="glass card">
            {previews.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
                {previews.map((img, i) => (
                  <img key={i} src={img} alt="" style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 8 }} />
                ))}
              </div>
            )}
            <h3 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{form.title || 'Book Title'}</h3>
            <p className="muted" style={{ margin: '0 0 10px', fontSize: '0.85rem' }}>{form.author || 'Author'}</p>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent)', marginBottom: 14 }}>₹{form.price || 0}</div>
            <button className="btn" style={{ width: '100%' }} onClick={submit} disabled={isUploading}>
              {isUploading ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sell-layout { grid-template-columns: 1fr !important; }
          .sell-preview { position: static !important; }
        }
      `}</style>
    </div>
  )
}