interface ProductGalleryProps {
  mainImage: string
  images: string[]
  onSelectImage: (img: string) => void
}

export default function ProductGallery({ mainImage, images, onSelectImage }: ProductGalleryProps) {
  return (
    <div className="flex flex-col items-center lg:items-end w-full">
      {/* Main Image */}
      <div className="w-full max-w-lg aspect-square mb-4 overflow-hidden bg-gray-50">
        <img
          src={mainImage}
          alt="Youth Bio-Collagen Overnight Chest Mask"
          className="w-full h-full object-cover mix-blend-multiply transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex justify-between w-full max-w-lg gap-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => onSelectImage(img)}
            className={`flex-1 aspect-square border-2 p-0.5 overflow-hidden transition-all bg-gray-50 ${mainImage === img ? 'border-[#841dc5]' : 'border-transparent opacity-60 hover:opacity-100'}`}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover mix-blend-multiply" />
          </button>
        ))}
      </div>
    </div>
  )
}
