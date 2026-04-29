import React, { useState, useEffect, useRef } from 'react';
import { Star, BadgeCheck, ShieldCheck, Truck, Users } from 'lucide-react';
import ZylumiaPayPalButton from '../components/ZylumiaPayPalButton';
import StripeCheckout from '../components/StripeCheckout';

const API = import.meta.env.VITE_API_URL || 'https://backend.zylumia.com';

// ─── Configuração internacional de endereços ───────────────────────────────
const COUNTRIES = [
  { code: 'US', flag: '🇺🇸', name: 'United States' },
  { code: 'BR', flag: '🇧🇷', name: 'Brasil' },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'PT', flag: '🇵🇹', name: 'Portugal' },
  { code: 'DE', flag: '🇩🇪', name: 'Deutschland' },
  { code: 'FR', flag: '🇫🇷', name: 'France' },
  { code: 'ES', flag: '🇪🇸', name: 'España' },
  { code: 'IT', flag: '🇮🇹', name: 'Italia' },
  { code: 'NL', flag: '🇳🇱', name: 'Netherlands' },
  { code: 'BE', flag: '🇧🇪', name: 'Belgium' },
  { code: 'CH', flag: '🇨🇭', name: 'Switzerland' },
  { code: 'AT', flag: '🇦🇹', name: 'Austria' },
  { code: 'CA', flag: '🇨🇦', name: 'Canada' },
  { code: 'AU', flag: '🇦🇺', name: 'Australia' },
  { code: 'MX', flag: '🇲🇽', name: 'México' },
  { code: 'AR', flag: '🇦🇷', name: 'Argentina' },
  { code: 'JP', flag: '🇯🇵', name: 'Japan' },
];

type AddressConfig = {
  streetLabel: string;
  streetPlaceholder: string;
  complementLabel: string;
  complementPlaceholder: string;
  cityLabel: string;
  stateLabel: string;
  statePlaceholder: string;
  postalLabel: string;
  postalPlaceholder: string;
  postalMask?: RegExp;
  phonePrefix: string;
  stateOptions?: { code: string; name: string }[];
};

