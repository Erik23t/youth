import React, { useState, useImperativeHandle, forwardRef, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { API } from '../config/api';
import { withRetry } from '../services/errorService';
import { getOrCreateSessionId, saveCartToBackend } from '../services/cartService';

let stripePromise: any = null;
function getStripePromise() {
  if (!stripePromise) stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  return stripePromise;
}

const elementStyle = {
  style: {
    base: {
      fontSize: '14px',
      color: '#111827',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#dc2626' },
  },
};

const CheckoutFormInner = forwardRef<any, any>(({ customerPhone, customerName: customerNameProp, phonePrefix = '+1' }, ref) => {
  const stripe = useStripe();
  const elements = useElements();
  const initPhone = () => {
    if (!customerPhone) return '';
    if (customerPhone.startsWith(phonePrefix)) return customerPhone.slice(phonePrefix.length).trim();
    return customerPhone;
  };
  const [cardName, setCardName] = useState(customerNameProp || '');
  const [phoneNum, setPhoneNum] = useState(initPhone);
  const [useShippingBilling, setUseShippingBilling] = useState(true);

  useImperativeHandle(ref, () => ({
    async processPayment(checkoutData: any) {
      try {
        if (!stripe || !elements) return { success: false, error: 'Stripe not loaded. Please wait.' };
        const cardElement = elements.getElement(CardNumberElement);
        if (!cardElement) return { success: false, error: 'Card element not found.' };
        const sessionId = getOrCreateSessionId();
        const { customerEmail, customerName, cartItems, billingDetails } = checkoutData;
        const cartSaved = await withRetry(() => saveCartToBackend(cartItems, sessionId, billingDetails));
        if (!cartSaved) return { success: false, error: 'Error saving cart. Try again.' };
        const intentRes = await fetch(`${API}/api/stripe/create-payment-intent`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: localStorage.getItem('zylumia_session_id'), customerEmail, customerName, couponCode: localStorage.getItem('zylumia_coupon') || undefined }),
        });
        const intentData = await intentRes.json();
        if (!intentData.success || !intentData.clientSecret) return { success: false, error: intentData.message || 'Error creating payment.' };
        const { error, paymentIntent } = await stripe.confirmCardPayment(intentData.clientSecret, {
          payment_method: { card: cardElement as any, billing_details: { name: cardName || customerNameProp || '', phone: phoneNum ? `${phonePrefix}${phoneNum}` : (customerPhone || ''), email: customerEmail, address: billingDetails?.address } },
        });
        if (error) return { success: false, error: error.message };
        if (paymentIntent?.status === 'succeeded') {
          const confirmRes = await fetch(`${API}/api/stripe/confirm-payment`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentIntentId: paymentIntent.id, customerEmail, customerName }) });
          const confirmData = await confirmRes.json();
          if (confirmData.success) { localStorage.removeItem('zylumia_session_id'); localStorage.removeItem('zylumia_coupon'); return confirmData; }
          return { success: false, error: confirmData.message || 'Error confirming.' };
        }
        return { success: false, error: 'Payment not completed.' };
      } catch (e: any) { return { success: false, error: e.message || 'Unexpected error.' }; }
    },
  }), [stripe, elements, cardName, phoneNum, phonePrefix, customerPhone]);

  const inputBase: React.CSSProperties = { width: '100%', padding: '11px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fff', color: '#111827' };
  const labelBase: React.CSSProperties = { display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '5px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <label style={labelBase}>Card information</label>
        <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '11px 12px', background: '#fff', borderBottom: '1px solid #d1d5db', minHeight: '44px', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1 }}><CardNumberElement options={{ ...elementStyle, placeholder: '1234 1234 1234 1234' }} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{ padding: '11px 12px', background: '#fff', borderRight: '1px solid #d1d5db', minHeight: '44px', display: 'flex', alignItems: 'center' }}>
              <CardExpiryElement options={{ ...elementStyle, placeholder: 'MM / YY' }} />
            </div>
            <div style={{ padding: '11px 12px', background: '#fff', minHeight: '44px', display: 'flex', alignItems: 'center' }}>
              <CardCvcElement options={{ ...elementStyle, placeholder: 'CVC' }} />
            </div>
          </div>
        </div>
      </div>
      <div>
        <label style={labelBase}>Name on card</label>
        <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Full name as on card" style={inputBase} />
      </div>
      <div>
        <label style={labelBase}>Phone number <span style={{ fontWeight: 400, color: '#9ca3af' }}>(optional)</span></label>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 12px', border: '1px solid #d1d5db', borderRight: 'none', borderRadius: '6px 0 0 6px', background: '#f9fafb', fontSize: '14px', color: '#374151', fontWeight: 500, whiteSpace: 'nowrap', minWidth: '52px' }}>{phonePrefix}</div>
          <input type="tel" value={phoneNum} onChange={e => setPhoneNum(e.target.value)} placeholder="555-555-5555" style={{ ...inputBase, borderRadius: '0 6px 6px 0', flex: 1, minWidth: 0 }} />
        </div>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#374151', userSelect: 'none' }}>
        <input type="checkbox" checked={useShippingBilling} onChange={e => setUseShippingBilling(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#111827', cursor: 'pointer' }} />
        Use shipping address as billing address
      </label>
    </div>
  );
});
CheckoutFormInner.displayName = 'CheckoutFormInner';

const StripeCheckout = forwardRef<any, any>((props, ref) => {
  const innerRef = useRef<any>(null);
  useImperativeHandle(ref, () => ({ processPayment: (data: any) => innerRef.current ? innerRef.current.processPayment(data) : Promise.resolve({ success: false, error: 'Stripe not initialised.' }) }));
  return (<Elements stripe={getStripePromise()}><CheckoutFormInner {...props} ref={innerRef} /></Elements>);
});
StripeCheckout.displayName = 'StripeCheckout';
export default StripeCheckout;
