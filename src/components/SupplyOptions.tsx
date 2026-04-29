import React from 'react'
import { getCurrencyInfo, getSavedCountry } from '../lib/currency'
interface SupplyOptionsProps {
  supplyMonths: 1 | 3 | 6
  purchaseType: 'onetime' | 'subscribe'
  onSelectMonths: (months: 1 | 3 | 6) => void
  preco1mes: number
  preco3meses: number
  preco6meses: number
  mainImage: string
}

export default function SupplyOptions({
  supplyMonths,
  purchaseType,
  onSelectMonths,
  preco1mes,
  preco3meses,
  preco6meses,
  mainImage,
}: SupplyOptionsProps) {
  const [currencySymbol, setCurrencySymbol] = React.useState(() => getCurrencyInfo(getSavedCountry()).symbol)
  React.useEffect(() => {
    const handler = (e: CustomEvent) => setCurrencySymbol(getCurrencyInfo(e.detail.country).symbol)
    window.addEventListener('zylumia_country_changed', handler as EventListener)
    return () => window.removeEventListener('zylumia_country_changed', handler as EventListener)
  }, [])
  return (
    <div className="mb-8">
      <div className="space-y-4">
        {/* Option 1 */}
        <label
          className={`relative flex items-center justify-between p-4 md:p-5 border rounded-lg cursor-pointer transition-all ${supplyMonths === 1 ? 'border-2 border-[#841dc5] bg-white' : 'border border-gray-200 hover:border-gray-300'}`}
          onClick={() => onSelectMonths(1)}
        >
          <div className="flex items-center">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 ${supplyMonths === 1 ? 'border-[#841dc5]' : 'border-gray-300'}`}>
              {supplyMonths === 1 && <div className="w-2.5 h-2.5 bg-[#841dc5] rounded-full" />}
            </div>
            <img
              src={mainImage}
              alt="1 frasco"
              style={{ width: '65px', height: '65px', objectFit: 'cover', borderRadius: '8px', marginRight: '12px', flexShrink: 0 }}
            />
            <div>
              <div className="text-xs text-gray-500">1 frasco</div>
              <div className="text-base font-medium text-gray-800">Suprimento para 1 mês</div>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            {purchaseType === 'subscribe' ? (
              <>
                <div className="text-[#10b981] font-bold text-lg">{currencySymbol} {(preco1mes * 0.8).toFixed(2).replace('.', ',')}</div>
                <div className="text-[11px] text-gray-500 mt-0.5 line-through">{currencySymbol} {preco1mes.toFixed(2).replace('.', ',')}</div>
              </>
            ) : (
              <div className="text-gray-900 font-bold text-lg">{currencySymbol} {preco1mes.toFixed(2).replace('.', ',')}</div>
            )}
          </div>
        </label>

        {/* Option 2 */}
        <label
          className={`relative flex items-center justify-between p-4 md:p-5 border rounded-lg cursor-pointer transition-all ${supplyMonths === 3 ? 'border-2 border-[#841dc5] bg-purple-50/30' : 'border border-gray-200 hover:border-gray-300'}`}
          onClick={() => onSelectMonths(3)}
        >
          <div className="flex items-center">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 ${supplyMonths === 3 ? 'border-[#841dc5]' : 'border-gray-300'}`}>
              {supplyMonths === 3 && <div className="w-2.5 h-2.5 bg-[#841dc5] rounded-full" />}
            </div>
            <img
              src={mainImage}
              alt="2 frascos"
              style={{ width: '65px', height: '65px', objectFit: 'cover', borderRadius: '8px', marginRight: '12px', flexShrink: 0 }}
            />
            <div>
              <div className="text-xs text-gray-500">2 frascos</div>
              <div className="text-base font-medium text-gray-800">Suprimento para 3 meses</div>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            {purchaseType === 'subscribe' ? (
              <>
                <div className="text-[#10b981] font-bold text-lg">{currencySymbol} {(preco3meses * 0.8).toFixed(2).replace('.', ',')}</div>
                <div className="text-[11px] text-gray-600 mt-0.5 flex flex-col items-end">
                  <span className="line-through">{currencySymbol} {preco3meses.toFixed(2).replace('.', ',')}</span>
                  <span className="text-[#841dc5] font-medium">{currencySymbol} {((preco3meses * 0.8) / 3).toFixed(2).replace('.', ',')}/mês</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-gray-900 font-bold text-lg">{currencySymbol} {preco3meses.toFixed(2).replace('.', ',')}</div>
                <div className="text-[11px] text-gray-600 mt-0.5 flex flex-col items-end">
                  <span className="line-through">{currencySymbol} {(preco1mes * 3).toFixed(2).replace('.', ',')}</span>
                  <span className="text-[#841dc5] font-medium">{currencySymbol} {(preco3meses / 3).toFixed(2).replace('.', ',')}/mês</span>
                </div>
              </>
            )}
          </div>
          <span className="absolute -top-3 right-4 bg-[#841dc5] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wide shadow-sm">33% de desconto</span>
        </label>

        {/* Option 3 */}
        <label
          className={`relative flex items-center justify-between p-4 md:p-5 border rounded-lg cursor-pointer transition-all ${supplyMonths === 6 ? 'border-2 border-[#841dc5] bg-purple-50/30' : 'border border-gray-200 hover:border-gray-300'}`}
          onClick={() => onSelectMonths(6)}
        >
          <div className="flex items-center">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 shrink-0 ${supplyMonths === 6 ? 'border-[#841dc5]' : 'border-gray-300'}`}>
              {supplyMonths === 6 && <div className="w-2.5 h-2.5 bg-[#841dc5] rounded-full" />}
            </div>
            <img
              src={mainImage}
              alt="3 frascos"
              style={{ width: '65px', height: '65px', objectFit: 'cover', borderRadius: '8px', marginRight: '12px', flexShrink: 0 }}
            />
            <div>
              <div className="text-xs text-gray-500">3 frascos</div>
              <div className="text-base font-medium text-gray-800">Suprimento para 6 meses</div>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            {purchaseType === 'subscribe' ? (
              <>
                <div className="text-[#10b981] font-bold text-lg">{currencySymbol} {(preco6meses * 0.8).toFixed(2).replace('.', ',')}</div>
                <div className="text-[11px] text-gray-600 mt-0.5 flex flex-col items-end">
                  <span className="line-through">{currencySymbol} {preco6meses.toFixed(2).replace('.', ',')}</span>
                  <span className="text-[#841dc5] font-medium">{currencySymbol} {((preco6meses * 0.8) / 6).toFixed(2).replace('.', ',')}/mês</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-gray-900 font-bold text-lg">{currencySymbol} {preco6meses.toFixed(2).replace('.', ',')}</div>
                <div className="text-[11px] text-gray-600 mt-0.5 flex flex-col items-end">
                  <span className="line-through">{currencySymbol} {(preco1mes * 6).toFixed(2).replace('.', ',')}</span>
                  <span className="text-[#841dc5] font-medium">{currencySymbol} {(preco6meses / 6).toFixed(2).replace('.', ',')}/mês</span>
                </div>
              </>
            )}
          </div>
          <span className="absolute -top-3 right-4 bg-[#841dc5] text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wide shadow-sm">50% de desconto</span>
        </label>
      </div>
    </div>
  )
}
