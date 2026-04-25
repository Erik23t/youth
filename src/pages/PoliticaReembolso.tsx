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

export default function PoliticaReembolso() {
  return (
    <div style={estilos.pagina}>
      <h1 style={estilos.titulo}>Devoluções e Reembolsos</h1>
      <p style={estilos.dataAtualizacao}>Última atualização: março de 2026</p>

      <div style={estilos.atencao}>
        ⚠️ ATENÇÃO: Não oferecemos devoluções com frete gratuito. Os custos 
        de envio da devolução são de responsabilidade do cliente, salvo em 
        casos de produto com defeito ou erro no envio da Zylumia.
      </div>

      <h2 style={estilos.secaoTitulo}>1. Direito de Retirada (Lei Europeia)</h2>
      <p style={estilos.texto}>
        De acordo com a Diretiva Europeia 2011/83/UE sobre direitos dos 
        consumidores, você tem o direito de retirada no prazo de 14 dias 
        a partir da data em que recebeu o produto, sem necessidade de 
        indicar qualquer motivo.
      </p>
      <p style={estilos.texto}>
        Para exercer este direito, notifique-nos por e-mail em{' '}
        <a href="mailto:zylumiaa@gmail.com" style={estilos.email}>
          zylumiaa@gmail.com
        </a>{' '}
        antes do término do prazo de 14 dias. Após a notificação, você tem 
        mais 14 dias para devolver fisicamente o produto.
      </p>
      <p style={estilos.texto}>
        O reembolso será processado no mesmo método de pagamento utilizado, 
        em até 14 dias após recebermos a devolução.
      </p>

      <div style={estilos.separador} />

      <h2 style={estilos.secaoTitulo}>2. Nossa Política de Satisfação (180 dias)</h2>
      <div style={estilos.destaque}>
        💜 A Zylumia oferece uma política estendida de satisfação de 180 dias!
      </div>
      <p style={estilos.texto}>
        Se não estiver satisfeita com qualquer produto, você pode solicitar 
        a devolução em até 180 dias após o recebimento, desde que as 
        seguintes condições sejam cumpridas:
      </p>
      <ol style={{ color: '#555', lineHeight: '1.8', fontSize: '15px', paddingLeft: '20px' }}>
        <li>O produto deve estar com todos os componentes originais. A embalagem deve estar como foi originalmente recebida.</li>
        <li>Nenhum dano deve resultar de manuseio descuidado além do uso normal previsto para o produto.</li>
        <li>Produtos de higiene devem estar completamente limpos antes de serem devolvidos.</li>
        <li>O produto deve ser devolvido assim que a devolução for autorizada pela nossa equipe, sem uso adicional após a solicitação.</li>
      </ol>

      <div style={estilos.separador} />

      <h2 style={estilos.secaoTitulo}>3. Como Iniciar uma Devolução</h2>
      {[
        { passo: 'Passo 1', titulo: 'Envie um e-mail para zylumiaa@gmail.com com:', itens: ['Número do pedido', 'Motivo da devolução', 'Lista dos produtos (com fotos se possível)', 'Comprovante de entrega'] },
        { passo: 'Passo 2', titulo: 'Aguarde a autorização', desc: 'Analisaremos sua solicitação e responderemos em até 2 dias úteis com as instruções completas.' },
        { passo: 'Passo 3', titulo: 'Envie o produto com rastreamento', desc: 'Após a autorização, embale o produto com cuidado e envie com serviço de rastreamento.' },
        { passo: 'Passo 4', titulo: 'Reembolso processado', desc: 'Após recebermos e verificarmos o produto, processamos o reembolso em até 14 dias úteis.' },
      ].map((item, i) => (
        <div key={i} style={{ marginBottom: '16px', padding: '16px 20px', background: '#f9f6ff', borderRadius: '8px', borderLeft: '4px solid #7c3aed' }}>
          <div style={{ color: '#7c3aed', fontWeight: 'bold', marginBottom: '4px' }}>{item.passo} — {item.titulo}</div>
          {item.desc && <p style={{ color: '#555', margin: 0 }}>{item.desc}</p>}
          {item.itens && <ul style={{ color: '#555', margin: '8px 0 0', paddingLeft: '20px' }}>{item.itens.map((it, j) => <li key={j}>{it}</li>)}</ul>}
        </div>
      ))}

      <div style={estilos.atencao}>
        ⚠️ IMPORTANTE: Nunca envie sua devolução sem receber primeiro a 
        autorização e o endereço correto de nossa equipe. Devoluções enviadas 
        sem autorização não serão reembolsadas.
      </div>

      <div style={estilos.separador} />

      <h2 style={estilos.secaoTitulo}>4. Prazos de Reembolso</h2>
      <ul style={{ color: '#555', lineHeight: '2', fontSize: '15px', paddingLeft: '20px' }}>
        <li><strong>Cartão de crédito/débito:</strong> até 14 dias úteis após recebermos a devolução.</li>
        <li><strong>PayPal:</strong> até 5 dias úteis após recebermos a devolução.</li>
        <li><strong>Transferência bancária:</strong> até 3 dias úteis após recebermos a devolução.</li>
      </ul>

      <RodapeContato mensagem="Dúvidas sobre devolução ou reembolso? Entre em contato com o número do seu pedido. Respondemos em até 24 horas úteis." />
    </div>
  );
}
