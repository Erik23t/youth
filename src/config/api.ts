// ✅ FONTE ÚNICA da URL do backend — importe daqui, nunca declare local
export const API = import.meta.env.VITE_API_URL || 'https://zylumia-backend-661137220675.us-central1.run.app'
export const API_URL = API

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('zylumia_token')
  const response = await fetch(`${API}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  })
  return response.json()
}
