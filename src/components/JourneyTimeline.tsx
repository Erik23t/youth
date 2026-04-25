export default function JourneyTimeline() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-12 py-16 md:py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
          Sua Jornada para uma Pele <span className="italic">Livre de Pelos</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          O que você pode esperar com o uso diário consistente do nosso sérum botânico.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Timeline */}
        <div className="relative pl-8 md:pl-12">
          {/* Vertical Line */}
          <div className="absolute left-[11px] md:left-[19px] top-2 bottom-2 w-0.5 bg-[#841dc5]/30"></div>

          {/* Step 1 */}
          <div className="relative mb-12 last:mb-0">
            <div className="absolute -left-8 md:-left-12 top-1 w-6 h-6 rounded-full bg-[#841dc5]/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#841dc5]"></div>
            </div>
            <div className="inline-block bg-[#841dc5] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              1 Semana
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Pelos e Pele Mais Macios</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              O crescimento do pelo parece visivelmente mais macio e menos espetado ao toque. O sérum é absorvido rapidamente e a pele fica acalmada em vez de irritada após a aplicação.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative mb-12 last:mb-0">
            <div className="absolute -left-8 md:-left-12 top-1 w-6 h-6 rounded-full bg-[#841dc5]/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#841dc5]"></div>
            </div>
            <div className="inline-block bg-[#841dc5] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              2 Semanas
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Crescimento Mais Fino</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Os novos pelos crescem visivelmente mais finos e claros. Você começa a espaçar suas sessões de depilação porque simplesmente há menos pelos teimosos para remover.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative mb-12 last:mb-0">
            <div className="absolute -left-8 md:-left-12 top-1 w-6 h-6 rounded-full bg-[#841dc5]/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#841dc5]"></div>
            </div>
            <div className="inline-block bg-[#841dc5] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              1 Mês
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Pelos Quase Invisíveis</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Pelos faciais antes grossos e ásperos agora crescem finos e quase imperceptíveis. Muitas áreas permanecem lisas por dias ou semanas sem nenhuma manutenção.
            </p>
          </div>

          {/* Step 4 */}
          <div className="relative mb-12 last:mb-0">
            <div className="absolute -left-8 md:-left-12 top-1 w-6 h-6 rounded-full bg-[#841dc5]/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#841dc5]"></div>
            </div>
            <div className="inline-block bg-[#841dc5] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              3 Meses
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Confiança Restaurada</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Áreas antes problemáticas produzem apenas pelos finos ocasionais que são facilmente gerenciados. Você ganha confiança em situações de proximidade sem a ansiedade da depilação diária.
            </p>
          </div>

          {/* Step 5 */}
          <div className="relative mb-12 last:mb-0">
            <div className="absolute -left-8 md:-left-12 top-1 w-6 h-6 rounded-full bg-[#841dc5]/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#841dc5]"></div>
            </div>
            <div className="inline-block bg-[#841dc5] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
              6 Meses
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Liberdade da Remoção Diária</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Os folículos capilares enfraqueceram significativamente. A maioria dos usuários mantém a pele lisa com esforço mínimo, finalmente livres do ciclo interminável de remoção diária.
            </p>
          </div>
        </div>

        {/* Image */}
        <div className="rounded-2xl overflow-hidden shadow-xl aspect-square md:aspect-auto md:h-full">
          <img
            src=""
            alt="Mulheres com pele lisa"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
