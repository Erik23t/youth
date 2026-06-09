export type ErrorContext = 'carrinho' | 'pagamento' | 'auth' | 'cupom' | 'pedido' | 'rede' | 'geral'

const MENSAGENS: Record<string, string> = {
  'Failed to fetch': 'Connection error. Check your internet.',
  'NetworkError':    'Connection error. Check your internet.',
  'Load failed':     'Connection error. Check your internet.',
  '401':             'Session expired. Please log in again.',
  '403':             'Access denied.',
  '404':             'Resource not found.',
  '429':             'Too many attempts. Wait a few seconds.',
  '500':             'Internal server error. Try again.',
  '503':             'Service temporarily unavailable.',
}

const CONTEXTO: Record<ErrorContext, string> = {
  carrinho:  'Error updating cart.',
  pagamento: 'Error processing payment. Try again.',
  auth:      'Authentication error. Please log in again.',
  cupom:     'Could not apply coupon.',
  pedido:    'Error loading order.',
  rede:      'Connection error.',
  geral:     'Something went wrong. Try again.',
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
      mostrarToast('Connection error. Tentando novamente (' + (i + 1) + '/' + (tentativas - 1) + ')...', 'aviso')
      await new Promise(r => setTimeout(r, delayMs * (i + 1)))
    }
  }
  throw ultimoErro
}

export const toastErro    = (msg: string) => mostrarToast(msg, 'erro')
export const toastAviso   = (msg: string) => mostrarToast(msg, 'aviso')
export const toastSucesso = (msg: string) => mostrarToast(msg, 'sucesso')
