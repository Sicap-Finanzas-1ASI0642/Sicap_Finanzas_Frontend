<template>
  <div class="login-page">
    <div class="login-card">

      <!-- Logo -->
      <div class="login-logo">
        <span class="logo-text">SICAP</span>
        <span class="logo-sub">Sistema de Créditos Automotrices Perú</span>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="field">
          <label>Usuario</label>
          <InputText
              v-model="form.username"
              placeholder="Ingresa tu usuario"
              :disabled="loading"
              fluid
          />
        </div>

        <div class="field">
          <label>Contraseña</label>
          <Password
              v-model="form.password"
              placeholder="Ingresa tu contraseña"
              :feedback="false"
              toggleMask
              :disabled="loading"
              fluid
          />
        </div>

        <Message v-if="error" severity="error" :closable="false">
          {{ error }}
        </Message>

        <Button
            type="submit"
            label="Ingresar"
            icon="pi pi-sign-in"
            :loading="loading"
            fluid
            class="login-btn"
        />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import {useAuthStore} from "../core/auth/AuthStore.js";

const router = /** @type {import('vue-router').Router} */ (useRouter())
const authStore = useAuthStore()

const form = ref({ username: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!form.value.username || !form.value.password) {
    error.value = 'Completa todos los campos'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await authStore.login(form.value.username, form.value.password)
    router.push('/dashboard')
  } catch {
    error.value = 'Usuario o contraseña incorrectos'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 60%, #1e3a5f 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  background: #fff;
  border-radius: 16px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.login-logo {
  text-align: center;
  margin-bottom: 36px;
}

.logo-text {
  display: block;
  font-size: 2.8rem;
  font-weight: 900;
  color: #1e3a5f;
  letter-spacing: 4px;
}

.logo-sub {
  display: block;
  font-size: 0.75rem;
  color: #888;
  margin-top: 4px;
  letter-spacing: 1px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.login-btn {
  margin-top: 8px;
  background: #1e3a5f !important;
  border-color: #1e3a5f !important;
  padding: 12px !important;
  font-size: 1rem !important;
}
</style>