import AnimatedCircularProgress from './AnimatedCircularProgress'

export default function ClinicalResults() {
  return (
    <section className="w-full bg-[#f4f5f0] py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-12">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-12">Resultados Clinicamente Comprovados</h2>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1 */}
          <div className="bg-white flex flex-col h-full shadow-sm">
            <div className="relative aspect-square w-full overflow-hidden">
              <img src="" alt="Crescimento Mais Lento" width="400" height="400" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 flex flex-col items-start">
                <AnimatedCircularProgress percentage={81} />
                <span className="text-white text-sm font-medium drop-shadow-md">redução na velocidade de crescimento</span>
              </div>
            </div>
            <div className="p-6 md:p-8 flex-grow">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Crescimento Mais Lento</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ao atingir o pelo na raiz, nosso sérum estende o tempo entre o crescimento visível, dando aos usuários períodos mais longos de pele lisa.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white flex flex-col h-full shadow-sm">
            <div className="relative aspect-square w-full overflow-hidden">
              <img src="" alt="Pelos Mais Finos e Macios" width="400" height="400" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 flex flex-col items-start">
                <AnimatedCircularProgress percentage={71} />
                <span className="text-white text-sm font-medium drop-shadow-md">redução na espessura do pelo</span>
              </div>
            </div>
            <div className="p-6 md:p-8 flex-grow">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Pelos Mais Finos e Macios</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                A análise microscópica de 300 amostras de pelos mostrou afinamento significativo dos fios individuais. Os participantes relataram que os pelos ficaram mais macios e menos perceptíveis ao toque.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white flex flex-col h-full shadow-sm">
            <div className="relative aspect-square w-full overflow-hidden">
              <img src="" alt="Menos Manutenção Diária" width="400" height="400" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 flex flex-col items-start">
                <AnimatedCircularProgress percentage={78} />
                <span className="text-white text-sm font-medium drop-shadow-md">redução na frequência de depilação</span>
              </div>
            </div>
            <div className="p-6 md:p-8 flex-grow">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Menos Manutenção Diária</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Os participantes passaram da remoção diária/a cada poucos dias para uma manutenção semanal ou menos frequente, reduzindo drasticamente o tempo gasto com pelos indesejados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
