import React, { useState } from 'react';
import { X } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'https://backend.zylumia.com';

interface User {
  email: string;
  name?: string;
}

interface ZylumiaAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: User) => void;
}

export default function ZylumiaAuth({ isOpen, onClose, onSuccess }: ZylumiaAuthProps) {
  const [etapa, setEtapa] = useState<'email' | 'codigo'>('email');
  const [email, setEmail] = useState('');
  const [digitos, setDigitos] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  if (!isOpen) return null;

  async function registrarCarrinhoAbandonado(userEmail: string): Promise<void> {
    try {
      const sessionId = localStorage.getItem('zylumia_session_id')
      if (!sessionId) return

      const cartR = await fetch(`${API}/api/cart/${sessionId}`)
      const cartData = await cartR.json()

      if (!cartData.success || !cartData.cart?.items?.length) return

      await fetch(`${API}/api/recovery/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          email: userEmail,
          items: cartData.cart.items,
          total: cartData.cart.total
        })
      })
    } catch { /* ignore */ }
  }

  async function handleEnviarCodigo(e: React.FormEvent): Promise<void> {
    if (e) e.preventDefault();

    if (!email || !email.includes('@')) {
      setErro('Digite um e-mail válido.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const r = await fetch(`${API}/api/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const text = await r.text();
      let data: { success: boolean; message?: string };

      try {
        data = JSON.parse(text);
      } catch {
        if (r.status === 429) {
          setErro('Muitas tentativas. Aguarde alguns minutos.');
        } else {
          setErro(`Erro do servidor (${r.status}). Tente novamente.`);
        }
        return;
      }

      if (data.success) {
        setEtapa('codigo');
        setErro('');
      } else {
        setErro(data.message || `Erro ao enviar código (${r.status}).`);
      }
    } catch (e: unknown) {
      setErro(`Erro de conexão: ${e instanceof Error ? e.message : 'desconhecido'}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerificarCodigo(codigoFornecido?: string): Promise<void> {
    const codigoCompleto = codigoFornecido ?? digitos.join('');

    if (codigoCompleto.length !== 6) {
      setErro('Digite os 6 dígitos do código.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const r = await fetch(`${API}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: codigoCompleto
        })
      });
      const data = await r.json();

      if (data.success && data.token) {
        localStorage.setItem('zylumia_token', data.token);
        localStorage.setItem('zylumia_user', JSON.stringify(
          data.user || { email: email.trim().toLowerCase(), name: '' }
        ));

        await registrarCarrinhoAbandonado(data.user?.email || email.trim().toLowerCase());

        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', data.isNewUser ? 'sign_up' : 'login', { method: 'Email' });
        }

        setErro('');

        if (onSuccess) {
          onSuccess(data.user || { email: email.trim().toLowerCase() });
        }

        onClose();
        window.location.reload();

      } else {
        setErro(data.message || 'Código incorreto. Tente novamente.');
      }
    } catch (e: unknown) {
      setErro('Erro de conexão: ' + (e instanceof Error ? e.message : 'desconhecido'));
    } finally {
      setLoading(false);
    }
  }

  function handleDigito(index: number, value: string): void {
    if (!/^\d*$/.test(value)) return;

    const novosDigitos = [...digitos];
    novosDigitos[index] = value.slice(-1);
    setDigitos(novosDigitos);

    if (value && index < 5) {
      const proximo = document.getElementById(`digito-${index + 1}`);
      if (proximo) (proximo as HTMLInputElement).focus();
    }

    const todos = novosDigitos.join('');
    if (todos.length === 6) {
      handleVerificarCodigo(todos);
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Backspace' && !digitos[index] && index > 0) {
      const anterior = document.getElementById(`digito-${index - 1}`);
      if (anterior) (anterior as HTMLInputElement).focus();
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>): void => {
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
      if (proximo) (proximo as HTMLInputElement).focus();

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
          aria-label="Fechar"
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
