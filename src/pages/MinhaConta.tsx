import React, { useState, useEffect } from 'react';
import { toastSuccess, toastError, confirm, ToastContainer, ConfirmModal } from '../components/ZylumiaDialog';
import { User, Package, CreditCard, LogOut, Loader2, AlertCircle, CheckCircle2, ArrowLeft, MessageCircle, RefreshCw, Trash2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'https://backend.zylumia.com';

export default function MinhaConta() {
  const [activeTab, setActiveTab] = useState<'perfil' | 'pedidos' | 'assinatura' | 'mensagens'>('assinatura');
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [canceling, setCanceling] = useState(false);

  // Mensagens
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [msgNaoLidas, setMsgNaoLidas] = useState(0);
  const [loadingMensagens, setLoadingMensagens] = useState(false);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [novoAssunto, setNovoAssunto] = useState('');
  const [enviandoMsg, setEnviandoMsg] = useState(false);
  const [msgEnviada, setMsgEnviada] = useState('');
  const [msgAberta, setMsgAberta] = useState<string | null>(null);
  const [respostaCliente, setRespostaCliente] = useState('');
  const [enviandoResposta, setEnviandoResposta] = useState(false);

  // Pedidos
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('zylumia_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'mensagens') {
      setActiveTab('mensagens');
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'assinatura' && user) {
      fetchSubscription();
    }
  }, [activeTab, user]);

  useEffect(() => {
    if (activeTab !== 'mensagens') return;
    carregarMensagens().then((msgs: any[]) => {
      if (msgs.length) marcarTodasLidas(msgs);
    });
    const interval = setInterval(() => carregarMensagens(), 10000);
    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'pedidos') return;
    carregarPedidos();
    const interval = setInterval(carregarPedidos, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const carregarPedidos = async () => {
    setLoadingPedidos(true);
    try {
      const token = localStorage.getItem('zylumia_token');
      const r = await fetch(`${API}/api/orders/meus-pedidos`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      const data = await r.json();
      if (data.success) {
        const visiveis = (data.orders || []).filter(
          (p: any) => !p.hiddenByCustomer
        );
        setPedidos(visiveis);
      }
    } catch(e) {} finally {
      setLoadingPedidos(false);
    }
  };

  const excluirPedido = async (id: string) => {
    if (!(await confirm({ title: 'Remover pedido', message: 'Remover este pedido da sua lista?', confirmLabel: 'Remover', danger: true }))) return;
    try {
      const token = localStorage.getItem('zylumia_token');
      const r = await fetch(`${API}/api/orders/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      const data = await r.json();
      if (data.success) {
        setPedidos(prev => prev.filter((p: any) => p.id !== id));
      } else {
        toastError(data.message || 'Erro ao remover pedido.');
      }
    } catch(e) {
      toastError('Erro de conexão.');
    }
  };

  const marcarTodasLidas = async (msgs: any[]) => {
    const token = localStorage.getItem('zylumia_token');
    const naoLidas = msgs.filter((m: any) => m.status === 'REPLIED' && !m.clientRead);
    for (const msg of naoLidas) {
      await fetch(`${API}/api/messages/${msg.id}/client-read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
    }
    setMsgNaoLidas(0);
  };

  const fetchSubscription = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('zylumia_token');
      const response = await fetch(`${API}/api/subscriptions/minha-assinatura`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setSubscription(data.subscription);
      } else {
        setSubscription(null);
      }
    } catch (e) {
      setError('Erro ao carregar dados da assinatura.');
    } finally {
      setLoading(false);
    }
  };

  const carregarMensagens = async (): Promise<any[]> => {
    setLoadingMensagens(true);
    try {
      const token = localStorage.getItem('zylumia_token');
      const r = await fetch(`${API}/api/messages/minhas`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      const data = await r.json();
      if (data.success) {
        const msgs = data.messages || [];
        setMensagens(msgs);
        const naoLidas = msgs.filter(
          (m: any) => m.status === 'REPLIED' && !m.clientRead
        ).length;
        setMsgNaoLidas(naoLidas);
        return msgs;
      }
    } catch(e) {} finally {
      setLoadingMensagens(false);
    }
    return [];
  };

  const marcarComoLido = async (msgId: string) => {
    const token = localStorage.getItem('zylumia_token');
    try {
      await fetch(`${API}/api/messages/${msgId}/client-read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });
      setMensagens(prev => prev.map(m =>
        m.id === msgId ? {...m, clientRead: true} : m
      ));
      setMsgNaoLidas(prev => Math.max(0, prev - 1));
    } catch(e) {}
  };

  const enviarNovaMensagem = async () => {
    if (!novaMensagem.trim()) return;
    setEnviandoMsg(true);
    setMsgEnviada('');
    try {
      const token = localStorage.getItem('zylumia_token');
      const r = await fetch(`${API}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        credentials: 'include',
        body: JSON.stringify({ subject: novoAssunto || 'Contato', message: novaMensagem.trim() })
      });
      const data = await r.json();
      if (data.success) {
        setMsgEnviada('Mensagem enviada com sucesso!');
        setNovaMensagem('');
        setNovoAssunto('');
        carregarMensagens();
      } else {
        setMsgEnviada(data.message || 'Erro ao enviar.');
      }
    } catch(e) {
      setMsgEnviada('Erro ao enviar mensagem.');
    } finally {
      setEnviandoMsg(false);
    }
  };

  const enviarRespostaCliente = async (msgId: string) => {
    if (!respostaCliente.trim()) return;
    setEnviandoResposta(true);
    try {
      const token = localStorage.getItem('zylumia_token');
      const msg = mensagens.find((m: any) => m.id === msgId);
      const r = await fetch(`${API}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        credentials: 'include',
        body: JSON.stringify({ subject: (msg?.subject || 'Contato') + ' (resposta)', message: respostaCliente.trim() })
      });
      const data = await r.json();
      if (data.success) {
        setRespostaCliente('');
        setMsgAberta(null);
        carregarMensagens();
      }
    } catch(e) {}
    finally { setEnviandoResposta(false); }
  };

  const handleCancelSubscription = async () => {
    if (!(await confirm({ title: 'Cancelar assinatura', message: 'Tem certeza? Você perderá o desconto de 10% e os brindes exclusivos.', confirmLabel: 'Cancelar assinatura', danger: true }))) return;
    setCanceling(true);
    try {
      const token = localStorage.getItem('zylumia_token');
      const response = await fetch(`${API}/api/subscriptions/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        toastSuccess('Assinatura cancelada com sucesso.');
        fetchSubscription();
      } else {
        toastError(data.error || 'Erro ao cancelar assinatura.');
      }
    } catch (e) {
      toastError('Erro de conexão ao tentar cancelar.');
    } finally {
      setCanceling(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zylumia_user');
    window.location.href = '/';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Minha Conta</h1>
          <a href="/" className="flex items-center text-sm font-medium text-gray-600 hover:text-[#841dc5] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a loja
          </a>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#841dc5] text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{user.name || 'Usuário'}</div>
                  <div className="text-sm text-gray-500 truncate w-32" title={user.email}>{user.email}</div>
                </div>
              </div>

              <nav className="p-2">
                <button
                  onClick={() => setActiveTab('perfil')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'perfil' ? 'bg-purple-50 text-[#841dc5] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <User className="w-5 h-5" />
                  Meu Perfil
                </button>
                <button
                  onClick={() => setActiveTab('pedidos')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'pedidos' ? 'bg-purple-50 text-[#841dc5] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Package className="w-5 h-5" />
                  Meus Pedidos
                </button>
                <button
                  onClick={() => setActiveTab('assinatura')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'assinatura' ? 'bg-purple-50 text-[#841dc5] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <CreditCard className="w-5 h-5" />
                  Assinatura
                </button>
                <button
                  onClick={() => setActiveTab('mensagens')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'mensagens'
                      ? 'bg-purple-50 text-[#841dc5] font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  Mensagens
                  {msgNaoLidas > 0 && (
                    <span className="ml-auto bg-[#841dc5] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {msgNaoLidas}
                    </span>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  Sair
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[400px]">

              {activeTab === 'perfil' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Meu Perfil</h2>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                      <input type="text" value={user.name || ''} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                      <input type="email" value={user.email} readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'pedidos' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Meus Pedidos</h2>
                    <button
                      onClick={carregarPedidos}
                      className="text-sm text-[#841dc5] hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Atualizar
                    </button>
                  </div>

                  {loadingPedidos ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-8 h-8 text-[#841dc5] animate-spin" />
                    </div>
                  ) : pedidos.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                      <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-600">Você ainda não tem pedidos.</p>
                      <a href="/" className="inline-block mt-4 bg-[#841dc5] text-white font-bold py-3 px-8 rounded-lg">
                        COMPRAR AGORA
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pedidos.map((pedido: any) => {
                        const statusConfig: any = {
                          PENDING:    { label: 'Pendente',   icon: '⏳', bg: 'bg-yellow-100', text: 'text-yellow-700' },
                          PAID:       { label: 'Pago',       icon: '✅', bg: 'bg-green-100',  text: 'text-green-700'  },
                          PROCESSING: { label: 'Preparando', icon: '⚙️', bg: 'bg-blue-100',   text: 'text-blue-700'   },
                          SHIPPED:    { label: 'Enviado',    icon: '📦', bg: 'bg-purple-100', text: 'text-purple-700' },
                          DELIVERED:  { label: 'Entregue',   icon: '🎉', bg: 'bg-green-100',  text: 'text-green-700'  },
                          CANCELLED:  { label: 'Cancelado',  icon: '❌', bg: 'bg-red-100',    text: 'text-red-700'    },
                        };
                        const s = statusConfig[pedido.status] || statusConfig.PENDING;

                        return (
                          <div key={pedido.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <span className="font-bold text-gray-900 text-lg">
                                  #{pedido.shortId || pedido.id?.substring(0, 8).toUpperCase()}
                                </span>
                                <p className="text-gray-400 text-xs mt-1">
                                  {new Date(pedido.createdAt).toLocaleDateString('pt-BR', {
                                    day: '2-digit', month: 'long', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${s.bg} ${s.text}`}>
                                  {s.icon} {s.label}
                                </span>
                                <button
                                  onClick={() => excluirPedido(pedido.id)}
                                  className="text-gray-300 hover:text-red-400 transition-colors"
                                  title="Remover da lista"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="flex gap-4 mb-4">
                              {/* Imagem do produto */}
                              <img
                                src=""
                                alt="Produto"
                                style={{
                                  width: '65px',
                                  height: '65px',
                                  objectFit: 'cover',
                                  borderRadius: '8px',
                                  flexShrink: 0,
                                  border: '1px solid #e5e7eb'
                                }}
                              />
                              {/* Itens do pedido */}
                              <div className="flex-1">
                                {pedido.items?.map((item: any, i: number) => (
                                  <div key={i} className="flex justify-between text-sm text-gray-600 py-1 border-b border-gray-50 last:border-0">
                                    <span>{item.name} × {item.qty || 1}</span>
                                    <span className="font-medium">US$ {(item.price * (item.qty || 1)).toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                              <span className="text-sm text-gray-500">Total</span>
                              <span className="font-bold text-[#841dc5] text-lg">
                                US$ {parseFloat(pedido.total || 0).toFixed(2)}
                              </span>
                            </div>

                            {pedido.trackingCode && (
                              <div className="mt-3 bg-purple-50 rounded-lg p-3 text-sm">
                                <span className="text-[#841dc5] font-bold">📍 Rastreamento: </span>
                                <span className="font-mono">{pedido.trackingCode}</span>
                                {pedido.trackingUrl && (
                                  <a href={pedido.trackingUrl} target="_blank" rel="noreferrer"
                                    className="ml-2 text-[#841dc5] underline font-bold">
                                    Rastrear →
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'assinatura' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Gerenciar Assinatura</h2>

                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-8 h-8 text-[#841dc5] animate-spin" />
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  ) : subscription && subscription.status === 'ACTIVE' ? (
                    <div className="space-y-6">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                          <h3 className="text-lg font-bold text-green-800">Assinatura Ativa</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-green-700 mb-1">Plano Atual</p>
                            <p className="font-bold text-gray-900">{subscription.planName || 'Zylumia Mensal'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-green-700 mb-1">Valor Mensal</p>
                            <p className="font-bold text-gray-900">US$ {subscription.price?.toFixed(2).replace('.', ',')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-green-700 mb-1">Próxima Cobrança</p>
                            <p className="font-bold text-gray-900">
                              {subscription.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString('pt-BR') : 'A definir'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-green-700 mb-1">ID da Assinatura</p>
                            <p className="font-mono text-sm text-gray-600">{subscription.paypalSubscriptionId}</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-6">
                        <h4 className="font-bold text-gray-900 mb-2">Cancelar Assinatura</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Ao cancelar, você perderá seu desconto de 10% e não receberá mais os produtos automaticamente.
                        </p>
                        <button
                          onClick={handleCancelSubscription}
                          disabled={canceling}
                          className="px-6 py-2 border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          {canceling && <Loader2 className="w-4 h-4 animate-spin" />}
                          Cancelar Assinatura
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                      <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-[#841dc5]" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Você não possui uma assinatura ativa</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Assine agora e garanta 10% de desconto em todos os seus pedidos, além de brindes exclusivos.
                      </p>
                      <a
                        href="/"
                        className="inline-flex items-center justify-center bg-[#841dc5] hover:bg-[#6a179e] text-white font-bold py-3 px-8 rounded-lg transition-colors"
                      >
                        CONHECER PLANOS
                      </a>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'mensagens' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    💬 Minhas Mensagens
                  </h2>

                  {/* FORMULÁRIO — Nova Mensagem */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
                    <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">✉️ Enviar nova mensagem</h3>
                    <input
                      type="text"
                      placeholder="Assunto (opcional)"
                      value={novoAssunto}
                      onChange={e => setNovoAssunto(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#841dc5]"
                    />
                    <textarea
                      placeholder="Escreva sua mensagem aqui..."
                      value={novaMensagem}
                      onChange={e => setNovaMensagem(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#841dc5] resize-none"
                    />
                    {msgEnviada && (
                      <p className={`text-sm mb-3 font-medium ${msgEnviada.includes('sucesso') ? 'text-green-600' : 'text-red-500'}`}>
                        {msgEnviada}
                      </p>
                    )}
                    <button
                      onClick={enviarNovaMensagem}
                      disabled={enviandoMsg || !novaMensagem.trim()}
                      className="bg-[#841dc5] hover:bg-[#6a179e] disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors flex items-center gap-2"
                    >
                      {enviandoMsg ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      {enviandoMsg ? 'Enviando...' : 'Enviar Mensagem'}
                    </button>
                  </div>

                  {loadingMensagens ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-8 h-8 text-[#841dc5] animate-spin" />
                    </div>
                  ) : mensagens.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                      <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Nenhuma mensagem ainda
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Envie uma mensagem para nossa equipe.
                      </p>
                      <a
                        href="/contato"
                        className="inline-flex items-center justify-center bg-[#841dc5] hover:bg-[#6a179e] text-white font-bold py-3 px-8 rounded-lg transition-colors"
                      >
                        FALE CONOSCO
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mensagens.map((msg: any) => (
                        <div
                          key={msg.id}
                          className="border rounded-xl overflow-hidden transition-all"
                          style={{
                            borderColor: msg.status === 'REPLIED' && !msg.clientRead ? '#841dc5' : '#e5e7eb',
                            borderWidth: msg.status === 'REPLIED' && !msg.clientRead ? '2px' : '1px'
                          }}
                        >
                          <div
                            className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => {
                              if (msg.status === 'REPLIED' && !msg.clientRead) marcarComoLido(msg.id);
                              setMsgAberta(msgAberta === msg.id ? null : msg.id);
                              setRespostaCliente('');
                            }}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-gray-900">
                                {msg.status === 'REPLIED' && !msg.clientRead && '🔔 '}
                                {msg.subject || 'Contato'}
                              </span>
                              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                msg.status === 'REPLIED' ? 'bg-green-100 text-green-700'
                                : msg.status === 'READ' ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {msg.status === 'REPLIED' ? '✅ Respondido'
                                 : msg.status === 'READ' ? '👀 Lido' : '⏳ Aguardando'}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-1">{msg.message}</p>
                            <p className="text-gray-400 text-xs">{new Date(msg.createdAt).toLocaleDateString('pt-BR')} às {new Date(msg.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</p>
                          </div>

                          {msg.replies?.length > 0 && (
                            <div className="px-5 pb-3 space-y-3">
                              {msg.replies.map((reply: any) => (
                                <div key={reply.id} className="bg-purple-50 rounded-lg p-4 border-l-4 border-[#841dc5]">
                                  <p className="text-xs text-[#841dc5] font-bold mb-1">
                                    💜 Zylumia — {new Date(reply.createdAt).toLocaleDateString('pt-BR')} às {new Date(reply.createdAt).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
                                  </p>
                                  <p className="text-gray-700 text-sm">{reply.text}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {msgAberta === msg.id && (
                            <div className="px-5 pb-5 border-t border-gray-100 pt-4 bg-gray-50">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">↩️ Sua resposta</p>
                              <textarea
                                placeholder="Escreva sua resposta..."
                                value={respostaCliente}
                                onChange={e => setRespostaCliente(e.target.value)}
                                rows={3}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#841dc5] resize-none"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => enviarRespostaCliente(msg.id)}
                                  disabled={enviandoResposta || !respostaCliente.trim()}
                                  className="bg-[#841dc5] hover:bg-[#6a179e] disabled:opacity-50 text-white font-bold py-2 px-5 rounded-lg text-sm transition-colors flex items-center gap-2"
                                >
                                  {enviandoResposta ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                                  {enviandoResposta ? 'Enviando...' : 'Enviar'}
                                </button>
                                <button
                                  onClick={() => { setMsgAberta(null); setRespostaCliente(''); }}
                                  className="text-gray-500 hover:text-gray-700 text-sm px-3 py-2"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <ConfirmModal />
    </div>
  );
}
