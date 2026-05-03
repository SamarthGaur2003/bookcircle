import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { currency } from '../../utils/formatters'
import { CONDITION_LABELS } from '../../utils/constants'

export default function BookCard({ book }) {
  const cover = book.imageUrls?.[0]

  return (
    <article className="book-card">
      <Link to={`/books/${book.id}`} className="card-img-wrapper" style={{ '--bg-img': cover ? `url(${cover})` : 'none' }}>
        {cover && <img src={cover} alt={book.title} loading="lazy" />}
        <div className="card-tag">{CONDITION_LABELS[book.condition] || book.condition}</div>
        <div className="card-distance"><MapPin size={12} /> {book.location || 'Unknown'}</div>
      </Link>
      <div className="card-content">
        <h3 className="card-title">{book.title}</h3>
        <p className="card-author">{book.author}</p>
        <div className="card-footer">
          <div className="card-seller">
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--border)', display: 'grid', placeItems: 'center', fontSize: 10, color: 'var(--text)', fontWeight: 700 }}>
              {book.sellerName?.[0] || '?'}
            </div>
            <span>{book.sellerName || 'Seller'}</span>
          </div>
          <div className="card-price">{currency(book.price)}</div>
        </div>
      </div>
    </article>
  )
}
