export type ErrorContext = 'carrinho' | 'pagamento' | 'auth' | 'cupom' | 'pedido' | 'rede' | 'geral'

const MENSAGENS: Record<string, string> = {
  'Failed to fetch': 'Erro de conexao. Verifique sua internet.',
  'NetworkError':    'Erro de conexao. Verifique sua internet.',
  'Load failed':     'Erro de conexao. Verifique sua internet.',
  '401':             'Sessao expirada. Faca login novamente.',
  '403':             'Acesso negado.',
  '404':             'Recurso nao encontrado.',
  '429':             'Muitas tentativas. Aguarde alguns segundos.',
  '500':             'Erro interno do servidor. Tente novamente.',
  '503':             'Servico temporariamente indisponivel.',
}

const CONTEXTO: Record<ErrorContext, string> = {
  carrinho:  'Erro ao atualizar o carrinho.',
  pagamento: 'Erro ao processar o pagamento. Tente novamente.',
  auth:      'Erro de autenticacao. Faca login novamente.',
  cupom:     'Nao foi possivel aplicar o cupom.',
  pedido:    'Erro ao carregar pedido.',
  rede:      'Erro de conexao.',
  geral:     'Algo deu errado. Tente novamente.',
}

function resolverMensagem(err: unknown, context: ErrorContext): string {
  const msg = err instanceof Error ? err.message : String(err)
  for (const [chave, texto] of Object.entries(MENSAGENS)) {
    if (msg.includes(chave)) return texto
  }
  return CONTEXTO[context] || CONTEXTO.geral
}

let toastEl: HTMLElement | null = null

function mostrarToast(mensagem: string, tipo: 'erro' | 'aviso' | 'sucesso' = 'erro') {
  if (typeof document === 'undefined') return
  if (toastEl) toastEl.remove()
  const cores = { erro: '#dc2626', aviso: '#d97706', sucesso: '#16a34a' }
  toastEl = document.createElement('div')
  toastEl.setAttribute('role', 'alert')
  Object.assign(toastEl.style, {
    position: 'fixed', bottom: '24px', right: '24px',
    background: cores[tipo], color: '#fff',
    padding: '12px 20px', borderRadius: '8px',
    fontSize: '14px', maxWidth: '360px',
    zIndex: '9999', opacity: '1', transition: 'opacity 0.3s',
  })
  toastEl.textContent = mensagem
  document.body.appendChild(toastEl)
  setTimeout(() => {
    if (toastEl) toastEl.style.opacity = '0'
    setTimeout(() => { toastEl?.remove(); toastEl = null }, 350)
  }, 4000)
}

export function handleError(
  err: unknown,
  context: ErrorContext = 'geral',
  opcoes: { silencioso?: boolean; callback?: () => void } = {}
): string {
  const mensagem = resolverMensagem(err, context)
  if (opcoes.silencioso !== true) mostrarToast(mensagem, 'erro')
  opcoes.callback?.()
  return mensagem
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  tentativas = 3,
  delayMs = 800
): Promise<T> {
  let ultimoErro: unknown
  for (let i = 0; i < tentativas; i++) {
    try {
      return await fn()
    } catch (err) {
      ultimoErro = err
      const isNetwork = err instanceof Error &&
        (err.message.includes('fetch') || err.message.includes('Network') || err.message.includes('Load failed'))
      if (isNetwork === false || i === tentativas - 1) throw err
      mostrarToast('Erro de conexao. Tentando novamente (' + (i + 1) + '/' + (tentativas - 1) + ')...', 'aviso')
      await new Promise(r => setTimeout(r, delayMs * (i + 1)))
    }
  }
  throw ultimoErro
}

export const toastErro    = (msg: string) => mostrarToast(msg, 'erro')
export const toastAviso   = (msg: string) => mostrarToast(msg, 'aviso')
export const toastSucesso = (msg: string) => mostrarToast(msg, 'sucesso')
