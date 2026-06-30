<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Simulaciones</h1>
      <Button label="Nueva Simulación" icon="pi pi-plus" @click="modalVisible = true" />
    </div>

    <div class="card">
      <DataTable
          :value="simulaciones"
          :loading="loading"
          paginator :rows="10"
          striped-rows
      >
        <Column field="id" header="#" style="width:60px" sortable />
        <Column header="Monto financiado" sortable sort-field="montoFinanciado">
          <template #body="{ data }">S/ {{ fmt(data.montoFinanciado) }}</template>
        </Column>
        <Column header="Plazo">
          <template #body="{ data }">{{ data.plazoMeses }} meses</template>
        </Column>
        <Column header="TEA">
          <template #body="{ data }">{{ pct(data.teaEfectiva) }}</template>
        </Column>
        <Column header="Cuota ordinaria">
          <template #body="{ data }">S/ {{ fmt(data.cuotaOrdinaria) }}</template>
        </Column>
        <Column header="TCEA">
          <template #body="{ data }">{{ pct(data.tcea) }}</template>
        </Column>
        <Column header="Fecha">
          <template #body="{ data }">{{ formatFecha(data.fechaSimulacion) }}</template>
        </Column>
        <Column header="Acciones" style="width:120px">
          <template #body="{ data }">
            <div class="action-btns">
              <Button icon="pi pi-eye" text rounded @click="router.push(`/simulaciones/${data.id}`)" v-tooltip="'Ver detalle'" />
              <Button icon="pi pi-trash" text rounded severity="danger" @click="confirmarEliminar(data)" />
            </div>
          </template>
        </Column>
        <template #empty>
          <div class="empty-msg">No hay simulaciones. Crea una nueva.</div>
        </template>
      </DataTable>
    </div>

    <!-- Modal nueva simulación -->
    <Dialog
        v-model:visible="modalVisible"
        header="Nueva Simulación"
        modal
        style="width: 700px; max-height: 90vh"
        :draggable="false"
    >
      <SimulacionForm
          :loading="guardando"
          @submit="crearSimulacion"
          @cancel="modalVisible = false"
      />
    </Dialog>

    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'
import {simulacionService} from "../domains/simulaciones/services/SimulacionService.js";
import SimulacionForm from "../domains/simulaciones/components/SimulacionForm.vue";

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()

const simulaciones = ref([])
const loading = ref(false)
const guardando = ref(false)
const modalVisible = ref(false)

onMounted(cargar)

async function cargar() {
  loading.value = true
  try { simulaciones.value = await simulacionService.listar() }
  finally { loading.value = false }
}

async function crearSimulacion(payload) {
  guardando.value = true
  try {
    const sim = await simulacionService.crear(payload)
    toast.add({ severity: 'success', summary: 'Simulación creada', detail: 'Redirigiendo al detalle...', life: 2000 })
    modalVisible.value = false
    await cargar()
    setTimeout(() => router.push(`/simulaciones/${sim.id}`), 1500)
  } catch (e) {
    const msg = e.response?.data?.detail || 'Error al crear la simulación'
    toast.add({ severity: 'error', summary: 'Error', detail: msg, life: 5000 })
  } finally {
    guardando.value = false
  }
}

function confirmarEliminar(sim) {
  confirm.require({
    message: `¿Eliminar la simulación #${sim.id}?`,
    header: 'Confirmar eliminación',
    icon: 'pi pi-trash',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Eliminar',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await simulacionService.eliminar(sim.id)
      toast.add({ severity: 'success', summary: 'Eliminada', detail: 'Simulación eliminada', life: 3000 })
      await cargar()
    },
  })
}

const fmt = (v) => parseFloat(v).toLocaleString('es-PE', { minimumFractionDigits: 2 })
const pct = (v) => (parseFloat(v) * 100).toFixed(2) + '%'
const formatFecha = (f) => new Date(f).toLocaleDateString('es-PE')
</script>

<style scoped>
.action-btns { display: flex; gap: 4px; }
.empty-msg { text-align: center; color: #aaa; padding: 24px; }
</style>