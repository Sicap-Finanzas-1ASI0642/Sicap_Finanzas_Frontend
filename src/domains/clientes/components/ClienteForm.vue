<template>
  <form @submit.prevent="handleSubmit" class="form-grid">

    <div class="field">
      <label>Nombre *</label>
      <InputText v-model="form.nombre" placeholder="Nombre" fluid />
      <small class="error" v-if="errors.nombre">{{ errors.nombre }}</small>
    </div>

    <div class="field">
      <label>Apellido *</label>
      <InputText v-model="form.apellido" placeholder="Apellido" fluid />
      <small class="error" v-if="errors.apellido">{{ errors.apellido }}</small>
    </div>

    <div class="field">
      <label>DNI *</label>
      <InputText v-model="form.dni" placeholder="8 dígitos" maxlength="8" fluid />
      <small class="error" v-if="errors.dni">{{ errors.dni }}</small>
    </div>

    <div class="field">
      <label>Email *</label>
      <InputText v-model="form.email" placeholder="correo@ejemplo.com" fluid />
      <small class="error" v-if="errors.email">{{ errors.email }}</small>
    </div>

    <div class="field">
      <label>Teléfono</label>
      <InputText v-model="form.telefono" placeholder="9XXXXXXXX" fluid />
    </div>

    <div class="field">
      <label>Ingreso mensual (S/) *</label>
      <InputNumber
          v-model="form.ingreso_mensual"
          :min="0"
          :min-fraction-digits="2"
          :max-fraction-digits="2"
          fluid
      />
      <small class="error" v-if="errors.ingreso_mensual">{{ errors.ingreso_mensual }}</small>
    </div>

    <div class="form-actions">
      <Button label="Cancelar" severity="secondary" text @click="$emit('cancel')" type="button" />
      <Button :label="cliente ? 'Actualizar' : 'Guardar'" icon="pi pi-save" type="submit" :loading="loading" />
    </div>

  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'

const props = defineProps({
  cliente: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  nombre: '',
  apellido: '',
  dni: '',
  email: '',
  telefono: '',
  ingreso_mensual: 0,
})

const errors = ref({})

// Precarga datos si está editando
watch(() => props.cliente, (c) => {
  if (c) {
    form.value = {
      nombre: c.nombre,
      apellido: c.apellido,
      dni: c.dni,
      email: c.email,
      telefono: c.telefono || '',
      ingreso_mensual: c.ingresoMensual,
    }
  } else {
    form.value = { nombre: '', apellido: '', dni: '', email: '', telefono: '', ingreso_mensual: 0 }
  }
}, { immediate: true })

function validar() {
  errors.value = {}
  if (!String(form.value.nombre).trim()) errors.value.nombre = 'El nombre es requerido'
  if (!String(form.value.apellido).trim()) errors.value.apellido = 'El apellido es requerido'
  if (!/^\d{8}$/.test(form.value.dni)) errors.value.dni = 'El DNI debe tener 8 dígitos'
  if (!String(form.value.email).includes('@')) errors.value.email = 'Email inválido'
  if (!form.value.ingreso_mensual || form.value.ingreso_mensual <= 0)
    errors.value.ingreso_mensual = 'Ingresa un monto válido'
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (!validar()) return
  emit('submit', {
    ...form.value,
    ingreso_mensual: form.value.ingreso_mensual.toString(),
  })
}
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
}

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