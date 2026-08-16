import React, { useEffect, useState } from 'react'
import { bookService } from '../services/bookService'
import BookCard from '../components/common/BookCard'
import FilterPanel from '../components/common/FilterPanel'
import Pagination from '../components/common/Pagination'
import { PAGE_SIZE } from '../utils/constants'
import { Search, MapPin } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

export default function BrowseBooksPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageMeta, setPageMeta] = useState({ totalPages: 1, totalElements: 0 })
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    keyword: initialQuery,
    location: '',
    condition: null,
    sort: 'id,desc',
    minPrice: '',
    maxPrice: ''
  })

  const [sortBy, direction] = filters.sort.split(',')

  // Sync URL
  useEffect(() => {
    if (filters.keyword) {
      setSearchParams({ q: filters.keyword }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }, [filters.keyword, setSearchParams])

  useEffect(() => {
    const q = searchParams.get('q') || ''
    setFilters(prev => ({ ...prev, keyword: q }))
  }, [searchParams])

  // Fetch books
  useEffect(() => {
    ; (async () => {
      setLoading(true)
      setError('')
      try {
        const data = await bookService.list({
          keyword: filters.keyword || undefined,
          location: filters.location || undefined,
          condition: filters.condition || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
          page: currentPage,
          size: PAGE_SIZE,
          sortBy,
          direction
        })
        setBooks(data.content)
        setPageMeta({ totalPages: data.totalPages || 1, totalElements: data.totalElements || 0 })
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Unable to load books')
      }
      setLoading(false)
    })()
  }, [filters, currentPage, sortBy, direction])

  useEffect(() => setCurrentPage(0), [filters])

  const findNearby = () => {
    if (!navigator.geolocation) {
      setError('Browser geolocation is not supported')
      return
    }
    setLoading(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await bookService.nearby({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            radius: 5
          })
          setBooks(data)
          setPageMeta({ totalPages: 1, totalElements: data.length })
          setCurrentPage(0)
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'Unable to find nearby books')
        }
        setLoading(false)
      },
      () => {
        setError('Location permission denied')
        setLoading(false)
      }
    )
  }

  return (
    <motion.div
      className="container animate-slide-up"
      style={{ paddingBottom: 80, paddingTop: 32 }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32 }}>
        <aside>
          <FilterPanel filters={filters} setFilters={setFilters} />
        </aside>

        <main>
          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, gap: 16, flexWrap: 'wrap' }}>

            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--panel)', padding: '10px 18px', borderRadius: 999, border: '1px solid var(--border)', flex: 1, maxWidth: 420 }}>
              <Search size={18} color="var(--accent)" />
              <input
                placeholder="Search title, author..."
                value={filters.keyword}
                onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                style={{ border: 'none', background: 'transparent', color: 'var(--text)', outline: 'none', width: '100%', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>
                {pageMeta.totalElements} books
              </span>

              <select className="select" style={{ width: 'auto', padding: '8px 14px', borderRadius: 10 }}
                value={filters.sort}
                onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              >
                <option value="id,desc">Newest</option>
                <option value="price,asc">Price: Low → High</option>
                <option value="price,desc">Price: High → Low</option>
              </select>

              {/* Near Me — special button */}
              <button className="btn-nearme" onClick={findNearby}>
                <MapPin size={18} /> Near Me
              </button>
            </div>
          </div>

          {error && <div className="glass card" style={{ marginBottom: 24, color: 'var(--danger)', padding: 16 }}>{error}</div>}

          {loading ? (
            <div className="glass card" style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>
              <div className="upload-spinner" style={{ margin: '0 auto 16px' }} />
              Loading books...
            </div>
          ) : (
            <>
              {books.length > 0 ? (
                <motion.div variants={itemVariants} className="grid grid-3">{books.map(book => <BookCard key={book.id} book={book} />)}</motion.div>
              ) : (
                <motion.div variants={itemVariants} className="glass card" style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>
                  No books found. Try adjusting your filters.
                </motion.div>
              )}
              {pageMeta.totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={pageMeta.totalPages} onPageChange={setCurrentPage} />
              )}
            </>
          )}
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .container > div:first-of-type { grid-template-columns: 1fr !important; }
          .container > div:first-of-type > aside > div { position: static !important; }
        }
      `}</style>
    </motion.div>
  )
}