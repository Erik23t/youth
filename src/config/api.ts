export const API_URL = import.meta.env.VITE_API_URL || 'https://zylumia-backend-kmbrxbidkq-uc.a.run.app'

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('zylumia_token')
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  })
  return response.json()
}
