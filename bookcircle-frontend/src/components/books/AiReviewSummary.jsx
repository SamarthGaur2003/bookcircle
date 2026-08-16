import React, { useEffect, useState } from 'react'
import { reviewService } from '../../services/reviewService'
import { Star, Sparkles } from 'lucide-react'

/**
 * AI Review Summary Card — displays AI-generated summary of seller reviews.
 * Self-contained: fetches data on mount, shows shimmer while loading.
 */
export default function AiReviewSummary({ sellerId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sellerId) return

    const fetchSummary = async () => {
      try {
        const result = await reviewService.getSellerSummary(sellerId)
        setData(result)
      } catch (err) {
        console.error('Failed to load AI review summary:', err)
      }
      setLoading(false)
    }

    fetchSummary()
  }, [sellerId])

  // Shimmer skeleton while loading
  if (loading) {
    return (
      <div className="ai-summary-card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="shimmer" style={{ width: 120, height: 24 }} />
          <div className="shimmer" style={{ width: '100%', height: 16 }} />
          <div className="shimmer" style={{ width: '80%', height: 16 }} />
          <div className="shimmer" style={{ width: '60%', height: 16 }} />
        </div>
      </div>
    )
  }

  // No data or no summary available
  if (!data || (!data.summary && data.reviewCount === 0)) {
    return (
      <div className="ai-summary-card" style={{ marginBottom: 24, textAlign: 'center', padding: 24 }}>
        <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
          No review summary available yet.
        </p>
      </div>
    )
  }

  const renderStars = (rating) => (
    <div className="review-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={16}
          fill={i <= Math.round(rating) ? '#FFB800' : 'none'}
          color={i <= Math.round(rating) ? '#FFB800' : 'var(--border)'}
        />
      ))}
    </div>
  )

  return (
    <div className="ai-summary-card" style={{ marginBottom: 24 }}>

      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <span className="ai-badge">
          <Sparkles size={12} /> AI Summary
        </span>
        <div className="ai-summary-stats">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {renderStars(data.averageRating)}
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{data.averageRating.toFixed(1)}</span>
          </div>
          <span className="muted" style={{ fontSize: '0.85rem' }}>
            {data.reviewCount} {data.reviewCount === 1 ? 'Review' : 'Reviews'}
          </span>
        </div>
      </div>

      {/* Summary Text */}
      {data.summary ? (
        <p className="ai-summary-text">"{data.summary}"</p>
      ) : (
        <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
          Summary could not be generated at this time.
        </p>
      )}
    </div>
  )
}
