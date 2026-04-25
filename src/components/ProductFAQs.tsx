interface FAQ {
  q: string
  a: string
}

interface ProductFAQsProps {
  faqs: FAQ[]
  openFaq: number | null
  onToggle: (index: number) => void
}

export default function ProductFAQs({ faqs, openFaq, onToggle }: ProductFAQsProps) {
  return (
    <div className="border-t border-gray-200">
      {faqs.map((faq, index) => (
        <div key={index} className="border-b border-gray-200">
          <button
            className="w-full py-4 flex justify-between items-center text-left hover:text-gray-600 transition-colors"
            onClick={() => onToggle(index)}
          >
            <span className="text-[15px] font-semibold text-gray-800">{faq.q}</span>
            <span className="text-xl font-light text-gray-400 shrink-0 ml-4">{openFaq === index ? '−' : '+'}</span>
          </button>
          {openFaq === index && (
            <div className="pb-4 text-sm text-gray-500 leading-relaxed animate-in slide-in-from-top-2 fade-in duration-200">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
