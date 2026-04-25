declare global { interface Window { dataLayer: Record<string, any>[] } }
function push(event: Record<string, any>) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push(event)
}
export interface GTMItem { item_name: string; item_id?: string; price: number; quantity: number; item_brand?: string; item_category?: string }
export function gtmViewItem(item: GTMItem, value?: number) { push({ event: 'view_item', ecommerce: { currency: 'USD', value: value ?? item.price, items: [item] } }) }
export function gtmSelectItem(item: GTMItem) { push({ event: 'select_item', ecommerce: { items: [item] } }) }
export function gtmAddToCart(item: GTMItem, value?: number) { push({ event: 'add_to_cart', ecommerce: { currency: 'USD', value: value ?? item.price * item.quantity, items: [item] } }) }
export function gtmRemoveFromCart(item: GTMItem, value?: number) { push({ event: 'remove_from_cart', ecommerce: { currency: 'USD', value: value ?? item.price * item.quantity, items: [item] } }) }
export function gtmViewCart(items: GTMItem[], value: number) { push({ event: 'view_cart', ecommerce: { currency: 'USD', value, items } }) }
export function gtmBeginCheckout(items: GTMItem[], value: number, coupon?: string) { push({ event: 'begin_checkout', ecommerce: { currency: 'USD', value, coupon: coupon || '', items } }) }
export function gtmPurchase(params: { transaction_id: string; value: number; tax?: number; shipping?: number; coupon?: string; items: GTMItem[] }) { push({ event: 'purchase', ecommerce: { transaction_id: params.transaction_id, currency: 'USD', value: params.value, tax: params.tax ?? 0, shipping: params.shipping ?? 0, coupon: params.coupon ?? '', items: params.items } }) }
