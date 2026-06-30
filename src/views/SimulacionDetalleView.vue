<template>
  <div>
    <div class="page-header">
      <div class="header-left">
        <Button icon="pi pi-arrow-left" text @click="router.push('/simulaciones')" />
        <h1 class="page-title">Simulación #{{ id }}</h1>
      </div>
      <Button label="Exportar PDF" icon="pi pi-file-pdf" severity="danger" @click="exportarPDF" :loading="exportando" />
    </div>

    <div v-if="loading" class="loading-state">
      <ProgressSpinner />
    </div>

    <div v-else-if="sim">

      <!-- Indicadores financieros -->
      <IndicadoresCard :sim="sim" class="mb-6" />

      <!-- Gráfico -->
      <div class="card chart-card">
        <h2 class="section-title">Evolución del saldo y composición de cuota</h2>
        <GraficoCronograma :cronograma="sim.cronograma" />
      </div>

      <!-- Cronograma -->
      <div class="card">
        <h2 class="section-title">Cronograma de pagos</h2>
        <CronogramaTable :cronograma="sim.cronograma" />
      </div>

    </div>

    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { simulacionService } from '@/domains/simulaciones/services/simulacionService'
import GraficoCronograma from '@/domains/simulaciones/components/GraficoCronograma.vue'
import CronogramaTable from '@/domains/simulaciones/components/CronogramaTable.vue'
import IndicadoresCard from '@/domains/simulaciones/components/IndicadoresCard.vue'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import Toast from 'primevue/toast'
import { exportarCronogramaPDF } from '@/domains/simulaciones/services/pdfService'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const id = route.params.id
const sim = ref(null)
const loading = ref(false)
const exportando = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    sim.value = await simulacionService.obtener(id)
  } finally {
    loading.value = false
  }
})

async function exportarPDF() {
  exportando.value = true
  try {
    await exportarCronogramaPDF(sim.value, id)
    toast.add({ severity: 'success', summary: 'PDF generado', detail: 'El archivo se descargó correctamente', life: 3000 })
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo generar el PDF', life: 3000 })
  } finally {
    exportando.value = false
  }
}

const fmt = (v) => parseFloat(v).toLocaleString('es-PE', { minimumFractionDigits: 2 })
const pct = (v) => (parseFloat(v) * 100).toFixed(2) + '%'
const pct4 = (v) => (parseFloat(v) * 100).toFixed(4) + '%'
</script>

<style scoped>
.header-left { display: flex; align-items: center; gap: 8px; }
.loading-state { display: flex; justify-content: center; padding: 80px; }

.indicadores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.ind-card {
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ind-label { font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 1px; }
.ind-value { font-size: 1.2rem; font-weight: 700; color: #2c3e50; }
.ind-value.primary { color: #1e3a5f; }
.ind-value.accent  { color: #e8b84b; }
.ind-value.warning { color: #d97706; }
.ind-value.success { color: #059669; }
.ind-value.danger  { color: #dc2626; }

.section-title { font-size: 1rem; font-weight: 700; color: #1e3a5f; margin-bottom: 16px; }
.chart-card { margin-bottom: 24px; }
</style>