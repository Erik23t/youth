import { useState } from 'react'
import { Star, StarHalf, Sparkles, Check, Leaf } from 'lucide-react'
import SupplyOptions from './SupplyOptions'
import BonusBoxes from './BonusBoxes'
import PaymentIcons from './PaymentIcons'
import FeaturedReview from './FeaturedReview'
import ProductFAQs from './ProductFAQs'
import GuaranteeBanner from './GuaranteeBanner'

interface ProductDetailsProps {
  produto: any
  supplyMonths: 1 | 3 | 6
  purchaseType: 'onetime' | 'subscribe'
  isSubscribing: boolean
  onSelectMonths: (m: 1 | 3 | 6) => void
  onTogglePurchaseType: (type: 'onetime' | 'subscribe') => void
  onAddToCart: () => void
  onSubscribe: () => void
  getPrice: (m: 1 | 3 | 6) => number
  getOldPrice: (m: 1 | 3 | 6) => number
  mainImage: string
}

const productFaqs = [
  { q: "Benefícios", a: "O Zylumia™ foi clinicamente testado para proporcionar resultados reais e mensuráveis. Com uso contínuo, reduz o crescimento de novos pelos, enfraquece progressivamente os folículos capilares e prolonga o intervalo entre as sessões de depilação. Além disso, melhora a textura e a suavidade da pele, prevenindo irritações e pelos encravados. A fórmula é suave e adequada para todos os tipos de pele, inclusive peles sensíveis." },
  { q: "Como funciona o Zylumia™?", a: "O Zylumia™ age diretamente nos folículos capilares através do bloqueio localizado de andrógenos. Os compostos ativos inibem a enzima 5α-redutase e bloqueiam os receptores de andrógenos na raiz do pelo, reduzindo a produção de DHT e prevenindo a ativação do crescimento capilar. Esse mecanismo é eficaz em todas as cores de cabelo — incluindo fios brancos e loiros que o laser não consegue tratar — pois atua nas vias hormonais do folículo, e não no pigmento. O crescimento começa a diminuir em 1 a 2 semanas, com pelos progressivamente mais finos e esparsos com o uso contínuo." },
  { q: "Como usar o Zylumia™?", a: "Incorpore facilmente à sua rotina de depilação: remova os pelos indesejados com seu método preferido (lâmina, cera ou depilador elétrico), aplique de 3 a 5 gotas do serum na pele limpa e seca, massageie suavemente até completa absorção e reaplique duas vezes ao dia para melhores resultados. Desfrute de uma pele mais macia por muito mais tempo." },
  { q: "Onde posso aplicar?", a: "O Zylumia™ pode ser usado com segurança em todas as áreas do corpo, incluindo rosto, axilas, virilha, pernas e braços. Para uso facial, evite a área dos olhos e mucosas." },
  { q: "Quais são os ingredientes? (100% Vegano)", a: "O Zylumia™ é formulado com ingredientes botânicos naturais, 100% veganos e livres de crueldade animal. A base contém óleo de oliva nutritivo e vitamina E para hidratar e reparar a pele após a depilação, prevenindo irritações e pelos encravados. O extrato de hortelã-pimenta proporciona sensação refrescante e calmante, enquanto o extrato de limão ilumina e uniformiza o tom da pele naturalmente. O ativo principal, o Cyperus Rotundus, atua diretamente nos folículos para inibir o crescimento capilar de forma eficaz e segura." },
  { q: "Isso afeta meus hormônios?", a: "O Zylumia™ é seguro para mulheres com questões hormonais pois age exclusivamente de forma localizada — na superfície da pele e nos folículos capilares da área aplicada. O serum não entra na corrente sanguínea e não afeta os níveis hormonais do organismo. Isso o torna seguro para uso por mulheres com SOP, em tratamento hormonal ou durante a menopausa. Recomendamos consultar o médico antes do uso durante a gravidez e a amamentação." },
  { q: "É seguro durante a gravidez e amamentação?", a: "Recomendamos sempre consultar seu médico antes de introduzir qualquer novo produto na sua rotina durante a gravidez ou amamentação. O Zylumia™ é formulado com ingredientes naturais, mas a segurança do bebê é sempre a prioridade." },
  { q: "Quando e de onde será enviado?", a: "Todos os pedidos são processados em até 24 horas úteis. Enviamos diretamente dos nossos centros de distribuição locais para garantir uma entrega rápida (geralmente entre 7 a 15 dias úteis), com código de rastreio enviado para o seu e-mail." }
]

