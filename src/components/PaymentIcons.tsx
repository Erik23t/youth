import { Check } from 'lucide-react'

export default function PaymentIcons() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-6 text-sm text-gray-800 mb-6">
        <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#841dc5]" /> Garantia de reembolso de 365 dias</span>
        <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#841dc5]" /> Frete grátis*</span>
      </div>

      <div className="flex items-center justify-center gap-2 flex-wrap">
        <div className="w-10 h-6 bg-white rounded border border-gray-200 flex items-center justify-center">
          <div className="flex -space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 mix-blend-multiply"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mix-blend-multiply"></div>
          </div>
        </div>
        <div className="w-10 h-6 bg-white rounded border border-gray-200 flex items-center justify-center text-[10px] font-bold text-blue-800 italic">VISA</div>
        <div className="w-10 h-6 bg-blue-600 rounded border border-gray-200 flex items-center justify-center text-[8px] font-bold text-white">AMEX</div>
        <div className="w-10 h-6 bg-white rounded border border-gray-200 flex items-center justify-center text-[9px] font-bold text-black gap-0.5">
          <svg viewBox="0 0 384 512" className="w-2.5 h-2.5 fill-current"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
          Pay
        </div>
        <div className="w-10 h-6 bg-white rounded border border-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-600 gap-0.5">
          <span className="text-blue-500">G</span> Pay
        </div>
        <div className="w-10 h-6 bg-white rounded border border-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-800">DISCOVER</div>
        <div className="w-10 h-6 bg-[#ffb3c7] rounded border border-gray-200 flex items-center justify-center text-[9px] font-bold text-black">Klarna</div>
      </div>
    </div>
  )
}
