import { useState, useEffect } from 'react'
import { getCurrencyInfo, getSavedCountry } from '../lib/currency'
import { ShoppingCart, X, Truck, Trash2 } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  cartItems: any[]
  timeLeft: number
  couponInput: string
  setCouponInput: (v: string) => void
  appliedCoupon: string | null
  discountAmount: number
  couponMessage: string
  onApplyCoupon: () => void
  onRemoveItem: (name: string) => void
  formatTime: (s: number) => string
  onCheckout: () => void
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  timeLeft,
  appliedCoupon,
  discountAmount,
  onRemoveItem,
  formatTime,
  onCheckout,
}: CartSidebarProps) {
  const [currencySymbol, setCurrencySymbol] = useState(() => getCurrencyInfo(getSavedCountry()).symbol)
  useEffect(() => {
    const handler = (e: CustomEvent) => setCurrencySymbol(getCurrencyInfo(e.detail.country).symbol)
    window.addEventListener('zylumia_country_changed', handler as EventListener)
    return () => window.removeEventListener('zylumia_country_changed', handler as EventListener)
  }, [])
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold tracking-tight">SEU CARRINHO ({cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)})</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cartItems.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  Seu carrinho está reservado!
                </span>
                <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-1 rounded text-sm border border-red-100">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-red-500 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(timeLeft / (15 * 60)) * 100}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-gray-500 mt-2">Os itens no seu carrinho não estão garantidos. Finalize a compra agora para garantir o seu.</p>
            </div>
          )}
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <ShoppingCart className="w-12 h-12 opacity-20" />
              <p>Seu carrinho está vazio.</p>
              <button
                onClick={onClose}
                className="mt-4 border border-gray-300 text-gray-900 px-6 py-2 rounded-sm text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                CONTINUAR COMPRANDO
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-6">
                  <div className="w-24 h-24 bg-gray-50 rounded-sm overflow-hidden shrink-0">
                    <img src={item.image || ""} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold leading-tight pr-4">{item.name}</h3>
                        <button onClick={() => onRemoveItem(item.name)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.type}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border border-gray-200 rounded-sm px-3 py-1">
                        <span className="text-sm font-medium">{item.quantity || item.qty || 1}</span>
                      </div>
                      <p className="text-sm font-bold">{currencySymbol} {item.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between text-sm mb-2 text-gray-600">
              <span>Subtotal</span>
              <span>{currencySymbol} {cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || item.qty || 1)), 0).toFixed(2).replace('.', ',')}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-sm mb-2 text-green-600">
                <span>Desconto (10%)</span>
                <span>- {currencySymbol} {discountAmount.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm mb-4 text-gray-600">
              <span>Frete</span>
              <span className="flex items-center text-green-600 font-medium">
                <Truck className="w-4 h-4 mr-1.5" />
                Grátis
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg mb-6 pt-4 border-t border-gray-200 text-gray-900">
              <span>Total</span>
              <span>{currencySymbol} {(cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || item.qty || 1)), 0) - discountAmount).toFixed(2).replace('.', ',')}</span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-[#841dc5] hover:bg-[#6a179e] text-white py-4 rounded-sm text-base font-bold transition-colors tracking-wider"
            >
              FINALIZAR COMPRA — {currencySymbol} {(cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || item.qty || 1)), 0) - discountAmount).toFixed(2).replace('.', ',')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
