import React, { useState, useEffect, useRef } from 'react';
import { Star, BadgeCheck, ShieldCheck, Truck, Users } from 'lucide-react';
import ZylumiaPayPalButton from '../components/ZylumiaPayPalButton';
import StripeCheckout from '../components/StripeCheckout';

const API = import.meta.env.VITE_API_URL || 'https://zylumia-backend-kmbrxbidkq-uc.a.run.app';

const ReviewsAndGuarantees = () => (
  <div style={{ marginTop: '40px' }}>
    <h3 style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px', color: '#111827' }}>
      Mais de 20.000 clientes satisfeitos
    </h3>
    
    {/* Review 1 */}
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '16px', display: 'flex', gap: '16px', backgroundColor: '#fff' }}>
      <img src="/media/checkout-review-01.webp" alt="Review 1" style={{ width: '100px', height: '150px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', color: '#fbbf24', marginBottom: '8px' }}>
          <Star size={16} fill="currentColor" strokeWidth={0} />
          <Star size={16} fill="currentColor" strokeWidth={0} />
          <Star size={16} fill="currentColor" strokeWidth={0} />
          <Star size={16} fill="currentColor" strokeWidth={0} />
          <Star size={16} fill="currentColor" strokeWidth={0} />
        </div>
        <h4 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#111827', lineHeight: '1.3' }}>
          Estou me lamentando muito por não ter encomendado um desses anos atrás.
        </h4>
        <p style={{ fontSize: '13px', color: '#4b5563', marginBottom: '12px', lineHeight: '1.4' }}>
          Estou me lamentando muito por não ter encomendado um desses anos atrás. Ele arranca pelos bem curtos com muita eficácia. É muito menos doloroso do que arrancar um pelo de cada vez com pinça. Pelo menos meia dúzia de amigas minhas agora vão encomendar um!
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6b7280' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#111827', fontWeight: 500 }}>
            Sheila McCarthy <BadgeCheck size={14} color="#3b82f6" fill="#3b82f6" style={{ color: '#fff' }} />
          </div>
          <span>17/11/2024</span>
        </div>
      </div>
    </div>

    {/* Review 2 */}
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '32px', display: 'flex', gap: '16px', backgroundColor: '#fff' }}>
      <img src="/media/checkout-review-02.webp" alt="Review 2" style={{ width: '100px', height: '150px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', color: '#fbbf24', marginBottom: '8px' }}>
          <Star size={16} fill="currentColor" strokeWidth={0} />
          <Star size={16} fill="currentColor" strokeWidth={0} />
          <Star size={16} fill="currentColor" strokeWidth={0} />
          <Star size={16} fill="currentColor" strokeWidth={0} />
          <Star size={16} fill="currentColor" strokeWidth={0} />
        </div>
        <h4 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#111827', lineHeight: '1.3' }}>
          O preço e a relação custo-benefício são realmente incríveis para o que este produto oferece.
        </h4>
        <p style={{ fontSize: '13px', color: '#4b5563', marginBottom: '12px', lineHeight: '1.4' }}>
          Funciona muito bem, até mesmo em pelos pequenos e quase invisíveis no meu queixo. O preço e a relação custo-benefício são realmente incríveis para o que o produto faz. Definitivamente recomendo.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6b7280' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#111827', fontWeight: 500 }}>
            Rebecca Norris <BadgeCheck size={14} color="#3b82f6" fill="#3b82f6" style={{ color: '#fff' }} />
          </div>
          <span>29/01/2024</span>
        </div>
      </div>
    </div>

    {/* Guarantees with purple icons */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ color: '#c084fc', flexShrink: 0 }}>
          <ShieldCheck size={40} strokeWidth={1.5} />
        </div>
        <div>
          <p style={{ fontWeight: 'bold', fontSize: '15px', color: '#111827', marginBottom: '4px' }}>Garantia de reembolso de 30 dias</p>
          <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.4' }}>Receba 100% do seu dinheiro de volta se não gostar do produto.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ color: '#c084fc', flexShrink: 0 }}>
          <Truck size={40} strokeWidth={1.5} />
        </div>
        <div>
          <p style={{ fontWeight: 'bold', fontSize: '15px', color: '#111827', marginBottom: '4px' }}>Frete grátis para todo Brasil</p>
          <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.4' }}>Oferecemos frete grátis para pedidos, para que você possa devolver seus produtos caso não esteja totalmente satisfeito e receber seu dinheiro de volta.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ color: '#c084fc', flexShrink: 0 }}>
          <Users size={40} strokeWidth={1.5} />
        </div>
        <div>
          <p style={{ fontWeight: 'bold', fontSize: '15px', color: '#111827', marginBottom: '4px' }}>Mais de 20.000 clientes satisfeitos</p>
          <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.4' }}>Clientes de todo o Brasil têm apreciado nossos produtos, que são continuamente aprimorados com base no feedback da comunidade.</p>
        </div>
      </div>
    </div>
  </div>
);

