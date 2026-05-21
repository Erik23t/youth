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

      {/* Overlay com logo centralizada */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <img
          src="https://imagens.zylumia.com/zylumia.png"
          alt="Zylumia"
          className="w-48 md:w-72 lg:w-96 object-contain drop-shadow-2xl"
        />
      </div>

    </div>
  )
}
