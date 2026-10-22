import axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth.store'

/**
 * Shared HTTP client. Business endpoints stay inside the features,
 * this instance only deals with transport concerns: base URL, auth
 * header and a global 401 handling.
 */
export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 20_000,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const auth = useAuthStore()
      auth.logout()
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      }
    }
    return Promise.reject(error)
  },
)

export default http