const ADDRESS_CONFIG: Record<string, AddressConfig> = {
  BR: {
    streetLabel: 'Endereço', streetPlaceholder: 'Rua, Avenida, número',
    complementLabel: 'Complemento', complementPlaceholder: 'Apto, bloco (opcional)',
    cityLabel: 'Cidade', stateLabel: 'Estado', statePlaceholder: 'SP',
    postalLabel: 'CEP', postalPlaceholder: '00000-000',
    postalMask: /^\d{0,5}-?\d{0,3}$/,
    phonePrefix: '+55',
    stateOptions: [
      {code:'AC',name:'Acre'},{code:'AL',name:'Alagoas'},{code:'AP',name:'Amapá'},
      {code:'AM',name:'Amazonas'},{code:'BA',name:'Bahia'},{code:'CE',name:'Ceará'},
      {code:'DF',name:'Distrito Federal'},{code:'ES',name:'Espírito Santo'},
      {code:'GO',name:'Goiás'},{code:'MA',name:'Maranhão'},{code:'MT',name:'Mato Grosso'},
      {code:'MS',name:'Mato Grosso do Sul'},{code:'MG',name:'Minas Gerais'},
      {code:'PA',name:'Pará'},{code:'PB',name:'Paraíba'},{code:'PR',name:'Paraná'},
      {code:'PE',name:'Pernambuco'},{code:'PI',name:'Piauí'},{code:'RJ',name:'Rio de Janeiro'},
      {code:'RN',name:'Rio Grande do Norte'},{code:'RS',name:'Rio Grande do Sul'},
      {code:'RO',name:'Rondônia'},{code:'RR',name:'Roraima'},{code:'SC',name:'Santa Catarina'},
      {code:'SP',name:'São Paulo'},{code:'SE',name:'Sergipe'},{code:'TO',name:'Tocantins'},
    ],
  },
  US: {
    streetLabel: 'Street address', streetPlaceholder: '123 Main St',
    complementLabel: 'Apt, suite, etc.', complementPlaceholder: 'Apt 4B (optional)',
    cityLabel: 'City', stateLabel: 'State', statePlaceholder: 'CA',
    postalLabel: 'ZIP code', postalPlaceholder: '90210',
    postalMask: /^\d{0,5}(-\d{0,4})?$/,
    phonePrefix: '+1',
    stateOptions: [
      {code:'AL',name:'Alabama'},{code:'AK',name:'Alaska'},{code:'AZ',name:'Arizona'},
      {code:'AR',name:'Arkansas'},{code:'CA',name:'California'},{code:'CO',name:'Colorado'},
      {code:'CT',name:'Connecticut'},{code:'DE',name:'Delaware'},{code:'FL',name:'Florida'},
      {code:'GA',name:'Georgia'},{code:'HI',name:'Hawaii'},{code:'ID',name:'Idaho'},
      {code:'IL',name:'Illinois'},{code:'IN',name:'Indiana'},{code:'IA',name:'Iowa'},
      {code:'KS',name:'Kansas'},{code:'KY',name:'Kentucky'},{code:'LA',name:'Louisiana'},
      {code:'ME',name:'Maine'},{code:'MD',name:'Maryland'},{code:'MA',name:'Massachusetts'},
      {code:'MI',name:'Michigan'},{code:'MN',name:'Minnesota'},{code:'MS',name:'Mississippi'},
      {code:'MO',name:'Missouri'},{code:'MT',name:'Montana'},{code:'NE',name:'Nebraska'},
      {code:'NV',name:'Nevada'},{code:'NH',name:'New Hampshire'},{code:'NJ',name:'New Jersey'},
      {code:'NM',name:'New Mexico'},{code:'NY',name:'New York'},{code:'NC',name:'North Carolina'},
      {code:'ND',name:'North Dakota'},{code:'OH',name:'Ohio'},{code:'OK',name:'Oklahoma'},
      {code:'OR',name:'Oregon'},{code:'PA',name:'Pennsylvania'},{code:'RI',name:'Rhode Island'},
      {code:'SC',name:'South Carolina'},{code:'SD',name:'South Dakota'},{code:'TN',name:'Tennessee'},
      {code:'TX',name:'Texas'},{code:'UT',name:'Utah'},{code:'VT',name:'Vermont'},
      {code:'VA',name:'Virginia'},{code:'WA',name:'Washington'},{code:'WV',name:'West Virginia'},
      {code:'WI',name:'Wisconsin'},{code:'WY',name:'Wyoming'},
    ],
  },
  GB: {
    streetLabel: 'Address line 1', streetPlaceholder: '10 Downing Street',
    complementLabel: 'Address line 2', complementPlaceholder: 'Flat, building (optional)',
    cityLabel: 'Town / City', stateLabel: 'County', statePlaceholder: 'Greater London',
    postalLabel: 'Postcode', postalPlaceholder: 'SW1A 2AA',
    phonePrefix: '+44',
  },
  CA: {
    streetLabel: 'Street address', streetPlaceholder: '123 Maple Ave',
    complementLabel: 'Apt, suite', complementPlaceholder: 'Unit 5 (optional)',
    cityLabel: 'City', stateLabel: 'Province', statePlaceholder: 'ON',
    postalLabel: 'Postal code', postalPlaceholder: 'K1A 0A9',
    phonePrefix: '+1',
    stateOptions: [
      {code:'AB',name:'Alberta'},{code:'BC',name:'British Columbia'},{code:'MB',name:'Manitoba'},
      {code:'NB',name:'New Brunswick'},{code:'NL',name:'Newfoundland and Labrador'},
      {code:'NS',name:'Nova Scotia'},{code:'ON',name:'Ontario'},{code:'PE',name:'Prince Edward Island'},
      {code:'QC',name:'Quebec'},{code:'SK',name:'Saskatchewan'},
    ],
  },
  AU: {
    streetLabel: 'Street address', streetPlaceholder: '1 Collins Street',
    complementLabel: 'Unit / Level', complementPlaceholder: 'Unit 2 (optional)',
    cityLabel: 'Suburb / City', stateLabel: 'State / Territory', statePlaceholder: 'VIC',
    postalLabel: 'Postcode', postalPlaceholder: '3000',
    phonePrefix: '+61',
    stateOptions: [
      {code:'ACT',name:'Australian Capital Territory'},{code:'NSW',name:'New South Wales'},
      {code:'NT',name:'Northern Territory'},{code:'QLD',name:'Queensland'},
      {code:'SA',name:'South Australia'},{code:'TAS',name:'Tasmania'},
      {code:'VIC',name:'Victoria'},{code:'WA',name:'Western Australia'},
    ],
  },
  DE: {
    streetLabel: 'Straße und Hausnummer', streetPlaceholder: 'Musterstraße 1',
    complementLabel: 'Adresszusatz', complementPlaceholder: 'Wohnung, Etage (optional)',
    cityLabel: 'Stadt', stateLabel: 'Bundesland', statePlaceholder: 'Bayern',
    postalLabel: 'Postleitzahl', postalPlaceholder: '80331',
    phonePrefix: '+49',
  },
  FR: {
    streetLabel: 'Adresse', streetPlaceholder: '1 Rue de la Paix',
    complementLabel: "Complément d'adresse", complementPlaceholder: 'Appartement (optionnel)',
    cityLabel: 'Ville', stateLabel: 'Département', statePlaceholder: 'Paris',
    postalLabel: 'Code postal', postalPlaceholder: '75001',
    phonePrefix: '+33',
  },
  ES: {
    streetLabel: 'Dirección', streetPlaceholder: 'Calle Mayor 1',
    complementLabel: 'Piso, puerta', complementPlaceholder: '2º izq. (opcional)',
    cityLabel: 'Ciudad', stateLabel: 'Provincia', statePlaceholder: 'Madrid',
    postalLabel: 'Código postal', postalPlaceholder: '28001',
    phonePrefix: '+34',
  },
  IT: {
    streetLabel: 'Indirizzo', streetPlaceholder: 'Via Roma 1',
    complementLabel: 'Interno', complementPlaceholder: 'Scala, interno (opzionale)',
    cityLabel: 'Città', stateLabel: 'Provincia', statePlaceholder: 'RM',
    postalLabel: 'CAP', postalPlaceholder: '00100',
    phonePrefix: '+39',
  },
  PT: {
    streetLabel: 'Morada', streetPlaceholder: 'Rua Augusta 1',
    complementLabel: 'Complemento', complementPlaceholder: 'Andar, fração (opcional)',
    cityLabel: 'Localidade', stateLabel: 'Distrito', statePlaceholder: 'Lisboa',
    postalLabel: 'Código postal', postalPlaceholder: '1100-048',
    phonePrefix: '+351',
  },
  MX: {
    streetLabel: 'Calle y número', streetPlaceholder: 'Av. Insurgentes Sur 123',
    complementLabel: 'Col. / Interior', complementPlaceholder: 'Colonia, depto. (opcional)',
    cityLabel: 'Ciudad', stateLabel: 'Estado', statePlaceholder: 'CDMX',
    postalLabel: 'C.P.', postalPlaceholder: '06600',
    phonePrefix: '+52',
  },
  AR: {
    streetLabel: 'Dirección', streetPlaceholder: 'Av. Corrientes 1234',
    complementLabel: 'Piso / Depto.', complementPlaceholder: '3° B (opcional)',
    cityLabel: 'Ciudad', stateLabel: 'Provincia', statePlaceholder: 'Buenos Aires',
    postalLabel: 'Código postal', postalPlaceholder: 'C1043',
    phonePrefix: '+54',
  },
  JP: {
    streetLabel: '住所', streetPlaceholder: '渋谷区道玄坂1-1',
    complementLabel: '建物名・部屋番号', complementPlaceholder: '渋谷ビル 305号室（任意）',
    cityLabel: '市区町村', stateLabel: '都道府県', statePlaceholder: '東京都',
    postalLabel: '郵便番号', postalPlaceholder: '150-0043',
    phonePrefix: '+81',
  },
};

