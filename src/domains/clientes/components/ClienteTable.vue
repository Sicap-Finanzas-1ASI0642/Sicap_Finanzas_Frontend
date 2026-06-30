<template>
  <DataTable
      :value="clientes"
      :loading="loading"
      paginator
      :rows="rows"
      striped-rows
      v-model:filters="filtros"
      :global-filter-fields="['nombre', 'apellido', 'dni', 'email', 'telefono']"
  >
    <template #header>
      <div class="table-header">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="filtros['global'].value" placeholder="Buscar cliente..." />
        </IconField>
        <slot name="header-actions" />
      </div>
    </template>

    <Column field="id" header="#" style="width:60px" sortable />
    <Column header="Nombre completo" sortable sort-field="nombre">
      <template #body="{ data }">
        <div class="cliente-info">
          <span class="cliente-nombre">{{ data.nombre }} {{ data.apellido }}</span>
          <span class="cliente-dni">DNI: {{ data.dni }}</span>
        </div>
      </template>
    </Column>
    <Column field="email" header="Email" />
    <Column field="telefono" header="Teléfono">
      <template #body="{ data }">{{ data.telefono || '—' }}</template>
    </Column>
    <Column header="Ingreso mensual" sortable sort-field="ingresoMensual">
      <template #body="{ data }">
        <span class="monto">S/ {{ formatMonto(data.ingresoMensual) }}</span>
      </template>
    </Column>
    <Column header="Registro">
      <template #body="{ data }">
        {{ formatFecha(data.fechaRegistro) }}
      </template>
    </Column>
    <Column v-if="mostrarAcciones" header="Acciones" style="width:110px">
      <template #body="{ data }">
        <div class="action-btns">
          <Button
              icon="pi pi-pencil"
              text rounded
              v-tooltip="'Editar'"
              @click="$emit('editar', data)"
          />
          <Button
              icon="pi pi-trash"
              text rounded
              severity="danger"
              v-tooltip="'Eliminar'"
              @click="$emit('eliminar', data)"
          />
        </div>
      </template>
    </Column>

    <template #empty>
      <div class="empty-state">
        <i class="pi pi-users empty-icon" />
        <p>No hay clientes registrados.</p>
      </div>
    </template>
  </DataTable>
</template>

<script setup>
  import { ref } from 'vue'
  import { FilterMatchMode } from '@primevue/core'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  import Button from 'primevue/button'
  import InputText from 'primevue/inputtext'
  import IconField from 'primevue/iconfield'
  import InputIcon from 'primevue/inputicon'

  defineProps({
    clientes:        { type: Array,   default: () => [] },
    loading:         { type: Boolean, default: false },
    rows:            { type: Number,  default: 10 },
    mostrarAcciones: { type: Boolean, default: true },
  })

  defineEmits(['editar', 'eliminar'])

  const filtros = ref({  global: { value: null, matchMode: FilterMatchMode.CONTAINS },})
  const formatMonto = (v) =>    parseFloat(v).toLocaleString('es-PE', { minimumFractionDigits: 2 })
  const formatFecha = (f) =>    f ? new Date(f).toLocaleDateString('es-PE') : '—'

</script>

<style scoped>
  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .cliente-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .cliente-nombre { font-weight: 600; font-size: 0.9rem; }
  .cliente-dni    { font-size: 0.75rem; color: #888; }
  .monto          { font-weight: 600; color: #1e3a5f; }
  .action-btns    { display: flex; gap: 4px; }

  .empty-state {
    text-align: center;
    padding: 40px;
    color: #aaa;
  }

  .empty-icon {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 8px;
  }
</style>