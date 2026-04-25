interface HeroBannerProps {
  currentBannerIndex: number
  bannerImages: string[]
  onAddToCart: () => void
  heroTitle?: string
  heroSubtitle?: string
  heroBtnText?: string
  heroImage?: string
}

export default function HeroBanner({
  currentBannerIndex,
  bannerImages,
  onAddToCart,
  heroTitle,
  heroSubtitle,
  heroBtnText,
  heroImage,
}: HeroBannerProps) {
  return (
    <div id="lar" className="w-full h-[100vh] bg-gray-100 relative overflow-hidden">

      {/* Banner — imagem do Sanity ou carrossel de imagens */}
      {heroImage ? (
        <img
          src={heroImage}
          alt={heroTitle || 'Zylumia™ Banner'}
          width="1920"
          height="1080"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
      ) : (
        bannerImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Zylumia™ Banner ${index + 1}`}
            width="1920"
            height="1080"
            fetchPriority={index === 0 ? "high" : "low"}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] ease-in-out ${
              index === currentBannerIndex
                ? 'opacity-100 scale-100 z-10'
                : 'opacity-0 scale-110 z-0'
            }`}
          />
        ))
      )}

      {/* Gradient overlay + CTA */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col items-center justify-center z-20">
        <h2 className="text-white text-4xl md:text-6xl font-serif font-bold tracking-tight text-center px-4 drop-shadow-xl mb-4 pointer-events-none">
          {heroTitle || 'Pele Lisa e Radiante'}
        </h2>
        {heroSubtitle && (
          <p className="text-white text-xl md:text-2xl text-center px-4 drop-shadow-md mb-8 pointer-events-none">
            {heroSubtitle}
          </p>
        )}
        <button
          onClick={() => { window.location.href = '/checkout?plano=1'; }}
          className="bg-black hover:bg-gray-900 text-white px-12 py-5 text-sm md:text-base font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,0,0,0.4)] rounded-sm"
        >
          {heroBtnText || 'Comprar Agora'}
        </button>
      </div>

    </div>
  )
}
