import { useState } from 'react';

const steps = [
  {
    label: '1 Semana',
    title: 'Pelos e Pele Mais Macios',
    desc: 'O crescimento do pelo parece visivelmente mais macio e menos espetado ao toque. O sérum é absorvido rapidamente e a pele fica acalmada em vez de irritada após a aplicação.',
    group: 0,
  },
  {
    label: '2 Semanas',
    title: 'Crescimento Mais Fino',
    desc: 'Os novos pelos crescem visivelmente mais finos e claros. Você começa a espaçar suas sessões de depilação porque simplesmente há menos pelos teimosos para remover.',
    group: 0,
  },
  {
    label: '1 Mês',
    title: 'Pelos Quase Invisíveis',
    desc: 'Pelos faciais antes grossos e ásperos agora crescem finos e quase imperceptíveis. Muitas áreas permanecem lisas por dias ou semanas sem nenhuma manutenção.',
    group: 1,
  },
  {
    label: '3 Meses',
    title: 'Confiança Restaurada',
    desc: 'Áreas antes problemáticas produzem apenas pelos finos ocasionais que são facilmente gerenciados. Você ganha confiança em situações de proximidade sem a ansiedade da depilação diária.',
    group: 1,
  },
  {
    label: '6 Meses',
    title: 'Liberdade da Remoção Diária',
    desc: 'Os folículos capilares enfraqueceram significativamente. A maioria dos usuários mantém a pele lisa com esforço mínimo, finalmente livres do ciclo interminável de remoção diária.',
    group: 2,
  },
];

const groupImages = [
  'https://imagens.zylumia.com/cyperusrotundus.png',
  'https://imagens.zylumia.com/zylumia-cyperus%20rotundus.png',
  'https://imagens.zylumia.com/zylumia-serum-.png',
];

export default function JourneyTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const currentImage = groupImages[steps[activeStep].group];

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
          <div className="absolute left-[11px] md:left-[19px] top-2 bottom-2 w-0.5 bg-[#841dc5]/30"></div>

          {steps.map((step, i) => (
            <div
              key={i}
              className="relative mb-12 last:mb-0 cursor-pointer"
              onClick={() => setActiveStep(i)}
            >
              <div className={`absolute -left-8 md:-left-12 top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${activeStep === i ? 'bg-[#841dc5]' : 'bg-[#841dc5]/20'}`}>
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${activeStep === i ? 'bg-white' : 'bg-[#841dc5]'}`}></div>
              </div>
              <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 transition-all duration-300 ${activeStep === i ? 'bg-[#841dc5] text-white' : 'bg-[#841dc5]/10 text-[#841dc5]'}`}>
                {step.label}
              </div>
              <h3 className={`text-xl font-medium mb-2 transition-colors duration-300 ${activeStep === i ? 'text-[#841dc5]' : 'text-gray-900'}`}>{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Image */}
        <div className="rounded-2xl overflow-hidden shadow-xl aspect-square md:aspect-auto md:h-full sticky top-8">
          <img
            key={currentImage}
            src={currentImage}
            alt="Resultado Zylumia"
            className="w-full h-full object-cover transition-opacity duration-500"
          />
        </div>
      </div>
    </section>
  )
}
