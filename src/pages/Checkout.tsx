import React, { useState, useEffect, useRef } from 'react';
import { Star, BadgeCheck, ShieldCheck, Truck, Users } from 'lucide-react';
import ZylumiaPayPalButton from '../components/ZylumiaPayPalButton';
import StripeCheckout from '../components/StripeCheckout';
import StripeExpressButtons from '../components/StripeExpressButtons';
import { API } from '../config/api';
import { withRetry } from '../services/errorService';
import {
  getOrCreateSessionId,
  saveCartToBackend,
  saveCartToCache,
  loadCartFromBackend,
} from '../services/cartService';

const COUNTRIES = [
  { code: 'US', flag: '\u{1F1FA}\u{1F1F8}', name: 'United States' },
  { code: 'BR', flag: '\u{1F1E7}\u{1F1F7}', name: 'Brazil' },
  { code: 'GB', flag: '\u{1F1EC}\u{1F1E7}', name: 'United Kingdom' },
  { code: 'PT', flag: '\u{1F1F5}\u{1F1F9}', name: 'Portugal' },
  { code: 'DE', flag: '\u{1F1E9}\u{1F1EA}', name: 'Germany' },
  { code: 'FR', flag: '\u{1F1EB}\u{1F1F7}', name: 'France' },
  { code: 'ES', flag: '\u{1F1EA}\u{1F1F8}', name: 'Spain' },
  { code: 'IT', flag: '\u{1F1EE}\u{1F1F9}', name: 'Italy' },
  { code: 'CA', flag: '\u{1F1E8}\u{1F1E6}', name: 'Canada' },
  { code: 'AU', flag: '\u{1F1E6}\u{1F1FA}', name: 'Australia' },
  { code: 'MX', flag: '\u{1F1F2}\u{1F1FD}', name: 'Mexico' },
  { code: 'JP', flag: '\u{1F1EF}\u{1F1F5}', name: 'Japan' },
];

type AddressConfig = {
  streetLabel: string; streetPlaceholder: string;
  complementLabel: string; complementPlaceholder: string;
  cityLabel: string; stateLabel: string; statePlaceholder: string;
  postalLabel: string; postalPlaceholder: string;
  phonePrefix: string;
  stateOptions?: { code: string; name: string }[];
};

const ADDRESS_CONFIG: Record<string, AddressConfig> = {
  BR: { streetLabel:'Street address', streetPlaceholder:'Rua, Avenida, numero', complementLabel:'Apt, suite', complementPlaceholder:'Apto, bloco (optional)', cityLabel:'City', stateLabel:'State', statePlaceholder:'SP', postalLabel:'Postal code', postalPlaceholder:'00000-000', phonePrefix:'+55',
    stateOptions:[{code:'AC',name:'Acre'},{code:'AL',name:'Alagoas'},{code:'AM',name:'Amazonas'},{code:'BA',name:'Bahia'},{code:'CE',name:'Ceara'},{code:'DF',name:'Distrito Federal'},{code:'ES',name:'Espirito Santo'},{code:'GO',name:'Goias'},{code:'MA',name:'Maranhao'},{code:'MT',name:'Mato Grosso'},{code:'MS',name:'Mato Grosso do Sul'},{code:'MG',name:'Minas Gerais'},{code:'PA',name:'Para'},{code:'PB',name:'Paraiba'},{code:'PR',name:'Parana'},{code:'PE',name:'Pernambuco'},{code:'PI',name:'Piaui'},{code:'RJ',name:'Rio de Janeiro'},{code:'RN',name:'Rio Grande do Norte'},{code:'RS',name:'Rio Grande do Sul'},{code:'RO',name:'Rondonia'},{code:'RR',name:'Roraima'},{code:'SC',name:'Santa Catarina'},{code:'SP',name:'Sao Paulo'},{code:'SE',name:'Sergipe'},{code:'TO',name:'Tocantins'}] },
  US: { streetLabel:'Street address', streetPlaceholder:'123 Main St', complementLabel:'Apt, suite, etc.', complementPlaceholder:'Apt 4B (optional)', cityLabel:'City', stateLabel:'State', statePlaceholder:'CA', postalLabel:'ZIP code', postalPlaceholder:'90210', phonePrefix:'+1',
    stateOptions:[{code:'AL',name:'Alabama'},{code:'AK',name:'Alaska'},{code:'AZ',name:'Arizona'},{code:'AR',name:'Arkansas'},{code:'CA',name:'California'},{code:'CO',name:'Colorado'},{code:'CT',name:'Connecticut'},{code:'DE',name:'Delaware'},{code:'FL',name:'Florida'},{code:'GA',name:'Georgia'},{code:'HI',name:'Hawaii'},{code:'ID',name:'Idaho'},{code:'IL',name:'Illinois'},{code:'IN',name:'Indiana'},{code:'IA',name:'Iowa'},{code:'KS',name:'Kansas'},{code:'KY',name:'Kentucky'},{code:'LA',name:'Louisiana'},{code:'ME',name:'Maine'},{code:'MD',name:'Maryland'},{code:'MA',name:'Massachusetts'},{code:'MI',name:'Michigan'},{code:'MN',name:'Minnesota'},{code:'MS',name:'Mississippi'},{code:'MO',name:'Missouri'},{code:'MT',name:'Montana'},{code:'NE',name:'Nebraska'},{code:'NV',name:'Nevada'},{code:'NH',name:'New Hampshire'},{code:'NJ',name:'New Jersey'},{code:'NM',name:'New Mexico'},{code:'NY',name:'New York'},{code:'NC',name:'North Carolina'},{code:'ND',name:'North Dakota'},{code:'OH',name:'Ohio'},{code:'OK',name:'Oklahoma'},{code:'OR',name:'Oregon'},{code:'PA',name:'Pennsylvania'},{code:'RI',name:'Rhode Island'},{code:'SC',name:'South Carolina'},{code:'SD',name:'South Dakota'},{code:'TN',name:'Tennessee'},{code:'TX',name:'Texas'},{code:'UT',name:'Utah'},{code:'VT',name:'Vermont'},{code:'VA',name:'Virginia'},{code:'WA',name:'Washington'},{code:'WV',name:'West Virginia'},{code:'WI',name:'Wisconsin'},{code:'WY',name:'Wyoming'}] },
  GB: { streetLabel:'Address line 1', streetPlaceholder:'10 Downing Street', complementLabel:'Address line 2', complementPlaceholder:'Flat (optional)', cityLabel:'Town / City', stateLabel:'County', statePlaceholder:'Greater London', postalLabel:'Postcode', postalPlaceholder:'SW1A 2AA', phonePrefix:'+44' },
  CA: { streetLabel:'Street address', streetPlaceholder:'123 Maple Ave', complementLabel:'Apt, suite', complementPlaceholder:'Unit 5 (optional)', cityLabel:'City', stateLabel:'Province', statePlaceholder:'ON', postalLabel:'Postal code', postalPlaceholder:'K1A 0A9', phonePrefix:'+1',
    stateOptions:[{code:'AB',name:'Alberta'},{code:'BC',name:'British Columbia'},{code:'MB',name:'Manitoba'},{code:'NB',name:'New Brunswick'},{code:'NL',name:'Newfoundland'},{code:'NS',name:'Nova Scotia'},{code:'ON',name:'Ontario'},{code:'PE',name:'Prince Edward Island'},{code:'QC',name:'Quebec'},{code:'SK',name:'Saskatchewan'}] },
  AU: { streetLabel:'Street address', streetPlaceholder:'1 Collins Street', complementLabel:'Unit / Level', complementPlaceholder:'Unit 2 (optional)', cityLabel:'Suburb / City', stateLabel:'State', statePlaceholder:'VIC', postalLabel:'Postcode', postalPlaceholder:'3000', phonePrefix:'+61',
    stateOptions:[{code:'ACT',name:'ACT'},{code:'NSW',name:'New South Wales'},{code:'NT',name:'Northern Territory'},{code:'QLD',name:'Queensland'},{code:'SA',name:'South Australia'},{code:'TAS',name:'Tasmania'},{code:'VIC',name:'Victoria'},{code:'WA',name:'Western Australia'}] },
};

