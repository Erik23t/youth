import { useState, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
  name: string
  text: string
  rating: number
  date?: string
}

interface ReviewsCarouselProps {
  reviews: Review[]
}

export default function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 300 + 24 : 350 + 24;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="bg-[#f7f8f5] py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 md:px-12 mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
          Amado por mais de 100.000 pessoas <span className="italic">Clientes sem pelos</span>
        </h2>
        <p className="text-gray-600 mb-6">
          Experiências reais de clientes que se libertaram da depilação diária.
        </p>
        <div className="flex items-center justify-center gap-3 text-sm text-gray-700 bg-white inline-flex px-4 py-2 rounded-full shadow-sm">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-5 h-5 bg-[#841dc5] flex items-center justify-center rounded-sm">
                <Star className="w-3.5 h-3.5 text-white fill-current" />
              </div>
            ))}
          </div>
          <span>Excelente! 4.8/5 com base em mais de 4.700 avaliações de clientes.</span>
        </div>
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4">
        <div
          ref={carouselRef}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-8 pt-4 px-4 -mx-4 cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="snap-center shrink-0 w-[300px] md:w-[350px] bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <div key={i} className="w-6 h-6 bg-[#841dc5] flex items-center justify-center rounded-sm">
                    <Star className="w-4 h-4 text-white fill-current" />
                  </div>
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{review.text}</p>
              <div className="flex items-center gap-3 mt-auto pt-4">
                <div className="w-10 h-10 rounded-full bg-[#f3e8ff] text-[#841dc5] flex items-center justify-center font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <span className="font-medium text-sm text-gray-900">{review.name}</span>
                  {review.date && (
                    <div className="text-xs text-gray-600 mt-0.5">
                      Adquirido em {review.date}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => scrollCarousel('left')}
            className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#841dc5] hover:border-[#841dc5] transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {reviews.map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-gray-300" />
            ))}
          </div>
          <button
            onClick={() => scrollCarousel('right')}
            className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#841dc5] hover:border-[#841dc5] transition-colors"
            aria-label="Próximo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
