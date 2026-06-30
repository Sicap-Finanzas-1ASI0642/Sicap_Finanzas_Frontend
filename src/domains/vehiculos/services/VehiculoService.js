import api from "../../../core/http/Api.js";
import { Vehiculo } from '../models/Vehiculo'

export const vehiculoService = {
    async listar() {
        const { data } = await api.get('/vehiculos/')
        return data.map((v) => new Vehiculo(v))
    },

    async obtener(id) {
        const { data } = await api.get(`/vehiculos/${id}`)
        return new Vehiculo(data)
    },

    async crear(payload) {
        const { data } = await api.post('/vehiculos/', payload)
        return new Vehiculo(data)
    },

    async actualizar(id, payload) {
        const { data } = await api.put(`/vehiculos/${id}`, payload)
        return new Vehiculo(data)
    },

    async eliminar(id) {
        await api.delete(`/vehiculos/${id}`)
    },
}