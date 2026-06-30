<template>
  <div :class="['app-wrapper', { 'is-authenticated': isAuthenticated }]">

    <!-- Sidebar de navegación (solo si está autenticado) -->
    <aside v-if="isAuthenticated" class="sidebar">
      <div class="sidebar-logo">
        <span class="logo-text">SICAP</span>
        <span class="logo-sub">Finanzas</span>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="nav-item">
          <i class="pi pi-home" />
          <span>Dashboard</span>
        </router-link>
        <router-link to="/clientes" class="nav-item">
          <i class="pi pi-users" />
          <span>Clientes</span>
        </router-link>
        <router-link to="/vehiculos" class="nav-item">
          <i class="pi pi-car" />
          <span>Vehículos</span>
        </router-link>
        <router-link to="/simulaciones" class="nav-item">
          <i class="pi pi-calculator" />
          <span>Simulaciones</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <i class="pi pi-user" />
          <span>{{ nombreUsuario }}</span>
        </div>
        <Button
            icon="pi pi-sign-out"
            text
            severity="secondary"
            @click="handleLogout"
            v-tooltip.right="'Cerrar sesión'"
        />
      </div>
    </aside>

    <!-- Contenido principal -->
    <main :class="['main-content', { 'full-width': !isAuthenticated }]">
      <router-view />
    </main>

    <!-- Toast global -->
    <Toast position="top-right" />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import {useAuthStore} from "./core/auth/AuthStore.js";

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const nombreUsuario = computed(() => authStore.nombreUsuario)

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style>
/* ── Reset y variables ────────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --sidebar-width: 220px;
  --color-primary: #1e3a5f;
  --color-primary-light: #2d5a8e;
  --color-accent: #e8b84b;
  --color-bg: #f4f6f9;
  --color-text: #2c3e50;
  --color-border: #dee2e6;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.12);
  --radius: 10px;
}

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
}

/* ── Layout ───────────────────────────────────────────────────────────────── */
.app-wrapper {
  display: flex;
  min-height: 100vh;
}

/* ── Sidebar ──────────────────────────────────────────────────────────────── */
.sidebar {
  width: var(--sidebar-width);
  background: var(--color-primary);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 100;
  box-shadow: var(--shadow-md);
}

.sidebar-logo {
  padding: 24px 20px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.logo-text {
  display: block;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-accent);
  letter-spacing: 2px;
}

.logo-sub {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 8px;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.nav-item:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

.nav-item.router-link-active {
  background: var(--color-accent);
  color: var(--color-primary);
  font-weight: 600;
}

.nav-item i { font-size: 1rem; }

.sidebar-footer {
  padding: 16px 12px;
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.7);
  font-size: 0.8rem;
  overflow: hidden;
}

.user-info span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Main content ─────────────────────────────────────────────────────────── */
.main-content {
  margin-left: var(--sidebar-width);
  flex: 1;
  padding: 28px;
  min-height: 100vh;
}

.main-content.full-width {
  margin-left: 0;
  padding: 0;
}

/* ── Utilidades globales ──────────────────────────────────────────────────── */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.card {
  background: #fff;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  padding: 24px;
}
</style>