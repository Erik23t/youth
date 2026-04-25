import React from 'react';

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

export default function PoliticaPrivacidade() {
  return (
    <div style={estilos.pagina}>
      <h1 style={estilos.titulo}>Política de Privacidade</h1>
      <p style={estilos.dataAtualizacao}>Última atualização: 01/03/2025</p>
      <p style={estilos.texto}>
        Na Zylumia, estamos comprometidas em proteger sua privacidade e seus 
        dados pessoais, em conformidade com o Regulamento Geral de Proteção 
        de Dados (RGPD/GDPR) da União Europeia.
      </p>

      <h2 style={estilos.secaoTitulo}>1. Informações que Coletamos</h2>
      <ul style={{ color: '#555', lineHeight: '1.8', fontSize: '15px', paddingLeft: '20px' }}>
        <li>Nome completo</li>
        <li>Endereço de entrega e faturamento</li>
        <li>Endereço de e-mail</li>
        <li>Número de telefone</li>
        <li>Informações de pagamento (processadas de forma segura por terceiros certificados)</li>
      </ul>

      <div style={estilos.separador} />

      <h2 style={estilos.secaoTitulo}>2. Utilização das Informações</h2>
      <ul style={{ color: '#555', lineHeight: '1.8', fontSize: '15px', paddingLeft: '20px' }}>
        <li>Processar e entregar seus pedidos</li>
        <li>Fornecer suporte ao cliente</li>
        <li>Enviar atualizações sobre o status do pedido</li>
        <li>Enviar comunicações de marketing, caso você tenha autorizado (newsletter)</li>
      </ul>

      <div style={estilos.separador} />

      <h2 style={estilos.secaoTitulo}>3. Segurança de Dados</h2>
      <p style={estilos.texto}>
        Tomamos as medidas técnicas e organizacionais adequadas para proteger 
        seus dados pessoais. Não armazenamos dados de cartão de crédito em 
        nossos servidores. Os pagamentos são processados por gateways 
        certificados e criptografados.
      </p>

      <div style={estilos.separador} />

      <h2 style={estilos.secaoTitulo}>4. Partilha de Informações</h2>
      <p style={estilos.texto}>
        Seus dados nunca são vendidos ou compartilhados com terceiros para 
        fins comerciais. Compartilhamos informações apenas quando estritamente 
        necessário para processar e entregar o seu pedido ou cumprir 
        obrigações legais.
      </p>

      <div style={estilos.separador} />

      <h2 style={estilos.secaoTitulo}>5. Seus Direitos (RGPD)</h2>
      {[
        { direito: 'Direito de acesso', desc: 'Solicitar uma cópia dos seus dados pessoais que possuímos.' },
        { direito: 'Direito de retificação', desc: 'Corrigir dados incorretos ou incompletos.' },
        { direito: 'Direito ao apagamento', desc: 'Solicitar a exclusão dos seus dados ("direito ao esquecimento").' },
        { direito: 'Direito de oposição', desc: 'Opor-se ao tratamento dos seus dados para fins de marketing.' },
        { direito: 'Direito de portabilidade', desc: 'Receber os seus dados em formato legível por máquina.' },
      ].map((item, i) => (
        <div key={i} style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
          <span style={{ color: '#7c3aed', fontWeight: 'bold', minWidth: '200px' }}>✦ {item.direito}:</span>
          <span style={{ color: '#555' }}>{item.desc}</span>
        </div>
      ))}

      <div style={estilos.separador} />

      <h2 style={estilos.secaoTitulo}>6. Cookies</h2>
      <p style={estilos.texto}>
        O nosso site utiliza cookies para melhorar a experiência de navegação. 
        Você pode gerir as preferências de cookies a qualquer momento nas 
        configurações do seu navegador.
      </p>

      <RodapeContato mensagem="Dúvidas sobre privacidade? Teremos prazer em ajudar." />
    </div>
  );
}
