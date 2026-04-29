import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCart } from './hooks/useCart';
import { useAuth } from './hooks/useAuth';
import { useNewsletter } from './hooks/useNewsletter';
import { useBanner } from './hooks/useBanner';
import { useStickyBar } from './hooks/useStickyBar';
import { usePromoPopup } from './hooks/usePromoPopup';
import { useProductPrice } from './hooks/useProductPrice';
import { useSanity } from './hooks/useSanity';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroBanner from './components/HeroBanner';
import StatsSection from './components/StatsSection';
import ProductGallery from './components/ProductGallery';
import ProductDetails from './components/ProductDetails';
import VideoReviews from './components/VideoReviews';
import JourneyTimeline from './components/JourneyTimeline';
import TestimonialsSection from './components/TestimonialsSection';
import ClinicalResults from './components/ClinicalResults';
import HowItWorks from './components/HowItWorks';
import BeforeAfter from './components/BeforeAfter';
import SocialProofSection from './components/SocialProofSection';
import StepsSection from './components/StepsSection';
import DoctorSection from './components/DoctorSection';
import ReviewsCarousel from './components/ReviewsCarousel';
import FAQSection from './components/FAQSection';
import CartSidebar from './components/CartSidebar';
import ZylumiaAuth from './components/ZylumiaAuth';
import PromoPopup from './components/PromoPopup';
import VideoModal from './components/VideoModal';
import StickyBar from './components/StickyBar';
import Checkout from './pages/Checkout';
import CheckoutSucesso from './pages/CheckoutSucesso';
import AcompanhePedido from './pages/AcompanhePedido';
import Admin from './pages/Admin';
import PerguntasFrequentes from './pages/PerguntasFrequentes';
import PoliticaFrete from './pages/PoliticaFrete';
import PoliticaReembolso from './pages/PoliticaReembolso';
import TermosCondicoes from './pages/TermosCondicoes';
import PoliticaPrivacidade from './pages/PoliticaPrivacidade';
import MinhaConta from './pages/MinhaConta';
import AssinaturaSucesso from './pages/AssinaturaSucesso';
import AssinaturaCancelada from './pages/AssinaturaCancelada';
import Contato from './pages/Contato';
import { ProductData } from './types/product';
import { zylumiaSérum } from './products/zylumia-serum';
import { templateProduto } from './products/template-produto';
import { customerReviews, carouselReviews, faqs } from './data/reviews';

const API = import.meta.env.VITE_API_URL || 'https://backend.zylumia.com';

