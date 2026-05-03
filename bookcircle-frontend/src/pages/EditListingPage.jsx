import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { bookService } from '../services/bookService'

export default function EditListingPage() {
  const { id } = useParams()
  const [book, setBook] = useState(null)

  useEffect(() => {
    ;(async () => setBook(await bookService.getById(id)))()
  }, [id])

  if (!book) return <div className="container"><div className="glass card">Loading...</div></div>

  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <div className="glass card">
        <h1 className="heading">Edit Listing</h1>
        <p className="subheading">Backend-ready edit form placeholder for listing updates.</p>
        <pre className="glass-soft card" style={{ overflow: 'auto' }}>{JSON.stringify(book, null, 2)}</pre>
      </div>
    </div>
  )
}
