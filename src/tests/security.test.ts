import { describe, it, expect, vi } from 'vitest'
import { normalizeItems, saveCartToBackend } from '../services/cartService'

describe('Segurança: manipulação de preços', () => {
  it('normalizeItems preserva price original (validação é do backend)', () => {
    // O frontend NÃO deve alterar prices — backend ignora e usa catálogo
    const items = normalizeItems([{ name: 'Zylumia 6 meses', price: 0.01, qty: 1 }])
    expect(items[0].price).toBe(0.01) // frontend envia, backend descarta
    expect(items[0].qty).toBe(1)
  })

  it('saveCartToBackend envia sessionId correto', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true })
    })
    globalThis.fetch = mockFetch

    await saveCartToBackend([{ name: 'Produto', price: 44.80, qty: 1 }], 'minha-session')
    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    expect(body.sessionId).toBe('minha-session')
  })

  it('campos extras do item não chegam ao backend', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true })
    })
    globalThis.fetch = mockFetch

    await saveCartToBackend([{
      name: 'Produto', price: 44.80, qty: 1,
      isAdmin: true, overridePrice: 0, freeShipping: true
    }], 'session')

    const body = JSON.parse(mockFetch.mock.calls[0][1].body)
    const item = body.items[0]
    expect(item.isAdmin).toBeUndefined()
    expect(item.overridePrice).toBeUndefined()
    expect(item.freeShipping).toBeUndefined()
  })
})
