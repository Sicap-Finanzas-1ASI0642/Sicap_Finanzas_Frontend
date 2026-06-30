import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const fmt = (v) =>
    parseFloat(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const pct = (v) => (parseFloat(v) * 100).toFixed(2) + '%'

export async function exportarCronogramaPDF(sim, id) {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

    const azul = [30, 58, 95]
    const amarillo = [232, 184, 75]
    const gris = [245, 247, 250]

    // ── Encabezado ─────────────────────────────────────────────────────────────
    doc.setFillColor(...azul)
    doc.rect(0, 0, 297, 22, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('SICAP — Simulador de Créditos Automotrices Perú', 14, 10)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Simulación #${id}   |   Fecha: ${new Date().toLocaleDateString('es-PE')}`, 14, 17)

    // ── Indicadores ────────────────────────────────────────────────────────────
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Indicadores financieros', 14, 30)

    const indicadores = [
        ['Monto financiado', `S/ ${fmt(sim.montoFinanciado)}`, 'TEA efectiva', pct(sim.teaEfectiva)],
        ['Cuota ordinaria',  `S/ ${fmt(sim.cuotaOrdinaria)}`, 'TCEA',         pct(sim.tcea)],
        ['Cuota balón',      `S/ ${fmt(sim.cuotaBalonMonto)}`, 'TIR mensual',  pct(sim.tirMensual)],
        ['Total intereses',  `S/ ${fmt(sim.totalIntereses)}`, 'VAN',          `S/ ${fmt(sim.van)}`],
        ['Total seguros',    `S/ ${fmt(sim.totalSeguros)}`,   'Costo total',  `S/ ${fmt(sim.costoTotalCredito)}`],
    ]

    autoTable(doc, {
        startY: 33,
        body: indicadores,
        theme: 'plain',
        styles: { fontSize: 9, cellPadding: 2 },
        columnStyles: {
            0: { fontStyle: 'bold', textColor: azul },
            2: { fontStyle: 'bold', textColor: azul },
        },
        alternateRowStyles: { fillColor: gris },
        margin: { left: 14, right: 14 },
    })

    // ── Cronograma ─────────────────────────────────────────────────────────────
    const startY = doc.lastAutoTable.finalY + 8

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Cronograma de pagos', 14, startY)

    const head = [[
        'N°', 'Vencimiento', 'Tipo', 'Saldo inicial',
        'Interés', 'Amortización', 'Seg. Desgrav.', 'Seg. Vehicular',
        'Portes', 'Cuota total', 'Saldo final',
    ]]

    const body = sim.cronograma.map(f => [
        f.nro_cuota,
        f.fecha_vencimiento || '—',
        f.tipo_periodo,
        `S/ ${fmt(f.saldo_inicial)}`,
        `S/ ${fmt(f.interes)}`,
        `S/ ${fmt(f.amortizacion)}`,
        `S/ ${fmt(f.seguro_desgravamen)}`,
        `S/ ${fmt(f.seguro_vehicular)}`,
        `S/ ${fmt(f.portes)}`,
        `S/ ${fmt(f.cuota_total)}`,
        `S/ ${fmt(f.saldo_final)}`,
    ])

    autoTable(doc, {
        startY: startY + 3,
        head,
        body,
        theme: 'striped',
        headStyles: { fillColor: azul, textColor: 255, fontStyle: 'bold', fontSize: 7.5 },
        bodyStyles: { fontSize: 7.5 },
        alternateRowStyles: { fillColor: gris },
        didParseCell: (data) => {
            if (data.section === 'body') {
                const tipo = sim.cronograma[data.row.index]?.tipo_periodo
                if (tipo === 'GRACIA_T') data.cell.styles.textColor = [185, 28, 28]
                if (tipo === 'GRACIA_P') data.cell.styles.textColor = [161, 98, 7]
                if (tipo === 'BALON')    data.cell.styles.fontStyle = 'bold'
            }
        },
        margin: { left: 14, right: 14 },
    })

    // ── Pie de página ──────────────────────────────────────────────────────────
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150)
        doc.text(`Página ${i} de ${pageCount}`, 280, 205, { align: 'right' })
        doc.text('SICAP — Documento generado automáticamente', 14, 205)
    }

    doc.save(`SICAP_Simulacion_${id}.pdf`)
}