import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'https://backend.zylumia.com'

interface User {
  email: string
  name?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [msgCount, setMsgCount] = useState(0)

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('zylumia_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { /* ignore */ }
    }
  }, [])

  // Poll unread messages every 15s while logged in
  useEffect(() => {
    if (!user) return
    async function checkMessages() {
      const token = localStorage.getItem('zylumia_token')
      if (!token) return
      try {
        const r = await fetch(`${API}/api/messages/unread-count`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include'
        })
        const data = await r.json()
        if (data.success) setMsgCount(data.count || 0)
      } catch { /* ignore */ }
    }
    checkMessages()
    const interval = setInterval(checkMessages, 15000)
    return () => clearInterval(interval)
  }, [user])

  // Clear badge when on messages tab
  useEffect(() => {
    if (window.location.pathname === '/minha-conta' && window.location.search.includes('mensagens')) {
      setMsgCount(0)
    }
  }, [])

  function logout() {
    localStorage.removeItem('zylumia_user')
    localStorage.removeItem('zylumia_token')
    setUser(null)
  }

  return {
    user, setUser,
    isAuthOpen, setIsAuthOpen,
    msgCount,
    logout
  }
}
