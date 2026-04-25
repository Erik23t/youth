import { useState } from 'react'

export function useSanity() {
  const [sanityProduto]    = useState<any>(null)
  const [sanityHero]       = useState<any>(null)
  const [sanityDepoimentos] = useState<any[]>([])
  return { sanityProduto, sanityHero, sanityDepoimentos }
}
