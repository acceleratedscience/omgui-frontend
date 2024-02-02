// import HomeView from '../views/HomeView.vue'
import FileBrowser from '../views/FileBrowser.vue'

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: FileBrowser,
        },
        {
            path: '/module/:moduleName',
            name: 'module',
            props: (route) => ({ moduleName: route.params.moduleName }),
            component: () => import(`../views/ModuleDynamic.vue`),
        },
        {
            path: '/a',
            name: 'module-a',
            component: () => import(/* webpackChunkName: 'module-a' */ '../views/ModuleA.vue'),
        },
        {
            path: '/b',
            name: 'module-b',
            component: () => import(/* webpackChunkName: 'module-b' */ '../views/ModuleB.vue'),
        },
    ],
})

export default router
