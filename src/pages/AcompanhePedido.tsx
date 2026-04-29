import { useEffect, useState } from 'react'
import { formatPrice } from '../lib/currency'
import ZylumiaAuth from '../components/ZylumiaAuth'

const API = import.meta.env.VITE_API_URL || 'https://backend.zylumia.com';

function PageHeader() {
  return (
    <header style={{
      width: '100%', background: 'white', borderBottom: '1px solid #ede9fe',
      padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 8px rgba(120,60,180,0.07)', boxSizing: 'border-box'
    }}>
      <button onClick={() => window.location.href = '/'}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#7c3aed', fontSize: '14px', fontWeight: '600', cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', fontFamily: 'Georgia, serif' }}
        onMouseOver={e => e.currentTarget.style.background = '#f3e8ff'}
        onMouseOut={e => e.currentTarget.style.background = 'none'}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        Voltar
      </button>
      <a href="/" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', textDecoration: 'none', color: '#7c3aed', fontSize: '22px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>Zylumia</a>
      <div style={{ width: '80px' }} />
    </header>
  )
}

export default function AcompanhePedido() {
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [emailVisitante, setEmailVisitante] = useState(localStorage.getItem('zylumia_paypal_email') || '')
  const [numeroPedido, setNumeroPedido] = useState('')
  const [pedidosVisitante, setPedidosVisitante] = useState([])
  const [loadingVisitante, setLoadingVisitante] = useState(false)
  const [erroVisitante, setErroVisitante] = useState('')
  const token = localStorage.getItem('zylumia_token')

  const STATUS_CONFIG = {
    PENDING:    { label: 'Aguardando pagamento', color: '#f59e0b', icon: '⏳' },
    PAID:       { label: 'Pagamento confirmado', color: '#10b981', icon: '✅' },
    PROCESSING: { label: 'Em preparação',        color: '#7c3aed', icon: '📦' },
    SHIPPED:    { label: 'Enviado',              color: '#3b82f6', icon: '🚚' },
    DELIVERED:  { label: 'Entregue',             color: '#059669', icon: '🎉' },
    CANCELLED:  { label: 'Cancelado',            color: '#ef4444', icon: '❌' },
  }

  const fetchPedidos = async () => {
    const tk = localStorage.getItem('zylumia_token')
    const userStr = localStorage.getItem('zylumia_user')
    if (!tk && !userStr) { setLoading(false); return }
    try {
      setLoading(true)
      if (tk) {
        const r = await fetch(`${API}/api/orders/meus-pedidos`, { headers: { 'Authorization': `Bearer ${tk}` } })
        const data = await r.json()
        if (data.success) { setPedidos(data.orders || []); setLoading(false); return }
      }
      if (userStr) {
        const user = JSON.parse(userStr)
        if (user?.email) {
          const r2 = await fetch(`${API}/api/orders/meus-pedidos`, { credentials: 'include' })
          const data2 = await r2.json()
          if (data2.success) setPedidos(data2.orders || [])
        }
      }
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  const verificarPagamento = async (orderId) => {
    try { await fetch(`${API}/api/paypal/order/${orderId}`); fetchPedidos() } catch(e) { console.error(e) }
  }

  async function buscarPedidoVisitante() {
    if (!emailVisitante || !numeroPedido) { setErroVisitante('Preencha o e-mail e o numero do pedido.'); return }
    setLoadingVisitante(true); setErroVisitante('')
    try {
      const r = await fetch(`${API}/api/orders/rastrear-visitante`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: emailVisitante.trim().toLowerCase(), orderId: numeroPedido.trim().toUpperCase() }) })
      const data = await r.json()
      if (data.success && data.orders?.length > 0) { setPedidosVisitante(data.orders); setErroVisitante('') }
      else setErroVisitante('Nenhum pedido encontrado. Verifique o e-mail usado na compra pelo PayPal.')
    } catch (e) { setErroVisitante('Erro de conexao. Tente novamente.') }
    finally { setLoadingVisitante(false) }
  }

  useEffect(() => { fetchPedidos() }, [token])

  const renderPedidoCard = (pedido) => {
    const st = STATUS_CONFIG[pedido.status] || STATUS_CONFIG.PENDING
    const steps = ['PAID','PROCESSING','SHIPPED','DELIVERED']
    const currentStep = steps.indexOf(pedido.status)
    return (
      <div key={pedido.id} style={{ border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px', marginBottom: '16px', background: 'white', boxShadow: '0 2px 8px rgba(120,60,180,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          <div>
            <span style={{ color: '#888', fontSize: '13px' }}>Pedido</span>
            <div style={{ color: '#1a0533', fontWeight: 'bold', fontSize: '18px' }}>#{pedido.id.substring(0,8).toUpperCase()}</div>
            <div style={{ color: '#888', fontSize: '13px' }}>{new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ background: st.color + '20', color: st.color, padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>{st.icon} {st.label}</span>
            <div style={{ color: '#7c3aed', fontWeight: 'bold', fontSize: '18px', marginTop: '8px' }}>{formatPrice(parseFloat(pedido.total), pedido.currency || pedido.pais || 'BR')}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
          <img src="" alt="Produto" style={{ width: '65px', height: '65px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0, border: '1px solid #e5e7eb' }} />
          <div style={{ flex: 1 }}>{pedido.items?.map((item, i) => <div key={i} style={{ color: '#555', fontSize: '14px', marginBottom: '4px' }}>- {item.name} x {item.qty || 1}</div>)}</div>
        </div>
        {pedido.status === 'PENDING' && (
          <div style={{ marginTop: '16px', padding: '16px', background: '#fffbeb', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <span style={{ color: '#b45309', fontSize: '14px' }}>Aguardando confirmacao do pagamento</span>
            <button onClick={() => verificarPagamento(pedido.id)} style={{ padding: '8px 16px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>Verificar pagamento</button>
          </div>
        )}
        {pedido.status !== 'CANCELLED' && pedido.status !== 'PENDING' && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
            {['PAID','PROCESSING','SHIPPED','DELIVERED'].map((step, i) => {
              const stepLabels = { PAID:'Pago', PROCESSING:'Preparando', SHIPPED:'Enviado', DELIVERED:'Entregue' }
              const done = i <= currentStep
              return (
                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '12px', color: done ? '#7c3aed' : '#ccc', fontWeight: done ? 'bold' : 'normal' }}>{stepLabels[step]}</span>
                  
                </div>
              )
            })}
          </div>
        )}
        {pedido.trackingCode && (
          <div style={{ marginTop: '16px' }}>
            <a href={pedido.trackingUrl || '#'} target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: '10px 24px', background: '#3b82f6', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>Rastrear: {pedido.trackingCode}</a>
          </div>
        )}
      </div>
    )
  }

  if (loading) return <div style={{ minHeight: '100vh', background: '#faf9ff' }}><PageHeader /><div style={{ textAlign: 'center', padding: '80px' }}><p style={{ color: '#888' }}>Carregando seus pedidos...</p></div></div>

  if (!token && pedidosVisitante.length === 0) return (
    <div style={{ minHeight: '100vh', background: '#faf9ff' }}>
      <PageHeader />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <h2 style={{ color: '#1a0533', fontSize: '28px' }}>Acompanhe seu Pedido</h2>
        </div>
        <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #ede9fe', boxShadow: '0 4px 20px rgba(120,60,180,0.08)', marginBottom: '32px' }}>
          <h3 style={{ color: '#1a0533', fontSize: '20px', marginBottom: '16px' }}>Tenho uma conta</h3>
          <p style={{ color: '#666', marginBottom: '24px', fontSize: '15px' }}>Faca login para ver todo o seu historico de pedidos.</p>
          <button onClick={() => setIsAuthOpen(true)} style={{ width: '100%', padding: '14px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
            onMouseOver={e => e.currentTarget.style.background = '#6d28d9'} onMouseOut={e => e.currentTarget.style.background = '#7c3aed'}>
            ENTRAR NA MINHA CONTA
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '32px 0', color: '#888' }}>
          <div style={{ flex: 1, height: '1px', background: '#ede9fe' }}></div>
          <span style={{ padding: '0 16px', fontSize: '14px', fontWeight: 'bold' }}>ou</span>
          <div style={{ flex: 1, height: '1px', background: '#ede9fe' }}></div>
        </div>
        <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #ede9fe', boxShadow: '0 4px 20px rgba(120,60,180,0.08)' }}>
          <h3 style={{ color: '#1a0533', fontSize: '20px', marginBottom: '16px' }}>Rastrear sem conta</h3>
          <p style={{ color: '#666', marginBottom: '24px', fontSize: '15px' }}>Busque seu pedido usando o e-mail e o numero da compra.</p>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#1a0533', fontWeight: 'bold', fontSize: '14px' }}>E-mail usado na compra:</label>
            <input type="email" value={emailVisitante} onChange={e => setEmailVisitante(e.target.value)} placeholder="seu@email.com" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#1a0533', fontWeight: 'bold', fontSize: '14px' }}>Numero do pedido:</label>
            <input type="text" value={numeroPedido} onChange={e => setNumeroPedido(e.target.value)} placeholder="Ex: E5741B80" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '16px', outline: 'none', boxSizing: 'border-box', textTransform: 'uppercase' }} />
          </div>
          {erroVisitante && <div style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px', padding: '12px', background: '#fef2f2', borderRadius: '8px' }}>{erroVisitante}</div>}
          <button onClick={buscarPedidoVisitante} disabled={loadingVisitante} style={{ width: '100%', padding: '14px', background: 'white', color: '#7c3aed', border: '2px solid #7c3aed', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: loadingVisitante ? 'not-allowed' : 'pointer', opacity: loadingVisitante ? 0.7 : 1 }}
            onMouseOver={e => { if(!loadingVisitante) e.currentTarget.style.background = '#f3e8ff' }} onMouseOut={e => { if(!loadingVisitante) e.currentTarget.style.background = 'white' }}>
            {loadingVisitante ? 'BUSCANDO...' : 'BUSCAR MEU PEDIDO'}
          </button>
          <p style={{ marginTop: '24px', fontSize: '13px', color: '#888', textAlign: 'center', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
            O numero do pedido esta na confirmacao de compra recebida por e-mail. Exemplo: #E5741B80
          </p>
        </div>
        {isAuthOpen && <ZylumiaAuth isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={() => window.location.reload()} />}
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#faf9ff' }}>
      <PageHeader />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: '#1a0533', margin: 0 }}>Meus Pedidos</h1>
          {token && <button onClick={fetchPedidos} style={{ padding: '8px 16px', background: '#f3e8ff', color: '#7c3aed', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>Atualizar</button>}
        </div>
        {pedidos.length === 0 && pedidosVisitante.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: '12px', border: '1px solid #ede9fe' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛍️</div>
            <h2 style={{ color: '#1a0533' }}>Nenhum pedido ainda</h2>
            <p style={{ color: '#888', marginBottom: '24px' }}>Voce ainda nao fez nenhuma compra.</p>
            <button onClick={() => window.location.href = '/'} style={{ padding: '14px 40px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>COMPRAR AGORA</button>
          </div>
        ) : (
          [...pedidos, ...pedidosVisitante].map(pedido => renderPedidoCard(pedido))
        )}
      </div>
    </div>
  )
}
