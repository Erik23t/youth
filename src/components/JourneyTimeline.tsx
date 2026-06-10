import { useState } from 'react';

const steps = [
  {
    label: '1 Semana',
    title: 'Pelos e Pele Mais Macios',
    desc: 'Hair growth looks visibly softer and less prickly to the touch. The serum absorbs quickly and skin feels soothed rather than irritated after application.',
    group: 0,
  },
  {
    label: '2 Semanas',
    title: 'Crescimento Mais Fino',
    desc: 'New hair grows visibly thinner and lighter. You start spacing out your hair removal sessions because there are simply fewer stubborn hairs to remove.',
    group: 0,
  },
  {
    label: '1 Month',
    title: 'Nearly Invisible Hair',
    desc: 'Facial hair that was once thick and coarse now grows thin and almost imperceptible. Many areas stay smooth for days or weeks without any maintenance.',
    group: 1,
  },
  {
    label: '3 Meses',
    title: 'Confidence Restored',
    desc: 'Previously problematic areas produce only occasional fine hairs that are easily managed. You gain confidence in close situations without the anxiety of daily hair removal.',
    group: 1,
  },
  {
    label: '6 Meses',
    title: 'Freedom From Daily Removal',
    desc: 'Hair follicles have significantly weakened. Most users maintain smooth skin with minimal effort, finally free from the endless cycle of daily removal.',
    group: 2,
  },
];

const groupImages = [
  'https://imagens.zylumia.com/zylumia-serum-cyperus.png',
  'https://imagens.zylumia.com/zylumia-serum-cyperus.png',
  'https://imagens.zylumia.com/zylumia-serum-cyperus.png',
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
          What you can expect with consistent daily use of our botanical serum.
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
           loading="lazy" />
        </div>
      </div>
    </section>
  )
}
