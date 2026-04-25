import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'https://zylumia-backend-kmbrxbidkq-uc.a.run.app';

export default function CheckoutSucesso() {
  const [status, setStatus] = useState('loading')
  const [orderId, setOrderId] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const paypalToken = params.get('token')    // vem do PayPal direto
    const orderId = params.get('order')        // vem do nosso redirect

    // Caso 1: já foi processado pelo ZylumiaPayPalButton
    // URL: /checkout/sucesso?order=D2563DB5
    if (orderId) {
      setOrderId(orderId)
      setStatus('success')
      return
    }

    // Caso 2: redirect direto do PayPal (sem captura prévia)
    // URL: /checkout/sucesso?token=PAYPAL_ID
    if (paypalToken) {
      fetch(
        `${API}/api/paypal/capture-order`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paypalOrderId: paypalToken })
        }
      )
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          localStorage.removeItem('zylumia_session_id')
          localStorage.removeItem('zylumia_coupon')
          setOrderId(data.order.id.substring(0, 8).toUpperCase())
          
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'purchase', {
              transaction_id: data.order.id,
              currency: 'USD',
              value: data.order.purchase_units?.[0]?.amount?.value || 0,
              items: [{
                item_name: 'Zylumia Product',
                price: data.order.purchase_units?.[0]?.amount?.value || 0,
                quantity: 1
              }]
            });
          }

          setStatus('success')
        } else {
          setErro(data.message || 'Erro ao confirmar pagamento.')
          setStatus('error')
        }
      })
      .catch(() => {
        setErro('Erro de conexão.')
        setStatus('error')
      })
      return
    }

    // Caso 3: sem token nem order na URL
    setErro('Parâmetros de pagamento não encontrados.')
    setStatus('error')
  }, [])

  if (status === 'loading') return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
      <h2 style={{ color: '#1a0533' }}>Confirmando pagamento...</h2>
      <p style={{ color: '#888' }}>Aguarde um momento.</p>
    </div>
  )

  if (status === 'error') return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
      <h2 style={{ color: '#ef4444' }}>Erro no pagamento</h2>
      <p style={{ color: '#888' }}>{erro}</p>
      <button
        onClick={() => window.location.href = '/'}
        style={{
          marginTop: '24px',
          padding: '14px 32px',
          background: '#7c3aed',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        VOLTAR À LOJA
      </button>
    </div>
  )

  const user = JSON.parse(localStorage.getItem('zylumia_user') || 'null')
  const paypalEmail = localStorage.getItem('zylumia_paypal_email')
  const emailConfirmacao = paypalEmail || user?.email

  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
      <h1 style={{ color: '#1a0533', fontSize: '28px', marginBottom: '8px' }}>
        Pedido Confirmado!
      </h1>
      <p style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
        ✅ Pagamento aprovado
      </p>
      <p style={{ color: '#555', marginBottom: '32px' }}>
        Pedido <strong style={{ color: '#7c3aed' }}>#{orderId}</strong><br/>
        {emailConfirmacao ? (
          <>✅ Confirmação enviada para: <strong>{emailConfirmacao}</strong></>
        ) : (
          <>Um e-mail de confirmação foi enviado para você.</>
        )}
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => window.location.href = '/acompanhe-seu-pedido'}
          style={{
            padding: '14px 32px',
            background: '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ACOMPANHAR PEDIDO
        </button>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '14px 32px',
            background: 'white',
            color: '#7c3aed',
            border: '2px solid #7c3aed',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          CONTINUAR COMPRANDO
        </button>
      </div>
    </div>
  )
}
