export class Cliente {
    constructor({ id, nombre, apellido, dni, email, telefono, ingreso_mensual, fecha_registro }) {
        this.id = id
        this.nombre = nombre
        this.apellido = apellido
        this.dni = dni
        this.email = email
        this.telefono = telefono || ''
        this.ingresoMensual = parseFloat(ingreso_mensual)
        this.fechaRegistro = fecha_registro
    }

    get nombreCompleto() {
        return `${this.nombre} ${this.apellido}`
    }
}