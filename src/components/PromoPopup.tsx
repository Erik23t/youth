import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PromoPopupProps {
  show: boolean
  onClose: () => void
  promoEmail: string
  setPromoEmail: (v: string) => void
  promoLoading: boolean
  promoMessage: { text: string; type: 'success' | 'info' | 'error' } | null
  onSubmit: (e: React.FormEvent) => void
}

export default function PromoPopup({
  show, onClose, promoEmail, setPromoEmail, promoLoading, promoMessage, onSubmit,
}: PromoPopupProps) {
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutos

  useEffect(() => {
    if (!show) return
    setTimeLeft(600)
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [show])

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const ss = String(timeLeft % 60).padStart(2, '0')

  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md relative shadow-2xl animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          aria-label="Close promotion"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="px-10 py-12 text-center">
          {/* Timer */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="flex flex-col items-center">
              <div className="bg-[#841dc5] text-white text-2xl font-bold rounded-lg w-14 h-14 flex items-center justify-center font-mono">
                {mm}
              </div>
              <span className="text-xs text-gray-400 mt-1">min</span>
            </div>
            <div className="text-2xl font-bold text-[#841dc5] mb-4">:</div>
            <div className="flex flex-col items-center">
              <div className="bg-[#841dc5] text-white text-2xl font-bold rounded-lg w-14 h-14 flex items-center justify-center font-mono">
                {ss}
              </div>
              <span className="text-xs text-gray-400 mt-1">seg</span>
            </div>
          </div>

          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4 leading-tight">
            10% OFF na<br />First Purchase
          </h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Subscribe to our newsletter and get 10% off your first order, plus news and exclusive offers.
          </p>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              value={promoEmail}
              onChange={e => setPromoEmail(e.target.value)}
              placeholder="Your best email"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#841dc5] transition-colors"
            />
            <button
              type="submit"
              disabled={promoLoading}
              className="w-full py-3 bg-black text-white text-sm font-bold tracking-widest rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-60"
            >
              {promoLoading ? 'SENDING...' : 'GET MY DISCOUNT'}
            </button>
          </form>
          {promoMessage && (
            <p className={`mt-4 text-sm ${promoMessage.type === 'success' ? 'text-green-600' : promoMessage.type === 'error' ? 'text-red-500' : 'text-gray-500'}`}>
              {promoMessage.text}
            </p>
          )}
          <button
            onClick={onClose}
            className="mt-5 text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
          >
            No thanks, I prefer to pay full price.
          </button>
        </div>
      </div>
    </div>
  )
}
