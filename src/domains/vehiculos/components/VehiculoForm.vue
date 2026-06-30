<template>
  <form @submit.prevent="handleSubmit" class="form-grid">

    <div class="field">
      <label>Marca *</label>
      <InputText v-model="form.marca" placeholder="Toyota, Hyundai..." fluid />
      <small class="error" v-if="errors.marca">{{ errors.marca }}</small>
    </div>

    <div class="field">
      <label>Modelo *</label>
      <InputText v-model="form.modelo" placeholder="Corolla, Tucson..." fluid />
      <small class="error" v-if="errors.modelo">{{ errors.modelo }}</small>
    </div>

    <div class="field">
      <label>Año *</label>
      <InputNumber v-model="form.anio" :min="2000" :max="2027" :use-grouping="false" fluid />
      <small class="error" v-if="errors.anio">{{ errors.anio }}</small>
    </div>

    <div class="field">
      <label>Condición *</label>
      <Select
          v-model="form.condicion"
          :options="condiciones"
          option-label="label"
          option-value="value"
          placeholder="Seleccionar"
          fluid
      />
      <small class="error" v-if="errors.condicion">{{ errors.condicion }}</small>
    </div>

    <div class="field full-width">
      <label>Precio base (S/) *</label>
      <InputNumber
          v-model="form.precio_base"
          :min="0"
          :min-fraction-digits="2"
          :max-fraction-digits="2"
          fluid
      />
      <small class="error" v-if="errors.precio_base">{{ errors.precio_base }}</small>
    </div>

    <div class="form-actions">
      <Button label="Cancelar" severity="secondary" text @click="$emit('cancel')" type="button" />
      <Button :label="vehiculo ? 'Actualizar' : 'Guardar'" icon="pi pi-save" type="submit" :loading="loading" />
    </div>

  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import Button from 'primevue/button'

const props = defineProps({
  vehiculo: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const condiciones = [
  { label: 'Nuevo', value: 'nuevo' },
  { label: 'Seminuevo', value: 'seminuevo' },
]

const form = ref({ marca: '', modelo: '', anio: new Date().getFullYear(), condicion: 'nuevo', precio_base: 0 })
const errors = ref({})

watch(() => props.vehiculo, (v) => {
  if (v) {
    form.value = {
      marca: v.marca,
      modelo: v.modelo,
      anio: v.anio,
      condicion: v.condicion,
      precio_base: v.precioBase,
    }
  } else {
    form.value = { marca: '', modelo: '', anio: new Date().getFullYear(), condicion: 'nuevo', precio_base: 0 }
  }
}, { immediate: true })

function validar() {
  errors.value = {}
  if (!String(form.value.marca).trim()) errors.value.marca = 'La marca es requerida'
  if (!String(form.value.modelo).trim()) errors.value.modelo = 'El modelo es requerido'
  if (!form.value.anio) errors.value.anio = 'El año es requerido'
  if (!form.value.condicion) errors.value.condicion = 'La condición es requerida'
  if (!form.value.precio_base || form.value.precio_base <= 0)
    errors.value.precio_base = 'Ingresa un precio válido'
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (!validar()) return
  emit('submit', {
    ...form.value,
    precio_base: form.value.precio_base.toString(),
  })
}
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 0.85rem; font-weight: 600; color: #444; }
.full-width { grid-column: 1 / -1; }
.error { color: #e53e3e; font-size: 0.78rem; }

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}
</style>