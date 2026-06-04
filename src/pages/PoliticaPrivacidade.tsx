import React from 'react';

const S = {
  pagina: { maxWidth: '860px', margin: '0 auto', padding: '48px 16px', fontFamily: 'Georgia, serif' },
  titulo: { color: '#1a0533', fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 'bold', marginBottom: '8px' },
  data: { color: '#888', fontSize: '13px', marginBottom: '40px' },
  intro: { color: '#555', lineHeight: '1.9', fontSize: '15px', marginBottom: '24px',
    background: '#f9f6ff', border: '1px solid #ede9fe', borderRadius: '10px', padding: '20px 24px' },
  secao: { color: '#7c3aed', fontSize: '18px', fontWeight: 'bold', marginTop: '40px', marginBottom: '14px' },
  texto: { color: '#555', lineHeight: '1.9', fontSize: '15px', marginBottom: '16px' },
  sep: { borderTop: '1px solid #ede9fe', margin: '32px 0' },
  lista: { color: '#555', lineHeight: '2', fontSize: '15px', paddingLeft: '20px', marginBottom: '16px' },
  destaque: { background: '#f3e8ff', border: '1px solid #ede9fe', borderRadius: '8px',
    padding: '16px 20px', color: '#6d28d9', marginBottom: '16px', fontSize: '15px' },
  aviso: { background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px',
    padding: '16px 20px', color: '#92400e', marginBottom: '16px', fontWeight: 'bold' as const, fontSize: '14px' },
  email: { color: '#7c3aed', textDecoration: 'none', fontWeight: 'bold' },
};

function Separador() { return <div style={S.sep} />; }

function RodapeContato() {
  return (
    <div style={{ background: '#f9f6ff', border: '1px solid #ede9fe', borderRadius: '12px',
      padding: '24px', textAlign: 'center' as const, marginTop: '48px' }}>
      <p style={{ color: '#555', marginBottom: '8px' }}>Dúvidas sobre privacidade? Fale conosco.</p>
      <a href="mailto:zylumiaa@gmail.com" style={{ color: '#7c3aed', fontWeight: 'bold', fontSize: '16px' }}>
        zylumiaa@gmail.com
      </a>
    </div>
  );
}

