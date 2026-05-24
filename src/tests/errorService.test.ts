import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleError, withRetry } from '../services/errorService'

beforeEach(() => { vi.clearAllMocks() })

describe('handleError', () => {
  it('erro de rede', () => {
    const msg = handleError(new Error('Failed to fetch'), 'carrinho', { silencioso: true })
    expect(msg).toBe('Erro de conexao. Verifique sua internet.')
  })
  it('erro de contexto pagamento', () => {
    const msg = handleError(new Error('algo estranho'), 'pagamento', { silencioso: true })
    expect(msg).toBe('Erro ao processar o pagamento. Tente novamente.')
  })
  it('erro generico', () => {
    const msg = handleError(new Error('x'), 'geral', { silencioso: true })
    expect(msg).toBe('Algo deu errado. Tente novamente.')
  })
  it('executa callback', () => {
    const cb = vi.fn()
    handleError(new Error('x'), 'geral', { silencioso: true, callback: cb })
    expect(cb).toHaveBeenCalledOnce()
  })
})

describe('withRetry', () => {
  it('sucesso na 1a tentativa', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    expect(await withRetry(fn, 3)).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(1)
  })
  it('retry em rede e sucesso na 2a', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('Failed to fetch'))
      .mockResolvedValueOnce('ok2')
    expect(await withRetry(fn, 3, 0)).toBe('ok2')
    expect(fn).toHaveBeenCalledTimes(2)
  })
  it('lanca apos esgotar tentativas', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Failed to fetch'))
    await expect(withRetry(fn, 3, 0)).rejects.toThrow('Failed to fetch')
    expect(fn).toHaveBeenCalledTimes(3)
  })
  it('nao retenta erro nao-rede', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('401'))
    await expect(withRetry(fn, 3, 0)).rejects.toThrow('401')
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
