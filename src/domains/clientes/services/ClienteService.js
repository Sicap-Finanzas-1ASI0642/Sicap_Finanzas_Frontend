import api from "../../../core/http/Api.js";
import { Cliente } from '../models/Cliente'

export const clienteService = {
    async listar() {
        const { data } = await api.get('/clientes/')
        return data.map((c) => new Cliente(c))
    },

    async obtener(id) {
        const { data } = await api.get(`/clientes/${id}`)
        return new Cliente(data)
    },

    async crear(payload) {
        const { data } = await api.post('/clientes/', payload)
        return new Cliente(data)
    },

    async actualizar(id, payload) {
        const { data } = await api.put(`/clientes/${id}`, payload)
        return new Cliente(data)
    },

    async eliminar(id) {
        await api.delete(`/clientes/${id}`)
    },
}