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

export default function PoliticaFrete() {
  return (
    <div style={estilos.pagina}>
      <h1 style={estilos.titulo}>Política de Frete</h1>
      <p style={estilos.dataAtualizacao}>Última atualização: março de 2026</p>

      <h2 style={estilos.secaoTitulo}>1. Processamento e Envio</h2>
      <p style={estilos.texto}>
        Na Zylumia, entendemos que você deseja receber seu pedido o mais 
        rápido possível. Nos esforçamos para processar e enviar todos os 
        pedidos em até 24 horas úteis após a confirmação do pagamento.
      </p>
      <p style={estilos.texto}>
        Nosso prazo de entrega é de 5 a 10 dias úteis após o despacho, 
        podendo variar conforme o país de destino e a transportadora selecionada.
      </p>
      <p style={estilos.texto}>
        Pedidos realizados após as 16h ou em fins de semana e feriados serão 
        processados no próximo dia útil.
      </p>

      <div style={estilos.separador} />

      <h2 style={estilos.secaoTitulo}>2. Métodos e Custos de Envio</h2>
      <p style={estilos.texto}>
        Oferecemos opções de envio rastreado em todos os pedidos para a Europa. 
        Os custos de frete são exibidos de forma clara e transparente na 
        finalização da compra — não há cobranças adicionais surpresa.
      </p>
      <ul style={{ color: '#555', lineHeight: '1.8', fontSize: '15px', paddingLeft: '20px' }}>
        <li><strong>Envio Standard (5–10 dias úteis):</strong> custo calculado no checkout por país de destino.</li>
        <li><strong>Envio Expresso (3–5 dias úteis):</strong> disponível para países selecionados, custo no checkout.</li>
        <li><strong>Frete Grátis:</strong> para pedidos acima de €50 em toda a Europa.</li>
      </ul>

      <div style={estilos.separador} />

      <h2 style={estilos.secaoTitulo}>3. Rastreamento da Encomenda</h2>
      <p style={estilos.texto}>
        Assim que seu pedido for despachado, você receberá um código de 
        rastreamento por e-mail. Use a nossa página{' '}
        <a href="/acompanhe-seu-pedido" style={estilos.email}>
          "Acompanhe seu Pedido"
        </a>{' '}
        para consultar o status em tempo real.
      </p>
      <p style={estilos.texto}>
        Se não receber o e-mail de rastreamento em até 48 horas após a 
        confirmação do pedido, verifique a caixa de spam ou entre em contato 
        pelo e-mail{' '}
        <a href="mailto:zylumiaa@gmail.com" style={estilos.email}>
          zylumiaa@gmail.com
        </a>.
      </p>

      <div style={estilos.separador} />

      <h2 style={estilos.secaoTitulo}>4. Endereço de Entrega</h2>
      <p style={estilos.texto}>
        Entregamos no endereço fornecido no momento da finalização da compra. 
        Certifique-se de que o endereço esteja completo e correto antes de 
        confirmar o pedido.
      </p>
      <p style={estilos.texto}>
        A Zylumia não se responsabiliza por atrasos ou não-entregas causados 
        por informações de endereço incorretas fornecidas pelo cliente.
      </p>

      <div style={estilos.separador} />

      <h2 style={estilos.secaoTitulo}>5. Envios Fora da Europa</h2>
      <p style={estilos.texto}>
        Para países fora da União Europeia, as taxas alfandegárias, impostos 
        de importação e prazos de entrega podem variar consideravelmente. 
        O comprador é responsável por eventuais encargos aduaneiros aplicados 
        pelo país de destino.
      </p>
      <p style={estilos.texto}>
        Entre em contato pelo e-mail{' '}
        <a href="mailto:zylumiaa@gmail.com" style={estilos.email}>
          zylumiaa@gmail.com
        </a>{' '}
        para consultar disponibilidade e custo para envios fora da Europa.
      </p>

      <div style={estilos.separador} />

      <h2 style={estilos.secaoTitulo}>6. Atrasos e Situações Excepcionais</h2>
      <p style={estilos.texto}>
        Embora nos esforcemos para cumprir todos os prazos, fatores externos 
        como greves, condições climáticas adversas, feriados locais ou atrasos 
        das transportadoras podem impactar os prazos. Nestes casos, faremos 
        o possível para mantê-la informada.
      </p>

      <RodapeContato mensagem="Tem dúvidas sobre o seu envio? Entre em contato informando o número do seu pedido." />
    </div>
  );
}
