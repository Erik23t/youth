export default function HowItWorks() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-12 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-12 text-center md:text-left">Como funciona</h2>

          <div className="relative border-l-2 border-[#f3e8ff] ml-3 md:ml-4 space-y-10 pb-4">
            {/* Step 1 */}
            <div className="relative pl-8">
              <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#841dc5] border-4 border-[#f3e8ff]"></div>
              <span className="inline-block bg-[#841dc5] text-white px-3 py-1 rounded-full text-xs font-bold mb-3">Semana 1</span>
              <h3 className="text-lg font-medium text-[#24283b] mb-2">Penetrar e atingir o alvo</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                O extrato de Cyperus rotundus é absorvido profundamente pela pele, atingindo os folículos capilares diretamente na raiz, onde o crescimento do cabelo realmente começa.
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
              <span className="inline-block bg-[#841dc5] text-white px-3 py-1 rounded-full text-xs font-bold mb-3">1 Mês</span>
              <h3 className="text-lg font-medium text-[#24283b] mb-2">Suavizar e afinar</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                O uso contínuo enfraquece o crescimento de novos fios de cabelo, fazendo com que cada ciclo de crescimento produza cabelos mais finos, macios e menos visíveis com o tempo.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative pl-8">
              <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#841dc5] border-4 border-[#f3e8ff]"></div>
              <span className="inline-block bg-[#841dc5] text-white px-3 py-1 rounded-full text-xs font-bold mb-3">3 Meses</span>
              <h3 className="text-lg font-medium text-[#24283b] mb-2">Acalma e protege</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                O extrato de hortelã-pimenta proporciona alívio refrescante, enquanto o extrato de limão atenua manchas escuras causadas pela depilação. A vitamina E e o azeite de oliva hidratam e protegem profundamente a pele, prevenindo irritações e mantendo-a macia.
              </p>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2 rounded-lg overflow-hidden shadow-sm">
          <video
            src="/media/como-usar.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-cover aspect-square md:aspect-[4/5]"
          />
        </div>
      </div>
    </section>
  )
}
