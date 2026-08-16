import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpenText } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 0 24px', marginTop: 'auto' }}>
      <div className="container" style={{ padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, marginBottom: 32 }}>

          {/* Brand */}
          <div>
            <Link to="/" className="brand" style={{ marginBottom: 12, display: 'inline-flex' }}>
              <BookOpenText size={18} color="var(--accent)" /> BookCircle
            </Link>
            <p className="muted" style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
              A peer-to-peer marketplace for buying and selling books locally.
            </p>
          </div>

          {/* Browse */}
          <div>
            <h4 style={{ fontSize: '0.85rem', marginBottom: 12, fontWeight: 700 }}>Browse</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/browse" className="muted" style={{ fontSize: '0.85rem' }}>Search Books</Link>
              <Link to="/sell" className="muted" style={{ fontSize: '0.85rem' }}>List a Book</Link>
              <Link to="/browse?sort=id,desc" className="muted" style={{ fontSize: '0.85rem' }}>Latest Listings</Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h4 style={{ fontSize: '0.85rem', marginBottom: 12, fontWeight: 700 }}>Account</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/profile" className="muted" style={{ fontSize: '0.85rem' }}>My Profile</Link>
              <Link to="/my-listings" className="muted" style={{ fontSize: '0.85rem' }}>My Listings</Link>
              <Link to="/inbox" className="muted" style={{ fontSize: '0.85rem' }}>Messages</Link>
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 style={{ fontSize: '0.85rem', marginBottom: 12, fontWeight: 700 }}>Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/about" className="muted" style={{ fontSize: '0.85rem' }}>About Us</Link>
              <Link to="/faq" className="muted" style={{ fontSize: '0.85rem' }}>FAQ</Link>
              <span className="muted" style={{ fontSize: '0.85rem' }}>support@bookcircle.com</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, textAlign: 'center' }}>
          <span className="muted" style={{ fontSize: '0.8rem' }}>© {new Date().getFullYear()} BookCircle. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}