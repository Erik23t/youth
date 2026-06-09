import { ProductData } from '../types/product'

export const zylumiaSérum: ProductData = {
  id: 'zylumia-serum',
  rota: '/',
  nome: 'Cyperus Rotundus Skin Serum',
  subtitulo: 'Combined with peppermint, citrus and vitamin E.',
  descricao: 'Get smoother, hair-free skin with the only clinically proven Egyptian botanical serum that progressively weakens unwanted hair.',
  ingredientes: 'Cyperus Rotundus, peppermint, citrus and vitamin E',

  preco1mes: 44.80,
  preco3mes: 84.93,
  preco6mes: 134.40,

  imagemPrincipal: 'https://imagens.zylumia.com/cyperus-rotundus01.png',

  imagens: [
    'https://imagens.zylumia.com/cyperus-rotundus01.png',
    'https://imagens.zylumia.com/cyperus-rotundus02.png',
    'https://imagens.zylumia.com/cyperus-rotundus03.png',
    'https://imagens.zylumia.com/cyperus-rotundus033.png',
    'https://imagens.zylumia.com/cyperus-rotundus03333.png'
  ],

  bannerImages: [
    'https://imagens.zylumia.com/cyperus-rotunduss.png',
    'https://imagens.zylumia.com/cyperus-skin-serum.png',
    'https://imagens.zylumia.com/ccyperus-rotundus-skin.png'
  ],

  depoimentos: [
    {
      nome: 'Tran B.',
      verificado: true,
      video: '/media/depoimento-tran.mp4',
      texto: 'I used to get a dark shadow on my upper lip hours after shaving. Now my skin stays smooth for 4-5 days easily.'
    },
    {
      nome: 'Bri N.',
      verificado: true,
      video: '/media/depoimento-bri.mp4',
      texto: 'PCOS made my chin grow many coarse stubborn hairs. This serum changed my life.'
    },
    {
      nome: 'Dana A.',
      verificado: true,
      video: '/media/depoimento-dana.mp4',
      texto: 'Six weeks later and I no longer spend 20 minutes every morning hunting chin hairs.'
    },
    {
      nome: 'Sarah M.',
      verificado: true,
      video: '/media/depoimento-sarah.mp4',
      texto: 'I was skeptical at first, but the results spoke for themselves.'
    }
  ],

  faqs: [
    {
      q: 'Does this help eliminate unwanted hair?',
      a: 'Yes! Zylumia™ contains Cyperus Rotundus extract, clinically proven to progressively weaken the hair root. With continued use, hair grows thinner, lighter and much slower.'
    },
    {
      q: 'How long until I see results?',
      a: 'Most users notice slower growth and thinner hair within the first or second week of consistent use.'
    },
    {
      q: 'Are there any side effects?',
      a: 'Our botanical formula is extremely gentle and well tolerated. No users have reported significant side effects.'
    },
    {
      q: 'Does this affect my hormones?',
      a: 'No. Zylumia™ works exclusively locally on the hair follicle and does not interfere with the hormonal system.'
    },
    {
      q: 'Can I return it if I do not like it?',
      a: 'Absolutely! We offer a full 365-day money-back guarantee — no hassle, no questions asked.'
    },
    {
      q: 'When will I receive my order?',
      a: 'We process within 24 business hours. Delivery within 7 to 15 business days with tracking code sent by email.'
    }
  ],

  metaTitle: 'Zylumia™ — Cyperus Rotundus Serum | Hair Reduction',
  metaDescription: 'Clinically proven Egyptian botanical serum to reduce hair growth. Free shipping and 365-day guarantee.'
}
