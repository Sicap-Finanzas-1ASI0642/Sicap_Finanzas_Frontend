import api from "../../../core/http/Api.js";
import { Simulacion } from '../models/Simulacion'

export const simulacionService = {
    async listar() {
        const { data } = await api.get('/simulaciones/')
        return data.map((s) => new Simulacion(s))
    },

    async obtener(id) {
        const { data } = await api.get(`/simulaciones/${id}`)
        return new Simulacion(data)
    },

    async crear(payload) {
        const { data } = await api.post('/simulaciones/', payload)
        return new Simulacion(data)
    },

    async eliminar(id) {
        await api.delete(`/simulaciones/${id}`)
    },
}

export const catalogoService = {
    async listarBancos() {
        const { data } = await api.get('/catalogo/bancos')
        return data
    },

    async listarMonedas() {
        const { data } = await api.get('/catalogo/monedas')
        return data
    },
}