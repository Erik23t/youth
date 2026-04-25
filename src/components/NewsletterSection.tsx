import React from 'react'

interface NewsletterSectionProps {
  email: string
  setEmail: (v: string) => void
  loading: boolean
  message: { text: string; type: 'success' | 'info' | 'error' } | null
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function NewsletterSection({ email, setEmail, loading, message, onSubmit }: NewsletterSectionProps) {
  return (
    <div>
      <h3 className="text-xs font-bold tracking-wider mb-4 text-gray-900">NEWSLETTER</h3>
      <p className="text-sm text-gray-500 mb-4">Receba 10% de desconto na sua primeira compra.</p>
      <form className="flex flex-col" onSubmit={onSubmit}>
        <div className="flex">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail"
            required
            className="flex-1 border border-gray-300 p-3 rounded-l-sm focus:outline-none focus:border-gray-900 text-sm bg-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#841dc5] disabled:bg-gray-400 text-white px-4 text-sm font-bold rounded-r-sm hover:bg-[#6a179e] transition-colors"
          >
            {loading ? '...' : '→'}
          </button>
        </div>
        {message && (
          <p className={`text-xs mt-2 ${message.type === 'success' ? 'text-green-600' : message.type === 'error' ? 'text-red-600' : 'text-blue-600'}`}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  )
}
