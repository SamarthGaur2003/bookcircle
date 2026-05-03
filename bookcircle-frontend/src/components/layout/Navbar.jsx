import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { BookOpenText, User, Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const location = useLocation()

  const close = () => setMobileOpen(false)

  // Fetch unread count on mount/auth
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/chat/conversations')
        .then(data => {
          const list = Array.isArray(data) ? data : []
          const count = list.reduce((sum, c) => sum + (c.unreadCount || 0), 0)
          setUnreadCount(count)
        })
        .catch(() => {})
    } else {
      setUnreadCount(0)
    }
  }, [isAuthenticated])

  // Auto clear badge when visiting inbox
  useEffect(() => {
    if (location.pathname.startsWith('/inbox') || location.pathname.startsWith('/chat')) {
      setUnreadCount(0)
    }
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    close()
  }

  const navLinks = (
    <>
      <NavLink to="/" className="nav-link" end onClick={close}>Explore</NavLink>
      <NavLink to="/browse" className="nav-link" onClick={close}>Search</NavLink>
      <NavLink to="/sell" className="nav-link" onClick={close}>List Book</NavLink>
      {isAuthenticated && (
        <NavLink to="/inbox" className="nav-link" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          Inbox
          {unreadCount > 0 && (
            <span style={{
              background: 'var(--accent)', color: '#000', fontSize: '0.65rem',
              fontWeight: 800, padding: '2px 6px', borderRadius: 999,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              minWidth: 18, height: 18
            }}>
              {unreadCount}
            </span>
          )}
        </NavLink>
      )}
    </>
  )

  return (
    <header className="nav">
      <div className="nav-inner">

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="mobile-nav-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="brand">
            <BookOpenText size={20} color="var(--accent)" />
            <span>BookCircle</span>
          </Link>
        </div>

        <nav className="nav-center">{navLinks}</nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="btn-ghost"><User size={20} /></Link>
              <button className="btn-ghost" onClick={handleLogout}><LogOut size={20} /></button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/register" className="btn">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {navLinks}
        {!isAuthenticated ? (
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <Link to="/login" className="btn-outline" onClick={close}>Login</Link>
            <Link to="/register" className="btn" onClick={close}>Sign Up</Link>
          </div>
        ) : (
          <button className="btn-ghost" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
            <LogOut size={16} /> Logout
          </button>
        )}
      </div>
    </header>
  )
}