const DEFAULT_CONFIG: AddressConfig = { streetLabel:'Street address', streetPlaceholder:'123 Main Street', complementLabel:'Address line 2', complementPlaceholder:'Apartment (optional)', cityLabel:'City', stateLabel:'State / Region', statePlaceholder:'Region', postalLabel:'Postal code', postalPlaceholder:'00000', phonePrefix:'+' };

function getAddressConfig(code: string): AddressConfig { return ADDRESS_CONFIG[code] || DEFAULT_CONFIG; }

function PolicyModalContent({ type }: { type: string }) {
  const txt: React.CSSProperties = { fontSize:'14px', lineHeight:'1.75', color:'#374151', marginBottom:'12px' };
  const hdg: React.CSSProperties = { margin:0, marginTop:'20px', marginBottom:'8px', fontSize:'15px', fontWeight:700, color:'#111827' };
  const lst: React.CSSProperties = { fontSize:'14px', lineHeight:'1.75', color:'#374151', paddingLeft:'20px', marginBottom:'12px' };
  const bdg: React.CSSProperties = { background:'#f3e8ff', color:'#7c3aed', padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:600, display:'inline-block', marginBottom:'14px' };
  const lnk: React.CSSProperties = { color:'#7c3aed', textDecoration:'underline' };
  const em = 'zylumiaa@gmail.com';
  const Sep = () => <div style={{ height:'1px', background:'#f3f4f6', margin:'16px 0' }} />;
  if (type === 'refund') return (<div><span style={bdg}>365-day guarantee</span><p style={txt}>We are fully confident in the Zylumia Serum. If unsatisfied, request a full refund within <strong>365 days</strong> — no questions asked.</p><Sep /><h4 style={hdg}>How to request</h4><ul style={lst}><li>Email: <a href={'mailto:'+em} style={lnk}>{em}</a></li><li>Include your order number</li><li>Processed within 5 business days</li></ul><Sep /><h4 style={hdg}>Conditions</h4><ul style={lst}><li>Valid up to 365 days after delivery</li><li>Product may have been used</li><li>100% full refund</li><li>Return shipping covered by Zylumia</li></ul></div>);
  if (type === 'shipping') return (<div><span style={bdg}>Free Shipping</span><p style={txt}>Orders processed in <strong>1-2 business days</strong>. Confirmation email sent after dispatch.</p><Sep /><h4 style={hdg}>Delivery times</h4><table style={{ width:'100%', borderCollapse:'collapse', fontSize:'14px', marginBottom:'12px' }}><thead><tr style={{ borderBottom:'2px solid #e5e7eb' }}><th style={{ textAlign:'left', padding:'8px 0', color:'#111' }}>Region</th><th style={{ textAlign:'left', padding:'8px 0', color:'#111' }}>Time</th></tr></thead><tbody>{[['United States','2-3 business days'],['United Kingdom','1-2 business days'],['Rest of world','3-10 business days']].map(([r,t],i)=>(<tr key={i} style={{ borderBottom:'1px solid #f3f4f6' }}><td style={{ padding:'8px 0', color:'#374151' }}>{r}</td><td style={{ padding:'8px 0', color:'#374151' }}>{t}</td></tr>))}</tbody></table></div>);
  if (type === 'privacy') return (<div><span style={bdg}>Last updated: Aug/2025</span><p style={txt}>Zylumia collects only info needed to process your order. Data is SSL encrypted and never sold to third parties.</p><Sep /><h4 style={hdg}>What we collect</h4><ul style={lst}><li><strong>Contact:</strong> name, email, phone, address</li><li><strong>Payment:</strong> processed by Stripe/PayPal. We never store card numbers.</li></ul><Sep /><h4 style={hdg}>Your rights</h4><p style={txt}>Access, correction or deletion on request: <a href={'mailto:'+em} style={lnk}>{em}</a></p></div>);
  if (type === 'terms') return (<div><span style={bdg}>Terms of Service</span><p style={txt}>By purchasing at Zylumia, you agree to these terms.</p><Sep /><h4 style={hdg}>Products</h4><ul style={lst}><li>For personal use only</li><li>Results may vary</li><li>Do not replace medical treatment</li></ul><Sep /><h4 style={hdg}>Orders</h4><ul style={lst}><li>Confirmed upon payment approval</li><li>We may cancel orders suspected of fraud</li></ul></div>);
  return null;
}

