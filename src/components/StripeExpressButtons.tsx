import React, { useState, useEffect, useRef, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import { API } from '../config/api';
import { getOrCreateSessionId, saveCartToBackend } from '../services/cartService';

declare global { interface Window { google?: any } }

let stripePromise: any = null;
const getStripePromise = () => {
  if (!stripePromise) stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  return stripePromise;
};

interface Props {
  totalFinal: number; customerEmail: string; customerName: string;
  cartItems: any[]; onSuccess: (id: string) => void;
  onError: (msg: string) => void; onAvailable?: (v: boolean) => void;
}

async function runStripePayment(stripe: any, paymentMethod: string | { card: { token: string } }, { customerEmail, customerName, cartItems, onSuccess, onError }: Pick<Props,'customerEmail'|'customerName'|'cartItems'|'onSuccess'|'onError'>): Promise<boolean> {
  await saveCartToBackend(cartItems, getOrCreateSessionId(), {});
  const intentRes = await fetch(`${API}/api/stripe/create-payment-intent`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: localStorage.getItem('zylumia_session_id'), customerEmail, customerName, couponCode: localStorage.getItem('zylumia_coupon') || undefined }),
  });
  const intentData = await intentRes.json();
  if (!intentData.success || !intentData.clientSecret) { onError(intentData.message || 'Error creating payment.'); return false; }
  const { error, paymentIntent } = await stripe.confirmCardPayment(intentData.clientSecret, { payment_method: paymentMethod }, { handleActions: false });
  if (error) { onError(error.message || 'Error.'); return false; }
  if (paymentIntent?.status === 'requires_action') {
    const { error: e2 } = await stripe.confirmCardPayment(intentData.clientSecret);
    if (e2) { onError(e2.message || ''); return false; }
  }
  const confirmRes = await fetch(`${API}/api/stripe/confirm-payment`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentIntentId: paymentIntent!.id, customerEmail, customerName }),
  });
  const confirmData = await confirmRes.json();
  if (confirmData.success) {
    localStorage.removeItem('zylumia_session_id'); localStorage.removeItem('zylumia_coupon');
    onSuccess(confirmData.orderId || paymentIntent!.id.substring(0,8).toUpperCase()); return true;
  }
  onError(confirmData.message || 'Error confirming payment.'); return false;
}

