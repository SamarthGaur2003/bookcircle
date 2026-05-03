import React from 'react'
import { MapPin, CalendarDays, MessageSquare, ShieldCheck } from 'lucide-react'
import { currency } from '../../utils/formatters'
import { CONDITION_LABELS } from '../../utils/constants'

export default function BookMeta({ book, onChat }) {
  return (
    <div className="glass card" style={{ padding: 28, position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, background: 'var(--accent)', filter: 'blur(90px)', opacity: 0.06, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Condition Badge */}
        <div style={{ marginBottom: 14 }}>
          <span style={{ display: 'inline-block', background: 'rgba(0,229,255,0.1)', border: '1px solid var(--accent)', padding: '4px 14px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
            {CONDITION_LABELS[book.condition] || book.condition}
          </span>
        </div>

        {/* Title & Author */}
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px', lineHeight: 1.2 }}>{book.title}</h1>
        <p className="muted" style={{ fontSize: '0.95rem', margin: '0 0 20px', fontWeight: 500, lineHeight: 1.5 }}>by {book.author}</p>

        {/* Price */}
        <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: '1rem', color: 'var(--accent)', fontWeight: 700 }}>₹</span>
          {book.price}
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24, padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,229,255,0.1)', display: 'grid', placeItems: 'center' }}>
              <MapPin size={15} color="var(--accent)" />
            </div>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Location</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.4 }}>{book.location || 'Local Area'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.04)', display: 'grid', placeItems: 'center' }}>
              <CalendarDays size={15} color="var(--muted)" />
            </div>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>Availability</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.4 }}>Immediate</div>
            </div>
          </div>
        </div>

        {/* Seller */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'grid', placeItems: 'center', color: '#000', fontWeight: 800, fontSize: '1.1rem' }}>
            {book.sellerName?.[0] || 'S'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 5, lineHeight: 1.4 }}>
              {book.sellerName || 'Seller'}
              <ShieldCheck size={14} color="var(--accent)" />
            </div>
            <div style={{ color: 'var(--muted)', fontSize: '0.75rem', lineHeight: 1.3 }}>Verified Seller</div>
          </div>
        </div>

        {/* CTA Button */}
        <button className="btn" onClick={onChat} style={{
          width: '100%', justifyContent: 'center', padding: '14px 24px',
          fontSize: '0.95rem', borderRadius: 12, gap: 8, fontWeight: 700
        }}>
          <MessageSquare size={18} /> Message Seller
        </button>
      </div>
    </div>
  )
}