const ReviewsAndGuarantees = () => (
  <div style={{ marginTop:'40px' }}>
    <h3 style={{ fontSize:'16px', fontWeight:700, textAlign:'center', marginBottom:'16px', color:'#111827' }}>20,000+ Happy Customers</h3>
    <div style={{ border:'1px solid #e5e7eb', borderRadius:'8px', padding:'16px', marginBottom:'16px', display:'flex', gap:'16px', backgroundColor:'#fff' }}>
      <img src="https://imagens.zylumia.com/zylumia-cyperusss.png" alt="Review" style={{ width:'100px', height:'150px', objectFit:'cover', borderRadius:'8px', flexShrink:0 }} />
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', color:'#fbbf24', marginBottom:'8px' }}>{[...Array(5)].map((_,i)=><Star key={i} size={16} fill="currentColor" strokeWidth={0} />)}</div>
        <h4 style={{ fontWeight:700, fontSize:'14px', marginBottom:'8px', color:'#111827', lineHeight:'1.3' }}>I deeply regret not ordering one of these years ago.</h4>
        <p style={{ fontSize:'13px', color:'#4b5563', marginBottom:'12px', lineHeight:'1.4' }}>It removes very short hairs with great efficiency. Much less painful than plucking with tweezers.</p>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'12px', color:'#6b7280' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'4px', color:'#111827', fontWeight:500 }}>Sheila M. <BadgeCheck size={14} color="#3b82f6" fill="#3b82f6" /></div>
          <span>Nov 17, 2024</span>
        </div>
      </div>
    </div>
    <div style={{ border:'1px solid #e5e7eb', borderRadius:'8px', padding:'16px', marginBottom:'32px', display:'flex', gap:'16px', backgroundColor:'#fff' }}>
      <img src="https://imagens.zylumia.com/rotundus-cyperus.png" alt="Review" style={{ width:'100px', height:'150px', objectFit:'cover', borderRadius:'8px', flexShrink:0 }} />
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', color:'#fbbf24', marginBottom:'8px' }}>{[...Array(5)].map((_,i)=><Star key={i} size={16} fill="currentColor" strokeWidth={0} />)}</div>
        <h4 style={{ fontWeight:700, fontSize:'14px', marginBottom:'8px', color:'#111827', lineHeight:'1.3' }}>The price-to-performance ratio is truly incredible.</h4>
        <p style={{ fontSize:'13px', color:'#4b5563', marginBottom:'12px', lineHeight:'1.4' }}>Works very well, even on tiny hairs. The cost-benefit is amazing. Definitely recommend.</p>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'12px', color:'#6b7280' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'4px', color:'#111827', fontWeight:500 }}>Rebecca N. <BadgeCheck size={14} color="#3b82f6" fill="#3b82f6" /></div>
          <span>Jan 29, 2024</span>
        </div>
      </div>
    </div>
    <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
      <div style={{ display:'flex', gap:'16px' }}><div style={{ flexShrink:0 }}><ShieldCheck size={40} strokeWidth={1.5} color="#841dc5" /></div><div><p style={{ fontWeight:700, fontSize:'15px', color:'#111827', marginBottom:'4px', marginTop:0 }}>30-Day Money Back Guarantee</p><p style={{ fontSize:'13px', color:'#6b7280', lineHeight:'1.4', margin:0 }}>Get 100% of your money back if not happy with the product.</p></div></div>
      <div style={{ display:'flex', gap:'16px' }}><div style={{ flexShrink:0 }}><Truck size={40} strokeWidth={1.5} color="#841dc5" /></div><div><p style={{ fontWeight:700, fontSize:'15px', color:'#111827', marginBottom:'4px', marginTop:0 }}>Free Worldwide Shipping</p><p style={{ fontSize:'13px', color:'#6b7280', lineHeight:'1.4', margin:0 }}>Free shipping on all orders with peace of mind.</p></div></div>
      <div style={{ display:'flex', gap:'16px' }}><div style={{ flexShrink:0 }}><Users size={40} strokeWidth={1.5} color="#841dc5" /></div><div><p style={{ fontWeight:700, fontSize:'15px', color:'#111827', marginBottom:'4px', marginTop:0 }}>20,000+ Happy Customers</p><p style={{ fontSize:'13px', color:'#6b7280', lineHeight:'1.4', margin:0 }}>Continuously improved based on community feedback.</p></div></div>
    </div>
  </div>
);