function Inner({ totalFinal, customerEmail, customerName, cartItems, onSuccess, onError, onAvailable }: Props) {
  const stripe = useStripe();
  const [gpAvailable, setGpAvailable] = useState(false);
  const [gpLoading, setGpLoading] = useState(false);
  const gpClient = useRef<any>(null);
  const [apPr, setApPr] = useState<any>(null);

  useEffect(() => { onAvailable?.(gpAvailable || !!apPr); }, [gpAvailable, apPr]);

  useEffect(() => {
    if (!stripe || totalFinal <= 0) return;
    (async () => {
      try {
        if (!window.google?.payments?.api?.PaymentsClient) {
          await new Promise<void>((res, rej) => {
            const s = document.createElement('script');
            s.src = 'https://pay.google.com/gp/p/js/pay.js';
            s.async = true; s.onload = () => res(); s.onerror = () => rej();
            document.head.appendChild(s);
          });
        }
        const isLive = String(import.meta.env.VITE_STRIPE_PUBLIC_KEY).startsWith('pk_live');
        const client = new window.google.payments.api.PaymentsClient({ environment: isLive ? 'PRODUCTION' : 'TEST' });
        gpClient.current = client;
        const { result } = await client.isReadyToPay({ apiVersion: 2, apiVersionMinor: 0, allowedPaymentMethods: [{ type: 'CARD', parameters: { allowedAuthMethods: ['PAN_ONLY','CRYPTOGRAM_3DS'], allowedCardNetworks: ['AMEX','DISCOVER','INTERAC','JCB','MASTERCARD','VISA'] } }] });
        setGpAvailable(!!result);
      } catch { setGpAvailable(false); }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe, totalFinal]);

  useEffect(() => {
    if (!stripe || totalFinal <= 0) return;
    const pr = stripe.paymentRequest({ country: 'US', currency: 'usd', total: { label: 'Zylumia Serum', amount: Math.round(totalFinal * 100) }, requestPayerName: true, requestPayerEmail: true });
    pr.canMakePayment().then((r: any) => { if (r?.applePay) setApPr(pr); });
    pr.on('paymentmethod', async (event: any) => {
      try {
        const ok = await runStripePayment(stripe, event.paymentMethod.id, { customerEmail: event.payerEmail||customerEmail, customerName: event.payerName||customerName, cartItems, onSuccess, onError });
        event.complete(ok ? 'success' : 'fail');
      } catch (e: any) { event.complete('fail'); onError(e.message||'Error.'); }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe, totalFinal]);

  const handleGPay = useCallback(async () => {
    if (!stripe || !gpClient.current || gpLoading) return;
    setGpLoading(true);
    try {
      const isLive = String(import.meta.env.VITE_STRIPE_PUBLIC_KEY).startsWith('pk_live');
      const paymentData = await gpClient.current.loadPaymentData({
        apiVersion: 2, apiVersionMinor: 0,
        allowedPaymentMethods: [{ type: 'CARD', parameters: { allowedAuthMethods: ['PAN_ONLY','CRYPTOGRAM_3DS'], allowedCardNetworks: ['AMEX','DISCOVER','INTERAC','JCB','MASTERCARD','VISA'] }, tokenizationSpecification: { type: 'PAYMENT_GATEWAY', parameters: { gateway: 'stripe', 'stripe:version': '2018-10-31', 'stripe:publishableKey': import.meta.env.VITE_STRIPE_PUBLIC_KEY } } }],
        merchantInfo: { merchantName: 'Zylumia', ...(isLive && { merchantId: 'BCR2DN4T27D7C3ZD' }) },
        transactionInfo: { totalPriceStatus: 'FINAL', totalPrice: totalFinal.toFixed(2), currencyCode: 'USD', countryCode: 'US' },
      });
      const tokenObj = JSON.parse(paymentData.paymentMethodData.tokenizationData.token);
      let pm: string | { card: { token: string } };
      if (typeof tokenObj.id === 'string' && tokenObj.id.startsWith('pm_')) { pm = tokenObj.id; }
      else { const { paymentMethod, error: pmErr } = await stripe.createPaymentMethod({ type: 'card', card: { token: tokenObj.id } }); if (pmErr) throw pmErr; pm = paymentMethod.id; }
      await runStripePayment(stripe, pm, { customerEmail, customerName, cartItems, onSuccess, onError });
    } catch (e: any) { if (e?.statusCode !== 'CANCELED') onError(e.message||'Erro inesperado.'); }
    finally { setGpLoading(false); }
  }, [stripe, totalFinal, customerEmail, customerName, cartItems, onSuccess, onError, gpLoading]);

  return (
    <>
      {gpAvailable && (
        <button onClick={handleGPay} disabled={gpLoading} aria-label="Buy with Google Pay"
          style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', width:'100%', minHeight:'48px', height:'48px', background: gpLoading?'#444':'#000', color:'#fff', border:'none', borderRadius:'4px', cursor: gpLoading?'not-allowed':'pointer', fontSize:'15px', fontWeight:500, fontFamily:'"Google Sans","Roboto",system-ui,sans-serif', WebkitTapHighlightColor:'transparent', touchAction:'manipulation', transition:'background 0.2s' }}>
          {gpLoading ? 'Processando…' : (<><svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M43.6 20.7H24V27.4H35.2C33.6 31.8 29.2 35 24 35 17.4 35 12 29.6 12 23 12 16.4 17.4 11 24 11c3.1 0 5.9 1.2 8.1 3.1L37 9.2C33.5 5.9 28.9 4 24 4 13.5 4 5 12.5 5 23s8.5 19 19 19 18-8.5 18-18c0-.8-.1-1.5.6-2.3z" fill="#FFC107"/><path d="M6.3 14.7 12.1 19C13.7 15.1 18.5 12 24 12c3.1 0 5.9 1.2 8.1 3.1L37 10.2C33.5 6.9 28.9 5 24 5 16.1 5 9.3 9.4 6.3 14.7z" fill="#FF3D00"/><path d="M24 43c4.8 0 9.3-1.8 12.7-4.9L31.3 33.5C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.2-11.2-7.6L7 33.1C9.9 38.4 16.5 43 24 43z" fill="#4CAF50"/><path d="M43.6 20.7H24V27.4H35.2c-.8 2.2-2.2 4.1-3.9 5.6h.1L36.7 38C36.3 38.4 44 33 44 23c0-.8-.1-1.5-.4-2.3z" fill="#1976D2"/></svg><span>Pay</span></>)}
        </button>
      )}
      {apPr && (<PaymentRequestButtonElement options={{ paymentRequest: apPr, style: { paymentRequestButton: { type:'buy', theme:'dark', height:'48px' } } }} />)}
    </>
  );
}

export default function StripeExpressButtons(props: Props) {
  return <Elements stripe={getStripePromise()}><Inner {...props} /></Elements>;
}
