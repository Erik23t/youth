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

export default function PoliticaShipping() {
  return (
    <div style={s.page}>
      <h1 style={s.title}>Shipping Policy</h1>
      <p style={s.updated}>Last updated: agosto de 2025</p>

      <p style={s.intro}>
        Nos esforçamos para processar e entregar seus pedidos com agilidade e total transparência. Leia abaixo todos os detalhes sobre prazos, rastreamento e responsabilidades de envio.
      </p>

      <h2 style={s.h2}>Processamento do Pedido</h2>
      <p style={s.p}>
        Os pedidos são normalmente processados em <strong>1 a 2 dias úteis</strong> (segunda a sexta, exceto feriados). Em períodos de alto volume — como promoções ou feriados — o processamento pode levar até 3 dias úteis. Você receberá um e-mail de confirmação assim que seu pedido for despachado.
      </p>

      <Linha />

      <h2 style={s.h2}>Prazos de Entrega</h2>
      <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px', minWidth: '300px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #111' }}>
              <th style={{ textAlign: 'left' as const, padding: '10px 0', color: '#111' }}>Região</th>
              <th style={{ textAlign: 'left' as const, padding: '10px 0', color: '#111' }}>Prazo Estimado</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Estados Unidos', '2 a 3 dias úteis'],
              ['Reino Unido', '1 a 2 dias úteis'],
              ['Restante do Mundo', '3 a 10 dias úteis'],
            ].map(([r, p], i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px 0', color: '#333' }}>{r}</td>
                <td style={{ padding: '12px 0', color: '#333' }}>{p}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ ...s.p, color: '#555', fontSize: '14px' }}>
        Os prazos contam a partir do despacho e excluem fins de semana, feriados e possíveis atrasos alfandegários em pedidos internacionais.
      </p>

      <Linha />

      <h2 style={s.h2}>Tracking do Pedido</h2>
      <p style={s.p}>
        Assim que seu pedido for despachado, você receberá o código de rastreamento por e-mail. O rastreamento pode levar de 24 a 48 horas para exibir atualizações após o envio.
      </p>
      <p style={s.p}>
        Se o rastreamento mostrar "sem informação" após 3 dias úteis, entre em contato em <a href="mailto:zylumiaa@gmail.com" style={s.link}>zylumiaa@gmail.com</a> com o número do seu pedido.
      </p>

      <Linha />

      <h2 style={s.h2}>Alterações e Cancelamentos</h2>
      <p style={s.p}>
        Devido ao processamento rápido, não é possível garantir alterações ou cancelamentos após a confirmação do pedido. Verifique todos os detalhes antes de concluir a compra. Se precisar de ajustes, entre em contato imediatamente em <a href="mailto:zylumiaa@gmail.com" style={s.link}>zylumiaa@gmail.com</a>.
      </p>

      <Linha />

      <h2 style={s.h2}>Responsabilidade pelo Endereço</h2>
      <p style={s.p}>Certifique-se de que o endereço de entrega inclua:</p>
      <ul style={s.ul}>
        <li>Nome completo</li>
        <li>Endereço completo (com número do apartamento, se aplicável)</li>
        <li>Cidade, estado/província e CEP/código postal</li>
        <li>Número de telefone para notificações de entrega</li>
      </ul>
      <p style={s.p}>
        A Zylumia não se responsabiliza por pacotes enviados a endereços incorretos ou incompletos fornecidos pelo cliente. Se cometermos um erro no envio, corrigiremos sem custo adicional.
      </p>

      <Linha />

      <h2 style={s.h2}>Pedidos Internacionais e Alfândega</h2>
      <ul style={s.ul}>
        <li>Taxas alfandegárias, impostos de importação e outros encargos são responsabilidade do destinatário e não estão inclusos no total do pedido.</li>
        <li>Recomendamos verificar as políticas de importação do seu país antes de realizar o pedido.</li>
        <li>A recusa no pagamento de taxas alfandegárias que resulte na devolução do pacote pode estar sujeita a taxas de reposição.</li>
      </ul>

      <Linha />

      <h2 style={s.h2}>Pacotes Perdidos, Roubados ou Danificados</h2>
      <p style={s.p}><strong>Pacotes perdidos:</strong> se o rastreamento indicar "entregue" mas você não recebeu, verifique com vizinhos e locais alternativos de entrega, aguarde 24 a 48 horas e contate a transportadora. Se ainda não recebeu, entre em contato conosco em até 7 dias da data informada.</p>
      <p style={s.p}><strong>Pacotes roubados:</strong> a Zylumia não se responsabiliza por pacotes marcados como entregues que sejam furtados. Recomendamos usar endereços seguros ou solicitar confirmação de assinatura.</p>
      <p style={s.p}><strong>Pacotes danificados:</strong> se seu pedido chegar com danos, entre em contato em até 48 horas com fotos. Enviaremos um substituto gratuitamente.</p>

      <Linha />

      <h2 style={s.h2}>Envios Parciais</h2>
      <p style={s.p}>
        Itens do mesmo pedido podem ser enviados separadamente e chegar em datas diferentes. Você receberá informações de rastreamento para cada envio. Isso não altera o custo total do pedido.
      </p>

      <Linha />

      <h2 style={s.h2}>Atrasos na Entrega</h2>
      <p style={s.p}>Atrasos podem ocorrer por condições climáticas severas, atrasos das transportadoras, alto volume de envios (feriados), processamento alfandegário ou informações de endereço incorretas. Se seu pedido ultrapassar significativamente o prazo estimado, entre em contato conosco.</p>

      <Linha />

      <h2 style={s.h2}>Pacotes Não Entregues</h2>
      <p style={s.p}>
        Se um pacote for devolvido por ser não entregável (endereço incorreto, entrega recusada ou não retirado), entraremos em contato para combinar o reenvio. Taxas adicionais de envio podem ser aplicadas.
      </p>

      <div style={s.contact}>
        <p>Dúvidas sobre envio? Inclua o número do pedido ao nos contatar:</p>
        <p><a href="mailto:zylumiaa@gmail.com" style={s.link}>zylumiaa@gmail.com</a></p>
      </div>
    </div>
  );
}
