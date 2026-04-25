import { X } from 'lucide-react';
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
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md relative shadow-2xl animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          aria-label="Fechar promoção"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="px-10 py-12 text-center">
          <p className="text-xs font-semibold tracking-widest text-[#841dc5] uppercase mb-3">Oferta exclusiva</p>
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4 leading-tight">
            10% OFF na<br />Primeira Compra
          </h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Assine nossa newsletter e receba 10% de desconto no seu primeiro pedido, além de novidades e ofertas exclusivas.
          </p>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              value={promoEmail}
              onChange={e => setPromoEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#841dc5] transition-colors"
            />
            <button
              type="submit"
              disabled={promoLoading}
              className="w-full py-3 bg-black text-white text-sm font-bold tracking-widest rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-60"
            >
              {promoLoading ? 'ENVIANDO...' : 'QUERO MEU DESCONTO'}
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
            Não, obrigado. Prefiro pagar o preço cheio.
          </button>
        </div>
      </div>
    </div>
  )
}
