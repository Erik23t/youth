import { useState, useEffect } from 'react'

export function usePromoPopup() {
  const [showPromoPopup, setShowPromoPopup] = useState(false)

  useEffect(() => {
    // Não mostra se já se cadastrou ou já fechou antes
    const dismissed = localStorage.getItem('zylumia_popup_dismissed')
    const subscribed = localStorage.getItem('zylumia_popup_subscribed')
    if (dismissed || subscribed) return

    let triggered = false

    const show = () => {
      if (triggered) return
      triggered = true
      setShowPromoPopup(true)
    }

    // Dispara após 8 segundos
    const timer = setTimeout(show, 8000)

    // Exit intent — mouse saindo pelo topo (desktop)
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) show()
    }
    document.addEventListener('mouseleave', onMouseLeave)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  const closePopup = () => {
    setShowPromoPopup(false)
    localStorage.setItem('zylumia_popup_dismissed', '1')
  }

  const subscribePopup = () => {
    setShowPromoPopup(false)
    localStorage.setItem('zylumia_popup_subscribed', '1')
  }

  return { showPromoPopup, setShowPromoPopup, closePopup, subscribePopup }
}
