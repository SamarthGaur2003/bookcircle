import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, TrendingUp, BookPlus } from 'lucide-react'
import { bookService } from '../services/bookService'
import BookCard from '../components/common/BookCard'
import BookWelcomeAnimation from '../components/common/BookWelcomeAnimation'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
}

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const [showWelcome, setShowWelcome] = useState(false)
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState([])
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/browse?q=${encodeURIComponent(query.trim())}`)
  }

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await bookService.list({ page: 0, size: 8 })
        setBooks(res.content)
      } catch (err) {
        console.error(err)
      }
    }
    loadBooks()
  }, [])

  useEffect(() => {
    if (isAuthenticated && !sessionStorage.getItem('has_seen_welcome')) {
      setShowWelcome(true)
      sessionStorage.setItem('has_seen_welcome', 'true')
    }
  }, [isAuthenticated])

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {showWelcome && <BookWelcomeAnimation onComplete={() => setShowWelcome(false)} />}

      {/* Hero */}
      <motion.section variants={itemVariants} className="hero-sec" style={{ padding: '80px 24px 60px' }}>
        <div style={{ maxWidth: 700, width: '100%', margin: '0 auto', textAlign: 'center' }}>
          <h1 className="hero-title">Buy & Sell Books Locally</h1>
          <p className="hero-sub">
            The fastest way to discover and trade books with readers in your neighborhood.
          </p>
          <form className="hero-search" onSubmit={handleSearch}>
            <Search size={20} color="var(--muted)" style={{ marginLeft: 12, flexShrink: 0 }} />
            <input
              placeholder="Search by title, author..."
              aria-label="Search books"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit" className="btn">Search</button>
          </form>
        </div>
      </motion.section>

      {/* Trending / Recent Books */}
      <motion.div variants={itemVariants} className="container" style={{ padding: '40px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10, margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
            <TrendingUp size={22} color="var(--accent)" /> Recently Listed
          </h2>
          <Link to="/browse" style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600 }}>View All →</Link>
        </div>

        {books.length > 0 ? (
          <div className="grid grid-4">{books.map(book => <BookCard key={book.id} book={book} />)}</div>
        ) : (
          <div className="glass card" style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>
            No books listed yet. Be the first!
          </div>
        )}
      </motion.div>

      {/* CTA */}
      <motion.div variants={itemVariants} className="container" style={{ padding: '48px 24px 64px' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--panel-strong), #000)',
          border: '1px solid var(--border)', borderRadius: 20, padding: '36px 32px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 24, flexWrap: 'wrap'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 6px', lineHeight: 1.3 }}>Got books collecting dust?</h2>
            <p className="muted" style={{ fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>Turn your finished reads into cash on BookCircle.</p>
          </div>
          <Link to="/sell" className="btn" style={{ padding: '14px 28px', fontSize: '0.95rem', gap: 10, flexShrink: 0 }}>
            <BookPlus size={18} /> Start Selling
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}
