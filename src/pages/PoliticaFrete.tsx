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
  aviso: { background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px',
    padding: '16px 20px', color: '#92400e', marginBottom: '16px', fontSize: '14px' },
  destaque: { background: '#f3e8ff', border: '1px solid #ede9fe', borderRadius: '8px',
    padding: '16px 20px', color: '#6d28d9', marginBottom: '16px', fontSize: '15px' },
  email: { color: '#7c3aed', textDecoration: 'none', fontWeight: 'bold' },
};

function Separador() { return <div style={S.sep} />; }

function RodapeContato() {
  return (
    <div style={{ background: '#f9f6ff', border: '1px solid #ede9fe', borderRadius: '12px',
      padding: '24px', textAlign: 'center' as const, marginTop: '48px' }}>
      <p style={{ color: '#555', marginBottom: '4px' }}>Dúvidas sobre envio? Informe o número do pedido.</p>
      <a href="mailto:zylumiaa@gmail.com" style={{ color: '#7c3aed', fontWeight: 'bold', fontSize: '16px' }}>
        zylumiaa@gmail.com
      </a>
    </div>
  );
}

export default function PoliticaFrete() {
  return (
    <div style={S.pagina}>
      <h1 style={S.titulo}>Política de Envio</h1>
      <p style={S.data}>Última atualização: agosto de 2025</p>

      <p style={S.intro}>
        Nos esforçamos para processar e entregar seus pedidos com agilidade e transparência. Leia abaixo todos os detalhes sobre prazos, rastreamento e responsabilidades de envio.
      </p>

      <h2 style={S.secao}>1. Processamento do Pedido</h2>
      <p style={S.texto}>
        Os pedidos são normalmente processados em até <strong>1 a 2 dias úteis</strong> (segunda a sexta, exceto feriados). Em períodos de alto volume — como promoções ou feriados — o processamento pode levar até 3 dias úteis.
      </p>
      <p style={S.texto}>
        Você receberá um e-mail de confirmação assim que seu pedido for despachado.
      </p>

      <Separador />

      <h2 style={S.secao}>2. Prazos de Entrega</h2>

      {/* Tabela responsiva */}
      <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px', minWidth: '320px' }}>
          <thead>
            <tr style={{ background: '#7c3aed', color: '#fff' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left' as const, borderRadius: '8px 0 0 0' }}>Região</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' as const, borderRadius: '0 8px 0 0' }}>Prazo Estimado</th>
            </tr>
          </thead>
          <tbody>
            {[
              { r: 'Estados Unidos', p: '2 a 3 dias úteis' },
              { r: 'Reino Unido', p: '1 a 2 dias úteis' },
              { r: 'Restante do Mundo', p: '3 a 10 dias úteis' },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#faf7ff' : '#fff' }}>
                <td style={{ padding: '12px 16px', color: '#555', borderBottom: '1px solid #ede9fe' }}>{row.r}</td>
                <td style={{ padding: '12px 16px', color: '#7c3aed', fontWeight: 'bold', borderBottom: '1px solid #ede9fe' }}>{row.p}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ ...S.texto, fontSize: '13px', color: '#888' }}>
        Os prazos contam a partir do despacho e excluem fins de semana, feriados e possíveis atrasos alfandegários em pedidos internacionais.
      </p>

      <Separador />

      <h2 style={S.secao}>3. Rastreamento do Pedido</h2>
      <p style={S.texto}>
        Assim que seu pedido for despachado, você receberá o código de rastreamento por e-mail. O rastreamento pode levar de 24 a 48 horas para exibir atualizações após o envio.
      </p>
      <div style={S.destaque}>
        📦 Se o rastreamento mostrar "sem informação" após 3 dias úteis, entre em contato com o número do pedido em{' '}
        <a href="mailto:zylumiaa@gmail.com" style={S.email}>zylumiaa@gmail.com</a>.
      </div>

      <Separador />

      <h2 style={S.secao}>4. Alterações e Cancelamentos</h2>
      <p style={S.texto}>
        Devido ao processamento rápido, não é possível garantir alterações ou cancelamentos após a confirmação do pedido. Verifique o endereço e os detalhes antes de concluir a compra.
      </p>
      <p style={S.texto}>
        Se precisar de ajustes, entre em contato imediatamente em{' '}
        <a href="mailto:zylumiaa@gmail.com" style={S.email}>zylumiaa@gmail.com</a>{' '}
        — faremos o melhor possível, desde que o pedido ainda não tenha sido despachado.
      </p>

      <Separador />

      <h2 style={S.secao}>5. Responsabilidade pelo Endereço</h2>
      <p style={S.texto}>Certifique-se de que o endereço de entrega inclua:</p>
      <ul style={S.lista}>
        <li>Nome completo</li>
        <li>Endereço completo (com número do apartamento, se aplicável)</li>
        <li>Cidade, estado/província e CEP/código postal</li>
        <li>Número de telefone para notificações de entrega</li>
      </ul>
      <div style={S.aviso}>
        ⚠️ A Zylumia não se responsabiliza por pacotes enviados a endereços incorretos ou incompletos fornecidos pelo cliente. Custos de reenvio são de responsabilidade do cliente. Erros de nossa parte serão corrigidos sem custo adicional.
      </div>

      <Separador />

      <h2 style={S.secao}>6. Pedidos Internacionais e Alfândega</h2>
      <p style={S.texto}>Para pedidos fora dos Estados Unidos:</p>
      <ul style={S.lista}>
        <li>Taxas alfandegárias, impostos de importação e outros encargos são responsabilidade do destinatário e não estão inclusos no total do pedido.</li>
        <li>Essas taxas são determinadas pelas regulamentações aduaneiras do seu país e estão fora do controle da Zylumia.</li>
        <li>Recomendamos verificar as políticas de importação do seu país antes de realizar o pedido.</li>
        <li>A recusa no pagamento de taxas alfandegárias que resulte na devolução do pacote pode estar sujeita a taxas de reposição.</li>
      </ul>

      <Separador />

      <h2 style={S.secao}>7. Pacotes Perdidos, Roubados ou Danificados</h2>

      <p style={{ ...S.texto, fontWeight: 'bold', color: '#7c3aed', marginBottom: '8px' }}>📦 Pacotes perdidos:</p>
      <ul style={S.lista}>
        <li>Verifique com vizinhos e familiares.</li>
        <li>Confira locais alternativos de entrega (fundo da casa, portaria, mailroom).</li>
        <li>Aguarde 24 a 48 horas — às vezes, pacotes são marcados como entregues prematuramente.</li>
        <li>Contate a transportadora local para mais detalhes.</li>
        <li>Se ainda não recebeu, entre em contato conosco em até 7 dias da data de entrega informada.</li>
      </ul>

      <p style={{ ...S.texto, fontWeight: 'bold', color: '#7c3aed', marginBottom: '8px' }}>🔒 Pacotes roubados:</p>
      <p style={S.texto}>
        A Zylumia não se responsabiliza por pacotes marcados como entregues que sejam furtados. Recomendamos usar endereços seguros, solicitar confirmação de assinatura ou utilizar locais alternativos de retirada.
      </p>

      <p style={{ ...S.texto, fontWeight: 'bold', color: '#7c3aed', marginBottom: '8px' }}>📷 Pacotes danificados:</p>
      <p style={S.texto}>
        Se seu pedido chegar danificado, entre em contato em até 48 horas após a entrega com fotos do dano. Enviaremos um substituto gratuitamente.
      </p>

      <Separador />

      <h2 style={S.secao}>8. Envios Parciais</h2>
      <p style={S.texto}>
        Por razões logísticas, itens do mesmo pedido podem ser enviados separadamente e chegar em datas diferentes. Você receberá informações de rastreamento para cada envio individual. Isso não altera o custo total do seu pedido.
      </p>

      <Separador />

      <h2 style={S.secao}>9. Atrasos na Entrega</h2>
      <p style={S.texto}>Embora nos esforcemos para cumprir todos os prazos, atrasos inesperados podem ocorrer por:</p>
      <ul style={S.lista}>
        <li>Condições climáticas severas</li>
        <li>Atrasos das transportadoras</li>
        <li>Altos volumes de envio (feriados e eventos promocionais)</li>
        <li>Processamento alfandegário (pedidos internacionais)</li>
        <li>Informações de endereço incorretas</li>
      </ul>
      <p style={S.texto}>
        Se seu pedido ultrapassar significativamente o prazo estimado, entre em contato conosco.
      </p>

      <Separador />

      <h2 style={S.secao}>10. Pacotes Não Entregues</h2>
      <p style={S.texto}>
        Se um pacote for devolvido por ser não entregável (endereço incorreto, entrega recusada ou não retirado), entraremos em contato para combinar o reenvio. Taxas adicionais de envio podem ser aplicadas.
      </p>

      <RodapeContato />
    </div>
  );
}
