import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const pushToast = useCallback((type, message) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + Math.random().toString();

    setToasts(prev => [...prev, { id, type, message }])

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 2800)
  }, [])

  const value = useMemo(() => ({ toasts, pushToast }), [toasts, pushToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

export function ToastViewport() {
  const { toasts } = useToast()

  const getTitle = (type) => {
    switch (type) {
      case 'success': return 'Success'
      case 'error': return 'Error'
      case 'warning': return 'Warning'
      default: return 'Info'
    }
  }

  return (
    <div className="toast-viewport">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <strong style={{ display: 'block', marginBottom: 4 }}>
            {getTitle(toast.type)}
          </strong>
          <span className="small" style={{ color: '#fff' }}>
            {toast.message}
          </span>
        </div>
      ))}
    </div>
  )
}