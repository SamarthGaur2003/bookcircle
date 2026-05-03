import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, Mail, Lock, BookOpenText } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const user = await login(form)
    setLoading(false)
    if (user) navigate(location.state?.from || '/')
  }

  return (
    <div style={{ minHeight: '80vh', display: 'grid', placeItems: 'center', padding: '40px 16px' }}>
      <div className="animate-slide-up" style={{ width: '100%', maxWidth: 440 }}>
        <div className="glass card" style={{ padding: 48 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: 'rgba(0,229,255,0.1)', display: 'grid', placeItems: 'center',
              margin: '0 auto 20px', color: 'var(--accent)'
            }}>
              <LogIn size={28} />
            </div>
            <h1 className="heading" style={{ fontSize: '2rem', marginBottom: 8 }}>Welcome Back</h1>
            <p className="muted" style={{ margin: 0 }}>Sign in to your BookCircle account</p>
          </div>

          <form onSubmit={submit} style={{ display: 'grid', gap: 20 }}>
            <div>
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Mail size={14} /> Email Address
              </label>
              <input className="input" type="email" placeholder="name@example.com"
                value={form.email} onChange={e => setForm(v => ({ ...v, email: e.target.value }))} required />
            </div>

            <div>
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lock size={14} /> Password
              </label>
              <input className="input" type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm(v => ({ ...v, password: e.target.value }))} required />
            </div>

            <button className="btn" type="submit" disabled={loading}
              style={{ width: '100%', padding: 16, fontSize: '1rem', fontWeight: 800, marginTop: 8, borderRadius: 14 }}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <p className="muted" style={{ fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 700 }}>Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}