export interface ProductData {
  id: string
  rota: string
  nome: string
  subtitulo: string
  descricao: string
  ingredientes: string

  // Preços
  preco1mes: number
  preco3mes: number
  preco6mes: number

  // Imagens
  imagemPrincipal: string
  imagens: string[]
  bannerImages: string[]

  // Conteúdo
  depoimentos: {
    nome: string
    texto: string
    video?: string
    verificado?: boolean
  }[]

  faqs: {
    q: string
    a: string
  }[]

  // SEO
  metaTitle?: string
  metaDescription?: string
}
