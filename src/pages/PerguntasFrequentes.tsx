import React, { useState } from 'react';

const estilos = {
  pagina: {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '60px 20px',
    fontFamily: 'Georgia, serif',
  },
  titulo: {
    color: '#1a0533',
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  dataAtualizacao: {
    color: '#888',
    fontSize: '13px',
    marginBottom: '40px',
  },
  secaoTitulo: {
    color: '#7c3aed',
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: '40px',
    marginBottom: '16px',
  },
  texto: {
    color: '#555',
    lineHeight: '1.8',
    fontSize: '15px',
    marginBottom: '16px',
  },
  separador: {
    borderTop: '1px solid #ede9fe',
    margin: '32px 0',
  },
  destaque: {
    background: '#f3e8ff',
    border: '1px solid #ede9fe',
    borderRadius: '8px',
    padding: '16px 20px',
    color: '#6d28d9',
    marginBottom: '16px',
  },
  atencao: {
    background: '#fef3c7',
    border: '1px solid #fcd34d',
    borderRadius: '8px',
    padding: '16px 20px',
    color: '#92400e',
    marginBottom: '16px',
    fontWeight: 'bold',
  },
  email: {
    color: '#7c3aed',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};

function RodapeContato({ mensagem }: { mensagem: string }) {
  return (
    <div style={{ 
      background: '#f9f6ff', border: '1px solid #ede9fe',
      borderRadius: '12px', padding: '24px', 
      textAlign: 'center', marginTop: '48px' 
    }}>
      <p style={{ color: '#555', marginBottom: '8px' }}>{mensagem}</p>
      <a href="mailto:zylumiaa@gmail.com" style={{ 
        color: '#7c3aed', fontWeight: 'bold', fontSize: '16px' 
      }}>
        zylumiaa@gmail.com
      </a>
    </div>
  );
}

const faqs = [
  {
    categoria: '💜 Sobre os Produtos',
    perguntas: [
      { p: 'Os produtos Zylumia são testados dermatologicamente?', r: 'Sim! Todos os nossos produtos passam por testes dermatológicos rigorosos antes de serem lançados. Trabalhamos com dermatologistas e especialistas em cosmetologia para garantir segurança e eficácia em cada fórmula.' },
      { p: 'Os produtos contêm parabenos, sulfatos ou fragrâncias artificiais?', r: 'Não. A Zylumia tem um compromisso firme com fórmulas limpas. Nossos produtos são livres de parabenos, sulfatos agressivos e fragrâncias sintéticas desnecessárias.' },
      { p: 'Os produtos Zylumia são veganos e cruelty-free?', r: 'A grande maioria dos nossos produtos é vegana. Todos são 100% cruelty-free — nunca testamos em animais e nunca iremos.' },
      { p: 'Quanto tempo leva para ver os resultados?', r: 'Em geral, nossas clientes começam a notar diferenças entre 2 e 4 semanas de uso consistente. Para resultados ideais, recomendamos o uso diário conforme a indicação de cada produto.' },
      { p: 'Posso usar os produtos durante a gravidez ou amamentação?', r: 'Recomendamos consultar seu médico ou dermatologista antes de usar qualquer produto de skincare durante a gravidez ou amamentação.' },
    ]
  },
  {
    categoria: '💳 Pedidos e Pagamentos',
    perguntas: [
      { p: 'Quais formas de pagamento são aceitas?', r: 'Aceitamos os principais cartões de crédito e débito (Visa, Mastercard, American Express), PayPal e outros métodos disponíveis na finalização da compra. Todos os pagamentos são processados de forma segura e criptografada.' },
      { p: 'Posso cancelar ou alterar meu pedido?', r: 'Você pode cancelar seu pedido em até 14 dias após o recebimento, conforme o direito de retirada previsto na legislação europeia. Entre em contato por e-mail o mais rápido possível.' },
      { p: 'Meus dados de pagamento são seguros?', r: 'Sim. Não armazenamos dados de cartão de crédito em nossos servidores. Todos os pagamentos são processados por gateways certificados e criptografados.' },
    ]
  },
  {
    categoria: '🚚 Envio e Entrega',
    perguntas: [
      { p: 'Qual é o prazo de entrega?', r: 'Processamos todos os pedidos em até 24 horas úteis. O prazo de entrega é de 5 a 10 dias úteis após o despacho. Você receberá um código de rastreamento por e-mail assim que o pedido for enviado.' },
      { p: 'Vocês entregam em toda a Europa?', r: 'Sim! Entregamos em toda a Europa, incluindo Portugal, Espanha, França, Alemanha, Itália, Holanda, Bélgica, Suíça e muitos outros países. Frete grátis em pedidos acima de €50.' },
      { p: 'Como rastrear meu pedido?', r: 'Assim que seu pedido for despachado, você receberá um e-mail com o código de rastreamento. Use a nossa página "Acompanhe seu Pedido" para consultar o status em tempo real.' },
    ]
  },
  {
    categoria: '↩️ Devoluções e Privacidade',
    perguntas: [
      { p: 'Posso devolver um produto?', r: 'Sim, dentro de 180 dias após o recebimento, caso não esteja satisfeita. O produto deve estar nas condições originais. Pela lei europeia, você também tem direito de retirada em 14 dias sem necessidade de justificativa.' },
      { p: 'Como a Zylumia protege meus dados pessoais?', r: 'Seguimos rigorosamente o RGPD (GDPR) da União Europeia. Seus dados são usados exclusivamente para processar pedidos e comunicação autorizada. Nunca vendemos ou compartilhamos seus dados com terceiros para fins comerciais.' },
    ]
  },
];

export default function PerguntasFrequentes() {
  const [aberta, setAberta] = useState<number | null>(null);

  return (
    <div style={estilos.pagina}>
      <h1 style={estilos.titulo}>Perguntas Frequentes</h1>
      <p style={estilos.dataAtualizacao}>Encontre respostas para as dúvidas mais comuns</p>

      {faqs.map((cat, ci) => (
        <div key={ci}>
          <h2 style={estilos.secaoTitulo}>{cat.categoria}</h2>
          {cat.perguntas.map((faq, fi) => {
            const idx = ci * 100 + fi;
            const isAberta = aberta === idx;
            return (
              <div key={fi} style={{
                border: '1px solid #ede9fe', borderRadius: '8px',
                marginBottom: '8px', overflow: 'hidden'
              }}>
                <button
                  onClick={() => setAberta(isAberta ? null : idx)}
                  style={{
                    width: '100%', padding: '16px 20px',
                    background: isAberta ? '#f3e8ff' : 'white',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', textAlign: 'left',
                    color: '#1a0533', fontWeight: 'bold',
                    fontSize: '15px', fontFamily: 'Georgia, serif'
                  }}
                >
                  {faq.p}
                  <span style={{ color: '#7c3aed', fontSize: '20px', marginLeft: '16px' }}>
                    {isAberta ? '−' : '+'}
                  </span>
                </button>
                {isAberta && (
                  <div style={{
                    padding: '16px 20px', background: '#faf7ff',
                    color: '#555', lineHeight: '1.8', fontSize: '15px'
                  }}>
                    {faq.r}
                  </div>
                )}
              </div>
            );
          })}
          {ci < faqs.length - 1 && <div style={estilos.separador} />}
        </div>
      ))}

      <RodapeContato mensagem="Não encontrou o que procurava? Respondemos em até 24 horas úteis." />
    </div>
  );
}
