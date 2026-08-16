import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { bookService } from '../services/bookService'
import { Package, Search, BookOpen, IndianRupee, Trash2, Pencil } from 'lucide-react'
import { currency } from '../utils/formatters'
import { CONDITION_LABELS } from '../utils/constants'
import { useToast } from '../context/ToastContext'
import { motion, AnimatePresence } from 'framer-motion'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.25 } }
}

export default function MyListingsPage() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const { pushToast } = useToast()

  const loadBooks = async () => {
    try {
      setBooks(await bookService.myListings())
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to load listings')
    }
    setLoading(false)
  }

  useEffect(() => { loadBooks() }, [])

  const filteredBooks = books.filter(b =>
    b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalValue = books.reduce((acc, book) => acc + (book.price || 0), 0)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await bookService.delete(deleteTarget)
      setBooks(prev => prev.filter(b => b.id !== deleteTarget))
      pushToast('success', 'Book deleted successfully')
    } catch (err) {
      pushToast('error', typeof err === 'string' ? err : 'Failed to delete book')
    }
    setDeleting(false)
    setDeleteTarget(null)
  }

  return (
    <motion.div
      className="container"
      style={{ paddingBottom: 64, paddingTop: 32 }}
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={cardVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="heading" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Package size={24} color="var(--accent)" /> My Listings
          </h1>
          <p className="muted">Manage your listed books</p>
        </div>
        <Link to="/sell" className="btn">+ Add New Book</Link>
      </motion.div>

      {/* Stats Banner */}
      {!loading && books.length > 0 && (
        <motion.div variants={cardVariants} className="grid grid-2" style={{ marginBottom: 24 }}>
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
              <IndianRupee size={24} />
            </div>
            <div>
              <div className="muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>TOTAL VALUE</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{currency(totalValue)}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search Bar */}
      {!loading && books.length > 0 && (
        <motion.div variants={cardVariants} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--panel)', padding: '12px 20px', borderRadius: 999, border: '1px solid var(--border)', marginBottom: 32 }}>
          <Search size={18} color="var(--muted)" />
          <input
            placeholder="Search your listings by title or author..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', color: 'var(--text)', outline: 'none', width: '100%', fontSize: '0.95rem' }}
          />
        </motion.div>
      )}

      {error && <div className="glass card" style={{ marginBottom: 24, color: 'var(--danger)' }}>{error}</div>}

      {loading ? (
        <div className="glass card" style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>
          Loading your listings...
        </div>
      ) : books.length > 0 ? (
        <>
          {filteredBooks.length > 0 ? (
            <div className="grid grid-4">
              <AnimatePresence>
                {filteredBooks.map(book => (
                  <motion.article
                    key={book.id}
                    className="book-card small"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    style={{ position: 'relative' }}
                  >
                    {/* Action buttons at top-right */}
                    <div style={{
                      position: 'absolute', top: 10, right: 10, zIndex: 5,
                      display: 'flex', gap: 6
                    }}>
                      <Link
                        to={`/edit-listing/${book.id}`}
                        style={{
                          width: 34, height: 34, borderRadius: 8,
                          background: 'rgba(0,229,255,0.15)', backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(0,229,255,0.3)',
                          display: 'grid', placeItems: 'center',
                          color: 'var(--accent)', cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        title="Edit listing"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={(e) => { e.preventDefault(); setDeleteTarget(book.id) }}
                        style={{
                          width: 34, height: 34, borderRadius: 8,
                          background: 'rgba(239,68,68,0.15)', backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(239,68,68,0.3)',
                          display: 'grid', placeItems: 'center',
                          color: '#EF4444', cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        title="Delete listing"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <Link to={`/books/${book.id}`} className="card-img-wrapper" style={{ '--bg-img': book.imageUrls?.[0] ? `url(${book.imageUrls[0]})` : 'none' }}>
                      {book.imageUrls?.[0] && <img src={book.imageUrls[0]} alt={book.title} loading="lazy" />}
                      <div className="card-tag">{CONDITION_LABELS[book.condition] || book.condition}</div>
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
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
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

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 10000,
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
              display: 'grid', placeItems: 'center'
            }}
            onClick={() => !deleting && setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
              className="glass card"
              style={{ maxWidth: 420, width: '90%', padding: 32, textAlign: 'center' }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                display: 'grid', placeItems: 'center', margin: '0 auto 20px'
              }}>
                <Trash2 size={24} color="#EF4444" />
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem' }}>Delete Listing?</h3>
              <p className="muted" style={{ margin: '0 0 28px', fontSize: '0.9rem', lineHeight: 1.6 }}>
                This action is permanent. The book will be removed from your listings and the database.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                  className="btn-outline"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  style={{ padding: '10px 24px' }}
                >
                  Cancel
                </button>
                <button
                  className="btn-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    padding: '10px 24px', borderRadius: 999, cursor: 'pointer',
                    fontWeight: 700, fontSize: '0.9rem',
                    display: 'inline-flex', alignItems: 'center', gap: 8
                  }}
                >
                  <Trash2 size={15} />
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
