import { useEffect, useRef, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'https://zylumia-backend-kmbrxbidkq-uc.a.run.app';
const PAYPAL_CLIENT_ID = 'AV9WAKTYCB1cjJx-Gs76bthU-lAjOocL46zLs8bST6d-dn2S9WqLwMmz9MFYCssrWgg7IoTUtahYXdPk';

function loadPayPalSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).paypal) { resolve(); return; }
    const existing = document.getElementById('paypal-sdk');
    if (existing) { existing.addEventListener('load', () => resolve()); return; }
    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture&components=buttons`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Falha ao carregar PayPal SDK'));
    document.body.appendChild(script);
  });
}

export default function ZylumiaPayPalButton({ produto, customerName, customerEmail, onSuccess, onError }: any) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const rendered = useRef(false);
  const produtoRef = useRef(produto);
  const customerNameRef = useRef(customerName);
  const customerEmailRef = useRef(customerEmail);

  useEffect(() => { produtoRef.current = produto; }, [produto]);
  useEffect(() => { customerNameRef.current = customerName; customerEmailRef.current = customerEmail; }, [customerName, customerEmail]);

  useEffect(() => {
    if (!produto || rendered.current) return;
    const sessionId = localStorage.getItem('zylumia_session_id') || crypto.randomUUID();
    localStorage.setItem('zylumia_session_id', sessionId);

    loadPayPalSDK().then(() => {
      if (rendered.current || !paypalRef.current) return;
      rendered.current = true;
      setLoading(false);
      const user = JSON.parse(localStorage.getItem('zylumia_user') || 'null');

      (window as any).paypal.Buttons({
        fundingSource: (window as any).paypal.FUNDING.PAYPAL,
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal', height: 50 },

        createOrder: async () => {
          const sid = localStorage.getItem('zylumia_session_id');
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'add_payment_info', { currency: 'USD', value: produtoRef.current?.price || 0, payment_type: 'PayPal', items: [{ item_name: produtoRef.current?.name || 'Zylumia Skin Serum', price: produtoRef.current?.price || 0, quantity: 1 }] });
          }
          const emailFinal = customerEmailRef.current || user?.email || 'guest@zylumia.com';
          const nameFinal = customerNameRef.current || user?.name || 'Cliente';
          const couponCode = localStorage.getItem('zylumia_coupon');
          const r = await fetch(`${API}/api/paypal/create-order`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId: sid, customerEmail: emailFinal, customerName: nameFinal, ...(couponCode && { couponCode }) })
          });
          const data = await r.json();
          if (!data.success) { setErro('Erro ao criar ordem. Tente novamente.'); throw new Error(data.message); }
          return data.paypalOrderId;
        },

        onApprove: async (data: any) => {
          try {
            // Capture is done server-side — frontend just sends orderID
            const u = JSON.parse(localStorage.getItem('zylumia_user') || 'null');
            const emailFinal = u?.email || customerEmailRef.current || 'guest@zylumia.com';
            const nameFinal = u?.name || customerNameRef.current || 'Cliente';
            const r = await fetch(`${API}/api/paypal/capture-order`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paypalOrderId: data.orderID,
                customerEmail: emailFinal,
                customerName: nameFinal,
                sessionId: localStorage.getItem('zylumia_session_id')
              })
            });
            const result = await r.json();
            if (result.success) {
              const sid = localStorage.getItem('zylumia_session_id');
              if (sid) fetch(`${API}/api/recovery/purchased`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: sid }) }).catch(console.error);
              localStorage.removeItem('zylumia_session_id');
              localStorage.removeItem('zylumia_coupon');
              const finalOrder = result.order || { id: result.paypalOrderId || data.orderID || 'PEDIDO' };
              if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'purchase', { transaction_id: finalOrder.id, value: produtoRef.current?.price || 0, currency: 'USD', items: [{ item_name: produtoRef.current?.name || 'Zylumia Product', price: produtoRef.current?.price || 0, quantity: 1 }] });
              }
              if (typeof onSuccess === 'function') onSuccess(finalOrder);
            } else {
              setErro('Erro ao confirmar pagamento. ' + (result.message || ''));
              if (typeof onError === 'function') onError();
            }
          } catch (e: any) {
            setErro('Erro ao confirmar pagamento. ' + (e?.message || ''));
            if (typeof onError === 'function') onError();
          }
        },

        onError: (err: any) => { console.error('PayPal erro:', err); setErro('Erro no PayPal. Tente novamente.'); if (typeof onError === 'function') onError(err); },
        onCancel: () => { setErro('Pagamento cancelado.'); }
      }).render(paypalRef.current);
    }).catch(() => { setLoading(false); setErro('Não foi possível carregar o PayPal. Verifique sua conexão.'); });
  }, [produto]);

  return (
    <div>
      {loading && <p style={{ textAlign: 'center', color: '#888' }}>Carregando PayPal...</p>}
      {erro && <p style={{ color: '#ef4444', textAlign: 'center', fontSize: '14px' }}>{erro}</p>}
      <div ref={paypalRef} />
    </div>
  );
}
