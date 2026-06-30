<template>
  <DataTable
      :value="cronograma"
      paginator :rows="12"
      striped-rows
      size="small"
      scroll-height="500px"
      scrollable
      :row-class="rowClass"
  >
    <Column field="nro_cuota" header="N°" style="width:55px" />
    <Column field="fecha_vencimiento" header="Vencimiento" style="width:110px">
      <template #body="{ data }">{{ data.fecha_vencimiento || '—' }}</template>
    </Column>
    <Column header="Tipo" style="width:90px">
      <template #body="{ data }">
        <Tag :value="labelTipo(data.tipo_periodo)" :severity="severityTipo(data.tipo_periodo)" />
      </template>
    </Column>
    <Column header="Saldo inicial">
      <template #body="{ data }">S/ {{ fmt(data.saldo_inicial) }}</template>
    </Column>
    <Column header="Interés">
      <template #body="{ data }">S/ {{ fmt(data.interes) }}</template>
    </Column>
    <Column header="Amortización">
      <template #body="{ data }">S/ {{ fmt(data.amortizacion) }}</template>
    </Column>
    <Column header="Seg. Desgrav.">
      <template #body="{ data }">S/ {{ fmt(data.seguro_desgravamen) }}</template>
    </Column>
    <Column header="Seg. Vehicular">
      <template #body="{ data }">S/ {{ fmt(data.seguro_vehicular) }}</template>
    </Column>
    <Column header="Portes">
      <template #body="{ data }">S/ {{ fmt(data.portes) }}</template>
    </Column>
    <Column header="Cuota total">
      <template #body="{ data }">
        <strong>S/ {{ fmt(data.cuota_total) }}</strong>
      </template>
    </Column>
    <Column header="Saldo final">
      <template #body="{ data }">S/ {{ fmt(data.saldo_final) }}</template>
    </Column>
  </DataTable>
</template>

<script setup>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'

defineProps({ cronograma: { type: Array, default: () => [] } })

const fmt = (v) => parseFloat(v).toLocaleString('es-PE', { minimumFractionDigits: 2 })

function labelTipo(t) {
  return { GRACIA_T: 'Gracia T', GRACIA_P: 'Gracia P', NORMAL: 'Normal', BALON: 'Balón' }[t] || t
}

function severityTipo(t) {
  return { GRACIA_T: 'danger', GRACIA_P: 'warn', NORMAL: 'success', BALON: 'info' }[t] || 'secondary'
}

function rowClass(data) {
  return {
    'row-gracia-total':   data.tipo_periodo === 'GRACIA_T',
    'row-gracia-parcial': data.tipo_periodo === 'GRACIA_P',
    'row-balon':          data.tipo_periodo === 'BALON',
  }
}
</script>

<style>
.row-gracia-total  td { background: #fff5f5 !important; }
.row-gracia-parcial td { background: #fffbeb !important; }
.row-balon td { background: #eff6ff !important; font-weight: 600; }
</style>