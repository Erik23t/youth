import { useState, useEffect } from 'react'
import { getCurrencyInfo, getSavedCountry } from '../lib/currency'
import { X } from 'lucide-react';

interface StickyBarProps {
  show: boolean
  isDismissed: boolean
  onDismiss: () => void
  purchaseType: 'onetime' | 'subscribe'
  price: number
  productName?: string
  mainImage: string
  onAddToCart: () => void
  onSubscribe: () => void
  isSubscribing: boolean
}

export default function StickyBar({
  show,
  isDismissed,
  onDismiss,
  purchaseType,
  price,
  productName,
  mainImage,
  onAddToCart,
  onSubscribe,
  isSubscribing,
}: StickyBarProps) {
  const [currencySymbol, setCurrencySymbol] = useState(() => getCurrencyInfo(getSavedCountry()).symbol)
  useEffect(() => {
    const handler = (e: CustomEvent) => setCurrencySymbol(getCurrencyInfo(e.detail.country).symbol)
    window.addEventListener('zylumia_country_changed', handler as EventListener)
    return () => window.removeEventListener('zylumia_country_changed', handler as EventListener)
  }, [])
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 transition-transform duration-300 transform ${show && !isDismissed ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="max-w-[1200px] mx-auto px-3 md:px-4 py-2 md:py-3 flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          <img src={mainImage} alt="Zylumia" className="w-10 h-10 md:w-12 md:h-12 object-cover rounded border border-gray-200 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-gray-900 text-xs md:text-base truncate">
              <span className="md:hidden">{productName ? productName.split(' ')[0] + ' Serum' : 'Skin Serum'}</span>
              <span className="hidden md:inline">{productName || 'Zylumia™ - Sérum para Pele Cyperus Rotundus'}</span>
            </span>
            <span className="text-[10px] md:hidden text-gray-500 truncate">
              A partir de US$ {purchaseType === 'subscribe' ? ((price * 0.8) / 6).toFixed(2).replace('.', ',') : (price / 6).toFixed(2).replace('.', ',')}/mês
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {purchaseType === 'subscribe' ? (
            <button
              onClick={onSubscribe}
              disabled={isSubscribing}
              className="w-auto bg-black hover:bg-gray-900 text-white text-[10px] md:text-sm font-bold py-2 px-3 md:py-3 md:px-8 rounded-sm transition-all shadow-lg shadow-black/30 tracking-wider whitespace-nowrap disabled:opacity-50"
            >
              {isSubscribing ? 'PROCESSANDO...' : 'ASSINAR AGORA'}
            </button>
          ) : (
            <button
              onClick={onAddToCart}
              className="w-auto bg-black hover:bg-gray-900 text-white text-[10px] md:text-sm font-bold py-2 px-3 md:py-3 md:px-8 rounded-sm transition-all shadow-lg tracking-wider whitespace-nowrap"
            >
              ADICIONAR AO CARRINHO
            </button>
          )}
          <button
            onClick={onDismiss}
            className="p-1 text-gray-400 hover:text-gray-600"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
