export class Vehiculo {
    constructor({ id, marca, modelo, anio, condicion, precio_base, fecha_registro }) {
        this.id = id
        this.marca = marca
        this.modelo = modelo
        this.anio = anio
        this.condicion = condicion
        this.precioBase = parseFloat(precio_base)
        this.fechaRegistro = fecha_registro
    }

    get descripcion() {
        return `${this.marca} ${this.modelo} ${this.anio}`
    }
}