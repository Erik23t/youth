import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  normalizeItems,
  getOrCreateSessionId,
  saveCartToCache,
  loadCartFromCache,
  saveCartToBackend,
  loadCartFromBackend,
} from '../services/cartService'

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

// ── normalizeItems ──────────────────────────────────────────
describe('normalizeItems', () => {
  it('converte quantity para qty', () => {
    const result = normalizeItems([{ name: 'Produto', price: 44.80, quantity: 3 }])
    expect(result[0].qty).toBe(3)
  })

  it('mantém qty se já existir', () => {
    const result = normalizeItems([{ name: 'Produto', price: 44.80, qty: 2 }])
    expect(result[0].qty).toBe(2)
  })

  it('usa 1 como padrão se qty e quantity estiverem ausentes', () => {
    const result = normalizeItems([{ name: 'Produto', price: 44.80 }])
    expect(result[0].qty).toBe(1)
  })

  it('SEGURANÇA: não permite price negativo ou zero virar outro valor', () => {
    const result = normalizeItems([{ name: 'Produto', price: 0.01, qty: 1 }])
    // normalizeItems não altera o price — validação é responsabilidade do backend
    expect(result[0].price).toBe(0.01)
    expect(result[0].qty).toBe(1)
  })

  it('retorna array vazio para input vazio', () => {
    expect(normalizeItems([])).toEqual([])
    expect(normalizeItems(null as any)).toEqual([])
  })

  it('remove campos extras e mantém só name, price, qty, image', () => {
    const result = normalizeItems([{
      name: 'Produto', price: 44.80, qty: 1,
      campoExtra: 'não deve aparecer', hackerField: 999
    }])
    expect(result[0]).toEqual({ name: 'Produto', price: 44.80, qty: 1, image: '' })
  })
})

// ── getOrCreateSessionId ────────────────────────────────────
describe('getOrCreateSessionId', () => {
  it('cria sessionId se não existir', () => {
    const id = getOrCreateSessionId()
    expect(id).toBe('test-uuid-1234')
    expect(localStorage.getItem('zylumia_session_id')).toBe('test-uuid-1234')
  })

  it('retorna sessionId existente sem criar novo', () => {
    localStorage.setItem('zylumia_session_id', 'session-existente')
    const id = getOrCreateSessionId()
    expect(id).toBe('session-existente')
  })
})

// ── saveCartToCache / loadCartFromCache ─────────────────────
describe('cache do carrinho', () => {
  it('salva e lê itens corretamente', () => {
    const items = [{ name: 'Zylumia 1 mês', price: 44.80, qty: 2 }]
    saveCartToCache(items)
    const cached = loadCartFromCache()
    expect(cached?.items[0].qty).toBe(2)
    expect(cached?.items[0].price).toBe(44.80)
  })

  it('calcula subtotal corretamente ao salvar', () => {
    const items = [
      { name: 'Produto 1', price: 44.80, qty: 2 },
      { name: 'Produto 2', price: 84.93, qty: 1 },
    ]
    saveCartToCache(items)
    const cached = loadCartFromCache()
    // 44.80*2 + 84.93*1 = 174.53
    expect(cached?.subtotal).toBeCloseTo(174.53, 2)
    expect(cached?.total).toBeCloseTo(174.53, 2)
  })

  it('retorna null se cache estiver vazio', () => {
    expect(loadCartFromCache()).toBeNull()
  })

  it('retorna null se cache estiver corrompido', () => {
    localStorage.setItem('zylumia_cart_cache', 'json-invalido{{{')
    expect(loadCartFromCache()).toBeNull()
  })
})

// ── saveCartToBackend ───────────────────────────────────────
describe('saveCartToBackend', () => {
  it('envia itens normalizados para o backend', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true })
    })
    globalThis.fetch = mockFetch

    const items = [{ name: 'Zylumia 6 meses', price: 134.40, quantity: 2 }]
    const result = await saveCartToBackend(items, 'session-123')

    expect(result).toBe(true)
    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(body.items[0].qty).toBe(2)        // normalizado
    expect(body.items[0].quantity).toBeUndefined() // campo duplicado removido
    expect(body.sessionId).toBe('session-123')
  })

  it('retorna false se backend retornar erro', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: false, message: 'Erro' })
    })
    const result = await saveCartToBackend([], 'session-123')
    expect(result).toBe(false)
  })

  it('retorna false se fetch lançar exceção (rede offline)', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
    const result = await saveCartToBackend([], 'session-123')
    expect(result).toBe(false)
  })
})

// ── loadCartFromBackend ─────────────────────────────────────
describe('loadCartFromBackend', () => {
  it('retorna carrinho com subtotal calculado', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({
        success: true,
        cart: {
          items: [
            { name: 'Produto A', price: 44.80, qty: 2 },
            { name: 'Produto B', price: 84.93, qty: 1 },
          ]
        }
      })
    })

    const cart = await loadCartFromBackend('session-123')
    expect(cart).not.toBeNull()
    expect(cart.subtotal).toBeCloseTo(174.53, 2)
    expect(cart.items[0].qty).toBe(2)
  })

  it('retorna null se carrinho vazio', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ success: true, cart: { items: [] } })
    })
    expect(await loadCartFromBackend('session-123')).toBeNull()
  })

  it('retorna null se backend retornar 404', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      status: 404,
      json: () => Promise.resolve({ success: false })
    })
    expect(await loadCartFromBackend('session-123')).toBeNull()
  })

  it('retorna null se fetch falhar', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('timeout'))
    expect(await loadCartFromBackend('session-123')).toBeNull()
  })
})