function PaginaPrincipal({ produto = zylumiaSérum }: { produto?: ProductData }) {
  // ── CMS ───────────────────────────────────────────────────────────────────
  const { sanityProduto, sanityHero, sanityDepoimentos } = useSanity()

  // ── Produto / preço / imagens ─────────────────────────────────────────────
  const {
    supplyMonths, setSupplyMonths,
    purchaseType, setPurchaseType,
    mainImage, setMainImage,
    currentProductImages,
    getPrice, getOldPrice,
  } = useProductPrice(produto, sanityProduto)

  // ── Carrinho ──────────────────────────────────────────────────────────────
  const {
    cartItems, cartCount, isCartOpen, setIsCartOpen,
    timeLeft, couponInput, setCouponInput,
    appliedCoupon, discountAmount, couponMessage,
    handleApplyCoupon, addToCart, removeFromCart, formatTime,
  } = useCart()

  // ── Autenticação ──────────────────────────────────────────────────────────
  const { user, setUser, isAuthOpen, setIsAuthOpen, msgCount, logout } = useAuth()

  // ── UI: banner / sticky / popup ───────────────────────────────────────────
  const { showPromoPopup, setShowPromoPopup } = usePromoPopup()
  const { currentBannerIndex } = useBanner(produto.bannerImages.length)
  const { showStickyBar, isStickyBarDismissed, setIsStickyBarDismissed, showStats } = useStickyBar()

  // ── Newsletter ────────────────────────────────────────────────────────────
  const {
    promoEmail, setPromoEmail, promoLoading, promoMessage,
    footerEmail, setFooterEmail, footerLoading, footerMessage,
    handlePromoSubmit, handleFooterSubmit,
  } = useNewsletter(() => setShowPromoPopup(false))

  // ── Estados locais simples ────────────────────────────────────────────────
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null)
  const [isSubscribing, setIsSubscribing]       = useState(false)
  const [pendingSubscription, setPendingSubscription] = useState(false)

  // ── Handlers ──────────────────────────────────────────────────────────────

  /** Chama API e redireciona para o PayPal. Só chamada quando usuário já está logado. */
  const iniciarAssinatura = async (usuarioAtivo: { email: string; name?: string }) => {
    setIsSubscribing(true)
    try {
      const planId =
        supplyMonths === 1 ? 'monthly-1month'  :
        supplyMonths === 3 ? 'monthly-3months' : 'monthly-6months'

      const response = await fetch(`${API}/api/subscriptions/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          customerEmail: usuarioAtivo.email,
          customerName: usuarioAtivo.name || usuarioAtivo.email.split('@')[0],
        }),
      })
      const data = await response.json()
      if (data.success && data.approvalUrl) {
        window.location.href = data.approvalUrl
      } else {
        alert('Erro ao criar assinatura: ' + (data.error || 'Erro desconhecido'))
        setIsSubscribing(false)
      }
    } catch (e) {
      console.error(e)
      alert('Erro ao conectar com o servidor.')
      setIsSubscribing(false)
    }
  }

  /** Ponto de entrada do botão Assinar — abre auth se necessário */
  const handleSubscribe = () => {
    if (!user) { setPendingSubscription(true); setIsAuthOpen(true); return }
    iniciarAssinatura(user)
  }

  const handleAddToCart = () => {
    const name = `Zylumia™ - Suprimento para ${supplyMonths} ${supplyMonths === 1 ? 'mês' : 'meses'}`
    addToCart(name, getPrice(), mainImage)
  }

  const handleCheckout = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const totalValue = cartItems.reduce(
        (acc, item) => acc + item.price * (item.quantity || item.qty || 1), 0
      ) - discountAmount
      ;(window as any).gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: totalValue,
        items: cartItems.map(item => ({
          item_name: item.name,
          price: item.price,
          quantity: item.quantity || item.qty || 1,
        })),
      })
    }
    // Salva itens do carrinho no cache antes de navegar (checkout abre instantâneo)
    try {
      const sessionId = localStorage.getItem('zylumia_session_id');
      if (sessionId && cartItems.length > 0) {
        const subtotal = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || item.qty || 1), 0);
        const cacheCart = {
          items: cartItems,
          subtotal,
          total: subtotal - discountAmount,
          _loading: false,
        };
        localStorage.setItem('zylumia_cart_cache', JSON.stringify(cacheCart));
      }
    } catch {}
    window.location.href = '/checkout'
  }

  // ── Objetos intermediários para manter o JSX legível ─────────────────────

  const produtoMerged = {
    ...produto,
    nome:      sanityProduto?.nome,
    descricao: sanityProduto?.descricao,
    subtitulo: sanityProduto?.subtitulo,
    preco1mes: sanityProduto?.preco1mes   || produto.preco1mes,
    preco3mes: sanityProduto?.preco3meses || produto.preco3mes,
    preco6mes: sanityProduto?.preco6meses || produto.preco6mes,
  }

  const stickyMainImage = ''

  const reviewsData = (sanityDepoimentos?.length > 0 ? sanityDepoimentos : carouselReviews).map(
    (r: any) => ({ name: r.nome || r.name, text: r.texto || r.body, rating: r.estrelas || 5, date: r.date })
  )

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Header
        user={user}
        cartCount={cartCount}
        msgCount={msgCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={logout}
      />

      <HeroBanner
        currentBannerIndex={currentBannerIndex}
        bannerImages={produto.bannerImages}
        onAddToCart={() => setIsCartOpen(true)}
        heroTitle={sanityHero?.titulo}
        heroSubtitle={sanityHero?.subtitulo}
        heroBtnText={sanityHero?.botaoTexto}
        heroImage={undefined}
      />

      <StatsSection showStats={showStats} />

      <main id="comprar" className="max-w-[1200px] mx-auto px-4 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <ProductGallery
          mainImage={mainImage}
          images={currentProductImages}
          onSelectImage={setMainImage}
        />
        <ProductDetails
          produto={produtoMerged}
          supplyMonths={supplyMonths}
          purchaseType={purchaseType}
          isSubscribing={isSubscribing}
          onSelectMonths={setSupplyMonths}
          onTogglePurchaseType={setPurchaseType}
          onAddToCart={handleAddToCart}
          onSubscribe={handleSubscribe}
          getPrice={getPrice}
          getOldPrice={getOldPrice}
          mainImage={mainImage}
        />
      </main>

      <VideoReviews />
      <JourneyTimeline />
      <TestimonialsSection depoimentos={customerReviews} onOpenVideo={setActiveVideoIndex} />
      <ClinicalResults />
      <HowItWorks />
      <BeforeAfter />
      <SocialProofSection />
      <StepsSection />
      <DoctorSection />
      <ReviewsCarousel reviews={reviewsData} />
      <FAQSection faqs={faqs} />

      <Footer
        footerEmail={footerEmail}
        setFooterEmail={setFooterEmail}
        footerLoading={footerLoading}
        footerMessage={footerMessage}
        onNewsletterSubmit={handleFooterSubmit}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        timeLeft={timeLeft}
        couponInput={couponInput}
        setCouponInput={setCouponInput}
        appliedCoupon={appliedCoupon}
        discountAmount={discountAmount}
        couponMessage={couponMessage}
        onApplyCoupon={handleApplyCoupon}
        onRemoveItem={removeFromCart}
        formatTime={formatTime}
        onCheckout={handleCheckout}
      />

      <ZylumiaAuth
        isOpen={isAuthOpen}
        onClose={() => { setIsAuthOpen(false); setPendingSubscription(false) }}
        onSuccess={(userData) => {
          setUser(userData)
          setIsAuthOpen(false)
          if (pendingSubscription) {
            setPendingSubscription(false)
            iniciarAssinatura(userData)
          }
        }}
      />

      <PromoPopup
        show={showPromoPopup}
        onClose={() => setShowPromoPopup(false)}
        promoEmail={promoEmail}
        setPromoEmail={setPromoEmail}
        promoLoading={promoLoading}
        promoMessage={promoMessage}
        onSubmit={handlePromoSubmit}
      />

      <VideoModal
        activeVideoIndex={activeVideoIndex}
        videos={customerReviews.map(r => ({ src: r.video, title: r.name }))}
        onClose={() => setActiveVideoIndex(null)}
        onPrev={() => setActiveVideoIndex(prev =>
          prev !== null && prev > 0 ? prev - 1 : customerReviews.length - 1
        )}
        onNext={() => setActiveVideoIndex(prev =>
          prev !== null && prev < customerReviews.length - 1 ? prev + 1 : 0
        )}
      />

      <StickyBar
        show={showStickyBar}
        isDismissed={isStickyBarDismissed}
        onDismiss={() => setIsStickyBarDismissed(true)}
        purchaseType={purchaseType}
        price={sanityProduto?.preco6meses || produto.preco6mes}
        productName={sanityProduto?.nome}
        mainImage={stickyMainImage}
        onAddToCart={handleAddToCart}
        onSubscribe={handleSubscribe}
        isSubscribing={isSubscribing}
      />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                        element={<PaginaPrincipal produto={zylumiaSérum} />} />
        <Route path={templateProduto.rota}     element={<PaginaPrincipal produto={templateProduto} />} />
        <Route path="/checkout"                element={<Checkout />} />
        <Route path="/checkout/sucesso"        element={<CheckoutSucesso />} />
        <Route path="/acompanhe-seu-pedido"    element={<AcompanhePedido />} />
        <Route path="/admin"                   element={<Admin />} />
        <Route path="/politica-de-frete"       element={<PoliticaFrete />} />
        <Route path="/politica-de-reembolso"   element={<PoliticaReembolso />} />
        <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
        <Route path="/termos-de-servico"       element={<TermosCondicoes />} />
        <Route path="/perguntas-frequentes"    element={<PerguntasFrequentes />} />
        <Route path="/minha-conta"             element={<MinhaConta />} />
        <Route path="/assinatura/sucesso"      element={<AssinaturaSucesso />} />
        <Route path="/assinatura/cancelada"    element={<AssinaturaCancelada />} />
        <Route path="/contato"                 element={<Contato />} />
      </Routes>
    </BrowserRouter>
  )
}
