import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'https://zylumia-backend-kmbrxbidkq-uc.a.run.app'

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

export default function Contato() {
  const [user, setUser] = useState(null)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    const u = localStorage.getItem('zylumia_user')
    if (u) setUser(JSON.parse(u))
  }, [])

  async function handleEnviar(e) {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true); setErro('')
    try {
      const token = localStorage.getItem('zylumia_token')
      const r = await fetch(`${API}/api/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, credentials: 'include', body: JSON.stringify({ subject, message }) })
      const data = await r.json()
      if (data.success) { setEnviado(true); setSubject(''); setMessage(''); setTimeout(() => setEnviado(false), 3000) }
      else setErro(data.message || 'Erro ao enviar.')
    } catch(e) { setErro('Erro de conexao.') }
    finally { setLoading(false) }
  }

  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#faf9ff' }}>
      <PageHeader />
      <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
          <h2 style={{ color: '#7c3aed', marginBottom: '8px' }}>Fale Conosco</h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>Faca login para enviar uma mensagem para nossa equipe.</p>
          <a href="/" style={{ display: 'inline-block', background: '#7c3aed', color: '#fff', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>FAZER LOGIN</a>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#faf9ff' }}>
      <PageHeader />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px', fontFamily: 'Georgia, serif' }}>
        <h1 style={{ color: '#7c3aed', fontSize: '28px', marginBottom: '8px' }}>💬 Fale Conosco</h1>
        <p style={{ color: '#6b7280', marginBottom: '40px' }}>Ola, {user.name || user.email}! Respondemos em ate 24h.</p>
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '32px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '20px', color: '#111' }}>Nova Mensagem</h2>
          <form onSubmit={handleEnviar}>
            <div style={{ marginBottom: '16px' }}>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Assunto (opcional)" style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Como podemos ajudar?" required rows={4} style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            {erro && <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '12px' }}>{erro}</p>}
            {enviado && <p style={{ color: '#10b981', fontSize: '14px', marginBottom: '12px' }}>Mensagem enviada!</p>}
            <button type="submit" disabled={loading || !message.trim()} style={{ background: loading ? '#9ca3af' : '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', padding: '14px 32px', fontSize: '16px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Enviando...' : 'ENVIAR'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
