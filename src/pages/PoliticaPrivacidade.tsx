import React from 'react';

const s = {
  page:    { maxWidth: '780px', margin: '0 auto', padding: '64px 20px 80px', fontFamily: "'Georgia', serif", color: '#111' },
  title:   { fontSize: 'clamp(28px, 6vw, 42px)', fontWeight: 'bold', marginBottom: '12px', lineHeight: 1.2 },
  updated: { fontSize: '14px', color: '#555', marginBottom: '32px' },
  intro:   { fontSize: '15px', lineHeight: 1.9, color: '#333', marginBottom: '20px' },
  h2:      { fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 'bold', marginTop: '48px', marginBottom: '14px', color: '#111' },
  p:       { fontSize: '15px', lineHeight: 1.9, color: '#333', marginBottom: '16px' },
  ul:      { fontSize: '15px', lineHeight: 2, color: '#333', paddingLeft: '22px', marginBottom: '16px' },
  sep:     { borderTop: '1px solid #e5e7eb', margin: '36px 0' },
  link:    { color: '#7c3aed', textDecoration: 'underline' },
  contact: { marginTop: '56px', paddingTop: '32px', borderTop: '1px solid #e5e7eb', fontSize: '15px', color: '#333' },
};

const Linha = () => <hr style={s.sep} />;

