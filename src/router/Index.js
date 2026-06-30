import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('./../views/LoginView.vue'),
        meta: { public: true },
    },
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('./../views/DashboardView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/clientes',
        name: 'Clientes',
        component: () => import('./../views/ClientesView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/vehiculos',
        name: 'Vehiculos',
        component: () => import('./../views/VehiculosView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/simulaciones',
        name: 'Simulaciones',
        component: () => import('./../views/SimulacionesView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/simulaciones/:id',
        name: 'SimulacionDetalle',
        component: () => import('./../views/SimulacionDetalleView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/dashboard',
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// ── Guard global: protege rutas que requieren autenticación ───────────────────
router.beforeEach((to) => {
    const token = localStorage.getItem('sicap_token')
    if (to.meta.requiresAuth && !token) {
        return { name: 'Login' }
    }
    if (to.meta.public && token) {
        return { name: 'Dashboard' }
    }
})

export default router