export default function ProductDetails({
  produto,
  supplyMonths,
  purchaseType,
  isSubscribing,
  onSelectMonths,
  onTogglePurchaseType,
  onAddToCart,
  onSubscribe,
}: ProductDetailsProps) {
  const [openProductFaq, setOpenProductFaq] = useState<number | null>(null)

  return (
    <div className="flex flex-col max-w-lg w-full mx-auto lg:mx-0">
      {/* Scarcity Badge */}
      <div className="flex items-center gap-2 mb-6 bg-red-50/80 text-red-600 px-4 py-2.5 rounded-md text-sm font-medium w-full border border-red-100">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
        ALTA DEMANDA: Restam apenas 14 unidades!
      </div>

      {/* Reviews */}
      <div className="flex items-center space-x-1 mb-4">
        <div className="flex text-[#e6b96e]">
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <Star className="w-4 h-4 fill-current" />
          <StarHalf className="w-4 h-4 fill-current" />
        </div>
        <span className="text-sm text-gray-600 ml-2 font-medium">(4.8 - 1356 avaliações)</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-medium text-gray-800 mb-4 leading-tight">
        {produto.nome || 'Sérum para a pele Cyperus Rotundus'}
      </h1>

      <p className="text-base text-gray-600 mb-6 leading-relaxed">
        {produto.descricao || 'Obtenha uma pele mais lisa e sem pelos com o único sérum botânico egípcio clinicamente comprovado para enfraquecer progressivamente os pelos indesejados.'}
      </p>

      <div className="bg-[#841dc5] text-white text-sm font-medium py-3 px-5 rounded-md flex items-center mb-8 shadow-sm">
        <Sparkles className="w-5 h-5 mr-3 shrink-0" />
        {produto.subtitulo || 'Combinado com hortelã-pimenta, cítricos e vitamina E.'}
      </div>

      {/* Subscription Toggle */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col space-y-3">
          <label
            className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${purchaseType === 'onetime' ? 'bg-white border border-gray-300 shadow-sm' : 'hover:bg-gray-100'}`}
            onClick={() => onTogglePurchaseType('onetime')}
          >
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 shrink-0 ${purchaseType === 'onetime' ? 'border-gray-800' : 'border-gray-400'}`}>
              {purchaseType === 'onetime' && <div className="w-2 h-2 bg-gray-800 rounded-full" />}
            </div>
            <span className="text-sm font-medium text-gray-800">Compra única</span>
          </label>

          <label
            className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${purchaseType === 'subscribe' ? 'bg-purple-50 border border-[#841dc5] shadow-sm' : 'hover:bg-gray-100'}`}
            onClick={() => onTogglePurchaseType('subscribe')}
          >
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 shrink-0 ${purchaseType === 'subscribe' ? 'border-[#841dc5]' : 'border-gray-400'}`}>
              {purchaseType === 'subscribe' && <div className="w-2 h-2 bg-[#841dc5] rounded-full" />}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 flex items-center">
                Assinatura mensal
                <span className="ml-2 bg-[#7c3aed] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">20% OFF todo mês</span>
              </span>
              <span className="text-xs text-gray-500 mt-0.5">Cancele quando quiser. Sem taxas ocultas.</span>
            </div>
          </label>
        </div>
      </div>

      {/* Supply Options */}
      <SupplyOptions
        supplyMonths={supplyMonths}
        purchaseType={purchaseType}
        onSelectMonths={onSelectMonths}
        preco1mes={produto.preco1mes}
        preco3meses={produto.preco3mes}
        preco6meses={produto.preco6mes}
        mainImage=""
      />

      {/* Bonus Boxes */}
      <BonusBoxes />

      {/* Add to Cart / Subscribe Button */}
      {purchaseType === 'subscribe' ? (
        <button
          onClick={onSubscribe}
          disabled={isSubscribing}
          className="w-full bg-[#10b981] hover:bg-[#059669] text-white text-sm font-bold py-4 rounded-sm transition-colors mb-4 tracking-wider disabled:opacity-50"
        >
          {isSubscribing ? 'PROCESSANDO...' : 'ASSINAR AGORA'}
        </button>
      ) : (
        <button
          onClick={onAddToCart}
          className="w-full bg-[#841dc5] hover:bg-[#6a179e] text-white text-sm font-bold py-4 rounded-sm transition-colors mb-4 tracking-wider"
        >
          ADICIONAR AO CARRINHO
        </button>
      )}

      {/* Product Info */}
      <div className="mt-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-800 mb-6">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#841dc5]" /> Garantia de reembolso de 365 dias</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#841dc5]" /> Frete grátis*</span>
          </div>
          <PaymentIcons />
        </div>

        <FeaturedReview />

        <ProductFAQs
          faqs={productFaqs}
          openFaq={openProductFaq}
          onToggle={(index) => setOpenProductFaq(openProductFaq === index ? null : index)}
        />

        <GuaranteeBanner />
      </div>

      {/* Bottom Icons */}
      <div className="flex justify-start space-x-8 mt-10 opacity-70">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-1">
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-600">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 flex items-center justify-center">
            <Leaf className="w-8 h-8 text-gray-600" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  )
}
