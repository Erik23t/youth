import { Star, CheckCircle2 } from 'lucide-react'

export default function FeaturedReview() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
      <div className="flex items-start gap-4">
        <img src="" alt="Valerie A." width="48" height="48" loading="lazy" decoding="async" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">Valerie A.</span>
            <CheckCircle2 className="w-4 h-4 text-[#841dc5]" />
            <div className="flex gap-0.5 ml-2">
              <Star className="w-3 h-3 fill-black text-black" />
              <Star className="w-3 h-3 fill-black text-black" />
              <Star className="w-3 h-3 fill-black text-black" />
              <Star className="w-3 h-3 fill-black text-black" />
              <Star className="w-3 h-3 fill-black text-black" />
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mt-2">
            Em apenas UMA semana de uso deste sérum, minha barba por fazer simplesmente parou de aparecer!! Por cerca de US$ 60, vale cada centavo! Gastei pelo menos 10 vezes mais em tratamentos que não precisarei mais.
          </p>
        </div>
      </div>
    </div>
  )
}
