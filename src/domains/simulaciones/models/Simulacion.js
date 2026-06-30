export class Simulacion {
    constructor(data) {
        this.id = data.id
        this.clienteId = data.cliente_id
        this.vehiculoId = data.vehiculo_id
        this.bancoId = data.banco_id
        this.monedaId = data.moneda_id
        this.montoFinanciado = parseFloat(data.monto_financiado)
        this.cuotaBalonMonto = parseFloat(data.cuota_balon_monto)
        this.teaEfectiva = parseFloat(data.tea_efectiva)
        this.tasaMensual = parseFloat(data.tasa_mensual)
        this.cuotaOrdinaria = parseFloat(data.cuota_ordinaria)
        this.van = parseFloat(data.van)
        this.tirMensual = parseFloat(data.tir_mensual)
        this.tcea = parseFloat(data.tcea)
        this.totalIntereses = parseFloat(data.total_intereses)
        this.totalSeguros = parseFloat(data.total_seguros)
        this.totalPortes = parseFloat(data.total_portes)
        this.costoTotalCredito = parseFloat(data.costo_total_credito)
        this.plazoMeses = data.plazo_meses
        this.fechaInicio = data.fecha_inicio
        this.fechaSimulacion = data.fecha_simulacion
        this.cronograma = data.cronograma || []
    }

    get teaPct()  { return (this.teaEfectiva * 100).toFixed(2) + '%' }
    get tceaPct() { return (this.tcea * 100).toFixed(2) + '%' }
    get tirPct()  { return (this.tirMensual * 100).toFixed(4) + '%' }
}