// ─── Moeda por país ──────────────────────────────────────────────────────────
const CURRENCY_MAP: Record<string, { code: string; symbol: string; label: string }> = {
  US: { code: 'USD', symbol: '$',  label: 'US$' },
  BR: { code: 'BRL', symbol: 'R$', label: 'R$'  },
  GB: { code: 'GBP', symbol: '£',  label: '£'   },
  DE: { code: 'EUR', symbol: '€',  label: '€'   },
  FR: { code: 'EUR', symbol: '€',  label: '€'   },
  ES: { code: 'EUR', symbol: '€',  label: '€'   },
  IT: { code: 'EUR', symbol: '€',  label: '€'   },
  NL: { code: 'EUR', symbol: '€',  label: '€'   },
  BE: { code: 'EUR', symbol: '€',  label: '€'   },
  CH: { code: 'CHF', symbol: 'Fr', label: 'CHF' },
  AT: { code: 'EUR', symbol: '€',  label: '€'   },
  PT: { code: 'EUR', symbol: '€',  label: '€'   },
  CA: { code: 'CAD', symbol: '$',  label: 'CA$' },
  AU: { code: 'AUD', symbol: '$',  label: 'A$'  },
  MX: { code: 'MXN', symbol: '$',  label: 'MX$' },
  AR: { code: 'ARS', symbol: '$',  label: 'AR$' },
  JP: { code: 'JPY', symbol: '¥',  label: '¥'   },
};
function getCurrency(countryCode: string) {
  return CURRENCY_MAP[countryCode] || { code: 'USD', symbol: '$', label: 'US$' };
}
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: AddressConfig = {
  streetLabel: 'Street address', streetPlaceholder: '123 Main Street',
  complementLabel: 'Address line 2', complementPlaceholder: 'Apartment, suite (optional)',
  cityLabel: 'City', stateLabel: 'State / Region', statePlaceholder: 'Region',
  postalLabel: 'Postal code', postalPlaceholder: '00000',
  phonePrefix: '+',
};

function getAddressConfig(countryCode: string): AddressConfig {
  return ADDRESS_CONFIG[countryCode] || DEFAULT_CONFIG;
}
// ──────────────────────────────────────────────────────────────────────────────