const VisaIcon = () => (<svg width="36" height="23" viewBox="0 0 38 24" style={{ borderRadius:'3px', border:'1px solid #e5e7eb' }}><rect width="38" height="24" rx="3" fill="#fff"/><text x="4" y="17" fontFamily="Arial" fontWeight="bold" fontSize="13" fill="#1a1f71">VISA</text></svg>);
const McIcon = () => (<svg width="36" height="23" viewBox="0 0 38 24" style={{ borderRadius:'3px', border:'1px solid #e5e7eb' }}><rect width="38" height="24" rx="3" fill="#fff"/><circle cx="15" cy="12" r="7" fill="#EB001B"/><circle cx="23" cy="12" r="7" fill="#F79E1B"/><path d="M19 6.5a7 7 0 0 1 0 11A7 7 0 0 1 19 6.5z" fill="#FF5F00"/></svg>);
const PaymentIcons = () => (<div style={{ display:'flex', alignItems:'center', gap:'4px', flexWrap:'wrap' }}><VisaIcon /><McIcon /><svg width="36" height="23" viewBox="0 0 38 24" style={{ borderRadius:'3px', border:'1px solid #e5e7eb' }}><rect width="38" height="24" rx="3" fill="#2557D6"/><text x="3" y="17" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="#fff">AMEX</text></svg><svg width="36" height="23" viewBox="0 0 38 24" style={{ borderRadius:'3px', border:'1px solid #e5e7eb' }}><rect width="38" height="24" rx="3" fill="#fff"/><text x="4" y="15" fontFamily="Arial" fontWeight="700" fontSize="8" fill="#000">Apple</text><text x="4" y="22" fontFamily="Arial" fontSize="8" fill="#000">Pay</text></svg><svg width="36" height="23" viewBox="0 0 38 24" style={{ borderRadius:'3px', border:'1px solid #e5e7eb' }}><rect width="38" height="24" rx="3" fill="#fff"/><text x="3" y="15" fontFamily="Arial" fontWeight="700" fontSize="9" fill="#4285F4">G</text><text x="12" y="15" fontFamily="Arial" fontSize="8" fill="#333">Pay</text></svg><svg width="36" height="23" viewBox="0 0 38 24" style={{ borderRadius:'3px', border:'1px solid #e5e7eb' }}><rect width="38" height="24" rx="3" fill="#fff"/><text x="2" y="17" fontFamily="Arial" fontWeight="700" fontSize="9" fill="#003087">Pay</text><text x="18" y="17" fontFamily="Arial" fontWeight="700" fontSize="9" fill="#009CDE">Pal</text></svg></div>);

