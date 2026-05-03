import React, { useState, useEffect } from 'react'

export default function BookGallery({ images = [], title }) {
  const [active, setActive] = useState(0)

  useEffect(() => { setActive(0) }, [images])

  const safeImages = images.length
    ? images
    : ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Main Image */}
      <div style={{
        width: '100%', aspectRatio: '1/1',
        background: '#0a0a0a', borderRadius: 20,
        overflow: 'hidden', border: '1px solid var(--border)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
        position: 'relative'
      }}>
        {/* Blurred backdrop */}
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%', right: '-10%', bottom: '-10%',
          backgroundImage: `url(${safeImages[active]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(30px)',
          opacity: 0.4,
        }} />
        {/* Actual Image */}
        <img src={safeImages[active]} alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 1, padding: 16 }} />
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div style={{ display: 'flex', gap: 10 }}>
          {safeImages.map((img, idx) => (
            <button key={idx} onClick={() => setActive(idx)} style={{
              width: 60, height: 60, padding: 0,
              border: active === idx ? '2px solid var(--accent)' : '2px solid transparent',
              borderRadius: 10, background: 'var(--panel-strong)',
              overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
              transition: 'all 0.2s ease', opacity: active === idx ? 1 : 0.6
            }}>
              <img src={img} alt={`thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}