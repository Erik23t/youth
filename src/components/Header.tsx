import React from 'react'
import { User, ShoppingCart, Bell, Menu, X } from 'lucide-react';

interface HeaderProps {
  user: any
  cartCount: number
  msgCount: number}

export default function Header({
  user,
  cartCount,
  msgCount,
  onOpenCart,
  onOpenAuth,
  onLogout,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  return (
    <>
      {/* Top Banner */}
      <div className="bg-black text-white text-[10px] md:text-xs py-2 overflow-hidden whitespace-nowrap flex items-center">
        <div className="animate-marquee inline-block font-medium tracking-wider">
          <span className="mx-6 md:mx-10">⚠️ Estoque Baixo — Garanta o Seu Antes que Acabe</span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="mx-6 md:mx-10">Últimas Unidades Disponíveis — Frete Grátis + Garantia de 1 Ano</span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="mx-6 md:mx-10">⚠️ Estoque Baixo — Garanta o Seu Antes que Acabe</span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="mx-6 md:mx-10">Últimas Unidades Disponíveis — Frete Grátis + Garantia de 1 Ano</span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="mx-6 md:mx-10">⚠️ Estoque Baixo — Garanta o Seu Antes que Acabe</span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="mx-6 md:mx-10">Últimas Unidades Disponíveis — Frete Grátis + Garantia de 1 Ano</span>
          <span className="mx-2 text-gray-400">•</span>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-gray-100 py-4 px-4 md:px-8 flex justify-between items-center sticky top-0 bg-white z-40">
        <div className="flex items-center lg:hidden flex-1">
          <Menu
            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          />
        </div>

        <nav className="hidden lg:flex flex-1 space-x-6 text-[11px] font-semibold text-gray-500 tracking-wider">
          <a href="#lar" className="hover:text-gray-900 transition-colors">LAR</a>
          <a href="#comprar" className="hover:text-gray-900 transition-colors">COMPRAR</a>
          <a href="#depoimentos" className="hover:text-gray-900 transition-colors">DEPOIMENTOS</a>
          <a href="#contato" className="hover:text-gray-900 transition-colors">CONTATO</a>
          <a href="/contato" className="hover:text-gray-900 transition-colors">FALE CONOSCO</a>
          <a href="/acompanhe-seu-pedido" className="hover:text-gray-900 transition-colors">ACOMPANHE SEU PEDIDO</a>
          <a href="/minha-conta" className="hover:text-gray-900 transition-colors">GERENCIAR ASSINATURA</a>
        </nav>

        <div className="text-3xl font-serif font-bold tracking-tighter text-center flex-1 lg:flex-none">Zylumia</div>

        <div className="flex items-center justify-end space-x-5 text-gray-600 flex-1">
          {/* Login/User Icon */}
          {user ? (
            <div className="flex items-center space-x-3">
              <a
                href="/minha-conta"
                className="relative cursor-pointer hover:text-gray-900 transition-colors"
                title={user.email}
              >
                <User className="w-5 h-5" />
              </a>
              <button
                onClick={onLogout}
                className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors hidden md:inline-block"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              aria-label="Fazer login"
              className="relative cursor-pointer hover:text-gray-900 transition-colors text-gray-600"
            >
              <User className="w-5 h-5" />
            </button>
          )}

          {/* Bell Icon */}
          {user && (
            <a
              href="/minha-conta?tab=mensagens"
              className="relative cursor-pointer hover:text-gray-900 transition-colors text-gray-600"
            >
              <Bell className="w-5 h-5" />
              {msgCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#841dc5] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {msgCount > 9 ? '9+' : msgCount}
                </span>
              )}
            </a>
          )}

          {/* Cart Icon */}
          <button
            aria-label="Abrir carrinho"
            className="relative cursor-pointer hover:text-gray-900 transition-colors"
            onClick={onOpenCart}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#841dc5] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="absolute top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <div className="text-2xl font-serif font-bold tracking-tighter">Zylumia</div>
              <X
                className="w-6 h-6 cursor-pointer text-gray-500 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            </div>
            <nav className="flex flex-col p-4 space-y-6 text-sm font-semibold text-gray-700 tracking-wider">
              <a href="#lar" className="hover:text-[#841dc5] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>LAR</a>
              <a href="#comprar" className="hover:text-[#841dc5] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>COMPRAR</a>
              <a href="#depoimentos" className="hover:text-[#841dc5] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>DEPOIMENTOS</a>
              <a href="#contato" className="hover:text-[#841dc5] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>CONTATO</a>
              <a href="/contato" className="hover:text-[#841dc5] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>FALE CONOSCO</a>
              <a href="/acompanhe-seu-pedido" className="hover:text-[#841dc5] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>ACOMPANHE SEU PEDIDO</a>
              <a href="/minha-conta" className="hover:text-[#841dc5] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>GERENCIAR ASSINATURA</a>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
