<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Vehículos</h1>
      <Button label="Nuevo Vehículo" icon="pi pi-plus" @click="abrirFormulario()" />
    </div>

    <div class="card">
      <DataTable
          :value="vehiculos"
          :loading="loading"
          paginator :rows="10"
          striped-rows
          v-model:filters="filters"
          filter-display="row"
          :global-filter-fields="['marca', 'modelo', 'condicion']"
      >
        <template #header>
          <div class="table-header">
            <IconField>
              <InputIcon class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="Buscar..." />
            </IconField>
          </div>
        </template>

        <Column field="id" header="#" style="width:60px" sortable />
        <Column field="marca" header="Marca" sortable />
        <Column field="modelo" header="Modelo" sortable />
        <Column field="anio" header="Año" sortable />
        <Column header="Condición">
          <template #body="{ data }">
            <Tag
                :value="data.condicion"
                :severity="data.condicion === 'nuevo' ? 'success' : 'warn'"
            />
          </template>
        </Column>
        <Column header="Precio base" sortable sort-field="precioBase">
          <template #body="{ data }">
            S/ {{ formatMonto(data.precioBase) }}
          </template>
        </Column>
        <Column header="Acciones" style="width:120px">
          <template #body="{ data }">
            <div class="action-btns">
              <Button icon="pi pi-pencil" text rounded @click="abrirFormulario(data)" />
              <Button icon="pi pi-trash" text rounded severity="danger" @click="confirmarEliminar(data)" />
            </div>
          </template>
        </Column>
        <template #empty>
          <div class="empty-msg">No hay vehículos registrados.</div>
        </template>
      </DataTable>
    </div>

    <Dialog
        v-model:visible="modalVisible"
        :header="editando ? 'Editar Vehículo' : 'Nuevo Vehículo'"
        modal
        style="width: 480px"
    >
      <VehiculoForm
          :vehiculo="vehiculoSeleccionado"
          :loading="guardando"
          @submit="guardarVehiculo"
          @cancel="modalVisible = false"
      />
    </Dialog>

    <ConfirmDialog />
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { vehiculoService } from '@/domains/vehiculos/services/vehiculoService'
import VehiculoForm from '@/domains/vehiculos/components/VehiculoForm.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'
import {FilterMatchMode} from "@primevue/core";

const toast = useToast()
const confirm = useConfirm()

const vehiculos = ref([])
const loading = ref(false)
const guardando = ref(false)
const modalVisible = ref(false)
const editando = ref(false)
const vehiculoSeleccionado = ref(null)

const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } })

onMounted(cargarVehiculos)

async function cargarVehiculos() {
  loading.value = true
  try {
    vehiculos.value = await vehiculoService.listar()
  } finally {
    loading.value = false
  }
}

function abrirFormulario(v = null) {
  vehiculoSeleccionado.value = v
  editando.value = !!v
  modalVisible.value = true
}

async function guardarVehiculo(datos) {
  guardando.value = true
  try {
    if (editando.value) {
      await vehiculoService.actualizar(vehiculoSeleccionado.value.id, datos)
      toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Vehículo actualizado', life: 3000 })
    } else {
      await vehiculoService.crear(datos)
      toast.add({ severity: 'success', summary: 'Creado', detail: 'Vehículo registrado', life: 3000 })
    }
    modalVisible.value = false
    await cargarVehiculos()
  } catch (e) {
    const msg = e.response?.data?.detail || 'Error al guardar'
    toast.add({ severity: 'error', summary: 'Error', detail: msg, life: 4000 })
  } finally {
    guardando.value = false
  }
}

function confirmarEliminar(v) {
  confirm.require({
    message: `¿Eliminar ${v.marca} ${v.modelo} ${v.anio}?`,
    header: 'Confirmar eliminación',
    icon: 'pi pi-trash',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Eliminar',
    acceptClass: 'p-button-danger',
    accept: () => eliminarVehiculo(v.id),
  })
}

async function eliminarVehiculo(id) {
  try {
    await vehiculoService.eliminar(id)
    toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Vehículo eliminado', life: 3000 })
    await cargarVehiculos()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar', life: 4000 })
  }
}

function formatMonto(v) {
  return parseFloat(v).toLocaleString('es-PE', { minimumFractionDigits: 2 })
}
</script>

<style scoped>
.table-header { display: flex; justify-content: flex-end; }
.action-btns { display: flex; gap: 4px; }
.empty-msg { text-align: center; color: #aaa; padding: 24px; }
</style>