export default function PoliticaPrivacidade() {
  return (
    <div style={S.pagina}>
      <h1 style={S.titulo}>Política de Privacidade</h1>
      <p style={S.data}>Última atualização: 10 de agosto de 2025</p>

      <p style={S.intro}>
        A Zylumia opera esta loja e site para oferecer uma experiência de compra personalizada. Esta Política descreve como coletamos, utilizamos e divulgamos suas informações pessoais quando você visita, utiliza ou realiza uma compra em nosso site.
      </p>

      <h2 style={S.secao}>1. Informações Pessoais que Coletamos</h2>
      <p style={S.texto}>Dependendo de como você interage com nossos serviços, podemos coletar as seguintes categorias de informações:</p>
      <ul style={S.lista}>
        <li><strong>Dados de contato:</strong> nome, endereço, endereço de entrega e faturamento, telefone e e-mail.</li>
        <li><strong>Dados financeiros:</strong> informações de cartão de crédito/débito e detalhes de transação (processados de forma segura por terceiros certificados).</li>
        <li><strong>Dados de conta:</strong> nome de usuário, senha, preferências e configurações.</li>
        <li><strong>Dados de transação:</strong> itens visualizados, adicionados ao carrinho, comprados ou devolvidos.</li>
        <li><strong>Comunicações:</strong> informações fornecidas ao entrar em contato com nosso suporte.</li>
        <li><strong>Dados de dispositivo:</strong> informações sobre seu navegador, conexão de rede e endereço IP.</li>
        <li><strong>Dados de uso:</strong> como e quando você interage com o site.</li>
      </ul>

      <Separador />

      <h2 style={S.secao}>2. Fontes das Informações</h2>
      <ul style={S.lista}>
        <li>Diretamente de você (ao criar conta, fazer compras ou entrar em contato).</li>
        <li>Automaticamente via cookies e tecnologias similares ao navegar no site.</li>
        <li>De prestadores de serviços que nos ajudam a operar a plataforma.</li>
        <li>De parceiros comerciais e terceiros autorizados.</li>
      </ul>

      <Separador />

      <h2 style={S.secao}>3. Como Usamos Suas Informações</h2>
      {[
        { t: 'Prestação e melhoria dos serviços', d: 'Processar pagamentos, cumprir pedidos, lembrar preferências, gerenciar sua conta e criar uma experiência de compra personalizada.' },
        { t: 'Marketing e publicidade', d: 'Enviar comunicações promocionais por e-mail, SMS ou correio e exibir anúncios personalizados com base em suas interações.' },
        { t: 'Segurança e prevenção de fraudes', d: 'Autenticar sua conta, garantir um checkout seguro e detectar atividades suspeitas ou ilegais.' },
        { t: 'Comunicação', d: 'Responder a solicitações de suporte e manter nosso relacionamento comercial com você.' },
        { t: 'Obrigações legais', d: 'Cumprir leis aplicáveis, responder a processos legais e fazer cumprir nossos termos e políticas.' },
      ].map((item, i) => (
        <div key={i} style={{ marginBottom: '16px' }}>
          <p style={{ ...S.texto, marginBottom: '4px' }}><strong style={{ color: '#7c3aed' }}>✦ {item.t}:</strong></p>
          <p style={{ ...S.texto, marginTop: 0, paddingLeft: '16px' }}>{item.d}</p>
        </div>
      ))}

      <Separador />

      <h2 style={S.secao}>4. Compartilhamento de Informações</h2>
      <p style={S.texto}>Podemos compartilhar suas informações pessoais nas seguintes circunstâncias:</p>
      <ul style={S.lista}>
        <li>Com fornecedores e prestadores de serviços (processamento de pagamentos, logística, suporte ao cliente, armazenamento em nuvem).</li>
        <li>Com parceiros de marketing para exibição de publicidade personalizada, conforme autorizado por você.</li>
        <li>Quando você solicitar ou consentir o compartilhamento com terceiros.</li>
        <li>Com empresas do nosso grupo corporativo.</li>
        <li>Em conexão com transações comerciais (como fusões) ou para cumprir obrigações legais.</li>
      </ul>

      <div style={S.aviso}>
        🔒 Seus dados nunca são vendidos a terceiros para fins comerciais sem sua autorização expressa.
      </div>

      <Separador />

      <h2 style={S.secao}>5. Segurança e Retenção</h2>
      <p style={S.texto}>
        Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais. Não armazenamos dados completos de cartão de crédito em nossos servidores — todos os pagamentos são processados por gateways certificados e criptografados.
      </p>
      <p style={S.texto}>
        O período de retenção das suas informações varia conforme a necessidade de manutenção da conta, prestação dos serviços, cumprimento de obrigações legais e resolução de disputas.
      </p>

      <Separador />

      <h2 style={S.secao}>6. Seus Direitos</h2>
      <p style={S.texto}>Dependendo de onde você reside, você pode ter os seguintes direitos:</p>
      {[
        { d: 'Acesso', desc: 'Solicitar uma cópia das suas informações pessoais que possuímos.' },
        { d: 'Exclusão', desc: 'Solicitar a exclusão das suas informações pessoais ("direito ao esquecimento").' },
        { d: 'Retificação', desc: 'Corrigir informações incorretas ou incompletas.' },
        { d: 'Portabilidade', desc: 'Receber seus dados em formato legível por máquina.' },
        { d: 'Opt-out de publicidade', desc: 'Recusar o uso de seus dados para publicidade direcionada.' },
        { d: 'Objeção e restrição', desc: 'Solicitar a interrupção do processamento dos seus dados para determinadas finalidades (aplicável na UE/UK).' },
        { d: 'Retirada de consentimento', desc: 'Retirar o consentimento dado anteriormente, sem afetar o tratamento já realizado.' },
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' as const }}>
          <span style={{ color: '#7c3aed', fontWeight: 'bold', minWidth: '160px' }}>✦ {item.d}:</span>
          <span style={{ color: '#555', flex: 1 }}>{item.desc}</span>
        </div>
      ))}

      <Separador />

      <h2 style={S.secao}>7. Cookies</h2>
      <p style={S.texto}>
        Nosso site utiliza cookies para melhorar a experiência de navegação e exibir publicidade relevante. Você pode gerenciar suas preferências de cookies a qualquer momento nas configurações do seu navegador.
      </p>

      <Separador />

      <h2 style={S.secao}>8. Links de Terceiros</h2>
      <p style={S.texto}>
        Nosso site pode conter links para plataformas de terceiros. Não somos responsáveis pelas políticas de privacidade ou segurança desses sites. Recomendamos que você leia os termos de privacidade de qualquer site que visitar.
      </p>

      <Separador />

      <h2 style={S.secao}>9. Proteção de Dados de Menores</h2>
      <p style={S.texto}>
        Nossos serviços não são destinados a menores de idade e não coletamos intencionalmente dados de crianças. Se você for pai ou responsável e acreditar que seu filho nos forneceu informações, entre em contato para solicitar a exclusão.
      </p>

      <Separador />

      <h2 style={S.secao}>10. Transferências Internacionais</h2>
      <p style={S.texto}>
        Seus dados podem ser transferidos, armazenados e processados fora do país onde você reside. Para transferências fora do Espaço Econômico Europeu ou do Reino Unido, utilizamos mecanismos reconhecidos, como as Cláusulas Contratuais Padrão da Comissão Europeia.
      </p>

      <Separador />

      <h2 style={S.secao}>11. Alterações nesta Política</h2>
      <p style={S.texto}>
        Podemos atualizar esta Política periodicamente para refletir mudanças em nossas práticas ou por razões legais e operacionais. A versão atualizada será publicada nesta página com a nova data de atualização.
      </p>

      <RodapeContato />
    </div>
  );
}
