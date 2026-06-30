<template>
  <form @submit.prevent="handleSubmit" class="sim-form">

    <!-- Sección 1: Entidades -->
    <fieldset>
      <legend>Datos del crédito</legend>
      <div class="form-grid">
        <div class="field">
          <label>Cliente *</label>
          <Select v-model="form.cliente_id" :options="clientes" option-label="nombreCompleto" option-value="id" placeholder="Seleccionar cliente" fluid filter />
          <small class="error" v-if="errors.cliente_id">{{ errors.cliente_id }}</small>
        </div>
        <div class="field">
          <label>Vehículo *</label>
          <Select v-model="form.vehiculo_id" :options="vehiculos" option-label="descripcion" option-value="id" placeholder="Seleccionar vehículo" fluid filter @change="onVehiculoChange" />
          <small class="error" v-if="errors.vehiculo_id">{{ errors.vehiculo_id }}</small>
        </div>
        <div class="field">
          <label>Banco *</label>
          <Select v-model="form.banco_id" :options="bancos" option-label="nombre_banco" option-value="id" placeholder="Seleccionar banco" fluid />
          <small class="error" v-if="errors.banco_id">{{ errors.banco_id }}</small>
        </div>
        <div class="field">
          <label>Moneda *</label>
          <Select v-model="form.moneda_id" :options="monedas" option-label="nombre_moneda" option-value="id" placeholder="Seleccionar" fluid />
        </div>
      </div>
    </fieldset>

    <!-- Sección 2: Financiamiento -->
    <fieldset>
      <legend>Financiamiento</legend>
      <div class="form-grid">
        <div class="field">
          <label>Precio del vehículo</label>
          <InputNumber :model-value="precioVehiculo" disabled fluid :min-fraction-digits="2" prefix="S/ " />
        </div>
        <div class="field">
          <label>Cuota inicial (S/) *</label>
          <InputNumber v-model="form.cuota_inicial_monto" :min="0" :max-fraction-digits="2" :min-fraction-digits="2" fluid prefix="S/ " />
          <small class="error" v-if="errors.cuota_inicial_monto">{{ errors.cuota_inicial_monto }}</small>
        </div>
        <div class="field">
          <label>Plazo *</label>
          <Select v-model="form.plazo_meses" :options="plazos" option-label="label" option-value="value" placeholder="Seleccionar" fluid />
        </div>
        <div class="field">
          <label>Fecha de inicio *</label>
          <DatePicker v-model="form.fecha_inicio" date-format="yy-mm-dd" placeholder="YYYY-MM-DD" fluid show-icon />
        </div>
      </div>
    </fieldset>

    <!-- Sección 3: Tasa -->
    <fieldset>
      <legend>Tasa de interés</legend>
      <div class="form-grid">
        <div class="field">
          <label>Tipo de tasa *</label>
          <SelectButton v-model="form.tipo_tasa" :options="tiposTasa" />
        </div>
        <div class="field">
          <label>Valor (%) *</label>
          <InputNumber v-model="form.tasa_valor_pct" :min="0" :max="100" :min-fraction-digits="2" :max-fraction-digits="4" fluid suffix="%" />
          <small class="error" v-if="errors.tasa_valor">{{ errors.tasa_valor }}</small>
        </div>
        <div class="field" v-if="form.tipo_tasa === 'TNA'">
          <label>Capitalización *</label>
          <Select v-model="form.capitalizacion_m" :options="capitalizaciones" option-label="label" option-value="value" placeholder="Seleccionar" fluid />
        </div>
      </div>
    </fieldset>

    <!-- Sección 4: Gracia y Balón -->
    <fieldset>
      <legend>Períodos de gracia y Compra Inteligente</legend>
      <div class="form-grid">
        <div class="field">
          <label>Gracia total (meses)</label>
          <InputNumber v-model="form.periodos_gracia_total" :min="0" :max="12" fluid />
        </div>
        <div class="field">
          <label>Gracia parcial (meses)</label>
          <InputNumber v-model="form.periodos_gracia_parcial" :min="0" :max="12" fluid />
        </div>
        <div class="field">
          <label>Cuota balón (%)</label>
          <InputNumber v-model="form.cuota_balon_pct_ui" :min="0" :max="50" :min-fraction-digits="0" :max-fraction-digits="2" fluid suffix="%" />
          <small>0% = sin Compra Inteligente</small>
        </div>
      </div>
    </fieldset>

    <!-- Sección 5: Costos -->
    <fieldset>
      <legend>Seguros y costos</legend>
      <div class="form-grid">
        <div class="field">
          <label>Seguro vehicular (% mensual)</label>
          <InputNumber v-model="form.seguro_vehicular_pct_ui" :min="0" :min-fraction-digits="2" :max-fraction-digits="4" fluid suffix="%" />
        </div>
        <div class="field">
          <label>Seguro desgravamen (% mensual)</label>
          <InputNumber v-model="form.seguro_desgravamen_pct_ui" :min="0" :min-fraction-digits="2" :max-fraction-digits="4" fluid suffix="%" />
        </div>
        <div class="field">
          <label>Portes (S/)</label>
          <InputNumber v-model="form.costo_portes" :min="0" :min-fraction-digits="2" fluid prefix="S/ " />
        </div>
        <div class="field">
          <label>Comisiones (S/)</label>
          <InputNumber v-model="form.costo_comisiones" :min="0" :min-fraction-digits="2" fluid prefix="S/ " />
        </div>
      </div>
    </fieldset>

    <div class="form-actions">
      <Button label="Cancelar" severity="secondary" text @click="$emit('cancel')" type="button" />
      <Button label="Calcular Simulación" icon="pi pi-calculator" type="submit" :loading="loading" />
    </div>

  </form>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { clienteService } from '@/domains/clientes/services/clienteService'
  import { vehiculoService } from '@/domains/vehiculos/services/vehiculoService'
  import { catalogoService } from '@/domains/simulaciones/services/simulacionService'
  import Select from 'primevue/select'
  import SelectButton from 'primevue/selectbutton'
  import InputNumber from 'primevue/inputnumber'
  import DatePicker from 'primevue/datepicker'
  import Button from 'primevue/button'

  const props = defineProps({ loading: { type: Boolean, default: false } })
  const emit = defineEmits(['submit', 'cancel'])

  // ── Datos de catálogo ─────────────────────────────────────────────────────────
  const clientes = ref([])
  const vehiculos = ref([])
  const bancos = ref([])
  const monedas = ref([])

  onMounted(async () => {
    const [c, v, b, m] = await Promise.all([
      clienteService.listar(),
      vehiculoService.listar(),
      catalogoService.listarBancos(),
      catalogoService.listarMonedas(),
    ])
    clientes.value = c
    vehiculos.value = v
    bancos.value = b
    monedas.value = m
  })

  // ── Formulario ────────────────────────────────────────────────────────────────
  const form = ref({
    cliente_id: null,
    vehiculo_id: null,
    banco_id: null,
    moneda_id: null,
    cuota_inicial_monto: 0,
    plazo_meses: 36,
    tipo_tasa: 'TEA',
    tasa_valor_pct: 12.00,
    capitalizacion_m: 12,
    periodos_gracia_total: 0,
    periodos_gracia_parcial: 0,
    cuota_balon_pct_ui: 0,
    seguro_vehicular_pct_ui: 0.50,
    seguro_desgravamen_pct_ui: 0.04,
    costo_portes: 3.50,
    costo_comisiones: 0,
    fecha_inicio: new Date(),
  })

  const errors = ref({})

  const tiposTasa = ['TEA', 'TNA']
  const plazos = [
    { label: '12 meses (1 año)', value: 12 },
    { label: '24 meses (2 años)', value: 24 },
    { label: '36 meses (3 años)', value: 36 },
    { label: '48 meses (4 años)', value: 48 },
    { label: '60 meses (5 años)', value: 60 },
  ]
  const capitalizaciones = [
    { label: 'Diaria (360)', value: 360 },
    { label: 'Mensual (12)', value: 12 },
    { label: 'Trimestral (4)', value: 4 },
    { label: 'Semestral (2)', value: 2 },
    { label: 'Anual (1)', value: 1 },
  ]

  const precioVehiculo = computed(() => {
    const v = vehiculos.value.find(v => v.id === form.value.vehiculo_id)
    return v ? v.precioBase : 0
  })

  function onVehiculoChange() {
    // Sugerir cuota inicial del 20% por defecto
    const precio = precioVehiculo.value
    if (precio > 0) form.value.cuota_inicial_monto = parseFloat((precio * 0.20).toFixed(2))
  }

  function validar() {
    errors.value = {}
    if (!form.value.cliente_id) errors.value.cliente_id = 'Selecciona un cliente'
    if (!form.value.vehiculo_id) errors.value.vehiculo_id = 'Selecciona un vehículo'
    if (!form.value.banco_id) errors.value.banco_id = 'Selecciona un banco'
    if (!form.value.tasa_valor_pct || form.value.tasa_valor_pct <= 0) errors.value.tasa_valor = 'La tasa debe ser mayor a 0'
    if (!form.value.cuota_inicial_monto || form.value.cuota_inicial_monto <= 0)
      errors.value.cuota_inicial_monto = 'La cuota inicial debe ser mayor a 0'
    return Object.keys(errors.value).length === 0
  }

  function handleSubmit() {
    if (!validar()) return

    // Formatear fecha
    const fi = form.value.fecha_inicio
    const fechaStr = fi instanceof Date
        ? fi.toISOString().split('T')[0]
        : fi

    emit('submit', {
      cliente_id: form.value.cliente_id,
      vehiculo_id: form.value.vehiculo_id,
      banco_id: form.value.banco_id,
      moneda_id: form.value.moneda_id || 1,
      cuota_inicial_monto: form.value.cuota_inicial_monto.toString(),
      plazo_meses: form.value.plazo_meses,
      tipo_tasa: form.value.tipo_tasa,
      tasa_valor: (form.value.tasa_valor_pct / 100).toFixed(6),
      capitalizacion_m: form.value.tipo_tasa === 'TNA' ? form.value.capitalizacion_m : null,
      periodos_gracia_total: form.value.periodos_gracia_total || 0,
      periodos_gracia_parcial: form.value.periodos_gracia_parcial || 0,
      cuota_balon_pct: (form.value.cuota_balon_pct_ui / 100).toFixed(4),
      seguro_vehicular_pct: (form.value.seguro_vehicular_pct_ui / 100).toFixed(6),
      seguro_desgravamen_pct: (form.value.seguro_desgravamen_pct_ui / 100).toFixed(6),
      costo_portes: form.value.costo_portes.toString(),
      costo_comisiones: form.value.costo_comisiones.toString(),
      fecha_inicio: fechaStr,
    })
  }
</script>

<style scoped>
.sim-form { display: flex; flex-direction: column; gap: 16px; max-height: 75vh; overflow-y: auto; padding-right: 4px; }

fieldset {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
}

legend {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e3a5f;
  padding: 0 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px; }
.field { display: flex; flex-direction: column; gap: 5px; }
.field label { font-size: 0.82rem; font-weight: 600; color: #555; }
.field small { color: #888; font-size: 0.76rem; }
.error { color: #e53e3e !important; }

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #eee;
  position: sticky;
  bottom: 0;
  background: #fff;
  padding-bottom: 4px;
}
</style>