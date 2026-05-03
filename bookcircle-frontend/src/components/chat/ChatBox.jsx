import React, { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { createStompClient } from '../../services/websocket'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function ChatBox({ seller, onMessageReceived, onChatOpened }) {
  const { user } = useAuth()
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const stompRef = useRef(null)
  const endRef = useRef(null)

  // Load chat history
  useEffect(() => {
    if (!user || !seller) return

    const loadMessages = async () => {
      try {
        const data = await api.get(`/chat/conversation?user1=${user.id}&user2=${seller.id}`)
        const list = Array.isArray(data) ? data : []
        setMessages(list.map(m => ({
          id: m.id,
          mine: m.sender?.id === user.id,
          text: m.content,
          timestamp: m.timestamp
        })))
        // Mark as read
        try { 
          await api.put(`/chat/read?senderId=${seller.id}`) 
          onChatOpened?.()
        } catch {}
      } catch (err) {
        console.error('Failed to load messages:', err)
      }
    }
    loadMessages()
  }, [user, seller])

  // WebSocket
  useEffect(() => {
    if (!user) return

    const stomp = createStompClient({
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
      onMessage: (msg) => {
        // Only add if it belongs to this conversation
        const senderId = String(msg.sender?.id)
        const receiverId = String(msg.receiver?.id)
        const currentUserId = String(user.id)
        const currentSellerId = String(seller.id)
        
        const isThisConvo = (senderId === currentSellerId && receiverId === currentUserId) ||
                            (senderId === currentUserId && receiverId === currentSellerId)
        
        // Pass up to update conversation list preview/unread count
        onMessageReceived?.(msg, isThisConvo)

        if (!isThisConvo) return

        setMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev
          return [...prev, {
            id: msg.id,
            mine: msg.sender?.id === user.id,
            text: msg.content,
            timestamp: msg.timestamp
          }]
        })
      }
    })

    stompRef.current = stomp
    stomp.connect()
    return () => stomp.disconnect()
  }, [user, seller])

  // Auto scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    if (!text.trim() || !stompRef.current || !user || !seller) return

    // Removed optimistic UI because server broadcasts message back to sender
    // which caused the double-message bug

    stompRef.current.sendMessage('/app/send', {
      senderId: user.id,
      receiverId: seller.id,
      content: text
    })
    setText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>

      {/* Header */}
      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)', background: 'var(--panel)' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'grid', placeItems: 'center', fontWeight: 800, color: '#000', fontSize: '0.9rem' }}>
          {seller?.name?.[0] || 'U'}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.3 }}>{seller?.name || 'User'}</div>
          <div style={{ fontSize: '0.7rem', color: connected ? 'var(--success)' : 'var(--muted)', lineHeight: 1.3 }}>
            {connected ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 0 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 32, fontSize: '0.85rem' }}>
            No messages yet. Say hello! 👋
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`chat-bubble ${msg.mine ? 'me' : 'other'}`}>
            {msg.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="chat-input-bar">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 300)}
          placeholder="Type a message..."
        />
        <button onClick={send} disabled={!text.trim()}>
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}