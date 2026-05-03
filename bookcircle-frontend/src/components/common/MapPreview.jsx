import React from 'react'

export default function MapPreview({ location }) {
  const src = `${import.meta.env.VITE_GOOGLE_MAPS_EMBED_BASE || 'https://www.google.com/maps?q='}${encodeURIComponent(location)}&output=embed`
  return (
    <iframe
      title="Seller location map"
      className="map-frame glass-soft"
      loading="lazy"
      src={src}
      referrerPolicy="no-referrer-when-downgrade"
    />
  )
}
