import AnimatedNumber from './AnimatedNumber';

interface StatsSectionProps {
  showStats: boolean
}

export default function StatsSection({ showStats }: StatsSectionProps) {
  return (
    <>
      {/* Animated Stats Section */}
      <section
        className="bg-[#fdfcfb] py-16 border-b border-gray-100 transition-all duration-700 ease-in-out"
        style={{
          opacity: showStats ? 1 : 0,
          transform: showStats ? 'translateY(0)' : 'translateY(-16px)',
          pointerEvents: showStats ? 'auto' : 'none',
          maxHeight: showStats ? '400px' : '0',
          overflow: 'hidden',
          paddingTop: showStats ? undefined : '0',
          paddingBottom: showStats ? undefined : '0',
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="flex flex-col items-center pt-8 md:pt-0">
              <div className="text-5xl md:text-6xl font-serif font-bold text-[#841dc5] mb-4">
                <AnimatedNumber end={6} suffix="x" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Menos</h3>
              <p className="text-gray-600 text-sm max-w-[250px] mx-auto">
                Tempo gasto em rotinas diárias de depilação.
              </p>
            </div>
            <div className="flex flex-col items-center pt-8 md:pt-0">
              <div className="text-5xl md:text-6xl font-serif font-bold text-[#841dc5] mb-4">
                <AnimatedNumber end={55} suffix=" mil+" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Clientes</h3>
              <p className="text-gray-600 text-sm max-w-[250px] mx-auto">
                Jogaram fora suas lâminas de barbear e pinças para sempre.
              </p>
            </div>
            <div className="flex flex-col items-center pt-8 md:pt-0">
              <div className="text-5xl md:text-6xl font-serif font-bold text-[#841dc5] mb-4">
                <AnimatedNumber end={93} suffix="%" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Relatório</h3>
              <p className="text-gray-600 text-sm max-w-[250px] mx-auto">
                Um crescimento mais suave e menos resistente em poucas semanas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Bar (visible when stats are hidden) */}
      <section
        className="bg-[#841dc5] transition-all duration-700 ease-in-out overflow-hidden"
        style={{
          opacity: showStats ? 0 : 1,
          maxHeight: showStats ? '0' : '100px',
          paddingTop: showStats ? '0' : undefined,
          paddingBottom: showStats ? '0' : undefined,
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 py-5 flex items-center justify-center gap-8 md:gap-16 flex-wrap">
          {['Forbes', 'PopSugar', 'Vogue', 'Byrdie'].map(brand => (
            <span key={brand} className="text-white/80 font-serif font-bold text-lg md:text-xl tracking-widest uppercase">
              {brand}
            </span>
          ))}
        </div>
      </section>
    </>
  )
}
