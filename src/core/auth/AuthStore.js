import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from "../http/Api.js";

export const useAuthStore = defineStore('auth', () => {
    // ── Estado ─────────────────────────────────────────────────────────────────
    const token = ref(localStorage.getItem('sicap_token') || null)
    const usuario = ref((() => {
        try{
            return JSON.parse(localStorage.getItem('sicap_usuario') || 'null')
        }catch {
            return null
        }
    })())

    // ── Getters ────────────────────────────────────────────────────────────────
    const isAuthenticated = computed(() => !!token.value)
    const nombreUsuario = computed(() => usuario.value?.nombre_completo || '')

    // ── Actions ────────────────────────────────────────────────────────────────
    async function login(username, password) {
        const params = new URLSearchParams()
        params.append('username', username)
        params.append('password', password)

        const { data } = await api.post('/auth/token', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })

        token.value = data.access_token
        usuario.value = data.usuario

        localStorage.setItem('sicap_token', data.access_token)
        localStorage.setItem('sicap_usuario', JSON.stringify(data.usuario))
    }

    function logout() {
        token.value = null
        usuario.value = null
        localStorage.removeItem('sicap_token')
        localStorage.removeItem('sicap_usuario')
    }

    return { token, usuario, isAuthenticated, nombreUsuario, login, logout }
})