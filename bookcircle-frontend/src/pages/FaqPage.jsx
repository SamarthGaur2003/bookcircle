import React from 'react'

const faqs = [
  ['Is BookCircle an ordering app?', 'No. It is a P2P platform for direct buyer-seller contact.'],
  ['Can I sell both new and used books?', 'Yes. The listing supports different book conditions.'],
  ['Does the app support seller chat?', 'Yes, via WebSocket STOMP integration.'],
  ['Can I see the seller location?', 'Yes, through embedded Google Maps support.']
]

export default function FaqPage() {
  return (
    <div className="container">
      <div className="glass card">
        <h1 className="heading">FAQs</h1>
        <div className="form-grid">
          {faqs.map(([q, a]) => (
            <div key={q} className="glass-soft card">
              <strong>{q}</strong>
              <p className="small">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
