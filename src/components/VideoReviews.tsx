import { Star, CheckCircle2 } from 'lucide-react'

export default function VideoReviews() {
  return (
    <section className="bg-white py-16 md:py-24 border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full mb-6">
            <div className="flex text-[#c084fc]">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="text-sm text-gray-700 font-medium">Avaliado em 4,8/5 com base em mais de 4700 avaliações.</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 tracking-tight">
            Da luta diária à liberdade eterna.
          </h2>
        </div>

        <div className="relative">
          <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-4 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Card 1 */}
            <div className="shrink-0 w-[85vw] md:w-auto snap-center md:snap-start bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col shadow-sm">
              <div className="aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden">
                <img src="" alt="Tran B" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <div className="flex text-[#c084fc]">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Tran B,</span>
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-[#c084fc] fill-current" />
                    <span className="text-[11px] text-gray-600 font-medium">Comprador Verificado</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Antes, meu lábio superior ficava com uma tonalidade escura poucas horas depois de fazer a barba. Agora, ele permanece liso por 4 a 5 dias facilmente, e nem faz dois meses que estou usando. O sérum tem uma agradável sensação refrescante ao ser aplicado. Interessante como essa antiga abordagem botânica funciona melhor do que todos os métodos modernos!
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="shrink-0 w-[85vw] md:w-auto snap-center md:snap-start bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col shadow-sm">
              <div className="aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden">
                <img src="" alt="Bri N" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <div className="flex text-[#c084fc]">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Bri N,</span>
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-[#c084fc] fill-current" />
                    <span className="text-[11px] text-gray-600 font-medium">Comprador Verificado</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  A síndrome dos ovários policísticos (SOP) fez com que crescessem muitos pelos grossos e resistentes no meu queixo. Tentei de tudo: laser, depilação com linha, você escolhe. Este sérum mudou a minha vida. Dois meses depois, preciso me depilar apenas uma vez a cada duas semanas, em vez de todas as manhãs. Os pelos que crescem agora são extremamente macios.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="shrink-0 w-[85vw] md:w-auto snap-center md:snap-start bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col shadow-sm">
              <div className="aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden">
                <img src="" alt="Dana A" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <div className="flex text-[#c084fc]">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Dana A,</span>
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-[#c084fc] fill-current" />
                    <span className="text-[11px] text-gray-600 font-medium">Comprador Verificado</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Minha irmã insistia para que eu experimentasse isso depois de ver meu ritual diário com a pinça. Achei que fosse só mais uma moda passageira, mas, nossa, funciona mesmo! Seis semanas depois, não preciso mais passar 20 minutos todas as manhãs caçando pelos no queixo. Os pelos mais grossos quase não crescem mais.
                </p>
              </div>
            </div>
          </div>

          {/* Indicadores de página no mobile */}
          <div className="flex justify-center gap-2 mt-4 md:hidden">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-[#841dc5] opacity-40" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
