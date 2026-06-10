// v2 - video atualizado
export default function HowItWorks() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-12 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-12 text-center md:text-left">How It Works</h2>

          <div className="relative border-l-2 border-[#f3e8ff] ml-3 md:ml-4 space-y-10 pb-4">
            {/* Step 1 */}
            <div className="relative pl-8">
              <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#841dc5] border-4 border-[#f3e8ff]"></div>
              <span className="inline-block bg-[#841dc5] text-white px-3 py-1 rounded-full text-xs font-bold mb-3">Week 1</span>
              <h3 className="text-lg font-medium text-[#24283b] mb-2">Penetrate and target</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Cyperus rotundus extract is deeply absorbed into the skin, reaching hair follicles directly at the root, where hair growth actually begins.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative pl-8">
              <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#841dc5] border-4 border-[#f3e8ff]"></div>
              <span className="inline-block bg-[#841dc5] text-white px-3 py-1 rounded-full text-xs font-bold mb-3">Semanas 2-3</span>
              <h3 className="text-lg font-medium text-[#24283b] mb-2">Enfraquecer e interromper</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Os compostos ativos interferem naturalmente no ciclo de crescimento capilar, diminuindo gradualmente a atividade celular que torna o cabelo espesso e grosso.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative pl-8">
              <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#841dc5] border-4 border-[#f3e8ff]"></div>
              <span className="inline-block bg-[#841dc5] text-white px-3 py-1 rounded-full text-xs font-bold mb-3">1 Month</span>
              <h3 className="text-lg font-medium text-[#24283b] mb-2">Suavizar e afinar</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Continued use weakens new hair strand growth, making each growth cycle produce thinner, softer and less visible hair over time.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative pl-8">
              <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#841dc5] border-4 border-[#f3e8ff]"></div>
              <span className="inline-block bg-[#841dc5] text-white px-3 py-1 rounded-full text-xs font-bold mb-3">3 Months</span>
              <h3 className="text-lg font-medium text-[#24283b] mb-2">Acalma e protege</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Peppermint extract provides refreshing relief, while lemon extract reduces dark spots caused by hair removal. Vitamin E and olive oil deeply moisturize and protect the skin, preventing irritation and keeping it soft.
              </p>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2 rounded-lg overflow-hidden shadow-sm">
          <video
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            preload="auto"
            className="w-full h-auto object-cover aspect-square md:aspect-[4/5]"
            style={{ display: 'block', width: '100%' }}
            onLoadedData={e => { const v = e.target as HTMLVideoElement; v.play().catch(() => {}) }}
          >
            <source src="https://imagens.zylumia.com/videosteste.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  )
}
