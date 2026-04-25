import { Star, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

interface TestimonialsSectionProps {
  depoimentos: any[]
  onOpenVideo: (index: number) => void
}

export default function TestimonialsSection({ depoimentos, onOpenVideo }: TestimonialsSectionProps) {
  return (
    <section className="max-w-[1200px] mx-auto px-0 md:px-12 py-16 md:py-24">
      <div className="text-center mb-12 px-4 md:px-0 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 mb-6">
          <div className="flex gap-0.5">
            <Star className="w-4 h-4 fill-[#841dc5] text-[#841dc5]" />
            <Star className="w-4 h-4 fill-[#841dc5] text-[#841dc5]" />
            <Star className="w-4 h-4 fill-[#841dc5] text-[#841dc5]" />
            <Star className="w-4 h-4 fill-[#841dc5] text-[#841dc5]" />
            <Star className="w-4 h-4 fill-[#841dc5] text-[#841dc5]" />
          </div>
          <span className="text-sm text-gray-700">Avaliado em 4,8/5 com base em mais de 4700 avaliações.</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4 leading-tight">Da luta diária à liberdade eterna.</h2>
      </div>

      <div className="relative flex items-center">
        <button className="hidden md:block absolute left-0 -ml-8 md:-ml-12 z-10 p-2 text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-4 md:gap-6 w-full pb-4 md:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {depoimentos.map((review, idx) => (
            <div key={idx} className="flex flex-col h-full w-[85vw] md:w-auto shrink-0 snap-center md:snap-start px-4 md:px-0">
              <div
                className="w-full aspect-square overflow-hidden bg-black relative cursor-pointer group"
                onClick={() => onOpenVideo(idx)}
              >
                <video
                  src={review.video}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="border border-t-0 border-gray-200 p-6 flex flex-col flex-grow bg-white">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#7e3fb0] text-[#7e3fb0]" />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{review.name}</span>
                    {review.verified && (
                      <div className="flex items-center gap-1 bg-purple-50 rounded-full px-2 py-0.5">
                        <CheckCircle2 className="w-3 h-3 text-[#7e3fb0]" />
                        <span className="text-[10px] text-[#7e3fb0] font-medium uppercase tracking-wider">Comprador Verificado</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="hidden md:block absolute right-0 -mr-8 md:-mr-12 z-10 p-2 text-gray-400 hover:text-gray-900 transition-colors">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </section>
  )
}
