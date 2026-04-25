import { useState, useEffect } from 'react'
export function useStickyBar() {
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [isStickyBarDismissed, setIsStickyBarDismissed] = useState(false)
  const [showStats, setShowStats] = useState(true)
  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 800)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  useEffect(() => {
    const interval = setInterval(() => { setShowStats(prev => !prev) }, 30000)
    return () => clearInterval(interval)
  }, [])
  return { showStickyBar, isStickyBarDismissed, setIsStickyBarDismissed, showStats }
}
