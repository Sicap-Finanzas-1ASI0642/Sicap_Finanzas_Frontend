export class Usuario {
    constructor({ id, username, nombre_completo, email, dni, activo }) {
        this.id = id
        this.username = username
        this.nombreCompleto = nombre_completo
        this.email = email
        this.dni = dni
        this.activo = activo
    }
}