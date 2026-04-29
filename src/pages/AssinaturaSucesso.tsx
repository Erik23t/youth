import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, ArrowRight, X } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'https://backend.zylumia.com';

export default function AssinaturaSucesso() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [nextBillingDate, setNextBillingDate] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // PayPal pode enviar como subscription_id OU ba_token
    const subscriptionId = params.get('subscription_id') 
      || params.get('subscriptionId')
      || params.get('ba_token');

    if (!subscriptionId) {
      setErrorMessage('Parâmetro de assinatura não encontrado na URL.');
      setStatus('error');
      return;
    }

    fetch(`${API}/api/subscriptions/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paypalSubscriptionId: subscriptionId })
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        setStatus('success');
        setNextBillingDate(data.subscription?.nextBillingDate || '');
      } else {
        setErrorMessage(data.message || data.error || 'Erro ao ativar assinatura.');
        setStatus('error');
      }
    })
    .catch(e => {
      console.error('Erro:', e);
      setErrorMessage('Erro de conexão.');
      setStatus('error');
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-[#841dc5] animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processando Assinatura</h2>
            <p className="text-gray-600">Por favor, aguarde enquanto confirmamos seu pagamento...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Assinatura Ativa!</h2>
            <p className="text-gray-600 mb-8">
              Obrigado por assinar Zylumia. Seu pedido será processado e enviado em breve. 
              Você receberá um e-mail com os detalhes da sua assinatura.
            </p>
            <a 
              href="/minha-conta"
              className="w-full flex items-center justify-center bg-[#841dc5] hover:bg-[#6a179e] text-white font-bold py-4 px-8 rounded-lg transition-colors"
            >
              VER MINHA ASSINATURA
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <X className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ops, algo deu errado</h2>
            <p className="text-gray-600 mb-8">
              {errorMessage}
            </p>
            <a 
              href="/"
              className="w-full flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-lg transition-colors"
            >
              VOLTAR PARA A LOJA
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
