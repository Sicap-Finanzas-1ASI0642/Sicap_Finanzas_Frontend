<template>
  <div class="dashboard">

    <div class="page-header">
      <h1 class="page-title">Dashboard</h1>
      <span class="welcome">Bienvenido, {{ nombreUsuario }}</span>
    </div>

    <!-- Tarjetas de resumen -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-icon" :style="{ background: stat.color }">
          <i :class="stat.icon" />
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <!-- Accesos rápidos -->
    <div class="quick-actions card">
      <h2 class="section-title">Acciones rápidas</h2>
      <div class="actions-grid">
        <Button
            label="Nueva Simulación"
            icon="pi pi-calculator"
            @click="router.push('/simulaciones')"
            class="action-btn"
        />
        <Button
            label="Registrar Cliente"
            icon="pi pi-user-plus"
            severity="secondary"
            @click="router.push('/clientes')"
            class="action-btn"
        />
        <Button
            label="Registrar Vehículo"
            icon="pi pi-car"
            severity="secondary"
            @click="router.push('/vehiculos')"
            class="action-btn"
        />
      </div>
    </div>

    <!-- Últimas simulaciones -->
    <div class="recent card">
      <h2 class="section-title">Últimas simulaciones</h2>
      <DataTable
          :value="ultimasSimulaciones"
          :loading="loading"
          striped-rows
          size="small"
      >
        <Column field="id" header="#" style="width: 60px" />
        <Column header="Monto Financiado">
          <template #body="{ data }">
            S/ {{ formatMonto(data.monto_financiado) }}
          </template>
        </Column>
        <Column header="Plazo">
          <template #body="{ data }">{{ data.plazo_meses }} meses</template>
        </Column>
        <Column header="TEA">
          <template #body="{ data }">
            {{ (parseFloat(data.tea_efectiva) * 100).toFixed(2) }}%
          </template>
        </Column>
        <Column header="TCEA">
          <template #body="{ data }">
            {{ (parseFloat(data.tcea) * 100).toFixed(2) }}%
          </template>
        </Column>
        <Column header="Fecha">
          <template #body="{ data }">
            {{ formatFecha(data.fecha_simulacion) }}
          </template>
        </Column>
        <Column header="">
          <template #body="{ data }">
            <Button
                icon="pi pi-eye"
                text
                rounded
                @click="router.push(`/simulaciones/${data.id}`)"
            />
          </template>
        </Column>
        <template #empty>
          <div class="empty-msg">No hay simulaciones registradas aún.</div>
        </template>
      </DataTable>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import {useAuthStore} from "../core/auth/AuthStore.js";
import {clienteService} from "../domains/clientes/services/ClienteService.js";
import {vehiculoService} from "../domains/vehiculos/services/VehiculoService.js";
import {simulacionService} from "../domains/simulaciones/services/SimulacionService.js";

const router = useRouter()
const authStore = useAuthStore()
const nombreUsuario = computed(() => authStore.nombreUsuario)

const loading = ref(false)
const ultimasSimulaciones = ref([])
const totalClientes = ref(0)
const totalVehiculos = ref(0)
const totalSimulaciones = ref(0)

const stats = computed(() => [
  { label: 'Clientes',      value: totalClientes.value,     icon: 'pi pi-users',      color: '#3b82f6' },
  { label: 'Vehículos',     value: totalVehiculos.value,    icon: 'pi pi-car',        color: '#10b981' },
  { label: 'Simulaciones',  value: totalSimulaciones.value, icon: 'pi pi-calculator', color: '#e8b84b' },
])

onMounted(async () => {
  loading.value = true
  try {
    const [clientes, vehiculos, simulaciones] = await Promise.all([
      clienteService.listar(),
      vehiculoService.listar(),
      simulacionService.listar(),
    ])
    totalClientes.value = clientes.length
    totalVehiculos.value = vehiculos.length
    totalSimulaciones.value = simulaciones.length
    ultimasSimulaciones.value = simulaciones.slice(0, 5)
  } finally {
    loading.value = false
  }
})

function formatMonto(v) {
  return parseFloat(v).toLocaleString('es-PE', { minimumFractionDigits: 2 })
}

function formatFecha(f) {
  return new Date(f).toLocaleDateString('es-PE')
}
</script>

<style scoped>
.dashboard { max-width: 1100px; }

.welcome {
  color: #666;
  font-size: 0.9rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon i {
  font-size: 1.4rem;
  color: #fff;
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e3a5f;
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #888;
  margin-top: 4px;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 16px;
}

.quick-actions {
  margin-bottom: 24px;
}

.actions-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.recent { margin-bottom: 24px; }

.empty-msg {
  text-align: center;
  color: #aaa;
  padding: 24px;
}
</style>