import { useState, useEffect } from 'react'
export function useBanner(bannerImagesLength: number) {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => (prev + 1) % bannerImagesLength)
    }, 8000)
    return () => clearInterval(interval)
  }, [bannerImagesLength])
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  useEffect(() => {
    const interval = setInterval(() => { setShowVideo(prev => !prev) }, 10800000)
    return () => clearInterval(interval)
  }, [])
  return { currentBannerIndex, showVideo, isMobile }
}
