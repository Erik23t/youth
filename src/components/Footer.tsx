interface FooterProps {
  footerEmail: string
  setFooterEmail: (v: string) => void
  footerLoading: boolean
  footerMessage: { text: string; type: 'success' | 'info' | 'error' } | null
  onNewsletterSubmit: (e: React.FormEvent) => void
}

export default function Footer({
  footerEmail,
  setFooterEmail,
  footerLoading,
  footerMessage,
  onNewsletterSubmit,
}: FooterProps) {
  return (
    <footer id="contato" className="bg-gray-50 border-t border-gray-200 pt-16 pb-8 px-4 md:px-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="text-2xl font-serif font-bold tracking-tighter mb-4 text-gray-900">Zylumia</div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Redefinindo os cuidados com a pele através da ciência e da natureza. Fórmulas limpas, resultados reais.
          </p>
        </div>
        <div>
          <h3 className="text-xs font-bold tracking-wider mb-4 text-gray-900">LINKS RÁPIDOS</h3>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><a href="#" className="hover:text-gray-900 transition-colors">Comprar</a></li>
            <li><a href="#" className="hover:text-gray-900 transition-colors">Nossa História</a></li>
            <li><a href="#" className="hover:text-gray-900 transition-colors">Depoimentos</a></li>
            <li><a href="#" className="hover:text-gray-900 transition-colors">Contato</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-bold tracking-wider mb-4 text-gray-900">SUPORTE</h3>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><a href="/perguntas-frequentes" className="hover:text-gray-900 transition-colors">Perguntas Frequentes</a></li>
            <li><a href="/politica-de-frete" className="hover:text-gray-900 transition-colors">Política de Frete</a></li>
            <li><a href="/politica-de-reembolso" className="hover:text-gray-900 transition-colors">Devoluções e Reembolsos</a></li>
            <li><a href="/acompanhe-seu-pedido" className="hover:text-gray-900 transition-colors">Acompanhe seu Pedido</a></li>
            <li><a href="/contato" className="hover:text-gray-900 transition-colors">Contate-nos</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-bold tracking-wider mb-4 text-gray-900">NEWSLETTER</h3>
          <p className="text-sm text-gray-500 mb-4">Receba 10% de desconto na sua primeira compra.</p>
          <form className="flex flex-col" onSubmit={onNewsletterSubmit}>
            <div className="flex">
              <input
                type="email"
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                placeholder="Seu e-mail"
                required
                className="flex-1 border border-gray-300 p-3 rounded-l-sm focus:outline-none focus:border-gray-900 text-sm bg-white"
              />
              <button
                type="submit"
                disabled={footerLoading}
                className="bg-[#841dc5] disabled:bg-gray-400 text-white px-4 text-sm font-bold rounded-r-sm hover:bg-[#6a179e] transition-colors"
              >
                {footerLoading ? 'Enviando...' : 'ASSINAR'}
              </button>
            </div>
            {footerMessage && (
              <p className={`text-xs mt-2 ${footerMessage.type === 'success' ? 'text-green-600' : footerMessage.type === 'info' ? 'text-blue-600' : 'text-red-600'}`}>
                {footerMessage.text}
              </p>
            )}
          </form>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
        <p>© 2026 Zylumia. Todos os direitos reservados.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="/termos-de-servico" className="hover:text-gray-900 transition-colors">Termos de Serviço</a>
          <a href="/politica-de-privacidade" className="hover:text-gray-900 transition-colors">Política de Privacidade</a>
        </div>
      </div>
    </footer>
  )
}
