import React from 'react';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function AssinaturaCancelada() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Assinatura Cancelada</h2>
        
        <p className="text-gray-600 mb-8">
          O processo de assinatura foi cancelado. Nenhuma cobrança foi realizada no seu cartão.
          Se você teve algum problema durante o pagamento, por favor, tente novamente.
        </p>
        
        <a 
          href="/"
          className="w-full flex items-center justify-center bg-[#841dc5] hover:bg-[#6a179e] text-white font-bold py-4 px-8 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          TENTAR NOVAMENTE
        </a>
      </div>
    </div>
  );
}
