import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div
      className="container"
      style={{
        minHeight: '80vh',
        display: 'grid',
        placeItems: 'center'
      }}
    >
      <div
        className="glass card"
        style={{
          textAlign: 'center',
          padding: '60px 30px',
          maxWidth: 500,
          width: '100%'
        }}
      >
        <h1 className="heading" style={{ fontSize: '3rem', marginBottom: 10 }}>
          404
        </h1>

        <p className="subheading" style={{ marginBottom: 30 }}>
          The page you are looking for does not exist.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link className="btn" to="/">
            Go Home
          </Link>

          <button
            className="btn btn-outline"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}