const ReviewsAndGuarantees = () => (
  <div style={{ marginTop: '40px' }}>
    <h3 style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px', color: '#111827' }}>
      Mais de 20.000 clientes satisfeitos
    </h3>
    
    {/* Review 1 */}
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '16px', display: 'flex', gap: '16px', backgroundColor: '#fff' }}>
      <img src="/media/checkout-review-01.webp" alt="Review 1" style={{ width: '100px', height: '150px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', color: '#fbbf24', marginBottom: '8px' }}>
          <Star size={16} fill="currentColor" strokeWidth={0} />
          <Star size={16} fill="currentColor" strokeWidth={0} />
          <Star size={16} fill="currentColor" strokeWidth={0} />
          <Star size={16} fill="currentColor" strokeWidth={0} />
          <Star size={16} fill="currentColor" strokeWidth={0} />
        </div>
        <h4 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#111827', lineHeight: '1.3' }}>
          Estou me lamentando muito por não ter encomendado um desses anos atrás.
        </h4>
        <p style={{ fontSize: '13px', color: '#4b5563', marginBottom: '12px', lineHeight: '1.4' }}>
          Estou me lamentando muito por não ter encomendado um desses anos atrás. Ele arranca pelos bem curtos com muita eficácia. É muito menos doloroso do que arrancar um pelo de cada vez com pinça. Pelo menos meia dúzia de amigas minhas agora vão encomendar um!
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6b7280' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#111827', fontWeight: 500 }}>
            Sheila McCarthy <BadgeCheck size={14} color="#3b82f6" fill="#3b82f6" style={{ color: '#fff' }} />
          </div>
          <span>17/11/2024</span>
        </div>
      </div>
    </div>

    {/* Review 2 */}
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '32px', display: 'flex', gap: '16px', backgroundColor: '#fff' }}>
      <img src="/media/checkout-review-02.webp" alt="Review 2" style={{ width: '100px', height: '150px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', color: '#fbbf24', marginBottom: '8px' }}>
          <Star size={16} fill="currentColor" strokeWidth={0} />
          <Star size={16} fill="currentColor" strokeWidth={0} />
          <Star size={16} fill="currentColor" strokeWidth={0} />
          <Star size={16} fill="currentColor" strokeWidth={0} />
          <Star size={16} fill="currentColor" strokeWidth={0} />
        </div>
        <h4 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', color: '#111827', lineHeight: '1.3' }}>
          O preço e a relação custo-benefício são realmente incríveis para o que este produto oferece.
        </h4>
        <p style={{ fontSize: '13px', color: '#4b5563', marginBottom: '12px', lineHeight: '1.4' }}>
          Funciona muito bem, até mesmo em pelos pequenos e quase invisíveis no meu queixo. O preço e a relação custo-benefício são realmente incríveis para o que o produto faz. Definitivamente recomendo.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6b7280' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#111827', fontWeight: 500 }}>
            Rebecca Norris <BadgeCheck size={14} color="#3b82f6" fill="#3b82f6" style={{ color: '#fff' }} />
          </div>
          <span>29/01/2024</span>
        </div>
      </div>
    </div>

    {/* Guarantees with purple icons */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ color: '#c084fc', flexShrink: 0 }}>
          <ShieldCheck size={40} strokeWidth={1.5} />
        </div>
        <div>
          <p style={{ fontWeight: 'bold', fontSize: '15px', color: '#111827', marginBottom: '4px' }}>Garantia de reembolso de 30 dias</p>
          <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.4' }}>Receba 100% do seu dinheiro de volta se não gostar do produto.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ color: '#c084fc', flexShrink: 0 }}>
          <Truck size={40} strokeWidth={1.5} />
        </div>
        <div>
          <p style={{ fontWeight: 'bold', fontSize: '15px', color: '#111827', marginBottom: '4px' }}>Frete grátis para todo Brasil</p>
          <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.4' }}>Oferecemos frete grátis para pedidos, para que você possa devolver seus produtos caso não esteja totalmente satisfeito e receber seu dinheiro de volta.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ color: '#c084fc', flexShrink: 0 }}>
          <Users size={40} strokeWidth={1.5} />
        </div>
        <div>
          <p style={{ fontWeight: 'bold', fontSize: '15px', color: '#111827', marginBottom: '4px' }}>Mais de 20.000 clientes satisfeitos</p>
          <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.4' }}>Clientes de todo o Brasil têm apreciado nossos produtos, que são continuamente aprimorados com base no feedback da comunidade.</p>
        </div>
      </div>
    </div>
  </div>
);