export default function Checkout() {
  const storedUser = JSON.parse(localStorage.getItem('zylumia_user') || 'null');
  const [cart, setCart] = useState<any>(null);
  
  const [etapa, setEtapa] = useState<'info'|'pagamento'>('info');
  const [nome, setNome]               = useState(storedUser?.name?.split(' ')[0] || '');
  const [sobrenome, setSobrenome]     = useState(storedUser?.name?.split(' ').slice(1).join(' ') || '');
  const [email, setEmail]             = useState(storedUser?.email || '');
  const [telefone, setTelefone]       = useState('');
  const [pais, setPais]               = useState('BR');
  const [endereco, setEndereco]       = useState('');
  const [complemento, setComplemento] = useState('');
  const [cidade, setCidade]           = useState('');
  const [estado, setEstado]           = useState('');
  const [cep, setCep]                 = useState('');
  const [cupom, setCupom]             = useState('');
  const [desconto, setDesconto]       = useState(0);
  const [cupomAplicado, setCupomAplicado] = useState<any>(null);
  const [loadingCupom, setLoadingCupom] = useState(false);
  const [erroCupom, setErroCupom]       = useState('');
  const [erro, setErro]               = useState('');
  const [loading, setLoading]         = useState(false);

  const stripeRef = useRef<any>(null);

  useEffect(() => { fetch(`${API}/api/health`).catch(() => {}) }, [])

  useEffect(() => {
    async function carregarCarrinho() {
      const sessionId = localStorage.getItem('zylumia_session_id')
      if (!sessionId) return

      try {
        const r = await fetch(
          `${API}/api/cart/${sessionId}`
        )
        const data = await r.json()
        
        if (data.success && data.cart) {
          setCart(data.cart)
          
          // Se o carrinho tem cupom salvo no backend
          if (data.cart.coupon && data.cart.discount > 0) {
            setCupomAplicado(data.cart.coupon)
            setDesconto(data.cart.discount)
            setCupom(data.cart.coupon.code || '')
            localStorage.setItem('zylumia_coupon', data.cart.coupon.code)
          }
        }
      } catch(e) {
        console.error('Erro ao carregar carrinho:', e)
      }
    }
    carregarCarrinho()
  }, [])

  useEffect(() => {
    if (!email.includes('@') || !cart?.items?.length) return
    
    const sessionId = localStorage.getItem('zylumia_session_id')
    if (!sessionId) return

    const timer = setTimeout(() => {
      fetch(`${API}/api/recovery/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          email: email.trim().toLowerCase(),
          items: cart.items,
          total: cart.total || cart.items.reduce((acc: number, item: any) => acc + (item.price * (item.qty || item.quantity || 1)), 0)
        })
      }).catch(e => console.error('Recovery track erro:', e))
    }, 2000)

    return () => clearTimeout(timer)
  }, [email, cart])

  if (!cart) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <p>Carregando checkout...</p>
      </div>
    );
  }

  const subtotal = cart?.subtotal || 0;
  const totalFinal = Math.max(subtotal - desconto, 0);

  async function aplicarCupom(codeToApply?: string | React.MouseEvent) {
    const sessionId = localStorage.getItem('zylumia_session_id')
    const code = (typeof codeToApply === 'string' ? codeToApply : cupom).trim().toUpperCase()
    if (!code || !sessionId) return
    
    setLoadingCupom(true)
    setErroCupom('')
    
    try {
      const r = await fetch(
        `${API}/api/cart/${sessionId}/coupon`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        }
      )
      const data = await r.json()
      
      if (data.success) {
        setCupomAplicado(data.coupon)
        
        const calculatedDiscount = data.discount || parseFloat((subtotal * ((data.coupon.discountPercent || 0) / 100)).toFixed(2)) || 0;
        setDesconto(calculatedDiscount)
        
        localStorage.setItem('zylumia_coupon', code)
        setErroCupom('')
      } else {
        setErroCupom(data.message || 'Cupom inválido.')
        setCupomAplicado(null)
        setDesconto(0)
      }
    } catch(e) {
      setErroCupom('Erro ao aplicar cupom.')
    } finally {
      setLoadingCupom(false)
    }
  }

  const handlePagarAgora = async () => {
    if (!nome || !sobrenome || !email || !endereco || !cidade || !estado || !cep) {
      setErro('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      if (stripeRef.current) {
        const result = await stripeRef.current.processPayment({
          customerEmail: email,
          customerName: `${nome} ${sobrenome}`,
          cartItems: cart.items,
          couponCode: localStorage.getItem('zylumia_coupon') || undefined,
          billingDetails: {
            nome, sobrenome, email, telefone,
            pais, endereco, complemento,
            cidade, estado, cep,
            address: {
              line1: endereco,
              line2: complemento,
              city: cidade,
              state: estado,
              postal_code: cep,
              country: pais,
            }
          }
        });

        if (result && result.success) {
          window.location.href = `/checkout/sucesso?order=${result.order?.id || 'PEDIDO'}`;
        }
      } else {
        throw new Error('Stripe não inicializado');
      }

    } catch (err: any) {
      console.error('Stripe erro:', err);
      setErro(err.message || 'Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '4px',
    fontWeight: 500
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#fff', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      fontWeight: 400,
      fontStyle: 'normal',
      color: 'rgb(0, 0, 0)',
      fontSize: '14px',
      lineHeight: '21px'
    }}>
      <style>{`
        .checkout-container {
          display: flex;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 100vh;
        }
        .left-col {
          flex: 1.1;
          padding: 40px 5%;
          border-right: 1px solid #e5e7eb;
        }
        .right-col {
          flex: 0.9;
          padding: 40px 5%;
          background: #f9fafb;
        }
        .desktop-only {
          display: block;
        }
        .mobile-only {
          display: none;
        }
        .mobile-header {
          display: none;
        }
        @media (max-width: 800px) {
          .checkout-container {
            flex-direction: column;
          }
          .left-col, .right-col {
            padding: 24px 20px;
            border-right: none;
          }
          .right-col {
            border-bottom: 1px solid #e5e7eb;
            order: 2;
          }
          .left-col {
            order: 3;
          }
          .mobile-header {
            display: block;
            order: 1;
            padding: 20px 20px 0 20px;
          }
          .left-col-header {
            display: none;
          }
          .left-col-paypal {
            display: none;
          }
          .left-col-divider {
            display: none;
          }
          .desktop-only {
            display: none;
          }
          .mobile-only {
            display: block;
          }
        }
      `}</style>

      {/* MOBILE HEADER - logo + breadcrumb + PayPal */}
      <div className="mobile-header">
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#7c3aed', margin: 0, fontFamily: 'Georgia, serif' }}>Zylumia</h1>
        </div>
        <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
          Carrinho &gt; <span style={{ color: '#374151', fontWeight: 500 }}>Informações</span> &gt; Pagamento
        </div>
        <div style={{ marginBottom: '8px' }}>
          <div style={{ textAlign: 'center', marginBottom: '12px', fontSize: '14px', color: '#374151' }}>
            Pagamento expresso
          </div>
          <ZylumiaPayPalButton
            produto={{
              name: cart.items.reduce((acc: number, item: any) => acc + (item.qty || item.quantity || 1), 0) === 1 ? cart.items[0].name : `${cart.items.reduce((acc: number, item: any) => acc + (item.qty || item.quantity || 1), 0)} itens (Zylumia)`,
              price: totalFinal
            }}
            customerName={`${nome} ${sobrenome}`}
            customerEmail={email}
            onSuccess={(order: any) => {
              localStorage.removeItem('zylumia_session_id');
              localStorage.removeItem('zylumia_coupon');
              window.location.href = `/checkout/sucesso?order=${order.id.substring(0,8).toUpperCase()}`;
            }}
            onError={() => alert('Erro no pagamento. Tente novamente.')}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '16px 0 0 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>OU</span>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
        </div>
      </div>

            <div className="checkout-container">
        {/* COLUNA ESQUERDA (formulário) */}
        <div className="left-col">
          <div className="left-col-header" style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#7c3aed', margin: 0, fontFamily: 'Georgia, serif' }}>Zylumia</h1>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
              Carrinho &gt; <span style={{ color: '#374151', fontWeight: 500 }}>Informações</span> &gt; Pagamento
            </div>
          </div>

          <div className="left-col-paypal" style={{ marginBottom: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '14px', color: '#374151' }}>
              Pagamento expresso
            </div>
            <ZylumiaPayPalButton
              produto={{
                name: cart.items.reduce((acc: number, item: any) => acc + (item.qty || item.quantity || 1), 0) === 1 ? cart.items[0].name : `${cart.items.reduce((acc: number, item: any) => acc + (item.qty || item.quantity || 1), 0)} itens (Zylumia)`,
                price: totalFinal
              }}
              customerName={`${nome} ${sobrenome}`}
              customerEmail={email}
              onSuccess={(order: any) => {
                localStorage.removeItem('zylumia_session_id');
                localStorage.removeItem('zylumia_coupon');
                window.location.href = `/checkout/sucesso?order=${order.id.substring(0,8).toUpperCase()}`;
              }}
              onError={() => alert('Erro no pagamento. Tente novamente.')}
            />
          </div>

          <div className="left-col-divider" style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>OU</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 500, margin: 0 }}>Contato</h2>
              <a href="#" style={{ color: '#7c3aed', fontSize: '14px', textDecoration: 'none' }}>Entrar</a>
            </div>
            <div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="E-mail"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', marginTop: 0 }}>Entrega</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <select 
                  value={pais} 
                  onChange={e => setPais(e.target.value)}
                  style={{...inputStyle, appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px top 50%', backgroundSize: '12px auto'}}
                >
                  <option value="BR">Brasil</option>
                  <option value="US">Estados Unidos</option>
                  <option value="PT">Portugal</option>
                  <option value="ES">Espanha</option>
                  <option value="FR">França</option>
                  <option value="DE">Alemanha</option>
                  <option value="IT">Itália</option>
                  <option value="GB">Reino Unido</option>
                  <option value="NL">Países Baixos</option>
                  <option value="BE">Bélgica</option>
                  <option value="CH">Suíça</option>
                  <option value="AT">Áustria</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Primeiro nome" style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <input type="text" value={sobrenome} onChange={e => setSobrenome(e.target.value)} placeholder="Sobrenome" style={inputStyle} />
                </div>
              </div>

              <div>
                <input type="text" value={endereco} onChange={e => setEndereco(e.target.value)} placeholder="Endereço" style={inputStyle} />
              </div>

              <div>
                <input type="text" value={complemento} onChange={e => setComplemento(e.target.value)} placeholder="Apartamento, suíte (opcional)" style={inputStyle} />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <input type="text" value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Cidade" style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <input type="text" value={estado} onChange={e => setEstado(e.target.value)} placeholder="Estado" style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <input type="text" value={cep} onChange={e => setCep(e.target.value)} placeholder="CEP" style={inputStyle} />
                </div>
              </div>

              <div>
                <input type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="Telefone (opcional)" style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', marginTop: 0 }}>Método de envio</h2>
            <div style={{ border: '1px solid #7c3aed', borderRadius: '8px', padding: '16px', background: '#f5f3ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '6px solid #7c3aed', background: '#fff' }}></div>
                <div>
                  <div style={{ fontWeight: 500 }}>Frete Padrão</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>7-15 dias úteis</div>
                </div>
              </div>
              <div style={{ fontWeight: 500 }}>Grátis</div>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '4px', marginTop: 0 }}>Pagamento</h2>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>Todas as transações são seguras e criptografadas.</div>
            
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ padding: '16px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 500 }}>Cartão de crédito</div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '32px', height: '20px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: '#1a1f36' }}>VISA</div>
                  <div style={{ width: '32px', height: '20px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: '#eb001b' }}>MC</div>
                </div>
              </div>
              <div style={{ padding: '16px', background: '#fff' }}>
                <StripeCheckout ref={stripeRef} />
              </div>
            </div>
          </div>

          {erro && (
            <div style={{ padding: '12px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>
              {erro}
            </div>
          )}

          <button 
            onClick={handlePagarAgora}
            disabled={loading}
            style={{
              width: '100%',
              height: '56px',
              background: '#7c3aed',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'Processando...' : `PAGAR AGORA — US$ ${totalFinal.toFixed(2)}`}
          </button>
          
          <div className="mobile-only">
            <ReviewsAndGuarantees />
          </div>
          
          <div style={{ marginTop: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '24px', display: 'flex', gap: '16px', fontSize: '12px', color: '#7c3aed', flexWrap: 'wrap' }}>
            <a href="/politica-de-reembolso" style={{ color: 'inherit', textDecoration: 'none' }}>Política de reembolso</a>
            <a href="/politica-de-frete" style={{ color: 'inherit', textDecoration: 'none' }}>Política de frete</a>
            <a href="/politica-de-privacidade" style={{ color: 'inherit', textDecoration: 'none' }}>Política de privacidade</a>
            <a href="/termos-de-servico" style={{ color: 'inherit', textDecoration: 'none' }}>Termos de serviço</a>
          </div>
        </div>

        {/* COLUNA DIREITA (resumo) */}
        <div className="right-col">
          <div style={{ position: 'sticky', top: '40px' }}>
            
            {cart.items.map((item: any, index: number) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '64px', height: '64px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                    <img 
                      src={item.image || ""} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <div style={{ position: 'absolute', top: '-8px', right: '-8px', width: '20px', height: '20px', background: 'rgba(114,114,114,0.9)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 500 }}>
                    {item.qty || item.quantity || 1}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, color: '#374151' }}>{item.name}</div>
                </div>
                <div style={{ fontWeight: 500, color: '#374151' }}>
                  US$ {(item.price * (item.qty || item.quantity || 1)).toFixed(2).replace('.', ',')}
                </div>
              </div>
            ))}

            <div style={{ marginBottom: '24px', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '24px 0' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Código de desconto"
                    value={cupom}
                    onChange={e => setCupom(e.target.value.toUpperCase())}
                    disabled={!!cupomAplicado}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                    }}
                  />
                  {!cupomAplicado ? (
                    <button
                      id="btn-aplicar-cupom"
                      onClick={aplicarCupom}
                      disabled={loadingCupom || !cupom}
                      style={{
                        background: '#7c3aed',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 20px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      {loadingCupom ? '...' : 'Aplicar'}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setCupomAplicado(null)
                        setDesconto(0)
                        setCupom('')
                        localStorage.removeItem('zylumia_coupon')
                      }}
                      style={{
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 20px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      Remover
                    </button>
                  )}
                </div>
                
                {cupomAplicado && (
                  <p style={{ color: '#10b981', fontSize: '13px', marginTop: '6px' }}>
                    ✅ {cupomAplicado.code} — {cupomAplicado.discountPercent}% OFF aplicado!
                  </p>
                )}
                
                {erroCupom && (
                  <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px' }}>
                    {erroCupom}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                <span>Subtotal</span>
                <span>US$ {subtotal.toFixed(2)}</span>
              </div>
              
              {desconto > 0 && (
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px',color:'#10b981',fontWeight:'500'}}>
                  <span>Desconto ({cupomAplicado?.discountPercent ? `${cupomAplicado.discountPercent}% OFF` : cupomAplicado?.code || 'Cupom'})</span>
                  <span>- US$ {desconto.toFixed(2)}</span>
                </div>
              )}
              
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                <span>Frete</span>
                <span style={{color:'#10b981'}}>Grátis</span>
              </div>
              
              <hr style={{border:'none',borderTop:'1px solid #e5e7eb',margin:'12px 0'}}/>
              
              <div style={{display:'flex',justifyContent:'space-between',fontWeight:'bold',fontSize:'20px'}}>
                <span>Total</span>
                <span>USD US$ {totalFinal.toFixed(2)}</span>
              </div>
            </div>


            {/* NEW CONTENT: Reviews and Guarantees */}
            <div className="desktop-only">
              <ReviewsAndGuarantees />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
