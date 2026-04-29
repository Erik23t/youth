// Utilitário de formatação de moeda por país
export const CURRENCY_MAP: Record<string, { code: string; symbol: string; locale: string; flag: string; name: string }> = {
  BR: { code: 'BRL', symbol: 'R$',   locale: 'pt-BR', flag: '🇧🇷', name: 'Brasil' },
  US: { code: 'USD', symbol: 'US$',  locale: 'en-US', flag: '🇺🇸', name: 'United States' },
  CA: { code: 'CAD', symbol: 'CA$',  locale: 'en-CA', flag: '🇨🇦', name: 'Canada' },
  MX: { code: 'MXN', symbol: 'MX$',  locale: 'es-MX', flag: '🇲🇽', name: 'México' },
  AR: { code: 'USD', symbol: 'US$',  locale: 'en-US', flag: '🇦🇷', name: 'Argentina' },
  DE: { code: 'EUR', symbol: '€',    locale: 'de-DE', flag: '🇩🇪', name: 'Deutschland' },
  FR: { code: 'EUR', symbol: '€',    locale: 'fr-FR', flag: '🇫🇷', name: 'France' },
  ES: { code: 'EUR', symbol: '€',    locale: 'es-ES', flag: '🇪🇸', name: 'España' },
  IT: { code: 'EUR', symbol: '€',    locale: 'it-IT', flag: '🇮🇹', name: 'Italia' },
  PT: { code: 'EUR', symbol: '€',    locale: 'pt-PT', flag: '🇵🇹', name: 'Portugal' },
  NL: { code: 'EUR', symbol: '€',    locale: 'nl-NL', flag: '🇳🇱', name: 'Netherlands' },
  BE: { code: 'EUR', symbol: '€',    locale: 'nl-BE', flag: '🇧🇪', name: 'Belgium' },
  AT: { code: 'EUR', symbol: '€',    locale: 'de-AT', flag: '🇦🇹', name: 'Austria' },
  GR: { code: 'EUR', symbol: '€',    locale: 'el-GR', flag: '🇬🇷', name: 'Greece' },
  FI: { code: 'EUR', symbol: '€',    locale: 'fi-FI', flag: '🇫🇮', name: 'Finland' },
  IE: { code: 'EUR', symbol: '€',    locale: 'en-IE', flag: '🇮🇪', name: 'Ireland' },
  LU: { code: 'EUR', symbol: '€',    locale: 'fr-LU', flag: '🇱🇺', name: 'Luxembourg' },
  SK: { code: 'EUR', symbol: '€',    locale: 'sk-SK', flag: '🇸🇰', name: 'Slovakia' },
  SI: { code: 'EUR', symbol: '€',    locale: 'sl-SI', flag: '🇸🇮', name: 'Slovenia' },
  EE: { code: 'EUR', symbol: '€',    locale: 'et-EE', flag: '🇪🇪', name: 'Estonia' },
  LV: { code: 'EUR', symbol: '€',    locale: 'lv-LV', flag: '🇱🇻', name: 'Latvia' },
  LT: { code: 'EUR', symbol: '€',    locale: 'lt-LT', flag: '🇱🇹', name: 'Lithuania' },
  CY: { code: 'EUR', symbol: '€',    locale: 'el-CY', flag: '🇨🇾', name: 'Cyprus' },
  MT: { code: 'EUR', symbol: '€',    locale: 'mt-MT', flag: '🇲🇹', name: 'Malta' },
  HR: { code: 'EUR', symbol: '€',    locale: 'hr-HR', flag: '🇭🇷', name: 'Croatia' },
  GB: { code: 'GBP', symbol: '£',    locale: 'en-GB', flag: '🇬🇧', name: 'United Kingdom' },
  CH: { code: 'CHF', symbol: 'CHF',  locale: 'de-CH', flag: '🇨🇭', name: 'Switzerland' },
  NO: { code: 'NOK', symbol: 'kr',   locale: 'nb-NO', flag: '🇳🇴', name: 'Norway' },
  SE: { code: 'SEK', symbol: 'kr',   locale: 'sv-SE', flag: '🇸🇪', name: 'Sweden' },
  DK: { code: 'DKK', symbol: 'kr',   locale: 'da-DK', flag: '🇩🇰', name: 'Denmark' },
  PL: { code: 'PLN', symbol: 'zł',   locale: 'pl-PL', flag: '🇵🇱', name: 'Poland' },
  CZ: { code: 'CZK', symbol: 'Kč',   locale: 'cs-CZ', flag: '🇨🇿', name: 'Czech Republic' },
  HU: { code: 'HUF', symbol: 'Ft',   locale: 'hu-HU', flag: '🇭🇺', name: 'Hungary' },
  RO: { code: 'RON', symbol: 'lei',  locale: 'ro-RO', flag: '🇷🇴', name: 'Romania' },
  BG: { code: 'BGN', symbol: 'лв',   locale: 'bg-BG', flag: '🇧🇬', name: 'Bulgaria' },
  AU: { code: 'AUD', symbol: 'A$',   locale: 'en-AU', flag: '🇦🇺', name: 'Australia' },
  NZ: { code: 'NZD', symbol: 'NZ$',  locale: 'en-NZ', flag: '🇳🇿', name: 'New Zealand' },
  JP: { code: 'JPY', symbol: '¥',    locale: 'ja-JP', flag: '🇯🇵', name: 'Japan' },
  SG: { code: 'SGD', symbol: 'S$',   locale: 'en-SG', flag: '🇸🇬', name: 'Singapore' },
}

export function getCurrencyInfo(countryOrCurrency?: string) {
  if (!countryOrCurrency) return CURRENCY_MAP['US']
  const upper = countryOrCurrency.toUpperCase()
  if (CURRENCY_MAP[upper]) return CURRENCY_MAP[upper]
  const found = Object.values(CURRENCY_MAP).find(c => c.code === upper)
  return found || CURRENCY_MAP['US']
}

export function formatPrice(value: number | string, countryOrCurrency?: string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '—'
  const { symbol, code } = getCurrencyInfo(countryOrCurrency)
  if (code === 'JPY') return `${symbol} ${Math.round(num)}`
  return `${symbol} ${num.toFixed(2).replace('.', ',')}`
}

export function getSavedCountry(): string {
  if (typeof window === 'undefined') return 'US'
  return localStorage.getItem('zylumia_country') || 'US'
}

export function saveCountry(countryCode: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('zylumia_country', countryCode)
  window.dispatchEvent(new CustomEvent('zylumia_country_changed', { detail: { country: countryCode } }))
}