export default function Checkout() {
  const storedUser = JSON.parse(localStorage.getItem('zylumia_user') || 'null');
  // Inicializa cart imediatamente com dados do localStorage (sem delay)
  const [cart, setCart] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('zylumia_cart_cache');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { items: [], subtotal: 0, total: 0, _loading: true };
  });
  
  const [etapa, setEtapa] = useState<'info'|'pagamento'>('info');
  const [nome, setNome]               = useState(storedUser?.name?.split(' ')[0] || '');
  const [sobrenome, setSobrenome]     = useState(storedUser?.name?.split(' ').slice(1).join(' ') || '');
  const [email, setEmail]             = useState(storedUser?.email || '');
  const [telefone, setTelefone]       = useState('');
  const [pais, setPais]               = useState('US');
  const addrConfig = getAddressConfig(pais);
  const currency = getCurrency(pais);
  const [endereco, setEndereco]       = useState('');
  const [complemento, setComplemento] = useState('');
  const [cidade, setCidade]           = useState('');
  const [estado, setEstado]           = useState('');
  const [cep, setCep]                 = useState('');
  const [cupom, setCupom]             = useState('');
  const [desconto, setDesconto]       = useState(0);
  const [cupomAplicado, setCupomAplicado] = useState<any>(null);
  const [loadingCupom, setLoadingCupom] = useState(false);
  const [erroCupom, setErroCupom]       = useState('');
  const [erro, setErro]               = useState('');
  const [camposErro, setCamposErro]   = useState<Record<string,boolean>>({});
  const [loading, setLoading]         = useState(false);

  const stripeRef = useRef<any>(null);

  // Pré-aquece conexão com backend ao montar o componente
  useEffect(() => {
    fetch(`${API}/api/health`).catch(() => {})
    // Limpa cache desatualizado após carregar dados reais
    return () => {}
  }, [])

  useEffect(() => {
    async function carregarCarrinho() {
      const sessionId = localStorage.getItem('zylumia_session_id')
      if (!sessionId) return

      try {
        const r = await fetch(
          `${API}/api/cart/${sessionId}`
        )
        const data = await r.json()
        
        if (data.success && data.cart) {
          localStorage.setItem('zylumia_cart_cache', JSON.stringify(data.cart))
          setCart(data.cart)
          
          // Se o carrinho tem cupom salvo no backend
          if (data.cart.coupon && data.cart.discount > 0) {
            setCupomAplicado(data.cart.coupon)
            setDesconto(data.cart.discount)
            setCupom(data.cart.coupon.code || '')
            localStorage.setItem('zylumia_coupon', data.cart.coupon.code)
          }
        }
      } catch(e) {
        console.error('Erro ao carregar carrinho:', e)
      }
    }
    carregarCarrinho()
  }, [])

  useEffect(() => {
    if (!email.includes('@') || !cart?.items?.length) return
    
    const sessionId = localStorage.getItem('zylumia_session_id')
    if (!sessionId) return

    const timer = setTimeout(() => {
      fetch(`${API}/api/recovery/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          email: email.trim().toLowerCase(),
          items: cart.items,
          total: cart.total || cart.items.reduce((acc: number, item: any) => acc + (item.price * (item.qty || item.quantity || 1)), 0)
        })
      }).catch(e => console.error('Recovery track erro:', e))
    }, 2000)

    return () => clearTimeout(timer)
  }, [email, cart])

  // Sem bloqueio — renderiza imediatamente com dados do cache

  const subtotal = cart?.subtotal || 0;
  const totalFinal = Math.max(subtotal - desconto, 0);

  async function aplicarCupom(codeToApply?: string | React.MouseEvent) {
    const sessionId = localStorage.getItem('zylumia_session_id')
    const code = (typeof codeToApply === 'string' ? codeToApply : cupom).trim().toUpperCase()
    if (!code || !sessionId) return
    
    setLoadingCupom(true)
    setErroCupom('')
    
    try {
      const r = await fetch(
        `${API}/api/cart/${sessionId}/coupon`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        }
      )
      const data = await r.json()
      
      if (data.success) {
        setCupomAplicado(data.coupon)
        
        const calculatedDiscount = data.discount || parseFloat((subtotal * ((data.coupon.discountPercent || 0) / 100)).toFixed(2)) || 0;
        setDesconto(calculatedDiscount)
        
        localStorage.setItem('zylumia_coupon', code)
        setErroCupom('')
      } else {
        setErroCupom(data.message || 'Cupom inválido.')
        setCupomAplicado(null)
        setDesconto(0)
      }
    } catch(e) {
      setErroCupom('Erro ao aplicar cupom.')
    } finally {
      setLoadingCupom(false)
    }
  }

  const handlePagarAgora = async () => {
    const erros: Record<string,boolean> = {};
    if (!nome)      erros.nome = true;
    if (!sobrenome) erros.sobrenome = true;
    if (!email)     erros.email = true;
    if (!endereco)  erros.endereco = true;
    if (!cidade)    erros.cidade = true;
    if (!estado)    erros.estado = true;
    if (!cep)       erros.cep = true;

    if (Object.keys(erros).length > 0) {
      setCamposErro(erros);
      setErro('Por favor, preencha todos os campos obrigatórios em vermelho.');
      // Scroll to first error
      document.querySelector('.campo-erro')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setCamposErro({});
    setLoading(true);
    setErro('');

    try {
      if (stripeRef.current) {
        const result = await stripeRef.current.processPayment({
          customerEmail: email,
          customerName: `${nome} ${sobrenome}`,
          cartItems: cart.items,
          couponCode: localStorage.getItem('zylumia_coupon') || undefined,
          billingDetails: {
            country: pais,
            telefone: `${addrConfig.phonePrefix}${telefone}`,
            customerName: `${nome} ${sobrenome}`,
          },
          billingDetails: {
            nome, sobrenome, email, telefone,
            pais, endereco, complemento,
            cidade, estado, cep,
            address: {
              line1: endereco,
              line2: complemento,
              city: cidade,
              state: estado,
              postal_code: cep,
              country: pais,
            }
          }
        });

        if (result && result.success) {
          window.location.href = `/checkout/sucesso?order=${result.order?.id || 'PEDIDO'}`;
        }
      } else {
        throw new Error('Stripe não inicializado');
      }

    } catch (err: any) {
      console.error('Stripe erro:', err);
      setErro(err.message || 'Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #e0d9f5',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
    background: '#faf9ff',
  };

  const inputErrorStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #ef4444',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
    background: '#fff5f5',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '4px',
    fontWeight: 500
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#fff', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      fontWeight: 400,
      fontStyle: 'normal',
      color: 'rgb(0, 0, 0)',
      fontSize: '14px',
      lineHeight: '21px'
    }}>
      <style>{`
        .checkout-container {
          display: flex;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 100vh;
        }
        .left-col {
          flex: 1.1;
          padding: 40px 5%;
          border-right: 1px solid #e5e7eb;
        }
        .right-col {
          flex: 0.9;
          padding: 40px 5%;
          background: #f9fafb;
        }
        .desktop-only {
          display: block;
        }
        .mobile-only {
          display: none;
        }
        .mobile-header {
          display: none;
        }
        @media (max-width: 800px) {
          .checkout-container {
            flex-direction: column;
          }
          .left-col, .right-col {
            padding: 24px 20px;
            border-right: none;
          }
          .addr-row {
            flex-direction: column !important;
          }
          .addr-row > div {
            flex: 1 1 100% !important;
            width: 100% !important;
          }
          .stripe-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .phone-row {
            flex-direction: row !important;
          }
          .right-col {
            border-bottom: 1px solid #e5e7eb;
            order: 2;
          }
          .left-col {
            order: 3;
          }
          .mobile-header {
            display: block;
            order: 1;
            padding: 20px 20px 0 20px;
          }
          .left-col-header {
            display: none;
          }
          .left-col-paypal {
            display: none;
          }
          .left-col-divider {
            display: none;
          }
          .desktop-only {
            display: none;
          }
          .mobile-only {
            display: block;
          }
          .payment-section,
          .delivery-section {
            margin-left: -4px;
            margin-right: -4px;
          }
          .payment-section .stripe-wrapper,
          .delivery-section .addr-fields {
            width: 100%;
          }
        }
      `}</style>

      {/* MOBILE HEADER - logo + breadcrumb + PayPal */}
      <div className="mobile-header">
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#000', margin: '0 0 6px 0', fontFamily: 'Georgia, serif' }}>Zylumia</h1>
          <div style={{ width: '48px', height: '2px', background: '#000', margin: '0 auto 6px' }}></div>
          <div style={{ color: '#f59e0b', fontSize: '16px', letterSpacing: '2px', marginBottom: '4px' }}>★★★★★</div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
          Carrinho &gt; <span style={{ color: '#374151', fontWeight: 500 }}>Informações</span> &gt; Pagamento
        </div>
        <div style={{ marginBottom: '8px' }}>
          <div style={{ textAlign: 'center', marginBottom: '12px', fontSize: '14px', color: '#374151' }}>
            Pagamento expresso
          </div>
          <ZylumiaPayPalButton
            produto={{
              name: cart.items.reduce((acc: number, item: any) => acc + (item.qty || item.quantity || 1), 0) === 1 ? cart.items[0].name : `${cart.items.reduce((acc: number, item: any) => acc + (item.qty || item.quantity || 1), 0)} itens (Zylumia)`,
              price: totalFinal,
              image: cart.items[0]?.image || '',
              currencyLabel: currency.label,
            }}
            customerName={`${nome} ${sobrenome}`}
            customerEmail={email}
            customerPhone={`${addrConfig.phonePrefix}${telefone}`}
            onSuccess={(order: any) => {
              localStorage.removeItem('zylumia_session_id');
              localStorage.removeItem('zylumia_coupon');
              window.location.href = `/checkout/sucesso?order=${order.id.substring(0,8).toUpperCase()}`;
            }}
            onError={() => alert('Erro no pagamento. Tente novamente.')}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '16px 0 0 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>OU</span>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
        </div>
      </div>

            <div className="checkout-container">
        {/* COLUNA ESQUERDA (formulário) */}
        <div className="left-col">
          <div className="left-col-header" style={{ marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#000', margin: '0 0 6px 0', fontFamily: 'Georgia, serif' }}>Zylumia</h1>
              <div style={{ width: '48px', height: '2px', background: '#000', marginBottom: '6px' }}></div>
              <div style={{ color: '#f59e0b', fontSize: '16px', letterSpacing: '2px' }}>★★★★★</div>
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
              Carrinho &gt; <span style={{ color: '#374151', fontWeight: 500 }}>Informações</span> &gt; Pagamento
            </div>
          </div>

          <div className="left-col-paypal" style={{ marginBottom: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '14px', color: '#374151' }}>
              Pagamento expresso
            </div>
            <ZylumiaPayPalButton
              produto={{
                name: cart.items.reduce((acc: number, item: any) => acc + (item.qty || item.quantity || 1), 0) === 1 ? cart.items[0].name : `${cart.items.reduce((acc: number, item: any) => acc + (item.qty || item.quantity || 1), 0)} itens (Zylumia)`,
                price: totalFinal
              }}
              customerName={`${nome} ${sobrenome}`}
              customerEmail={email}
              onSuccess={(order: any) => {
                localStorage.removeItem('zylumia_session_id');
                localStorage.removeItem('zylumia_coupon');
                window.location.href = `/checkout/sucesso?order=${order.id.substring(0,8).toUpperCase()}`;
              }}
              onError={() => alert('Erro no pagamento. Tente novamente.')}
            />
          </div>

          <div className="left-col-divider" style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>OU</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 500, margin: 0 }}>Contato</h2>
              <a href="#" style={{ color: '#7c3aed', fontSize: '14px', textDecoration: 'none' }}>Entrar</a>
            </div>
            <div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="E-mail"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="delivery-section" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', marginTop: 0, color: '#1a0533' }}>Entrega</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* País / Country */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <span>{pais === 'BR' ? 'País / Região' : 'Country / Region'}</span>
                  <span style={{ marginLeft: 'auto', background: '#ede9fe', color: '#6d28d9', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.05em' }}>{currency.code}</span>
                </label>
                <select
                  value={pais}
                  onChange={e => { setPais(e.target.value); setEstado(''); setCep(''); localStorage.setItem('zylumia_country', e.target.value); }}
                  style={{...inputStyle, paddingLeft: '12px', width: '100%', boxSizing: 'border-box'}}
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>

              {/* Nome / Name */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {pais === 'BR' ? 'Primeiro nome' : 'First name'}
                  </label>
                  <input type="text" value={nome} onChange={e => { setNome(e.target.value); setCamposErro(p=>({...p,nome:false})); }} placeholder={pais === 'BR' ? 'João' : 'John'} className={camposErro.nome ? 'campo-erro' : ''} style={camposErro.nome ? inputErrorStyle : inputStyle} />
                  {camposErro.nome && <span style={{fontSize:'11px',color:'#ef4444',marginTop:'2px',display:'block'}}>Obrigatório</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {pais === 'BR' ? 'Sobrenome' : 'Last name'}
                  </label>
                  <input type="text" value={sobrenome} onChange={e => { setSobrenome(e.target.value); setCamposErro(p=>({...p,sobrenome:false})); }} placeholder={pais === 'BR' ? 'Silva' : 'Smith'} className={camposErro.sobrenome ? 'campo-erro' : ''} style={camposErro.sobrenome ? inputErrorStyle : inputStyle} />
                  {camposErro.sobrenome && <span style={{fontSize:'11px',color:'#ef4444',marginTop:'2px',display:'block'}}>Obrigatório</span>}
                </div>
              </div>

              {/* Endereço / Street */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {addrConfig.streetLabel}
                </label>
                <input type="text" value={endereco} onChange={e => { setEndereco(e.target.value); setCamposErro(p=>({...p,endereco:false})); }} placeholder={addrConfig.streetPlaceholder} className={camposErro.endereco ? 'campo-erro' : ''} style={camposErro.endereco ? inputErrorStyle : inputStyle} />
                {camposErro.endereco && <span style={{fontSize:'11px',color:'#ef4444',marginTop:'2px',display:'block'}}>Obrigatório</span>}
              </div>

              {/* Complemento */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {addrConfig.complementLabel}
                </label>
                <input type="text" value={complemento} onChange={e => setComplemento(e.target.value)} placeholder={addrConfig.complementPlaceholder} style={inputStyle} />
              </div>

              {/* Cidade / City */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {addrConfig.cityLabel}
                </label>
                <input type="text" value={cidade} onChange={e => { setCidade(e.target.value); setCamposErro(p=>({...p,cidade:false})); }} placeholder={addrConfig.cityLabel} className={camposErro.cidade ? 'campo-erro' : ''} style={camposErro.cidade ? inputErrorStyle : inputStyle} />
                {camposErro.cidade && <span style={{fontSize:'11px',color:'#ef4444',marginTop:'2px',display:'block'}}>Obrigatório</span>}
              </div>

              {/* Estado / State + CEP / Postal */}
              <div className="addr-row" style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {addrConfig.stateLabel}
                  </label>
                  {addrConfig.stateOptions ? (
                    <select value={estado} onChange={e => { setEstado(e.target.value); setCamposErro(p=>({...p,estado:false})); }} className={camposErro.estado ? 'campo-erro' : ''} style={camposErro.estado ? inputErrorStyle : inputStyle}>
                      <option value="">{addrConfig.statePlaceholder}...</option>
                      {addrConfig.stateOptions.map(s => (
                        <option key={s.code} value={s.code}>{s.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input type="text" value={estado} onChange={e => { setEstado(e.target.value); setCamposErro(p=>({...p,estado:false})); }} placeholder={addrConfig.statePlaceholder} className={camposErro.estado ? 'campo-erro' : ''} style={camposErro.estado ? inputErrorStyle : inputStyle} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {addrConfig.postalLabel}
                  </label>
                  <input
                    type="text"
                    value={cep}
                    onChange={e => { setCep(e.target.value); setCamposErro(p=>({...p,cep:false})); }}
                    placeholder={addrConfig.postalPlaceholder}
                    className={camposErro.cep ? 'campo-erro' : ''}
                    style={camposErro.cep ? inputErrorStyle : inputStyle}
                    maxLength={12}
                  />
                </div>
              </div>

              {/* Telefone / Phone */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {pais === 'BR' ? 'Telefone (opcional)' : 'Phone (optional)'}
                </label>
                <div className="phone-row" style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ ...inputStyle, width: '90px', flexShrink: 0, background: '#f9fafb', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 500 }}>
                    {addrConfig.phonePrefix}
                  </div>
                  <input type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} placeholder={pais === 'BR' ? '(11) 99999-9999' : '555-555-5555'} style={{...inputStyle, flex: 1}} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', marginTop: 0 }}>Método de envio</h2>
            <div style={{ border: '1px solid #7c3aed', borderRadius: '8px', padding: '16px', background: '#f5f3ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '6px solid #7c3aed', background: '#fff' }}></div>
                <div>
                  <div style={{ fontWeight: 500 }}>Frete Padrão</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>7-15 dias úteis</div>
                </div>
              </div>
              <div style={{ fontWeight: 500 }}>Grátis</div>
            </div>
          </div>

          <div className="payment-section" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: '#1a0533' }}>Pagamento</h2>
              <div style={{ display: 'flex', gap: '4px' }}>
                <div style={{ width: '36px', height: '22px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: '#1a1f36' }}>VISA</div>
                <div style={{ width: '36px', height: '22px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: '#eb001b' }}>MC</div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>🔒 Todas as transações são seguras e criptografadas.</div>
            <div style={{ border: '1px solid #e0d9f5', borderRadius: '10px', overflow: 'hidden', background: '#fff' }}>
              <div style={{ padding: '14px 16px', background: '#f5f3ff', borderBottom: '1px solid #e0d9f5', fontWeight: 600, color: '#4c1d95', fontSize: '14px' }}>
                Cartão de crédito / débito
              </div>
              <div style={{ padding: '16px' }}>
                <StripeCheckout ref={stripeRef} customerPhone={`${addrConfig.phonePrefix}${telefone}`} customerName={`${nome} ${sobrenome}`} />
              </div>
            </div>
          </div>

          {erro && (
            <div style={{ padding: '12px', background: '#fef2f2', color: '#b91c1c', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>
              {erro}
            </div>
          )}

          <button 
            onClick={handlePagarAgora}
            disabled={loading}
            style={{
              width: '100%',
              height: '56px',
              background: loading ? '#333' : '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background 0.2s',
              letterSpacing: '0.03em',
            }}
          >
            {loading ? 'Processando...' : `PAGAR AGORA — ${currency.label} ${totalFinal.toFixed(2)}`}
          </button>
          
          <div className="mobile-only">
            <ReviewsAndGuarantees />
          </div>
          
          <div style={{ marginTop: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '24px', display: 'flex', gap: '16px', fontSize: '12px', color: '#7c3aed', flexWrap: 'wrap' }}>
            <a href="/politica-de-reembolso" style={{ color: 'inherit', textDecoration: 'none' }}>Política de reembolso</a>
            <a href="/politica-de-frete" style={{ color: 'inherit', textDecoration: 'none' }}>Política de frete</a>
            <a href="/politica-de-privacidade" style={{ color: 'inherit', textDecoration: 'none' }}>Política de privacidade</a>
            <a href="/termos-de-servico" style={{ color: 'inherit', textDecoration: 'none' }}>Termos de serviço</a>
          </div>
        </div>

        {/* COLUNA DIREITA (resumo) */}
        <div className="right-col">
          <div style={{ position: 'sticky', top: '40px' }}>
            
            {cart.items.map((item: any, index: number) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '64px', height: '64px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                    <img 
                      src={item.image || ""} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <div style={{ position: 'absolute', top: '-8px', right: '-8px', width: '22px', height: '22px', background: '#000', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }}>
                    {item.qty || item.quantity || 1}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, color: '#374151' }}>{item.name}</div>
                </div>
                <div style={{ fontWeight: 500, color: '#374151' }}>
                  {currency.label} {(item.price * (item.qty || item.quantity || 1)).toFixed(2)}
                </div>
              </div>
            ))}

            <div style={{ marginBottom: '24px', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '24px 0' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Código de desconto"
                    value={cupom}
                    onChange={e => setCupom(e.target.value.toUpperCase())}
                    disabled={!!cupomAplicado}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                    }}
                  />
                  {!cupomAplicado ? (
                    <button
                      id="btn-aplicar-cupom"
                      onClick={aplicarCupom}
                      disabled={loadingCupom || !cupom}
                      style={{
                        background: '#000',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 20px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      {loadingCupom ? '...' : 'Aplicar'}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setCupomAplicado(null)
                        setDesconto(0)
                        setCupom('')
                        localStorage.removeItem('zylumia_coupon')
                      }}
                      style={{
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 20px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      Remover
                    </button>
                  )}
                </div>
                
                {cupomAplicado && (
                  <p style={{ color: '#10b981', fontSize: '13px', marginTop: '6px' }}>
                    ✅ {cupomAplicado.code} — {cupomAplicado.discountPercent}% OFF aplicado!
                  </p>
                )}
                
                {erroCupom && (
                  <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px' }}>
                    {erroCupom}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                <span>Subtotal</span>
                <span>{currency.label} {subtotal.toFixed(2)}</span>
              </div>
              
              {desconto > 0 && (
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px',color:'#10b981',fontWeight:'500'}}>
                  <span>Desconto ({cupomAplicado?.discountPercent ? `${cupomAplicado.discountPercent}% OFF` : cupomAplicado?.code || 'Cupom'})</span>
                  <span>- US$ {desconto.toFixed(2)}</span>
                </div>
              )}
              
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                <span>Frete</span>
                <span style={{color:'#10b981'}}>Grátis</span>
              </div>
              
              <hr style={{border:'none',borderTop:'1px solid #e5e7eb',margin:'12px 0'}}/>
              
              <div style={{display:'flex',justifyContent:'space-between',fontWeight:'bold',fontSize:'20px'}}>
                <span>Total</span>
                <span>{currency.label} {totalFinal.toFixed(2)}</span>
              </div>
            </div>


            {/* NEW CONTENT: Reviews and Guarantees */}
            <div className="desktop-only">
              <ReviewsAndGuarantees />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
