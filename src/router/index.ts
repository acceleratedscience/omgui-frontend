// Modules
import { createRouter, createWebHistory } from 'vue-router'

// Stores
import { useMainStore } from '@/stores/main'

// Components
import HomeView from '../views/HomeView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/filebrowser',
        name: 'filebrowser',
        component: () => import(/* webpackChunkName: 'filebrowser' */ `../views/FileBrowser.vue`),
    },
    {
        path: '/molviewer',
        name: 'molviewer',
        component: () => import(/* webpackChunkName: 'molviewer' */ '../views/MolViewer.vue'),
    },
    {
        path: '/module-a',
        name: 'module-a',
        component: () => import(/* webpackChunkName: 'module-a' */ '../views/ModuleA.vue'),
    },
    {
        path: '/module-b',
        // path: '/:path(headless)?/module-b',
        name: 'module-b',
        component: () => import(/* webpackChunkName: 'module-b' */ '../views/ModuleB.vue'),
    },
    {
        path: '/svg/:filename',
        name: 'svg',
        props: true,
        component: () => import(/* webpackChunkName: 'svg' */ '../components/SvgServe.vue'),
    },
    {
        path: '/kitchen-sink',
        name: 'kitchen-sink',
        component: () =>
            import(/* webpackChunkName: 'kitchen-sink' */ '../components/KitchenSink.vue'),
    },
]

// Duplicate each route with a '/headless' prefix and a 'headless' meta field
const headlessRoutes = routes.map((route) => ({
    ...route,
    path: `/headless${route.path}`,
    name: `headless-${route.name}`,
    meta: { headless: true },
}))

// Create router.
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...routes, ...headlessRoutes],
})

// When in headless mode, redirect to
// the headless version of the next route.
router.beforeEach((to, from, next) => {
    const mainStore = useMainStore()
    const exitHeadless = from.path.replace(/^\/headless/, '') == to.path
    if (!mainStore.isHeadless() && !exitHeadless && (from.meta.headless || to.meta.headless)) {
        mainStore.setHeadless()
    }
    if (!exitHeadless && from.meta.headless && !to.meta.headless) {
        next({ path: `/headless${to.path}`, replace: true })
    } else {
        next()
    }
})

export default router
