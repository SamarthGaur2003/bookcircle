import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { initials } from '../utils/formatters'
import { LogOut, Package, User, Save, ShieldCheck } from 'lucide-react'
import api from '../api/axios'
import { useToast } from '../context/ToastContext'

export default function ProfilePage() {
  const { user, logout, setUser } = useAuth()
  const navigate = useNavigate()
  const { pushToast } = useToast()

  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: ''
      })
    }
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        name: profile.name,
        phone: profile.phone,
        password: profile.password || null
      }

      const updated = await api.put('/user/update', payload)

      // Update local user state + localStorage
      const newUser = { ...user, name: updated.name, email: updated.email }
      setUser(newUser)
      localStorage.setItem('bookcircle_user', JSON.stringify(newUser))

      pushToast('success', 'Profile updated successfully')
      setIsEditing(false)
      setProfile(prev => ({ ...prev, password: '' }))
    } catch (err) {
      pushToast('error', typeof err === 'string' ? err : 'Failed to update profile')
    }
    setSaving(false)
  }

  return (
    <div className="container animate-slide-up" style={{ paddingBottom: 80, paddingTop: 40 }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="heading">My Profile</h1>
          <p className="muted">Manage your account settings</p>
        </div>
        <button onClick={handleLogout} className="btn-outline" style={{ color: '#ff4b2b', borderColor: 'rgba(239,68,68,0.3)' }}>
          <LogOut size={16} /> Log Out
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 32 }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="glass card" style={{ padding: 32, textAlign: 'center' }}>
            <div style={{
              width: 88, height: 88, borderRadius: '50%', margin: '0 auto 16px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              display: 'grid', placeItems: 'center', fontSize: '1.8rem', fontWeight: 900, color: '#000'
            }}>
              {initials(user?.name || 'U')}
            </div>
            <h2 style={{ margin: '0 0 4px', fontSize: '1.3rem' }}>{user?.name || 'User'}</h2>
            <p className="muted" style={{ fontSize: '0.9rem' }}>{user?.email}</p>

            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/my-listings" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)' }}>
                <Package size={16} /> My Listings
              </Link>
              <Link to="/inbox" className="btn-ghost" style={{ justifyContent: 'flex-start', padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)' }}>
                <User size={16} /> Inbox
              </Link>
            </div>
          </div>

          <div className="glass card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <ShieldCheck size={18} color="var(--accent)" />
            <p className="muted" style={{ fontSize: '0.8rem', margin: 0 }}>Your data is encrypted and secure.</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="glass card" style={{ padding: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Account Settings</h3>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleUpdate}>
            <div style={{ display: 'grid', gap: 20 }}>
              <div>
                <label className="label">Full Name</label>
                <input className="input" value={profile.name} disabled={!isEditing}
                  onChange={e => setProfile({ ...profile, name: e.target.value })} />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" value={profile.email} disabled style={{ opacity: 0.5 }} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" value={profile.phone} disabled={!isEditing}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })} />
              </div>
              {isEditing && (
                <div>
                  <label className="label">New Password (optional)</label>
                  <input className="input" type="password" placeholder="Leave blank to keep current"
                    value={profile.password}
                    onChange={e => setProfile({ ...profile, password: e.target.value })} />
                </div>
              )}
            </div>

            {isEditing && (
              <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                <button type="submit" className="btn" disabled={saving}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn-outline" onClick={() => { setIsEditing(false); setProfile(prev => ({ ...prev, password: '' })) }}>
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Responsive override */}
      <style>{`
        @media (max-width: 768px) {
          .container > div:last-of-type { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}