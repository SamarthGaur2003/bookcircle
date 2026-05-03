import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ConversationList from '../components/chat/ConversationList'
import ChatBox from '../components/chat/ChatBox'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { MessageSquare } from 'lucide-react'

export default function ChatPage() {
  const { sellerId } = useParams()
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [active, setActive] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get('/chat/conversations')
        const list = Array.isArray(data) ? data : []

        const mapped = list.map(c => ({
          id: c.userId,
          name: c.userName,
          preview: c.lastMessage,
          time: c.timestamp ? new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          unread: c.unreadCount,
          avatar: c.userName?.charAt(0).toUpperCase()
        }))

        setConversations(mapped)

        // If navigated from "Message Seller" button
        if (sellerId) {
          const sid = Number(sellerId)
          const found = mapped.find(c => c.id === sid)
          if (found) {
            setActive(found)
          } else {
            // New conversation — fetch seller name
            try {
              const contact = await api.get(`/user/contact?userId=${sid}`)
              setActive({
                id: sid,
                name: contact?.name || 'User',
                avatar: (contact?.name || 'U')[0].toUpperCase()
              })
            } catch {
              setActive({ id: sid, name: 'User', avatar: 'U' })
            }
          }
        } else {
          // Do not auto-select, allow empty state to show
        }
      } catch (e) {
        console.error('Failed to load conversations:', e)
      }
      setLoading(false)
    }
    load()
  }, [sellerId])

  const markAsRead = () => {
    if (!active) return
    setConversations(prev => prev.map(c => c.id === active.id ? { ...c, unread: 0 } : c))
  }

  const handleMessageReceived = (msg, isThisConvo) => {
    setConversations(prev => {
      const msgSenderId = String(msg.sender?.id);
      const currentUserId = String(user.id);
      
      const otherId = msgSenderId === currentUserId ? Number(msg.receiver?.id) : Number(msg.sender?.id);
      const existing = prev.find(c => String(c.id) === String(otherId));
      
      const newPreview = msg.content;
      const newTime = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (existing) {
        return prev.map(c => String(c.id) === String(otherId) ? { 
          ...c, 
          preview: newPreview, 
          time: newTime,
          unread: (isThisConvo || msgSenderId === currentUserId) ? c.unread : (c.unread || 0) + 1 
        } : c);
      } else {
        // New conversation just started
        const newConv = {
          id: otherId,
          name: msgSenderId === currentUserId ? msg.receiver?.name : msg.sender?.name,
          preview: newPreview,
          time: newTime,
          unread: (isThisConvo || msgSenderId === currentUserId) ? 0 : 1,
          avatar: (msgSenderId === currentUserId ? msg.receiver?.name : msg.sender?.name)?.charAt(0).toUpperCase() || 'U'
        };
        return [newConv, ...prev];
      }
    });
  }


  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: 400 }}>
        <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
          <div className="upload-spinner" style={{ margin: '0 auto 16px' }} />
          Loading conversations...
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        footer { display: none !important; }
        .app-main { padding: 64px 0 0 0 !important; max-width: 100% !important; }
        
        /* DESKTOP LAYOUT (Default) */
        .chat-layout { 
          display: flex; 
          width: 100%; 
          height: calc(100vh - 64px); 
          overflow: hidden; 
        }
        .chat-sidebar { 
          width: 320px; 
          border-right: 1px solid var(--border); 
          flex-shrink: 0; 
          background: var(--panel); 
          display: flex; 
          flex-direction: column; 
          height: 100%; 
        }
        .chat-main { 
          flex: 1; 
          display: flex; 
          flex-direction: column; 
          background: #050505; 
          height: 100%; 
          min-width: 0; 
          min-height: 0; 
        }

        /* MOBILE LAYOUT */
        @media (max-width: 768px) {
          body { overflow: hidden; } /* Lock body scroll only on mobile */
          
          .chat-layout { 
            position: fixed; 
            top: 64px; 
            left: 0; 
            width: 100%; 
            height: calc(100dvh - 64px); 
            flex-direction: column; 
            overscroll-behavior-y: none;
            z-index: 40;
          }
          
          .chat-sidebar { 
            width: 100%; 
            height: ${active ? '0' : '100%'}; 
            overflow: hidden; 
            border-right: none; 
          }
          
          .chat-main { 
            height: ${active ? '100%' : '0'}; 
            overflow: hidden; 
            touch-action: pan-y;
          }
        }
      `}</style>
      <div className="chat-layout">
        <div className="chat-sidebar">
        <ConversationList
          conversations={conversations}
          activeId={active?.id}
          onSelect={setActive}
        />
      </div>
      <div className="chat-main">
        {active ? (
          <ChatBox 
            seller={active} 
            key={active.id} 
            onChatOpened={markAsRead}
            onMessageReceived={handleMessageReceived}
            onBack={() => setActive(null)} 
          />
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#050505', color: 'var(--muted)' }}>
            <MessageSquare size={48} opacity={0.2} style={{ marginBottom: 16 }} />
            <h3 style={{ color: 'var(--text)', marginBottom: 8 }}>Your Messages</h3>
            <p style={{ maxWidth: 300, textAlign: 'center', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Select a conversation from the sidebar to view your chat history or reply to a buyer.
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  )
}