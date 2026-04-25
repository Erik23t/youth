export default function BonusBoxes() {
  return (
    <>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="border border-[#841dc5] rounded-sm p-3 flex flex-col items-center text-center relative bg-white">
          <span className="absolute -top-2.5 bg-white px-2 text-[10px] text-gray-500 font-medium">LIVRE <span className="line-through">$ 14,95</span></span>
          <div className="w-12 h-12 flex items-center justify-center mb-2 mt-2 text-[#841dc5]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>
          </div>
          <div className="text-[10px] text-gray-700 font-medium leading-tight">O Guia de Beleza Egípcio</div>
        </div>
        <div className="border border-[#841dc5] rounded-sm p-3 flex flex-col items-center text-center relative bg-white">
          <span className="absolute -top-2.5 bg-white px-2 text-[10px] text-gray-500 font-medium">LIVRE <span className="line-through">$ 6,95</span></span>
          <div className="w-12 h-12 flex items-center justify-center mb-2 mt-2 text-[#841dc5]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
          </div>
          <div className="text-[10px] text-gray-700 font-medium leading-tight">Frete grátis</div>
        </div>
        <div className="border border-[#841dc5] rounded-sm p-3 flex flex-col items-center text-center relative bg-white">
          <span className="absolute -top-2.5 bg-white px-2 text-[10px] text-gray-500 font-medium">LIVRE <span className="line-through">$ 19,95</span></span>
          <div className="w-12 h-12 flex items-center justify-center mb-2 mt-2 text-[#841dc5]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>
          </div>
          <div className="text-[10px] text-gray-700 font-medium leading-tight">Presente Misterioso</div>
        </div>
      </div>
      <div className="text-[11px] text-[#841dc5] font-medium mb-8 flex items-center">
        <div className="w-1 h-1 rounded-full bg-[#841dc5] mr-2"></div>
        Brindes grátis nos próximos 5 pedidos!
      </div>
    </>
  )
}
