<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Clientes</h1>
      <Button label="Nuevo Cliente" icon="pi pi-plus" @click="abrirFormulario()" />
    </div>

    <div class="card">
      <DataTable
          :value="clientes"
          :loading="loading"
          paginator :rows="10"
          striped-rows
          v-model:filters="filters"
          filter-display="row"
          :global-filter-fields="['nombre', 'apellido', 'dni', 'email']"
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
        <Column header="Nombre completo" sortable sort-field="nombre">
          <template #body="{ data }">
            {{ data.nombre }} {{ data.apellido }}
          </template>
        </Column>
        <Column field="dni" header="DNI" />
        <Column field="email" header="Email" />
        <Column field="telefono" header="Teléfono" />
        <Column header="Ingreso mensual" sortable sort-field="ingresoMensual">
          <template #body="{ data }">
            S/ {{ formatMonto(data.ingresoMensual) }}
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
          <div class="empty-msg">No hay clientes registrados.</div>
        </template>
      </DataTable>
    </div>

    <Dialog
        v-model:visible="modalVisible"
        :header="editando ? 'Editar Cliente' : 'Nuevo Cliente'"
        modal
        style="width: 500px"
    >
      <ClienteForm
          :cliente="clienteSeleccionado"
          :loading="guardando"
          @submit="guardarCliente"
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
import { FilterMatchMode } from '@primevue/core'
import { clienteService } from '@/domains/clientes/services/clienteService'
import ClienteForm from '@/domains/clientes/components/ClienteForm.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'

const toast = useToast()
const confirm = useConfirm()

const clientes = ref([])
const loading = ref(false)
const guardando = ref(false)
const modalVisible = ref(false)
const editando = ref(false)
const clienteSeleccionado = ref(null)

const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } })

onMounted(cargarClientes)

async function cargarClientes() {
  loading.value = true
  try {
    clientes.value = await clienteService.listar()
  } finally {
    loading.value = false
  }
}

function abrirFormulario(cliente = null) {
  clienteSeleccionado.value = cliente
  editando.value = !!cliente
  modalVisible.value = true
}

async function guardarCliente(datos) {
  guardando.value = true
  try {
    if (editando.value) {
      await clienteService.actualizar(clienteSeleccionado.value.id, datos)
      toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Cliente actualizado correctamente', life: 3000 })
    } else {
      await clienteService.crear(datos)
      toast.add({ severity: 'success', summary: 'Creado', detail: 'Cliente registrado correctamente', life: 3000 })
    }
    modalVisible.value = false
    await cargarClientes()
  } catch (e) {
    const msg = e.response?.data?.detail || 'Error al guardar el cliente'
    toast.add({ severity: 'error', summary: 'Error', detail: msg, life: 4000 })
  } finally {
    guardando.value = false
  }
}

function confirmarEliminar(cliente) {
  confirm.require({
    message: `¿Eliminar a ${cliente.nombre} ${cliente.apellido}?`,
    header: 'Confirmar eliminación',
    icon: 'pi pi-trash',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Eliminar',
    acceptClass: 'p-button-danger',
    accept: () => eliminarCliente(cliente.id),
  })
}

async function eliminarCliente(id) {
  try {
    await clienteService.eliminar(id)
    toast.add({ severity: 'success', summary: 'Eliminado', detail: 'Cliente eliminado', life: 3000 })
    await cargarClientes()
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el cliente', life: 4000 })
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