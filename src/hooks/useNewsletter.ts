import React, { useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'https://backend.zylumia.com'

type Message = { text: string; type: 'success' | 'info' | 'error' } | null

export function useNewsletter(onPromoClose?: () => void) {
  const [promoEmail, setPromoEmail] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoMessage, setPromoMessage] = useState<Message>(null)

  const [footerEmail, setFooterEmail] = useState('')
  const [footerLoading, setFooterLoading] = useState(false)
  const [footerMessage, setFooterMessage] = useState<Message>(null)

  const submit = async (
    e: React.SyntheticEvent,
    email: string,
    setLoading: (v: boolean) => void,
    setMessage: (v: Message) => void,
    isPromo: boolean
  ) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch(`${API}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('zylumia_coupon', data.couponCode)
        setMessage({ text: `✅ Cupom ${data.couponCode} enviado ao seu e-mail! Use no checkout.`, type: 'success' })
        if (isPromo) setTimeout(() => onPromoClose?.(), 3000)
      } else if (data.message === 'E-mail já inscrito.') {
        if (data.couponCode) localStorage.setItem('zylumia_coupon', data.couponCode)
        setMessage({ text: `ℹ️ E-mail já cadastrado! Seu cupom: ${data.couponCode || 'ZYLUMIA-XXXXX'}`, type: 'info' })
      } else {
        setMessage({ text: '❌ Digite um e-mail válido.', type: 'error' })
      }
    } catch {
      setMessage({ text: '❌ Erro ao cadastrar. Tente novamente.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handlePromoSubmit = (e: React.SyntheticEvent) =>
    submit(e, promoEmail, setPromoLoading, setPromoMessage, true)

  const handleFooterSubmit = (e: React.SyntheticEvent) =>
    submit(e, footerEmail, setFooterLoading, setFooterMessage, false)

  return {
    promoEmail, setPromoEmail, promoLoading, promoMessage,
    footerEmail, setFooterEmail, footerLoading, footerMessage,
    handlePromoSubmit, handleFooterSubmit,
  }
}
