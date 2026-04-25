// TEMPLATE PARA NOVOS PRODUTOS
// Copie este arquivo, renomeie e preencha os dados

import { ProductData } from '../types/product'

export const templateProduto: ProductData = {
  id: 'novo-produto',           // Altere
  rota: '/produto2',
  nome: 'Nome do Produto',       // Altere
  subtitulo: 'Subtítulo',        // Altere
  descricao: 'Descrição...',     // Altere
  ingredientes: 'Ingredientes',  // Altere

  preco1mes: 33.60,
  preco3mes: 63.70,
  preco6mes: 100.80,

  imagemPrincipal: 'URL_DA_IMAGEM_PRINCIPAL',
  imagens: [
    'URL_IMAGEM_1',
    'URL_IMAGEM_2',
    'URL_IMAGEM_3',
    'URL_IMAGEM_4',
    'URL_IMAGEM_5',
  ],
  bannerImages: [
    'URL_BANNER_1',
    'URL_BANNER_2',
    'URL_BANNER_3',
  ],

  depoimentos: [
    {
      nome: 'Cliente A.',
      verificado: true,
      video: 'URL_VIDEO',
      texto: 'Depoimento...'
    }
  ],

  faqs: [
    { q: 'Pergunta 1?', a: 'Resposta 1.' },
    { q: 'Pergunta 2?', a: 'Resposta 2.' },
  ],

  metaTitle: 'Título SEO',
  metaDescription: 'Descrição SEO'
}
