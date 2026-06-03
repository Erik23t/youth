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

      {/* Overlay com imagem responsiva — desktop/mobile */}
      <div className="absolute inset-0 z-20">
        {/* Desktop — fetchPriority high para LCP */}
        <img
          src="https://imagens.zylumia.com/zylumia.png"
          alt="Zylumia"
          width="1920"
          height="1080"
          fetchPriority="high"
          decoding="async"
          loading="eager"
          className="hidden md:block w-full h-full object-cover"
        />
        {/* Mobile — fetchPriority high, é o LCP real */}
        <img
          src="https://imagens.zylumia.com/zylumia-serum.png"
          alt="Zylumia"
          width="828"
          height="1792"
          fetchPriority="high"
          decoding="async"
          loading="eager"
          className="block md:hidden w-full h-full object-cover"
        />
      </div>

    </div>
  )
}
