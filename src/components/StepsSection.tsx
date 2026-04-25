export default function StepsSection() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white pt-16 md:pt-24 pb-12 md:pb-16">
      <div className="max-w-[1200px] mx-auto px-4 md:px-12">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">Passos simples para uma pele mais macia</h2>
          <p className="text-gray-600">Sua nova rotina leva apenas 2 minutos, duas vezes ao dia.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
            <div className="aspect-square overflow-hidden">
              <img src="" alt="Passo 1" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 md:p-8 flex-grow flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#841dc5] text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                <h3 className="text-lg font-medium text-gray-900 mt-1">Prepare a sua pele.</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Remova os pelos existentes utilizando o seu método preferido. O Zylumia funciona melhor em pele limpa e sem pelos.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
            <div className="aspect-square overflow-hidden">
              <img src="" alt="Passo 2" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 md:p-8 flex-grow flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#841dc5] text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                <h3 className="text-lg font-medium text-gray-900 mt-1">Seque completamente com leves batidinhas.</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Aplique o sérum suavemente na área tratada, dando leves batidinhas até que esteja completamente seca. O sérum é melhor absorvido pela pele seca, para máxima eficácia.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
            <div className="aspect-square overflow-hidden">
              <img src="" alt="Passo 3" className="w-full h-full object-cover" />
            </div>
            <div className="p-6 md:p-8 flex-grow flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#841dc5] text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                <h3 className="text-lg font-medium text-gray-900 mt-1">Aplicar e massagear</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Aplique de 3 a 5 gotas na área afetada e massageie suavemente até completa absorção. Use duas vezes ao dia - de manhã e à noite - mesmo nos dias em que não houver remoção do produto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
