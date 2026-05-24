// ✅ FONTE ÚNICA de tratamento de erros
// Use handleError() em vez de catch silencioso

export type ErrorContext = 'carrinho' | 'pagamento' | 'auth' | 'cupom' | 'pedido' | 'rede' | 'geral'

const MENSAGENS: Record<string, string> = {
  'Failed to fetch':        'Erro de conexão. Verifique sua internet.',
  'NetworkError':           'Erro de conexão. Verifique sua internet.',
  'Load failed':            'Erro de conexão. Verifique sua internet.',
  '401':                    'Sessão expirada. Faça login novamente.',
  '403':                    'Acesso negado.',
  '404':                    'Recurso não encontrado.',
  '429':                    'Muitas tentativas. Aguarde alguns segundos.',
  '500':                    'Erro interno do servidor. Tente novamente.',
  '503':                    'Serviço temporariamente indisponível.',
}

const CONTEXTO_MENSAGENS: Record<ErrorContext, string> = {
  carrinho:  'Erro ao atualizar o carrinho.',
  pagamento: 'Erro ao processar o pagamento. Tente novamente.',
  auth:      'Erro de autenticação. Faça login novamente.',
  cupom:     'Não foi possível aplicar o cupom.',
  pedido:    'Erro ao carregar pedido.',
  rede:      'Erro de conexão.',
  geral:     'Algo deu errado. Tente novamente.',
}

function resolverMensagem(err: unknown, context: ErrorContext): string {
  const msg = err instanceof Error ? err.message : String(err)
  for (const [chave, texto] of Object.entries(MENSAGENS)) {
    if (msg.includes(chave)) return texto
  }
  return CONTEXTO_MENSAGENS[context] || CONTEXTO_MENSAGENS.geral
}

// Toast simples — sem dependência externa
let toastEl: HTMLElement | null = null

function mostrarToast(mensagem: string, tipo: 'erro' | 'aviso' | 'sucesso' = 'erro') {
  if (typeof document === 'undefined') return
  if (toastEl) toastEl.remove()

  const cores = {
    erro:   { bg: '#dc2626', text: '#fff' },
    aviso:  { bg: '#d97706', text: '#fff' },
    sucesso:{ bg: '#16a34a', text: '#fff' },
  }

  toastEl = document.createElement('div')
  toastEl.setAttribute('role', 'alert')
  toastEl.setAttribute('aria-live', 'assertive')
  Object.assign(toastEl.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    background: cores[tipo].bg,
    color: cores[tipo].text,
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'system-ui, sans-serif',
    maxWidth: '360px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: '9999',
    transition: 'opacity 0.3s',
    opacity: '1',
  })
  toastEl.textContent = mensagem
  document.body.appendChild(toastEl)

  setTimeout(() => {
    if (toastEl) { toastEl.style.opacity = '0' }
    setTimeout(() => { toastEl?.remove(); toastEl = null }, 350)
  }, 4000)
}

// Função principal — use em todo catch
export function handleError(
  err: unknown,
  context: ErrorContext = 'geral',
  opcoes: { silencioso?: boolean; callback?: () => void } = {}
): string {
  const mensagem = resolverMensagem(err, context)
  if (!opcoes.silencioso) mostrarToast(mensagem, 'erro')
  opcoes.callback?.()
  return mensagem
}

// Retry automático para chamadas de rede
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
      const isNetworkError = err instanceof Error &&
        (err.message.includes('fetch') || err.message.includes('Network') || err.message.includes('Load failed'))
      if (!isNetworkError || i === tentativas - 1) throw err
      mostrarToast(\`Erro de conexão. Tentando novamente (\${i + 1}/\${tentativas - 1})...\`, 'aviso')
      await new Promise(r => setTimeout(r, delayMs * (i + 1)))
    }
  }
  throw ultimoErro
}

// Helpers rápidos
export const toastErro   = (msg: string) => mostrarToast(msg, 'erro')
export const toastAviso  = (msg: string) => mostrarToast(msg, 'aviso')
export const toastSucesso= (msg: string) => mostrarToast(msg, 'sucesso')
