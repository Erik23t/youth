import { useState, useRef, useCallback } from 'react';

interface ProductGalleryProps {
  mainImage: string
  images: string[]
  onSelectImage: (img: string) => void
}

export default function ProductGallery({ mainImage, images, onSelectImage }: ProductGalleryProps) {
  const currentIdx = images.indexOf(mainImage)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const goNext = useCallback(() => {
    const next = (currentIdx + 1) % images.length
    onSelectImage(images[next])
  }, [currentIdx, images, onSelectImage])

  const goPrev = useCallback(() => {
    const prev = (currentIdx - 1 + images.length) % images.length
    onSelectImage(images[prev])
  }, [currentIdx, images, onSelectImage])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    // Só swipe horizontal (ignora scroll vertical)
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? goNext() : goPrev()
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    <div className="flex flex-col items-center lg:items-end w-full">

      {/* Imagem principal com swipe mobile */}
      <div
        className="w-full max-w-lg aspect-square mb-4 overflow-hidden bg-gray-50 relative select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={mainImage}
          alt="Zylumia™ Skin Serum"
          className="w-full h-full object-cover mix-blend-multiply transition-all duration-300"
          draggable={false}
        />

        {/* Setas mobile */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous image"
              className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow text-gray-700 hover:bg-white transition-colors z-10"
            >
              ‹
            </button>
            <button
              onClick={goNext}
              aria-label="Next image"
              className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow text-gray-700 hover:bg-white transition-colors z-10"
            >
              ›
            </button>

            {/* Indicador de ponto mobile */}
            <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => onSelectImage(images[i])}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIdx ? 'bg-[#841dc5] w-3' : 'bg-gray-300'}`}
                  aria-label={`Ir para imagem ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails (só desktop) */}
      <div className="hidden md:flex justify-between w-full max-w-lg gap-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => onSelectImage(img)}
            className={`flex-1 aspect-square border-2 p-0.5 overflow-hidden transition-all bg-gray-50 ${
              mainImage === img ? 'border-[#841dc5]' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover mix-blend-multiply"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Thumbnails mobile (scroll horizontal) */}
      <div className="md:hidden flex gap-2 w-full overflow-x-auto pb-1 snap-x snap-mandatory">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => onSelectImage(img)}
            className={`flex-shrink-0 w-16 h-16 border-2 p-0.5 overflow-hidden snap-start bg-gray-50 transition-all ${
              mainImage === img ? 'border-[#841dc5]' : 'border-transparent opacity-60'
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover mix-blend-multiply"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
