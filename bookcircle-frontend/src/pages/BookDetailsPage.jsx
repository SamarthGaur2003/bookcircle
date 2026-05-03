import api from '../api/axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { bookService } from '../services/bookService'
import BookGallery from '../components/books/BookGallery'
import BookMeta from '../components/books/BookMeta'
import { Star, Info, MessageSquare, ChevronRight } from 'lucide-react'
import BookCard from '../components/common/BookCard'
import BookMap from '../components/maps/BookMap'
import { CONDITION_LABELS } from '../utils/constants'
import { useToast } from '../context/ToastContext'

export default function BookDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { pushToast } = useToast()

  const [book, setBook] = useState(null)
  const [error, setError] = useState('')
  const [reviews, setReviews] = useState([])
  const [avgRating, setAvgRating] = useState(0)
  const [similarBooks, setSimilarBooks] = useState([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, text: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  // Load book
  useEffect(() => {
    ;(async () => {
      try {
        setBook(await bookService.getById(id))
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Unable to load book')
      }
    })()
    window.scrollTo(0, 0)
  }, [id])

  // Load reviews
  useEffect(() => {
    if (!book?.sellerId) return
    const fetchReviews = async () => {
      try {
        const reviewData = await api.get(`/review/seller/${book.sellerId}`)
        setReviews(Array.isArray(reviewData) ? reviewData : [])

        const avgData = await api.get(`/review/seller/${book.sellerId}/average`)
        setAvgRating(typeof avgData === 'number' ? avgData : 0)
      } catch (err) {
        console.error('Failed to load reviews:', err)
      }
    }
    fetchReviews()
  }, [book?.sellerId])

  // Load similar books
  useEffect(() => {
    if (!id) return
    const fetchSimilar = async () => {
      try {
        const data = await api.get(`/book/${id}/similar`)
        setSimilarBooks(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load similar books:', err)
      }
    }
    fetchSimilar()
  }, [id])

  if (!book) {
    return (
      <div className="container" style={{ padding: 40 }}>
        <div className="glass card" style={{ textAlign: 'center', padding: 40 }}>
          {error || 'Loading book details...'}
        </div>
      </div>
    )
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setSubmittingReview(true)
    try {
      await api.post(`/review/add?sellerId=${book.sellerId}`, {
        rating: newReview.rating,
        comment: newReview.text
      })

      const reviewData = await api.get(`/review/seller/${book.sellerId}`)
      setReviews(Array.isArray(reviewData) ? reviewData : [])

      const avgData = await api.get(`/review/seller/${book.sellerId}/average`)
      setAvgRating(typeof avgData === 'number' ? avgData : 0)

      setShowReviewForm(false)
      setNewReview({ rating: 5, text: '' })
      pushToast('success', 'Review submitted!')
    } catch (err) {
      pushToast('error', typeof err === 'string' ? err : 'Failed to add review')
    }
    setSubmittingReview(false)
  }

  const renderStars = (rating, size = 16) => (
    <div className="review-stars">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size} fill={i <= rating ? '#FFB800' : 'none'} color={i <= rating ? '#FFB800' : 'var(--border)'} />
      ))}
    </div>
  )

  return (
    <div className="container animate-slide-up" style={{ paddingBottom: 80, paddingTop: 24, maxWidth: 1200 }}>

      {/* Breadcrumbs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, fontSize: '0.85rem', color: 'var(--muted)' }}>
        <Link to="/" className="btn-ghost" style={{ padding: '4px 0' }}>Home</Link>
        <ChevronRight size={14} />
        <Link to="/browse" className="btn-ghost" style={{ padding: '4px 0' }}>Browse</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{book.title}</span>
      </nav>

      {/* Primary Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', marginBottom: 64 }}>
        <BookGallery images={book.imageUrls || []} title={book.title} />
        <BookMeta book={book} onChat={() => book.sellerId && navigate(`/chat/${book.sellerId}`)} />
      </div>

      {/* Details Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, marginBottom: 64 }}>
        <section>
          <h3 style={{ fontSize: '1.3rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Info size={22} color="var(--accent)" /> Specifications
          </h3>
          <div className="glass card" style={{ display: 'grid', gap: 12 }}>
            {[
              ['Condition', CONDITION_LABELS[book.condition] || book.condition],
              ['Author', book.author],
              ['Location', book.location],
            ].map(([k, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                <span className="muted" style={{ fontSize: '0.9rem' }}>{k}</span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{v}</span>
              </div>
            ))}
          </div>
        </section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {book.description && (
            <section>
              <h3 style={{ fontSize: '1.3rem', marginBottom: 16 }}>Description</h3>
              <p className="muted" style={{ lineHeight: 1.7, fontSize: '0.95rem' }}>{book.description}</p>
            </section>
          )}

          {book.latitude != null && book.longitude != null && (
            <div className="glass card" style={{ padding: 16 }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem' }}>📍 Location</h4>
              <BookMap lat={book.latitude} lng={book.longitude} />
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section style={{ marginBottom: 64 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 10, margin: 0, fontSize: '1.3rem' }}>
            <MessageSquare size={22} color="var(--accent)" /> Seller Reviews
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {renderStars(Math.round(avgRating), 18)}
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{avgRating.toFixed(1)}</span>
              <span className="muted" style={{ fontSize: '0.85rem' }}>({reviews.length})</span>
            </div>
            <button className="btn" style={{ padding: '8px 20px', fontSize: '0.85rem' }} onClick={() => setShowReviewForm(!showReviewForm)}>
              Write Review
            </button>
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="glass card" style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Your Rating</label>
              <div className="star-picker">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setNewReview({ ...newReview, rating: n })}>
                    <Star size={28} fill={n <= newReview.rating ? '#FFB800' : 'none'} color={n <= newReview.rating ? '#FFB800' : 'var(--border)'} />
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Your Review</label>
              <textarea className="input" style={{ height: 100 }} placeholder="Share your experience..."
                value={newReview.text} onChange={(e) => setNewReview({ ...newReview, text: e.target.value })} required />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
              <button type="button" className="btn-outline" onClick={() => setShowReviewForm(false)}>Cancel</button>
            </div>
          </form>
        )}

        {/* Review List */}
        {reviews.length === 0 ? (
          <div className="glass card" style={{ textAlign: 'center', padding: 32, color: 'var(--muted)' }}>
            No reviews yet. Be the first to review this seller!
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {reviews.map(r => (
              <div key={r.id} className="review-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--panel-strong)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '0.85rem', border: '1px solid var(--border)' }}>
                    {r.reviewerName?.[0] || '?'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.reviewerName}</div>
                    {renderStars(r.rating, 14)}
                  </div>
                </div>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Similar Books */}
      {similarBooks.length > 0 && (
        <section>
          <h3 style={{ fontSize: '1.3rem', marginBottom: 24 }}>Similar Books</h3>
          <div className="grid grid-4">
            {similarBooks.map(b => <BookCard key={b.id} book={b} />)}
          </div>
        </section>
      )}

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .container > div:nth-child(2) { grid-template-columns: 1fr !important; gap: 24px !important; }
          .container > div:nth-child(3) { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </div>
  )
}