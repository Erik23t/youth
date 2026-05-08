import { useState } from 'react'
import { ProductData } from '../types/product'

export function useProductPrice(produto: ProductData, sanityProduto: any) {
  const [supplyMonths, setSupplyMonths] = useState<1|3|6>(3)
  const [purchaseType, setPurchaseType] = useState<'onetime'|'subscribe'>('onetime')
  const [mainImage, setMainImage] = useState(produto.imagens[0])
  const [currentProductImages, setCurrentProductImages] = useState(produto.imagens)

  const getPrice = (): number => {
    let price = sanityProduto?.preco1mes || produto.preco1mes
    if (supplyMonths === 3) price = sanityProduto?.preco3meses || produto.preco3mes
    if (supplyMonths === 6) price = sanityProduto?.preco6meses || produto.preco6mes
    return purchaseType === 'subscribe' ? Number((price * 0.8).toFixed(2)) : price
  }

  const getOldPrice = (): number => {
    const base = sanityProduto?.preco1mes || produto.preco1mes
    if (supplyMonths === 3) return base * 3
    if (supplyMonths === 6) return base * 6
    return base
  }

  return { supplyMonths, setSupplyMonths, purchaseType, setPurchaseType, mainImage, setMainImage, currentProductImages, getPrice, getOldPrice }
}
