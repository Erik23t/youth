import React from 'react'
interface FAQSectionProps {
  faqs: { q: string; a: string }[]
}

export default function FAQSection({ faqs}: FAQSectionProps) {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null)
  return (
    <section className="max-w-[1200px] mx-auto px-4 py-16 md:py-24">
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-10 text-gray-900">PERGUNTAS FREQUENTES</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden">
          <img
            src=""
            alt="FAQ Zylumia"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="border-t border-gray-100">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-100">
              <button
                className="w-full py-6 flex justify-between items-center text-left hover:text-gray-500 transition-colors"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span className="text-[15px] font-medium text-gray-800">{faq.q}</span>
                <span className="text-gray-400 text-xl font-light leading-none shrink-0 ml-4">{openFaq === index ? '−' : '+'}</span>
              </button>
              {openFaq === index && (
                <div className="pb-6 text-[14px] font-serif text-gray-500 italic leading-relaxed animate-in slide-in-from-top-2 fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