export default function PoliticaPrivacidade() {
  return (
    <div style={s.page}>
      <h1 style={s.title}>Política de Privacidade</h1>
      <p style={s.updated}>Última atualização: 10 de agosto de 2025</p>

      <p style={s.intro}>
        A Zylumia opera esta loja e site para oferecer uma experiência de compra personalizada. Esta Política descreve como coletamos, utilizamos e divulgamos suas informações pessoais quando você visita ou realiza uma compra em nosso site. Ao utilizar nossos serviços, você confirma que leu e compreendeu esta Política de Privacidade.
      </p>

      <h2 style={s.h2}>Informações Pessoais que Coletamos</h2>
      <p style={s.p}>Dependendo de como você interage com nossos serviços, podemos coletar as seguintes categorias de informações pessoais:</p>
      <ul style={s.ul}>
        <li><strong>Dados de contato:</strong> nome, endereço de entrega e faturamento, telefone e e-mail.</li>
        <li><strong>Dados financeiros:</strong> informações de pagamento processadas de forma segura por terceiros certificados.</li>
        <li><strong>Dados de conta:</strong> nome de usuário, senha e preferências.</li>
        <li><strong>Dados de transação:</strong> itens visualizados, adicionados ao carrinho, comprados ou devolvidos.</li>
        <li><strong>Comunicações:</strong> informações fornecidas ao contatar nosso suporte.</li>
        <li><strong>Dados de dispositivo:</strong> navegador, IP e identificadores únicos.</li>
        <li><strong>Dados de uso:</strong> como e quando você navega no site.</li>
      </ul>

      <Linha />

      <h2 style={s.h2}>Fontes das Informações</h2>
      <ul style={s.ul}>
        <li>Diretamente de você ao criar conta, fazer compras ou entrar em contato.</li>
        <li>Automaticamente, via cookies e tecnologias similares.</li>
        <li>De prestadores de serviços que nos ajudam a operar a plataforma.</li>
        <li>De parceiros comerciais e terceiros autorizados.</li>
      </ul>

      <Linha />

      <h2 style={s.h2}>Como Usamos Suas Informações</h2>
      <p style={s.p}><strong>Prestação dos serviços:</strong> processar pagamentos, cumprir pedidos, gerenciar sua conta e criar uma experiência de compra personalizada.</p>
      <p style={s.p}><strong>Marketing e publicidade:</strong> enviar comunicações promocionais por e-mail ou SMS e exibir anúncios com base em suas interações, conforme autorizado.</p>
      <p style={s.p}><strong>Segurança e prevenção de fraudes:</strong> autenticar sua conta, garantir um checkout seguro e detectar atividades suspeitas.</p>
      <p style={s.p}><strong>Comunicação:</strong> responder a solicitações de suporte e manter nosso relacionamento com você.</p>
      <p style={s.p}><strong>Obrigações legais:</strong> cumprir leis aplicáveis e fazer cumprir nossos termos e políticas.</p>

      <Linha />

      <h2 style={s.h2}>Compartilhamento de Informações</h2>
      <p style={s.p}>Podemos compartilhar suas informações nas seguintes circunstâncias:</p>
      <ul style={s.ul}>
        <li>Com prestadores de serviços (processamento de pagamentos, logística, suporte ao cliente).</li>
        <li>Com parceiros de marketing para publicidade personalizada, conforme autorizado.</li>
        <li>Quando você solicitar ou consentir o compartilhamento.</li>
        <li>Para cumprir obrigações legais ou em transações corporativas.</li>
      </ul>
      <p style={s.p}>Seus dados <strong>nunca são vendidos</strong> a terceiros para fins comerciais sem sua autorização expressa.</p>

      <Linha />

      <h2 style={s.h2}>Segurança e Retenção de Dados</h2>
      <p style={s.p}>
        Adotamos medidas técnicas e organizacionais para proteger seus dados. Não armazenamos dados completos de cartão de crédito — todos os pagamentos são processados por gateways criptografados e certificados.
      </p>
      <p style={s.p}>
        O período de retenção varia conforme necessidade de manutenção da conta, prestação dos serviços, cumprimento de obrigações legais e resolução de disputas.
      </p>

      <Linha />

      <h2 style={s.h2}>Seus Direitos</h2>
      <p style={s.p}>Dependendo de onde você reside, você pode exercer os seguintes direitos:</p>
      <ul style={s.ul}>
        <li><strong>Acesso:</strong> solicitar uma cópia das suas informações pessoais.</li>
        <li><strong>Exclusão:</strong> solicitar a exclusão dos seus dados ("direito ao esquecimento").</li>
        <li><strong>Retificação:</strong> corrigir informações incorretas ou incompletas.</li>
        <li><strong>Portabilidade:</strong> receber seus dados em formato legível por máquina.</li>
        <li><strong>Opt-out de publicidade:</strong> recusar o uso de seus dados para publicidade direcionada.</li>
        <li><strong>Objeção e restrição:</strong> solicitar a interrupção do processamento para determinadas finalidades.</li>
        <li><strong>Retirada de consentimento:</strong> retirar consentimento dado anteriormente.</li>
      </ul>

      <Linha />

      <h2 style={s.h2}>Cookies</h2>
      <p style={s.p}>
        Nosso site utiliza cookies para melhorar a experiência de navegação e exibir publicidade relevante. Você pode gerenciar suas preferências de cookies nas configurações do seu navegador a qualquer momento.
      </p>

      <Linha />

      <h2 style={s.h2}>Links de Terceiros</h2>
      <p style={s.p}>
        Nosso site pode conter links para plataformas de terceiros. Não somos responsáveis pelas políticas de privacidade ou segurança desses sites. Recomendamos que você leia os termos de privacidade de qualquer site externo que visitar.
      </p>

      <Linha />

      <h2 style={s.h2}>Dados de Menores</h2>
      <p style={s.p}>
        Nossos serviços não são destinados a menores de idade. Se você é pai ou responsável e acredita que seu filho nos forneceu informações pessoais, entre em contato para solicitar a exclusão imediata dos dados.
      </p>

      <Linha />

      <h2 style={s.h2}>Transferências Internacionais</h2>
      <p style={s.p}>
        Seus dados podem ser transferidos, armazenados e processados fora do país onde você reside. Para transferências fora do Espaço Econômico Europeu, utilizamos mecanismos reconhecidos como as Cláusulas Contratuais Padrão da Comissão Europeia.
      </p>

      <Linha />

      <h2 style={s.h2}>Alterações nesta Política</h2>
      <p style={s.p}>
        Podemos atualizar esta Política periodicamente para refletir mudanças em nossas práticas ou por razões operacionais e legais. A versão atualizada será publicada nesta página com a nova data de atualização.
      </p>

      <div style={s.contact}>
        <p>Dúvidas sobre privacidade? Entre em contato:</p>
        <p><a href="mailto:zylumiaa@gmail.com" style={s.link}>zylumiaa@gmail.com</a></p>
      </div>
    </div>
  );
}
