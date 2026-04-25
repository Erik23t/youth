export default function DoctorSection() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-12 py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <img
            src="/media/doutora.webp"
            alt="Dermatologista"
            width="800"
            height="600"
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-8 leading-tight">
            Comprovado clinicamente. Recomendado por dermatologistas. Mais de 50.000 clientes satisfeitos.
          </h2>
          <div className="w-16 h-px bg-gray-300 mb-8"></div>
          <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
            <p>
              Nossa fórmula avançada de Cyperus Rotundus foi clinicamente estudada por suas propriedades inibidoras do crescimento capilar, tornando-a a alternativa natural que os profissionais de saúde realmente recomendam aos seus pacientes.
            </p>
            <p>
              Ao contrário de produtos químicos agressivos ou tratamentos a laser caros, o Zylumia atua suavemente com os processos naturais da sua pele para diminuir gradualmente o crescimento do pelo, sem irritação ou efeitos colaterais. Milhares de mulheres já descobriram uma pele mais macia e com intervalos maiores entre as sessões de depilação.
            </p>
            <p>
              Junte-se à crescente comunidade de mulheres confiantes que optaram por usar inibidores de pelos de nível profissional em casa.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
