import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleError, withRetry } from '../services/errorService'

beforeEach(() => { vi.clearAllMocks() })

describe('handleError', () => {
  it('retorna mensagem amigavel para erro de rede', () => {
    const msg = handleError(new Error('Failed to fetch'), 'carrinho', { silencioso: true })
    expect(msg).toBe('Erro de conexao. Verifique sua internet.')
  })

  it('retorna mensagem de contexto para erro desconhecido', () => {
    const msg = handleError(new Error('algo estranho'), 'pagamento', { silencioso: true })
    expect(msg).toBe('Erro ao processar o pagamento. Tente novamente.')
  })

  it('retorna mensagem generica sem contexto', () => {
    const msg = handleError(new Error('x'), 'geral', { silencioso: true })
    expect(msg).toBe('Algo deu errado. Tente novamente.')
  })

  it('executa callback se fornecido', () => {
    const cb = vi.fn()
    handleError(new Error('x'), 'geral', { silencioso: true, callback: cb })
    expect(cb).toHaveBeenCalledOnce()
  })
})

describe('withRetry', () => {
  it('resolve na primeira tentativa se sucesso', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    const result = await withRetry(fn, 3)
    expect(result).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retenta em erro de rede e resolve na 2a tentativa', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('Failed to fetch'))
      .mockResolvedValueOnce('ok na 2a')
    const result = await withRetry(fn, 3, 0)
    expect(result).toBe('ok na 2a')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('lanca o erro apos esgotar todas as tentativas', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Failed to fetch'))
    await expect(withRetry(fn, 3, 0)).rejects.toThrow('Failed to fetch')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('nao retenta erros que nao sao de rede', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('401'))
    await expect(withRetry(fn, 3, 0)).rejects.toThrow('401')
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
