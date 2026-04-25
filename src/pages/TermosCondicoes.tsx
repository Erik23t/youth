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

export default function TermosCondicoes() {
  const secoes = [
    {
      titulo: '1. Aceitação dos Termos',
      texto: 'Ao visitar nosso site ou usar nossos serviços, você concorda com estes Termos e Condições e com todas as outras políticas aqui mencionadas, incluindo a Política de Privacidade e a Política de Frete.'
    },
    {
      titulo: '2. Pedidos e Pagamentos',
      texto: 'Ao efetuar uma encomenda na Zylumia, você concorda em pagar o preço indicado no momento da compra. Os pagamentos são processados de forma segura e as encomendas só serão enviadas após a confirmação do pagamento. Aceitamos cartões de crédito e débito, PayPal e outros métodos disponíveis no checkout.'
    },
    {
      titulo: '3. Informações sobre o Produto',
      texto: 'Nos esforçamos para fornecer informações precisas e completas sobre os produtos. As imagens dos produtos são meramente ilustrativas e podem diferir ligeiramente do produto real.'
    },
    {
      titulo: '4. Política de Envio',
      texto: 'Consulte nossa Política de Frete para obter detalhes sobre o tempo de processamento, métodos e custos de envio e entrega.'
    },
    {
      titulo: '5. Devoluções e Reembolsos',
      texto: 'Leia nossa Política de Devoluções e Reembolsos para obter instruções completas. De acordo com a legislação europeia (Diretiva 2011/83/UE), você tem o direito de retirada no prazo de 14 dias após o recebimento do produto.'
    },
    {
      titulo: '6. Propriedade Intelectual',
      texto: 'Todo o conteúdo do site da Zylumia — incluindo textos, imagens, logotipos, design e demais elementos — está protegido por direitos de propriedade intelectual e não pode ser reproduzido, distribuído ou utilizado sem autorização prévia e expressa da Zylumia.'
    },
    {
      titulo: '7. Limitação de Responsabilidade',
      texto: 'A Zylumia não se responsabiliza por danos indiretos, incidentais ou consequenciais resultantes do uso ou incapacidade de usar nossos produtos ou serviços.'
    },
    {
      titulo: '8. Lei Aplicável',
      texto: 'Estes Termos e Condições são regidos pela legislação da União Europeia e do país onde a Zylumia está registada. Qualquer litígio será submetido à jurisdição competente do referido país.'
    },
    {
      titulo: '9. Alterações aos Termos',
      texto: 'A Zylumia reserva-se o direito de modificar estes Termos e Condições a qualquer momento. As alterações entram em vigor imediatamente após a publicação no site.'
    },
  ];

  return (
    <div style={estilos.pagina}>
      <h1 style={estilos.titulo}>Termos e Condições</h1>
      <p style={estilos.dataAtualizacao}>Última atualização: março de 2026</p>
      {secoes.map((s, i) => (
        <div key={i}>
          <h2 style={estilos.secaoTitulo}>{s.titulo}</h2>
          <p style={estilos.texto}>{s.texto}</p>
          {i < secoes.length - 1 && <div style={estilos.separador} />}
        </div>
      ))}
      <RodapeContato mensagem="Dúvidas ou comentários? Obrigada por escolher a Zylumia!" />
    </div>
  );
}
