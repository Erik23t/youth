import { describe, it, expect, vi, beforeEach } from 'vitest'

// Testa a lógica de cálculo de desconto isoladamente
function calcularDesconto(subtotal: number, percentual: number): number {
  return parseFloat((subtotal * (percentual / 100)).toFixed(2))
}

function calcularSubtotal(items: { price: number; qty?: number; quantity?: number }[]): number {
  return items.reduce((acc, item) => acc + (item.price * (item.qty || item.quantity || 1)), 0)
}

describe('Cálculo de desconto', () => {
  it('10% de desconto em carrinho de $44.80', () => {
    expect(calcularDesconto(44.80, 10)).toBeCloseTo(4.48, 2)
  })

  it('10% de desconto em carrinho com 3 itens', () => {
    const items = [
      { price: 44.80, qty: 1 },
      { price: 84.93, qty: 1 },
      { price: 134.40, qty: 1 },
    ]
    const subtotal = calcularSubtotal(items)
    expect(subtotal).toBeCloseTo(264.13, 2)
    expect(calcularDesconto(subtotal, 10)).toBeCloseTo(26.41, 2)
  })

  it('desconto 0% não afeta o total', () => {
    expect(calcularDesconto(100, 0)).toBe(0)
  })

  it('subtotal respeita quantidade', () => {
    const items = [{ price: 44.80, qty: 3 }]
    expect(calcularSubtotal(items)).toBeCloseTo(134.40, 2)
  })

  it('subtotal usa quantity se qty ausente', () => {
    const items = [{ price: 44.80, quantity: 2 }]
    expect(calcularSubtotal(items)).toBeCloseTo(89.60, 2)
  })
})
