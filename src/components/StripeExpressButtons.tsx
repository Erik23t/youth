import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import { API } from '../config/api';
import { getOrCreateSessionId, saveCartToBackend } from '../services/cartService';

let stripePromise: any = null;
function getStripePromise() {
  if (!stripePromise) stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  return stripePromise;
}

interface Props {
  totalFinal: number; customerEmail: string; customerName: string;
  cartItems: any[]; onSuccess: (id: string) => void;
  onError: (msg: string) => void; onAvailable?: (v: boolean) => void;
}

function Inner({ totalFinal, customerEmail, customerName, cartItems, onSuccess, onError, onAvailable }: Props) {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  useEffect(() => {
    if (!stripe || totalFinal <= 0) return;
    const pr = stripe.paymentRequest({
      country: 'US', currency: 'usd',
      total: { label: 'Zylumia Serum', amount: Math.round(totalFinal * 100) },
      requestPayerName: true, requestPayerEmail: true,
    });
    pr.canMakePayment().then((result: any) => {
      if (result && (result.googlePay || result.applePay)) { setPaymentRequest(pr); onAvailable?.(true); } else { onAvailable?.(false); }
    });
    pr.on('paymentmethod', async (event: any) => {
      try {
        await saveCartToBackend(cartItems, getOrCreateSessionId(), {});
        const intentRes = await fetch(`${API}/api/stripe/create-payment-intent`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: localStorage.getItem('zylumia_session_id'),
            customerEmail: event.payerEmail || customerEmail,
            customerName: event.payerName || customerName,
            couponCode: localStorage.getItem('zylumia_coupon') || undefined }),
        });
        const intentData = await intentRes.json();
        if (!intentData.success || !intentData.clientSecret) {
          event.complete('fail'); onError(intentData.message || 'Erro ao criar pagamento.'); return;
        }
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          intentData.clientSecret, { payment_method: event.paymentMethod.id }, { handleActions: false }
        );
        if (error) { event.complete('fail'); onError(error.message || 'Erro.'); return; }
        event.complete('success');
        if (paymentIntent?.status === 'requires_action') {
          const { error: e2 } = await stripe.confirmCardPayment(intentData.clientSecret);
          if (e2) { onError(e2.message || ''); return; }
        }
        const confirmRes = await fetch(`${API}/api/stripe/confirm-payment`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId: paymentIntent!.id,
            customerEmail: event.payerEmail || customerEmail,
            customerName: event.payerName || customerName }),
        });
        const confirmData = await confirmRes.json();
        if (confirmData.success) {
          localStorage.removeItem('zylumia_session_id'); localStorage.removeItem('zylumia_coupon');
          onSuccess(confirmData.orderId || paymentIntent!.id.substring(0, 8).toUpperCase());
        } else { onError(confirmData.message || 'Erro ao confirmar.'); }
      } catch (e: any) { event.complete('fail'); onError(e.message || 'Erro inesperado.'); }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe, totalFinal]);

  if (!paymentRequest) return null;
  return (
    <PaymentRequestButtonElement options={{
      paymentRequest,
      style: { paymentRequestButton: { type: 'buy', theme: 'dark', height: '48px' } },
    }} />
  );
}

export default function StripeExpressButtons(props: Props) {
  return <Elements stripe={getStripePromise()}><Inner {...props} /></Elements>;
}
