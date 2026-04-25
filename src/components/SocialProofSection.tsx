export default function SocialProofSection() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-12 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4 leading-tight">
            Junte-se a mais de 100.000 pessoas que se libertaram.
          </h2>
          <p className="text-gray-600 mb-10 text-lg">
            Transformações reais de nossos clientes que escolheram um caminho melhor.
          </p>

          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-6">
                <div className="text-5xl font-light text-[#7e3fb0]">6x</div>
                <div>
                  <h3 className="text-xl text-gray-900 font-medium mb-1">Menos</h3>
                  <p className="text-gray-500 text-sm">Tempo gasto em rotinas diárias de depilação.</p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-6">
                <div className="text-5xl font-light text-[#7e3fb0]">55 mil+</div>
                <div>
                  <h3 className="text-xl text-gray-900 font-medium mb-1">Clientes</h3>
                  <p className="text-gray-500 text-sm">Jogaram fora suas lâminas de barbear e pinças para sempre.</p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start gap-6">
                <div className="text-5xl font-light text-[#7e3fb0]">93%</div>
                <div>
                  <h3 className="text-xl text-gray-900 font-medium mb-1">Relatório</h3>
                  <p className="text-gray-500 text-sm">Um crescimento mais suave e menos resistente em poucas semanas.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 italic">
            <div className="w-4 h-4 rounded-full bg-[#c299d8] text-white flex items-center justify-center not-italic font-bold text-[10px]">i</div>
            Com base em pesquisas e estudos internos com clientes.
          </div>
        </div>

        <div className="order-1 md:order-2">
          <img
            src=""
            alt="Mulheres sorrindo com Zylumia"
            width="600"
            height="600"
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  )
}
