import { useState, useEffect, useRef } from 'react'
import { useCoupon } from './useCoupon'

import { API } from '../config/api'
import { handleError, toastSucesso } from '../services/errorService';

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
      const cart = await loadCartFromBackend(sessionId)
      if (!cart) {
        // Não remove sessionId — backend pode estar lento ou carrinho recém-criado
        // Tenta carregar do cache local como fallback
        const cached = loadCartFromCache()
        if (cached?.items?.length) {
          setCartItems(cached.items)
          setCartCount(cached.items.reduce((acc: number, i: any) => acc + (i.qty || 1), 0))
        }
        return
      }
      setCartItems(cart.items)
      setCartCount(cart.items.reduce((acc: number, i: any) => acc + i.qty, 0))
    }
    sincronizarCarrinho()
  }, [])

  // Load full cart details when opened
  useEffect(() => {
    if (!isCartOpen) return
    if (isAddingToCart.current) return

    async function carregarItensCarrinho() {
      const sessionId = localStorage.getItem('zylumia_session_id')
      if (!sessionId) {
        // Sem sessionId — tenta cache local
        const cached = loadCartFromCache()
        if (cached?.items?.length) {
          setCartItems(cached.items)
          setCartCount(cached.items.reduce((acc, i) => acc + (i.qty || 1), 0))
        }
        return
      }
      const cart = await loadCartFromBackend(sessionId)
      if (!cart) {
        // Backend vazio — mantém o que já está na tela (não limpa)
        return
      }
      setCartItems(cart.items)
      setAppliedCoupon(cart.coupon)
      setDiscountAmount(cart.discount || 0)
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

    const updatedItems = cartItems.find(i => i.name === name)
      ? cartItems.map(i => i.name === name ? { ...i, qty: (i.qty || i.quantity || 1) + 1 } : i)
      : [...cartItems, { ...newItem, qty: 1 }]

    setCartItems(updatedItems)
    setCartCount(updatedItems.reduce((acc, i) => acc + (i.qty || i.quantity || 1), 0))
    setIsCartOpen(true)
    saveCartToCache(updatedItems)

    const sessionId = getOrCreateSessionId()
    await saveCartToBackend(updatedItems, sessionId).catch(e => handleError(e, 'carrinho', { silencioso: true }))

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

    saveCartToCache(newItems)
    await saveCartToBackend(newItems, sessionId).catch(e => handleError(e, 'carrinho', { silencioso: true }))
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
