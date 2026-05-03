import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { bookService } from '../services/bookService'
import BookCard from '../components/common/BookCard'
import { Package, Search, BookOpen, DollarSign } from 'lucide-react'

export default function MyListingsPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        setBooks(await bookService.myListings())
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Unable to load listings')
      }
      setLoading(false)
    })()
  }, [])

  const filteredBooks = books.filter(b => 
    b.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalValue = books.reduce((acc, book) => acc + (book.price || 0), 0)

  return (
    <div className="container animate-slide-up" style={{ paddingBottom: 64, paddingTop: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="heading" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Package size={24} color="var(--accent)" /> My Listings
          </h1>
          <p className="muted">Manage your listed books</p>
        </div>
        <Link to="/sell" className="btn">+ Add New Book</Link>
      </div>

      {/* Stats Banner */}
      {!loading && books.length > 0 && (
        <div className="grid grid-2" style={{ marginBottom: 24 }}>
          <div className="glass card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: 'rgba(0,229,255,0.1)', padding: 12, borderRadius: 12, color: 'var(--accent)' }}>
              <BookOpen size={24} />
            </div>
            <div>
              <div className="muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>TOTAL LISTED</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{books.length} Books</div>
            </div>
          </div>
          <div className="glass card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: 'rgba(139,92,246,0.1)', padding: 12, borderRadius: 12, color: 'var(--accent2)' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <div className="muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>TOTAL VALUE</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>${totalValue.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {!loading && books.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--panel)', padding: '12px 20px', borderRadius: 999, border: '1px solid var(--border)', marginBottom: 32 }}>
          <Search size={18} color="var(--muted)" />
          <input
            placeholder="Search your listings by title or author..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', color: 'var(--text)', outline: 'none', width: '100%', fontSize: '0.95rem' }}
          />
        </div>
      )}

      {error && <div className="glass card" style={{ marginBottom: 24, color: 'var(--danger)' }}>{error}</div>}

      {loading ? (
        <div className="glass card" style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>
          Loading your listings...
        </div>
      ) : books.length > 0 ? (
        <>
          {filteredBooks.length > 0 ? (
            <div className="grid grid-3">{filteredBooks.map(book => <BookCard key={book.id} book={book} />)}</div>
          ) : (
            <div className="glass card" style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>
              No books matched your search "{searchQuery}".
            </div>
          )}
        </>
      ) : (
        <div className="glass card" style={{ textAlign: 'center', padding: 48 }}>
          <p className="muted">You haven't listed any books yet.</p>
          <Link to="/sell" className="btn" style={{ marginTop: 16 }}>List Your First Book</Link>
        </div>
      )}
    </div>
  )
}
