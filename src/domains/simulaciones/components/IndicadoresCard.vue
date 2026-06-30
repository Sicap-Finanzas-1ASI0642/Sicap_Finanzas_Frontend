<template>
  <div class="indicadores-wrapper">

    <!-- Fila principal: montos grandes -->
    <div class="indicadores-principales">
      <div class="ind-principal">
        <span class="ind-label">Monto financiado</span>
        <span class="ind-valor grande azul">S/ {{ fmt(sim.montoFinanciado) }}</span>
      </div>
      <div class="ind-separador" />
      <div class="ind-principal">
        <span class="ind-label">Cuota ordinaria mensual</span>
        <span class="ind-valor grande verde">S/ {{ fmt(sim.cuotaOrdinaria) }}</span>
      </div>
      <template v-if="sim.cuotaBalonMonto > 0">
        <div class="ind-separador" />
        <div class="ind-principal">
          <span class="ind-label">Cuota balón (última)</span>
          <span class="ind-valor grande amarillo">S/ {{ fmt(sim.cuotaBalonMonto) }}</span>
        </div>
      </template>
    </div>

    <!-- Grid de indicadores secundarios -->
    <div class="indicadores-grid">

      <div class="ind-card" v-for="ind in indicadoresSecundarios" :key="ind.label">
        <div class="ind-icon" :style="{ background: ind.bg }">
          <i :class="ind.icon" />
        </div>
        <div class="ind-data">
          <span class="ind-label">{{ ind.label }}</span>
          <span class="ind-valor" :class="ind.clase">{{ ind.valor }}</span>
          <span class="ind-desc" v-if="ind.desc">{{ ind.desc }}</span>
        </div>
      </div>

    </div>

    <!-- Barra de composición del costo -->
    <div class="composicion-card">
      <h3 class="composicion-title">Composición del costo total</h3>
      <div class="composicion-barra">
        <div
            class="barra-segmento capital"
            :style="{ width: pctCapital + '%' }"
            v-tooltip="`Capital: S/ ${fmt(sim.montoFinanciado)} (${pctCapital}%)`"
        />
        <div
            class="barra-segmento intereses"
            :style="{ width: pctIntereses + '%' }"
            v-tooltip="`Intereses: S/ ${fmt(sim.totalIntereses)} (${pctIntereses}%)`"
        />
        <div
            class="barra-segmento seguros"
            :style="{ width: pctSeguros + '%' }"
            v-tooltip="`Seguros: S/ ${fmt(sim.totalSeguros)} (${pctSeguros}%)`"
        />
        <div
            class="barra-segmento portes"
            :style="{ width: pctPortes + '%' }"
            v-tooltip="`Portes: S/ ${fmt(sim.totalPortes)} (${pctPortes}%)`"
        />
      </div>
      <div class="composicion-leyenda">
        <span class="leyenda-item"><span class="dot capital" /> Capital: S/ {{ fmt(sim.montoFinanciado) }}</span>
        <span class="leyenda-item"><span class="dot intereses" /> Intereses: S/ {{ fmt(sim.totalIntereses) }}</span>
        <span class="leyenda-item"><span class="dot seguros" /> Seguros: S/ {{ fmt(sim.totalSeguros) }}</span>
        <span class="leyenda-item"><span class="dot portes" /> Portes: S/ {{ fmt(sim.totalPortes) }}</span>
      </div>
      <div class="composicion-total">
        Total desembolsado: <strong>S/ {{ fmt(sim.costoTotalCredito) }}</strong>
      </div>
    </div>

  </div>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    sim: { type: Object, required: true },
  })

  const fmt = (v) =>
      parseFloat(v).toLocaleString('es-PE', { minimumFractionDigits: 2 })

  const pct = (v) => (parseFloat(v) * 100).toFixed(2) + '%'
  const pct4 = (v) => (parseFloat(v) * 100).toFixed(4) + '%'

  // Composición del costo total
  const total = computed(() => parseFloat(props.sim.costoTotalCredito) || 1)

  const pctCapital   = computed(() => ((parseFloat(props.sim.montoFinanciado)  / total.value) * 100).toFixed(1))
  const pctIntereses = computed(() => ((parseFloat(props.sim.totalIntereses)   / total.value) * 100).toFixed(1))
  const pctSeguros   = computed(() => ((parseFloat(props.sim.totalSeguros)     / total.value) * 100).toFixed(1))
  const pctPortes    = computed(() => ((parseFloat(props.sim.totalPortes)      / total.value) * 100).toFixed(1))

  const indicadoresSecundarios = computed(() => [
    {
      label: 'TEA',
      valor: pct(props.sim.teaEfectiva),
      desc: 'Tasa Efectiva Anual',
      icon: 'pi pi-percentage',
      bg: '#dbeafe',
      clase: 'azul',
    },
    {
      label: 'TCEA',
      valor: pct(props.sim.tcea),
      desc: 'Incluye seguros y portes',
      icon: 'pi pi-chart-line',
      bg: '#fef3c7',
      clase: 'amarillo',
    },
    {
      label: 'TIR mensual',
      valor: pct4(props.sim.tirMensual),
      desc: 'Tasa Interna de Retorno',
      icon: 'pi pi-arrow-up-right',
      bg: '#d1fae5',
      clase: 'verde',
    },
    {
      label: 'VAN',
      valor: `S/ ${fmt(props.sim.van)}`,
      desc: props.sim.van >= 0 ? 'Valor positivo' : 'Valor negativo',
      icon: 'pi pi-wallet',
      bg: parseFloat(props.sim.van) >= 0 ? '#d1fae5' : '#fee2e2',
      clase: parseFloat(props.sim.van) >= 0 ? 'verde' : 'rojo',
    },
    {
      label: 'Total intereses',
      valor: `S/ ${fmt(props.sim.totalIntereses)}`,
      desc: 'Suma de intereses pagados',
      icon: 'pi pi-dollar',
      bg: '#fce7f3',
      clase: 'rojo',
    },
    {
      label: 'Plazo',
      valor: `${props.sim.plazoMeses} meses`,
      desc: `${(props.sim.plazoMeses / 12).toFixed(0)} años`,
      icon: 'pi pi-calendar',
      bg: '#ede9fe',
      clase: 'morado',
    },
  ])
