import React, { useState, useImperativeHandle, forwardRef, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

let stripePromise = null;
function getStripePromise() {
  if (!stripePromise) stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  return stripePromise;
}
const API = import.meta.env.VITE_API_URL || 'https://zylumia-backend-kmbrxbidkq-uc.a.run.app';

const elementStyle = {
  style: {
    base: {
      fontSize: '14px',
      color: '#000',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      '::placeholder': { color: '#aab7c4' },
    },
    invalid: { color: '#9e2146' },
  }
};

const CheckoutFormInner = forwardRef<any, any>(({ onSuccess, onError, customerPhone, customerName: customerNameProp }, ref) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardName, setCardName] = useState(customerNameProp || '');
  const [cardPhone, setCardPhone] = useState(customerPhone || '');
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);

  useImperativeHandle(ref, () => ({
    async processPayment(checkoutData: any) {
      try {
        if (!stripe || !elements) {
          return { success: false, error: 'Stripe Elements não carregou. Aguarde e tente novamente.' };
        }
        const cardElement = elements.getElement(CardNumberElement);
        if (!cardElement) {
          return { success: false, error: 'Elemento de cartão não encontrado.' };
        }
        const sessionId = localStorage.getItem('zylumia_session_id');
        const { customerEmail, customerName, cartItems, billingDetails } = checkoutData;

        await fetch(`${API}/api/cart`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, items: cartItems, customerInfo: billingDetails })
        });

        const intentR = await fetch(`${API}/api/stripe/create-payment-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: localStorage.getItem('zylumia_session_id'),
            customerEmail,
            customerName,
            couponCode: localStorage.getItem('zylumia_coupon') || undefined
          })
        });
        const intentData = await intentR.json();
        if (!intentData.success || !intentData.clientSecret) {
          return { success: false, error: intentData.message || 'Erro ao criar pagamento.' };
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(
          intentData.clientSecret,
          {
            payment_method: {
              card: cardElement as any,
              billing_details: {
                name: cardName || billingDetails?.customerName || customerNameProp || '',
                phone: cardPhone || customerPhone || billingDetails?.telefone || '',
                email: customerEmail,
                address: billingDetails?.address
              },
            },
          }
        );
        if (error) return { success: false, error: error.message };

        if (paymentIntent?.status === 'succeeded') {
          const confirmR = await fetch(`${API}/api/stripe/confirm-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentIntentId: paymentIntent.id, customerEmail, customerName })
          });
          const confirmData = await confirmR.json();
          if (confirmData.success) {
            localStorage.removeItem('zylumia_session_id');
            localStorage.removeItem('zylumia_coupon');
            return confirmData;
          } else {
            return { success: false, error: confirmData.message || 'Erro ao confirmar. Entre em contato.' };
          }
        }
        return { success: false, error: 'Pagamento não concluído.' };
      } catch (e: any) {
        console.error('ERRO STRIPE:', e);
        return { success: false, error: e.message || 'Erro inesperado.' };
      }
    }
  }), [stripe, elements, cardName]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <style>{`
        @media (max-width: 480px) {
          .stripe-expiry-cvc-grid {
            grid-template-columns: 1fr !important;
          }
          .stripe-expiry-cvc-grid > div label {
            min-height: auto !important;
          }
        }
      `}</style>
      <div>
        <label style={{ fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' }}>
          Número do cartão
        </label>
        <div style={{ padding: '12px', border: '1px solid #ddd6fe', borderRadius: '8px', background: '#faf9ff', minHeight: '44px' }}>
          <CardNumberElement options={elementStyle} />
        </div>
      </div>
      <div className="stripe-expiry-cvc-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'end' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block', minHeight: '32px', display: 'flex', alignItems: 'flex-end' }}>
            Validade (MM/AA)
          </label>
          <div style={{ padding: '12px', border: '1px solid #ddd6fe', borderRadius: '8px', background: '#faf9ff', minHeight: '44px' }}>
            <CardExpiryElement options={elementStyle} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'flex', alignItems: 'flex-end', minHeight: '32px' }}>
            Código de segurança
          </label>
          <div style={{ padding: '12px', border: '1px solid #ddd6fe', borderRadius: '8px', background: '#faf9ff', minHeight: '44px' }}>
            <CardCvcElement options={elementStyle} />
          </div>
        </div>
      </div>
      <div>
        <label style={{ fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' }}>
          Nome no cartão
        </label>
        <input
          type="text"
          placeholder="Nome como aparece no cartão"
          value={cardName}
          onChange={e => setCardName(e.target.value)}
          style={{
            width: '100%', padding: '12px',
            border: '1px solid #ddd6fe', borderRadius: '8px',
            fontSize: '14px', boxSizing: 'border-box' as any,
            outline: 'none', fontFamily: 'inherit',
            background: '#faf9ff',
          }}
        />
      </div>
      <div>
        <label style={{ fontSize: '12px', fontWeight: '500', color: '#374151', marginBottom: '6px', display: 'block' }}>
          Phone number <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span>
        </label>
        <input
          type="tel"
          placeholder="+1 555-555-5555"
          value={cardPhone}
          onChange={e => setCardPhone(e.target.value)}
          style={{
            width: '100%', padding: '12px',
            border: '1px solid #ddd6fe', borderRadius: '8px',
            fontSize: '14px', boxSizing: 'border-box' as any,
            outline: 'none', fontFamily: 'inherit',
            background: '#faf9ff',
          }}
        />
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#374151' }}>
        <input
          type="checkbox"
          checked={useShippingAsBilling}
          onChange={e => setUseShippingAsBilling(e.target.checked)}
          style={{ width: '16px', height: '16px', accentColor: '#7c3aed' }}
        />
        Usar endereço de entrega como endereço de cobrança
      </label>
    </div>
  );
});

CheckoutFormInner.displayName = 'CheckoutFormInner';

const StripeCheckout = forwardRef<any, any>((props, ref) => {
  const innerRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    processPayment: (data: any) => {
      if (innerRef.current) return innerRef.current.processPayment(data);
      return Promise.resolve({ success: false, error: 'Stripe não inicializado.' });
    }
  }));

  return (
    <Elements stripe={getStripePromise()}>
      <CheckoutFormInner {...props} ref={innerRef} />
    </Elements>
  );
});

StripeCheckout.displayName = 'StripeCheckout';

export default StripeCheckout;
