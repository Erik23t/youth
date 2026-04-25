import React from 'react'
const beforeAfterTabs = [
  {
    label: "Semanas 1 a 4",
    title: "Pele mais macia e crescimento mais lento",
    subtitle: "O cabelo fica mais macio ao toque.",
    description: "No primeiro mês, os clientes notam que o cabelo que está crescendo novamente fica menos áspero e com menos pontas duplas. O sérum começa a agir no nível do folículo, embora as mudanças sejam mais sentidas do que visíveis.",
    imageAfter: "",
  },
  {
    label: "Semanas 4 a 8",
    title: "Redução visível na densidade",
    subtitle: "Os pelos começam a afinar visivelmente.",
    description: "Durante o segundo mês, a densidade do cabelo diminui notavelmente. Você precisará se depilar com menos frequência e notará que a pele permanece lisa por mais tempo entre as sessões.",
    imageAfter: "",
  },
  {
    label: "Semanas 8 a 14",
    title: "Resultados duradouros",
    subtitle: "Pele lisa e quase sem pelos.",
    description: "Após 8 a 14 semanas de uso contínuo, a maioria dos usuários experimenta uma redução drástica no crescimento do cabelo. Os poucos pelos que restam são muito finos e claros, tornando-os quase invisíveis.",
    imageAfter: "",
  },
]



export default function BeforeAfter() {
  const [activeTab, setActiveTab] = React.useState(0)
  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-12 py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-8 text-gray-900">De espesso a invisível</h2>

      {/* Tabs */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex border border-[#841dc5] rounded-sm overflow-hidden">
          {beforeAfterTabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === index
                  ? 'bg-[#841dc5] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              } ${index !== 0 ? 'border-l border-[#841dc5]' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Image Display */}
        <div className="relative rounded-lg overflow-hidden aspect-square select-none">
          <div className="absolute inset-0 w-full h-full">
            <img
              src={beforeAfterTabs[activeTab].imageAfter}
              alt={beforeAfterTabs[activeTab].label}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Label */}
          <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-sm backdrop-blur-sm z-10 pointer-events-none">
            {beforeAfterTabs[activeTab].label}
          </div>

          <div className="absolute bottom-4 left-0 right-0 text-center text-white text-[10px] opacity-80 z-10 pointer-events-none">
            *Os resultados individuais podem variar.
          </div>
        </div>

        {/* Content */}
        <div className="px-4 md:px-8">
          <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6 leading-tight">
            {beforeAfterTabs[activeTab].title}
          </h3>
          <p className="text-xl text-gray-600 mb-8 font-light">
            {beforeAfterTabs[activeTab].subtitle}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {beforeAfterTabs[activeTab].description}
          </p>
        </div>
      </div>
    </section>
  )
}
