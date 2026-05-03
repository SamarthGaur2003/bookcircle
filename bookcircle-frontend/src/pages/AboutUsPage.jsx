import React from 'react'

export default function AboutUsPage() {
  return (
    <div className="container">
      <div className="glass card">
        <h1 className="heading">About BookCircle</h1>
        <p className="subheading">
          BookCircle is a peer-to-peer platform where users buy and sell new or second-hand books directly.
          The goal is simple: connect readers and sellers with transparent listings, chat, and location visibility.
        </p>
        <div className="hr"></div>
        <div className="grid grid-3">
          <div className="glass-soft card"><strong>Direct Contact</strong><p className="small">Chat with sellers before buying.</p></div>
          <div className="glass-soft card"><strong>Trusted Info</strong><p className="small">Condition, price, author, and location all in one place.</p></div>
          <div className="glass-soft card"><strong>Community</strong><p className="small">A clean marketplace for book lovers.</p></div>
        </div>
      </div>
    </div>
  )
}
