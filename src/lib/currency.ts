// Utilitário de formatação de moeda por país
export const CURRENCY_MAP: Record<string, { code: string; symbol: string; locale: string }> = {
  BR: { code: 'BRL', symbol: 'R$',  locale: 'pt-BR' },
  US: { code: 'USD', symbol: 'US$', locale: 'en-US' },
  GB: { code: 'GBP', symbol: '£',   locale: 'en-GB' },
  DE: { code: 'EUR', symbol: '€',   locale: 'de-DE' },
  FR: { code: 'EUR', symbol: '€',   locale: 'fr-FR' },
  ES: { code: 'EUR', symbol: '€',   locale: 'es-ES' },
  IT: { code: 'EUR', symbol: '€',   locale: 'it-IT' },
  PT: { code: 'EUR', symbol: '€',   locale: 'pt-PT' },
  NL: { code: 'EUR', symbol: '€',   locale: 'nl-NL' },
  BE: { code: 'EUR', symbol: '€',   locale: 'nl-BE' },
  AT: { code: 'EUR', symbol: '€',   locale: 'de-AT' },
  CH: { code: 'CHF', symbol: 'CHF', locale: 'de-CH' },
  CA: { code: 'CAD', symbol: 'CA$', locale: 'en-CA' },
  AU: { code: 'AUD', symbol: 'A$',  locale: 'en-AU' },
  MX: { code: 'MXN', symbol: 'MX$', locale: 'es-MX' },
  JP: { code: 'JPY', symbol: '¥',   locale: 'ja-JP' },
}

export function getCurrencyInfo(countryOrCurrency?: string) {
  if (!countryOrCurrency) return CURRENCY_MAP['BR']
  // Aceita código do país (BR) ou código de moeda (BRL)
  if (CURRENCY_MAP[countryOrCurrency]) return CURRENCY_MAP[countryOrCurrency]
  const found = Object.values(CURRENCY_MAP).find(c => c.code === countryOrCurrency.toUpperCase())
  return found || CURRENCY_MAP['BR']
}

export function formatPrice(value: number, countryOrCurrency?: string): string {
  const { symbol } = getCurrencyInfo(countryOrCurrency)
  return `${symbol} ${value.toFixed(2).replace('.', ',')}`
}
