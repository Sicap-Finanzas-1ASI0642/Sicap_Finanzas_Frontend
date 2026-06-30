import axios from 'axios'


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { 'Content-Type': 'application/json' },
})

// ── Request interceptor: adjunta el JWT a cada petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('sicap_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// ── Response interceptor: redirige al login si el token expiró
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('sicap_token')
            localStorage.removeItem('sicap_usuario')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api