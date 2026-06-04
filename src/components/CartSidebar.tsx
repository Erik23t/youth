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

        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length > 0 && (
            <div className="mb-3">
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
              <p className="text-[11px] text-gray-500 mt-1">Os itens no seu carrinho não estão garantidos. Finalize agora.</p>
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
            <div className="space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-3 border-b border-gray-100 pb-3">
                  <div className="w-16 h-16 bg-gray-50 rounded-sm overflow-hidden shrink-0">
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
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border border-gray-200 rounded-sm px-3 py-1">
                        <span className="text-sm font-medium">{item.quantity || item.qty || 1}</span>
                      </div>
                      <p className="text-sm font-bold">$ {item.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between text-sm mb-2 text-gray-600">
              <span>Subtotal</span>
              <span>US$ {cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || item.qty || 1)), 0).toFixed(2).replace('.', ',')}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-sm mb-2 text-green-600">
                <span>Desconto (10%)</span>
                <span>- US$ {discountAmount.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm mb-4 text-gray-600">
              <span>Frete</span>
              <span className="flex items-center text-green-600 font-medium">
                <Truck className="w-4 h-4 mr-1.5" />
                Grátis
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg mb-3 pt-3 border-t border-gray-200 text-gray-900">
              <span>Total</span>
              <span>US$ {(cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || item.qty || 1)), 0) - discountAmount).toFixed(2).replace('.', ',')}</span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-[#841dc5] hover:bg-[#6a179e] text-white py-4 rounded-sm text-base font-bold transition-colors tracking-wider"
            >
              FINALIZAR COMPRA — US$ {(cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || item.qty || 1)), 0) - discountAmount).toFixed(2).replace('.', ',')}
            </button>

            {/* 365-Day Guarantee + Payments — layout compacto */}
            <div style={{ marginTop: '8px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '6px' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>365-Day Money Back Guarantee</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
                {/* VISA */}
                <svg width="36" height="22" viewBox="0 0 38 24" style={{ border: '1px solid #e5e7eb', borderRadius: '3px', padding: '1px' }}><rect width="38" height="24" fill="white" rx="3"/><text x="4" y="17" fontFamily="Arial" fontWeight="bold" fontSize="13" fill="#1a1f71">VISA</text></svg>
                {/* Mastercard */}
                <svg width="36" height="22" viewBox="0 0 38 24" style={{ border: '1px solid #e5e7eb', borderRadius: '3px' }}><rect width="38" height="24" fill="white" rx="3"/><circle cx="14" cy="12" r="8" fill="#EB001B"/><circle cx="24" cy="12" r="8" fill="#F79E1B"/><path d="M19 6.8a8 8 0 0 1 0 10.4A8 8 0 0 1 19 6.8z" fill="#FF5F00"/></svg>
                {/* Amex */}
                <svg width="36" height="22" viewBox="0 0 38 24" style={{ border: '1px solid #e5e7eb', borderRadius: '3px', padding: '1px' }}><rect width="38" height="24" fill="#2557D6" rx="3"/><text x="3" y="17" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="white">AMEX</text></svg>
                {/* Apple Pay */}
                <svg width="36" height="22" viewBox="0 0 38 24" style={{ border: '1px solid #e5e7eb', borderRadius: '3px', padding: '1px' }}><rect width="38" height="24" fill="white" rx="3"/><text x="3" y="16" fontFamily="Arial" fontWeight="bold" fontSize="9" fill="black">Apple</text><text x="3" y="22" fontFamily="Arial" fontSize="8" fill="black">Pay</text></svg>
                {/* Google Pay */}
                <svg width="36" height="22" viewBox="0 0 38 24" style={{ border: '1px solid #e5e7eb', borderRadius: '3px', padding: '1px' }}><rect width="38" height="24" fill="white" rx="3"/><text x="2" y="15" fontFamily="Arial" fontWeight="bold" fontSize="8" fill="#4285F4">G</text><text x="9" y="15" fontFamily="Arial" fontSize="8" fill="#333">Pay</text></svg>
                {/* PayPal */}
                <svg width="36" height="22" viewBox="0 0 38 24" style={{ border: '1px solid #e5e7eb', borderRadius: '3px', padding: '1px' }}><rect width="38" height="24" fill="white" rx="3"/><text x="2" y="17" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="#003087">Pay</text><text x="19" y="17" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="#009CDE">Pal</text></svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