export default function Checkout() {
  const storedUser = JSON.parse(localStorage.getItem('zylumia_user') || 'null');
  const [cart, setCart] = useState<any>(() => { try { const s = localStorage.getItem('zylumia_cart_cache'); if (s) { const p = JSON.parse(s); if (p?.items?.length > 0) return p; } } catch {} return { items: [], subtotal: 0, total: 0 }; });
  const [nome, setNome] = useState(storedUser?.name?.split(' ')[0] || '');
  const [sobrenome, setSobrenome] = useState(storedUser?.name?.split(' ').slice(1).join(' ') || '');
  const [email, setEmail] = useState(storedUser?.email || '');
  const [telefone, setTelefone] = useState('');
  const [pais, setPais] = useState('US');
  const [endereco, setEndereco] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const addrConfig = getAddressConfig(pais);
  const [cupom, setCupom] = useState('');
  const [desconto, setDesconto] = useState(0);
  const [cupomAplicado, setCupomAplicado] = useState<any>(null);
  const [loadingCupom, setLoadingCupom] = useState(false);
  const [erroCupom, setErroCupom] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setExpressAvailable] = useState(false);
  const [policyModal, setPolicyModal] = useState<null | 'refund' | 'shipping' | 'privacy' | 'terms'>(null);
  const policyTitles: Record<string, string> = { refund:'Refund Policy', shipping:'Shipping Policy', privacy:'Privacy Policy', terms:'Terms of Service' };
  const stripeRef = useRef<any>(null);
  const subtotal = cart?.items?.length ? cart.items.reduce((acc: number, item: any) => acc + (item.price * (item.qty || item.quantity || 1)), 0) : (cart?.subtotal || 0);
  const totalFinal = Math.max(subtotal - desconto, 0);

  useEffect(() => { async function load() { const cached = (() => { try { return JSON.parse(localStorage.getItem('zylumia_cart_cache') || ''); } catch { return null; } })(); if (cached?.items?.length > 0) setCart(cached); const sessionId = getOrCreateSessionId(); if (cached?.items?.length > 0) { await saveCartToBackend(cached.items, sessionId).catch(() => {}); } const bc = await withRetry(() => loadCartFromBackend(sessionId)).catch(() => null); if (bc?.items?.length > 0) { saveCartToCache(bc.items); setCart(bc); if (bc.coupon && bc.discount > 0) { setCupomAplicado(bc.coupon); setDesconto(bc.discount); setCupom(bc.coupon.code || ''); localStorage.setItem('zylumia_coupon', bc.coupon.code); } } } load(); }, []);

  useEffect(() => { if (!email.includes('@') || !cart?.items?.length) return; const sid = localStorage.getItem('zylumia_session_id'); if (!sid) return; const t = setTimeout(() => { fetch(API+'/api/recovery/track', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sessionId: sid, email: email.trim().toLowerCase(), items: cart.items, total: cart.total || subtotal }) }).catch(() => {}); }, 2000); return () => clearTimeout(t); }, [email, cart]);

  async function aplicarCupom() { const sid = localStorage.getItem('zylumia_session_id'); const code = cupom.trim().toUpperCase(); if (!code || !sid) return; setLoadingCupom(true); setErroCupom(''); try { const r = await fetch(API+'/api/cart/'+sid+'/coupon', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ code }) }); const data = await r.json(); if (data.success) { setCupomAplicado(data.coupon); setDesconto(data.discount || parseFloat((subtotal * ((data.coupon.discountPercent || 0) / 100)).toFixed(2)) || 0); localStorage.setItem('zylumia_coupon', code); setErroCupom(''); } else { setErroCupom(data.message || 'Invalid coupon.'); setCupomAplicado(null); setDesconto(0); } } catch { setErroCupom('Error applying coupon.'); } finally { setLoadingCupom(false); } }

  const handlePayNow = async () => { if (!nome || !sobrenome || !email || !endereco || !cidade || !estado || !cep) { setErro('Please fill in all required fields.'); return; } setLoading(true); setErro(''); try { if (stripeRef.current) { const result = await stripeRef.current.processPayment({ customerEmail: email, customerName: nome+' '+sobrenome, cartItems: cart.items, couponCode: localStorage.getItem('zylumia_coupon') || undefined, billingDetails: { nome, sobrenome, email, telefone, pais, endereco, complemento, cidade, estado, cep, address: { line1: endereco, line2: complemento, city: cidade, state: estado, postal_code: cep, country: pais } } }); if (result?.success) { window.location.href = '/checkout/sucesso?order='+(result.order?.id || 'ORDER'); } else if (result?.error) { setErro(result.error); } } else { throw new Error('Stripe not initialised'); } } catch (err: any) { setErro(err.message || 'Connection error.'); } finally { setLoading(false); } };

  const inputStyle: React.CSSProperties = { width:'100%', padding:'11px 12px', border:'1px solid #d1d5db', borderRadius:'6px', fontSize:'14px', outline:'none', boxSizing:'border-box', fontFamily:'inherit', background:'#fff', color:'#111827' };
  const labelStyle: React.CSSProperties = { display:'block', fontSize:'13px', fontWeight:500, color:'#374151', marginBottom:'5px' };
  const sH: React.CSSProperties = { fontSize:'18px', fontWeight:600, margin:'0 0 16px 0', color:'#111827' };
  const paypalProd = { name: cart.items?.length === 1 ? cart.items[0].name : (cart.items?.reduce((a:number,i:any)=>a+(i.qty||i.quantity||1),0)||0)+' items (Zylumia)', price: totalFinal, image: cart.items?.[0]?.image || '' };

  return (
    <div style={{ minHeight:'100vh', backgroundColor:'#fff', fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', fontSize:'14px', lineHeight:'21px', color:'#111827' }}>
      <style>{`
        .co-wrap{display:flex;max-width:1200px;margin:0 auto;min-height:100vh}
        .co-left{flex:1.1;padding:40px 5%;border-right:1px solid #e5e7eb}
        .co-right{flex:0.9;padding:40px 5%;background:#f9fafb}
        .co-mh{display:none}.co-dk{display:block}.co-mb{display:none}.co-pp{display:block}.co-dv{display:flex}
        @media(max-width:800px){.co-wrap{flex-direction:column}.co-left,.co-right{padding:16px 14px;border-right:none}.co-right{order:2;border-bottom:1px solid #e5e7eb}.co-left{order:3}.co-mh{display:block;order:1;padding:14px 14px 0}.co-dk{display:none}.co-mb{display:block}.co-pp{display:none}.co-dv{display:none}.co-sw{margin:0 -14px;border-radius:0!important;border-left:none!important;border-right:none!important}}
        @media(max-width:380px){.co-left,.co-right,.co-mh{padding:12px 10px}}
        input:focus,select:focus{border-color:#111827!important;box-shadow:0 0 0 2px rgba(17,24,39,0.08)}
      `}</style>

      <div className="co-mh">
        <div style={{ textAlign:'center', marginBottom:'8px' }}><h1 style={{ fontSize:'26px', fontWeight:700, color:'#000', margin:0, fontFamily:'Georgia,serif' }}>Zylumia</h1></div>
        <div style={{ textAlign:'center', fontSize:'12px', color:'#6b7280', marginBottom:'14px' }}>Cart &rsaquo; <span style={{ color:'#374151', fontWeight:500 }}>Information</span> &rsaquo; Payment</div>
        <div style={{ marginBottom:'4px' }}>
          <div style={{ textAlign:'center', fontSize:'13px', color:'#6b7280', marginBottom:'10px' }}>Express checkout</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            <ZylumiaPayPalButton produto={paypalProd} cartItems={cart.items} customerName={nome+' '+sobrenome} customerEmail={email} customerPhone={addrConfig.phonePrefix+telefone} onSuccess={(order: any) => { localStorage.removeItem('zylumia_session_id'); localStorage.removeItem('zylumia_coupon'); window.location.href = '/checkout/sucesso?order='+order.id.substring(0,8).toUpperCase(); }} onError={() => alert('Payment error. Please try again.')} />
            <StripeExpressButtons totalFinal={totalFinal} customerEmail={email} customerName={nome+' '+sobrenome} cartItems={cart.items} onAvailable={setExpressAvailable} onSuccess={(id: string) => { window.location.href = '/checkout/sucesso?order='+id; }} onError={(msg: string) => alert(msg)} />
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'14px 0 0' }}><div style={{ flex:1, height:'1px', background:'#e5e7eb' }} /><span style={{ fontSize:'13px', color:'#9ca3af' }}>OR</span><div style={{ flex:1, height:'1px', background:'#e5e7eb' }} /></div>
      </div>

      <div className="co-wrap">
        <div className="co-left">
          <div className="co-dk" style={{ marginBottom:'28px' }}><h1 style={{ fontSize:'28px', fontWeight:700, color:'#000', margin:'0 0 6px', fontFamily:'Georgia,serif' }}>Zylumia</h1><div style={{ fontSize:'12px', color:'#6b7280' }}>Cart &rsaquo; <span style={{ color:'#374151', fontWeight:500 }}>Information</span> &rsaquo; Payment</div></div>

          <div className="co-pp" style={{ marginBottom:'20px' }}>
            <div style={{ textAlign:'center', fontSize:'13px', color:'#6b7280', marginBottom:'10px' }}>Express checkout</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              <ZylumiaPayPalButton produto={paypalProd} cartItems={cart.items} customerName={nome+' '+sobrenome} customerEmail={email} customerPhone={addrConfig.phonePrefix+telefone} onSuccess={(order: any) => { localStorage.removeItem('zylumia_session_id'); localStorage.removeItem('zylumia_coupon'); window.location.href = '/checkout/sucesso?order='+order.id.substring(0,8).toUpperCase(); }} onError={() => alert('Payment error. Please try again.')} />
              <StripeExpressButtons totalFinal={totalFinal} customerEmail={email} customerName={nome+' '+sobrenome} cartItems={cart.items} onAvailable={setExpressAvailable} onSuccess={(id: string) => { window.location.href = '/checkout/sucesso?order='+id; }} onError={(msg: string) => alert(msg)} />
            </div>
          </div>
          <div className="co-dv" style={{ alignItems:'center', gap:'12px', margin:'0 0 24px' }}><div style={{ flex:1, height:'1px', background:'#e5e7eb' }} /><span style={{ fontSize:'13px', color:'#9ca3af' }}>OR</span><div style={{ flex:1, height:'1px', background:'#e5e7eb' }} /></div>

          <div style={{ marginBottom:'24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}><h2 style={sH}>Contact</h2><span style={{ color:'#6b7280', fontSize:'13px' }}>Have an account? <a href="#" style={{ color:'#111827', textDecoration:'underline' }}>Log in</a></span></div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" style={inputStyle} />
          </div>

          <div style={{ marginBottom:'24px' }}>
            <h2 style={sH}>Delivery</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              <div><label style={labelStyle}>Country / Region</label><select value={pais} onChange={e => { setPais(e.target.value); setEstado(''); setCep(''); }} style={inputStyle}>{COUNTRIES.map(c => (<option key={c.code} value={c.code}>{c.flag} {c.name}</option>))}</select></div>
              <div style={{ display:'flex', gap:'10px' }}><div style={{ flex:1, minWidth:0 }}><label style={labelStyle}>First name</label><input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="John" style={inputStyle} /></div><div style={{ flex:1, minWidth:0 }}><label style={labelStyle}>Last name</label><input type="text" value={sobrenome} onChange={e => setSobrenome(e.target.value)} placeholder="Smith" style={inputStyle} /></div></div>
              <div><label style={labelStyle}>{addrConfig.streetLabel}</label><input type="text" value={endereco} onChange={e => setEndereco(e.target.value)} placeholder={addrConfig.streetPlaceholder} style={inputStyle} /></div>
              <div><label style={labelStyle}>{addrConfig.complementLabel}</label><input type="text" value={complemento} onChange={e => setComplemento(e.target.value)} placeholder={addrConfig.complementPlaceholder} style={inputStyle} /></div>
              <div><label style={labelStyle}>{addrConfig.cityLabel}</label><input type="text" value={cidade} onChange={e => setCidade(e.target.value)} placeholder={addrConfig.cityLabel} style={inputStyle} /></div>
              <div style={{ display:'flex', gap:'10px' }}><div style={{ flex:2, minWidth:0 }}><label style={labelStyle}>{addrConfig.stateLabel}</label>{addrConfig.stateOptions ? (<select value={estado} onChange={e => setEstado(e.target.value)} style={inputStyle}><option value="">{addrConfig.statePlaceholder}...</option>{addrConfig.stateOptions.map(s => (<option key={s.code} value={s.code}>{s.name}</option>))}</select>) : (<input type="text" value={estado} onChange={e => setEstado(e.target.value)} placeholder={addrConfig.statePlaceholder} style={inputStyle} />)}</div><div style={{ flex:1, minWidth:0 }}><label style={labelStyle}>{addrConfig.postalLabel}</label><input type="text" value={cep} onChange={e => setCep(e.target.value)} placeholder={addrConfig.postalPlaceholder} style={inputStyle} maxLength={12} /></div></div>
              <div><label style={labelStyle}>Phone <span style={{ fontWeight:400, color:'#9ca3af' }}>(optional)</span></label><div style={{ display:'flex' }}><div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'0 12px', border:'1px solid #d1d5db', borderRight:'none', borderRadius:'6px 0 0 6px', background:'#f9fafb', fontSize:'14px', color:'#374151', fontWeight:500, whiteSpace:'nowrap', minWidth:'52px' }}>{addrConfig.phonePrefix}</div><input type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="555-555-5555" style={{ ...inputStyle, borderRadius:'0 6px 6px 0', flex:1, minWidth:0 }} /></div></div>
            </div>
          </div>

          <div style={{ marginBottom:'24px' }}>
            <h2 style={sH}>Shipping method</h2>
            <div style={{ border:'2px solid #111827', borderRadius:'8px', padding:'14px 16px', background:'#f9fafb', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}><div style={{ width:'18px', height:'18px', borderRadius:'50%', border:'6px solid #111827', background:'#fff', flexShrink:0 }} /><div><div style={{ fontWeight:600, color:'#111827' }}>Free shipping</div><div style={{ fontSize:'12px', color:'#6b7280', marginTop:'2px' }}>Fast & secure delivery</div></div></div>
              <div style={{ fontWeight:600, color:'#059669' }}>FREE</div>
            </div>
          </div>

          <div style={{ marginBottom:'28px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px' }}><h2 style={{ ...sH, marginBottom:0 }}>Payment</h2><div style={{ display:'flex', gap:'4px' }}><VisaIcon /><McIcon /></div></div>
            <div style={{ fontSize:'12px', color:'#6b7280', marginBottom:'14px', display:'flex', alignItems:'center', gap:'4px' }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>All transactions are secure and encrypted.</div>
            <div className="co-sw" style={{ border:'1px solid #d1d5db', borderRadius:'8px', overflow:'hidden' }}>
              <div style={{ padding:'12px 14px', background:'#f9fafb', borderBottom:'1px solid #d1d5db', display:'flex', justifyContent:'space-between', alignItems:'center' }}><div style={{ display:'flex', alignItems:'center', gap:'8px' }}><div style={{ width:'16px', height:'16px', borderRadius:'50%', border:'5px solid #111827', background:'#fff', flexShrink:0 }} /><span style={{ fontSize:'14px', fontWeight:500, color:'#111827' }}>Credit / debit card</span></div><div style={{ display:'flex', gap:'4px' }}><VisaIcon /><McIcon /></div></div>
              <div style={{ padding:'16px 14px', background:'#fff' }}><StripeCheckout ref={stripeRef} customerName={nome+' '+sobrenome} customerPhone={telefone} phonePrefix={addrConfig.phonePrefix} /></div>
            </div>
          </div>

          {erro && <div style={{ padding:'12px 14px', background:'#fef2f2', color:'#b91c1c', borderRadius:'8px', marginBottom:'20px', fontSize:'14px', border:'1px solid #fecaca' }}>{erro}</div>}

          <button onClick={handlePayNow} disabled={loading} style={{ width:'100%', height:'52px', background:loading?'#4b5563':'#111827', color:'#fff', border:'none', borderRadius:'8px', fontSize:'15px', fontWeight:600, cursor:loading?'not-allowed':'pointer', opacity:loading?0.75:1, letterSpacing:'0.02em' }}>{loading ? 'Processing...' : 'PAY NOW \u2014 US$ '+totalFinal.toFixed(2)}</button>

          <div style={{ marginTop:'12px', textAlign:'center' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', marginBottom:'8px' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span style={{ fontSize:'12px', fontWeight:600, color:'#374151' }}>365-Day Money Back Guarantee</span></div>
            <div style={{ display:'flex', justifyContent:'center' }}><PaymentIcons /></div>
          </div>

          <div style={{ marginTop:'20px', borderTop:'1px solid #e5e7eb', paddingTop:'16px', display:'flex', gap:'16px', flexWrap:'wrap', fontSize:'12px' }}>
            {(['refund','shipping','privacy','terms'] as const).map(k => (<button key={k} onClick={() => setPolicyModal(k)} style={{ background:'none', border:'none', color:'#6b7280', fontSize:'12px', cursor:'pointer', padding:0, textDecoration:'underline' }}>{policyTitles[k]}</button>))}
          </div>
          <div className="co-mb"><ReviewsAndGuarantees /></div>
        </div>

        <div className="co-right">
          <div style={{ position:'sticky', top:'40px' }}>
            {(cart.items||[]).map((item: any, idx: number) => (<div key={idx} style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'20px' }}><div style={{ position:'relative', flexShrink:0 }}><div style={{ width:'64px', height:'64px', border:'1px solid #e5e7eb', borderRadius:'8px', overflow:'hidden', background:'#fff' }}><img src={item.image||''} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /></div><div style={{ position:'absolute', top:'-8px', right:'-8px', width:'20px', height:'20px', background:'rgba(107,114,128,0.9)', color:'#fff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:600 }}>{item.qty||item.quantity||1}</div></div><div style={{ flex:1, minWidth:0 }}><div style={{ fontWeight:500, color:'#374151', fontSize:'13px', lineHeight:1.3 }}>{item.name}</div></div><div style={{ fontWeight:500, color:'#374151', flexShrink:0 }}>US$ {(item.price*(item.qty||item.quantity||1)).toFixed(2)}</div></div>))}
            <div style={{ borderTop:'1px solid #e5e7eb', borderBottom:'1px solid #e5e7eb', padding:'18px 0', marginBottom:'18px' }}>
              <div style={{ display:'flex', gap:'8px' }}>
                <input type="text" placeholder="Discount code" value={cupom} onChange={e => setCupom(e.target.value.toUpperCase())} disabled={!!cupomAplicado} style={{ flex:1, padding:'10px 12px', border:'1px solid #d1d5db', borderRadius:'6px', fontSize:'14px', outline:'none' }} />
                {!cupomAplicado ? (<button onClick={aplicarCupom} disabled={loadingCupom || !cupom} style={{ background:'#111827', color:'#fff', border:'none', borderRadius:'6px', padding:'10px 18px', fontWeight:600, cursor:loadingCupom||!cupom?'not-allowed':'pointer', opacity:loadingCupom||!cupom?0.5:1, fontSize:'14px' }}>{loadingCupom ? '...' : 'Apply'}</button>) : (<button onClick={() => { setCupomAplicado(null); setDesconto(0); setCupom(''); localStorage.removeItem('zylumia_coupon'); }} style={{ background:'#ef4444', color:'#fff', border:'none', borderRadius:'6px', padding:'10px 18px', fontWeight:600, cursor:'pointer', fontSize:'14px' }}>Remove</button>)}
              </div>
              {cupomAplicado && <p style={{ color:'#059669', fontSize:'13px', marginTop:'6px' }}>\u2713 {cupomAplicado.code} \u2014 {cupomAplicado.discountPercent}% off applied!</p>}
              {erroCupom && <p style={{ color:'#dc2626', fontSize:'13px', marginTop:'6px' }}>{erroCupom}</p>}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'14px', color:'#374151' }}><span>Subtotal</span><span>US$ {subtotal.toFixed(2)}</span></div>
              {desconto > 0 && <div style={{ display:'flex', justifyContent:'space-between', fontSize:'14px', color:'#059669', fontWeight:500 }}><span>Discount ({cupomAplicado?.discountPercent ? cupomAplicado.discountPercent+'% off' : (cupomAplicado?.code || 'Coupon')})</span><span>-US$ {desconto.toFixed(2)}</span></div>}
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'14px', color:'#374151' }}><span>Shipping</span><span style={{ color:'#059669', fontWeight:500 }}>Free</span></div>
              <hr style={{ border:'none', borderTop:'1px solid #e5e7eb', margin:'4px 0' }} />
              <div style={{ display:'flex', justifyContent:'space-between', fontWeight:700, fontSize:'18px', color:'#111827' }}><span>Total</span><span>US$ {totalFinal.toFixed(2)}</span></div>
              <div style={{ fontSize:'11px', color:'#9ca3af', textAlign:'right' }}>Including taxes</div>
            </div>
            <div className="co-dk"><ReviewsAndGuarantees /></div>
          </div>
        </div>
      </div>

      {policyModal && (<div onClick={() => setPolicyModal(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:9999, display:'flex', alignItems:'flex-end', justifyContent:'center' }}><div onClick={e => e.stopPropagation()} style={{ background:'#fff', borderRadius:'16px 16px 0 0', width:'100%', maxWidth:'640px', maxHeight:'85vh', display:'flex', flexDirection:'column', boxShadow:'0 -8px 32px rgba(0,0,0,0.12)' }}><div style={{ padding:'18px 20px 14px', borderBottom:'1px solid #f3f4f6', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}><h3 style={{ fontSize:'17px', fontWeight:700, color:'#111', margin:0 }}>{policyTitles[policyModal]}</h3><button onClick={() => setPolicyModal(null)} style={{ background:'#f3f4f6', border:'none', borderRadius:'50%', width:'32px', height:'32px', cursor:'pointer', fontSize:'18px', color:'#374151', display:'flex', alignItems:'center', justifyContent:'center' }}>\u00d7</button></div><div style={{ overflowY:'auto', padding:'20px 20px 40px', flex:1 }}><PolicyModalContent type={policyModal} /></div></div></div>)}
    </div>
  );
}
