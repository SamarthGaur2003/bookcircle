import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bookService } from '../services/bookService'
import { useToast } from '../context/ToastContext'
import { CONDITION_LABELS } from '../utils/constants'
import { ArrowLeft, Save } from 'lucide-react'
import { motion } from 'framer-motion'

const conditionOptions = ['NEW', 'LIKE_NEW', 'EXCELLENT', 'VERY_GOOD', 'GOOD', 'ACCEPTABLE']

export default function EditListingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { pushToast } = useToast()

  const [book, setBook] = useState(null)
  const [form, setForm] = useState({
    price: '',
    condition: '',
    description: '',
    location: ''
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await bookService.getById(id)
        setBook(data)
        setForm({
          price: data.price || '',
          condition: data.condition || 'GOOD',
          description: data.description || '',
          location: data.location || ''
        })
      } catch (err) {
        pushToast('error', 'Failed to load book')
      }
    })()
  }, [id])

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!hasChanges) return
    setSaving(true)

    try {
      const formData = new FormData()
      formData.append('title', book.title)
      formData.append('author', book.author)
      formData.append('price', Number(form.price))
      formData.append('condition', form.condition)
      formData.append('description', form.description)
      formData.append('location', form.location)
      if (book.latitude) formData.append('latitude', book.latitude)
      if (book.longitude) formData.append('longitude', book.longitude)

      await bookService.update(id, formData)
      pushToast('success', 'Listing updated successfully!')
      navigate('/my-listings')
    } catch (err) {
      pushToast('error', typeof err === 'string' ? err : 'Failed to update listing')
    }
    setSaving(false)
  }

  if (!book) {
    return (
      <div className="container" style={{ paddingTop: 40 }}>
        <div className="glass card" style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>
          <div className="upload-spinner" style={{ margin: '0 auto 16px' }} />
          Loading book details...
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="container"
      style={{ paddingTop: 32, paddingBottom: 64, maxWidth: 900 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <button
          onClick={() => navigate('/my-listings')}
          className="btn-ghost"
          style={{ padding: 8 }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="heading" style={{ margin: 0, fontSize: '1.6rem' }}>Edit Listing</h1>
          <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
            Update details for <strong style={{ color: 'var(--text)' }}>{book.title}</strong>
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
        {/* Edit Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Read-only info */}
          <section className="form-section">
            <h3 className="form-section-title">Book Info (Read Only)</h3>
            <div className="form-section-content" style={{ display: 'grid', gap: 16 }}>
              <div>
                <label className="label">Title</label>
                <input className="input" value={book.title} disabled style={{ opacity: 0.5 }} />
              </div>
              <div>
                <label className="label">Author</label>
                <input className="input" value={book.author} disabled style={{ opacity: 0.5 }} />
              </div>
            </div>
          </section>

          {/* Editable fields */}
          <section className="form-section">
            <h3 className="form-section-title">Editable Details</h3>
            <div className="form-section-content" style={{ display: 'grid', gap: 18 }}>
              <div className="grid-2">
                <div>
                  <label className="label">Price (₹)</label>
                  <input
                    type="number"
                    className="input"
                    placeholder="0"
                    value={form.price}
                    onChange={e => update('price', e.target.value)}
                  />
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
                <input
                  className="input"
                  placeholder="City or area"
                  value={form.location}
                  onChange={e => update('location', e.target.value)}
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  className="input"
                  style={{ height: 120, resize: 'vertical' }}
                  placeholder="Describe your book..."
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Update Button — only visible after edits */}
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button type="submit" className="btn" disabled={saving} style={{ width: '100%', justifyContent: 'center', padding: '14px 24px', fontSize: '0.95rem', borderRadius: 12, gap: 8 }}>
                <Save size={18} />
                {saving ? 'Updating...' : 'Update Listing'}
              </button>
            </motion.div>
          )}
        </form>

        {/* Preview Sidebar */}
        <aside style={{ position: 'sticky', top: 88, alignSelf: 'start' }}>
          <div className="glass card" style={{ padding: 20 }}>
            {book.imageUrls?.[0] && (
              <img
                src={book.imageUrls[0]}
                alt={book.title}
                style={{ width: '100%', height: 200, objectFit: 'contain', borderRadius: 10, marginBottom: 16, background: '#0a0a0a' }}
              />
            )}
            <h3 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{book.title}</h3>
            <p className="muted" style={{ margin: '0 0 8px', fontSize: '0.85rem' }}>by {book.author}</p>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>₹{form.price || book.price || 0}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-block', background: 'rgba(0,229,255,0.1)', border: '1px solid var(--accent)',
                padding: '3px 10px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700,
                color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 0.8
              }}>
                {CONDITION_LABELS[form.condition] || form.condition}
              </span>
            </div>
            {form.location && (
              <p className="muted" style={{ margin: '12px 0 0', fontSize: '0.8rem' }}>📍 {form.location}</p>
            )}
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .container > div:nth-of-type(2) { grid-template-columns: 1fr !important; }
          .container > div:nth-of-type(2) > aside { position: static !important; order: -1; }
        }
      `}</style>
    </motion.div>
  )
}
