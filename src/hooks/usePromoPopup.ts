import { useState, useEffect } from 'react'
export function usePromoPopup() {
  const [showPromoPopup, setShowPromoPopup] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setShowPromoPopup(true), 30000)
    return () => clearTimeout(timer)
  }, [])
  return { showPromoPopup, setShowPromoPopup }
}
