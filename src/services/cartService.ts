// ✅ FONTE ÚNICA da lógica de carrinho
import { API } from '../config/api'

export interface CartItem {
  name: string
  price: number
  qty: number
  quantity?: number
  image?: string
  [key: string]: any
}

export function normalizeItems(items: any[]): CartItem[] {
  return (items || []).map(item => ({
    name: item.name,
    price: item.price,
    qty: item.qty || item.quantity || 1,
    image: item.image || '',
  }))
}

export function getOrCreateSessionId(): string {
  let id = localStorage.getItem('zylumia_session_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('zylumia_session_id', id)
  }
  return id
}

export function saveCartToCache(items: any[]): void {
  const normalized = normalizeItems(items)
  const subtotal = normalized.reduce((acc, i) => acc + (i.price * i.qty), 0)
  localStorage.setItem('zylumia_cart_cache', JSON.stringify({ items: normalized, subtotal, total: subtotal }))
}

export function loadCartFromCache(): { items: CartItem[]; subtotal: number; total: number } | null {
  try {
    const raw = localStorage.getItem('zylumia_cart_cache')
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}

export async function saveCartToBackend(items: any[], sessionId?: string, customerInfo?: object): Promise<boolean> {
  const sid = sessionId || getOrCreateSessionId()
  const normalized = normalizeItems(items)
  try {
    const r = await fetch(`${API}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sid, items: normalized, ...(customerInfo && { customerInfo }) }),
    })
    const data = await r.json()
    return !!data.success
  } catch { return false }
}

export async function loadCartFromBackend(sessionId: string): Promise<any | null> {
  try {
    const r = await fetch(`${API}/api/cart/${sessionId}`)
    const data = await r.json()
    if (!data.success || r.status === 404 || !data.cart?.items?.length) return null
    const items = normalizeItems(data.cart.items)
    const subtotal = items.reduce((acc, i) => acc + (i.price * i.qty), 0)
    return { ...data.cart, items, subtotal, total: subtotal }
  } catch { return null }
}
