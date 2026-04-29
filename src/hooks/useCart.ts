import { useState, useEffect, useRef } from 'react'
import { useCoupon } from './useCoupon'

const API = import.meta.env.VITE_API_URL || 'https://backend.zylumia.com'

interface CartItem {
  name: string
  price: number
  quantity?: number
  qty?: number
  image?: string
  [key: string]: any
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const isAddingToCart = useRef(false)

  const {
    couponInput, setCouponInput,
    appliedCoupon, setAppliedCoupon,
    discountAmount, setDiscountAmount,
    couponMessage,
    handleApplyCoupon: applyCoupon
  } = useCoupon()

  // Sync cart from backend on mount

  // Lê cupom passado via ?coupon=XXX na URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const coupon = params.get('coupon')
    if (coupon) localStorage.setItem('zylumia_coupon', coupon)
  }, [])
  useEffect(() => {
    async function sincronizarCarrinho() {
      const sessionId = localStorage.getItem('zylumia_session_id')
      if (!sessionId) return
      try {
        const r = await fetch(`${API}/api/cart/${sessionId}`)
        const data = await r.json()
        if (!data.success || r.status === 404) {
          localStorage.removeItem('zylumia_session_id')
          setCartItems([])
          setCartCount(0)
          return
        }
        if (data.success && data.cart?.items?.length > 0) {
          setCartItems(data.cart.items)
          const total = data.cart.items.reduce((acc: number, item: CartItem) => acc + (item.qty || item.quantity || 1), 0)
          setCartCount(total)
        }
      } catch { /* ignore */ }
    }
    sincronizarCarrinho()
  }, [])

  // Load full cart details when opened
  useEffect(() => {
    if (!isCartOpen) return
    if (isAddingToCart.current) return

    async function carregarItensCarrinho() {
      const sessionId = localStorage.getItem('zylumia_session_id')
      if (!sessionId) return
      try {
        const r = await fetch(`${API}/api/cart/${sessionId}`)
        const data = await r.json()
        if (!data.success || r.status === 404) {
          localStorage.removeItem('zylumia_session_id')
          setCartItems([])
          setCartCount(0)
          return
        }
        if (data.success && data.cart?.items?.length > 0) {
          setCartItems(data.cart.items)
          setAppliedCoupon(data.cart.coupon)
          setDiscountAmount(data.cart.discount || 0)
        } else {
          setCartItems([])
        }
      } catch (e) {
        console.error('Erro ao carregar carrinho:', e)
      }
    }
    carregarItensCarrinho()
  }, [isCartOpen])

  // Countdown timer
  useEffect(() => {
    if (isCartOpen && timeLeft > 0) {
      const id = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
      return () => clearInterval(id)
    }
  }, [isCartOpen, timeLeft])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const addToCart = async (name: string, price: number, image: string) => {
    isAddingToCart.current = true

    const newItem = { id: Date.now(), name, type: 'Assinatura', price, quantity: 1, image }

    setCartItems(prev => {
      const existing = prev.find(i => i.name === name)
      if (existing) return prev.map(i => i.name === name ? { ...i, quantity: (i.quantity || i.qty || 1) + 1 } : i)
      return [...prev, { ...newItem, quantity: 1 }]
    })
    setCartCount(prev => prev + 1)
    setIsCartOpen(true)

    const sessionId = localStorage.getItem('zylumia_session_id') || (() => {
      const id = crypto.randomUUID()
      localStorage.setItem('zylumia_session_id', id)
      return id
    })()

    try {
      const updatedItems = cartItems.find(i => i.name === name)
        ? cartItems.map(i => i.name === name ? { ...i, quantity: (i.quantity || i.qty || 1) + 1 } : i)
        : [...cartItems, { ...newItem, quantity: 1 }]

      await fetch(`${API}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          items: updatedItems.map(item => ({
            name: item.name,
            price: item.price,
            qty: item.quantity || item.qty || 1,
            image: item.image
          }))
        })
      })
    } catch (e) {
      console.error('Erro ao salvar carrinho:', e)
    }

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'add_to_cart', {
        currency: 'USD',
        value: price,
        items: [{ item_name: name, price, quantity: 1 }]
      })
    }

    setTimeout(() => { isAddingToCart.current = false }, 2000)
  }

  const removeFromCart = async (itemName: string) => {
    const sessionId = localStorage.getItem('zylumia_session_id')
    if (!sessionId) return

    const newItems = cartItems.filter(i => i.name !== itemName)
    setCartItems(newItems)
    setCartCount(newItems.reduce((acc, i) => acc + (i.quantity || i.qty || 1), 0))

    try {
      await fetch(`${API}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          items: newItems.map(item => ({
            name: item.name,
            price: item.price,
            qty: item.quantity || item.qty || 1,
            image: item.image
          }))
        })
      })
    } catch (e) {
      console.error('Erro ao remover item:', e)
    }
  }

  const handleApplyCoupon = () => applyCoupon(cartItems)

  return {
    cartItems, setCartItems,
    cartCount, setCartCount,
    isCartOpen, setIsCartOpen,
    timeLeft,
    couponInput, setCouponInput,
    appliedCoupon,
    discountAmount,
    couponMessage,
    handleApplyCoupon,
    addToCart,
    removeFromCart,
    formatTime
  }
}
