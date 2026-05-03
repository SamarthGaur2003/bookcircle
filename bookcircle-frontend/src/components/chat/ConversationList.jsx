import React from 'react'
import { Search, Edit3 } from 'lucide-react'

export default function ConversationList({ conversations = [], activeId, onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--panel)', borderRight: '1px solid var(--border)' }}>
      
      {/* Premium Sidebar Header */}
      <div style={{ padding: '24px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>Inbox</h2>
        <button className="btn-ghost" style={{ padding: 8, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}>
          <Edit3 size={16} />
        </button>
      </div>
      
      {/* Search Bar */}
      <div style={{ padding: '0 24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#0A0A0A', border: '1px solid var(--border)', borderRadius: 999, padding: '8px 16px', transition: 'border-color 0.2s' }}>
          <Search size={16} color="var(--muted)" />
          <input
            placeholder="Search conversations..."
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--text)',
              outline: 'none',
              width: '100%',
              marginLeft: 12,
              fontSize: '0.85rem'
            }}
          />
        </div>
      </div>

      {/* Chat List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
        {conversations.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--muted)' }}>
            No conversations yet
          </div>
        ) : (
          conversations.map(conv => {
            const isActive = activeId === conv.id

            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '12px',
                  marginBottom: 4,
                  background: isActive ? 'rgba(0,229,255,0.05)' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  boxShadow: isActive ? 'inset 2px 0 0 var(--accent)' : 'inset 2px 0 0 transparent'
                }}
                onMouseOver={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                }}
                onMouseOut={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent'
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: isActive ? 'var(--accent)' : 'var(--panel-strong)',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 'bold',
                    color: isActive ? '#000' : 'var(--text)',
                    flexShrink: 0,
                    border: isActive ? 'none' : '1px solid var(--border)'
                  }}
                >
                  {conv.avatar || (conv.name ? conv.name.charAt(0).toUpperCase() : '?')}
                </div>

                {/* Text Content */}
                <div
                  style={{
                    flex: 1,
                    marginLeft: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginBottom: 4
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: isActive ? 'var(--text)' : 'var(--muted)',
                        fontSize: '0.95rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {conv.name || 'Unknown'}
                    </span>

                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: conv.unread ? 'var(--accent)' : 'var(--muted)',
                        fontWeight: conv.unread ? 600 : 400
                      }}
                    >
                      {conv.time || ''}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span
                      style={{
                        color: 'var(--muted)',
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        paddingRight: 8
                      }}
                    >
                      {conv.preview || 'No messages yet'}
                    </span>

                    {conv.unread > 0 && (
                      <span
                        style={{
                          background: 'var(--accent)',
                          color: '#000',
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          width: 18,
                          height: 18,
                          display: 'grid',
                          placeItems: 'center',
                          borderRadius: 999
                        }}
                      >
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}