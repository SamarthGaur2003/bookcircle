import React from 'react'

const faqs = [
  ['What is BookCircle?', 'BookCircle is a peer-to-peer marketplace where users can buy and sell books locally with secure chat and map-based pickup details.'],
  ['How do I list a book for sale?', 'Login, go to the Sell page, complete the listing form with book details, price, condition, and submit.'],
  ['How can I contact a seller?', 'Use the Inbox or Chat page to send real-time messages once you view a listing or start a conversation.'],
  ['Do I need an account to buy or sell?', 'Yes. Register and login to create listings, view seller details, and use secure chat.'],
  ['Can I sell used or new books?', 'Yes. The platform supports both new and used books, and you control the price and condition.'],
  ['Is my contact information safe?', 'Yes. BookCircle uses in-app chat so personal details remain private until you choose to share them.']
]

export default function FaqPage() {
  return (
    <div className="container">
      <div className="glass card">
        <h1 className="heading">Frequently Asked Questions</h1>
        <p className="muted" style={{ marginBottom: 20 }}>
          Find answers to common questions about using BookCircle, listing books, and chatting with sellers.
        </p>
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
