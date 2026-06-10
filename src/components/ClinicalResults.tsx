import AnimatedCircularProgress from './AnimatedCircularProgress'

export default function ClinicalResults() {
  return (
    <section className="w-full bg-[#f4f5f0] py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 md:px-12">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-12">Clinically Proven Results</h2>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1 */}
          <div className="bg-white flex flex-col h-full shadow-sm">
            <div className="relative aspect-square w-full overflow-hidden">
              <img src="https://imagens.zylumia.com/cyperus-1.png" alt="Slower Growth" width="400" height="400" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 flex flex-col items-start">
                <AnimatedCircularProgress percentage={81} />
                <span className="text-white text-sm font-medium drop-shadow-md">reduction na velocidade de growth</span>
              </div>
            </div>
            <div className="p-6 md:p-8 flex-grow">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Slower Growth</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                By targeting hair at the root, our serum extends the time between visible growth, giving users longer periods of smooth skin.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white flex flex-col h-full shadow-sm">
            <div className="relative aspect-square w-full overflow-hidden">
              <img src="https://imagens.zylumia.com/cyperus-2.png" alt="Thinner and Softer Hair" width="400" height="400" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 flex flex-col items-start">
                <AnimatedCircularProgress percentage={71} />
                <span className="text-white text-sm font-medium drop-shadow-md">reduction na espessura do pelo</span>
              </div>
            </div>
            <div className="p-6 md:p-8 flex-grow">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Thinner and Softer Hair</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Microscopic analysis of 300 hair samples showed significant thinning of individual strands. Participants reported that hair became softer and less perceptible to the touch.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white flex flex-col h-full shadow-sm">
            <div className="relative aspect-square w-full overflow-hidden">
              <img src="https://imagens.zylumia.com/cyperus-3.png" alt="Less Daily Maintenance" width="400" height="400" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 flex flex-col items-start">
                <AnimatedCircularProgress percentage={78} />
                <span className="text-white text-sm font-medium drop-shadow-md">reduction in hair removal frequency</span>
              </div>
            </div>
            <div className="p-6 md:p-8 flex-grow">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Less Daily Maintenance</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Participants went from daily/every-few-days removal to weekly or less frequent maintenance, drastically reducing time spent on unwanted hair.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
