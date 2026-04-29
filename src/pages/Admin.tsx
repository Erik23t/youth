import { formatPrice } from '../lib/currency';
import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const API = import.meta.env.VITE_API_URL || 'https://backend.zylumia.com';
const API_BASE = `${API}/api/admin`;
const ADMIN_KEY = 'zylumia-admin-2026';

let _adminToken = '';

async function adminFetch(url: string, options: any = {}) {
  try {
    const r = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${_adminToken}`,
        ...options.headers
      }
    })
    if (r.status === 401 || r.status === 403) {
      _adminToken = '';
      window.location.reload()
      return null
    }
    return r.json()
  } catch(e) {
    console.error('adminFetch error:', e)
    return null
  }
}

export default function Admin() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState('');
  const [erroLogin, setErroLogin] = useState('');

  const [activeTab, setActiveTab] = useState('Dashboard');

  // Data states
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [loadingCustomerDetails, setLoadingCustomerDetails] = useState(false);
  const [newsletter, setNewsletter] = useState<any[]>([]);
  
  // Reports states
  const [reportsData, setReportsData] = useState<any>(null);
  const [reportPeriod, setReportPeriod] = useState(30);

  // Coupons states
  const [coupons, setCoupons] = useState<any[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(10);
  const [couponDays, setCouponDays] = useState(30);
  const [couponDesc, setCouponDesc] = useState('');

  // Subscriptions states
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [subsStats, setSubsStats] = useState<any>({ active: 0, cancelled: 0, mrr: 0 });

  // Recovery states
  const [recoveryStats, setRecoveryStats] = useState<any>(null);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryMsg, setRecoveryMsg] = useState('');
  const [cleanLoading, setCleanLoading] = useState(false);

  // Broadcast email states
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastSelected, setBroadcastSelected] = useState<string[]>([]);
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastImageUrl, setBroadcastImageUrl] = useState('');
  const [broadcastLink, setBroadcastLink] = useState('');
  const [broadcastLinkLabel, setBroadcastLinkLabel] = useState('');
  const [broadcastCoupon, setBroadcastCoupon] = useState('');
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  // Messages states
  const [adminMessages, setAdminMessages] = useState<any[]>([]);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [replyLoading, setReplyLoading] = useState<Record<string, boolean>>({});

  // Orders filters and modal
  const [orderFilter, setOrderFilter] = useState('Todos');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalStatus, setModalStatus] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [estimatedDays, setEstimatedDays] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const r = await fetch(`${API}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: senha })
      });
      const data = await r.json();
      if (data && data.success) {
        _adminToken = data.token;
        setAutenticado(true);
        setErroLogin('');
      } else {
        setErroLogin('Senha incorreta.');
      }
    } catch (e) {
      setErroLogin('Erro ao conectar com o servidor.');
    }
  }

  function handleLogout() {
    _adminToken = '';
    setAutenticado(false);
  }

  const fetchOrders = async () => {
    const data = await adminFetch(`${API_BASE}/orders`);
    if (data) setOrders(data.orders || data || []);
  };

  const fetchCustomers = async () => {
    const data = await adminFetch(`${API_BASE}/customers`);
    if (data) setCustomers(data.customers || data || []);
  };

  const handleViewCustomerDetails = async (cliente: any) => {
    setSelectedCustomer(cliente);
    setLoadingCustomerDetails(true);
    try {
      const r = await adminFetch(`${API_BASE}/orders?limit=1000`);
      const pedidosDoCliente = (r?.orders || []).filter((o: any) => o.customerEmail === cliente.email);
      
      const subR = await adminFetch(`${API}/api/subscriptions/admin/all`);
      const assinatura = (subR?.subscriptions || []).find((s: any) => s.customerEmail === cliente.email && s.status === 'ACTIVE');
      
      setCustomerDetails({
        pedidos: pedidosDoCliente,
        assinatura: assinatura
      });
    } catch (e) {
      console.error('Erro ao buscar detalhes do cliente', e);
    } finally {
      setLoadingCustomerDetails(false);
    }
  };

  const fetchNewsletter = async () => {
    const data = await adminFetch(`${API_BASE}/newsletter`);
    if (data) setNewsletter(data.subscribers || data || []);
  };

  useEffect(() => {
    const run = async () => {
    if (orders.length > 0) {
      const now = new Date();
      const cutoff = new Date(now.getTime() - reportPeriod * 24 * 60 * 60 * 1000);
      
      const filteredOrders = orders.filter(o => {
        const d = new Date(o.createdAt || o.date);
        return d >= cutoff;
      });

      const byDayMap: Record<string, { orders: number, revenue: number }> = {};
      const byProductMap: Record<string, { qty: number, revenue: number }> = {};
      
      let totalOrders = 0;
      let totalRevenue = 0;

      filteredOrders.forEach(o => {
        totalOrders++;
        totalRevenue += (o.total || 0);

        const d = new Date(o.createdAt || o.date);
        const dateStr = d.toISOString().split('T')[0];
        if (!byDayMap[dateStr]) byDayMap[dateStr] = { orders: 0, revenue: 0 };
        byDayMap[dateStr].orders++;
        byDayMap[dateStr].revenue += (o.total || 0);

        if (o.items) {
          o.items.forEach((item: any) => {
            const name = item.name || 'Produto Desconhecido';
            if (!byProductMap[name]) byProductMap[name] = { qty: 0, revenue: 0 };
            byProductMap[name].qty += (item.quantity || 1);
            byProductMap[name].revenue += (item.price || 0) * (item.quantity || 1);
          });
        }
      });

      const byDay = Object.keys(byDayMap).map(date => ({
        date,
        orders: byDayMap[date].orders,
        revenue: byDayMap[date].revenue
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const byProduct = Object.keys(byProductMap).map(name => ({
        name,
        qty: byProductMap[name].qty,
        revenue: byProductMap[name].revenue
      })).sort((a, b) => b.qty - a.qty);

      setReportsData({
        totalOrders,
        totalRevenue,
        averageTicket: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        byDay,
        byProduct
      });
    } else {
      setReportsData({
        totalOrders: 0,
        totalRevenue: 0,
        averageTicket: 0,
        byDay: [],
        byProduct: []
      });
    }
    };
    run();
  }, [orders, reportPeriod]);

  const fetchCoupons = async () => {
    const data = await adminFetch(`${API}/api/maintenance/coupons`);
    if (data) setCoupons(data.coupons || data || []);
  };

  const fetchSubscriptions = async () => {
    const data = await adminFetch(`${API}/api/subscriptions/admin/all`);
    if (data && data.success) {
      setSubscriptions(data.subscriptions || []);
      setSubsStats({
        active: data.stats?.active || 0,
        cancelled: data.stats?.cancelled || 0,
        mrr: data.stats?.mrr || 0
      });
    }
  };

  const fetchMessages = async () => {
    const data = await adminFetch(`${API}/api/messages`);
    if (data) setAdminMessages(data.messages || []);
  };

  const handleMarkRead = async (id: string) => {
    await adminFetch(`${API}/api/messages/${id}/read`, { method: 'PATCH' });
    setAdminMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'READ' } : m));
  };

  const handleReply = async (id: string) => {
    const text = replyTexts[id];
    if (!text?.trim()) return;
    setReplyLoading(prev => ({ ...prev, [id]: true }));
    const data = await adminFetch(`${API}/api/messages/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ reply: text })
    });
    if (data?.success) {
      setReplyTexts(prev => ({ ...prev, [id]: '' }));
      fetchMessages();
    }
    setReplyLoading(prev => ({ ...prev, [id]: false }));
  };

  useEffect(() => {
    if (activeTab === 'Dashboard') {
      const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
      const totalOrders = orders.length;
      const totalCustomers = customers.length;
      const totalNewsletter = newsletter.length;

      const ordersByStatus: Record<string, number> = {};
      orders.forEach(o => {
        const status = o.status || 'PENDING';
        ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
      });

      const hoje = new Date().toISOString().split('T')[0]
      const semanaAtras = new Date(Date.now() - 7*24*60*60*1000).toISOString()

      const todayOrders = orders.filter(o =>
        o.createdAt?.startsWith(hoje) && o.status === 'PAID'
      )
      const weekOrders = orders.filter(o =>
        o.createdAt >= semanaAtras && o.status === 'PAID'
      )

      setDashboardData({
        revenue: totalRevenue,
        orders: totalOrders,
        customers: totalCustomers,
        newsletter: totalNewsletter,
        ordersByStatus,
        paidOrders: ordersByStatus?.PAID || 0,
        todayOrders: todayOrders.length,
        todayRevenue: todayOrders.reduce((a, o) => a + (o.total || 0), 0),
        weekOrders: weekOrders.length,
        weekRevenue: weekOrders.reduce((a, o) => a + (o.total || 0), 0),
      });
    }
  }, [orders, customers, newsletter, activeTab]);

  useEffect(() => {
    if (autenticado) {
      if (activeTab === 'Dashboard') {
        fetchOrders();
        fetchCustomers();
        fetchNewsletter();
      }
      if (activeTab === 'Pedidos') fetchOrders();
      if (activeTab === 'Clientes') fetchCustomers();
      if (activeTab === 'Newsletter') fetchNewsletter();
      if (activeTab === 'Relatórios') fetchOrders();
      if (activeTab === 'Cupons') fetchCoupons();
      if (activeTab === 'Assinaturas') fetchSubscriptions();
      if (activeTab === 'Mensagens') fetchMessages();
    }
  }, [autenticado, activeTab, reportPeriod]);

  // useRef para controlar gráficos
  const revenueChartRef = useRef<any>(null);
  const productsChartRef = useRef<any>(null);
  const statusChartRef = useRef<any>(null);

  // Renderiza gráficos
  useEffect(() => {
    if (!reportsData || !dashboardData || activeTab !== 'Dashboard') return;
    
    const run = async () => {
    // Chart.js importado via npm - disponível imediatamente
    
    setTimeout(() => {
      // Destrói gráficos anteriores
      if (revenueChartRef.current) revenueChartRef.current.destroy()
      if (productsChartRef.current) productsChartRef.current.destroy()
      if (statusChartRef.current) statusChartRef.current.destroy()

      const r = document.getElementById('revenueChart') as HTMLCanvasElement;
      if (r && reportsData.byDay) revenueChartRef.current = new Chart(r, {
        type: 'line',
        data: {
          labels: reportsData.byDay.map((d: any) => d.date),
          datasets: [{
            label: 'Receita (US$)',
            data: reportsData.byDay.map((d: any) => d.revenue),
            borderColor: '#7c3aed',
            backgroundColor: 'rgba(124,58,237,0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#7c3aed',
            pointRadius: 5,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Receita — últimos 30 dias',
              color: '#1a0533',
              font: { size: 15, weight: 'bold' }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: (v: any) => 'US$ ' + v }
            }
          }
        }
      })

      const p = document.getElementById('productsChart') as HTMLCanvasElement;
      if (p && reportsData.byProduct) productsChartRef.current = new Chart(p, {
        type: 'bar',
        data: {
          labels: reportsData.byProduct.map((x: any) =>
            x.name
              .replace('Zylumia™ - Suprimento para ','')
              .replace('Zylumia Skin Serum - Suprimento ','')
              .replace('Suprimento para ','')
          ),
          datasets: [{
            label: 'Unidades vendidas',
            data: reportsData.byProduct.map((x: any) => x.qty),
            backgroundColor: ['#7c3aed','#a855f7','#6d28d9','#c4b5fd'],
            borderRadius: 8,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Produtos mais vendidos',
              color: '#1a0533',
              font: { size: 15, weight: 'bold' }
            }
          },
          scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
      })

      const s = document.getElementById('statusChart') as HTMLCanvasElement;
      const statusData = dashboardData?.ordersByStatus || {}
      if (s && Object.keys(statusData).length > 0) {
        statusChartRef.current = new Chart(s, {
          type: 'doughnut',
          data: {
            labels: Object.keys(statusData).map(k => ({
              PENDING:'Pendente', PAID:'Pago',
              PROCESSING:'Processando', SHIPPED:'Enviado',
              DELIVERED:'Entregue', CANCELLED:'Cancelado'
            }[k as keyof typeof statusData] || k)),
            datasets: [{
              data: Object.values(statusData),
              backgroundColor: [
                '#f59e0b','#10b981','#7c3aed',
                '#3b82f6','#059669','#ef4444'
              ],
              borderWidth: 2,
              borderColor: '#fff',
            }]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Status dos pedidos',
                color: '#1a0533',
                font: { size: 15, weight: 'bold' }
              },
              legend: { position: 'bottom' }
            }
          }
        })
      }
    }, 200)
    };
    run();
  }, [reportsData, dashboardData, activeTab, reportPeriod]);

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const data = await adminFetch(`${API_BASE}/orders/${selectedOrder.id || selectedOrder._id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: modalStatus,
        trackingCode,
        trackingUrl,
        estimatedDays: Number(estimatedDays)
      })
    });

    if (data && data.success) {
      if (modalStatus === 'SHIPPED') {
        alert('E-mail de rastreamento enviado!');
      } else {
        alert('Pedido atualizado com sucesso!');
      }
      setSelectedOrder(null);
      fetchOrders();
    } else {
      alert('Erro ao atualizar pedido');
    }
  };

  async function enviarBroadcast() {
    if (broadcastSelected.length === 0) { alert('Selecione pelo menos um cliente.'); return; }
    if (!broadcastSubject.trim()) { alert('Preencha o assunto do e-mail.'); return; }
    if (!broadcastTitle.trim() && !broadcastBody.trim()) { alert('Preencha o título ou a mensagem.'); return; }
    if (!window.confirm(`Enviar e-mail para ${broadcastSelected.length} cliente(s)?`)) return;

    setBroadcastSending(true);
    setBroadcastResult('');

    try {
      const r = await fetch(`${API}/api/admin/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${_adminToken}`,
          'x-admin-key': ADMIN_KEY,
        },
        body: JSON.stringify({
          emails: broadcastSelected,
          subject: broadcastSubject,
          title: broadcastTitle,
          body: broadcastBody,
          imageUrl: broadcastImageUrl,
          link: broadcastLink,
          linkLabel: broadcastLinkLabel || 'Ver oferta',
          coupon: broadcastCoupon,
        })
      });
      const data = await r.json();
      if (data?.success) {
        setBroadcastResult(`✅ E-mail enviado para ${data.sent} cliente(s) com sucesso!`);
        setBroadcastSelected([]);
        setSelectAll(false);
      } else {
        setBroadcastResult(`❌ Erro: ${data?.message || 'Falha no envio.'}`);
      }
    } catch(e) {
      setBroadcastResult('❌ Erro de conexão com o servidor.');
    }
    setBroadcastSending(false);
  }

  function toggleSelectAll() {
    if (selectAll) {
      setBroadcastSelected([]);
      setSelectAll(false);
    } else {
      setBroadcastSelected(customers.map((c: any) => c.email));
      setSelectAll(true);
    }
  }

  function toggleCustomer(email: string) {
    setBroadcastSelected(prev =>
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  }

  async function dispararRecuperacao() {
    setRecoveryLoading(true)
    setRecoveryMsg('')

    try {
      // Busca estatísticas — rota exige x-admin-key
      const statsRes = await fetch(`${API}/api/recovery/stats`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${_adminToken}`,
          'x-admin-key': ADMIN_KEY,
        }
      });
      const stats = await statsRes.json();

      // Dispara envio de e-mails — rota correta é /api/recovery/send-emails
      const sendRes = await fetch(`${API}/api/recovery/send-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${_adminToken}`,
          'x-admin-key': ADMIN_KEY,
        }
      });
      const result = await sendRes.json();

      if (stats?.success) {
        setRecoveryMsg(
          `📊 Estatísticas de recuperação:\n` +
          `• Total de carrinhos abandonados: ${stats.stats.total}\n` +
          `• Pendentes de e-mail: ${stats.stats.pending}\n` +
          `• E-mails já enviados: ${stats.stats.emailsSent}\n` +
          `• Carrinhos recuperados: ${stats.stats.recovered}\n` +
          `• Taxa de recuperação: ${stats.stats.recoveryRate}\n\n` +
          (result?.sent > 0
            ? `✅ ${result.sent} novo(s) e-mail(s) enviado(s) agora!`
            : `ℹ️ Nenhum carrinho elegível no momento (mínimo 1h de abandono)`)
        )
      } else {
        setRecoveryMsg(`⚠️ ${stats?.message || 'Erro ao buscar estatísticas.'}`)
      }
    } catch(e) {
      setRecoveryMsg('❌ Erro de conexão com o servidor.')
    }

    setRecoveryLoading(false)
  }

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await adminFetch(`${API}/api/maintenance/coupons/create`, {
      method: 'POST',
      body: JSON.stringify({
        code: couponCode.toUpperCase(),
        discountPercent: parseInt(String(couponDiscount)),
        expiresInDays: parseInt(String(couponDays)),
        description: couponDesc
      })
    });
    if (data && data.success) {
      alert('Cupom criado com sucesso!');
      setCouponCode('');
      setCouponDiscount(10);
      setCouponDays(30);
      setCouponDesc('');
      fetchCoupons();
    } else {
      alert('Erro ao criar cupom');
    }
  };

  async function limparDados() {
    if (!window.confirm('Confirma a limpeza de dados antigos? Esta ação não pode ser desfeita.')) return;
    setCleanLoading(true)
    try {
      const r = await fetch(`${API}/api/maintenance/cleanup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${_adminToken}`,
        }
      });
      const data = await r.json();
      if (data?.success) {
        alert(
          `✅ Limpeza concluída!\n\n` +
          `• Códigos OTP removidos: ${data.deleted.otpCodes}\n` +
          `• Carrinhos removidos: ${data.deleted.carts}\n` +
          `• Carrinhos abandonados: ${data.deleted.abandonedCarts}\n` +
          `• Cupons expirados: ${data.deleted.expiredCoupons}`
        )
      } else {
        alert(`❌ Erro: ${data?.message || 'Tente novamente.'}`)
      }
    } catch(e) {
      alert('❌ Erro de conexão com o servidor.')
    }
    setCleanLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return { bg: '#fef3c7', text: '#d97706' };
      case 'PAID': return { bg: '#d1fae5', text: '#065f46' };
      case 'PROCESSING': return { bg: '#ede9fe', text: '#6d28d9' };
      case 'SHIPPED': return { bg: '#dbeafe', text: '#1d4ed8' };
      case 'DELIVERED': return { bg: '#d1fae5', text: '#065f46' };
      case 'CANCELLED': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  if (!autenticado) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f6ff', fontFamily: 'Georgia, serif' }}>
        <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h1 style={{ color: '#1a0533', marginBottom: '24px', fontSize: '24px' }}>Zylumia Admin</h1>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="password"
              placeholder="Senha de acesso"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px', fontFamily: 'sans-serif' }}
            />
            <button type="submit" style={{ background: '#7c3aed', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              ENTRAR
            </button>
            {erroLogin && <p style={{ color: 'red', margin: 0 }}>{erroLogin}</p>}
          </form>
        </div>
      </div>
    );
  }

  const filteredOrders = orderFilter === 'Todos' 
    ? orders 
    : orders.filter(o => o.status === orderFilter);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f6ff', fontFamily: 'Georgia, serif' }}>
      <header style={{ background: '#1a0533', color: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Zylumia Admin</h1>
        <button onClick={handleLogout} style={{ background: 'transparent', color: 'white', border: '1px solid white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Sair</button>
      </header>

      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '2px solid #ede9fe', paddingBottom: '16px', overflowX: 'auto' }}>
          {['Dashboard', 'Pedidos', 'Clientes', 'Newsletter', 'Relatórios', 'Cupons', 'Assinaturas', 'Mensagens'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? '#7c3aed' : 'transparent',
                color: activeTab === tab ? 'white' : '#1a0533',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'Georgia, serif'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Dashboard' && dashboardData && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <h2 style={{ color: '#1a0533', margin: 0 }}>Visão Geral</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[7, 30, 90].map(days => (
                  <button
                    key={days}
                    onClick={() => setReportPeriod(days)}
                    style={{
                      background: reportPeriod === days ? '#7c3aed' : '#f3f4f6',
                      color: reportPeriod === days ? 'white' : '#374151',
                      border: '1px solid #d1d5db',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {days} dias
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontFamily: 'sans-serif' }}>Total Pedidos</h3>
                <p style={{ margin: 0, fontSize: '28px', color: '#1a0533', fontWeight: 'bold' }}>{dashboardData.totalOrders || 0}</p>
              </div>
              <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontFamily: 'sans-serif' }}>Receita Total</h3>
                <p style={{ margin: 0, fontSize: '28px', color: '#1a0533', fontWeight: 'bold' }}>{formatPrice(dashboardData.totalRevenue || 0, 'BR')}</p>
              </div>
              <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontFamily: 'sans-serif' }}>Pedidos Pagos</h3>
                <p style={{ margin: 0, fontSize: '28px', color: '#1a0533', fontWeight: 'bold' }}>{dashboardData.paidOrders || 0}</p>
              </div>
              <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontFamily: 'sans-serif' }}>Hoje</h3>
                <p style={{ margin: 0, fontSize: '28px', color: '#1a0533', fontWeight: 'bold' }}>US$ {dashboardData.todayRevenue?.toFixed(2) || '0.00'}</p>
                <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px', fontFamily: 'sans-serif' }}>{dashboardData.todayOrders || 0} pedidos</p>
              </div>
              <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontFamily: 'sans-serif' }}>Semana</h3>
                <p style={{ margin: 0, fontSize: '28px', color: '#1a0533', fontWeight: 'bold' }}>US$ {dashboardData.weekRevenue?.toFixed(2) || '0.00'}</p>
                <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px', fontFamily: 'sans-serif' }}>{dashboardData.weekOrders || 0} pedidos</p>
              </div>
              <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontFamily: 'sans-serif' }}>Clientes</h3>
                <p style={{ margin: 0, fontSize: '28px', color: '#1a0533', fontWeight: 'bold' }}>{dashboardData.totalCustomers || 0}</p>
              </div>
              <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontFamily: 'sans-serif' }}>Newsletter</h3>
                <p style={{ margin: 0, fontSize: '28px', color: '#1a0533', fontWeight: 'bold' }}>{dashboardData.newsletterSubscribers || 0}</p>
              </div>
            </div>

            <div style={{ marginTop:'24px' }}>
              <div style={{
                background:'white', borderRadius:'12px',
                padding:'24px', border:'1px solid #ede9fe',
                marginBottom:'16px'
              }}>
                <canvas id="revenueChart" height="80"></canvas>
              </div>
              <div style={{
                display:'grid',
                gridTemplateColumns:'1fr 1fr',
                gap:'16px',
                marginBottom:'24px'
              }}>
                <div style={{
                  background:'white', borderRadius:'12px',
                  padding:'24px', border:'1px solid #ede9fe'
                }}>
                  <canvas id="productsChart"></canvas>
                </div>
                <div style={{
                  background:'white', borderRadius:'12px',
                  padding:'24px', border:'1px solid #ede9fe'
                }}>
                  <canvas id="statusChart"></canvas>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Pedidos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: '#1a0533', margin: 0 }}>Pedidos</h2>
              <select 
                value={orderFilter} 
                onChange={e => setOrderFilter(e.target.value)}
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ccc', fontFamily: 'sans-serif' }}
              >
                <option value="Todos">Todos</option>
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
              </select>
            </div>

            <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px', overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontFamily: 'sans-serif', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '12px' }}># Pedido</th>
                    <th style={{ padding: '12px' }}>E-mail</th>
                    <th style={{ padding: '12px' }}>Produto</th>
                    <th style={{ padding: '12px' }}>Total</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Data</th>
                    <th style={{ padding: '12px' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => {
                    const colors = getStatusColor(order.status);
                    return (
                      <tr key={order.id || order._id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px', fontFamily: 'monospace' }}>{(order.id || order._id)?.substring(0,8).toUpperCase()}</td>
                        <td style={{ padding: '12px' }}>{order.customerEmail || order.email}</td>
                        <td style={{ padding: '12px' }}>{order.items?.[0]?.name || 'Produto'}</td>
                        <td style={{ padding: '12px' }}>{formatPrice(order.total || 0, order.currency || order.pais || 'BR')}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ background: colors.bg, color: colors.text, padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '12px' }}>
                          <button 
                            onClick={() => {
                              setSelectedOrder(order);
                              setModalStatus(order.status);
                              setTrackingCode(order.trackingCode || '');
                              setTrackingUrl(order.trackingUrl || '');
                              setEstimatedDays(order.estimatedDays?.toString() || '');
                            }}
                            style={{ background: '#f3f4f6', border: '1px solid #d1d5db', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Atualizar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#888' }}>Nenhum pedido encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Clientes' && (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ color: '#1a0533', margin: 0 }}>Clientes ({customers.length})</h2>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {broadcastSelected.length > 0 && (
                  <span style={{ fontSize: '13px', background: '#ede9fe', color: '#6d28d9', padding: '4px 12px', borderRadius: '20px', fontWeight: 500 }}>
                    {broadcastSelected.length} selecionado(s)
                  </span>
                )}
                <button
                  onClick={() => { setShowBroadcast(true); setBroadcastResult(''); }}
                  title="Enviar e-mail em massa"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#6d28d9,#7c3aed)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', boxShadow: '0 2px 8px rgba(109,40,217,0.3)' }}
                >
                  <span style={{ fontSize: '18px' }}>✉️</span> Enviar E-mail
                </button>
              </div>
            </div>

            {/* Tabela de clientes */}
            <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px', overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontFamily: 'sans-serif', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '12px', width: '40px' }}>
                      <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} title="Selecionar todos" style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#6d28d9' }} />
                    </th>
                    <th style={{ padding: '12px' }}>E-mail</th>
                    <th style={{ padding: '12px' }}>Último login</th>
                    <th style={{ padding: '12px' }}>Último pedido</th>
                    <th style={{ padding: '12px' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee', background: broadcastSelected.includes(customer.email) ? '#faf5ff' : 'white', transition: 'background 0.15s' }}>
                      <td style={{ padding: '12px' }}>
                        <input type="checkbox" checked={broadcastSelected.includes(customer.email)} onChange={() => toggleCustomer(customer.email)} style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#6d28d9' }} />
                      </td>
                      <td style={{ padding: '12px', fontWeight: 500, color: '#1a0533' }}>{customer.email}</td>
                      <td style={{ padding: '12px', color: '#666' }}>{customer.lastLogin ? new Date(customer.lastLogin).toLocaleString('pt-BR') : '-'}</td>
                      <td style={{ padding: '12px', color: '#666' }}>{customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleString('pt-BR') : '-'}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => handleViewCustomerDetails(customer)} title="Ver detalhes" style={{ background: '#f3f4f6', border: '1px solid #d1d5db', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>👁 Ver</button>
                          <button onClick={() => { setBroadcastSelected([customer.email]); setShowBroadcast(true); setBroadcastResult(''); }} title="Enviar e-mail para este cliente" style={{ background: '#ede9fe', border: '1px solid #c4b5fd', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: '#6d28d9' }}>✉️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#888' }}>Nenhum cliente encontrado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Broadcast */}
            {showBroadcast && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                  
                  {/* Modal Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', color: '#1a0533', fontSize: '20px' }}>✉️ Enviar E-mail em Massa</h3>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                        {broadcastSelected.length === 0 ? '⚠️ Nenhum cliente selecionado' : `📤 Será enviado para ${broadcastSelected.length} cliente(s)`}
                      </p>
                    </div>
                    <button onClick={() => setShowBroadcast(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666', lineHeight: 1 }}>✕</button>
                  </div>

                  {/* Destinatários selecionados */}
                  {broadcastSelected.length > 0 && (
                    <div style={{ background: '#faf5ff', border: '1px solid #ede9fe', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#6d28d9' }}>Destinatários ({broadcastSelected.length})</span>
                        <button onClick={() => { setBroadcastSelected([]); setSelectAll(false); }} style={{ fontSize: '11px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Limpar seleção</button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '80px', overflowY: 'auto' }}>
                        {broadcastSelected.map(email => (
                          <span key={email} style={{ background: '#ede9fe', color: '#5b21b6', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {email}
                            <button onClick={() => toggleCustomer(email)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', fontWeight: 'bold', padding: '0', lineHeight: 1, fontSize: '14px' }}>×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Campos do e-mail */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Assunto *</label>
                      <input value={broadcastSubject} onChange={e => setBroadcastSubject(e.target.value)} placeholder="Ex: Oferta exclusiva para você 🎁" style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Título do E-mail</label>
                      <input value={broadcastTitle} onChange={e => setBroadcastTitle(e.target.value)} placeholder="Ex: Desconto especial só para você!" style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Mensagem *</label>
                      <textarea value={broadcastBody} onChange={e => setBroadcastBody(e.target.value)} placeholder="Escreva aqui o corpo do e-mail. Pode usar quebras de linha." rows={5} style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', outline: 'none', fontFamily: 'sans-serif' }} />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>🖼️ URL da Imagem <span style={{ fontWeight: 400, color: '#9ca3af' }}>(opcional)</span></label>
                      <input value={broadcastImageUrl} onChange={e => setBroadcastImageUrl(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
                      {broadcastImageUrl && (
                        <div style={{ marginTop: '8px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', maxHeight: '120px' }}>
                          <img src={broadcastImageUrl} alt="preview" style={{ width: '100%', objectFit: 'cover', maxHeight: '120px' }} onError={e => (e.currentTarget.style.display = 'none')} />
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>🔗 Link do Botão <span style={{ fontWeight: 400, color: '#9ca3af' }}>(opcional)</span></label>
                        <input value={broadcastLink} onChange={e => setBroadcastLink(e.target.value)} placeholder="https://zylumia.com/..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Texto do Botão</label>
                        <input value={broadcastLinkLabel} onChange={e => setBroadcastLinkLabel(e.target.value)} placeholder="Ex: Aproveitar oferta" style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>🎟️ Código de Desconto <span style={{ fontWeight: 400, color: '#9ca3af' }}>(opcional)</span></label>
                      <input value={broadcastCoupon} onChange={e => setBroadcastCoupon(e.target.value.toUpperCase())} placeholder="Ex: VOLTA10" style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', fontFamily: 'monospace', letterSpacing: '2px' }} />
                    </div>
                  </div>

                  {/* Preview */}
                  {(broadcastTitle || broadcastBody) && (
                    <div style={{ marginTop: '20px', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                      <div style={{ background: '#f3f4f6', padding: '8px 16px', fontSize: '12px', color: '#666', fontWeight: 600 }}>📧 Pré-visualização</div>
                      <div style={{ padding: '20px', background: 'white' }}>
                        <div style={{ maxWidth: '500px', margin: '0 auto', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', fontSize: '14px' }}>
                          <div style={{ background: 'linear-gradient(135deg,#1a0533,#6d28d9)', padding: '20px', textAlign: 'center' }}>
                            <p style={{ color: 'white', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Zylumia</p>
                          </div>
                          {broadcastImageUrl && <img src={broadcastImageUrl} alt="" style={{ width: '100%', display: 'block' }} onError={e => (e.currentTarget.style.display='none')} />}
                          <div style={{ padding: '24px' }}>
                            {broadcastTitle && <h2 style={{ margin: '0 0 12px 0', color: '#1a0533', fontSize: '18px' }}>{broadcastTitle}</h2>}
                            {broadcastBody && <p style={{ margin: '0 0 16px 0', color: '#374151', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{broadcastBody}</p>}
                            {broadcastCoupon && (
                              <div style={{ background: '#faf5ff', border: '2px dashed #6d28d9', borderRadius: '8px', padding: '12px', textAlign: 'center', margin: '16px 0' }}>
                                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>Seu cupom exclusivo:</p>
                                <p style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#6d28d9', letterSpacing: '3px' }}>{broadcastCoupon}</p>
                              </div>
                            )}
                            {broadcastLink && (
                              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <span style={{ display: 'inline-block', background: '#6d28d9', color: 'white', padding: '12px 28px', borderRadius: '8px', fontWeight: 600, fontSize: '14px' }}>{broadcastLinkLabel || 'Ver oferta'}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Result message */}
                  {broadcastResult && (
                    <div style={{ marginTop: '16px', padding: '12px 16px', background: broadcastResult.startsWith('✅') ? '#f0fdf4' : '#fef2f2', border: `1px solid ${broadcastResult.startsWith('✅') ? '#bbf7d0' : '#fecaca'}`, borderRadius: '8px', fontSize: '14px', color: broadcastResult.startsWith('✅') ? '#15803d' : '#dc2626' }}>
                      {broadcastResult}
                    </div>
                  )}

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                    <button onClick={() => setShowBroadcast(false)} style={{ padding: '10px 24px', border: '1px solid #d1d5db', background: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>Cancelar</button>
                    <button
                      onClick={enviarBroadcast}
                      disabled={broadcastSending || broadcastSelected.length === 0}
                      style={{ padding: '10px 28px', background: broadcastSending ? '#9ca3af' : 'linear-gradient(135deg,#6d28d9,#7c3aed)', color: 'white', border: 'none', borderRadius: '8px', cursor: broadcastSending ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      {broadcastSending ? '⏳ Enviando...' : `✉️ Enviar para ${broadcastSelected.length} cliente(s)`}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Newsletter' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <h2 style={{ color: '#1a0533', margin: 0 }}>Newsletter</h2>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button 
                  onClick={limparDados}
                  style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'sans-serif' }}
                >
                  🧹 Limpar Dados Antigos
                </button>
                <button 
                  onClick={dispararRecuperacao}
                  style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'sans-serif' }}
                >
                  Disparar Recuperação de Carrinho
                </button>
              </div>
            </div>
            <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px', overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontFamily: 'sans-serif', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '12px' }}>E-mail</th>
                    <th style={{ padding: '12px' }}>Nome</th>
                    <th style={{ padding: '12px' }}>Cupom</th>
                    <th style={{ padding: '12px' }}>Data inscrição</th>
                  </tr>
                </thead>
                <tbody>
                  {newsletter.map((sub, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{sub.email}</td>
                      <td style={{ padding: '12px' }}>{sub.name || '-'}</td>
                      <td style={{ padding: '12px' }}>{sub.coupon || '-'}</td>
                      <td style={{ padding: '12px' }}>{sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                  {newsletter.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#888' }}>Nenhum inscrito encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Relatórios' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <h2 style={{ color: '#1a0533', margin: 0 }}>Relatórios</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[7, 30, 90].map(days => (
                  <button
                    key={days}
                    onClick={() => setReportPeriod(days)}
                    style={{
                      background: reportPeriod === days ? '#7c3aed' : '#f3f4f6',
                      color: reportPeriod === days ? 'white' : '#374151',
                      border: '1px solid #d1d5db',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {days} dias
                  </button>
                ))}
              </div>
            </div>

            {reportsData && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                  <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontFamily: 'sans-serif' }}>Hoje</h3>
                    <p style={{ margin: 0, fontSize: '28px', color: '#1a0533', fontWeight: 'bold' }}>
                      US$ {(reportsData.byDay.find((d: any) => d.date === new Date().toISOString().split('T')[0])?.revenue || 0).toFixed(2)}
                    </p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#666' }}>
                      {reportsData.byDay.find((d: any) => d.date === new Date().toISOString().split('T')[0])?.orders || 0} pedidos
                    </p>
                  </div>
                  <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontFamily: 'sans-serif' }}>Total Pedidos</h3>
                    <p style={{ margin: 0, fontSize: '28px', color: '#1a0533', fontWeight: 'bold' }}>{reportsData.totalOrders || 0}</p>
                  </div>
                  <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontFamily: 'sans-serif' }}>Receita Total</h3>
                    <p style={{ margin: 0, fontSize: '28px', color: '#1a0533', fontWeight: 'bold' }}>{formatPrice(reportsData.totalRevenue || 0, 'BR')}</p>
                  </div>
                  <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontFamily: 'sans-serif' }}>Ticket Médio</h3>
                    <p style={{ margin: 0, fontSize: '28px', color: '#1a0533', fontWeight: 'bold' }}>US$ {reportsData.averageTicket?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                  <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px', overflowX: 'auto' }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#1a0533', fontSize: '18px' }}>Por Dia</h3>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontFamily: 'sans-serif', fontSize: '14px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #eee' }}>
                          <th style={{ padding: '12px' }}>Data</th>
                          <th style={{ padding: '12px' }}>Pedidos</th>
                          <th style={{ padding: '12px' }}>Receita</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(reportsData.byDay || []).map((day: any, i: number) => (
                          <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px' }}>{day.date}</td>
                            <td style={{ padding: '12px' }}>{day.orders}</td>
                            <td style={{ padding: '12px' }}>US$ {day.revenue?.toFixed(2) || '0.00'}</td>
                          </tr>
                        ))}
                        {(!reportsData.byDay || reportsData.byDay.length === 0) && (
                          <tr>
                            <td colSpan={3} style={{ padding: '24px', textAlign: 'center', color: '#888' }}>Nenhum dado no período.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px', overflowX: 'auto' }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#1a0533', fontSize: '18px' }}>Por Produto</h3>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontFamily: 'sans-serif', fontSize: '14px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #eee' }}>
                          <th style={{ padding: '12px' }}>Produto</th>
                          <th style={{ padding: '12px' }}>Quantidade</th>
                          <th style={{ padding: '12px' }}>Receita</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(reportsData.byProduct || []).map((prod: any, i: number) => (
                          <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px' }}>{prod.name}</td>
                            <td style={{ padding: '12px' }}>{prod.qty}</td>
                            <td style={{ padding: '12px' }}>US$ {prod.revenue?.toFixed(2) || '0.00'}</td>
                          </tr>
                        ))}
                        {(!reportsData.byProduct || reportsData.byProduct.length === 0) && (
                          <tr>
                            <td colSpan={3} style={{ padding: '24px', textAlign: 'center', color: '#888' }}>Nenhum dado no período.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'Cupons' && (
          <div>
            <h2 style={{ color: '#1a0533', marginBottom: '24px' }}>Cupons de Desconto</h2>
            
            <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
              <h3 style={{ margin: '0 0 16px 0', color: '#1a0533', fontSize: '18px' }}>Criar Novo Cupom</h3>
              <form onSubmit={handleCreateCoupon} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Código</label>
                  <input 
                    type="text" 
                    value={couponCode} 
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Ex: PASCOA25"
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                </div>
                <div style={{ flex: '1 1 150px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Desconto %</label>
                  <input 
                    type="number" 
                    min="1" max="100"
                    value={couponDiscount} 
                    onChange={e => setCouponDiscount(Number(e.target.value))}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '8px' }}
                  />
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {[10, 15, 20, 25, 30, 50].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setCouponDiscount(pct)}
                        style={{
                          background: couponDiscount === pct ? '#7c3aed' : '#f3f4f6',
                          color: couponDiscount === pct ? 'white' : '#374151',
                          border: '1px solid #d1d5db',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ flex: '1 1 150px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Válido por (dias)</label>
                  <input 
                    type="number" 
                    min="1"
                    value={couponDays} 
                    onChange={e => setCouponDays(Number(e.target.value))}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                </div>
                <div style={{ flex: '2 1 300px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Descrição (opcional)</label>
                  <input 
                    type="text" 
                    value={couponDesc} 
                    onChange={e => setCouponDesc(e.target.value)}
                    placeholder="Ex: Promoção de Páscoa"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                  />
                </div>
                <button 
                  type="submit"
                  style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', height: '42px' }}
                >
                  CRIAR CUPOM
                </button>
              </form>
            </div>

            <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px', overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontFamily: 'sans-serif', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '12px' }}>Código</th>
                    <th style={{ padding: '12px' }}>Desconto</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Expira em</th>
                    <th style={{ padding: '12px' }}>Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon, i) => {
                    let statusColor = { bg: '#d1fae5', text: '#065f46' }; // Ativo
                    let statusText = 'Ativo';
                    
                    if (coupon.used) {
                      statusColor = { bg: '#f3f4f6', text: '#374151' }; // Usado
                      statusText = 'Usado';
                    } else if (new Date(coupon.expiresAt) < new Date()) {
                      statusColor = { bg: '#fee2e2', text: '#991b1b' }; // Expirado
                      statusText = 'Expirado';
                    }

                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{coupon.code}</td>
                        <td style={{ padding: '12px' }}>{coupon.discountPercent}%</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ background: statusColor.bg, color: statusColor.text, padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                            {statusText}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                        <td style={{ padding: '12px', color: '#666' }}>{coupon.description || '-'}</td>
                      </tr>
                    );
                  })}
                  {coupons.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#888' }}>Nenhum cupom encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Assinaturas' && (
          <div>
            <h2 style={{ color: '#1a0533', marginBottom: '24px' }}>Assinaturas</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
              <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontFamily: 'sans-serif' }}>Ativas</h3>
                <p style={{ margin: 0, fontSize: '28px', color: '#10b981', fontWeight: 'bold' }}>{subsStats.active}</p>
              </div>
              <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontFamily: 'sans-serif' }}>Canceladas</h3>
                <p style={{ margin: 0, fontSize: '28px', color: '#ef4444', fontWeight: 'bold' }}>{subsStats.cancelled}</p>
              </div>
              <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', fontFamily: 'sans-serif' }}>MRR</h3>
                <p style={{ margin: 0, fontSize: '28px', color: '#7c3aed', fontWeight: 'bold' }}>US$ {subsStats.mrr?.toFixed(2) || '0.00'}</p>
              </div>
            </div>

            <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px', overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontFamily: 'sans-serif', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '12px' }}>E-mail</th>
                    <th style={{ padding: '12px' }}>Plano</th>
                    <th style={{ padding: '12px' }}>Preço/mês</th>
                    <th style={{ padding: '12px' }}>Status</th>
                    <th style={{ padding: '12px' }}>Próx. cobrança</th>
                    <th style={{ padding: '12px' }}>Ativada em</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub, i) => {
                    let statusColor = { bg: '#f3f4f6', text: '#374151' };
                    if (sub.status === 'ACTIVE') statusColor = { bg: '#d1fae5', text: '#065f46' };
                    if (sub.status === 'CANCELLED') statusColor = { bg: '#fee2e2', text: '#991b1b' };
                    if (sub.status === 'PENDING') statusColor = { bg: '#fef3c7', text: '#92400e' };
                    if (sub.status === 'SUSPENDED') statusColor = { bg: '#ffedd5', text: '#9a3412' };

                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{sub.customerEmail}</td>
                        <td style={{ padding: '12px' }}>{sub.planId}</td>
                        <td style={{ padding: '12px' }}>{formatPrice(sub.price || 0, sub.currency || 'BR')}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ background: statusColor.bg, color: statusColor.text, padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                            {sub.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>{sub.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString() : '-'}</td>
                        <td style={{ padding: '12px' }}>{sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : '-'}</td>
                      </tr>
                    );
                  })}
                  {subscriptions.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#888' }}>Nenhuma assinatura encontrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Mensagens' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: '#1a0533', margin: 0 }}>Mensagens dos Clientes</h2>
              <button
                onClick={fetchMessages}
                style={{ background: '#f3f4f6', border: '1px solid #d1d5db', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                🔄 Atualizar
              </button>
            </div>

            {adminMessages.length === 0 ? (
              <div style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '48px', textAlign: 'center', color: '#888' }}>
                Nenhuma mensagem recebida.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {adminMessages.map(msg => (
                  <div key={msg.id} style={{ background: 'white', border: '1px solid #ede9fe', borderRadius: '12px', padding: '24px' }}
                    onClick={() => { if (msg.status === 'UNREAD') handleMarkRead(msg.id); }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#1a0533', fontFamily: 'sans-serif' }}>{msg.customerEmail}</span>
                        {msg.subject && (
                          <span style={{ marginLeft: '12px', color: '#6b7280', fontSize: '14px', fontFamily: 'sans-serif' }}>— {msg.subject}</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'sans-serif' }}>
                          {new Date(msg.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                        <span style={{
                          background: msg.status === 'REPLIED' ? '#d1fae5' : msg.status === 'READ' ? '#dbeafe' : '#fef3c7',
                          color: msg.status === 'REPLIED' ? '#065f46' : msg.status === 'READ' ? '#1e40af' : '#92400e',
                          padding: '2px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 'bold', fontFamily: 'sans-serif'
                        }}>
                          {msg.status === 'REPLIED' ? '✅ Respondido' : msg.status === 'READ' ? '👀 Lido' : '🔴 Novo'}
                        </span>
                      </div>
                    </div>

                    <p style={{ color: '#374151', fontSize: '14px', fontFamily: 'sans-serif', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
                      {msg.message}
                    </p>

                    {msg.replies?.map((reply: any) => (
                      <div key={reply.id} style={{ background: '#f3e8ff', borderRadius: '8px', padding: '12px', marginBottom: '12px', borderLeft: '4px solid #7c3aed' }}>
                        <p style={{ fontSize: '12px', color: '#7c3aed', fontWeight: 'bold', marginBottom: '6px', fontFamily: 'sans-serif' }}>
                          💜 Resposta — {new Date(reply.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                        <p style={{ color: '#374151', fontSize: '14px', margin: 0, fontFamily: 'sans-serif' }}>{reply.text}</p>
                      </div>
                    ))}

                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <textarea
                        value={replyTexts[msg.id] || ''}
                        onChange={e => setReplyTexts(prev => ({ ...prev, [msg.id]: e.target.value }))}
                        placeholder="Escreva a resposta..."
                        rows={2}
                        style={{ flex: 1, padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontFamily: 'sans-serif', resize: 'vertical' }}
                      />
                      <button
                        onClick={() => handleReply(msg.id)}
                        disabled={replyLoading[msg.id] || !replyTexts[msg.id]?.trim()}
                        style={{
                          background: replyLoading[msg.id] ? '#9ca3af' : '#7c3aed',
                          color: 'white', border: 'none', borderRadius: '8px',
                          padding: '10px 20px', fontWeight: 'bold', cursor: 'pointer',
                          fontSize: '14px', fontFamily: 'sans-serif', alignSelf: 'flex-end'
                        }}
                      >
                        {replyLoading[msg.id] ? '...' : 'Responder'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Atualizar Pedido */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, fontFamily: 'sans-serif' }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', color: '#1a0533', fontFamily: 'Georgia, serif' }}>
              Atualizar Pedido #{(selectedOrder.id || selectedOrder._id)?.substring(0,8).toUpperCase()}
            </h3>
            <form onSubmit={handleUpdateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Status</label>
                <select 
                  value={modalStatus} 
                  onChange={e => setModalStatus(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                >
                  <option value="PENDING">⏳ Pendente</option>
                  <option value="PAID">✅ Pago</option>
                  <option value="PROCESSING">⚙️ Processando</option>
                  <option value="SHIPPED">🚚 Enviado</option>
                  <option value="DELIVERED">🎉 Entregue</option>
                  <option value="CANCELLED">❌ Cancelado</option>
                </select>
              </div>

              {modalStatus === 'SHIPPED' && (
                <>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Código de rastreamento</label>
                    <input 
                      type="text" 
                      value={trackingCode} 
                      onChange={e => setTrackingCode(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>URL rastreamento</label>
                    <input 
                      type="url" 
                      value={trackingUrl} 
                      onChange={e => setTrackingUrl(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Prazo estimado (dias)</label>
                <input 
                  type="number" 
                  value={estimatedDays} 
                  onChange={e => setEstimatedDays(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button 
                  type="button" 
                  onClick={() => setSelectedOrder(null)}
                  style={{ flex: 1, padding: '12px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  CANCELAR
                </button>
                <button 
                  type="submit"
                  style={{ flex: 1, padding: '12px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  SALVAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalhes do Cliente */}
      {selectedCustomer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, fontFamily: 'sans-serif' }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', color: '#1a0533', fontFamily: 'Georgia, serif' }}>
                👤 {selectedCustomer.email}
              </h3>
              <button 
                onClick={() => setSelectedCustomer(null)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#9ca3af' }}
              >
                &times;
              </button>
            </div>

            {loadingCustomerDetails ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>Carregando dados...</div>
            ) : (
              <div>
                <div style={{ marginBottom: '24px', background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <p style={{ margin: '0 0 8px 0', color: '#4b5563', fontSize: '14px' }}><strong>Último login:</strong> {selectedCustomer.lastLogin ? new Date(selectedCustomer.lastLogin).toLocaleDateString() : '-'}</p>
                  <p style={{ margin: '0 0 8px 0', color: '#4b5563', fontSize: '14px' }}><strong>Total de pedidos:</strong> {customerDetails?.pedidos?.length || 0}</p>
                  <p style={{ margin: 0, color: '#4b5563', fontSize: '14px' }}><strong>Total gasto:</strong> {formatPrice((customerDetails?.pedidos || []).reduce((acc: number, o: any) => acc + (o.total || 0), 0).toFixed(2).replace('.', ',')}</p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#111827' }}>PEDIDOS:</h4>
                  {customerDetails?.pedidos?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {customerDetails.pedidos.map((o: any, i: number) => {
                        let itemName = 'Produto';
                        if (o.items && o.items[0] && o.items[0].name) {
                          if (o.items[0].name.includes('1 mês')) itemName = '1 mês';
                          else if (o.items[0].name.includes('3 meses')) itemName = '3 meses';
                          else if (o.items[0].name.includes('6 meses')) itemName = '6 meses';
                        }
                        
                        let statusText = o.status;
                        if (o.status === 'PAID') statusText = 'PAGO';
                        if (o.status === 'SHIPPED') statusText = 'ENV';
                        if (o.status === 'DELIVERED') statusText = 'ENT';
                        if (o.status === 'PENDING') statusText = 'PEND';
                        
                        return (
                          <div key={i} style={{ background: '#f3f4f6', padding: '12px', borderRadius: '6px', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 'bold', color: '#374151' }}>#{o.id?.substring(0,8).toUpperCase()}</span>
                            <span style={{ color: '#4b5563' }}>{itemName}</span>
                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>{formatPrice((o.total || 0).toFixed(2).replace('.', ',')}</span>
                            <span style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{statusText}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Nenhum pedido encontrado.</p>
                  )}
                </div>

                <div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#111827' }}>ASSINATURA:</h4>
                  {customerDetails?.assinatura ? (
                    <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '16px', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 8px 0', color: '#065f46', fontSize: '14px', fontWeight: 'bold' }}>
                        ✅ Ativa — {(customerDetails.assinatura.items && customerDetails.assinatura.items[0]?.name) || 'Kit'} — {formatPrice((customerDetails.assinatura.total || 0).toFixed(2).replace('.', ',')}/mês
                      </p>
                      <p style={{ margin: 0, color: '#047857', fontSize: '14px' }}>
                        <strong>Próxima cobrança:</strong> {customerDetails.assinatura.nextBillingDate ? new Date(customerDetails.assinatura.nextBillingDate).toLocaleDateString() : '-'}
                      </p>
                    </div>
                  ) : (
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Nenhuma assinatura ativa.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
