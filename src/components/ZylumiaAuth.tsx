import React, { useState } from 'react';
import { X } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'https://backend.zylumia.com';

export default function ZylumiaAuth({ isOpen, onClose, onSuccess }) {
  const [etapa, setEtapa] = useState('email'); // 'email' ou 'codigo'
  const [email, setEmail] = useState('');
  const [digitos, setDigitos] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  if (!isOpen) return null;

  async function registrarCarrinhoAbandonado(userEmail) {
    try {
      const sessionId = localStorage.getItem('zylumia_session_id')
      if (!sessionId) return

      // Busca carrinho atual do backend
      const cartR = await fetch(
        `${API}/api/cart/${sessionId}`
      )
      const cartData = await cartR.json()

      // Só registra se tiver itens no carrinho
      if (!cartData.success || !cartData.cart?.items?.length) return

      // Registra como carrinho abandonado
      await fetch(
        `${API}/api/recovery/track`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            email: userEmail,
            items: cartData.cart.items,
            total: cartData.cart.total
          })
        }
      )
    } catch(e) {
      console.error('Erro ao registrar carrinho:', e)
    }
  }

  async function handleEnviarCodigo(e) {
    if (e) e.preventDefault();

    if (!email || !email.includes('@')) {
      setErro('Digite um e-mail válido.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const r = await fetch(
        `${API}/api/auth/send-code`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase() })
        }
      );

      const text = await r.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('Resposta não-JSON do servidor:', { status: r.status, text });
        if (r.status === 429) {
          setErro('Muitas tentativas. Aguarde alguns minutos.');
        } else {
          setErro(`Erro do servidor (${r.status}). Tente novamente.`);
        }
        return;
      }

      if (data.success) {
        setEtapa('codigo'); // muda para tela de digitar código
        setErro('');
      } else {
        console.error('Servidor retornou erro:', data);
        setErro(data.message || `Erro ao enviar código (${r.status}).`);
      }
    } catch (e) {
      console.error('Erro detalhado:', e);
      setErro(`Erro de conexão: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerificarCodigo(codigoFornecido) {
    const codigoCompleto = typeof codigoFornecido === 'string' ? codigoFornecido : digitos.join('');

    if (codigoCompleto.length !== 6) {
      setErro('Digite os 6 dígitos do código.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const r = await fetch(
        `${API}/api/auth/verify-code`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            code: codigoCompleto
          })
        }
      );
      const data = await r.json();

      if (data.success && data.token) {
        // Salva sessão
        localStorage.setItem('zylumia_token', data.token);
        localStorage.setItem('zylumia_user', JSON.stringify(
          data.user || { email: email.trim().toLowerCase(), name: '' }
        ));

        // Registra carrinho abandonado se tiver itens
        await registrarCarrinhoAbandonado(data.user?.email || email.trim().toLowerCase());

        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', data.isNewUser ? 'sign_up' : 'login', {
            method: 'Email'
          });
        }

        setErro('');

        // Chama onSuccess se existir
        if (typeof onSuccess === 'function') {
          onSuccess(data.user || { email: email.trim().toLowerCase() });
        }

        // Fecha o modal
        if (typeof onClose === 'function') {
          onClose();
        }

        // Recarrega a página para atualizar estado de login
        window.location.reload();

      } else {
        setErro(data.message || 'Código incorreto. Tente novamente.');
      }
    } catch (e) {
      console.error('Erro detalhado:', e);
      setErro('Erro de conexão: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleDigito(index, value) {
    if (!/^\d*$/.test(value)) return; // só aceita número

    const novosDigitos = [...digitos];
    novosDigitos[index] = value.slice(-1); // só 1 dígito por campo
    setDigitos(novosDigitos);

    // Foca no próximo campo
    if (value && index < 5) {
      const proximo = document.getElementById(`digito-${index + 1}`);
      if (proximo) proximo.focus();
    }

    // Se todos preenchidos, verifica automaticamente
    const todos = novosDigitos.join('');
    if (todos.length === 6) {
      handleVerificarCodigo(todos);
    }
  }

  function handleKeyDown(index, e) {
    // Backspace apaga e volta para campo anterior
    if (e.key === 'Backspace' && !digitos[index] && index > 0) {
      const anterior = document.getElementById(`digito-${index - 1}`);
      if (anterior) anterior.focus();
    }
  }

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const novosDigitos = [...digitos];
      for (let i = 0; i < pastedData.length; i++) {
        novosDigitos[i] = pastedData[i];
      }
      setDigitos(novosDigitos);
      const nextFocus = pastedData.length < 6 ? pastedData.length : 5;
      const proximo = document.getElementById(`digito-${nextFocus}`);
      if (proximo) proximo.focus();

      if (pastedData.length === 6) {
        handleVerificarCodigo(pastedData);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="relative bg-white w-full max-w-md p-8 rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {etapa === 'email' ? (
          <div className="animate-in fade-in duration-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold mb-2 text-gray-900">Entrar na minha conta</h2>
            </div>

            <form onSubmit={handleEnviarCodigo}>
              <div className="mb-6">
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className="w-full border border-gray-300 p-3.5 rounded-md focus:outline-none focus:ring-1 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <style>{`
                  input[type="email"]:focus {
                    border-color: #7c3aed !important;
                    outline: none !important;
                    box-shadow: 0 0 0 1px #7c3aed !important;
                  }
                `}</style>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white text-sm font-bold py-4 rounded-md transition-colors tracking-wider disabled:opacity-70"
                style={{ backgroundColor: '#7c3aed' }}
              >
                {loading ? 'Enviando...' : 'ENVIAR CÓDIGO'}
              </button>

              {erro && (
                <p style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center', marginTop: '8px' }}>
                  {erro}
                </p>
              )}
            </form>
          </div>
        ) : (
          <div className="animate-in fade-in duration-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-serif font-bold mb-2 text-gray-900">Digite o código</h2>
              <p className="text-sm text-gray-500 mb-2">Enviamos um código de 6 dígitos para {email}</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleVerificarCodigo(); }}>
              <div className="flex justify-between gap-2 mb-4" onPaste={handlePaste}>
                {digitos.map((digit, index) => (
                  <input
                    key={index}
                    id={`digito-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigito(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="otp-input w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-md transition-all"
                    disabled={loading}
                  />
                ))}
                <style>{`
                  .otp-input:focus {
                    border-color: #7c3aed !important;
                    outline: none !important;
                    box-shadow: 0 0 0 1px #7c3aed !important;
                  }
                `}</style>
              </div>

              <button
                type="submit"
                disabled={loading || digitos.join('').length !== 6}
                className="w-full text-white text-sm font-bold py-4 rounded-md transition-colors tracking-wider disabled:opacity-70"
                style={{ backgroundColor: '#7c3aed' }}
              >
                {loading ? 'Verificando...' : 'VERIFICAR'}
              </button>

              {erro && (
                <p style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center', marginTop: '8px' }}>
                  {erro}
                </p>
              )}
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setEtapa('email');
                  setDigitos(['','','','','','']);
                  setErro('');
                }}
                className="text-sm text-gray-500 hover:text-gray-900 underline"
              >
                Reenviar código
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