</script>

<style scoped>
  .indicadores-wrapper { display: flex; flex-direction: column; gap: 20px; }

  /* ── Principales ──────────────────────────────────────────────────────────── */
  .indicadores-principales {
    background: #fff;
    border-radius: 12px;
    padding: 24px 32px;
    display: flex;
    align-items: center;
    gap: 32px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    flex-wrap: wrap;
  }

  .ind-principal { display: flex; flex-direction: column; gap: 4px; }
  .ind-separador { width: 1px; height: 48px; background: #e2e8f0; }

  /* ── Grid secundario ──────────────────────────────────────────────────────── */
  .indicadores-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }

  .ind-card {
    background: #fff;
    border-radius: 10px;
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  .ind-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .ind-icon i { font-size: 1.1rem; color: #1e3a5f; }

  .ind-data { display: flex; flex-direction: column; gap: 2px; }

  /* ── Labels y valores ─────────────────────────────────────────────────────── */
  .ind-label {
    font-size: 0.72rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .ind-valor { font-size: 1rem; font-weight: 700; }
  .ind-valor.grande { font-size: 1.6rem; }

  .ind-desc { font-size: 0.72rem; color: #aaa; }

  .ind-valor.azul    { color: #1e3a5f; }
  .ind-valor.verde   { color: #059669; }
  .ind-valor.amarillo{ color: #d97706; }
  .ind-valor.rojo    { color: #dc2626; }
  .ind-valor.morado  { color: #7c3aed; }

  /* ── Composición ──────────────────────────────────────────────────────────── */
  .composicion-card {
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  .composicion-title {
    font-size: 0.85rem;
    font-weight: 700;
    color: #1e3a5f;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .composicion-barra {
    display: flex;
    height: 20px;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .barra-segmento { height: 100%; transition: width 0.5s; cursor: help; }
  .barra-segmento.capital   { background: #1e3a5f; }
  .barra-segmento.intereses { background: #e8b84b; }
  .barra-segmento.seguros   { background: #94a3b8; }
  .barra-segmento.portes    { background: #c4b5fd; }

  .composicion-leyenda {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }

  .leyenda-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: #555;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
  }

  .dot.capital   { background: #1e3a5f; }
  .dot.intereses { background: #e8b84b; }
  .dot.seguros   { background: #94a3b8; }
  .dot.portes    { background: #c4b5fd; }

  .composicion-total {
    font-size: 0.85rem;
    color: #444;
    padding-top: 8px;
    border-top: 1px solid #f1f5f9;
  }
</style>