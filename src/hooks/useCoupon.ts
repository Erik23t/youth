import { useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'https://backend.zylumia.com'

interface CartItem {
  name: string
  price: number
  quantity?: number
  qty?: number
  image?: string
}

export function useCoupon() {
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [couponMessage, setCouponMessage] = useState('')

  const handleApplyCoupon = async (cartItems: CartItem[]) => {
    if (!couponInput) return
    try {
      const sessionId = localStorage.getItem('zylumia_session_id') || crypto.randomUUID()
      localStorage.setItem('zylumia_session_id', sessionId)

      const r = await fetch(`${API}/api/cart/${sessionId}/coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.toUpperCase() })
      })
      const data = await r.json()

      if (data.success) {
        setAppliedCoupon(data.coupon.code)
        localStorage.setItem('zylumia_coupon', data.coupon.code)
        setCouponMessage(`✅ ${data.coupon.code} — ${data.coupon.discountPercent}% OFF aplicado!`)
        const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || item.qty || 1)), 0)
        const discount = data.discount || parseFloat((subtotal * ((data.coupon.discountPercent || 0) / 100)).toFixed(2)) || 0
        setDiscountAmount(discount)
      } else {
        setCouponMessage(data.message || '❌ Cupom inválido.')
        setAppliedCoupon(null)
        setDiscountAmount(0)
        localStorage.removeItem('zylumia_coupon')
      }
    } catch {
      setCouponMessage('Erro ao aplicar cupom.')
    }
  }

  return {
    couponInput, setCouponInput,
    appliedCoupon, setAppliedCoupon,
    discountAmount, setDiscountAmount,
    couponMessage,
    handleApplyCoupon
  }
}
