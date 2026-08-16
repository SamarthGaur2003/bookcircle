import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

let wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8080/chat'
if (wsUrl.includes('localhost') && window.location.hostname !== 'localhost') {
  wsUrl = wsUrl.replace('localhost', window.location.hostname)
}

export const createStompClient = ({ onConnect, onDisconnect, onMessage }) => {

  const token = localStorage.getItem('bookcircle_token')

  const client = new Client({
    webSocketFactory: () => new SockJS(wsUrl),

    connectHeaders: {
      Authorization: `Bearer ${token}`
    },

    reconnectDelay: 3000,
    debug: () => {}
  })

  client.onConnect = () => {
    onConnect?.()

    // Subscribe to user-specific message queue
    client.subscribe('/user/queue/messages', (frame) => {
      try {
        const data = JSON.parse(frame.body)
        onMessage?.(data)
      } catch {
        onMessage?.(frame.body)
      }
    })
  }

  client.onDisconnect = () => {
    onDisconnect?.()
  }

  client.onStompError = () => {
    onDisconnect?.()
  }

  return {
    client,

    connect: () => client.activate(),

    disconnect: () => client.deactivate(),

    sendMessage: (destination, body) => {
      client.publish({
        destination,
        body: JSON.stringify(body)
      })
    }
  }
}